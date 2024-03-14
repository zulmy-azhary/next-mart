"use client";

import { useMediaQuery } from "@/hooks/media-query";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { RxCross2, RxHamburgerMenu } from "react-icons/rx";
import { useToggle } from "@/providers/toggle.provider";

type NavProps = {
  header: React.ReactNode;
  children: React.ReactNode;
};

export const Nav: React.FC<NavProps> = (props) => {
  const { header, children } = props;

  const isLaptop = useMediaQuery("(min-width: 1024px)");
  const { isOpen, setOpen } = useToggle();

  if (isLaptop) {
    return (
      <>
        {header}
        {children}
      </>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <RxHamburgerMenu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col gap-y-10">
        <div className="flex justify-between items-center gap-x-2 md:gap-x-4">
          {header}
          <SheetClose asChild>
            <Button variant="ghost" size="icon">
              <RxCross2 className="size-5" />
            </Button>
          </SheetClose>
        </div>
        {children}
      </SheetContent>
    </Sheet>
  );
};
