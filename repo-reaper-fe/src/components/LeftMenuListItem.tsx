import React from "react";
import { Stack, Typography, Box } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

interface ListItemProps {
  id: string; // Unique identifier
  name: string;
  type: string;
  level: number; // Determines indentation
  path: string; // Full path of the file/folder
  isSelected: boolean; // Whether the item is selected
  onClick: (id: string) => void; // Callback function when the item is clicked
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
        pl: level * 2,
        cursor: "pointer",
        backgroundColor: isSelected ? "#e0e0e0" : "transparent", // Grey out if selected
        "&:hover": {
          backgroundColor: "#f5f5f5", // Light grey on hover
        },
      }}
      onClick={() => onClick(id)} // Trigger onClick callback with the id
    >
      {/* Icon based on type */}
      <Box>
        {type === "folder" ? (
          <FolderIcon color="primary" />
        ) : (
          <InsertDriveFileIcon color="action" />
        )}
      </Box>

      {/* File/Folder Name */}
      <Typography variant="body1">{name}</Typography>
    </Stack>
  );
};