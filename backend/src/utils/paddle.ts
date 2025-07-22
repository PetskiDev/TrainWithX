import {
  CreateDiscountRequestBody,
  CreatePriceRequestBody,
  CreateProductRequestBody,
  CreateTransactionRequestBody,
  Discount,
  Environment,
  LogLevel,
  Paddle,
  Price,
  Product,
  Transaction,
  WebhooksValidator,
} from '@paddle/paddle-node-sdk';
import { Plan } from '@prisma/client';
import { CreatePlanDto } from '@shared/types/plan';
import { AppError } from '@src/utils/AppError';
import { env } from '@src/utils/env';

interface CreatePaddleInput {
  name: string;
  inputPrice: number; // e.g. 15.99
  description: string;
}

export const paddle = new Paddle(env.PADDLE_API_KEY, {
  environment:
    env.PADDLE_SANDBOX === 'true'
      ? Environment.sandbox
      : Environment.production,
  logLevel: LogLevel.error,
});

export async function createNewPaddleDiscount(
  amount: string,
  description: string
): Promise<Discount | undefined> {
  try {
    const discount = await paddle.discounts.create({
      amount,
      type: 'flat',
      description,
      currencyCode: 'USD',
    });
    return discount;
  } catch (e) {
    console.error('Error creating discount:', e);
    return undefined;
  }
}

export async function createDiscountFor(dto: CreatePlanDto): Promise<string | undefined> {
  if (!dto.originalPrice || dto.originalPrice <= dto.price) return undefined;

  const discountAmount = Math.round((dto.originalPrice - dto.price) * 100).toString();
  const description = `Discount for ${dto.slug}`;

  const discount = await createNewPaddleDiscount(discountAmount, description);
  return discount?.id;
}


export async function createNewPaddlePrice(
  productId: string,
  price: number
): Promise<Price> {
  const minorUnit = Math.round(price * 100).toString();

  const priceBody: CreatePriceRequestBody = {
    productId,
    description: 'One-time purchase',
    unitPrice: {
      amount: minorUnit,
      currencyCode: 'USD',
    },
    quantity: {
      minimum: 1,
      maximum: 1,
    },
    taxMode: 'account_setting',
    billingCycle: null,
  };

  return await paddle.prices.create(priceBody);
}


export async function createNewPaddleProduct(
  name: string,
  description: string
): Promise<Product> {
  const productBody: CreateProductRequestBody = {
    name,
    description,
    taxCategory: 'standard',
  };
  return await paddle.products.create(productBody);
}

export async function createProductWithPrice(
  input: CreatePaddleInput
): Promise<{ product: Product; price: Price }> {
  const { name, description, inputPrice } = input;

  const product = await createNewPaddleProduct(name, description);
  const price = await createNewPaddlePrice(product.id, inputPrice);

  return { product, price };
}


export async function syncPaddleForPlan(
  dto: CreatePlanDto,
  existing?: {
    paddleProductId: string;
    paddlePriceId: string;
    price: number;
    originalPrice?: number;
  }
): Promise<{
  paddleProductId: string;
  paddlePriceId: string;
  paddleDiscountId?: string;
}> {
  const { title, description, price, originalPrice } = dto;

  let paddleProductId: string;
  let paddlePriceId: string;

  if (existing) {
    // 🛠️ Update existing Paddle product
    await paddle.products.update(existing.paddleProductId, {
      name: title,
      description,
    });

    if (
      existing.price !== price ||
      existing.originalPrice !== originalPrice
    ) {
      await paddle.prices.update(existing.paddlePriceId, {
        status: 'archived',
      });
      const newPrice = await createNewPaddlePrice(existing.paddleProductId, originalPrice ?? price);
      paddlePriceId = newPrice.id;
    } else {
      paddlePriceId = existing.paddlePriceId;
    }

    paddleProductId = existing.paddleProductId;
  } else {
    // 🆕 Create product + price
    const { product, price: createdPrice } = await createProductWithPrice({
      name: title,
      description,
      inputPrice: originalPrice ?? price,
    });

    paddleProductId = product.id;
    paddlePriceId = createdPrice.id;
  }
  let paddleDiscountId: string | undefined = undefined;
  if (dto.originalPrice) {
    paddleDiscountId = await createDiscountFor(dto);
  }

  return {
    paddleProductId,
    paddlePriceId,
    paddleDiscountId,
  };
}



export async function generateTransaction(opts: {
  plan: Plan;
  userId: number; // your internal user to embed in passthrough
  quantity?: number; // default 1
  successUrl?: string; // optional thank-you redirect
  cancelUrl?: string; // optional cancel redirect
}): Promise<string> {
  const body: CreateTransactionRequestBody = {
    items: [
      {
        priceId: opts.plan.paddlePriceId,
        quantity: opts.quantity ?? 1,
      },
    ],
    discountId: opts.plan.paddleDiscountId,
    customData: { userId: opts.userId, planId: opts.plan.id }, // comes back in webhook
  };

  const tx: Transaction = await paddle.transactions.create(body);
  // tx.hostedUrl   → https://pay.paddle.com/checkout/xyz
  if (!tx.checkout?.url) {
    throw new AppError('Could not generate payment link', 400);
  }

  return tx.id;
}
