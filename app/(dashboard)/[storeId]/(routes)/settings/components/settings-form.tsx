"use client";

import { Heading } from "@/components/ui/heading";
import type { Store } from "@prisma/client";

type SettingsFormProps = {
  store: Store;
};

export const SettingsForm: React.FC<SettingsFormProps> = ({ store }) => {
  return (
    <section>
      <Heading title="Settings" description="Manage store settings and preferences" />
    </section>
  );
};
