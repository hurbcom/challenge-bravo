import { useState } from 'react';

import {
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Icon,
  Button,
} from '@chakra-ui/react';

import { BsThreeDots, BsTrash, BsPencil } from 'react-icons/bs';

import { Currency } from '~/interfaces/Currency';

import { DeleteAlert } from './DeleteAlert';
import { EditModal } from './EditModal';

interface ActionDropdownProps {
  currency: Currency;
}

export function ActionDropdown({ currency }: ActionDropdownProps) {
  const [deleteAlertIsOpen, setDeleteAlertIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);

  return (
    <>
      <Menu>
        <MenuButton as={Button}>
          <Icon as={BsThreeDots} />
        </MenuButton>
        <MenuList>
          <MenuItem
            onClick={() => {
              setEditModalIsOpen(true);
            }}
          >
            <Icon as={BsPencil} mr="4" /> Edit
          </MenuItem>
          <MenuItem
            color="red.500"
            onClick={() => {
              setDeleteAlertIsOpen(true);
            }}
          >
            <Icon as={BsTrash} mr="4" /> Delete
          </MenuItem>
        </MenuList>
      </Menu>

      <DeleteAlert
        isOpen={deleteAlertIsOpen}
        setIsOpen={setDeleteAlertIsOpen}
        currency={currency}
      />

      <EditModal
        isOpen={editModalIsOpen}
        setIsOpen={setEditModalIsOpen}
        currency={currency}
      />
    </>
  );
}
