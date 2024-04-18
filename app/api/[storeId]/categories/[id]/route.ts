import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { catchException } from "@/lib/utils";
import { categorySchema } from "@/schemas/category";
import type { Params } from "@/types";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

const PATH = "STORE_ID -> CATEGORIES -> ID";

export const GET = async (req: Request, { params }: Params<{ storeId: string; id: string }>) => {
  const METHOD = req.method;

  try {
    const category = await db.category.findUnique({
      where: {
        id: params.id,
        storeId: params.storeId,
      },
    });

    if (!category) {
      logger.error(`[${METHOD}] ${PATH} = Category ${params.id} doesn't exist.`);
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Category doesn't exist.",
          },
        },
        { status: 404 }
      );
    }

    logger.info(`[${METHOD}] ${PATH} = Category ${params.id} retrieved.`);
    return NextResponse.json({ success: true, data: category }, { status: 200 });
  } catch (error: unknown) {
    logger.error(`[${METHOD}] ${PATH} =`, error);
    catchException(error);
  }
};

export const PATCH = async (req: Request, { params }: Params<{ storeId: string; id: string }>) => {
  const METHOD = req.method;

  const validatedFields = await categorySchema.safeParseAsync(await req.json());

  if (!validatedFields.success) {
    logger.error(`[${METHOD}] ${PATH} = Invalid fields.`);
    return NextResponse.json(
      { success: false, error: { message: "Invalid fields." } },
      { status: 422 }
    );
  }

  try {
    const { name, billboardId } = validatedFields.data;
    const { userId } = auth();

    if (!userId) {
      logger.error(`[${METHOD}] ${PATH} = Unauthorized.`);
      return NextResponse.json(
        { success: false, error: { message: "Unauthorized." } },
        { status: 401 }
      );
    }

    const storeByUserId = await db.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      logger.error(`[${METHOD}] ${PATH} = Access denied.`);
      return NextResponse.json(
        { success: false, error: { message: "Access denied." } },
        { status: 403 }
      );
    }

    const category = await db.category.update({
      where: {
        id: params.id,
        storeId: params.storeId,
      },
      data: {
        name,
        billboardId,
      },
    });

    logger.info(`[${METHOD}] ${PATH} = Category updated.`);
    return NextResponse.json(
      { success: true, message: "Category updated.", data: category },
      { status: 200 }
    );
  } catch (error: unknown) {
    logger.error(`[${METHOD}] ${PATH} =`, error);
    catchException(error);
  }
};

export const DELETE = async (req: Request, { params }: Params<{ storeId: string; id: string }>) => {
  const METHOD = req.method;

  try {
    const { userId } = auth();

    if (!userId) {
      logger.error(`[${METHOD}] ${PATH} = Unauthorized.`);
      return NextResponse.json(
        { success: false, error: { message: "Unauthorized." } },
        { status: 401 }
      );
    }

    const storeByUserId = await db.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      logger.error(`[${METHOD}] ${PATH} = Access denied.`);
      return NextResponse.json(
        { success: false, error: { message: "Access denied." } },
        { status: 403 }
      );
    }

    await db.category.delete({
      where: {
        id: params.id,
        storeId: params.storeId,
      },
    });

    logger.info(`[${METHOD}] ${PATH} = Category deleted.`);
    return NextResponse.json({ success: true, message: "Category deleted." }, { status: 200 });
  } catch (error: unknown) {
    logger.error(`[${METHOD}] ${PATH} =`, error);
    catchException(error);
  }
};
