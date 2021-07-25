import { forwardRef, ForwardRefRenderFunction, ReactNode } from 'react';

import {
  Text,
  // Select as ChakraSelect,
  // SelectProps as ChakraSelectProps,
  FormErrorMessage,
  Box,
  FormControl,
} from '@chakra-ui/react';

import { FieldError, Controller, Control, FieldValues } from 'react-hook-form';
import ReactSelect from 'react-select';

export type Option = {
  value: string | number;
  label: ReactNode;
};

interface SelectProps {
  name: string;
  label?: string;
  error?: FieldError;
  control: Control<FieldValues>;
  options: Option[];
  defaultValue?: Option;
}
const SelectBase: ForwardRefRenderFunction<HTMLSelectElement, SelectProps> = (
  { name: originalName, label, error, control, options, defaultValue, ...rest },
  ref,
) => {
  return (
    <FormControl isInvalid={!!error}>
      {label && <Text fontWeight="500">{label}</Text>}
      <Box minH="76px">
        <Controller
          {...rest}
          control={control}
          name={originalName}
          defaultValue={defaultValue}
          render={({ field: { onChange, onBlur, value, name } }) => (
            <ReactSelect
              id={name}
              name={name}
              inputRef={ref}
              onChange={onChange}
              onBlur={onBlur}
              options={options}
              value={value}
              styles={{
                control: provided => ({
                  ...provided,
                  height: '50px',
                  borderColor: 'none',
                  ':hover': {
                    borderColor: '#0033',
                  },
                }),
              }}
            />
          )}
        />

        {error?.message && (
          <FormErrorMessage color="red.400" fontSize="xs">
            {error?.message}
          </FormErrorMessage>
        )}
      </Box>
    </FormControl>
  );
};

export const Select = forwardRef(SelectBase);
