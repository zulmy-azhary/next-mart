import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { catchException } from "@/lib/utils";
import { billboardSchema } from "@/schemas/billboard";
import type { Params } from "@/types";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";

const PATH = "STORE_ID -> BILLBOARDS -> ID";

export const GET = async (req: Request, { params }: Params<{ storeId: string; id: string }>) => {
  const METHOD = req.method;

  try {
    const billboard = await db.billboard.findUnique({
      where: {
        id: params.id,
        storeId: params.storeId,
      },
    });

    if (!billboard) {
      logger.error(`[${METHOD}] ${PATH} = Billboard ${params.id} doesn't exist.`);
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Billboard doesn't exist",
          },
        },
        { status: 404 }
      );
    }

    logger.info(`[${METHOD}] ${PATH} = Billboard ${params.id} retrieved.`);
    return NextResponse.json({ success: true, data: billboard }, { status: 200 });
  } catch (error) {
    logger.error(`[${METHOD}] ${PATH} =`, error);
    catchException(error);
  }
};

export const PATCH = async (req: Request, { params }: Params<{ storeId: string; id: string }>) => {
  const METHOD = req.method;

  const validatedFields = await billboardSchema.safeParseAsync(await req.json());

  if (!validatedFields.success) {
    logger.error(`[${METHOD}] ${PATH} = Invalid fields.`);
    return NextResponse.json(
      { success: false, error: { message: "Invalid fields." } },
      { status: 422 }
    );
  }

  try {
    const { label, imageUrl } = validatedFields.data;
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

    const billboard = await db.billboard.update({
      where: {
        id: params.id,
        storeId: params.storeId,
      },
      data: {
        label,
        imageUrl,
      },
    });

    logger.info(`[${METHOD}] ${PATH} = Billboard updated.`);
    return NextResponse.json(
      { success: true, message: "Billboard updated.", data: billboard },
      { status: 200 }
    );
  } catch (error) {
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

    await db.$transaction(async (tx) => {
      const deletedBillboard = await tx.billboard.delete({
        where: {
          id: params.id,
          storeId: params.storeId,
        },
      });

      const imgName = deletedBillboard.imageUrl.substring(
        deletedBillboard.imageUrl.lastIndexOf("/") + 1
      );
      return new UTApi().deleteFiles(imgName);
    });

    logger.info(`[${METHOD}] ${PATH} = Billboard deleted.`);
    return NextResponse.json({ success: true, message: "Billboard deleted." }, { status: 200 });
  } catch (error) {
    logger.error(`[${METHOD}] ${PATH} =`, error);
    catchException(error);
  }
};
