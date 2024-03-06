"use client";

import { useStoreModal } from "@/store/modal";
import { useEffect } from "react";

export default function RootPage() {
  const { isOpen, onOpen } = useStoreModal();

  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);

  return null
}
