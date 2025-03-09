import React from "react";
import { Stack, Typography, Box, Tooltip } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // Icon for staged changes
import ErrorIcon from "@mui/icons-material/Error"; // Icon for unstaged changes

interface ListItemProps {
  id: string;
  name: string;
  type: string;
  level: number;
  path: string;
  isSelected: boolean;
  onClick: (id: string) => void;
  staged: boolean; // Boolean indicating if the file has staged changes
  unstaged: boolean; // Boolean indicating if the file has unstaged changes
}

export const LeftMenuListItem: React.FC<ListItemProps> = ({
  id,
  name,
  type,
  level,
  path,
  isSelected,
  onClick,
  staged,
  unstaged,
}) => {
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      sx={{
        pl: (level + 1) * 2,
        cursor: "pointer",
        bgcolor: isSelected ? "#333" : "transparent", // Dark background if selected
        "&:hover": {
          bgcolor: "#444", // Slightly lighter dark background on hover
        },
      }}
      onClick={() => onClick(id)}
    >
      <Box>
        {type === "folder" ? (
          <FolderIcon sx={{ color: "#bb86fc" }} />
        ) : (
          <InsertDriveFileIcon sx={{ color: "#03dac6" }} />
        )}
      </Box>
      <Typography variant="body1" sx={{ color: "white" }}>
        {name}
      </Typography>

      {/* Staged and Unstaged Icons */}
      {type === "file" && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {staged && (
            <Tooltip title="Contains staged changes">
              <CheckCircleIcon sx={{ color: "#4caf50", fontSize: "1rem" }} />
            </Tooltip>
          )}
          {unstaged && (
            <Tooltip title="Contains unstaged changes">
              <ErrorIcon sx={{ color: "#ffeb3b", fontSize: "1rem" }} />
            </Tooltip>
          )}
        </Box>
      )}
    </Stack>
  );
};
