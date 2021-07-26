import dynamic from 'next/dynamic';

import { Flex, Box, Heading, Text } from '@chakra-ui/react';

import { FaCoins } from 'react-icons/fa';
import { RiCoinsFill } from 'react-icons/ri';

import { ConversionForm } from '~/components/ConversionForm';
import { TabsProps } from '~/components/Tabs';

const Tabs = dynamic<TabsProps>(
  () => import('~/components/Tabs').then(mod => mod.Tabs),
  {
    ssr: false,
  },
);

const CurrencyList = dynamic(
  () => import('~/components/CurrencyList').then(mod => mod.CurrencyList),
  {
    ssr: false,
  },
);

export default function Home() {
  return (
    <Flex w="100%" h={['unset', 'unset', '100vh']} overflow="hidden">
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
            mt="8"
            mb="4rem"
          >
            <Tabs
              tabList={[
                { title: 'Convert', Icon: RiCoinsFill },
                { title: 'Currencies', Icon: FaCoins },
              ]}
              tabPanelsContainerStyles={{
                px: ['2', '4', '6'],
                py: ['4', '6', '8'],
              }}
              tabPanels={[<ConversionForm />, <CurrencyList />]}
            />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}
