import React, { createContext, useState } from 'react';
import jsonData from './data.json';

const SortedOptionsContext = createContext();

export const SortedOptionsProvider = ({ children }) => {
  const [sortedOptions, setSortedOptions] = useState(jsonData);

  return (
    <SortedOptionsContext.Provider value={{ sortedOptions, setSortedOptions }}>
      {children}
    </SortedOptionsContext.Provider>
  );
};

export { SortedOptionsContext };
