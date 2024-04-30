interface TeamData {
  id: string;
  name: string;
  picturePath: string;
  leaderId: string; // Nommez cette propriété leaderId pour stocker l'ID du chef d'équipe
  leaderName?: string; // Stockez le nom du chef d'équipe ici
}

export default TeamData;
