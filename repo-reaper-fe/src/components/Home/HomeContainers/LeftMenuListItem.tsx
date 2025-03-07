import React from "react";
import { Stack, Typography, Box } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

interface ListItemProps {
  id: string;
  name: string;
  type: string;
  level: number;
  path: string;
  isSelected: boolean;
  onClick: (id: string) => void;
}

export const LeftMenuListItem: React.FC<ListItemProps> = ({
  id,
  name,
  type,
  level,
  path,
  isSelected,
  onClick,
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
    </Stack>
  );
};
