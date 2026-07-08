import { useContext } from 'react';
import { AppContext } from '../context/AppContext.jsx';

export function useMeetings() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useMeetings must be used within an AppProvider');
  }

  return context;
}
