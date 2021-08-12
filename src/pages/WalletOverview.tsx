import { FC, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import BigNumber from 'bignumber.js';
import clsx from 'clsx';

import WalletSearchInput from 'components/shared/WalletSearchInput';
import { toBigNumber } from 'utils/big-number';
import { BORDER_RADIUS } from 'config';

const SPACING = 4;

type Balance = {
  currencyKey: string;
  amount: BigNumber;
};

const useStyles = makeStyles((theme) => {
  const spacing = theme.spacing(SPACING);
  return {
    container: {},
    a: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gridGap: spacing,
    },
    b: {
      display: 'grid',
      gridTemplateColumns: '1fr 2fr',
      gridGap: spacing,
    },
    c: {
      display: 'grid',
      gridTemplateRows: '1fr 1fr',
      gridGap: spacing,
    },
    statBox: {
      background: '#F5F5F5',
      borderRadius: BORDER_RADIUS,
      height: 128,
    },
    statBoxLabel: {
      fontSize: 14,
    },
    statBoxValue: {
      fontSize: 32,
    },
    synthBalanceTable: {
      background: '#F5F5F5',
    },
    synthBalanceTableHead: {
      background: '#e5e5e578',
      borderTop: '1px solid rgba(224, 224, 224, 1)',
    },
  };
});

const WalletOverview: FC<{}> = () => {
  const classes = useStyles();
  const [balances] = useState<Balance[]>([
    {
      currencyKey: 'x',
      amount: toBigNumber(300),
    },
  ]);

  return (
    <Box className={classes.container}>
      <Box mb={SPACING}>
        <WalletSearchInput />
      </Box>

      <Box className={classes.a} mb={SPACING}>
        <StatBox label='SNX BALANCE' value={toBigNumber(0)} />
        <StatBox label='LOCKED SNX' value={toBigNumber(300)} />
        <StatBox label='TRANSFERRABLE SNX' value={toBigNumber(1200)} />
      </Box>

      <Box className={classes.b}>
        <Box className={classes.c}>
          <StatBox label='WALLET DEBT (sUSD)' value={toBigNumber(0)} />
          <StatBox
            label='WALLET C-RATIO'
            value={toBigNumber(300)}
            valueDecimals={0}
            valueSuffix='%'
          />
        </Box>

        <Box className={classes.synthBalanceTable}>
          <Box mx={4} my={3}>
            SYNTH BALANCE
          </Box>
          <Table aria-label='SYNTH BALANCE' size={'small'}>
            <TableHead className={classes.synthBalanceTableHead}>
              <TableRow>
                <TableCell>TOKEN</TableCell>
                <TableCell>BALANCE</TableCell>
                <TableCell align='right'>VALUE (sUSD)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {balances.map((balance) => (
                <SynthBalanceTableRow
                  key={balance.currencyKey}
                  {...{ balance }}
                />
              ))}
            </TableBody>
          </Table>
        </Box>
      </Box>
    </Box>
  );
};

const StatBox: FC<{
  label: string;
  value: BigNumber;
  valueDecimals?: number;
  valueSuffix?: string;
}> = ({ label, value, valueDecimals = 2, valueSuffix = '' }) => {
  const classes = useStyles();
  return (
    <Box
      className={clsx(
        classes.statBox,
        'flex',
        'flex-col',
        'items-center',
        'justify-center'
      )}
    >
      <Box className={classes.statBoxLabel}>{label}</Box>
      <Box className={classes.statBoxValue}>
        {value.toFormat(valueDecimals)}
        {valueSuffix}
      </Box>
    </Box>
  );
};

const SynthBalanceTableRow: FC<{
  balance: Balance;
}> = ({ balance }) => {
  const value = toBigNumber(0);
  return (
    <TableRow>
      <TableCell component='th' scope='row'>
        {balance.currencyKey}
      </TableCell>
      <TableCell>{balance.amount.toFormat(2)}</TableCell>
      <TableCell align='right'>{value.toFormat(0)}</TableCell>
    </TableRow>
  );
};

export default WalletOverview;
