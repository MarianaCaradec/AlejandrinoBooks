import { OrderItemWithBook, prisma } from '@/app/lib/prisma';
import mercadopago from '../../../utils/mercadoPago';
import { Payment, Preference } from 'mercadopago';
import { NextRequest, NextResponse } from 'next/server';
import { DatabaseError } from '@/errorHandler';
import { revalidatePath } from 'next/cache';

export async function POST(req: NextRequest) {
  try {
    const {userId, orderItems} = await req.json();
    console.log("Incoming data:", { userId, orderItems });
    console.log("Environment variables:", process.env.MERCADOPAGO_PUBLIC_KEY, process.env.MERCADOPAGO_ACCESS_TOKEN);
    if (!userId) throw new DatabaseError("Missing userId.");
    
    if (!orderItems || orderItems.length === 0) throw new DatabaseError("OrderItems array is empty.");

    const totalAmount = orderItems.reduce(
      (acc: number, item: OrderItemWithBook) => acc + Number(item.bookPrice) * item.quantity,
      0
    );

    const existingOrder = await prisma.order.findFirst({
      where: { userId, status: "PENDING" },
    });

    if (existingOrder) {
      console.error("User already has a pending order:", existingOrder);
      return NextResponse.json({ error: "You already have a pending order." }, { status: 400 });
    }

    console.log("No existing pending orders, creating new order...");

      
      const order = await prisma.order.create({
        data: {
          userId,
          totalAmount,
          status: "PENDING",
          orderItems: {
            create: orderItems.map((item: OrderItemWithBook) => ({
              bookId: item.bookId,
              quantity: item.quantity,
            })),
          },
        },
        include: { orderItems: true },
      });
    
      console.log("Order created successfully:", order);
      console.log("Creating Mercado Pago preference...");

      const preference = await new Preference(mercadopago).create({
        body: {
          items: orderItems.map((item: OrderItemWithBook) => ({
            id: item.bookId, 
            title: item.bookTitle,
            description: `Book by ${item.bookAuthor}`,
            quantity: item.quantity,
            unit_price: Number(item.bookPrice),
            currency_id: "ARS",
          })),
          metadata: {
            orderId: order.id,
          },
        },
      });
      console.log("Preference created successfully:", preference);


    return NextResponse.json({ init_point: preference.init_point }, { status: 200 });  
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, {status: 500});
  }
}

export async function PUT(request: Request) {
  try {
    const { orderId, paymentId, status } = await request.json();
  
    if (!orderId || !paymentId || !status) {
      return NextResponse.json(
        { error: "Missing required fields (orderId, paymentId, or status)." },
        { status: 400 }
      );
    }

  const payment = await new Payment(mercadopago).get({id: paymentId});

  if (payment.status === "approved") {
    const {bookId, quantity} = payment.metadata;

    const book = await prisma.book.findUnique({
      where: {id: bookId},
    });

    console.log(`The book ${book?.title} has been bought in a quantity of ${quantity}`);

    await prisma.order.update({
        where: {id: orderId},
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
    console.log("Notification recieived and order updated successfully.", orderId);
    revalidatePath("/");
  }

  return new Response(null, {status: 200});
} catch (error) {
    console.error("Error processing payment notification:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId." }, { status: 400 });
    }

    const existingOrder = await prisma.order.findFirst({
      where: { userId, status: "PENDING" },
      include: { orderItems: true }, 
    });

    if (!existingOrder) {
      return NextResponse.json({ message: "No pending order found." }, { status: 200 });
    }

    console.log("Deleting order items first...");

    await prisma.orderItem.deleteMany({
      where: { orderId: existingOrder.id },
    });

    console.log("Order items deleted successfully.");

    await prisma.order.delete({
      where: { id: existingOrder.id },
    });

    console.log("Pending order deleted for user:", userId);

    return NextResponse.json({ message: "Order successfully deleted." }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting pending order:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
