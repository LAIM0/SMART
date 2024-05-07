import React, { useEffect, useState } from 'react';
import { Flex, Text, Button, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useRouter } from 'next/router';
import SettingsApiManager from '../../../api/SettingsApiManager';
import { SettingsData } from '../../../interfaces/settingsInterface';
import ColorPicker from '../../../components/Buttons/ColorPicker';
import ChangeLogo from './ChangeLogo';
import { handleAdminRouting } from '../../../api/AuthApiManager';

function Settings() {
  const router = useRouter();
  useEffect(() => {
    handleAdminRouting(router);
  }, []);
  const [color1, setColor1] = useState<string>();
  const [color2, setColor2] = useState<string>();
  const [logo, setLogo] = useState<string | null>(null);

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
      setLogo(settings.logo || null);
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
          title: 'Couleurs modifiées',
          description: 'Rechargez la page pour mettre à jour',
        },
        error: {
          title: 'Erreur',
          description: 'Les couleurs ne peuvent pas être modifiés',
        },
        loading: {
          title: 'Chargement',
          description: 'Mise à jour des couleurs en cours',
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

  const handleUploadProfilePicture = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(
        `http://localhost:3001/settings/upload`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      toast.promise(Promise.resolve(response), {
        success: {
          title: 'Logo modifié',
          description: 'Rechargez la page pour mettre à jour',
        },
        error: {
          title: 'Erreur',
          description: 'Le logo ne peut pas être modifié',
        },
        loading: {
          title: 'Chargement',
          description: 'Mise à jour du logo en cours',
        },
      });
      console.log('Upload successful:', response.data);
      setLogo(response.data.logo);
    } catch (error) {
      /* empty */
    }
  };

  return (
    <Flex p="32px" flexDirection="column" gap="16px">
      <Text as="h1">Paramètres</Text>
      {color1 &&
        color2 && ( // Vérifie si color1 et color2 sont définis
          <Flex gap="48px" w="fit-content" mb="16px">
            <Flex flexDirection="column" gap="4px" w="fit-content">
              <Text as="h2">Couleur 1</Text>
              <Text>Choisissez plutôt une couleur sombre</Text>
              <ColorPicker
                onColorChange={handleColorChange1}
                initialColor={color1}
              />
            </Flex>
            <Flex flexDirection="column" gap="4px" w="fit-content">
              <Text as="h2">Couleur 2</Text>{' '}
              <Text>Choisissez plutôt une couleur vive</Text>
              <ColorPicker
                onColorChange={handleColorChange2}
                initialColor={color2}
              />
            </Flex>
          </Flex>
        )}

      <Button
        bg="primary.300"
        onClick={handleClick}
        color="white"
        w="fit-content"
        px="48px"
        mb="16px"
      >
        Valider les nouvelles couleurs
      </Button>
      <Flex flexDirection="column" gap="4px">
        <Text as="h2">Logo de l&apos;app</Text>
        <Text mb="4px">Cliquez ci-dessous pour modifier</Text>
        <ChangeLogo
          onSubmit={handleUploadProfilePicture}
          profilePicture={logo}
        />
      </Flex>
    </Flex>
  );
}

export default Settings;
