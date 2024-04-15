import { extendTheme } from '@chakra-ui/react';

import '@fontsource/poppins/400.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
import '@fontsource/poppins/800.css';

const theme = extendTheme({
  colors: {
    primary: {
      300: '#166879',
      100: '#D3E0E2',
      // Ajoutez d'autres nuances de couleur selon vos besoins
    },
    secondary: {
      300: '#33C1B1',
      100: '#B9E4DF',
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

export default theme;
