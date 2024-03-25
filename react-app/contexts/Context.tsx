import React, { createContext, useContext, useState, ReactNode } from "react";

// Interface pour le type de l'état global
interface GlobalState {
  globalState: string;
  setGlobalState: React.Dispatch<React.SetStateAction<string>>;
}

// Création du contexte avec le type de l'état global
const GlobalStateContext = createContext<GlobalState | undefined>(undefined);

// Création du fournisseur de contexte avec les props typées
export const GlobalStateProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const [globalState, setGlobalState] = useState<string>("Classement");
  // Définissez votre état initial ici

  return (
    <GlobalStateContext.Provider value={{ globalState, setGlobalState }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

// Fonction utilitaire pour utiliser le contexte dans les composants
export const useGlobalState = (): GlobalState => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error(
      "useGlobalState doit être utilisé dans un composant enveloppé avec GlobalStateProvider"
    );
  }
  return context;
};
