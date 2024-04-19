import React, { useState } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';

import { FormControl, Input, Flex, Button } from '@chakra-ui/react';
import CategoryApiManager from '../../../api/CategoryApiManager';

interface FormCreateModifyCategoryProps {
  onCloseModal: () => void;
}

function FormCreateModifyCategory({
  onCloseModal,
}: FormCreateModifyCategoryProps) {
  const [categoryName, setCategoryName] = useState<string>('');
  // const [icon, setIcon] = useState<string>(''); -> Assuming icon is a string representing icon name or URL

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCategory = {
      categoryName,
    };

    const fetchData = async () => {
      try {
        await CategoryApiManager.create(newCategory.categoryName);
        onCloseModal();
      } catch (error) {
        console.error('Erreur lors de la création des données :', error);
      }
    };

    fetchData();
  };

  return (
    <FormControl>
      <Flex flexDirection="column" gap={4} borderRadius={8}>
        <FormControl isRequired>
          <Input
            placeholder="Nom de la catégorie"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            focusBorderColor="#166879"
            isRequired
            bg="white"
          />
        </FormControl>
        <Button bg="#166879" color="white" onClick={handleSubmit}>
          Créer une catégorie
        </Button>
      </Flex>
    </FormControl>
  );
}

FormCreateModifyCategory.propTypes = {
  onCloseModal: PropTypes.func.isRequired,
};

export default FormCreateModifyCategory;