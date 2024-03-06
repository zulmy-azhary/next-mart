"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ModalProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
};

export const Modal: React.FC<ModalProps> = (props) => {
  const { title, description, children, isOpen, onClose } = props;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};
