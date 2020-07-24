import { createMuiTheme } from '@material-ui/core/styles';
import amber from '@material-ui/core/colors/amber';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#98FF0B',
    },
    secondary: amber,
  },
});

export default theme;
