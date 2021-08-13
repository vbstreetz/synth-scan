import { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

import { BORDER_RADIUS } from 'config';
import { formatNumber } from 'utils/big-number';
import useWalletSynthBalances from 'hooks/useWalletSynthBalances';
import CopyToClipboard from 'components/shared/CopyToClipboard';
import { abbrAddress } from 'utils/string';

export const useStyles = makeStyles((theme) => ({
  container: {
    width: 600,
    minHeight: 400,
  },
  synthBalanceTable: {
    borderRadius: BORDER_RADIUS,
    background: 'white',
  },
  synthBalanceTableHead: {
    background: '#E6E6E6',
    borderTop: '1px solid rgba(224, 224, 224, 1)',
  },
}));

const SynthHolderModal: FC<{
  match: { params: { wallet: string } };
  history: any;
}> = ({
  match: {
    params: { wallet },
  },
  history,
}) => {
  const classes = useStyles();
  const { balances } = useWalletSynthBalances(wallet);

  const close = () => history.push('/network-overview/synth-holders');

  return (
    <Dialog open={true} onClose={() => {}} data-testid='synth-holder-modal'>
      <Box className={classes.container}>
        <Box
          px={4}
          my={2}
          className='flex flex-grow justify-space items-center'
        >
          <Typography variant='h5' className='flex'>
            <Box mr={1}>Wallet</Box>
            <CopyToClipboard label={abbrAddress(wallet)} value={wallet} />
          </Typography>

          <CloseIcon
            className='cursor-pointer'
            onClick={close}
            data-testid='close-modal-button'
          />
        </Box>

        <Table aria-label='SYNTH BALANCE' size={'small'}>
          <TableHead className={classes.synthBalanceTableHead}>
            <TableRow>
              <TableCell>TOKEN</TableCell>
              <TableCell align='right'>BALANCE</TableCell>
              <TableCell align='right'>VALUE (sUSD)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {balances.map((balance) => (
              <TableRow
                key={balance.currencyKey}
                data-testid='synth-balance-row'
              >
                <TableCell component='th' scope='row'>
                  <Box className={'flex items-center'}>
                    <img
                      src={`https:///www.synthetix.io/assets/synths/svg/${balance.synthName}.svg`}
                      alt={balance.synthName}
                      width={20}
                      height={20}
                    />
                    <Box ml={1}>{balance.synthName}</Box>
                  </Box>
                </TableCell>
                <TableCell align='right'>
                  {formatNumber(balance.amount, 2)}
                </TableCell>
                <TableCell align='right'>
                  {formatNumber(balance.value, 4)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Dialog>
  );
};

export default SynthHolderModal;
