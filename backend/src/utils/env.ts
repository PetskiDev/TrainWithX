import dotenv from 'dotenv';
import path from 'path';
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

function getEnvVariable(key: string, required = true): string {
  const value = process.env[key];
  if (!value && required) {
    throw new Error(`Missing required env variable: ${key}`);
  }
  return value!;
}

export const env = {
  DATABASE_URL: getEnvVariable('DATABASE_URL'),
  JWT_SECRET: getEnvVariable('JWT_SECRET'),
  PORT: parseInt(getEnvVariable('PORT', false) || '4000', 10),
  ZOHO_USER: getEnvVariable('ZOHO_USER'),
  ZOHO_PASS: getEnvVariable('ZOHO_PASS'),
};
