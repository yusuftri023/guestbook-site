"use client";

import useMediaQuery from "@/lib/hooks/use-media-query";
import { cn } from "@/lib/utils";
import * as Dialog from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { Drawer } from "vaul";

export default function Modal({
  children,
  className,
  showModal,
  setShowModal,
  onCloseModal,
  withCloseButton,
}: {
  children: React.ReactNode;
  className?: string;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  onCloseModal?: () => void;
  withCloseButton?: boolean;
}) {
  const { isMobile } = useMediaQuery();

  const onClose = () => {
    setShowModal(false);
    onCloseModal?.();
  };

  if (isMobile) {
    return (
      <Drawer.Root
        open={showModal}
        onOpenChange={setShowModal}
        onClose={onClose}
      >
        <Drawer.Overlay className="fixed inset-0 z-40 bg-gray-100 bg-opacity-10 backdrop-blur" />
        <Drawer.Portal>
          <Drawer.Content
            className={cn(
              "fixed bottom-0 left-0 right-0 z-50 mt-24 rounded-t-[10px] border-t border-gray-200 bg-white",
              className,
            )}
          >
            <div className="sticky top-0 z-20 flex w-full items-center justify-center rounded-t-[10px] bg-inherit">
              <div className="my-3 h-1 w-12 rounded-full bg-gray-300" />
            </div>
            {children}
          </Drawer.Content>
          <Drawer.Overlay />
        </Drawer.Portal>
      </Drawer.Root>
    );
  }
  return (
    <Dialog.Root open={showModal} onOpenChange={setShowModal}>
      <Dialog.Portal>
        <Dialog.Overlay
          // for detecting when there's an active opened modal
          id="modal-backdrop"
          className="animate-fade-in fixed inset-0 z-40 bg-gray-100 bg-opacity-50 backdrop-blur-md"
        />
        <Dialog.Content
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
          className={cn(
            "animate-scale-in fixed inset-0 z-40 m-auto max-h-fit w-full max-w-md overflow-hidden border border-gray-200 bg-white p-0 shadow-xl md:rounded-2xl",
            className,
          )}
        >
          <Dialog.Description className="hidden">
            Confirm Modal
          </Dialog.Description>
          <Dialog.Title className="hidden">Confirm Modal</Dialog.Title>
          {children}
          {withCloseButton && (
            <button
              className="absolute right-2 top-0 p-2 text-lg text-gray-500 hover:opacity-75"
              onClick={onClose}
            >
              <XIcon />
            </button>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
