import { prisma } from "@/app/lib/prisma";
import { DatabaseError } from "@/errorHandler";

export async function GET(req: Request) {
    try {
      const { searchParams } = new URL(req.url);
      const orderId = searchParams.get("orderId");
  
      if (!orderId) {
        return new Response(JSON.stringify({ error: "Missing orderId." }), { status: 400 });
      }
  
      const order = await prisma.order.findUnique({
        where: { id: orderId },
      });
  
      if (!order) {
        return new DatabaseError ("Order not found.");
      }
  
      return new DatabaseError("Couldn't update the order.");
    } catch (error) {
      return new DatabaseError();
    }
  }