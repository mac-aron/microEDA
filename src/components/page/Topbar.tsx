import { Fragment } from "react";
import { AppBar, Toolbar, Typography, Link } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";

function Topbar() {
  return (
    <Fragment>
      <AppBar>
        <Toolbar>
          <Link href="/" color="inherit" underline="none">
            <Typography variant="h5">MicroEDA</Typography>
          </Link>

          <div style={{ marginLeft: "auto" }}>
            <Link href="https://github.com" color="inherit" underline="none">
              <GitHubIcon />
            </Link>
          </div>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </Fragment>
  );
}

export default Topbar;
