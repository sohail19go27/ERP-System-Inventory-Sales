import { useState, useEffect } from 'react';
import authService from '../services/auth.service';

export const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  return { user, isAuthenticated: !!user };
};
