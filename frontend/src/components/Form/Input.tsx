import { forwardRef, ForwardRefRenderFunction } from 'react';

import {
  Text,
  Input as ChakraInput,
  InputProps as ChakraInputProps,
  FormErrorMessage,
  Box,
  FormControl,
} from '@chakra-ui/react';

import { FieldError } from 'react-hook-form';

interface InputProps extends ChakraInputProps {
  name: string;
  label?: string;
  error?: FieldError;
}

const InputBase: ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
  { name, label, error, ...rest },
  ref,
) => {
  return (
    <FormControl isInvalid={!!error}>
      {label && <Text fontWeight="500">{label}</Text>}
      <Box minH="76px">
        <ChakraInput h="50px" name={name} id={name} ref={ref} {...rest} />
        {error?.message && (
          <FormErrorMessage color="red.400" fontSize="xs">
            {error?.message}
          </FormErrorMessage>
        )}
      </Box>
    </FormControl>
  );
};

export const Input = forwardRef(InputBase);
