import { ReactElement } from 'react';

import {
  Tabs as ChakraTabs,
  TabsProps as ChakraTabsProps,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  TabPanelsProps,
  TabPanelProps,
} from '@chakra-ui/react';

import { renderToString } from 'react-dom/server';

export interface TabsProps extends Omit<ChakraTabsProps, 'children'> {
  tabList: {
    title: string;
  }[];
  tabPanels: ReactElement[];
  tabPanelsContainerStyles?: TabPanelsProps;
  tabPanelStyles?: TabPanelProps[];
}

export function Tabs({
  tabList = [],
  tabPanels = [],
  tabPanelsContainerStyles,
  tabPanelStyles,
  ...rest
}: TabsProps) {
  return (
    <ChakraTabs w="100%" variant="enclosed" {...rest}>
      <TabList bg="gray.50" border="none">
        {tabList.map(tab => (
          <Tab
            key={tab.title}
            h="56px"
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

      <TabPanels {...tabPanelsContainerStyles}>
        {tabPanels.map((tabPanel, index) => (
          <TabPanel
            key={renderToString(tabPanel)}
            {...(tabPanelStyles ? tabPanelStyles[index] : {})}
          >
            {tabPanel}
          </TabPanel>
        ))}
      </TabPanels>
    </ChakraTabs>
  );
}
