// app/api/operations/[id]/validate/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { applyOperation } from "@/lib/stock";

type Params = { params: { id: string } };

export async function PATCH(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    await applyOperation(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message ?? "Failed to validate operation" },
      { status: 400 }
    );
  }
}
