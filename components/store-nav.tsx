"use client";

import { CaretSortIcon, CheckIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";
import { useStoreModal } from "@/store/modal";
import { useParams, useRouter } from "next/navigation";
import { MdStorefront } from "react-icons/md";
import { useToggle } from "@/providers/toggle.provider";

type StoreNavProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger> & {
  stores: Record<string, any>[];
};

export const StoreNav: React.FC<StoreNavProps> = (props) => {
  const { className, stores = [] } = props;

  const { onClose } = useToggle();
  const { onOpen } = useStoreModal();
  const [open, setOpen] = useState(false);
  const params = useParams();
  const router = useRouter();

  const formattedStores = stores.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const currentStore = formattedStores.find((item) => item.value === params.storeId);

  const onStoreSelect = (store: { value: string; label: string }) => {
    setOpen(false);
    router.push(`/${store.value}`);
  };

  const onCreateStore = () => {
    onClose();
    setOpen(false);
    onOpen();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full lg:w-[200px] justify-between", className)}
        >
          <MdStorefront className="mr-2 size-4" />
          {currentStore?.label}
          <CaretSortIcon className="ml-auto size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search store..." className="h-9" />
            <CommandEmpty>No store found.</CommandEmpty>
            <CommandGroup>
              {formattedStores.map((store) => (
                <CommandItem
                  key={store.value}
                  value={store.value}
                  onSelect={() => onStoreSelect(store)}
                >
                  <MdStorefront className="mr-2 size-4" />
                  {store.label}
                  {currentStore?.value === store.value ? (
                    <CheckIcon className="ml-auto size-4" />
                  ) : null}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={onCreateStore}
              >
                <PlusCircledIcon className="mr-2 size-4" />
                Create Store
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
