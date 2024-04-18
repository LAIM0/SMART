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
  },

  COMPLETED: {
    COMPLETED_BY_USER_ID: (userId: string) =>
      `/${ENTITIES.COMPLETED}/byUserId/${userId}`,
    COMPLETED_CREATE: () => `/${ENTITIES.COMPLETED}/create`,
  },
  USER: {},
  TEAM: {},
  CATEGORY: {
    CATEGORY_GET_BY_ID: (categoryId: string) => `/${ENTITIES.CATEGORY}/byId/${categoryId}`,
    CATEGORY_GET_ALL: () => `/${ENTITIES.CATEGORY}/all`,
    CATEGORY_CREATE: () => `/${ENTITIES.CATEGORY}/create`,
    CATEGORY_DELETE: (categoryId: string) => `/${ENTITIES.CATEGORY}/delete/${categoryId}`,
  },
};

export default ENDPOINTS;
