import React from "react";
import { Stack, Typography, IconButton } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";

interface RepoHeaderProps {
  repoName: string;
}

const RepoHeader: React.FC<RepoHeaderProps> = ({ repoName }) => {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        width: "100%",
        padding: "8px 16px",
        bgcolor: "#212121",
        color: "white",
      }}
    >
      <Typography variant="h6">{repoName}</Typography>
      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
        Main Menu
      </Typography>
      <IconButton sx={{ color: "white" }}>
        <SettingsIcon />
      </IconButton>
    </Stack>
  );
};

export default RepoHeader;
