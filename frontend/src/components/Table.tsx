import { ReactNode, ReactElement, useMemo } from 'react';

import {
  Table as ChakraTable,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  TableColumnHeaderProps,
  Flex,
} from '@chakra-ui/react';

type ColumnType = ReactNode | ReactElement | string | number;
type ColumnStyle = TableColumnHeaderProps | null;

interface TableProps<T> {
  keyExtractor(item: T): string;
  data: T[];
  columns: ColumnType[];
  columnsThStyles?: ColumnStyle[];
  columnsTdStyles?: ColumnStyle[];
  renderRow(item: T, index: number): ColumnType[];
}

export function Table<T>({
  keyExtractor,
  data,
  columns,
  columnsThStyles,
  columnsTdStyles,
  renderRow,
}: TableProps<T>) {
  const formattedRows = useMemo(
    () =>
      data.map((a, rowIndex) => ({
        key: `tr-${keyExtractor(a)}`,
        data: data.map(renderRow)[rowIndex].map((column, index) => ({
          key: `${index}-column-${keyExtractor(a)}`,
          element: column,
        })),
      })),
    [keyExtractor, data, renderRow],
  );

  const formattedColumns = useMemo(
    () =>
      columns.map((column, index) => ({
        key: `column-${index}`,
        element: column,
      })),
    [columns],
  );

  return (
    <Flex flex="1" maxW="100%" overflow={['scroll', 'auto']}>
      <ChakraTable colorScheme="whiteAlpha">
        <Thead>
          <Tr>
            {formattedColumns.map((column, index) => (
              <Th
                key={column.key}
                {...(columnsThStyles && columnsThStyles[index]
                  ? columnsThStyles[index]
                  : {})}
              >
                {column.element}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {formattedRows.map(tr => (
            <Tr key={tr.key}>
              {tr.data.map((td, index) => (
                <Td
                  key={td.key}
                  {...(columnsTdStyles && columnsTdStyles[index]
                    ? columnsTdStyles[index]
                    : {})}
                >
                  {td.element}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </ChakraTable>
    </Flex>
  );
}
