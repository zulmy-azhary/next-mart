import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { catchException } from "@/lib/utils";
import { productSchema } from "@/schemas/product";
import type { Params } from "@/types";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";

const PATH = "STORE_ID -> PRODUCTS -> ID";

export const GET = async (req: Request, { params }: Params<{ storeId: string; id: string }>) => {
  const METHOD = req.method;

  try {
    const product = await db.product.findUnique({
      where: {
        id: params.id,
        storeId: params.storeId,
      },
      include: {
        images: true,
        category: true,
        color: true,
        size: true,
      },
    });

    if (!product) {
      logger.error(`[${METHOD}] ${PATH} = Product ${params.id} doesn't exist.`);
      return NextResponse.json(
        { success: false, error: { message: "Product doesn't exist." } },
        { status: 404 }
      );
    }

    logger.info(`[${METHOD}] ${PATH} = Product ${params.id} retrieved.`);
    return NextResponse.json({ success: true, data: product }, { status: 200 });
  } catch (error: unknown) {
    logger.error(`[${METHOD}] ${PATH} =`, error);
    catchException(error);
  }
};

export const PATCH = async (req: Request, { params }: Params<{ storeId: string; id: string }>) => {
  const METHOD = req.method;

  const validatedFields = await productSchema.safeParseAsync(await req.json());

  if (!validatedFields.success) {
    logger.error(`[${METHOD}] ${PATH} = Invalid fields.`);
    return NextResponse.json(
      { success: false, error: { message: "Invalid fields." } },
      { status: 422 }
    );
  }

  try {
    const { images, ...products } = validatedFields.data;
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

    const updateProductAndDeleteImages = db.product.update({
      where: {
        id: params.id,
        storeId: params.storeId,
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
        storeId: params.storeId,
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
    return NextResponse.json(
      { success: true, message: "Product updated.", data: product },
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

    await db.$transaction(async (tx) => {
      const deletedProduct = await tx.product.delete({
        where: {
          id: params.id,
          storeId: params.storeId,
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
    return NextResponse.json({ success: true, message: "Product deleted." }, { status: 200 });
  } catch (error: unknown) {
    logger.error(`[${METHOD}] ${PATH} =`, error);
    catchException(error);
  }
};
