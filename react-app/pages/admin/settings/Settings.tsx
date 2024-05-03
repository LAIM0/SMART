import React, { useEffect, useState } from 'react';
import { Flex, Text, Button, useToast } from '@chakra-ui/react';
import SettingsApiManager from '../../../api/SettingsApiManager';
import { SettingsData } from '../../../interfaces/settingsInterface';
import ColorPicker from '../../../components/Buttons/Colorpicker';
import ChangeLogo from './ChangeLogo';

function Settings() {
  const [color1, setColor1] = useState<string>();
  const [color2, setColor2] = useState<string>();
  const toast = useToast();
  const [settings, setSettings] = useState<SettingsData>();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await SettingsApiManager.getAll();
        setSettings(response[0]);
      } catch (error) {
        console.error('Erreur lors de la récupération des settings: ', error);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    if (settings) {
      setColor1(settings.color1 || '#000000');
      setColor2(settings.color2 || '#000000');
    }
  }, [settings]);

  useEffect(() => {
    console.log(color1);
  }, [color1]);

  const handleClick = async () => {
    if (color1 && color2) {
      const newSettings = { color1, color2 };
      const updatedSettingsData: SettingsData =
        await SettingsApiManager.modify(newSettings);
      toast.promise(Promise.resolve(updatedSettingsData), {
        success: {
          title: 'Paramètres modifiées',
          description: 'Rechargez la page pour mettre à jour',
        },
        error: {
          title: 'Erreur',
          description: 'Les paramètres ne peuvent pas être modifiés',
        },
        loading: {
          title: 'Chargement',
          description: 'Mise à jour des paramètres en cours',
        },
      });
    }
  };

  const handleColorChange1 = (color: string) => {
    setColor1(color);
  };

  const handleColorChange2 = (color: string) => {
    setColor2(color);
  };

  return (
    <Flex p="32px" flexDirection="column" gap="16px">
      <Text as="h1">Paramètres</Text>
      {color1 &&
        color2 && ( // Vérifie si color1 et color2 sont définis
          <>
            <Text as="h2">Couleur 1</Text>
            <ColorPicker
              onColorChange={handleColorChange1}
              initialColor={color1}
            />
            <Text as="h2">Couleur 2</Text>
            <ColorPicker
              onColorChange={handleColorChange2}
              initialColor={color2}
            />
          </>
        )}
      <ChangeLogo/>
      <Button bg="primary.300" onClick={handleClick} color="white">
        Valider
      </Button>
    </Flex>
  );
}

export default Settings;
