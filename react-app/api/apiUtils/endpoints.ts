// Ensemble des ENDPOINTS des entités définis par le controller
const ENTITIES = {
  CHALLENGE: 'challenges',
  USER: 'users',
  TEAM: 'teams',
  COMPLETED: 'completed',
  CATEGORY: 'categories',
};

// ensemble des ENDPOINTS
const ENDPOINTS = {
  CHALLENGE: {
    CHALLENGES_BY_ID: (challengeId: string) =>
      `/${ENTITIES.CHALLENGE}/byId/${challengeId}`,
    CHALLENGES_UPDATE: () => `/${ENTITIES.CHALLENGE}/update`,
    CHALLENGES_DELETE_BY_ID: (challengeId: string) =>
      `/${ENTITIES.CHALLENGE}/delete/${challengeId}`,
  },

  COMPLETED: {
    COMPLETED_BY_USER_ID: (userId: string) =>
      `/${ENTITIES.COMPLETED}/byUserId/${userId}`,
    COMPLETED_CREATE: () => `/${ENTITIES.COMPLETED}/create`,
    COMPLETED_BY_USER_ID_BY_CHALLENGE_ID: (
      userId: string,
      challengeId: string
    ) =>
      `/${ENTITIES.COMPLETED}/byUserIdByChallengeId?userId=${userId}&challengeId=${challengeId}`,
    COMPLETED_DELETE_BY_USER_ID_BY_CHALLENGE_ID: (
      userId: string,
      challengeId: string
    ) =>
      `/${ENTITIES.COMPLETED}/delete?userId=${userId}&challengeId=${challengeId}`,
  },
  USER: {},
  TEAM: {},
  CATEGORY: {
    CATEGORY_GET_ALL: () => `/${ENTITIES.CATEGORY}/all`,
  },
};

export default ENDPOINTS;
