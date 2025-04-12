import mercadopago from "../../../../utils/mercadoPago";
import { Payment } from 'mercadopago';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const paymentId = searchParams.get('payment_id');

    if (!paymentId) {
      return new Response(
        JSON.stringify({ error: 'Missing paymentId in query params.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const payment = await new Payment(mercadopago).get({ id: paymentId });

    if (!payment) {
      return new Response(
        JSON.stringify({ error: 'Payment not found.' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    
    const { status, metadata, transaction_amount } = payment;
    console.log("The orderId and status are: ", metadata.orderId, metadata.status);
    return new Response(
        JSON.stringify({
        status: status,
        orderId: metadata.orderId, 
        transaction_amount: transaction_amount,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

} catch (error) {
        console.error("Error processing payment notification:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
}
}