import { Box, Grid2 as Grid } from "@mui/material";
import EditorCanvas from "../components/editor/EditorCanvas";

function Editor() {
  return (
    <Grid container flexGrow={1} spacing={2} sx={{ border: 1, padding: 1 }}>
      {/* Left Section */}
      <Grid size={3} sx={{ height: "100%", border: 1 }}>
        Sidebar
      </Grid>

      {/* Right Section */}
      <Grid size="grow" container direction="column" sx={{ height: "100%" }}>
        {/* Top Row */}
        <Grid sx={{ border: 1 }}>Editor menu</Grid>

        {/* Bottom Row - Takes remaining space */}
        <Grid sx={{ flexGrow: 1, border: 1 }}>
          <Box
            sx={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <EditorCanvas />
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Editor;
