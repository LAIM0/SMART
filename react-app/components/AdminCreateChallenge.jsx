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
  Textarea,
  DatePicker,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer
} from "@chakra-ui/react";

function Form() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [points, setPoints] = useState("");
  const [category, setCategory] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = (e) => {
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
    setEndDate("");
  };

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("http://localhost:3001/categories/all");
      setCategories(response.data);
    };

    fetchData();
  }, []);

  return (
    <Flex flexDirection="column">
      <FormControl width={500}>
        <Flex
          flexDirection="column"
          gap={4}
          p={8}
          m={8}
          bg="#FAFAFA"
          borderRadius={8}
        >
          <Heading>Ajouter un défi</Heading>
          <Input
            placeholder="Titre du défi"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            focusBorderColor="#166879"
            isRequired="true"
            bg="white"
          />
          <Textarea
            placeholder="Description du défi"
            focusBorderColor="#166879"
            onChange={(e) => setDescription(e.target.value)}
            isRequired="true"
            bg="white"
          />
          <Input
            placeholder="Points"
            focusBorderColor="#166879"
            onChange={(e) => setPoints(e.target.value)}
            isRequired="true"
            bg="white"
          />
          <Select
            placeholder="Select option"
            focusBorderColor="#166879"
            onChange={(e) => setCategory(e.target.value)}
            isRequired="true"
            bg="white"
          >
            {categories.map((category) => (
              <option key={category} value={category._id}>
                {category.categoryName}
              </option>
            ))}
          </Select>
          <Input
            placeholder="Échéance du défi"
            focusBorderColor="#166879"
            onChange={(e) => setEndDate(e.target.value)}
            isRequired="true"
            bg="white"
          />
          <Button bg="#166879" color="white" onClick={handleSubmit}>
            Créer un challenge
          </Button>
        </Flex>
      </FormControl>

      <TableContainer>
        <Table variant="simple">
          <TableCaption>Imperial to metric conversion factors</TableCaption>
          <Thead>
            <Tr>
              <Th>To convert</Th>
              <Th>into</Th>
              <Th isNumeric>multiply by</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>inches</Td>
              <Td>millimetres (mm)</Td>
              <Td isNumeric>25.4</Td>
            </Tr>
            <Tr>
              <Td>feet</Td>
              <Td>centimetres (cm)</Td>
              <Td isNumeric>30.48</Td>
            </Tr>
            <Tr>
              <Td>yards</Td>
              <Td>metres (m)</Td>
              <Td isNumeric>0.91444</Td>
            </Tr>
          </Tbody>
          <Tfoot>
            <Tr>
              <Th>To convert</Th>
              <Th>into</Th>
              <Th isNumeric>multiply by</Th>
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>
    </Flex>
  );
}

export default Form;
