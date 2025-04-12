import { OrderItemWithBook, prisma } from '@/app/lib/prisma';
import mercadopago from '../../../utils/mercadoPago';
import { Preference } from 'mercadopago';
import { NextRequest, NextResponse } from 'next/server';
import { DatabaseError } from '@/errorHandler';

export async function POST(req: NextRequest) {
  try {
    const {userId, orderItems} = await req.json();

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
      return NextResponse.json({ error: "You already have a pending order." }, { status: 400 });
    }

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
            items: orderItems.map((item: OrderItemWithBook) => ({
              bookId: item.bookId,
              quantity: item.quantity,
            })),
          },
          notification_url: "https://alejandrino-books-257954971394.us-central1.run.app/api/payment/notifications",
          back_urls: {
              success: `https://alejandrino-books-257954971394.us-central1.run.app/payment-success?&order_id=${order.id}`
          },
          auto_return: "approved",
        },
      });
console.log("Preference created successfully:", preference.metadata.orderId);
    return NextResponse.json({
      orderId: order.id, 
      init_point: preference.init_point }, { status: 200 });  
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, {status: 500});
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
