import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
} from 'react';

// Interface pour le type de l'état global
interface GlobalState {
  globalState: string;
  setGlobalState: React.Dispatch<React.SetStateAction<string>>;
}

const initialGlobalState: GlobalState = {
  globalState: 'Classement',
  setGlobalState: () => {}, // Fonction vide par défaut
};
// Création du contexte avec le type de l'état global
const GlobalStateContext = createContext<GlobalState | undefined>(undefined);

// Création du fournisseur de contexte avec les props typées
export function GlobalStateProvider({ children }: { children: ReactNode }) {
  const [globalState, setGlobalState] = useState<string>(
    initialGlobalState.globalState
  );
  const memoizedValue = useMemo(
    () => ({
      globalState,
      setGlobalState,
    }),
    [globalState, setGlobalState]
  );

  return (
    <GlobalStateContext.Provider value={memoizedValue}>
      {children}
    </GlobalStateContext.Provider>
  );
}

// Fonction utilitaire pour utiliser le contexte dans les composants
export const useGlobalState = (): GlobalState => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error(
      'useGlobalState must be used in a component wrapped with GlobalStateProvider'
    );
  }
  return context;
};
