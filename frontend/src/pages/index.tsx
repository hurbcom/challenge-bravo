import dynamic from 'next/dynamic';

import { Flex, Box, Heading, Text } from '@chakra-ui/react';

import { ConversionForm } from '~/components/ConversionForm';
import { TabsProps } from '~/components/Tabs';

const Tabs = dynamic<TabsProps>(
  () => import('~/components/Tabs').then(mod => mod.Tabs),
  {
    ssr: false,
  },
);

export default function Home() {
  return (
    <Flex w="100%" h={['unset', 'unset', '100vh']}>
      <Box bg="blue.800" w="100%" h="45vh" position="absolute" />

      <Flex
        w="100%"
        maxW="1140px"
        position="relative"
        px={['2', '4', '6']}
        justify="center"
        margin="0 auto"
      >
        <Flex
          w="100%"
          direction="column"
          align="center"
          mt={['2rem', '4rem', '13vh']}
        >
          <Heading color="white" fontWeight="500" fontSize="2rem">
            Bravo Currency Conversion
          </Heading>
          <Text color="white" fontSize="1rem">
            Free tool for converting values between multiple currencies!
          </Text>

          <Flex
            w="100%"
            minH="282px"
            bg="white"
            boxShadow="2px 2px 16px #0007"
            borderRadius="12"
            overflow="hidden"
            mt="8"
            mb={['4rem', '4rem', '0']}
          >
            <Tabs
              tabList={[{ title: 'Convert' }, { title: 'Currencies' }]}
              tabPanels={[<ConversionForm />, <p>two!</p>]}
            />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}
