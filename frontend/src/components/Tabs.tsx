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
  Icon,
} from '@chakra-ui/react';

import { renderToString } from 'react-dom/server';
import { IconType } from 'react-icons/lib';

export interface TabsProps extends Omit<ChakraTabsProps, 'children'> {
  tabList: {
    title: string;
    Icon?: IconType;
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
      <TabList bg="gray.50" border="none" borderTopRadius="12">
        {tabList.map(tab => (
          <Tab
            key={tab.title}
            h="56px"
            _focus={{ outline: 0 }}
            flex="1"
            fontSize="0.9rem"
            _selected={{
              color: 'blue.500',
              bg: 'white',
              fontWeight: '500',
            }}
          >
            {tab.Icon && <Icon as={tab.Icon} fontSize="1.2rem" mr="0.5rem" />}
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
