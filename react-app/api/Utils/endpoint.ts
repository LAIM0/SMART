// Ensemble des ENDPOINTS des entités définis par le controller
const ENTITIES = {
  CHALLENGE: 'challenges',
  USER: 'users',
  TEAM: 'teams',
  COMPLETED: 'completed',
};

// ensemble des ENDPOINTS
const ENDPOINTS = {
  CHALLENGES_BY_ID: (challengeId: string) =>
    `/${ENTITIES.CHALLENGE}/byId/${challengeId}`,
  COMPLETED_BY_USER_ID: (userId: string) =>
    `/${ENTITIES.COMPLETED}/byUserId/${userId}`,
  COMPLETED_CREATE: () => `/${ENTITIES.COMPLETED}/create`,
};

export default ENDPOINTS;
