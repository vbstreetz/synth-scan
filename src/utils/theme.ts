import { createMuiTheme } from '@material-ui/core/styles';
import { BORDER_RADIUS } from 'config';

export default createMuiTheme({
  typography: {
    fontFamily: ['Work Sans', 'Arial', 'sans-serif'].join(','),
  },
  palette: {
    background: {
      default: '#E5E5E5',
      paper: '#E5E5E5',
    },
    primary: {
      main: 'rgb(0, 0, 0)',
    },
    secondary: {
      main: 'rgba(0, 0, 0, 0.5)', // rgb(9, 9, 47)
    },
  },
  overrides: {
    MuiButton: {
      root: {
        borderRadius: BORDER_RADIUS,
      },
    },
    MuiPaper: {
      rounded: {
        borderRadius: BORDER_RADIUS,
      },
    },
    MuiDialog: {
      paper: {
        borderRadius: BORDER_RADIUS,
      },
    },
    // MuiInput: {
    //   underline: {
    //     '&:before': {
    //       borderBottomColor: '#313131',
    //     },
    //     '&:after': {
    //       borderBottomColor: '#313131',
    //     },
    //   },
    // },
  },
});
