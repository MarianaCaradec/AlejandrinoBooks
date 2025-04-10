import {Payment} from "mercadopago";
import {revalidatePath} from "next/cache";
import mercadopago from "../../../utils/mercadoPago";
import { prisma } from "@/app/lib/prisma";

export async function POST(request: Request) {
  const body: {data: {id: string}} = await request.json();

  const payment = await new Payment(mercadopago).get({id: body.data.id});

  if (payment.status === "approved") {
    const {bookId, quantity} = payment.metadata;

    const book = await prisma.book.findUnique({
      where: {id: bookId},
    });

    console.log(`The book ${book?.title} has been bought in a quantity of ${quantity}`);

    const order = await prisma.order.findFirst({
      where: {
        userId: payment.payer?.id,
        status: "PENDING",
      },
    });

    await prisma.order.update({
        where: {id: order?.id},
        data: {
        status: "COMPLETED",
        totalAmount: payment.transaction_amount,
        orderItems: {
            create: {
            bookId,
            quantity,
            },
        },
        },
    });
    console.log("Notification recieived and order updated successfully.", order?.id);
    revalidatePath("/");
  }

  // Respondemos con un estado 200 para indicarle que la notificación fue recibida
  return new Response(null, {status: 200});
}