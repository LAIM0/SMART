// Ensemble des ENDPOINTS des entités définis par le controller
const ENTITIES = {
  CHALLENGE: 'challenges',
  USER: 'users',
  TEAM: 'teams',
  COMPLETED: 'completed',
  CATEGORY: 'categories',
  SETTINGS: 'settings',
};

// ensemble des ENDPOINTS
const ENDPOINTS = {
  CHALLENGE: {
    CHALLENGES_BY_ID: (challengeId: string) =>
      `/${ENTITIES.CHALLENGE}/byId/${challengeId}`,
    CHALLENGES_UPDATE: () => `/${ENTITIES.CHALLENGE}/update`,
    CHALLENGES_DELETE_BY_ID: (challengeId: string) =>
      `/${ENTITIES.CHALLENGE}/delete/${challengeId}`,
    CHALLENGES_CREATE: () => `/${ENTITIES.CHALLENGE}/create`,
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
  TEAM: {
    TEAM_CREATE: () => `/${ENTITIES.TEAM}/create`,
    TEAM_DELETE: (teamId: string) => `/${ENTITIES.TEAM}/delete/${teamId}`,
    TEAM_MODIFY: (teamId: string) => `/${ENTITIES.TEAM}/modify/${teamId}`,
  },
  CATEGORY: {
    CATEGORY_GET_BY_ID: (categoryId: string) =>
      `/${ENTITIES.CATEGORY}/byId/${categoryId}`,
    CATEGORY_GET_ALL: () => `/${ENTITIES.CATEGORY}/all`,
    CATEGORY_CREATE: () => `/${ENTITIES.CATEGORY}/create`,
    CATEGORY_DELETE: (categoryId: string) =>
      `/${ENTITIES.CATEGORY}/delete/${categoryId}`,
    CATEGORY_MODIFY: (categoryId: string) =>
      `/${ENTITIES.CATEGORY}/modify/${categoryId}`,
    CATEGORY_COUNT: (categoryId: string) =>
      `/${ENTITIES.CATEGORY}/countChallenge/${categoryId}`,
  },
  SETTINGS: {
    SETTINGS_GET_ALL: () => `/${ENTITIES.SETTINGS}/all`,
    SETTINGS_CREATE: () => `/${ENTITIES.SETTINGS}/create`,
    SETTINGS_MODIFY: () => `/${ENTITIES.SETTINGS}/modify`,
  },
};

export default ENDPOINTS;
