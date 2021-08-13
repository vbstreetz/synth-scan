import { FC, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Wei, { wei } from '@synthetixio/wei';
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
  Issued = 'mint',
  Burned = 'burn',
  FeesClaimed = 'fees claim',
}

export type Transaction = {
  id: string;
  account: string;
  block: number;
  hash: string;
  value: Wei;
  timestamp: number;
  type: TransactionType;
  totalIssuedSUSD: Wei;
  rewards?: Wei;
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

      '& td, th': {
        borderColor: 'transparent',
      },
    },
    tableHead: {
      background: '#E6E6E6',
      borderTopLeftRadius: BORDER_RADIUS,
      borderTopRightRadius: BORDER_RADIUS,
    },
  };
});

const TransactionsList: FC<{}> = () => {
  const classes = useStyles();

  const { data } = useSynthetix();
  const { address } = useAddress();
  const { startProgress, endProgress } = useUI();

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

      const typeTransactions = result.map((txns, idx) =>
        txns.map((txn: UnformatedTransaction) => {
          const type = types[idx];
          return {
            account: address,
            block: txn.block,
            hash: txn.id.split('-')[0],
            id: txn.id,
            value: wei(txn.value),
            timestamp: txn.timestamp,
            type,
            totalIssuedSUSD: wei(0),
          };
        })
      );

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

      <Table
        aria-label='SYNTH BALANCE'
        size={'small'}
        className={classes.table}
      >
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
            <TableRow key={transaction.id}>
              <TableCell component='th' scope='row'>
                {moment(transaction.timestamp)
                  .local()
                  .format('YYYY/MM/DD | HH:mm[h]')}
              </TableCell>
              <TableCell>{transaction.type}</TableCell>
              <TableCell>{formatNumber(transaction.value, 2)}</TableCell>
              <TableCell>-</TableCell>
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
    </Box>
  );
};

export default TransactionsList;
