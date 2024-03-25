import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    primary: {
      300: "#166879",
      100: "#D3E0E2",
      // Ajoutez d'autres nuances de couleur selon vos besoins
    },
    seondary: {
      300: "#54C8C3",
      // Ajoutez d'autres nuances de couleur selon vos besoins
      // Ajoutez d'autres palettes de couleurs selon vos besoins
    },
  },
  radii: {
    sm: "4px", // Petit rayon
    md: "8px", // Rayon moyen (par défaut)
    lg: "12px", // Grand rayon
    xl: "16px", // Très grand rayon
  },
  fonts: {
    body: "Poppins, sans-serif",
    heading: "Poppins, sans-serif",
  },
  // Ajoutez d'autres modifications de thème selon vos besoins
});

export default theme;