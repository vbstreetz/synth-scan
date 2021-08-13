import {
  FC,
  useContext,
  createContext,
  ReactNode,
  useState,
  useEffect,
} from 'react';
import initSynthetixJS, { SynthetixJS } from '@synthetixio/contracts-interface';
import initSynthetixData, { SynthetixData } from '@synthetixio/data';
import { ethers } from 'ethers';

const NETWORK_ID = 1;
const INFURA_PROVIDER = new ethers.providers.InfuraProvider(
  NETWORK_ID,
  process.env.INFURA_PROJECT_ID
);

const SynthetixContext = createContext<{
  js: SynthetixJS | null;
  data: SynthetixData | null;
} | null>(null);

export const SynthetixProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [js, setJS] = useState<SynthetixJS | null>(null);
  const [data, setData] = useState<SynthetixData | null>(null);

  useEffect(() => {
    const networkId = NETWORK_ID;
    const js = initSynthetixJS({
      networkId,
      provider: INFURA_PROVIDER,
    });
    const data = initSynthetixData({ networkId });

    setJS(js);
    setData(data);
  }, []);

  return (
    <SynthetixContext.Provider value={{ js, data }}>
      {children}
    </SynthetixContext.Provider>
  );
};

export function useSynthetix() {
  const context = useContext(SynthetixContext);
  if (!context) {
    throw new Error('Missing Synthetix context');
  }
  const { js, data } = context;
  return { js, data };
}
