/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FAUCET_BACKEND_URL: string;
  readonly VITE_GOOGLE_CAPTCA_SIKEY_KEY: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
