import { CloseButton, Dialog, Portal } from '@chakra-ui/react';
import React from 'react';

//handleSubmit(onSubmit)

function DialogFormComponent({
  open,
  setOpen,
  handleSubmit,
  title,
  body,
  closeTrigger = <CloseButton />,
  footer,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  handleSubmit: () => any; // eslint-disable-line
  title: string;
  body: React.ReactNode;
  closeTrigger: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <Dialog.Root
      size={'md'}
      open={open}
      onOpenChange={(details) => setOpen(details.open)}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>{title}</Dialog.Title>
            </Dialog.Header>
            <form action="" onSubmit={handleSubmit}>
              <Dialog.Body>{body}</Dialog.Body>
              <Dialog.Footer>{footer}</Dialog.Footer>
            </form>
            <Dialog.CloseTrigger asChild>{closeTrigger}</Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

export default DialogFormComponent;
