import {
  FC,
  useContext,
  createContext,
  ReactNode,
  useState,
  useEffect,
} from 'react';
import initSynthetixJS, { SynthetixJS } from '@synthetixio/contracts-interface';
import { ethers } from 'ethers';

const NETWORK_ID = 1;
const INFURA_PROVIDER = new ethers.providers.InfuraProvider(
  NETWORK_ID,
  process.env.INFURA_PROJECT_ID
);

const SynthetixContext = createContext<{
  js: SynthetixJS | null;
} | null>(null);

export const SynthetixProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [js, setJS] = useState<SynthetixJS | null>(null);

  useEffect(() => {
    const js = initSynthetixJS({
      networkId: NETWORK_ID,
      provider: INFURA_PROVIDER,
    });
    setJS(js);
  }, []);

  return (
    <SynthetixContext.Provider value={{ js }}>
      {children}
    </SynthetixContext.Provider>
  );
};

export function useSynthetix() {
  const context = useContext(SynthetixContext);
  if (!context) {
    throw new Error('Missing Synthetix context');
  }
  const { js } = context;
  return { js };
}
