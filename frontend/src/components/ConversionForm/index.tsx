import { useState } from 'react';

import { Box, Button, Flex, Skeleton, useToast } from '@chakra-ui/react';

import { useForm } from 'react-hook-form';

import { useCurrencies } from '~/hooks/currencies';

import { convertCurrency } from '~/services/api/functions/convertCurrency';

import { Fields } from './Fields';
import { Result } from './Result';

interface FormData {
  amount: number;
  from: {
    label: string;
    value: string;
  };
  to: {
    label: string;
    value: string;
  };
}

export function ConversionForm() {
  const { isLoading } = useCurrencies();

  const [result, setResult] = useState<number | null>(null);
  const [resultFrom, setResultFrom] = useState<string | null>(null);
  const [resultTo, setResultTo] = useState<string | null>(null);
  const [resultAmount, setResultAmount] = useState<number | null>(null);

  const {
    register,
    watch,
    handleSubmit,
    setValue,
    getValues,
    formState,
    control,
  } = useForm();
  const toast = useToast();

  async function onSubmit({
    amount,
    from: fromOption,
    to: toOption,
  }: FormData) {
    try {
      setResult(null);

      const from = fromOption?.value;
      const to = toOption?.value;

      const resultData = await convertCurrency({ from, to, amount });
      setResult(resultData);
      setResultFrom(from);
      setResultTo(to);
      setResultAmount(Number(amount));
    } catch (error) {
      toast({
        title: 'Currency conversion error',
        position: 'top-right',
        duration: 4000,
        status: 'error',
        isClosable: true,
      });
    }
  }

  return (
    <Flex direction="column" as="form" onSubmit={handleSubmit(onSubmit)}>
      <Skeleton
        isLoaded={!isLoading}
        as={Flex}
        gridGap="4"
        align="flex-end"
        w="100%"
        direction={['column', 'column', 'row']}
      >
        <Fields
          setValue={setValue}
          getValues={getValues}
          register={register}
          watch={watch}
          control={control}
        />
      </Skeleton>

      <Flex
        justify="space-between"
        direction={['column-reverse', 'column-reverse', 'row']}
        gridGap="4"
      >
        <Box minH="124px">
          <Result
            isLoading={formState.isSubmitting}
            result={result}
            from={resultFrom?.toUpperCase()}
            to={resultTo?.toUpperCase()}
            amount={resultAmount}
          />
        </Box>

        <Button
          alignSelf="flex-end"
          colorScheme="blue"
          size="lg"
          fontSize="1rem"
          fontWeight="500"
          type="submit"
          isLoading={formState.isSubmitting}
        >
          Convert
        </Button>
      </Flex>
    </Flex>
  );
}
