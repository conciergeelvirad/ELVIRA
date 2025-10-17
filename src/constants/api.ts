export const API_ENDPOINTS = {
  USERS: '/users',
  POSTS: '/posts',
  // Add your API endpoints here
} as const;

export const API_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
} as const;

export type ApiMethod = typeof API_METHODS[keyof typeof API_METHODS];
