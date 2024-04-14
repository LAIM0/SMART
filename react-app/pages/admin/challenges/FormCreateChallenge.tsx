import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FormControl,
  Input,
  Flex,
  Button,
  Select,
  Textarea,
  FormLabel,
  FormErrorMessage,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from '@chakra-ui/react';
import CategoryData from '../../../interfaces/categoryInterface';
import { SingleDatepicker } from 'chakra-dayzed-datepicker';
// https://github.com/aboveyunhai/chakra-dayzed-datepicker/tree/main
import { Periodicity } from '../../../utils/constants';
import moment from 'moment';

function FormCreateChallenge() {
  const [isOpenFormModal, setIsOpenFormModal] = useState(false);

  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState(false);
  const [description, setDescription] = useState('');
  const [descriptionError, setDescriptionError] = useState(false);
  const [points, setPoints] = useState(0);
  const [pointsError, setPointsError] = useState(false);
  const [category, setCategory] = useState('');
  const [categoryError, setCategoryError] = useState(false);
  const [endDate, setEndDate] = useState(new Date());
  const [endDateError, setEndDateError] = useState(false);
  const [periodicityError, setPeriodicityError] = useState(false);
  const [periodicity, setPeriodicity] = useState<Periodicity>(
    Periodicity.PUNCTUAL
  );
  const [pedagogicalExplanation, setPedagogicalExplanation] = useState('');

  const openModal = () => {
    setIsOpenFormModal(true);
  };

  const closeModal = () => {
    setIsOpenFormModal(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Vérifier les champs requis avant de soumettre le formulaire
    if (title === '') {
      setTitleError(true);
      return;
    }
    if (description === '') {
      setDescriptionError(true);
      return;
    }
    if (points === 0) {
      setPointsError(true);
      return;
    }
    if (category === '') {
      setCategoryError(true);
      return;
    }
    if (!endDate) {
      setEndDateError(true);
      return;
    }

    const challengeDate = new Date(endDate);
    const newChallenge = {
      title,
      description,
      points,
      category,
      pedagogicalExplanation,
      endDate: challengeDate,
      periodicity,
    };

    axios
      .post('http://localhost:3001/challenges/create', newChallenge)
      .then((res) => {
        console.log(res);
        // Réinitialiser le formulaire après la soumission réussie
        setTitle('');
        setDescription('');
        setPoints(0);
        setCategory('');
        setEndDate(new Date());
        setPedagogicalExplanation('');
        setPeriodicity(Periodicity.PUNCTUAL);
        closeModal(); // Fermer le modal après la soumission réussie
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [categories, setCategories] = useState<CategoryData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get<CategoryData[]>(
        'http://localhost:3001/categories/all'
      );
      setCategories(response.data);
    };

    fetchData();
  }, []);

  useEffect(() => {
    switch (periodicity) {
      case Periodicity.DAILY:
        setEndDate(moment(endDate).add(1, 'days').startOf('day').toDate());
        break;
      case Periodicity.WEEKLY:
        setEndDate(
          moment(endDate)
            .add(1, 'weeks')
            .startOf('isoWeek')
            .startOf('day')
            .toDate()
        );
        break;
      case Periodicity.MONTHLY:
        setEndDate(
          moment(endDate).endOf('month').add(1, 'days').startOf('day').toDate()
        );
        break;
      default:
    }
  }, [periodicity]);

  return (
    <>
      <Button
        bg="primary.300"
        color="white"
        width="fit-content"
        onClick={openModal}
      >
        Ajouter un défi
      </Button>
      <Modal isOpen={isOpenFormModal} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent bg="#F8F8F8" p="24px">
          <ModalHeader>Ajouter un défi</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <Flex flexDirection="column" gap={4} borderRadius={8}>
                <FormControl isRequired isInvalid={title === '' && titleError}>
                  <FormLabel>Titre</FormLabel>
                  <Input
                    //placeholder="Titre du défi"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      setTitleError(false);
                    }}
                    onBlur={() => {
                      if (title === '') {
                        setTitleError(true);
                      }
                    }}
                    focusBorderColor="primary.300"
                    bg="white"
                  />
                  {title === '' && titleError && (
                    <FormErrorMessage>Le titre est requis.</FormErrorMessage>
                  )}
                </FormControl>

                <FormControl
                  isRequired
                  isInvalid={description === '' && descriptionError}
                >
                  <FormLabel>Description</FormLabel>

                  <Textarea
                    //placeholder="Description du défi"
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      setDescriptionError(false);
                    }}
                    onBlur={() => {
                      if (description === '') {
                        setDescriptionError(true);
                      }
                    }}
                    focusBorderColor="primary.300"
                    bg="white"
                  />
                  {description === '' && descriptionError && (
                    <FormErrorMessage>
                      La description est requise.
                    </FormErrorMessage>
                  )}
                </FormControl>

                <FormControl isRequired isInvalid={!points && pointsError}>
                  <FormLabel>Points</FormLabel>

                  <Input
                    type="number"
                    //placeholder="Entre 5 et 50"
                    value={points ? points.toString() : ''}
                    onChange={(e) => {
                      setPoints(parseInt(e.target.value, 10));
                      setPointsError(false);
                    }}
                    onBlur={() => {
                      if (!points) {
                        setPointsError(true);
                      }
                    }}
                    focusBorderColor="primary.300"
                    bg="white"
                  />
                  {!points && pointsError && (
                    <FormErrorMessage>
                      Le nombre de points est requis.
                    </FormErrorMessage>
                  )}
                </FormControl>

                <FormControl
                  isRequired
                  isInvalid={category === '' && categoryError}
                >
                  <FormLabel>Catégorie</FormLabel>

                  <Select
                    placeholder=" "
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      setCategoryError(false);
                    }}
                    onBlur={() => {
                      if (category === '') {
                        setCategoryError(true);
                      }
                    }}
                    focusBorderColor="primary.300"
                    bg="white"
                  >
                    {categories.map((categoryItem) => (
                      <option key={categoryItem.id} value={categoryItem.id}>
                        {categoryItem.categoryName}
                      </option>
                    ))}
                  </Select>
                  {category === '' && categoryError && (
                    <FormErrorMessage>
                      La catégorie est requise.
                    </FormErrorMessage>
                  )}
                </FormControl>

                <FormControl isRequired isInvalid={periodicityError}>
                  <FormLabel>Périodicité</FormLabel>
                  <Select
                    value={periodicity}
                    onChange={(e) => {
                      setPeriodicity(e.target.value as Periodicity);
                      setPeriodicityError(false);
                    }}
                    onBlur={() => {
                      if (!periodicity) {
                        setPeriodicityError(true);
                      }
                    }}
                    focusBorderColor="primary.300"
                    bg="white"
                  >
                    {Object.values(Periodicity).map((period, index) => (
                      <option key={index} value={period}>
                        {period}
                      </option>
                    ))}
                  </Select>
                  {!periodicity && periodicityError && (
                    <FormErrorMessage>
                      La périodicité est requise.
                    </FormErrorMessage>
                  )}
                </FormControl>

                {periodicity === Periodicity.PUNCTUAL && (
                  <FormControl isRequired>
                    <FormLabel>Date de fin</FormLabel>

                    <SingleDatepicker
                      date={endDate}
                      onDateChange={(e) => {
                        setEndDate(e);
                        setEndDateError(false);
                      }}
                    />
                  </FormControl>
                )}

                <FormControl>
                  <FormLabel>Explications pédagogiques</FormLabel>

                  <Textarea
                    //placeholder="Ressources permettant de sensibiliser à la thématique"
                    value={pedagogicalExplanation}
                    onChange={(e) => {
                      setPedagogicalExplanation(e.target.value);
                    }}
                    focusBorderColor="primary.300"
                    bg="white"
                  />
                </FormControl>

                <Button type="submit" bg="primary.300" color="white">
                  Créer un challenge
                </Button>
              </Flex>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default FormCreateChallenge;
