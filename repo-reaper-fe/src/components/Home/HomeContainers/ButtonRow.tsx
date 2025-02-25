import { Box, Button, Stack } from "@mui/material";
import { Link } from "react-router-dom";

export const ButtonRow = () => {
  return (
    <Box sx={{ width: "100%", p: 1 }}>
      <Stack direction="row" gap={2} sx={{ width: "100%" }}>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/history"
          sx={{
            flex: 1,
            bgcolor: "#7289da", // Purple color
            "&:hover": {
              bgcolor: "#3700b3",
            },
          }}
        >
          Repo History
        </Button>
        <Button
          variant="contained"
          color="secondary"
          disabled
          sx={{
            flex: 1,
            bgcolor: "#b0bec5", // Disabled color
          }}
        >
          Misc. Function 2
        </Button>
        <Button
          variant="contained"
          color="success"
          disabled
          sx={{
            flex: 1,
            bgcolor: "#b0bec5", // Disabled color
          }}
        >
          Misc. Function 3
        </Button>
      </Stack>
    </Box>
  );
};
