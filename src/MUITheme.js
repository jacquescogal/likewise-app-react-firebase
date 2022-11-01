import { createTheme } from '@mui/material/styles';


  let theme = createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 768,
        lg: 1200,
        xl: 1536,
      },
    },
    palette: {
      type: 'light',
      primary: {
        main: '#FBBA51',
        contrastText: 'rgba(255,255,255,0.87)',
        dark: '#f57f17',
      },
      secondary: {
        main: '#e57373',
        contrastText: 'rgba(255,255,255,0.87)',
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiTab: {
        defaultProps: {
          disableRipple: true,
        },
      },
    },
    mixins: {
      toolbar: {
        minHeight: 48,
      },
    },
  });

  theme = {
    ...theme,
    components: {
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: '#FBBA51',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
          },
          contained: {
            boxShadow: 'none',
            '&:active': {
              boxShadow: 'none',
            },
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          root: {
            marginLeft: theme.spacing(1),
          },
          indicator: {
            height: 3,
            borderTopLeftRadius: 3,
            borderTopRightRadius: 3,
            backgroundColor: theme.palette.common.white,
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            margin: '0 16px',
            minWidth: 0,
            padding: 0,
            [theme.breakpoints.up('md')]: {
              padding: 0,
              minWidth: 0,
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            padding: theme.spacing(1),
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            borderRadius: 4,
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            backgroundColor: '#fff',
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            '&.Mui-selected': {
              color: '#fff',
            },
          },
        },
      },
      MuiListItemIcon: {
        styleOverrides: {
          root: {
            color: 'inherit',
            minWidth: 'auto',
            marginRight: theme.spacing(2),
            '& svg': {
              fontSize: 20,
            },
          },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          root: {
            width: 32,
            height: 32,
          },
        },
      },
    },
  };
  

export default theme;

