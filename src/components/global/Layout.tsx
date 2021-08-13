import { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Header from './Header';

import WalletOverview from 'pages/WalletOverview';
import NetworkOverview from 'pages/NetworkOverview';
import TransactionsList from 'pages/TransactionsList';

import TxModal from 'modals/TxModal';

const useStyles = makeStyles((theme) => ({
  container: {
    width: '960px',
    margin: '0 auto',
    padding: '100px 0 30px',
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
      padding: '70px 0 10px',
      width: 'auto',
    },
    '& a': {
      textDecoration: 'none',
    },
    '& a, a:visited': {
      color: theme.palette.secondary.main,
    },
    '& .MuiInputLabel-shrink': {
      right: 0,
      transform: 'translate(0, 1.5px) scale(1)',
      transformOrigin: 'top left',
      fontSize: 12,
    },
    '& td, th': {
      borderColor: 'transparent',
    },
  },
}));

const Layout: FC = () => {
  const classes = useStyles();

  return (
    <Router>
      <Box className={classes.container}>
        <Header />

        <Switch>
          <Route exact path={'/'} component={WalletOverview} />
          <Route path={'/network-overview'} component={NetworkOverview} />
          <Route path={'/transactions-list'} component={TransactionsList} />
        </Switch>

        <Switch>
          <Route exact path={'/tx/:hash'} component={TxModal} />
        </Switch>
      </Box>
    </Router>
  );
};

export default Layout;
