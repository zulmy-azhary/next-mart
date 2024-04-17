import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { productSchema } from "@/schemas/product";
import type { Params } from "@/types";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";

const PATH = "STORE_ID -> PRODUCTS -> ID";

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

    if (!params.id) {
      logger.error(`[${METHOD}] ${PATH} = Product id is required.`);
      return new NextResponse("Product id is required.", { status: 400 });
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

    const updateProductAndDeleteImages = db.product.update({
      where: {
        id: params.id,
      },
      data: {
        ...products,
        images: {
          deleteMany: {},
        },
      },
    });

    const createProductImages = db.product.update({
      where: {
        id: params.id,
      },
      data: {
        images: {
          createMany: {
            data: images.map((image: string) => ({ url: image })),
          },
        },
      },
    });

    const product = await db.$transaction([updateProductAndDeleteImages, createProductImages]);

    logger.info(`[${METHOD}] ${PATH} = Product updated.`);
    return NextResponse.json(product);
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

    const product = await db.$transaction(async (tx) => {
      const deletedProduct = await tx.product.delete({
        where: {
          id: params.id,
        },
        include: {
          images: true,
        },
      });

      const images = deletedProduct.images.map((image) =>
        image.url.substring(image.url.lastIndexOf("/") + 1)
      );
      return new UTApi().deleteFiles(images);
    });

    logger.info(`[${METHOD}] ${PATH} = Product deleted.`);
    return NextResponse.json(product);
  } catch (error) {
    logger.error(`[${METHOD}] ${PATH} =`, error);
    return new NextResponse((error as Error).message, { status: 500 });
  }
};
