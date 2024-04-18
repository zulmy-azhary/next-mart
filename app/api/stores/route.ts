import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { catchException } from "@/lib/utils";
import { storeSchema } from "@/schemas/store";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

const PATH = "STORES";

export const POST = async (req: Request) => {
  const METHOD = req.method;

  const validatedFields = await storeSchema.safeParseAsync(await req.json());

  if (!validatedFields.success) {
    logger.error(`[${METHOD}] ${PATH} = Invalid fields.`);
    return NextResponse.json(
      { success: false, error: { message: "Invalid fields." } },
      { status: 422 }
    );
  }

  try {
    const { name } = validatedFields.data;
    const { userId } = auth();

    if (!userId) {
      logger.error(`[${METHOD}] ${PATH} = Unauthorized.`);
      return NextResponse.json(
        { success: false, error: { message: "Unauthorized." } },
        { status: 401 }
      );
    }

    const store = await db.store.create({
      data: {
        name,
        userId,
      },
    });

    logger.info(`[${METHOD}] ${PATH} = Store created.`);
    return NextResponse.json(
      { success: true, message: "Store created.", data: store },
      { status: 201 }
    );
  } catch (error: unknown) {
    logger.error(`[${METHOD}] ${PATH} =`, error);
    catchException(error);
  }
};

export const GET = async (req: Request) => {
  const METHOD = req.method;

  try {
    const stores = await db.store.findMany();

    logger.info(`[${METHOD}] ${PATH} = Stores retrieved.`);
    return NextResponse.json({ success: true, data: stores }, { status: 200 });
  } catch (error: unknown) {
    logger.error(`[${METHOD}] ${PATH} =`, error);
    catchException(error);
  }
};
