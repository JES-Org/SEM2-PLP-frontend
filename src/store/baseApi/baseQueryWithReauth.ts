// src/api/baseQueryWithReauth.ts
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { Mutex } from 'async-mutex';

// Create a mutex instance to avoid overlapping refresh requests.
const mutex = new Mutex();
const createBaseQueryWithReauth = (baseUrl: string): BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> => {
  // Create our underlying base query
  const rawBaseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      // Read token from localStorage (adjust if you use cookies)
      const currUser = JSON.parse(localStorage.getItem('currUser') || '{}');
      const token = currUser.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  });

  // Return a function that wraps the raw base query with refresh logic.
  return async (args, api, extraOptions) => {
    // Wait for any pending refresh calls to finish.
    await mutex.waitForUnlock();

    // Try the original request.
    let result = await rawBaseQuery(args, api, extraOptions);

    // If a 401 error is returned...
    if (result.error && result.error.status === 401) {
      // If the mutex isn’t already locked, perform token refresh.
      if (!mutex.isLocked()) {
        const release = await mutex.acquire();
        try {
          // Get refresh token from storage.
          const currUser = JSON.parse(localStorage.getItem('currUser') || '{}');
          const refreshToken = currUser.refresh;
          if (!refreshToken) {
            // No refresh token means you might want to force a logout.
            localStorage.removeItem('currUser');
            return result;
          }
          // Attempt to refresh the access token.
          const refreshResult = await fetchBaseQuery({
            baseUrl:"", // Note: Use the same or a different URL if your refresh endpoint is separate.
            prepareHeaders: (headers) => {
              headers.set('Content-Type', 'application/json');
              return headers;
            },
          })({
            url: 'http://localhost:8000/api/user/token/refresh/', 
            method: 'POST',
            body: { refresh: refreshToken },
          }, api, extraOptions);

          if (refreshResult.data) {
            // If refresh worked, update the access token in localStorage.
            const data: any = refreshResult.data;
            localStorage.setItem(
              'currUser',
              JSON.stringify({ ...currUser, token: data.access })
            );
            // Retry the initial query with the new token.
            result = await rawBaseQuery(args, api, extraOptions);
          } else {
            // If refresh fails, clear stored credentials (or handle as needed).
            localStorage.removeItem('currUser');
          }
        } finally {
          release();
        }
      } else {
        // If another refresh request is in process, wait for it and retry.
        await mutex.waitForUnlock();
        result = await rawBaseQuery(args, api, extraOptions);
      }
    }
    return result;
  };
};

export default createBaseQueryWithReauth;
