"use client";

import { useMediaQuery } from "@/hooks/media-query";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

interface ToggleCtx {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
}

const ToggleContext = createContext<ToggleCtx>({} as ToggleCtx);
export const useToggle = (): ToggleCtx => useContext(ToggleContext);

export const ToggleProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const onClose = useCallback(() => setOpen(false), []);
  const isLaptop = useMediaQuery("(min-width: 1024px)");

  useEffect(() => {
    if (isLaptop) {
      setOpen(false);
    }
  }, [isLaptop]);

  return (
    <ToggleContext.Provider value={{ isOpen, setOpen, onClose }}>
      {children}
    </ToggleContext.Provider>
  );
};
