import { useState } from 'react';

function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error: unknown) {
      console.error(error);
      return initialValue;
    }
  });

  function setValue(value: T): void {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error: unknown) {
      console.error(`Error setting localStorage key “${key}” :: ${error}`);
    }
  }

  return { storedValue, setValue };
}

export default useLocalStorage;
