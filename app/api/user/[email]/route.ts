import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { email: string } }
) {

  try {
    const user = await prisma.user.findFirst({
      where: {
        email: params.email,
      },
    });
    return NextResponse.json(user);
  } catch (err) {
    return NextResponse.json(err);
  }
}
