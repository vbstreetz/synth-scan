import { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import clsx from 'clsx';
import { Redirect, withRouter } from 'react-router';
import { Switch, Route, Link } from 'react-router-dom';

import SnxHolders from './SnxHolders';
import SynthHolders from './SynthHolders';

const SPACING = 4;

const TABS = [
  { name: 'ALL SNX HOLDERS', to: '/snx-holders', component: SnxHolders },
  { name: 'ALL SYNTH HOLDERS', to: '/synth-holders', component: SynthHolders },
];
const useStyles = makeStyles((theme) => {
  return {
    container: {},
    tabs: {},
    tab: {
      background: theme.palette.background.default,
      '&, &:hover': {
        boxShadow: 'none',
      },
      '&:first-child': {
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
      },
      '&:last-child': {
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
      },
    },
    activeTab: {
      background: 'white !important',
    },
  };
});

const NetworkOverview: FC<{}> = () => {
  const classes = useStyles();
  const path = window.location.pathname;

  return (
    <Box className={classes.container}>
      <Box mb={SPACING} className={clsx(classes.tabs, 'flex')}>
        {TABS.map((tab) => (
          <Link to={`/network-overview${tab.to}`} key={tab.to}>
            <Button
              variant='contained'
              className={clsx(classes.tab, {
                [classes.activeTab]: ~path.search(tab.to),
              })}
            >
              {tab.name}
            </Button>
          </Link>
        ))}
      </Box>

      <Switch>
        {TABS.map((tab) => (
          <Route
            path={`/network-overview${tab.to}`}
            component={tab.component}
            key={tab.to}
          />
        ))}
        <Redirect to='/network-overview/snx-holders' />
      </Switch>
    </Box>
  );
};

export default withRouter(NetworkOverview);
