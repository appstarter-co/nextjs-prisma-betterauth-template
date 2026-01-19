import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma"; // ensure you export a prisma client

//this route use JWT token in the request header to authenticate API requests
export async function GET(req: Request) {
  
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id as string },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(addresses);
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json();
  const { line1, line2, city, state, postalCode, country } = body;

  if (!line1 || !city || !country) {
    return NextResponse.json({ error: "missing required fields" }, { status: 400 });
  }

  const address = await prisma.address.create({
    data: {
      id: Date.now().toString(),
      userId: session.user.id,
      line1,
      line2: line2 || null,
      city,
      state: state || null,
      postalCode: postalCode || null,
      country,
    },
  });

  return NextResponse.json(address, { status: 201 });
}