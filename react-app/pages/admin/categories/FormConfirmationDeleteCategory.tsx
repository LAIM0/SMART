/* eslint-disable no-underscore-dangle */
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';

import { FormControl, Flex, Button } from '@chakra-ui/react';
import CategoryData from '../../../interfaces/categoryInterface';
import CategoryApiManager from '../../../api/CategoryApiManager';

interface FormConfirmationDeleteCategoryProps {
  onCloseModal: () => void;
  categoryToDelete: CategoryData;
}

function FormConfirmationDeleteCategory({
  onCloseModal,
  categoryToDelete,
}: FormConfirmationDeleteCategoryProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(categoryToDelete.id);
    try {
      await CategoryApiManager.delete(categoryToDelete.id);
      onCloseModal();
    } catch (error) {
      console.error('Erreur lors de la suppression des données:', error);
    }
  };

  return (
    <FormControl>
      <Flex flexDirection="column" gap={4} borderRadius={8}>
        <Flex>
          L&apos;ensemble des défis {categoryToDelete?.categoryName} vont passer
          dans Autre.
        </Flex>
        <Button bg="redCoexya" color="white" onClick={handleSubmit}>
          Confirmer la supression
        </Button>
      </Flex>
    </FormControl>
  );
}

FormConfirmationDeleteCategory.propTypes = {
  onCloseModal: PropTypes.func.isRequired,
  categoryToDelete: PropTypes.shape({
    id: PropTypes.string.isRequired,
    categoryName: PropTypes.string.isRequired,
  }).isRequired,
};

export default FormConfirmationDeleteCategory;
