import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    MERCADOPAGO_PUBLIC_KEY: process.env.MERCADO_PAGO_PUBLIC_KEY,
    MERCADOPAGO_ACCESS_TOKEN: process.env.MERCADO_PAGO_ACCESS_TOKEN,
  },
};

export default nextConfig;
