import { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';

import { useAddress } from 'contexts/address';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 400,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
}));
const WalletSearchInput: FC<{}> = () => {
  const classes = useStyles();
  const { setAddress } = useAddress();

  return (
    <Paper
      component='form'
      className={classes.root}
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.target as any;
        const localAddress = form.input.value as string;
        if (localAddress) setAddress(localAddress);
      }}
    >
      <InputBase
        name='input'
        className={classes.input}
        placeholder='Enter wallet address...'
        inputProps={{ 'aria-label': 'search' }}
      />
      <IconButton
        type='submit'
        className={classes.iconButton}
        aria-label='search'
      >
        <SearchIcon />
      </IconButton>
    </Paper>
  );
};

export default WalletSearchInput;
