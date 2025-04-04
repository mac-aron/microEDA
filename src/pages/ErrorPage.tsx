import { Grid2 as Grid, Typography } from "@mui/material";

function ErrorPage() {
  return (
    <Grid padding={2} margin={2} border={1}>
      <Typography variant="h3">Error</Typography>
      <Typography variant="body1">Unexpeccted error has occured!</Typography>
    </Grid>
  );
}

export default ErrorPage;
