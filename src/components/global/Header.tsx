import { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { Link, withRouter } from 'react-router-dom';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  container: {
    boxShadow: 'none',
    background: '#DCDCDC',

    '& a': {
      textTransform: 'uppercase',
      marginLeft: 54,
      color: 'rgba(0, 0, 0, 0.5)',
    },
  },
  title: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
  },
  network: {
    background: '#C4C4C4',
    '&, &:hover': {
      boxShadow: 'none',
    },
  },
  activeLink: {
    color: 'black !important',
  },
}));

const LINKS = [
  { name: 'wallet overview', to: '/' },
  { name: 'network overview', to: '/network-overview' },
  { name: 'transactions overview', to: '/transactions-list' },
];

const Header: FC = () => {
  const classes = useStyles();
  const path = window.location.pathname;

  return (
    <AppBar position='fixed' color='inherit' className={classes.container}>
      <Toolbar color='inherit'>
        <Typography variant='h6' className={'flex flex-grow'}>
          <div className={'flex items-center'}>SYNTH SCAN</div>
          <Box ml={2}>
            <Button variant='contained' className={classes.network}>
              MAINNET
            </Button>
          </Box>
        </Typography>

        {LINKS.map((link) => (
          <Link
            to={link.to}
            key={link.to}
            className={clsx({
              [classes.activeLink]: link.to !== '/' && ~path.search(link.to),
            })}
          >
            {link.name}
          </Link>
        ))}
      </Toolbar>
    </AppBar>
  );
};

export default withRouter(Header);
