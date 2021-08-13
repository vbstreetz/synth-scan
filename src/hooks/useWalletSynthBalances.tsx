import { useState, useEffect } from 'react';
import Wei, { wei } from '@synthetixio/wei';
import orderBy from 'lodash/orderBy';

import { useSynthetix } from 'contexts/synthetix';

type Balance = {
  currencyKey: string;
  synthName: string;
  amount: Wei;
  value: Wei;
};

const useWalletSynthBalances = (address: string | null) => {
  const { js } = useSynthetix();
  const [balances, setBalances] = useState<Balance[]>([]);
  const [totalValue, setTotalValue] = useState<Wei | null>(null);

  useEffect(() => {
    if (!(js && address)) return;

    let isMounted = true;
    const unsubs = [
      () => {
        isMounted = false;
      },
    ];

    const load = async () => {
      const { SynthUtil } = js.contracts;

      const [
        currencyKeys, // eslint-disable-line
        synthsBalances,
        synthsUSDBalances,
      ] = await SynthUtil.synthsBalances(address);

      if (isMounted) {
        const { formatEther, parseBytes32String } = js.utils;

        let totalValue = wei(0);
        const balances: Balance[] = currencyKeys
          .map((currencyKey: string, idx: number) => {
            const synthName = parseBytes32String(currencyKey);
            const amount = wei(formatEther(synthsBalances[idx]));
            const value = wei(js.utils.formatEther(synthsUSDBalances[idx]));
            totalValue = totalValue.add(value);

            return {
              currencyKey,
              synthName,
              amount,
              value,
            };
          })
          .filter((b: Balance) => b.amount.gt(0));

        setBalances(orderBy(balances, (b: Balance) => b.amount.toNumber()));
        setTotalValue(totalValue);
      }
    };

    load();

    return () => {
      unsubs.forEach((unsub) => unsub());
    };
  }, [js, address]);

  return {
    balances,
    totalValue,
  };
};

export default useWalletSynthBalances;
