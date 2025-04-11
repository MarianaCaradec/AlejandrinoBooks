import {Payment} from "mercadopago";
 import {revalidatePath} from "next/cache";
 import mercadopago from "../../../../utils/mercadoPago";
 import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
 
export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log("Incoming Mercado Pago notification:", body);
      
        const { type, data } = body;
      
        if (!type || !data?.id) {
            return NextResponse.json({ error: "Missing required fields (type or data.id)." }, { status: 400 });
        }
      
        if (type !== "payment") {
            console.log("Ignoring non-payment notification type:", type);
            return new Response("Notification ignored", { status: 200 });
        }

        const payment = await new Payment(mercadopago).get({ id: data.id });

        if (payment.status === "approved") {
            const { metadata, transaction_amount } = payment;
            const { bookId, quantity, orderId } = metadata;

            if (!orderId || !bookId || !quantity) {
              return NextResponse.json({ error: "Missing metadata in payment." }, { status: 400 });
            }

            const book = await prisma.book.findUnique({
              where: { id: bookId },
            });

            if (book) {
              console.log(`The book ${book.title} has been bought in a quantity of ${quantity}.`);
            }

            await prisma.order.update({
              where: { id: orderId },
              data: {
                status: "COMPLETED",
                totalAmount: transaction_amount,
              },
            });

            console.log("Notification received and order updated successfully:", orderId);
            revalidatePath("/");
          }

        return new Response(null, { status: 200 });
        } catch (error) {
          console.error("Error processing payment notification:", error);
          return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
        }
      }
