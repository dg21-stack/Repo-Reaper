import React from "react";
import { Grid, Typography, IconButton } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";

interface RepoHeaderProps {
  repoName: string;
}

const RepoHeader: React.FC<RepoHeaderProps> = ({ repoName }) => {
  return (
    <Grid
      container
      alignItems="center"
      justifyContent="space-between"
      sx={{ p: 1, width: "100%" }}
    >
      {/* Left Side - Repo Name */}
      <Grid item>
        <Typography variant="h6">{repoName}</Typography>
      </Grid>

      {/* Middle - Main Menu */}
      <Grid item>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Main Menu
        </Typography>
      </Grid>

      {/* Right Side - Settings Icon */}
      <Grid item>
        <IconButton>
          <SettingsIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
};

export default RepoHeader;