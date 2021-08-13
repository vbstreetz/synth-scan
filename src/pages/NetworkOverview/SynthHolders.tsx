import { FC, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
// import { SnxHolder } from '@synthetixio/data/build/generated/graphql';
import { SnxHolder } from '@synthetixio/data/build/data/generated/graphql';
import { wei } from '@synthetixio/wei';
import clsx from 'clsx';

import { BORDER_RADIUS } from 'config';
import { useSynthetix } from 'contexts/synthetix';
import { useUI } from 'contexts/ui';
import { formatNumber } from 'utils/big-number';
import { abbrAddress } from 'utils/string';
import CopyToClipboard from 'components/shared/CopyToClipboard';
import useWalletSynthBalances from 'hooks/useWalletSynthBalances';

const SPACING = 4;

const BACKGROUNDS: Record<string, string> = {
  sUSD: '#10BA97',
  sBTC: '#F56070',
  sETH: '#6E97FF',
  sBNB: 'yellow',
  sUnknown: 'gray',
};

type Holder = {
  wallet: string;
};

const useStyles = makeStyles((theme) => {
  // const spacing = theme.spacing(SPACING);
  return {
    table: {
      borderRadius: BORDER_RADIUS,
      background: 'white',
      minHeight: 100,
    },
    tableHead: {
      background: '#E6E6E6',
      borderTopLeftRadius: BORDER_RADIUS,
      borderTopRightRadius: BORDER_RADIUS,

      '& th:first-child': {
        borderTopLeftRadius: BORDER_RADIUS,
      },

      '& th:last-child': {
        borderTopRightRadius: BORDER_RADIUS,
      },
    },
    synthBoxes: {
      height: 20,
      width: 400,
    },
    synthBox: {
      color: 'black',
    },
  };
});

const SynthHolders: FC = () => {
  const classes = useStyles();

  const { js, data } = useSynthetix();
  const { startProgress, endProgress, inProgress } = useUI();

  const [holders, setHolders] = useState<Holder[]>([]);

  useEffect(() => {
    if (!(js && data)) return;

    let isMounted = true;
    const unsubs = [
      () => {
        isMounted = false;
      },
    ];

    const load = async () => {
      startProgress();
      const holders = await data.snxHolders({
        max: 99,
      });
      endProgress();

      if (isMounted && holders) {
        const h = holders.map((holder: SnxHolder) => {
          return {
            wallet: holder.id,
          };
        });

        setHolders(h);
      }
    };

    load();

    return () => {
      unsubs.forEach((unsub) => unsub());
    };
  }, [js, data, startProgress, endProgress]);

  return (
    <Box className={classes.table}>
      {!holders.length && !inProgress ? (
        <Box p={SPACING}>No holders found</Box>
      ) : (
        <Table aria-label='SYNTH BALANCE' size={'small'}>
          <TableHead className={classes.tableHead}>
            <TableRow>
              <TableCell>RANK</TableCell>
              <TableCell>WALLET</TableCell>
              <TableCell align='right'>TOTAL SYNTH BALANCE (sUSD)</TableCell>
              <TableCell>BREAKDOWN BY SYNTH</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {holders.map((holder, i) => (
              <HolderRow key={i} {...{ holder }} rank={i + 1} />
            ))}
          </TableBody>
        </Table>
      )}
    </Box>
  );
};

const HolderRow: FC<{ holder: Holder; rank: number }> = ({ holder, rank }) => {
  const classes = useStyles();

  const { balances, totalValue } = useWalletSynthBalances(holder.wallet);

  return (
    <TableRow key={holder.wallet}>
      <TableCell component='th' scope='row'>
        {rank}
      </TableCell>
      <TableCell>
        <CopyToClipboard
          label={abbrAddress(holder.wallet)}
          value={holder.wallet}
        />
      </TableCell>
      <TableCell align='right'>
        {!totalValue ? '-' : formatNumber(totalValue, 2)}
      </TableCell>
      <TableCell>
        {totalValue?.gt(0) ? (
          <Box className={clsx(classes.synthBoxes, 'flex', 'flex-grow')}>
            {balances.map((balance) => (
              <Box
                key={balance.currencyKey}
                className={clsx(
                  classes.synthBox,
                  'flex',
                  'flex-grow',
                  'items-center',
                  'justify-center'
                )}
                style={{
                  width: `${balance.value
                    .div(totalValue)
                    .mul(100)
                    .toNumber()}%`,
                  background:
                    BACKGROUNDS[balance.synthName] ?? BACKGROUNDS.sUnknown,
                }}
              >
                {balance.synthName}
              </Box>
            ))}
          </Box>
        ) : (
          '-'
        )}
      </TableCell>
    </TableRow>
  );
};

export default SynthHolders;
