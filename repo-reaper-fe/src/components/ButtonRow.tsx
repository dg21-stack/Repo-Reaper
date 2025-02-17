import React from "react";
import { Stack, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

export const ButtonRow = () => {
  return (
    <Box sx={{ width: "99%", p: 1 }}>
      <Stack direction="row" gap={2} sx={{ width: "100%" }}>
        {/* Button 1: Enabled */}
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/history"
          sx={{ flex: 1 }}
        >
          Repo History
        </Button>

        {/* Button 2: Disabled */}
        <Button
          variant="contained"
          color="secondary"
          disabled
          sx={{ flex: 1 }}
        >
          Misc. Function 2
        </Button>

        {/* Button 3: Disabled */}
        <Button
          variant="contained"
          color="success"
          disabled
          sx={{ flex: 1 }}
        >
          Misc. Function 3
        </Button>
      </Stack>
    </Box>
  );
};