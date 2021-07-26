import { SetStateAction, useRef, Dispatch, useState } from 'react';

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useToast,
} from '@chakra-ui/react';

import { Currency } from '~/interfaces/Currency';

import { useCurrencies } from '~/hooks/currencies';

import { deleteCurrency } from '~/services/api/functions/deleteCurrency';

interface DeleteAlertProps {
  isOpen?: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  currency: Currency;
}

export function DeleteAlert({
  isOpen = false,
  setIsOpen,
  currency,
}: DeleteAlertProps) {
  const toast = useToast();
  const cancelRef = useRef();
  const { setCurrencies } = useCurrencies();

  const [isLoading, setIsLoading] = useState(false);

  async function handleDeleteCurrency() {
    try {
      setIsLoading(true);

      await new Promise(resolve => setTimeout(resolve, 2000));
      await deleteCurrency({ code: currency.code });

      setCurrencies(oldState => {
        const newState = Array.from(
          new Set(
            oldState.filter(oldCurrency => oldCurrency.code !== currency.code),
          ),
        );

        return newState;
      });

      setIsOpen(false);
      toast({
        title: 'Delete successfully deleted',
        position: 'top-right',
        duration: 4000,
        status: 'success',
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Delete currency error',
        position: 'top-right',
        duration: 4000,
        status: 'error',
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={() => setIsOpen(false)}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="medium">
            Delete Currency
          </AlertDialogHeader>

          <AlertDialogBody>
            Are you sure? You can&apos;t undo this action afterwards.
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button
              ref={cancelRef}
              onClick={() => setIsOpen(false)}
              fontWeight="medium"
            >
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={handleDeleteCurrency}
              ml={3}
              fontWeight="medium"
              isLoading={isLoading}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
