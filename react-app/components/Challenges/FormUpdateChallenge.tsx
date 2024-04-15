import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
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
  IconButton,
} from '@chakra-ui/react';
import CategoryData from '../../interfaces/categoryInterface';
import { SingleDatepicker } from 'chakra-dayzed-datepicker';
// https://github.com/aboveyunhai/chakra-dayzed-datepicker/tree/main
import { Periodicity } from '../../utils/constants';
import moment from 'moment';
import { EditIcon, SearchIcon } from '@chakra-ui/icons';
import ChallengeData from '../../interfaces/challengeInterface';
import ChallengeApiManager from '../../api/ChallengeApiManager';

interface Props {
  currentChallenge: ChallengeData;
  refresh: () => void;
}

function FormUpdateChallenge({ currentChallenge, refresh }: Props) {
  const [isOpenFormModal, setIsOpenFormModal] = useState(false);

  const [title, setTitle] = useState(currentChallenge.title);
  const [titleError, setTitleError] = useState(false);
  const [description, setDescription] = useState(currentChallenge.description);
  const [descriptionError, setDescriptionError] = useState(false);
  const [points, setPoints] = useState<number>(currentChallenge.points);
  const [pointsError, setPointsError] = useState(false);
  const [category, setCategory] = useState(currentChallenge.category);
  const [categoryError, setCategoryError] = useState(false);
  const [endDate, setEndDate] = useState(currentChallenge.endDate);
  const [loading, setLoading] = useState(false);
  const [periodicityError, setPeriodicityError] = useState(false);
  const [periodicity, setPeriodicity] = useState<Periodicity>(
    currentChallenge.periodicity
  );
  const [pedagogicalExplanation, setPedagogicalExplanation] = useState(
    currentChallenge.pedagogicalExplanation
  );

  const openModal = () => {
    setIsOpenFormModal(true);
  };

  const closeModal = () => {
    setIsOpenFormModal(false);
  };

  async function deleteChallenge() {
    try {
      await ChallengeApiManager.delete(currentChallenge.id);
      refresh();
    } catch (error) {
      console.error('Erreur lors de la suppression des données :', error);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
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
      return;
    }

    const challengeDate = new Date(endDate);
    try {
      // Mettre à jour le challenge via l'API
      await ChallengeApiManager.update(
        currentChallenge.id,
        title,
        description,
        points,
        category,
        periodicity,
        challengeDate,
        pedagogicalExplanation
      );
      refresh();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du challenge :', error);
    }
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
        setEndDate(moment(new Date()).add(1, 'days').startOf('day').toDate());
        break;
      case Periodicity.WEEKLY:
        setEndDate(
          moment(new Date())
            .add(1, 'weeks')
            .startOf('isoWeek')
            .startOf('day')
            .toDate()
        );
        break;
      case Periodicity.MONTHLY:
        setEndDate(
          moment(new Date())
            .endOf('month')
            .add(1, 'days')
            .startOf('day')
            .toDate()
        );
        break;
      case Periodicity.PUNCTUAL:
        setEndDate(moment(endDate).add(1, 'days').startOf('day').toDate());
        break;
      default:
    }
  }, [periodicity]);

  return (
    <>
      <IconButton
        aria-label="Modifier"
        onClick={openModal}
        icon={<EditIcon />}
        bg="tertiary"
        color="#444444"
      />
      <Modal isOpen={isOpenFormModal} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent bg="#F8F8F8" p="24px">
          <ModalHeader>Modifier un défi</ModalHeader>
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
                      <option
                        key={categoryItem.id + categoryItem.categoryName}
                        value={categoryItem.id}
                      >
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
                      date={new Date(endDate)}
                      onDateChange={(e) => {
                        setEndDate(e);
                      }}
                      propsConfigs={{
                        dateNavBtnProps: {
                          colorScheme: 'primary.300',
                          background: '#F8F8F8',
                        },
                        dayOfMonthBtnProps: {
                          defaultBtnProps: {
                            _hover: {
                              background: 'primary.100',
                            },
                          },
                          selectedBtnProps: {
                            background: 'primary.300',
                            color: 'white',
                          },
                          todayBtnProps: {
                            variant: 'outline',
                            borderColor: 'primary.300',
                            color: 'primary.300',
                          },
                        },
                        popoverCompProps: {
                          popoverContentProps: {
                            background: 'white',
                            color: 'primary.300',
                          },
                        },
                        calendarPanelProps: {
                          wrapperProps: {
                            borderColor: 'green',
                          },
                          contentProps: {
                            borderWidth: 0,
                          },
                          headerProps: {
                            padding: '5px',
                          },
                          dividerProps: {
                            display: 'none',
                          },
                        },
                        weekdayLabelProps: {
                          fontWeight: 'normal',
                        },
                        dateHeadingProps: {
                          fontWeight: 'semibold',
                        },
                        inputProps: {
                          size: 'md',
                        },
                      }}
                      configs={{
                        dateFormat: 'dd/MM/yyyy',
                        dayNames: 'Lun/Mar/Mer/Jeu/Ven/Sam/Dim'.split('/'), // length of 7
                        monthNames:
                          'Jan/Fev/Mars/Avr/Mai/Juin/Juil/Août/Sep/Oct/Nov/Dec'.split(
                            '/'
                          ), // length of 12
                        firstDayOfWeek: 0, // default is 0, the dayNames[0], which is Sunday if you don't specify your own dayNames,
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
                <Flex gap="16px">
                  <Button
                    type="submit"
                    bg="primary.300"
                    color="white"
                    flex="1"
                    onClick={closeModal}
                  >
                    Enregistrer
                  </Button>
                  <Button
                    bg="redCoexya"
                    color="white"
                    flex="1"
                    onClick={() => {
                      closeModal();
                      deleteChallenge();
                    }}
                  >
                    Supprimer
                  </Button>
                </Flex>
              </Flex>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default FormUpdateChallenge;
