import React, { useState } from "react";
import {
  Box,
  Typography,
  Tooltip,
  Checkbox,
  FormControlLabel,
  Slide,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // Icon for staged changes
import ErrorIcon from "@mui/icons-material/Error"; // Icon for unstaged changes
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { FileStructureItem } from "../GridContainer";

interface ListItemProps {
  id: string;
  name: string;
  type: "file" | "folder";
  level: number;
  path: string;
  isSelected: boolean;
  onClick: (id: string) => void;
  staged: boolean; // Boolean indicating if the file has staged changes
  unstaged: boolean; // Boolean indicating if the file has unstaged changes
  children?: string[]; // Optional children for folders
  fileStructure: any;
  filePath: any;
  selectedId: string;
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
  children,
  fileStructure,
  filePath,
  selectedId,
}) => {
  const [isExpanded, setIsExpanded] = useState(true); // State to manage expanded/collapsed state

  const handleCheckboxClick = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent the parent click handler from firing
  };

  const handleToggle = () => {
    setIsExpanded(!isExpanded); // Toggle expanded state
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        pl: level * 1.2 + (type == "folder" ? 0 : 2), // Add indentation based on the level
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          // gap: 1,
          bgcolor: isSelected ? "#333" : "transparent",
          p: 0.5,
          borderRadius: 1,
          "&:hover": {
            bgcolor: "#444",
          },
          cursor: "pointer",
        }}
        onClick={type === "folder" ? handleToggle : () => onClick(id)} // Only toggle for folders
      >
        {type === "folder" && (
          <>
            {isExpanded ? (
              <ExpandMoreIcon sx={{ color: "#bb86fc", fontSize: "1rem" }} />
            ) : (
              <ChevronRightIcon sx={{ color: "#bb86fc", fontSize: "1rem" }} />
            )}
          </>
        )}
        {type === "folder" ? (
          <FolderIcon sx={{ color: "#bb86fc", fontSize: "1rem" }} />
        ) : (
          <InsertDriveFileIcon sx={{ color: "#03dac6", fontSize: "1rem" }} />
        )}
        <Typography variant="body2" sx={{ color: "white" }}>
          {name}
        </Typography>
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
      </Box>

      {isExpanded &&
        children?.map((item) => (
          <LeftMenuListItem
            key={item}
            id={fileStructure.structure[item].path}
            name={item}
            type={fileStructure.structure[item].type}
            level={level + 1}
            staged={
              fileStructure.structure[item].type == "file"
                ? fileStructure.status[item].staged
                : false
            }
            unstaged={
              fileStructure.structure[item].type == "file"
                ? fileStructure.status[item].nonstaged
                : false
            }
            path={fileStructure.structure[item].path}
            isSelected={fileStructure.structure[item].path == selectedId}
            onClick={onClick}
            selectedId={selectedId}
            children={fileStructure.structure[item].children}
            fileStructure={fileStructure}
            filePath={filePath}
          />
        ))}
    </Box>
  );
};
