/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Flex,
  Button,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  TableContainer,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import FormCreateModifyCategory from './FormCreateModifyCategory';
import ConfirmationDeleteForm from './ConfirmationDeleteForm';
import CategoryData from '../../../interfaces/categoryInterface';
import CategoryApiManager from '../../../api/CategoryApiManager';

function AdminCategories() {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [currentCategory, setCurrentCategory] = useState<CategoryData | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allCategories = await CategoryApiManager.getAll();
        setCategories(allCategories);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };

    fetchData();
  }, []);

  const {
    isOpen: isOpenFormModal,
    onOpen: onOpenFormModal,
    onClose: onCloseFormModal,
  } = useDisclosure();

  const {
    isOpen: isOpenConfirmationDeleteModal,
    onOpen: onOpenConfirmationDeleteModal,
    onClose: onCloseConfirmationDeleteModal,
  } = useDisclosure();

  const clearCurrentCategory = () => {
    setCurrentCategory(null);
  };

  const handleOpenConfirmationDeleteModal = async (category: CategoryData) => {
    await setCategoryToDelete(category);
    console.log(categoryToDelete ? categoryToDelete._id : '');
    onOpenConfirmationDeleteModal();
  };

  return (
    <Flex flexDirection="column" gap="16px">
      <Button
        bg="primary.300"
        color="white"
        width="fit-content"
        onClick={onOpenFormModal}
      >
        Ajouter une catégorie {currentCategory?.categoryName}
      </Button>
      <TableContainer bg="white" borderRadius={16}>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th width="80%">Nom de la catégorie</Th>
              <Th width="20%" isNumeric>
                Actions
              </Th>
            </Tr>
          </Thead>
          {categories.map((category) => (
            <Tr
              onClick={() => {
                setCurrentCategory(category);
              }}
              key={category._id}
              _hover={{ bg: 'lightgray', cursor: 'pointer' }}
            >
              <Td width="80%">{category.categoryName}</Td>
              <Td width="20%">
                <Button
                  variant="outline"
                  colorScheme="red"
                  onClick={() => handleOpenConfirmationDeleteModal(category)}
                >
                  Supprimer
                </Button>
              </Td>
            </Tr>
          ))}
        </Table>
      </TableContainer>
      <Modal isOpen={isOpenFormModal} onClose={onCloseFormModal}>
        <ModalOverlay />
        <ModalContent bg="#F8F8F8" p="24px">
          <ModalHeader>Ajouter une catégorie</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormCreateModifyCategory onCloseModal={onCloseFormModal} />
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isOpenConfirmationDeleteModal}
        onClose={onCloseConfirmationDeleteModal}
      >
        <ModalOverlay />
        <ModalContent bg="#F8F8F8" p="24px">
          <ModalHeader>
            Supprimer la catégorie {categoryToDelete?.categoryName} ?{' '}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ConfirmationDeleteForm
              onCloseModal={onCloseFormModal}
              categoryToDelete={categoryToDelete}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

export default AdminCategories;
