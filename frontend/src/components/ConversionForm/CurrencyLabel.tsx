import Image from 'next/image';

import { Flex, Text } from '@chakra-ui/react';

import {
  OriginalCurrencyCode,
  originalCurrencyCodes,
} from '~/utils/originalCurrencyCodes';

interface CurrencyLabel {
  currencyCode: OriginalCurrencyCode;
}

export function CurrencyLabel({ currencyCode }: CurrencyLabel) {
  const svgFilename = originalCurrencyCodes.includes(currencyCode)
    ? currencyCode
    : 'default';

  return (
    <Flex>
      <Image
        src={`/icons/currencies/${svgFilename}.svg`}
        alt={currencyCode}
        width="28px"
        height="20px"
      />
      <Text ml="4">{currencyCode.toUpperCase()}</Text>
    </Flex>
  );
}
