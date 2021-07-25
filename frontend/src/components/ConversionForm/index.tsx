import { Button, Flex } from '@chakra-ui/react';

import { useForm } from 'react-hook-form';

import { Input } from '../Form/Input';
import { SwitchButton } from './SwitchButton';

interface FormData {
  amount: number;
  from: string;
  to: string;
}

export function ConversionForm() {
  const { register, handleSubmit, setValue, getValues, formState } = useForm();

  async function onSubmit({ amount, from, to }: FormData) {
    await new Promise(resolve => setInterval(resolve, 3000));
    console.log(amount, from, to);
  }

  function switchValues() {
    const fromValue = getValues('from');
    const toValue = getValues('to');

    setValue('from', toValue);
    setValue('to', fromValue);
  }

  return (
    <Flex direction="column" as="form" onSubmit={handleSubmit(onSubmit)}>
      <Flex
        gridGap="4"
        align="flex-end"
        w="100%"
        direction={['column', 'column', 'row']}
      >
        <Input
          name="amount"
          type="number"
          label="Amount"
          {...register('amount')}
        />
        <Input name="from" label="From" {...register('from')} />

        <SwitchButton mb="26px" onClick={switchValues} />

        <Input name="to" label="To" {...register('to')} />
      </Flex>
      <Button
        mt="8"
        colorScheme="blue"
        alignSelf="flex-end"
        size="lg"
        fontSize="1rem"
        fontWeight="500"
        type="submit"
        isLoading={formState.isSubmitting}
      >
        Convert
      </Button>
    </Flex>
  );
}
