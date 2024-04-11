import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FormControl,
  Input,
  Flex,
  Button,
  Select,
  Textarea,
} from '@chakra-ui/react';
import CategoryData from '../../../interfaces/categoryInterface';
// import { DatePicker } from "react-rainbow-components";

function FormCreateChallenge() {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [points, setPoints] = useState<number>(); // Initialisation à 0
  const [category, setCategory] = useState<string>('');
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [pedagogicalExplanation, setPedagogicalExplanation] =
    useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const challengeDate = new Date(endDate);
    const newChallenge = {
      title,
      description,
      points,
      category,
      pedagogicalExplanation,
      endDate: challengeDate,
    };
    axios
      .post('http://localhost:3001/challenges/create', newChallenge)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
    setTitle('');
    setDescription('');
    setPoints(0); // Remise à zéro
    setCategory('');
    setEndDate(new Date());
    setPedagogicalExplanation('');
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

  // const handleEndDateChange = () => {
  //   setEndDate(new Date());
  // };

  return (
    <FormControl>
      <Flex flexDirection="column" gap={4} borderRadius={8}>
        <FormControl isRequired>
          <Input
            placeholder="Titre du défi"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            focusBorderColor="#166879"
            isRequired
            bg="white"
          />
        </FormControl>
        <Textarea
          placeholder="Description du défi"
          focusBorderColor="#166879"
          onChange={(e) => setDescription(e.target.value)}
          isRequired
          bg="white"
        />
        <Input
          type="number" // Utilisation d'un champ de type nombre
          placeholder="Points"
          focusBorderColor="#166879"
          onChange={(e) => setPoints(parseInt(e.target.value, 10))} // Conversion en nombre entier
          isRequired
          bg="white"
        />
        <Select
          placeholder="Catégorie du défi"
          focusBorderColor="#166879"
          onChange={(e) => setCategory(e.target.value)}
          isRequired
          bg="white"
        >
          {categories.map((categoryItem) => (
            <option key={categoryItem.id} value={categoryItem.id}>
              {categoryItem.categoryName}
            </option>
          ))}
        </Select>
        {/* <DatePicker
          id="datePicker-1"
          onChange={(e) => {
            setEndDate(e);
          }}
          placeholder="Échéance du défi"
          formatStyle="large"
          borderRadius="semi-rounded"
        />{" "} */}
        <Textarea
          placeholder="Explication Pédagoqique"
          focusBorderColor="#166879"
          onChange={(e) => setPedagogicalExplanation(e.target.value)}
          isRequired
          bg="white"
        />
        <Button bg="#166879" color="white" onClick={handleSubmit}>
          Créer un challenge
        </Button>
      </Flex>
    </FormControl>
  );
}

export default FormCreateChallenge;
