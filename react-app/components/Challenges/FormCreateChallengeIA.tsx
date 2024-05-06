import React, { useState, useEffect, FormEvent } from 'react';
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
  Text,
  ModalCloseButton,
  ModalBody,
  CircularProgress,
} from '@chakra-ui/react';
import { SingleDatepicker } from 'chakra-dayzed-datepicker';
import moment from 'moment';
import CategoryData from '../../interfaces/categoryInterface';
import { Periodicity } from '../../utils/constants';
import ChallengeApiManager from '../../api/ChallengeApiManager';

interface Props {
  refresh: () => void;
}

interface MistralData {
  generated_text: string;
}

function FormCreateChallenge({ refresh }: Props) {
  const [isOpenFormModal, setIsOpenFormModal] = useState(false);

  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState(false);
  const [description, setDescription] = useState('');
  const [descriptionError, setDescriptionError] = useState(false);
  const [points, setPoints] = useState(0);
  const [pointsError, setPointsError] = useState(false);
  const [category, setCategory] = useState('');
  const [categoryError, setCategoryError] = useState(false);
  const [endDate, setEndDate] = useState(
    moment(new Date()).endOf('day').toDate()
  );
  const [periodicityError, setPeriodicityError] = useState(false);
  const [themeChallengeError, setThemeChallengeError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>(
    'La thématique est requise'
  );
  const [periodicity, setPeriodicity] = useState<Periodicity>(
    Periodicity.PUNCTUAL
  );
  const [pedagogicalExplanation, setPedagogicalExplanation] = useState('');
  const [validation, setValidation] = useState(false);

  const openModal = () => {
    setIsOpenFormModal(true);
  };

  const closeModal = () => {
    setValidation(false);
    setIsOpenFormModal(false);
  };

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
      // créer le challenge via l'API
      await ChallengeApiManager.create(
        title,
        description,
        points,
        category,
        periodicity,
        challengeDate,
        pedagogicalExplanation
      );
      refresh();
      setTitle('');
      setDescription('');
      setPoints(0);
      setCategory('');
      setPeriodicity(Periodicity.PUNCTUAL);
      setEndDate(new Date());
      setPedagogicalExplanation('');
      closeModal();
    } catch (error) {
      console.error('Erreur lors de la création du challenge :', error);
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
        setEndDate(moment(new Date()).endOf('day').toDate());
        break;
      case Periodicity.WEEKLY:
        setEndDate(moment(new Date()).endOf('isoWeek').endOf('day').toDate());
        break;
      case Periodicity.MONTHLY:
        setEndDate(moment(new Date()).endOf('month').endOf('day').toDate());
        break;
      case Periodicity.PUNCTUAL:
        setEndDate(moment(new Date()).endOf('day').toDate());
        break;
      default:
    }
  }, [periodicity]);

  const [themeChallenge, setThemeChallenge] = useState('');
  const [proposition, setProposition] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  async function makeHuggingFaceAPIRequest() {
    const token = 'Bearer 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';
    const apiUrl =
      'https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1';

    const temp = Math.random() * 0.1 + 0.6;
    console.log(temp);

    const topp = Math.random() * 0.1 + 0.9;
    console.log(topp);

    const difficulty = Math.floor(Math.random() * 10) + 1;
    console.log('difficulty : ', difficulty);

    const requestBody = {
      inputs: `[INST] Tu es responsable du département RSE d'une SSII ayant des bureaux en France. Chaque semaine tu inventes des défis en français qui peuvent être réalisés par les collaborateurs afin qu'ils aient un impact positif en transformant leurs habitudes. Cette semaine, créé un défi en français sur le thème "${themeChallenge}" de difficulté ${difficulty}/10. Réponds sous la forme : 'T: Titre amusant du défi (3 à 6 mots). D: Description (Action à faire, nombre de fois, durée) (1 phrase). E: Explication pédagogique des bienfaits du défi\n[/INST]`,
      parameters: {
        return_full_text: false,
        max_new_tokens: 256,
        temperature: temp,
        random_seed: null,
        top_p: topp,
      },
    };

    const requestOptions = {
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
    };

    try {
      console.log(requestBody);
      const response = await axios.post<MistralData[]>(
        apiUrl,
        requestBody,
        requestOptions
      );
      if (response.status !== 200) {
        throw new Error(
          'Plus de crédits disponibles, veuillez patienter quelques temps'
        );
      }
      console.log(response.data);
      setProposition(response.data[0].generated_text);
      setPoints(difficulty * 5);
      // Faites quelque chose avec les données de la réponse ici
    } catch (error) {
      console.error('Erreur lors de la requête API:', error);
      setErrorMessage(
        error instanceof Error ? error.message : 'An error occurred'
      );
    }
  }

  useEffect(() => {
    if (proposition) {
      setTitle(
        removeQuotes(removeSpaces(proposition.split('T: ')[1].split('D: ')[0]))
      );
      setDescription(
        removeQuotes(removeSpaces(proposition.split('D: ')[1].split('E: ')[0]))
      );
      setPedagogicalExplanation(removeQuotes(proposition.split('E: ')[1]));
    }
  }, [proposition]);

  const handleGenerate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    await makeHuggingFaceAPIRequest();
    setIsLoading(false);
    setValidation(true);
  };

  function removeQuotes(text: string) {
    return text.replace(/^"+/, '').replace(/"+$/, '');
  }

  function removeSpaces(text: string) {
    return text.replace(/\s+$/, '');
  }

  return (
    <>
      <Button
        bg="secondary.300"
        color="white"
        width="fit-content"
        onClick={openModal}
      >
        Générer par IA
      </Button>
      <Modal isOpen={isOpenFormModal} onClose={closeModal} size="xl">
        <ModalOverlay />
        <ModalContent bg="#F8F8F8" p="24px" width="800px">
          <ModalHeader>Générer un défi par IA</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {!validation && (
              <form onSubmit={handleGenerate}>
                <Flex flexDirection="column" gap="8px">
                  <FormControl isRequired>
                    <FormLabel>Choisissez une thématique</FormLabel>
                    <Input
                      width="100%"
                      bg="white"
                      value={themeChallenge}
                      onChange={(e) => {
                        setThemeChallenge(e.target.value);
                        setThemeChallengeError(false);
                      }}
                      onBlur={() => {
                        if (themeChallenge === '') {
                          setThemeChallengeError(true);
                        }
                      }}
                      focusBorderColor="primary.300"
                    />
                    {themeChallenge === '' && themeChallengeError && (
                      <FormErrorMessage>
                        La thématique est requise.
                      </FormErrorMessage>
                    )}
                  </FormControl>
                  <Button
                    type="submit"
                    width="100%"
                    bg="secondary.300"
                    color="white"
                  >
                    {isLoading ? (
                      <CircularProgress
                        isIndeterminate
                        size="24px"
                        color="teal"
                      />
                    ) : (
                      'Générer un défi'
                    )}
                  </Button>
                </Flex>
              </form>
            )}
            {validation && (
              <form onSubmit={handleSubmit}>
                <Flex flexDirection="column" gap={4} borderRadius={8}>
                  <FormControl
                    isRequired
                    isInvalid={title === '' && titleError}
                  >
                    <FormLabel>Titre</FormLabel>
                    <Input
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
                      height="120px"
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
                      {Object.values(Periodicity).map((period) => (
                        <option key={period} value={period}>
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
                          setEndDate(moment(e).endOf('day').toDate());
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
                              color: 'red',
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
                            bg: 'white',
                            variant: 'filled',
                            isDisabled: true,
                          },
                        }}
                        configs={{
                          dateFormat: 'dd/MM/yyyy',
                          dayNames: 'Dim/Lun/Mar/Mer/Jeu/Ven/Sam'.split('/'), // length of 7
                          monthNames:
                            'Jan/Fev/Mars/Avr/Mai/Juin/Juil/Août/Sep/Oct/Nov/Dec'.split(
                              '/'
                            ), // length of 12
                          firstDayOfWeek: 1, // default is 0, the dayNames[0], which is Sunday if you don't specify your own dayNames,
                        }}
                      />
                    </FormControl>
                  )}

                  <FormControl>
                    <FormLabel>Explications pédagogiques</FormLabel>

                    <Textarea
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
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default FormCreateChallenge;
