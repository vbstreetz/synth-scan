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

import { BORDER_RADIUS } from 'config';
import { useSynthetix } from 'contexts/synthetix';
import { useUI } from 'contexts/ui';
import { formatNumber } from 'utils/big-number';
import { abbrAddress } from 'utils/string';
import CopyToClipboard from 'components/shared/CopyToClipboard';
import useWalletSynthBalances from 'hooks/useWalletSynthBalances';

const SPACING = 4;

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
            totalSynthBalance: wei(0),
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
  // const classes = useStyles();

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
      <TableCell></TableCell>
    </TableRow>
  );
};

export default SynthHolders;
