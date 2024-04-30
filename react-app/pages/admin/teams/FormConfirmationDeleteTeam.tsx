/* eslint-disable no-underscore-dangle */
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';

import { FormControl, Flex, Button } from '@chakra-ui/react';
import TeamData from '../../../interfaces/teamInterface';
import TeamApiManager from '../../../api/TeamApiManager';

interface FormConfirmationDeleteTeamProps {
  onCloseModal: () => void;
  teamToDelete: TeamData;
}

function FormConfirmationDeleteTeam({
  onCloseModal,
  teamToDelete,
}: FormConfirmationDeleteTeamProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(teamToDelete.id);
    try {
      await TeamApiManager.delete(teamToDelete.id);
      onCloseModal();
    } catch (error) {
      console.error('Erreur lors de la suppression des données:', error);
    }
  };

  return (
    <FormControl>
      <Flex flexDirection="column" gap={4} borderRadius={8}>
        <Flex>
          L&apos;ensemble des membres de {teamToDelete?.name} vont passer
          l&apos;équipe par défaut.
        </Flex>
        <Button colorScheme="red" color="white" onClick={handleSubmit}>
          Confirmer la supression
        </Button>
      </Flex>
    </FormControl>
  );
}

FormConfirmationDeleteTeam.propTypes = {
  onCloseModal: PropTypes.func.isRequired,
  teamToDelete: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default FormConfirmationDeleteTeam;
