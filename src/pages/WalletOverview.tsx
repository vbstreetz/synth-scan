import { FC, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Wei, { wei } from '@synthetixio/wei';
import clsx from 'clsx';

import WalletSearchInput from 'components/shared/WalletSearchInput';
import { BORDER_RADIUS } from 'config';
import { useSynthetix } from 'contexts/synthetix';
import { useAddress } from 'contexts/address';
import { formatNumber } from 'utils/big-number';
import { useUI } from 'contexts/ui';

const SPACING = 4;

type Balance = {
  currencyKey: string;
  amount: Wei;
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

  const { js } = useSynthetix();
  const { address } = useAddress();
  const { startProgress, endProgress } = useUI();

  const [balanceSNX, setBalanceSNX] = useState<Wei>(wei(0));
  const [lockedSNX, setLockedSNX] = useState<Wei>(wei(0));
  const [transferrableSNX, setTransferrableSNX] = useState<Wei>(wei(0));
  const [debtSUSD, setDebtSUSD] = useState<Wei>(wei(0));
  const [cratio, setCRatio] = useState<Wei>(wei(0));
  const [balances, setBalances] = useState<Balance[]>([]);

  useEffect(() => {
    if (!(js && address)) return;

    let isMounted = true;
    const unsubs = [
      () => {
        isMounted = false;
      },
    ];

    const { Synthetix, SystemSettings } = js.contracts;
    const { formatEther, formatBytes32String } = js.utils;

    const load = async () => {
      startProgress();

      const result = await Promise.all([
        SystemSettings.issuanceRatio(),
        Synthetix.collateralisationRatio(address),
        Synthetix.transferableSynthetix(address),
        Synthetix.debtBalanceOf(address, formatBytes32String('sUSD')),
        Synthetix.collateral(address),
        Synthetix.balanceOf(address),
      ]);
      const [
        issuanceRatio,
        collateralRatio,
        transferrableSNX,
        debtSUSD,
        collateral,
        balanceSNX,
      ] = result.map((item) => wei(formatEther(item)));

      const lockedSNX = collateral.mul(
        Wei.min(wei(1), collateralRatio.div(issuanceRatio))
      );

      endProgress();

      if (isMounted) {
        setBalanceSNX(balanceSNX);
        setLockedSNX(lockedSNX);
        setTransferrableSNX(transferrableSNX);
        setDebtSUSD(debtSUSD);
        setCRatio(collateralRatio);
        setBalances([]);
      }
    };

    load();

    return () => {
      unsubs.forEach((unsub) => unsub());
    };
  }, [js, address, startProgress, endProgress]);

  return (
    <Box className={classes.container}>
      <Box mb={SPACING}>
        <WalletSearchInput />
      </Box>

      <Box className={classes.a} mb={SPACING}>
        <StatBox label='SNX BALANCE' value={balanceSNX} />
        <StatBox label='LOCKED SNX' value={lockedSNX} />
        <StatBox label='TRANSFERRABLE SNX' value={transferrableSNX} />
      </Box>

      <Box className={classes.b}>
        <Box className={classes.c}>
          <StatBox label='WALLET DEBT (sUSD)' value={debtSUSD} />
          <StatBox
            label='WALLET C-RATIO'
            value={wei(1).div(cratio).mul(100)}
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
  value: Wei;
  valueSuffix?: string;
}> = ({ label, value, valueSuffix = '' }) => {
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
        {formatNumber(value, 2)}
        {valueSuffix}
      </Box>
    </Box>
  );
};

const SynthBalanceTableRow: FC<{
  balance: Balance;
}> = ({ balance }) => {
  const value = wei(0);
  return (
    <TableRow>
      <TableCell component='th' scope='row'>
        {balance.currencyKey}
      </TableCell>
      <TableCell>{formatNumber(balance.amount, 2)}</TableCell>
      <TableCell align='right'>{formatNumber(value)}</TableCell>
    </TableRow>
  );
};

export default WalletOverview;
