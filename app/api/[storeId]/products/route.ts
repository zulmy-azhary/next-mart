import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { productSchema } from "@/schemas/product";
import type { Params } from "@/types";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

const PATH = "STORE_ID -> PRODUCTS";

export const POST = async (req: Request, { params }: Params<{ storeId: string }>) => {
  const METHOD = req.method;

  const validatedFields = await productSchema.safeParseAsync(await req.json());

  if (!validatedFields.success) {
    logger.error(`[${METHOD}] ${PATH} = Invalid fields.`);
    return new NextResponse("Invalid fields.", { status: 422 });
  }

  try {
    const { images, ...products } = validatedFields.data;
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

    const product = await db.product.create({
      data: {
        ...products,
        storeId: params.storeId,
        images: {
          createMany: {
            data: images.map((image: string) => ({ url: image })),
          },
        },
      },
    });

    logger.info(`[${METHOD}] ${PATH} = Product created.`);
    return NextResponse.json(product);
  } catch (error) {
    logger.error(`[${METHOD}] ${PATH} =`, error);
    return new NextResponse((error as Error).message, { status: 500 });
  }
};

export const GET = async (req: Request, { params }: Params<{ storeId: string }>) => {
  const METHOD = req.method;

  try {
    const products = await db.product.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    logger.info(`[${METHOD}] ${PATH} = Products retrieved.`);
    return NextResponse.json(products);
  } catch (error) {
    logger.error(`[${METHOD}] ${PATH} =`, error);
    return new NextResponse((error as Error).message, { status: 500 });
  }
};
