import { useMemo } from 'react';

import { Heading, Skeleton, VStack, Text } from '@chakra-ui/react';

import { FieldValues, UseFormGetValues } from 'react-hook-form';

import { formatCurrency } from '~/functions/formatCurrency';

interface ResultProps {
  isLoading?: boolean;
  result: null | number;
  getValues: UseFormGetValues<FieldValues>;
}

export function Result({ isLoading, result, getValues }: ResultProps) {
  const from = getValues('from').value.toUpperCase();
  const to = getValues('to').value.toUpperCase();
  const amount = Number(getValues('amount'));

  const unitResultValue = useMemo(
    () => formatCurrency({ value: result / amount, currency: to }),
    [result, amount],
  );

  const inverseResultValue = useMemo(
    () => formatCurrency({ value: 1 / (result / amount), currency: from }),
    [result, amount],
  );

  return (
    <>
      {(isLoading || result) && (
        <VStack align="flex-start">
          <Skeleton isLoaded={!isLoading} w="100px" minW="100px">
            <Text fontWeight="600" color="gray.500">
              {formatCurrency({
                currency: from,
                value: amount,
              })}{' '}
              =
            </Text>
          </Skeleton>

          <Skeleton isLoaded={!isLoading}>
            <Heading size="lg" color="gray.700" minW="120px">
              {formatCurrency({
                currency: to,
                value: result,
              })}
            </Heading>
          </Skeleton>

          <Skeleton isLoaded={!isLoading} minW="120px">
            <Text color="gray.500" fontWeight="300">
              {formatCurrency({ value: 1, currency: to })} ={' '}
              {inverseResultValue}
            </Text>
          </Skeleton>

          <Skeleton isLoaded={!isLoading} minW="120px" h="16px">
            {amount !== 1 && (
              <Text color="gray.500" fontWeight="300" mt="-8px">
                {formatCurrency({ value: 1, currency: from })} ={' '}
                {unitResultValue}
              </Text>
            )}
          </Skeleton>
        </VStack>
      )}
    </>
  );
}
