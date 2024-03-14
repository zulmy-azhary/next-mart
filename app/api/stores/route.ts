import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { storeSchema } from "@/schemas/store";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

const PATH = "STORES";

export const POST = async (req: Request) => {
  const METHOD = req.method;

  const validatedFields = await storeSchema.safeParseAsync(await req.json());

  if (!validatedFields.success) {
    logger.error(`[${METHOD}] ${PATH} = Invalid fields.`);
    return new NextResponse("Invalid fields.", { status: 422 });
  }

  try {
    const { name } = validatedFields.data;
    const { userId } = auth();

    if (!userId) {
      logger.error(`[${METHOD}] ${PATH} = Unauthorized.`);
      return new NextResponse("Unauthorized.", { status: 401 });
    }

    const store = await db.store.create({
      data: {
        name,
        userId
      }
    });

    logger.info(`[${METHOD}] ${PATH} = Store created.`);
    return NextResponse.json(store);
  } catch (error) {
    logger.error(`[${METHOD}] ${PATH} =`, error);
    return new NextResponse((error as Error).message, { status: 500 });
  }
};