import React, { useEffect, useState } from 'react';
import {
  ComponentWithAs,
  Flex,
  IconProps,
  Image,
  Spacer,
  Text,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import {
  FolderIcon,
  SettingsIcon,
  StarIcon,
  TeamIcon,
  UserIcon,
} from '../../styles/icons';

interface Page {
  name: string;
  url: string;
  icon: ComponentWithAs<'svg', IconProps>;
}

const Pages: Page[] = [
  {
    name: 'Défis',
    url: '/challenges',
    icon: StarIcon,
  },
  {
    name: 'Catégories',
    url: '/categories',
    icon: FolderIcon,
  },
  {
    name: 'Utilisateurs',
    url: '/users',
    icon: UserIcon,
  },
  {
    name: 'Équipes',
    url: '/teams',
    icon: TeamIcon,
  },
  {
    name: 'Paramètres',
    url: '/settings',
    icon: SettingsIcon,
  },
];

interface SidebarProps {
  logoPath: string | undefined;
}

function Sidebar({ logoPath }: SidebarProps) {
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    handleResize(); // Appel initial pour définir la largeur de la fenêtre
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const router = useRouter();

  return (
    <Flex
      zIndex={10}
      bg="white"
      color="grey.800"
      p={6}
      gap={4}
      flexDirection={windowWidth < 500 ? 'row' : 'column'}
      w={windowWidth < 500 ? '100%' : '250px'}
      h={windowWidth < 500 ? '120px' : '100vh'}
      position="fixed"
      left="0"
      top={windowWidth < 500 ? 'auto' : '0'}
      boxShadow="xl"
      bottom={windowWidth < 500 ? '0' : 'auto'}
    >
      {windowWidth > 500 && logoPath && (
        <Image
          w="100%"
          objectFit="contain"
          src={`http://localhost:3001/users/profile-picture/${logoPath}`}
          alt={logoPath}
        />
      )}
      {Pages.map((page) => (
        <Flex
          flex={windowWidth < 500 ? 1 : 0}
          flexDirection={windowWidth < 500 ? 'column' : 'row'}
          key={page.name}
          py="4"
          px="6"
          gap="16px"
          borderRadius="md"
          alignItems="center"
          pl={windowWidth < 500 ? 'auto' : '16px'}
          fontSize={windowWidth < 500 ? '12px' : 'auto'}
          color={router.pathname.includes(page.url) ? 'white' : 'grey.800'}
          fontWeight={router.pathname.includes(page.url) ? 'bold' : 'light'}
          _hover={{
            bg: router.pathname.includes(page.url)
              ? 'secondary.100'
              : '#F1F1F1',
            cursor: 'pointer',
          }}
          bg={router.pathname.includes(page.url) ? 'secondary.100' : 'auto'}
          onClick={() => router.push(`/admin${page.url}`)}
          transition="background 0.3s ease, fontWeight 0.8s ease"
        >
          <page.icon
            width="26"
            height="26"
            viewBox="-2 -2 30 30"
            stroke="none"
            strokeWidth="1.5"
            color={
              router.pathname.includes(page.url) ? 'primary.300' : 'primary.300'
            }
          />
          <Text
            color={
              router.pathname.includes(page.url) ? 'primary.300' : 'primary.300'
            }
            fontWeight={router.pathname.includes(page.url) ? 'bold' : 'light'}
            lineHeight={1}
            fontSize={windowWidth < 500 ? '12px' : '16px'}
          >
            {page.name}
          </Text>
        </Flex>
      ))}
      <Spacer />
      <Text
        fontSize="lg"
        color="primary.300"
        fontWeight="semibold"
        fontStyle="italic"
        textAlign="center"
      >
        administrateur
      </Text>
    </Flex>
  );
}

export default Sidebar;
