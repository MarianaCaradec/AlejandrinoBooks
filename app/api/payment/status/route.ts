import { prisma } from "@/app/lib/prisma";
import { DatabaseError } from "@/errorHandler";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
      const { searchParams } = new URL(req.url);
      const orderId = searchParams.get("orderId");
  
      if (!orderId) {
        return NextResponse.json({ error: "Missing orderId." }, { status: 400 });
      }
  
      const order = await prisma.order.findUnique({
        where: { id: orderId },
      });
  
      if (!order) {
        return NextResponse.json({ error: "Order not found." }, { status: 404 });
      }
  
      return NextResponse.json({ status: order.status }, { status: 200 });
    } catch (error) {
      return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
          );
    }
  }