import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { catchException } from "@/lib/utils";
import { colorSchema } from "@/schemas/color";
import type { Params } from "@/types";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

const PATH = "STORE_ID -> COLORS";

export const POST = async (req: Request, { params }: Params<{ storeId: string }>) => {
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

    const color = await db.color.create({
      data: {
        name,
        value,
        storeId: params.storeId,
      },
    });

    logger.info(`[${METHOD}] ${PATH} = Color created.`);
    return NextResponse.json(
      { success: true, message: "Color created.", data: color },
      { status: 201 }
    );
  } catch (error: unknown) {
    logger.error(`[${METHOD}] ${PATH} =`, error);
    catchException(error);
  }
};

export const GET = async (req: Request, { params }: Params<{ storeId: string }>) => {
  const METHOD = req.method;

  try {
    const colors = await db.color.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    logger.info(`[${METHOD}] ${PATH} = Colors retrieved.`);
    return NextResponse.json({ success: true, data: colors }, { status: 200 });
  } catch (error: unknown) {
    logger.error(`[${METHOD}] ${PATH} =`, error);
    catchException(error);
  }
};
