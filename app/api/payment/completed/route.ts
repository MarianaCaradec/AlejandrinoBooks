import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
      const { orderId } = await req.json();
  console.log("completed: ", orderId)
      if (!orderId) {
        return NextResponse.json({ error: "Missing orderId." }, { status: 400 });
      }
  
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "COMPLETED" },
      });
  
      return NextResponse.json({ message: "Order status updated successfully." });
    } catch (error) {
      console.error("Error updating order status:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }