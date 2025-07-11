/// <reference types="vite/client" />

// Augment the default ImportMetaEnv
interface ImportMetaEnv {
  readonly VITE_BASE_DOMAIN: string;
  readonly VITE_PADDLE_SANDBOX: 'true' | 'false';
  readonly VITE_PADDLE_AUTH_TOKEN: string; // client-side auth token
  readonly VITE_PADDLE_SELLER_ID: string; // numeric but keep as string

  // add more as needed...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
