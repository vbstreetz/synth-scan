import { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';

export const useStyles = makeStyles((theme) => ({
  container: {
    width: 600,
  },
}));

const TxModal: FC<{
  match: { params: { hash: string } };
  history: any;
}> = ({
  match: {
    params: { hash },
  },
  history,
}) => {
  const classes = useStyles();
  const close = () => history.push('/');

  return (
    <Dialog open={true} onClose={() => {}}>
      <Box className={classes.container}>
        <Box
          px={4}
          mt={2}
          className='flex flex-grow justify-space items-center'
        >
          <Typography variant='h5'>Tx #{hash}</Typography>

          <CloseIcon className='cursor-pointer' onClick={close} />
        </Box>
      </Box>
    </Dialog>
  );
};

export default TxModal;
