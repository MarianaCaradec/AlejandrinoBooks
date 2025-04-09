import MercadoPago from 'mercadopago';

const mercadoPagoClient = new MercadoPago({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN as string,
});

export default mercadoPagoClient;