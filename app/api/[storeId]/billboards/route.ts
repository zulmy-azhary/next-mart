import { db } from "@/lib/db";
import { billboardSchema } from "@/schemas/billboard";
import { Params } from "@/types";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export const POST = async (req: Request, { params }: Params<{ storeId: string }>) => {
  const validatedFields = await billboardSchema.safeParseAsync(await req.json());

  if (!validatedFields.success) {
    return new NextResponse("Invalid fields.", { status: 422 });
  }

  try {
    const { label, imageUrl } = validatedFields.data;
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized.", { status: 401 });
    }

    const storeByUserId = await db.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    });

    if (!storeByUserId) {
      return new NextResponse("Acess denied.", { status: 403 });
    }

    const billboard = await db.billboard.create({
      data: {
        label,
        imageUrl,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[POST] STORE_ID -> BILLBOARDS =", error);
    return new NextResponse((error as Error).message, { status: 500 });
  }
};

export const GET = async (req: Request, { params }: Params<{ storeId: string }>) => {
  try {
    const billboards = await db.billboard.findMany({
      where: {
        storeId: params.storeId
      }
    });

    return NextResponse.json(billboards);
  } catch (error) {
    console.log("[GET] STORE_ID -> BILLBOARDS =", error);
    return new NextResponse((error as Error).message, { status: 500 });
  }
};