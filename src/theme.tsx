import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "hsla(185, 54%, 43%, 1)",
    },
    secondary: {
      main: "hsla(155, 54%, 43%, 1)",
      // Alternative: hsla(215, 54%, 43%, 1)
    },
  },
});

export { theme };
