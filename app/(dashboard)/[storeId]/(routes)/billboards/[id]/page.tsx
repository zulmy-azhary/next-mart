import type { Metadata } from "next";
import { EditBillboardForm } from "./_components/edit-billboard-form";
import { Section, SectionContent, SectionHeader } from "@/components/ui/section";
import type { Params } from "@/types";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IoArrowBackOutline } from "react-icons/io5";

export const metadata: Metadata = {
  title: "Edit Billboard",
};

type EditBillboardPageProps = Params<{ storeId: string; id: string }>;

export default async function EditBillboardPage({ params }: EditBillboardPageProps) {
  const { storeId, id } = params;

  const billboard = await db.billboard.findUnique({
    where: {
      id,
      storeId,
    },
  });

  if (!billboard) {
    redirect(`/${params.storeId}/billboards`);
  }

  return (
    <Section>
      <SectionHeader>
        <Heading title="Edit Billboard" description="Edit an existing billboard" />
        <Button asChild>
          <Link href={`/${storeId}/billboards`}>
            <IoArrowBackOutline className="mr-2 size-4" />
            Back
          </Link>
        </Button>
      </SectionHeader>
      <Separator />
      <SectionContent>
        <EditBillboardForm billboard={billboard} />
      </SectionContent>
    </Section>
  );
}
