import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { billboardSchema } from "@/schemas/billboard";
import type { Params } from "@/types";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";

const PATH = "STORE_ID -> BILLBOARDS -> ID";

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

  const validatedFields = await billboardSchema.safeParseAsync(await req.json());

  if (!validatedFields.success) {
    logger.error(`[${METHOD}] ${PATH} = Invalid fields.`);
    return new NextResponse("Invalid fields.", { status: 422 });
  }

  try {
    const { label, imageUrl } = validatedFields.data;
    const { userId } = auth();

    if (!userId) {
      logger.error(`[${METHOD}] ${PATH} = Unauthorized.`);
      return new NextResponse("Unauthorized.", { status: 401 });
    }

    if (!params.id) {
      logger.error(`[${METHOD}] ${PATH} = Billboard id is required.`);
      return new NextResponse("Billboard id is required.", { status: 400 });
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

    const billboard = await db.billboard.update({
      where: {
        id: params.id,
      },
      data: {
        label,
        imageUrl,
      },
    });

    logger.info(`[${METHOD}] ${PATH} = Billboard updated.`);
    return NextResponse.json(billboard);
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

    await db.$transaction(async (tx) => {
      const deletedBillboard = await tx.billboard.delete({
        where: {
          id: params.id,
        },
      });

      const imgName = deletedBillboard.imageUrl.substring(
        deletedBillboard.imageUrl.lastIndexOf("/") + 1
      );
      return new UTApi().deleteFiles(imgName);
    });

    logger.info(`[${METHOD}] ${PATH} = Billboard deleted.`);
    return NextResponse.json({ message: "Billboard deleted." });
  } catch (error) {
    logger.error(`[${METHOD}] ${PATH} =`, error);
    return new NextResponse((error as Error).message, { status: 500 });
  }
};
