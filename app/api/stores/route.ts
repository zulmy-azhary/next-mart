import { db } from "@/lib/db";
import { storeSchema } from "@/schemas/store";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export const POST = async (req: Request, res: Response) => {
  const validatedFields = await storeSchema.safeParseAsync(await req.json());

  if (!validatedFields.success) {
    return new NextResponse("Invalid fields.", { status: 422 });
  }

  try {
    const { name } = validatedFields.data;
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized.", { status: 401 });
    }

    const store = await db.store.create({
      data: {
        name,
        userId
      }
    });

    return NextResponse.json(store);
  } catch (error) {
    return new NextResponse((error as Error).message, { status: 500 });
  }
};