import { FC, useState } from 'react';
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
  const [localAddress, setLocalAddress] = useState<string | null>(null);

  return (
    <Paper component='form' className={classes.root}>
      <InputBase
        className={classes.input}
        placeholder='Enter wallet address...'
        inputProps={{ 'aria-label': 'search' }}
        onChange={(e) => {
          setLocalAddress(e.target.value as string);
        }}
      />
      <IconButton
        type='button'
        className={classes.iconButton}
        aria-label='search'
        onClick={() => {
          if (localAddress) setAddress(localAddress);
        }}
      >
        <SearchIcon />
      </IconButton>
    </Paper>
  );
};

export default WalletSearchInput;
