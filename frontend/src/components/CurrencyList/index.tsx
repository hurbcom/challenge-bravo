import { useState } from 'react';

import { Text, Button, Flex, Divider, Skeleton } from '@chakra-ui/react';

import { Currency } from '~/interfaces/Currency';

import { useCurrencies } from '~/hooks/currencies';

import { formatCurrency } from '~/functions/formatCurrency';

import { CurrencyLabel } from '../ConversionForm/CurrencyLabel';
import { Table } from '../Table';
import { ActionDropdown } from './ActionDropdown';
import { AddModal } from './AddModal';

export function CurrencyList() {
  const { currencies, isLoading } = useCurrencies();

  const [addModalIsOpen, setAddModalIsOpen] = useState(false);

  return (
    <>
      <Flex direction="column">
        <Skeleton isLoaded={!isLoading}>
          <Table<Currency>
            data={currencies}
            keyExtractor={item => item.code}
            columnsThStyles={[null, null, null, { w: '2' }]}
            columns={['#', 'Backing', 'B. Value', '']}
            renderRow={currency => [
              <Text fontWeight="bold">{currency.code.toUpperCase()}</Text>,
              <CurrencyLabel currencyCode={currency.backingCurrency.code} />,
              <Text>
                {formatCurrency({
                  value: currency.backingCurrency.amount,
                  currency: currency.backingCurrency.code,
                })}
              </Text>,
              <ActionDropdown currency={currency} />,
            ]}
          />
        </Skeleton>

        <Divider my="4" />

        <Button
          alignSelf="flex-end"
          colorScheme="blue"
          size="lg"
          fontSize="1rem"
          fontWeight="500"
          onClick={() => {
            setAddModalIsOpen(true);
          }}
        >
          Add
        </Button>
      </Flex>

      <AddModal isOpen={addModalIsOpen} setIsOpen={setAddModalIsOpen} />
    </>
  );
}
