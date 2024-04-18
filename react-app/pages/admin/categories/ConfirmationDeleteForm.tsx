/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';

import { FormControl, Flex, Button } from '@chakra-ui/react';
import CategoryData from '../../../interfaces/categoryInterface';
import CategoryApiManager from '../../../api/CategoryApiManager';

interface ConfirmationDeleteFormProps {
  onCloseModal: () => void;
  categoryToDelete: CategoryData;
}

function ConfirmationDeleteForm({
  onCloseModal,
  categoryToDelete,
}: ConfirmationDeleteFormProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await CategoryApiManager.delete(categoryToDelete._id);
      onCloseModal();
    } catch (error) {
      console.error('Erreur lors de la suppression des données:', error);
    }
  };

  return (
    <FormControl>
      <Flex flexDirection="column" gap={4} borderRadius={8}>
        <Flex>
          L&apos;ensemble des défis de la catégorie{' '}
          {categoryToDelete.categoryName} vont passer dans la catégorie Autre.
        </Flex>
        <Button bg="#166879" color="white" onClick={handleSubmit}>
          Créer une catégorie
        </Button>
      </Flex>
    </FormControl>
  );
}

ConfirmationDeleteForm.propTypes = {
  onCloseModal: PropTypes.func.isRequired,
  categoryToDelete: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    categoryName: PropTypes.string.isRequired,
  }).isRequired,
};

export default ConfirmationDeleteForm;
