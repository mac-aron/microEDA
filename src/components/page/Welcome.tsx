import { useNavigate } from "react-router-dom";
import { Button, Grid2 as Grid, Typography } from "@mui/material";

function Welcome() {
  const navigate = useNavigate();

  const onButtonClick = () => {
    navigate("/editor");
  };

  return (
    <Grid container spacing={2} alignItems="center" padding={2} border={1}>
      {/* Text Section */}
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 6 }}
        onClick={onButtonClick}
      >
        Start
      </Button>
    </Grid>
  );
}

export default Welcome;
