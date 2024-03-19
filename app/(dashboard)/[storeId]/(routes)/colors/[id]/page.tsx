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
import { EditColorForm } from "./_components/edit-color-form";

export const metadata: Metadata = {
  title: "Edit Color",
};

type EditColorPageProps = Params<{ storeId: string; id: string }>;

export default async function EditColorPage({ params }: EditColorPageProps) {
  const { storeId, id } = params;

  const color = await db.color.findUnique({
    where: {
      id,
    },
  });

  if (!color) {
    redirect(`/${storeId}/colors`);
  }

  return (
    <Section>
      <SectionHeader>
        <Heading title="Edit Color" description="Edit an existing color" />
        <Button asChild>
          <Link href={`/${storeId}/colors`}>
            <IoArrowBackOutline className="mr-2 size-4" />
            Back
          </Link>
        </Button>
      </SectionHeader>
      <Separator />
      <SectionContent>
        <EditColorForm color={color} />
      </SectionContent>
    </Section>
  );
}
