import { useMemo, useState } from 'react';

import { Text, Button, Flex, Divider, Skeleton } from '@chakra-ui/react';

import { Currency } from '~/interfaces/Currency';

import { useCurrencies } from '~/hooks/currencies';

import { formatCurrency } from '~/functions/formatCurrency';

import { CurrencyLabel } from '../ConversionForm/CurrencyLabel';
import { Pagination } from '../Pagination';
import { Table } from '../Table';
import { ActionDropdown } from './ActionDropdown';
import { AddModal } from './AddModal';

export function CurrencyList() {
  const { currencies, isLoading } = useCurrencies();

  const [page, setPage] = useState(1);
  const [addModalIsOpen, setAddModalIsOpen] = useState(false);

  const perPage = 4;
  const currenciesPage = useMemo(
    () => currencies.slice((page - 1) * perPage, page * perPage),
    [currencies, page, perPage],
  );

  return (
    <>
      <Flex direction="column">
        <Skeleton isLoaded={!isLoading}>
          <Table<Currency>
            data={currenciesPage}
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

        <Flex
          direction={['column-reverse', 'column-reverse', 'row']}
          justify="space-between"
          gridGap="4"
        >
          <Pagination
            total={currencies.length}
            currentPage={page}
            perPage={perPage}
            onPageChange={setPage}
          />

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
      </Flex>

      <AddModal isOpen={addModalIsOpen} setIsOpen={setAddModalIsOpen} />
    </>
  );
}
