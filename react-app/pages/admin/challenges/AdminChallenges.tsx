import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Flex,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Text,
  TableContainer,
  Tbody,
  IconButton,
} from '@chakra-ui/react';
import { TriangleDownIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';
import FormCreateChallenge from '../../../components/Challenges/FormCreateChallenge';
import ChallengeData from '../../../interfaces/challengeInterface';
import dateGap from '../../../utils/mathFunctions';
import FormUpdateChallenge from '../../../components/Challenges/FormUpdateChallenge';
import { Filter } from '../../../utils/constants';
import FormCreateChallengeIA from '../../../components/Challenges/FormCreateChallengeIA';
import CategoryData from '../../../interfaces/categoryInterface';
import CategoryApiManager from '../../../api/CategoryApiManager';
import { handleAdminRouting } from '../../../api/AuthApiManager';

function AdminChallenges() {
  const router = useRouter();
  useEffect(() => {
    handleAdminRouting(router);
  }, []);
  const [challenges, setChallenges] = useState<ChallengeData[]>([]);
  const [currentChallenges, setCurrentChallenges] = useState<ChallengeData[]>(
    []
  );
  const [categories, setCategories] = useState<CategoryData[]>([]);

  const [formerChallenges, setFormerChallenges] = useState<ChallengeData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [filterByName, setFilterByName] = useState<Filter>(Filter.INACTIVE);
  const [filterByCategory, setFilterByCategory] = useState<Filter>(
    Filter.INACTIVE
  );
  const [filterByPoints, setFilterByPoints] = useState<Filter>(Filter.INACTIVE);
  const [filterByDate, setFilterByDate] = useState<Filter>(Filter.INACTIVE);

  useEffect(() => {
    const fetchData = async () => {
      console.log('fetchData');
      try {
        const response = await axios.get<ChallengeData[]>(
          'http://localhost:3001/challenges/all'
        );
        setChallenges(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };
    fetchData();
  }, [loading]);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await CategoryApiManager.getAll();
      setCategories(response);
    };

    fetchCategories();
  }, []);

  const filterCurrent = (challenge: ChallengeData): boolean => {
    return new Date(challenge.endDate).getTime() > Date.now();
  };

  const filterFormer = (challenge: ChallengeData): boolean => {
    return new Date(challenge.endDate).getTime() < Date.now();
  };

  useEffect(() => {
    const curChallenges = challenges.filter(filterCurrent);
    setCurrentChallenges(curChallenges);
    const formChallenges = challenges.filter(filterFormer);
    setFormerChallenges(formChallenges);
  }, [challenges]);

  const refresh = () => {
    setLoading((e) => !e);
    console.log('Refreshing');
  };

  function sortByProperty<T>(
    array: T[],
    property: keyof T,
    ascending: boolean = true
  ): T[] {
    return [...array].sort((a, b) => {
      let comparison = 0;
      if (a[property] < b[property]) {
        comparison = -1;
      } else if (a[property] > b[property]) {
        comparison = 1;
      }
      if (!ascending) {
        comparison = -comparison;
      }
      return comparison;
    });
  }

  useEffect(() => {
    console.log(currentChallenges);
    switch (filterByName) {
      case Filter.INACTIVE:
        setCurrentChallenges(challenges.filter(filterCurrent));
        break;
      case Filter.ASC:
        setCurrentChallenges(sortByProperty(currentChallenges, 'title', true));
        break;
      case Filter.DESC:
        setCurrentChallenges(sortByProperty(currentChallenges, 'title', false));
        break;
      default:
    }
  }, [filterByName]);

  useEffect(() => {
    console.log(currentChallenges);
    switch (filterByCategory) {
      case Filter.INACTIVE:
        setCurrentChallenges(challenges.filter(filterCurrent));
        break;
      case Filter.ASC:
        setCurrentChallenges(
          sortByProperty(currentChallenges, 'category', true)
        );
        break;
      case Filter.DESC:
        setCurrentChallenges(
          sortByProperty(currentChallenges, 'category', false)
        );
        break;
      default:
    }
  }, [filterByCategory]);

  useEffect(() => {
    console.log(currentChallenges);
    switch (filterByPoints) {
      case Filter.INACTIVE:
        setCurrentChallenges(challenges.filter(filterCurrent));
        break;
      case Filter.ASC:
        setCurrentChallenges(sortByProperty(currentChallenges, 'points', true));
        break;
      case Filter.DESC:
        setCurrentChallenges(
          sortByProperty(currentChallenges, 'points', false)
        );
        break;
      default:
    }
  }, [filterByPoints]);

  useEffect(() => {
    console.log(currentChallenges);
    switch (filterByDate) {
      case Filter.INACTIVE:
        setCurrentChallenges(challenges.filter(filterCurrent));
        break;
      case Filter.ASC:
        setCurrentChallenges(
          sortByProperty(currentChallenges, 'endDate', true)
        );
        break;
      case Filter.DESC:
        setCurrentChallenges(
          sortByProperty(currentChallenges, 'endDate', false)
        );
        break;
      default:
    }
  }, [filterByDate]);

  return (
    <Flex flexDirection="column" gap="16px">
      <Flex gap="16px">
        <Text as="h1">Gestion des défis</Text>
        <FormCreateChallenge refresh={refresh} />
        <FormCreateChallengeIA refresh={refresh} />
      </Flex>
      <Text as="h2">Défis en cours</Text>
      <TableContainer bg="white" borderRadius={16}>
        <Table variant="simple">
          <Thead>
            <Tr bg="secondary.100">
              <Th width="30%">
                Nom du défi
                <IconButton
                  ml="0px"
                  mt="-4px"
                  aria-label="filter"
                  icon={<TriangleDownIcon />}
                  bg="transparent"
                  onClick={() =>
                    setFilterByName((prevState) => (prevState + 1) % 3)
                  }
                  _hover={{ bg: 'transparent' }}
                  color={
                    filterByName === Filter.INACTIVE
                      ? 'primary.300'
                      : (() => {
                          if (filterByName === Filter.ASC) {
                            return 'secondary.300';
                          }
                          return 'redCoexya';
                        })()
                  }
                  transform={
                    filterByName === Filter.INACTIVE
                      ? 'rotate(270deg)'
                      : (() => {
                          if (filterByName === Filter.ASC) {
                            return 'rotate(180deg)';
                          }
                          return 'auto';
                        })()
                  }
                  transition="transform 0.3s ease-in-out"
                />
              </Th>
              <Th width="20%">
                Catégorie
                <IconButton
                  ml="0px"
                  mt="-4px"
                  aria-label="filter"
                  icon={<TriangleDownIcon />}
                  bg="transparent"
                  onClick={() =>
                    setFilterByCategory((prevState) => (prevState + 1) % 3)
                  }
                  _hover={{ bg: 'transparent' }}
                  color={
                    filterByCategory === Filter.INACTIVE
                      ? 'primary.300'
                      : (() => {
                          if (filterByCategory === Filter.ASC) {
                            return 'secondary.300';
                          }
                          return 'redCoexya';
                        })()
                  }
                  transform={
                    filterByCategory === Filter.INACTIVE
                      ? 'rotate(270deg)'
                      : (() => {
                          if (filterByCategory === Filter.ASC) {
                            return 'rotate(180deg)';
                          }
                          return 'auto';
                        })()
                  }
                  transition="transform 0.3s ease-in-out"
                />
              </Th>
              <Th width="20%">
                Points
                <IconButton
                  ml="0px"
                  mt="-4px"
                  aria-label="filter"
                  icon={<TriangleDownIcon />}
                  bg="transparent"
                  onClick={() =>
                    setFilterByPoints((prevState) => (prevState + 1) % 3)
                  }
                  _hover={{ bg: 'transparent' }}
                  color={
                    filterByPoints === Filter.INACTIVE
                      ? 'primary.300'
                      : (() => {
                          if (filterByPoints === Filter.ASC) {
                            return 'secondary.300';
                          }
                          return 'redCoexya';
                        })()
                  }
                  transform={
                    filterByPoints === Filter.INACTIVE
                      ? 'rotate(270deg)'
                      : (() => {
                          if (filterByPoints === Filter.ASC) {
                            return 'rotate(180deg)';
                          }
                          return 'auto';
                        })()
                  }
                  transition="transform 0.3s ease-in-out"
                />
              </Th>
              <Th width="20%">
                Temps restant
                <IconButton
                  ml="0px"
                  mt="-4px"
                  aria-label="filter"
                  icon={<TriangleDownIcon />}
                  bg="transparent"
                  onClick={() =>
                    setFilterByDate((prevState) => (prevState + 1) % 3)
                  }
                  _hover={{ bg: 'transparent' }}
                  color={
                    filterByDate === Filter.INACTIVE
                      ? 'primary.300'
                      : (() => {
                          if (filterByDate === Filter.ASC) {
                            return 'secondary.300';
                          }
                          return 'redCoexya';
                        })()
                  }
                  transform={
                    filterByDate === Filter.INACTIVE
                      ? 'rotate(270deg)'
                      : (() => {
                          if (filterByDate === Filter.ASC) {
                            return 'rotate(180deg)';
                          }
                          return 'auto';
                        })()
                  }
                  transition="transform 0.3s ease-in-out"
                />
              </Th>
              <Th width="10%">Modifier</Th>
            </Tr>
          </Thead>

          <Tbody>
            {currentChallenges.map((challenge) => (
              <Tr key={challenge.id}>
                <Td width="30%">{challenge.title}</Td>
                <Td width="30%">
                  {
                    categories.find((item) => item.id === challenge.category)
                      ?.categoryName
                  }
                </Td>
                <Td width="20%">{challenge.points}</Td>
                <Td width="20%">
                  {dateGap(challenge.endDate) === 1
                    ? `Aujourd'hui`
                    : `${dateGap(challenge.endDate)} jours`}
                </Td>
                <Td width="10%">
                  <FormUpdateChallenge
                    currentChallenge={challenge}
                    refresh={refresh}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      {currentChallenges.length === 0 && <Text>Aucun défi en cours</Text>}
      <Text as="h2">Défis clôturés</Text>
      <TableContainer bg="white" borderRadius={16}>
        <Table variant="simple">
          <Thead>
            <Tr bg="secondary.100">
              <Th width="30%">Nom du défi</Th>
              <Th width="20%">Catégorie</Th>
              <Th width="20%">Points</Th>
              <Th width="20%">Clôturé depuis</Th>
              <Th width="10%">Modifier</Th>
            </Tr>
          </Thead>
          <Tbody>
            {formerChallenges.map((challenge) => (
              <Tr key={challenge.id}>
                <Td width="30%">{challenge.title}</Td>
                <Td width="30%">{challenge.category}</Td>
                <Td width="20%">{challenge.points}</Td>
                <Td width="20%">{-dateGap(challenge.endDate) + 1} jours</Td>
                <Td width="10%">
                  <FormUpdateChallenge
                    currentChallenge={challenge}
                    refresh={refresh}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      {formerChallenges.length === 0 && <Text>Aucun défi clôturé</Text>}
    </Flex>
  );
}

export default AdminChallenges;
