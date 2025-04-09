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

    const order = await prisma.order.create({
      data: {
        userId,
        totalAmount,
        status: 'PENDING',
        orderItems: {
          create: orderItems.map((item: OrderItemWithBook) => ({
            bookId: item.bookId,
            quantity: item.quantity
          }))
        }
      },
      include: {
        orderItems: true
      }
    })


      const preference = await new Preference(mercadopago).create({
        body: {
          items: orderItems.map((item: OrderItemWithBook) => ({
            id: item.bookId, 
            title: item.bookTitle,
            description: `Book by ${item.bookAuthor}`,
            quantity: item.quantity,
            unit_price: Number(item.bookPrice),
          })),
          metadata: {
            orderId: order.id,
          },
        },
      });
      

    return NextResponse.json({ init_point: preference.init_point }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, {status: 500});
  }
}