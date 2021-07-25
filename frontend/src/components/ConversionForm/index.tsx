import { useState } from 'react';

import {
  Box,
  Button,
  Flex,
  Text,
  useToast,
  Heading,
  Skeleton,
  VStack,
} from '@chakra-ui/react';

import { useForm } from 'react-hook-form';

import { convertCurrency } from '~/services/api/functions/convertCurrency';

import { Input } from '../Form/Input';
import { SwitchButton } from './SwitchButton';

interface FormData {
  amount: number;
  from: string;
  to: string;
}

export function ConversionForm() {
  const [result, setResult] = useState<number | null>(null);

  const { register, handleSubmit, setValue, getValues, formState } = useForm();
  const toast = useToast();

  async function onSubmit({ amount, from, to }: FormData) {
    try {
      setResult(null);

      const resultData = await convertCurrency({ from, to, amount });
      setResult(resultData);
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

  function switchValues() {
    const fromValue = getValues('from');
    const toValue = getValues('to');

    setValue('from', toValue);
    setValue('to', fromValue);
  }

  return (
    <Flex direction="column" as="form" onSubmit={handleSubmit(onSubmit)}>
      <Flex
        gridGap="4"
        align="flex-end"
        w="100%"
        direction={['column', 'column', 'row']}
      >
        <Input
          name="amount"
          type="number"
          label="Amount"
          {...register('amount')}
        />
        <Input name="from" label="From" {...register('from')} />

        <SwitchButton mb="26px" onClick={switchValues} />

        <Input name="to" label="To" {...register('to')} />
      </Flex>

      <Flex
        justify="space-between"
        direction={['column-reverse', 'column-reverse', 'row']}
        gridGap="4"
      >
        <Box minH="88px">
          {(formState.isSubmitting || result) && (
            <VStack h={['unset', 'unset', '88px']} align="flex-start">
              <Skeleton isLoaded={!formState.isSubmitting} w="70px" minW="70px">
                <Text fontWeight="600" color="gray.500">
                  {`${getValues('amount')} ${getValues('from')}`} =
                </Text>
              </Skeleton>

              <Skeleton isLoaded={!formState.isSubmitting}>
                <Heading size="lg" color="gray.700" minW="120px">
                  {result} {getValues('to')}
                </Heading>
              </Skeleton>

              <Skeleton isLoaded={!formState.isSubmitting} minW="120px">
                <Text color="gray.500" fontWeight="300">
                  {`${getValues('amount')} ${getValues('to')}`} ={' '}
                  {getValues('amount') / result} {getValues('from')}
                </Text>
              </Skeleton>
            </VStack>
          )}
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
