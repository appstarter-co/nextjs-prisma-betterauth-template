import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

//this route use session cookie to authenticate API requests
export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json();

  // Ensure belongs to user
  const existing = await prisma.address.findFirst({
    where: { id: params.id, userId: session.user.id },
  });
  if (!existing) return NextResponse.json({ error: "not found" }, { status: 404 });

  const updated = await prisma.address.update({
    where: { id: params.id },
    data: {
      line1: body.line1 ?? existing.line1,
      line2: body.line2 ?? existing.line2,
      city: body.city ?? existing.city,
      state: body.state ?? existing.state,
      postalCode: body.postalCode ?? existing.postalCode,
      country: body.country ?? existing.country,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const existing = await prisma.address.findFirst({
    where: { id: params.id, userId: session.user.id },
  });
  if (!existing) return NextResponse.json({ error: "not found" }, { status: 404 });

  await prisma.address.delete({ where: { id: params.id } });
  return NextResponse.json({status: 'success'}, { status: 200 });
}