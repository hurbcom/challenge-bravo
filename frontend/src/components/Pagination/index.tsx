import { Stack, Box, Text } from '@chakra-ui/react';

import { PaginationItem } from './PaginationItem';

interface PaginationProps {
  total: number;
  perPage?: number;
  currentPage?: number;
  onPageChange: (page: number) => void;
}

const SIBLINGS_COUNT = 1;

function generatePagesArray(from: number, to: number) {
  const pagesArray = [...new Array(to - from)]
    .map((_, index) => from + index + 1)
    .filter(page => page > 0);

  return pagesArray;
}

export function Pagination({
  total,
  perPage = 4,
  currentPage = 1,
  onPageChange,
}: PaginationProps) {
  const lastPage = Math.ceil(total / Number(perPage));

  const previousPages =
    currentPage > 1
      ? generatePagesArray(currentPage - 1 - SIBLINGS_COUNT, currentPage - 1)
      : [];

  const nextPages =
    currentPage < lastPage
      ? generatePagesArray(
          currentPage,
          Math.min(currentPage + SIBLINGS_COUNT, lastPage),
        )
      : [];

  return (
    <Stack
      direction={['column', 'row']}
      mt="8"
      justify="space-between"
      align="center"
      spacing="6"
    >
      <Box>
        <strong>{(currentPage - 1) * perPage}</strong> -{' '}
        <strong>{currentPage * perPage}</strong> de{' '}
        <strong>{lastPage * perPage}</strong>
      </Box>
      <Stack spacing="2" direction="row">
        {currentPage > 1 + SIBLINGS_COUNT && (
          <>
            <PaginationItem onPageChange={onPageChange} pageNumber={1} />
            {currentPage > 2 + SIBLINGS_COUNT && (
              <Text color="gray.300" width="8" textAlign="center">
                ...
              </Text>
            )}
          </>
        )}

        {previousPages.length > 0 &&
          previousPages.map(page => (
            <PaginationItem
              onPageChange={onPageChange}
              key={page}
              pageNumber={page}
            />
          ))}

        <PaginationItem
          onPageChange={onPageChange}
          pageNumber={currentPage}
          isCurrent
        />

        {nextPages.length > 0 &&
          nextPages.map(page => (
            <PaginationItem
              onPageChange={onPageChange}
              key={page}
              pageNumber={page}
            />
          ))}

        {currentPage + SIBLINGS_COUNT < lastPage && (
          <>
            {currentPage + SIBLINGS_COUNT + 1 < lastPage && (
              <Text color="gray.300" width="8" textAlign="center">
                ...
              </Text>
            )}
            <PaginationItem onPageChange={onPageChange} pageNumber={lastPage} />
          </>
        )}
      </Stack>
    </Stack>
  );
}
