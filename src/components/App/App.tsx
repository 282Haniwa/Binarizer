import React from 'react';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography } from '@material-ui/core';
import theme from 'src/utils/commons/theme';

type Props = {
  children?: React.ReactNode;
};

const App: React.FC<Props> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css"
        />
      </Head>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Binarizer</Typography>
        </Toolbar>
      </AppBar>
      {children}
    </ThemeProvider>
  );
};

export default App;
