import { AppProps } from 'next/app';

import { ChakraProvider } from '@chakra-ui/react';

import { theme } from '~/themes';

import { AppProvider } from '~/hooks';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <AppProvider>
        <Component {...pageProps} />
      </AppProvider>
    </ChakraProvider>
  );
}

export default MyApp;
