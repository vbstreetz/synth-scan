import { FC, useContext, createContext, ReactNode } from 'react';
import NProgress from 'nprogress';

const UIContext = createContext<{
  startProgress: () => void;
  endProgress: () => void;
} | null>(null);

export const UIProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const startProgress = () => {
    NProgress.start();
    NProgress.set(0.4);
  };

  const endProgress = () => {
    NProgress.done();
  };
  return (
    <UIContext.Provider value={{ startProgress, endProgress }}>
      {children}
    </UIContext.Provider>
  );
};

export function useUI() {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('Missing UI context');
  }
  const { startProgress, endProgress } = context;
  return { startProgress, endProgress };
}
