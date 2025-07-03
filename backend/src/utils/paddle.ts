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

async function createDiscount(
  requestBody: CreateDiscountRequestBody
): Promise<Discount | undefined> {
  try {
    const discount = await paddle.discounts.create(requestBody);
    return discount;
  } catch (e) {
    console.error('Error creating discount:', e);
  }
}

export async function createDiscountFor(dto: CreatePlanDto) {
  if (!dto.originalPrice || dto.originalPrice <= dto.price) return undefined;
  const discountAmount = Math.round(
    (dto.originalPrice - dto.price) * 100
  ).toString();
  let discount = await createDiscount({
    amount: discountAmount,
    type: 'flat',
    description: `Discount for ${dto.slug}`,
    currencyCode: 'USD',
  });
  return discount?.id;
}

export async function createProductWithPrice(
  input: CreatePaddleInput
): Promise<{ product: Product; price: Price }> {
  const { name, inputPrice, description } = input;

  // 🛠️ Fix 1: Proper minor unit conversion (avoid floating point errors)
  const minorUnit = Math.round(inputPrice * 100).toString();

  // ✅ 1. Create Product
  const productBody: CreateProductRequestBody = {
    name,
    description,
    taxCategory: 'standard',
  };
  const product = await paddle.products.create(productBody);

  // ✅ 2. Create Price
  const priceBody: CreatePriceRequestBody = {
    productId: product.id,
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
    billingCycle: null, // Explicitly null to mark it as one-time
  };

  const price = await paddle.prices.create(priceBody);

  return { product, price };
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
