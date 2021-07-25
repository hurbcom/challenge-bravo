import {
  Text,
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
  Flex,
  Divider,
} from '@chakra-ui/react';

import { Currency } from '~/interfaces/Currency';

import { Table } from '../Table';

export interface CurrencyListProps {
  currencies: Currency[];
}

export function CurrencyList({ currencies }: CurrencyListProps) {
  return (
    <Flex direction="column">
      <Table<Currency>
        data={currencies}
        keyExtractor={item => item.code}
        columnsThStyles={[null, null, null, { w: '2' }]}
        columns={['#', 'Backing', 'B. Value', '']}
        renderRow={currency => [
          <Text fontWeight="bold">{currency.code}</Text>,
          <Text>{currency.backingCurrency.code}</Text>,
          <Text>{currency.backingCurrency.amount}</Text>,
          <Menu>
            <MenuButton as={Button}>...</MenuButton>
            <MenuList>
              <MenuItem>Edit</MenuItem>
              <MenuItem>Delete</MenuItem>
            </MenuList>
          </Menu>,
        ]}
      />

      <Divider my="4" />

      <Button
        alignSelf="flex-end"
        colorScheme="blue"
        size="lg"
        fontSize="1rem"
        fontWeight="500"
      >
        Add
      </Button>
    </Flex>
  );
}
