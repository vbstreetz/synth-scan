import { FC, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import { SnxHolder } from '@synthetixio/data/build/generated/graphql';
import Wei, { wei } from '@synthetixio/wei';

import { BORDER_RADIUS } from 'config';
import { useSynthetix } from 'contexts/synthetix';
import { useUI } from 'contexts/ui';
import { formatNumber } from 'utils/big-number';
import { abbrAddress } from 'utils/string';

const SPACING = 4;

type Holder = {
  wallet: string;
  totalSNX: Wei;
  lockedSNX: Wei;
  cratio: Wei;
  totalDebtSUSD: Wei;
  debtPercentage: Wei;
  synthBalanceSUSD: Wei;
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

const SnxHolders: FC = () => {
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

      const {
        Synthetix, // eslint-disable-line
        SystemSettings, // eslint-disable-line
        ExchangeRates, // eslint-disable-line
        SynthetixState, // eslint-disable-line
      } = js.contracts; // eslint-disable-line
      const { formatEther, formatBytes32String } = js.utils;

      const result = await Promise.all([
        ExchangeRates.rateForCurrency(formatBytes32String('SNX')),
        // Synthetix.totalSupply(),
        SynthetixState.lastDebtLedgerEntry(),
        Synthetix.totalIssuedSynthsExcludeEtherCollateral(
          formatBytes32String('sUSD')
        ),
        SystemSettings.issuanceRatio(),
        data.snxHolders({
          max: 99,
        }),
      ]);

      const [
        snxPrice,
        // snxTotalSupply,
        lastDebtLedgerEntry,
        totalIssuedSynths,
        issuanceRatio,
      ] = result
        .slice(0, result.length - 1)
        .map((item) => wei(formatEther(item)));

      const holders = result[result.length - 1];

      endProgress();

      if (isMounted && holders) {
        let totalDebtBalance = wei(0);

        const h = holders.map((holder: SnxHolder) => {
          const {
            collateral: unformattedCollateral,
            debtEntryAtIndex: unformattedDebtEntryAtIndex,
            initialDebtOwnership: unformattedInitialDebtOwnership,
          } = holder;
          const [collateral, debtEntryAtIndex, initialDebtOwnership] = [
            unformattedCollateral,
            unformattedDebtEntryAtIndex,
            unformattedInitialDebtOwnership,
          ].map((val) => (!val ? wei(0) : wei(val)));

          const debtBalance = debtEntryAtIndex.gt(0)
            ? totalIssuedSynths
                .mul(lastDebtLedgerEntry)
                .div(debtEntryAtIndex)
                .mul(initialDebtOwnership)
                .div(1e9)
            : wei(0);

          const cratio = debtEntryAtIndex.gt(0)
            ? debtBalance.div(collateral).div(snxPrice)
            : wei(0);

          const lockedSNX = collateral.mul(
            Wei.min(wei(1), cratio.div(issuanceRatio))
          );

          totalDebtBalance = totalDebtBalance.add(debtBalance);

          return {
            wallet: holder.id,
            totalSNX: collateral,
            lockedSNX,
            cratio,
            totalDebtSUSD: debtBalance,
            debtPercentage: wei(0),
            synthBalanceSUSD: wei(0),
          };
        });

        h.forEach((o: Holder) => {
          if (totalDebtBalance.gt(0)) {
            o.debtPercentage = o.totalDebtSUSD.div(totalDebtBalance);
          }
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
              <TableCell align='right'>TOTAL SNX</TableCell>
              <TableCell align='right'>LOCKED SNX</TableCell>
              <TableCell align='right'>C-RATIO</TableCell>
              <TableCell align='right'>TOTAL DEBT (sUSD)</TableCell>
              <TableCell align='right'>DEBT %</TableCell>
              <TableCell align='right'>SYNTH BALANCE (sUSD)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {holders.map((holder, i) => (
              <TableRow key={holder.wallet}>
                <TableCell component='th' scope='row'>
                  {i + 1}
                </TableCell>
                <TableCell>{abbrAddress(holder.wallet)}</TableCell>
                <TableCell align='right'>
                  {formatNumber(holder.totalSNX, 2)}
                </TableCell>
                <TableCell align='right'>
                  {formatNumber(holder.lockedSNX, 2)}
                </TableCell>
                <TableCell align='right'>
                  {formatNumber(
                    holder.cratio.lte(0)
                      ? wei(0)
                      : wei(1).div(holder.cratio).mul(100),
                    2
                  )}
                  %
                </TableCell>
                <TableCell align='right'>
                  {formatNumber(holder.totalDebtSUSD, 2)}
                </TableCell>
                <TableCell align='right'>
                  {formatNumber(holder.debtPercentage, 2)}%
                </TableCell>
                <TableCell align='right'>
                  {formatNumber(holder.synthBalanceSUSD, 2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Box>
  );
};

export default SnxHolders;
