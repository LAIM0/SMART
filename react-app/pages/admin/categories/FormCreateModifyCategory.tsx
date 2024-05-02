import React, { useState } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';

import { FormControl, FormLabel, Input, Flex, Button } from '@chakra-ui/react';
import CategoryApiManager from '../../../api/CategoryApiManager';
import CategoryData from '../../../interfaces/categoryInterface';

interface FormCreateModifyCategoryProps {
  onCloseModal: () => void;
  categoryToModify: CategoryData | null;
}

function FormCreateModifyCategory({
  onCloseModal,
  categoryToModify,
}: FormCreateModifyCategoryProps) {
  // const [icon, setIcon] = useState<string>(''); -> Assuming icon is a string representing icon name or URL

  const [categoryName, setCategoryName] = useState<string>(
    categoryToModify ? categoryToModify.categoryName : ''
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (categoryToModify === null) {
      const newCategory = {
        id: ``,
        categoryName,
      };
      console.log(newCategory);

      const fetchData = async () => {
        try {
          await CategoryApiManager.create(newCategory);
          onCloseModal();
        } catch (error) {
          console.error('Erreur lors de la création des données :', error);
        }
      };

      fetchData();
    } else {
      const newCategory = {
        id: `${categoryToModify.id}`,
        categoryName,
      };

      const fetchData = async () => {
        try {
          await CategoryApiManager.modify(newCategory);
          onCloseModal();
        } catch (error) {
          console.error('Erreur lors de la modification des données :', error);
        }
      };

      fetchData();
    }
  };

  return (
    <FormControl>
      <Flex flexDirection="column" gap={4} borderRadius={8}>
        <FormControl isRequired>
          <FormLabel>Nom de la catégorie</FormLabel>
          <Input
            placeholder="Nom de la catégorie"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            focusBorderColor="#166879"
            isRequired
            bg="white"
          />
        </FormControl>
        {categoryToModify === null && (
          <Button bg="#166879" color="white" onClick={handleSubmit}>
            Créer une catégorie
          </Button>
        )}
        {categoryToModify !== null && (
          <Button bg="#166879" color="white" onClick={handleSubmit}>
            Enregistrer les modifications
          </Button>
        )}
      </Flex>
    </FormControl>
  );
}

FormCreateModifyCategory.propTypes = {
  onCloseModal: PropTypes.func.isRequired,
};

export default FormCreateModifyCategory;
