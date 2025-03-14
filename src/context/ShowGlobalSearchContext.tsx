import React, { createContext, useState } from 'react';

interface ShowGlobalSearchContextType {
  showGlobalSearch: boolean;
  setShowGlobalSearch: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ShowGlobalSearchProviderProps {
  children: React.ReactNode;
}

export const ShowGlobalSearchContext =
  createContext<ShowGlobalSearchContextType>({} as ShowGlobalSearchContextType);

export const ShowGlobalSearchProvider: React.FC<
  ShowGlobalSearchProviderProps
> = ({ children }) => {
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);

  return (
    <ShowGlobalSearchContext.Provider
      value={{ showGlobalSearch, setShowGlobalSearch }}
    >
      {children}
    </ShowGlobalSearchContext.Provider>
  );
};
