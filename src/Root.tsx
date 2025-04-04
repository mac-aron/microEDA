import { Outlet } from "react-router-dom";
import { Box, Grid2 as Grid } from "@mui/material";

// Component imports
import Topbar from "./components/page/Topbar";
import Footer from "./components/page/Footer";

function Root() {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh" border={1}>
      <Topbar />
      <Grid container sx={{ flex: 1, border: 1, padding: 2}}>
        <Outlet />
      </Grid>
      <Footer />
    </Box>
  );
}

export default Root;
