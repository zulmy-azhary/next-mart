import { db } from "@/lib/db";
import { storeSchema } from "@/schemas/store";
import { Params } from "@/types";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export const PATCH = async (req: Request, { params }: Params<{ storeId: string }>) => {
  const validatedFields = await storeSchema.safeParseAsync(await req.json());

  if (!validatedFields.success) {
    return new NextResponse("Invalid fields.", { status: 422 });
  }

  try {
    const { name } = validatedFields.data;
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized.", { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required.", { status: 403 });
    }

    const store = await db.store.updateMany({
      where: {
        id: params.storeId,
        userId,
      },
      data: {
        name,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.log("[PATCH] STORES -> STORE_ID =", error);
    return new NextResponse((error as Error).message, { status: 500 });
  }
};

export const DELETE = async (req: Request, { params }: Params<{ storeId: string }>) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized.", { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required.", { status: 403 });
    }

    const store = await db.store.deleteMany({
      where: {
        id: params.storeId,
        userId,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.log("[DELETE] STORES -> STORE_ID =", error);
    return new NextResponse((error as Error).message, { status: 500 });
  }
};
