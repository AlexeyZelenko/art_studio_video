import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { auth } from '../firebase/config';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';

// Список разрешенных пользователей
const ALLOWED_USERS = [
  'tic9XhMbjoanZqv8APUXxB4qBho2',
  'sDA9CXMla5MarE6i6CFc7J6jWiF3'
];

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Проверяем, есть ли пользователь в списке разрешенных
        const authorized = ALLOWED_USERS.includes(user.uid);
        setIsAuthorized(authorized);
        
        if (authorized) {
          setUser(user);
        } else {
          // Если пользователь не авторизован, выходим из системы
          signOut(auth);
          setUser(null);
          console.warn('Користувач не авторизований для доступу до програми');
        }
      } else {
        setUser(null);
        setIsAuthorized(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      
      // Проверяем авторизацию после входа
      if (!ALLOWED_USERS.includes(result.user.uid)) {
        await signOut(auth);
        throw new Error('У вас немає доступу до цієї програми');
      }
      
      return result.user;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return { 
    user, 
    loading, 
    isAuthorized, 
    signInWithGoogle, 
    logout 
  };
};