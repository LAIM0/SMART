import React, { useState, useEffect } from 'react';
import { Flex, Text, Box, Input, Button } from '@chakra-ui/react';
import SettingsApiManager from '../../api/SettingsApiManager';
function Settings() {
  const [color1, setColor1] = useState<string>();
  const [color2, setColor2] = useState<string>();

  const handleClick = async () => {
    if (color1 && color2) {
      const newSettings = { color1, color2 };
      await SettingsApiManager.modify(newSettings);
    }
  };

  return (
    <Flex p="32px" flexDirection="column" gap="16px">
      <Input
        onChange={(e) => {
          setColor1(e.target.value);
        }}
      ></Input>
      <Input
        onChange={(e) => {
          setColor2(e.target.value);
        }}
      ></Input>
      <Button onClick={handleClick}> Valider</Button>
    </Flex>
  );
}

export default Settings;
