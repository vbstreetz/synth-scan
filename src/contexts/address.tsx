import { FC, useContext, createContext, ReactNode, useState } from 'react';

const AddressContext = createContext<{
  address: string | null;
  setAddress: (s: string) => void;
} | null>(null);

export const AddressProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);

  return (
    <AddressContext.Provider value={{ address, setAddress }}>
      {children}
    </AddressContext.Provider>
  );
};

export function useAddress() {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error('Missing Address context');
  }
  const { address, setAddress } = context;
  return { address, setAddress };
}
