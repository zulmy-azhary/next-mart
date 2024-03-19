import type { Params } from "@/types";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Section, SectionContent, SectionHeader } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IoArrowBackOutline } from "react-icons/io5";
import { Separator } from "@/components/ui/separator";
import { EditSizeForm } from "./_components/edit-size-form";

export const metadata: Metadata = {
  title: "Edit Size",
};

type EditSizePageProps = Params<{ storeId: string; id: string }>;

export default async function EditSizePage({ params }: EditSizePageProps) {
  const { storeId, id } = params;

  const size = await db.size.findUnique({
    where: {
      id,
    },
  });

  if (!size) {
    redirect(`/${storeId}/sizes`);
  }

  return (
    <Section>
      <SectionHeader>
        <Heading title="Edit Size" description="Edit an existing size" />
        <Button asChild>
          <Link href={`/${storeId}/sizes`}>
            <IoArrowBackOutline className="mr-2 size-4" />
            Back
          </Link>
        </Button>
      </SectionHeader>
      <Separator />
      <SectionContent>
        <EditSizeForm size={size} />
      </SectionContent>
    </Section>
  );
}
