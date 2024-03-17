import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { categorySchema } from "@/schemas/category";
import type { Params } from "@/types";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

const PATH = "STORE_ID -> CATEGORIES";

export const POST = async (req: Request, { params }: Params<{ storeId: string }>) => {
  const METHOD = req.method;

  const validatedFields = await categorySchema.safeParseAsync(await req.json());

  if (!validatedFields.success) {
    logger.error(`[${METHOD}] ${PATH} = Invalid fields.`);
    return new NextResponse("Invalid fields.", { status: 422 });
  }

  try {
    const { name, billboardId } = validatedFields.data;
    const { userId } = auth();

    if (!userId) {
      logger.error(`[${METHOD}] ${PATH} = Unauthorized.`);
      return new NextResponse("Unauthorized.", { status: 401 });
    }

    const storeByUserId = await db.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      logger.error(`[${METHOD}] ${PATH} = Access denied.`);
      return new NextResponse("Access denied.", { status: 403 });
    }

    const category = await db.category.create({
      data: {
        name,
        billboardId,
        storeId: params.storeId,
      },
    });

    logger.info(`[${METHOD}] ${PATH} = Category created.`);
    return NextResponse.json(category);
  } catch (error) {
    logger.error(`[${METHOD}] ${PATH} =`, error);
    return new NextResponse((error as Error).message, { status: 500 });
  }
};

export const GET = async (req: Request, { params }: Params<{ storeId: string }>) => {
  const METHOD = req.method;

  try {
    const categories = await db.category.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    logger.info(`[${METHOD}] ${PATH} = Categories retrieved.`);
    return NextResponse.json(categories);
  } catch (error) {
    logger.error(`[${METHOD}] ${PATH} =`, error);
    return new NextResponse((error as Error).message, { status: 500 });
  }
};
