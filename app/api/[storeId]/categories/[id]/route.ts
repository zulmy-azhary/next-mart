import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { categorySchema } from "@/schemas/category";
import type { Params } from "@/types";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

const PATH = "STORE_ID -> CATEGORIES -> ID";

export const GET = async (req: Request, { params }: Params<{ id: string }>) => {
  const METHOD = req.method;

  try {
    // Not implemented yet...
  } catch (error) {
    logger.error(`[${METHOD}] ${PATH} =`, error);
    return new NextResponse((error as Error).message, { status: 500 });
  }
};

export const PATCH = async (req: Request, { params }: Params<{ storeId: string; id: string }>) => {
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

    if (!params.id) {
      logger.error(`[${METHOD}] ${PATH} = Category id is required.`);
      return new NextResponse("Category id is required.", { status: 400 });
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

    const category = await db.category.update({
      where: {
        id: params.id,
      },
      data: {
        name,
        billboardId,
      },
    });

    logger.info(`[${METHOD}] ${PATH} = Category updated.`);
    return NextResponse.json(category);
  } catch (error) {
    logger.error(`[${METHOD}] ${PATH} =`, error);
    return new NextResponse((error as Error).message, { status: 500 });
  }
};

export const DELETE = async (req: Request, { params }: Params<{ storeId: string; id: string }>) => {
  const METHOD = req.method;

  try {
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

    const category = await db.category.delete({
      where: {
        id: params.id
      }
    })

    logger.info(`[${METHOD}] ${PATH} = Category deleted.`);
    return NextResponse.json(category);
  } catch (error) {
    logger.error(`[${METHOD}] ${PATH} =`, error);
    return new NextResponse((error as Error).message, { status: 500 });
  }
};
