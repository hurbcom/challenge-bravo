import { useCallback, useMemo } from 'react';

import { Box, Button, Icon } from '@chakra-ui/react';

import {
  Control,
  FieldValues,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import { BsArrowLeftRight } from 'react-icons/bs';
import { SiBitcoin, SiEthereum } from 'react-icons/si';

import { useCurrencies } from '~/hooks/currencies';

import { originalCurrencyCodes } from '~/utils/originalCurrencyCodes';

import { Input } from '../Form/Input';
import { Select } from '../Form/Select';
import { CurrencyLabel } from './CurrencyLabel';

interface FieldsProps {
  setValue: UseFormSetValue<FieldValues>;
  getValues: UseFormGetValues<FieldValues>;
  register: UseFormRegister<FieldValues>;
  watch: UseFormWatch<FieldValues>;
  control: Control<FieldValues>;
}

export function Fields({
  setValue,
  getValues,
  register,
  watch,
  control,
}: FieldsProps) {
  const { currencyCodes } = useCurrencies();

  const currencyIcons = {
    brl: 'R$',
    usd: '$',
    eur: '€',
    btc: <SiBitcoin />,
    eth: <SiEthereum />,
    default: <AiOutlineQuestionCircle />,
  };

  const watchedFromValue = watch('from')?.value || 'usd';
  const amountInputLeftIcon = useMemo(
    () => currencyIcons[watchedFromValue] || currencyIcons.default,
    [watchedFromValue],
  );

  function switchValues() {
    const from = getValues('from');
    const to = getValues('to');

    setValue('from', to);
    setValue('to', from);
  }

  const renderSelectOptions = useCallback(() => {
    return [...originalCurrencyCodes, ...(currencyCodes || [])].map(
      currencyCode => ({
        value: currencyCode,
        label: <CurrencyLabel currencyCode={currencyCode} />,
      }),
    );
  }, [originalCurrencyCodes, currencyCodes]);

  return (
    <>
      <Input
        name="amount"
        type="number"
        step="0.000000000001"
        label="Amount"
        isRequired
        defaultValue={1.0}
        leftIcon={amountInputLeftIcon}
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
          transform={['rotate(90deg)', 'rotate(90deg)', 'unset']}
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
