import { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles((theme) => ({
  container: {},
}));

const SnxHolders: FC = () => {
  const classes = useStyles();

  return <Box className={classes.container}></Box>;
};

export default SnxHolders;
