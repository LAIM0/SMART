/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import {
  Flex,
  Button,
  Text,
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
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import FormCreateModifyCategory from './FormCreateModifyCategory';
import FormConfirmationDeleteCategory from './FormConfirmationDeleteCategory';
import CategoryData from '../../../interfaces/categoryInterface';
import CategoryApiManager from '../../../api/CategoryApiManager';

function AdminCategories() {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [currentCategory, setCurrentCategory] = useState<CategoryData | null>(
    null
  );
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryData>({
    id: '',
    categoryName: '',
  });
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allCategories = await CategoryApiManager.getAll();
        const categoriesWithCount = await Promise.all(
          allCategories.map(async (category: CategoryData) => {
            const count = await CategoryApiManager.getChallengeCount(
              category.id
            );
            console.log('count', count);
            return {
              ...category,
              challengeCount: count,
            };
          })
        );
        setCategories(categoriesWithCount);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };

    fetchData();
  }, [loading]);

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

  const handleOpenConfirmationDeleteModal = async (category: CategoryData) => {
    await setCategoryToDelete(category);
    onOpenConfirmationDeleteModal();
  };

  const handleOpenreateModifyModal = async (category: CategoryData) => {
    await setCurrentCategory(category);
    onOpenFormModal();
  };

  const handleCloseConfirmationDeleteModal = () => {
    setCurrentCategory(null);
    onCloseConfirmationDeleteModal();
    setLoading(!loading);
  };

  const handleCloseCreateModifyModal = () => {
    setCurrentCategory(null);
    onCloseFormModal();
    setLoading(!loading);
  };

  return (
    <Flex flexDirection="column" gap="16px">
      <Flex gap="16px">
        <Text as="h1">Gestion des catégories</Text>
        <Button
          bg="primary.300"
          color="white"
          width="fit-content"
          onClick={onOpenFormModal}
        >
          Ajouter une catégorie
        </Button>
      </Flex>
      <TableContainer bg="white" borderRadius={16}>
        <Table variant="simple">
          <Thead>
            <Tr bg="secondary.100">
              <Th width="60%">Nom de la catégorie</Th>
              <Th width="20%" textAlign="left">
                Nombre de défis
              </Th>
              <Th width="20%" />
            </Tr>
          </Thead>
          {categories.map((category) => (
            <Tr key={category.id}>
              <Td width="60%">{category.categoryName}</Td>
              <Td width="20%" textAlign="left">
                {category.challengeCount ? category.challengeCount : '0'}
              </Td>

              <Td width="20%" textAlign="right" paddingRight="24px">
                {category.categoryName !== 'Autre' && (
                  <Flex>
                    <Button
                      color="#718096"
                      mr={4}
                      onClick={() => handleOpenreateModifyModal(category)}
                    >
                      Modifier
                    </Button>
                    <Button
                      marginLeft="16px"
                      colorScheme="red"
                      onClick={() =>
                        handleOpenConfirmationDeleteModal(category)
                      }
                    >
                      Supprimer
                    </Button>
                  </Flex>
                )}
              </Td>
            </Tr>
          ))}
        </Table>
      </TableContainer>
      <Modal isOpen={isOpenFormModal} onClose={handleCloseCreateModifyModal}>
        <ModalOverlay />
        <ModalContent bg="#F8F8F8" p="24px">
          {currentCategory !== null && (
            <ModalHeader>Modifier {currentCategory?.categoryName}</ModalHeader>
          )}
          {currentCategory === null && (
            <ModalHeader>Ajouter une catégorie</ModalHeader>
          )}
          <ModalCloseButton />
          <ModalBody>
            <FormCreateModifyCategory
              onCloseModal={handleCloseCreateModifyModal}
              categoryToModify={currentCategory}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isOpenConfirmationDeleteModal}
        onClose={handleCloseConfirmationDeleteModal}
      >
        <ModalOverlay />
        <ModalContent bg="#F8F8F8" p="24px">
          <ModalHeader>
            Supprimer la catégorie {categoryToDelete?.categoryName} ?{' '}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormConfirmationDeleteCategory
              onCloseModal={handleCloseConfirmationDeleteModal}
              categoryToDelete={categoryToDelete}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

export default AdminCategories;
