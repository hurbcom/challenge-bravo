import { ReactElement } from 'react';

import {
  Tabs as ChakraTabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from '@chakra-ui/react';

import { renderToString } from 'react-dom/server';

export interface TabsProps {
  tabList: {
    title: string;
  }[];
  tabPanels: ReactElement[];
}

export function Tabs({ tabList = [], tabPanels = [] }: TabsProps) {
  return (
    <ChakraTabs w="100%" variant="enclosed">
      <TabList bg="gray.50" border="none">
        {tabList.map(tab => (
          <Tab
            key={tab.title}
            _focus={{ outline: 0 }}
            flex="1"
            _selected={{
              color: 'blue.500',
              bg: 'white',
              fontWeight: '500',
            }}
          >
            {tab.title}
          </Tab>
        ))}
      </TabList>

      <TabPanels px="6" py="8">
        {tabPanels.map(tabPanel => (
          <TabPanel key={renderToString(tabPanel)}>{tabPanel}</TabPanel>
        ))}
      </TabPanels>
    </ChakraTabs>
  );
}
