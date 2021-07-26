import { Dispatch, SetStateAction } from 'react';

import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from '@chakra-ui/react';

import { useForm } from 'react-hook-form';

import { Currency } from '~/interfaces/Currency';

import { useCurrencies } from '~/hooks/currencies';

import { updateCurrency } from '~/services/api/functions/updateCurrency';

import { originalCurrencyCodes } from '~/utils/originalCurrencyCodes';

import { CurrencyLabel } from '../ConversionForm/CurrencyLabel';
import { Input } from '../Form/Input';
import { Select } from '../Form/Select';

interface FormData {
  code: string;
  amount: number;
  backingCurrency: {
    label: string;
    value: string;
  };
}

interface EditModalProps {
  isOpen?: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  currency: Currency;
}

export function EditModal({ isOpen, setIsOpen, currency }: EditModalProps) {
  const toast = useToast();
  const { setCurrencies } = useCurrencies();
  const { register, handleSubmit, formState, control, reset } = useForm();

  async function handleUpdateCurrency({
    amount,
    backingCurrency: bc,
  }: FormData) {
    try {
      const backingCurrency = {
        code: bc.value,
        amount: Number(amount),
      };

      const updatedCurrency = await updateCurrency({
        code: currency.code,
        backingCurrency,
      });

      setCurrencies(oldState => {
        const newState = Array.from(
          oldState.map(oldCurrency =>
            oldCurrency.code === updatedCurrency.code
              ? updatedCurrency
              : oldCurrency,
          ),
        );
        return newState;
      });

      setIsOpen(false);
      reset();
      toast({
        title: 'Successfully created currency',
        position: 'top-right',
        duration: 4000,
        status: 'success',
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error creating currency',
        position: 'top-right',
        duration: 4000,
        status: 'error',
        isClosable: true,
      });
    }
  }

  function renderSelectOptions() {
    return originalCurrencyCodes.map(currencyCode => ({
      value: currencyCode,
      label: <CurrencyLabel currencyCode={currencyCode} />,
    }));
  }

  return (
    <Modal onClose={() => setIsOpen(false)} size="xl" isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent
        mx="2"
        as="form"
        onSubmit={handleSubmit(handleUpdateCurrency)}
      >
        <ModalHeader fontWeight="medium">Update Currency</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex direction={['column', 'column', 'row']} gridGap="4">
            <Input
              name="code"
              label="Code"
              leftIcon="#"
              isRequired
              defaultValue={currency.code}
              isDisabled
              {...register('code')}
            />
            <Input
              name="amount"
              type="number"
              step="0.000000000001"
              label="Amount (b.c)"
              isRequired
              defaultValue={currency.backingCurrency.amount}
              {...register('amount')}
            />
          </Flex>
          <Select
            name="from"
            label="Backing currency (b.c)"
            control={control}
            {...register('backingCurrency')}
            options={renderSelectOptions()}
            defaultValue={{
              value: currency.backingCurrency.code,
              label: (
                <CurrencyLabel currencyCode={currency.backingCurrency.code} />
              ),
            }}
          />
        </ModalBody>
        <ModalFooter>
          <Button fontWeight="medium" onClick={() => setIsOpen(false)}>
            Close
          </Button>
          <Button
            fontWeight="medium"
            colorScheme="blue"
            ml="4"
            type="submit"
            isLoading={formState.isSubmitting}
          >
            Update
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
