/* eslint-disable */
import React from "react";
import { useGlobalState } from "./../contexts/Context";
import LayoutAdmin from "../components/Layout/LayoutAdmin";
import AdminCreateChallenge from "./ChallengeAdmin/AdminCreateChallenge";

function App(): JSX.Element {
  const { globalState, setGlobalState } = useGlobalState();

  return (
    <div>
      <LayoutAdmin>
        {globalState === "Utilisateurs" && <div>Utilisateurs</div>}
        {globalState === "Defis" && <AdminCreateChallenge />}
      </LayoutAdmin>
    </div>
  );
}

export default App;
