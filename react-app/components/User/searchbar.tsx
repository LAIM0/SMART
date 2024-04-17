import React, { useState, ChangeEvent } from 'react';
import { FormControl, Input, Flex, IconButton, InputGroup, InputRightElement, useTheme } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import UserSearchProps from '../../interfaces/userSearchInterface';

const UserSearch: React.FC<UserSearchProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const theme = useTheme(); // Importez le thème

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
    // Appeler la fonction de recherche avec le nouveau terme de recherche
    onSearch(newSearchTerm);
  };

  return (
    <Flex flexDirection="column" gap="4">
      <FormControl position="relative">
        <InputGroup>
          <Input
            type="text"
            placeholder="Rechercher user"
            value={searchTerm}
            onChange={handleChange}
            
          />
          <InputRightElement>
            <IconButton
              aria-label="Rechercher"
              icon={<SearchIcon />}
              color='primary.300' // Utiliser la couleur du thème
            />
          </InputRightElement>
        </InputGroup>
      </FormControl>
    </Flex>
  );
};

export default UserSearch;
