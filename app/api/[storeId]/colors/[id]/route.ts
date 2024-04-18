import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { catchException } from "@/lib/utils";
import { colorSchema } from "@/schemas/color";
import type { Params } from "@/types";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

const PATH = "STORE_ID -> COLORS -> ID";

export const GET = async (req: Request, { params }: Params<{ storeId: string; id: string }>) => {
  const METHOD = req.method;

  try {
    const color = await db.color.findUnique({
      where: {
        id: params.id,
        storeId: params.storeId,
      },
    });

    if (!color) {
      logger.error(`[${METHOD}] ${PATH} = Color ${params.id} doesn't exist.`);
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Color doesn't exist.",
          },
        },
        { status: 404 }
      );
    }

    logger.info(`[${METHOD}] ${PATH} = Color ${params.id} retrieved.`);
    return NextResponse.json({ success: true, data: color }, { status: 200 });
  } catch (error: unknown) {
    logger.error(`[${METHOD}] ${PATH} =`, error);
    catchException(error);
  }
};

export const PATCH = async (req: Request, { params }: Params<{ storeId: string; id: string }>) => {
  const METHOD = req.method;

  const validatedFields = await colorSchema.safeParseAsync(await req.json());

  if (!validatedFields.success) {
    logger.error(`[${METHOD}] ${PATH} = Invalid fields.`);
    return NextResponse.json(
      { success: false, error: { message: "Invalid fields." } },
      { status: 422 }
    );
  }

  try {
    const { name, value } = validatedFields.data;
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

    const color = await db.color.update({
      where: {
        id: params.id,
        storeId: params.storeId,
      },
      data: {
        name,
        value,
      },
    });

    logger.info(`[${METHOD}] ${PATH} = Color updated.`);
    return NextResponse.json(
      { success: true, message: "Color updated.", data: color },
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

    await db.color.delete({
      where: {
        id: params.id,
        storeId: params.storeId,
      },
    });

    logger.info(`[${METHOD}] ${PATH} = Color deleted.`);
    return NextResponse.json({ success: true, message: "Color deleted." }, { status: 200 });
  } catch (error: unknown) {
    logger.error(`[${METHOD}] ${PATH} =`, error);
    catchException(error);
  }
};
