import React, { createContext, useState } from 'react';

interface ShowAiDialogContextType {
  showAiDialog: boolean;
  setShowAiDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ShowGlobalSearchProviderProps {
  children: React.ReactNode;
}

export const ShowAiDialogContext = createContext<ShowAiDialogContextType>(
  {} as ShowAiDialogContextType
);

export const ShowAiDialogProvider: React.FC<ShowGlobalSearchProviderProps> = ({
  children,
}) => {
  const [showAiDialog, setShowAiDialog] = useState(false);

  return (
    <ShowAiDialogContext.Provider value={{ showAiDialog, setShowAiDialog }}>
      {children}
    </ShowAiDialogContext.Provider>
  );
};
