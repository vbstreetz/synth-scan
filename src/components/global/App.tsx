import { FC } from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';

import { UIProvider } from 'contexts/ui';
import { SynthetixProvider } from 'contexts/synthetix';
import { AddressProvider } from 'contexts/address';

import Layout from 'components/global/Layout';

import theme from 'utils/theme';

const App: FC = () => {
  return (
    <ThemeProvider {...{ theme }}>
      <CssBaseline />
      <UIProvider>
        <SynthetixProvider>
          <AddressProvider>
            <Layout />
          </AddressProvider>
        </SynthetixProvider>
      </UIProvider>
    </ThemeProvider>
  );
};

export default App;
