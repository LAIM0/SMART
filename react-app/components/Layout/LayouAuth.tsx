import React, { createContext, useEffect, useState } from 'react';
import { ChakraProvider, Flex, extendTheme } from '@chakra-ui/react';
import Sidebar from '../Sidebar/Sidebar';
import { SettingsData } from '../../interfaces/settingsInterface';
import SettingsApiManager from '../../api/SettingsApiManager';

interface LayoutProps {
  children: React.ReactNode;
}

const LogoContext = createContext<string | undefined>(undefined);

function LayoutAuth({ children }: LayoutProps): JSX.Element {
  const [settings, setSettings] = useState<SettingsData>();
  const [theme, setTheme] = useState<string | any>();
  const [logoPath, setLogoPath] = useState<string>();

  useEffect(() => {
    console.log('fetchSettings');
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

  function attenuateColor(hexColor: string, alpha: number) {
    // Convertir la couleur hexadécimale en valeurs RVB
    const r = parseInt(hexColor.substring(1, 3), 16);
    const g = parseInt(hexColor.substring(3, 5), 16);
    const b = parseInt(hexColor.substring(5, 7), 16);

    // Couleur de fond (blanc)
    const backgroundR = 255;
    const backgroundG = 255;
    const backgroundB = 255;

    // Calcul de la couleur résultante
    const resultR = Math.round(r * alpha + backgroundR * (1 - alpha));
    const resultG = Math.round(g * alpha + backgroundG * (1 - alpha));
    const resultB = Math.round(b * alpha + backgroundB * (1 - alpha));

    // Convertir les valeurs RVB en couleur hexadécimale
    const newHexColor = `#${((resultR << 16) | (resultG << 8) | resultB).toString(16).padStart(6, '0')}`;

    return newHexColor;
  }

  useEffect(() => {
    if (settings?.color1 && settings?.color2) {
      const customTheme = extendTheme({
        colors: {
          primary: {
            300: settings?.color1,
            200: '#78A6B0',
            100: attenuateColor(settings?.color1, 0.3),
            // Ajoutez d'autres nuances de couleur selon vos besoins
          },
          secondary: {
            300: settings?.color2,
            100: attenuateColor(settings?.color2, 0.3),
            // Ajoutez d'autres palettes de couleurs selon vos besoins
          },
          tertiary: '#F8F8F8',
          redCoexya: '#E00061',
          // Ajoutez d'autres nuances de couleur selon vos besoins
        },
        radii: {
          sm: '4px', // Petit rayon
          md: '8px', // Rayon moyen (par défaut)
          lg: '12px', // Grand rayon
          xl: '16px', // Très grand rayon
        },
        shadows: {
          sm: '0 4px 5.5px rgba(0, 0, 0, 0.02)',
          md: '0 4px 12px rgba(0, 0, 0, 0.1)',
          lg: '0 6px 16px rgba(0, 0, 0, 0.1)',
          xl: '0 8px 24px rgba(0, 0, 0, 0.1)',
          button: '0 8px 24px rgba(51, 193, 177, 0.4)',
        },
        fonts: {
          body: `'Poppins', sans-serif`,
          heading: `'Poppins', sans-serif`,
        },
        fontWeights: {
          normal: 400,
          semiBold: 600,
          bold: 700,
          extraBold: 800,
        },
        fontSizes: {
          b1: '1rem',
          h3: '1.25rem',
          h2: '1.5rem',
          h1: '2rem',
        },
        styles: {
          global: {
            html: {
              fontSize: '14px',
            },
            '*::-webkit-scrollbar': {
              display: 'none', // Masque la scrollbar pour les navigateurs basés sur WebKit (comme Chrome et Safari)
            },
            '*': {
              scrollbarWidth: 'none', // Masque la scrollbar pour les autres navigateurs
            },
            h1: {
              marginBottom: '1rem',
              fontSize: '2rem',
              fontWeight: 'extraBold',
              color: '#2D3748',
            },
            h2: {
              marginBottom: '0rem',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#2D3748',
            },
            h3: {
              marginBottom: '0rem',
              fontSize: '1.25rem',
              fontWeight: 'semiBold',
              color: '#2D3748',
            },
            h4: {
              marginBottom: '0rem',
              fontSize: '1.1rem',
              fontWeight: 'semiBold',
              color: '#2D3748',
            },
          },
        },
        // Ajoutez d'autres modifications de thème selon vos besoins
      });
      setTheme(customTheme);
    }
    setLogoPath(settings?.logo);
  }, [settings]);

  //const LogoContext = React.createContext(logoPath);

  return (
    <LogoContext.Provider value={logoPath}>
      <ChakraProvider theme={theme}>
        {children}
        <div />
      </ChakraProvider>
    </LogoContext.Provider>
  );
}

export default LayoutAuth;
export { LogoContext }; // Exportez explicitement le contexte
