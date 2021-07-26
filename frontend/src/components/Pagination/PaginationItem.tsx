import { Button } from '@chakra-ui/react';

interface PaginationItemProps {
  isCurrent?: boolean;
  pageNumber: number;
  onPageChange: (page: number) => void;
}

export function PaginationItem({
  isCurrent = false,
  pageNumber,
  onPageChange,
}: PaginationItemProps) {
  if (isCurrent) {
    return (
      <Button
        size="sm"
        fontSize="xs"
        w="4"
        colorScheme="blue"
        disabled
        _disabled={{ bgColor: 'blue.400', cursor: 'default' }}
      >
        {pageNumber}
      </Button>
    );
  }

  return (
    <Button
      size="sm"
      fontSize="xs"
      w="4"
      bgColor="gray.400"
      _hover={{ bg: 'gray.500' }}
      onClick={() => onPageChange(pageNumber)}
    >
      {pageNumber}
    </Button>
  );
}
