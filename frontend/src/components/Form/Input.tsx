import { forwardRef, ForwardRefRenderFunction, ReactNode } from 'react';

import {
  Text,
  Input as ChakraInput,
  InputProps as ChakraInputProps,
  FormErrorMessage,
  Box,
  FormControl,
  InputGroup,
  InputLeftAddon,
} from '@chakra-ui/react';

import { FieldError } from 'react-hook-form';

interface InputProps extends ChakraInputProps {
  name: string;
  label?: string;
  error?: FieldError;
  leftIcon?: ReactNode;
}

const InputBase: ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
  { name, label, error, leftIcon, ...rest },
  ref,
) => {
  return (
    <FormControl isInvalid={!!error}>
      {label && <Text fontWeight="500">{label}</Text>}
      <Box minH="76px">
        <InputGroup>
          {leftIcon && (
            <InputLeftAddon h="50px" justifyContent="center">
              {leftIcon}
            </InputLeftAddon>
          )}

          <ChakraInput h="50px" name={name} id={name} ref={ref} {...rest} />
        </InputGroup>
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
