/* eslint-disable */
import Layout from "./Layout/Layout";
import React from "react";
import { useGlobalState } from "./../contexts/Context";
import Challenges from "./Challenges/Challenges";
import AdminCreateChallenge from "./ChallengeAdmin/AdminCreateChallenge";

function App(): JSX.Element {
  const { globalState, setGlobalState } = useGlobalState();

  return (
    <div>
      <Layout>
        {globalState === "Classement" && <div>Classement</div>}
        {globalState === "Defis" && <Challenges />}
        {globalState === "Profil" && <div>Profil</div>}
      </Layout>
    </div>
  );
}

export default App;
