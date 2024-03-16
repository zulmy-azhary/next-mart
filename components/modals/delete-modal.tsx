"use client";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

type DeleteModalProps = {
  title: string;
  description: string;
  isLoading: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  children?: React.ReactNode;
};

export const DeleteModal: React.FC<DeleteModalProps> = (props) => {
  const { title, description, isLoading, isOpen, onClose, onSubmit, children } = props;

  return (
    <Modal title={title} description={description} isOpen={isOpen} onClose={onClose}>
      {children}
      <div className="flex justify-end gap-x-3">
        <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" variant="destructive" disabled={isLoading} onClick={onSubmit}>
          Delete
        </Button>
      </div>
    </Modal>
  );
};
