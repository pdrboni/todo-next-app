import { CloseButton, Dialog, Portal } from '@chakra-ui/react';
import React from 'react';

function DialogStandardComponent({
  open,
  setOpen,
  title,
  body,
  closeTrigger = <CloseButton size="sm" />,
  footer,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  body: React.ReactNode;
  closeTrigger?: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <Dialog.Root
      size={'md'}
      open={open}
      onOpenChange={setOpen ? (details) => setOpen(details.open) : undefined}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>{title}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>{body}</Dialog.Body>
            <Dialog.Footer>{footer}</Dialog.Footer>
            <Dialog.CloseTrigger asChild>{closeTrigger}</Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

export default DialogStandardComponent;
