import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { sizeSchema } from "@/schemas/size";
import type { Params } from "@/types";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

const PATH = "STORE_ID -> SIZES";

export const POST = async (req: Request, { params }: Params<{ storeId: string }>) => {
  const METHOD = req.method;

  const validatedFields = await sizeSchema.safeParseAsync(await req.json());

  if (!validatedFields.success) {
    logger.error(`[${METHOD}] ${PATH} = Invalid fields.`);
    return new NextResponse("Invalid fields.", { status: 422 });
  }

  try {
    const { name, value } = validatedFields.data;
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

    const size = await db.size.create({
      data: {
        name,
        value,
        storeId: params.storeId,
      },
    });

    logger.info(`[${METHOD}] ${PATH} = Size created.`);
    return NextResponse.json(size);
  } catch (error) {
    logger.error(`[${METHOD}] ${PATH} =`, error);
    return new NextResponse((error as Error).message, { status: 500 });
  }
};

export const GET = async (req: Request, { params }: Params<{ storeId: string }>) => {
  const METHOD = req.method;

  try {
    const sizes = await db.size.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    logger.info(`[${METHOD}] ${PATH} = Sizes retrieved.`);
    return NextResponse.json(sizes);
  } catch (error) {
    logger.error(`[${METHOD}] ${PATH} =`, error);
    return new NextResponse((error as Error).message, { status: 500 });
  }
};
