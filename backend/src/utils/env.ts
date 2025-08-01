import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

function getEnvVariable(key: string, required = true): string {
  const value = process.env[key];
  if (!value && required) {
    throw new Error(`Missing required env variable: ${key}`);
  }
  return value!;
}

export const env = {
  DOMAIN: getEnvVariable('DOMAIN'),
  FRONTEND_URL: getEnvVariable('FRONTEND_URL'),
  API_URL: getEnvVariable('API_URL'),
  DATABASE_URL: getEnvVariable('DATABASE_URL'),
  JWT_SECRET: getEnvVariable('JWT_SECRET'),
  BCRYPT_ROUNDS: getEnvVariable('BCRYPT_ROUNDS'),
  PORT: parseInt(getEnvVariable('PORT', false) || '4000', 10),
  ZOHO_USER: getEnvVariable('ZOHO_USER'),
  ZOHO_PASS: getEnvVariable('ZOHO_PASS'),
  EMAIL_ENABLED: getEnvVariable('EMAIL_ENABLED') === 'true',
  GOOGLE_CLIENT_ID: getEnvVariable('GOOGLE_CLIENT_ID'),
  GOOGLE_CLIENT_SECRET: getEnvVariable('GOOGLE_CLIENT_SECRET'),
  CONTACT_EMAIL: getEnvVariable('CONTACT_EMAIL'), //where the emails that users send go

  PADDLE_VENDOR_ID: getEnvVariable('PADDLE_VENDOR_ID'),
  PADDLE_API_KEY: getEnvVariable('PADDLE_API_KEY'),
  PADDLE_PUBLIC_KEY: getEnvVariable('PADDLE_PUBLIC_KEY'),
  PADDLE_SANDBOX: getEnvVariable('PADDLE_SANDBOX'),
  PADDLE_WEBHOOK_KEY: getEnvVariable('PADDLE_WEBHOOK_KEY'),
};
