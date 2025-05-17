// src/utils/auth.ts
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  exp: number;
  // Add other claims if needed, e.g., user_id
}

export const isTokenExpired = (token: string | null | undefined): boolean => {
  if (!token) {
    return true; 
  }
  try {
    const decodedToken: DecodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Convert to seconds
    // Optional: Add a small buffer (e.g., 30-60 seconds) to refresh slightly before actual expiry
    const bufferSeconds = 30;
    return decodedToken.exp < currentTime + bufferSeconds;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true; // Malformed or unparsable token is treated as expired
  }
};
