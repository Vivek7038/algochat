import { useState, useEffect } from 'react';

export function useStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);

  useEffect(() => {
    chrome.storage.local.get([key], (result) => {
      if (result[key] !== undefined) {
        setValue(result[key]);
      }
    });
  }, [key]);

  const setStorageValue = (newValue: T) => {
    chrome.storage.local.set({ [key]: newValue });
    setValue(newValue);
  };

  return [value, setStorageValue] as const;
} 