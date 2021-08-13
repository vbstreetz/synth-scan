import { FC, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Wei from '@synthetixio/wei';
import orderBy from 'lodash/orderBy';
import flatten from 'lodash/flatten';
import moment from 'moment';

import WalletSearchInput from 'components/shared/WalletSearchInput';
import { BORDER_RADIUS } from 'config';
import { useSynthetix } from 'contexts/synthetix';
import { useAddress } from 'contexts/address';
import { formatNumber } from 'utils/big-number';
import { useUI } from 'contexts/ui';

const SPACING = 4;

export enum TransactionType {
  Issued = 'Mint',
  Burned = 'Burn',
  FeesClaimed = 'Claim',
  Trade = 'Trade',
}

export type Transaction = {
  id: string;
  hash: string;
  value: string;
  timestamp: number;
  type: TransactionType;
  detail?: string;
};

export type UnformatedTransaction = {
  id: string;
  account: string;
  block: number;
  hash: string;
  value: Wei;
  timestamp: number;
  totalIssuedSUSD: any;
  rewards?: any;
};

const useStyles = makeStyles((theme) => {
  // const spacing = theme.spacing(SPACING);
  return {
    container: {},
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

const TransactionsList: FC<{}> = () => {
  const classes = useStyles();

  const { data } = useSynthetix();
  const { address } = useAddress();
  const { startProgress, endProgress, inProgress } = useUI();

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (!(data && address)) return;

    let isMounted = true;
    const unsubs = [
      () => {
        isMounted = false;
      },
    ];

    const load = async () => {
      startProgress();
      const types = [
        TransactionType.Issued,
        TransactionType.Burned,
        TransactionType.FeesClaimed,
      ];
      const funcs: (({ account }: { account: string }) => any)[] = [
        data.issued,
        data.burned,
        data.feesClaimed,
      ];
      const result = await Promise.all(
        funcs.map((f) => f({ account: address }))
      );
      const trades = await data.synthExchanges({
        fromAddress: address,
      });

      const typeTransactions = result.map((txns, idx) =>
        txns.map((txn: UnformatedTransaction) => {
          const type = types[idx];
          // let detail;
          // switch (type) {
          //   case TransactionType.Issued:
          //     detail = `Locked ${} SNX`;
          //     break;
          //   case TransactionType.Burned:
          //     detail = `Unlocked ${} SNX`;
          //   break;
          //   case TransactionType.FeesClaimed:
          //     detail = `Add ${} SNX`;
          //     break;
          // }
          return {
            hash: txn.id.split('-')[0],
            id: txn.id,
            value: `${formatNumber(txn.value)} sUSD`,
            timestamp: txn.timestamp,
            type,
            // detail
          };
        })
      );

      if (trades) {
        typeTransactions.push(
          trades.map((txn) => {
            return {
              hash: txn.id.split('-')[0],
              id: txn.id.toString(),
              value: `${formatNumber(txn.fromAmount, 2)} ${
                txn.fromCurrencyKey
              }`,
              timestamp: txn.timestamp,
              type: TransactionType.Trade,
              detail: `Bought ${formatNumber(txn.toAmount, 2)} ${
                txn.toCurrencyKey
              }`,
            };
          })
        );
      }

      const transactions = orderBy(
        flatten(typeTransactions),
        ['timestamp'],
        ['desc']
      );

      endProgress();

      if (isMounted) {
        setTransactions(transactions);
      }
    };

    load();

    return () => {
      unsubs.forEach((unsub) => unsub());
    };
  }, [data, address, startProgress, endProgress]);

  return (
    <Box className={classes.container}>
      <Box mb={SPACING}>
        <WalletSearchInput />
      </Box>

      <Box className={classes.table}>
        {!address ? (
          <Box p={SPACING}>Search transactions</Box>
        ) : !transactions.length && !inProgress ? (
          <Box p={SPACING}>No transactions found</Box>
        ) : (
          <Table aria-label='SYNTH BALANCE' size={'small'}>
            <TableHead className={classes.tableHead}>
              <TableRow>
                <TableCell>TIMESTAMP</TableCell>
                <TableCell>TRANSACTION TYPE</TableCell>
                <TableCell>AMOUNT</TableCell>
                <TableCell>DETAILS</TableCell>
                <TableCell align='right'>VIEW TX</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id} data-testid='transaction-row'>
                  <TableCell component='th' scope='row'>
                    {moment(transaction.timestamp)
                      .local()
                      .format('YYYY/MM/DD | HH:mm[h]')}
                  </TableCell>
                  <TableCell>{transaction.type}</TableCell>
                  <TableCell>{transaction.value}</TableCell>
                  <TableCell>{transaction.detail ?? '-'}</TableCell>
                  <TableCell align='right'>
                    <a
                      href={`https://etherscan.io/tx/${transaction.hash}`}
                      target='_blank'
                      rel='noreferrer'
                    >
                      LINK
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Box>
    </Box>
  );
};

export default TransactionsList;
