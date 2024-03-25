import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    primary: {
      300: "#166879",
      100: "#D3E0E2"
      // Ajoutez d'autres nuances de couleur selon vos besoins
    },
    seondary: {
      300: "#54C8C3"
      // Ajoutez d'autres nuances de couleur selon vos besoins
      // Ajoutez d'autres palettes de couleurs selon vos besoins
    },
    tertiary: "#F8F8F8"
    // Ajoutez d'autres nuances de couleur selon vos besoins
  },
  radii: {
    sm: "4px", // Petit rayon
    md: "8px", // Rayon moyen (par défaut)
    lg: "12px", // Grand rayon
    xl: "16px" // Très grand rayon
  },
  fonts: {
    body: "Poppins, sans-serif",
    heading: "Poppins, sans-serif"
  },
  styles: {
    global: {
      "*::-webkit-scrollbar": {
        display: "none" // Masque la scrollbar pour les navigateurs basés sur WebKit (comme Chrome et Safari)
      },
      "*": {
        scrollbarWidth: "none" // Masque la scrollbar pour les autres navigateurs
      }
    }
  }
  // Ajoutez d'autres modifications de thème selon vos besoins
});

export default theme;
