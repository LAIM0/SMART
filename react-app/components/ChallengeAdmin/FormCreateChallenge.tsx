/*eslint-disable*/
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FormControl,
  Input,
  Flex,
  Button,
  Select,
  Heading,
  Textarea
} from "@chakra-ui/react";
//import { DatePicker } from "react-rainbow-components";

interface Category {
  _id: string;
  categoryName: string;
}

interface ChallengeData {
  _id: string;
  title: string;
  description: string;
  points: number;
  category: string;
  endDate: Date;
}

function FormCreateChallenge() {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [points, setPoints] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [endDate, setEndDate] = useState<Date>(new Date());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const challengeDate = new Date(endDate);
    const newChallenge = {
      title,
      description,
      points,
      category,
      endDate: challengeDate
    };
    axios
      .post("http://localhost:3001/challenges/create", newChallenge)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
    setTitle("");
    setDescription("");
    setPoints("");
    setCategory("");
    setEndDate(new Date());
  };

  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get<Category[]>(
        "http://localhost:3001/categories/all"
      );
      setCategories(response.data);
    };

    fetchData();
  }, []);

  const handleEndDateChange = () => {
    setEndDate(new Date());
  };

  return (
    <FormControl>
      <Flex flexDirection="column" gap={4} borderRadius={8}>
        <Input
          placeholder="Titre du défi"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          focusBorderColor="#166879"
          isRequired={true}
          bg="white"
        />
        <Textarea
          placeholder="Description du défi"
          focusBorderColor="#166879"
          onChange={(e) => setDescription(e.target.value)}
          isRequired={true}
          bg="white"
        />
        <Input
          placeholder="Points"
          focusBorderColor="#166879"
          onChange={(e) => setPoints(e.target.value)}
          isRequired={true}
          bg="white"
        />
        <Select
          placeholder="Select option"
          focusBorderColor="#166879"
          onChange={(e) => setCategory(e.target.value)}
          isRequired={true}
          bg="white"
        >
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.categoryName}
            </option>
          ))}
        </Select>
        {/* <DatePicker
          id="datePicker-1"
          value={endDate}
          onChange={(e) => {
            setEndDate(e);
          }}
          label="DatePicker Label"
          formatStyle="large"
        />{" "} */}
        <Button bg="#166879" color="white" onClick={handleSubmit}>
          Créer un challenge
        </Button>
      </Flex>
    </FormControl>
  );
}

export default FormCreateChallenge;
