import { Box, BoxProps, Button, ButtonProps, Text } from '@chakra-ui/react';

interface SwitchButtonProps extends ButtonProps {
  containerStyles?: BoxProps;
}

export function SwitchButton({ containerStyles, ...rest }: SwitchButtonProps) {
  return (
    <Box {...containerStyles}>
      <Button variant="outline" borderRadius="100%" w="50px" h="50px" {...rest}>
        <Text />
      </Button>
    </Box>
  );
}
