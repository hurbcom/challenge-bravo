import { Box, Button, Icon } from '@chakra-ui/react';

import {
  Control,
  FieldValues,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
} from 'react-hook-form';
import { BsArrowLeftRight } from 'react-icons/bs';

import { originalCurrencyCodes } from '~/utils/originalCurrencyCodes';

import { Input } from '../Form/Input';
import { Select } from '../Form/Select';
import { CurrencyLabel } from './CurrencyLabel';

interface FieldsProps {
  setValue: UseFormSetValue<FieldValues>;
  getValues: UseFormGetValues<FieldValues>;
  register: UseFormRegister<FieldValues>;
  control: Control<FieldValues>;
}

export function Fields({
  setValue,
  getValues,
  register,
  control,
}: FieldsProps) {
  function switchValues() {
    const fromValue = getValues('from');
    const toValue = getValues('to');

    setValue('from', toValue);
    setValue('to', fromValue);
  }

  function renderSelectOptions() {
    return originalCurrencyCodes.map(currencyCode => ({
      value: currencyCode,
      label: <CurrencyLabel currencyCode={currencyCode} />,
    }));
  }

  return (
    <>
      <Input
        name="amount"
        type="number"
        label="Amount"
        {...register('amount')}
      />
      <Select
        name="from"
        label="From"
        control={control}
        {...register('from')}
        options={renderSelectOptions()}
        defaultValue={{
          value: 'usd',
          label: <CurrencyLabel currencyCode="usd" />,
        }}
      />

      <Box mb="26px">
        <Button
          variant="outline"
          borderRadius="100%"
          w="50px"
          h="50px"
          onClick={switchValues}
        >
          <Icon as={BsArrowLeftRight} color="blue.500" fontSize="1.2rem" />
        </Button>
      </Box>

      <Select
        name="to"
        label="To"
        control={control}
        {...register('to')}
        options={renderSelectOptions()}
        defaultValue={{
          value: 'brl',
          label: <CurrencyLabel currencyCode="brl" />,
        }}
      />
    </>
  );
}
