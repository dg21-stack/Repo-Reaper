import React, { useState } from "react";
import {
  Box,
  Typography,
  TableCell,
  TableRow,
  Menu,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineDot from "@mui/lab/TimelineDot";
import Brightness1OutlinedIcon from "@mui/icons-material/Brightness1Outlined";
import CheckIcon from "@mui/icons-material/Check";
import { formatTimestamp } from "../../Utils/FormatTimestamp";

interface ICustomizedTimeline {
  branchName: string;
  latestUpdatedTime: string;
  commitCount: number;
  timelineData: {
    id: string;
    time: string;
    commandHistory: { time: string; command: string }[];
  }[];
  handleConnectorClick: (event: React.MouseEvent) => void;
  openDeleteModal: () => void;
}

export default function ListViewTimeline({
  branchName,
  latestUpdatedTime,
  commitCount,
  timelineData,
  handleConnectorClick,
  openDeleteModal,
}: ICustomizedTimeline) {
  const [editedBranchName, setEditedBranchName] = useState(branchName);
  const [isEditing, setIsEditing] = useState(false);
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);
  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault(); // Prevent the default context menu
    setContextMenu(
      contextMenu === null
        ? { mouseX: event.clientX - 2, mouseY: event.clientY - 4 }
        : null
    );
  };

  const handleEditFromContextMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setContextMenu(null);
  };

  const handleDeleteFromContextMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    openDeleteModal(); // Open the delete modal
    setContextMenu(null);
  };

  const handleCloseContextMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setContextMenu(null);
  };

  const saveBranchName = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    setIsEditing(false);
    console.log("New branch name:", editedBranchName);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      saveBranchName(event);
    }
  };

  const handleBranchNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEditedBranchName(event.target.value.toLocaleUpperCase());
  };

  return (
    <TableRow
      sx={{ "&:hover": { backgroundColor: "#3a3d44" }, cursor: "pointer" }}
      onClick={handleConnectorClick}
      onContextMenu={handleContextMenu}
    >
      <Menu
        open={contextMenu !== null}
        onClose={handleCloseContextMenu}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem onClick={handleEditFromContextMenu}>Edit</MenuItem>
        <MenuItem onClick={handleDeleteFromContextMenu}>Delete</MenuItem>
      </Menu>

      {/* Branch Name */}
      <TableCell sx={{ padding: "12px", borderBottom: "1px solid #40444b" }}>
        {isEditing ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              margin: "0", // Center the container
            }}
          >
            <TextField
              value={editedBranchName}
              onChange={handleBranchNameChange}
              onKeyDown={handleKeyDown}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              variant="standard"
              InputProps={{
                disableUnderline: false,
                sx: {
                  fontSize: "1.25rem",
                  fontWeight: 400,
                  color: "white",
                  padding: 0,
                  margin: 0,
                  "& .MuiInputBase-input": {
                    padding: 0,
                    margin: 0,
                    textAlign: "left",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  },
                },
              }}
              autoFocus
            />
            <Button
              variant="contained"
              onClick={saveBranchName}
              sx={{
                backgroundColor: "#43b581",
                color: "white",
                "&:hover": { backgroundColor: "#368f6a" },
                height: "40px",
                marginBottom: "10px",
              }}
            >
              <CheckIcon />
            </Button>
          </Box>
        ) : (
          <Typography variant="h6" color="white" marginRight="145px">
            {editedBranchName}
          </Typography>
        )}
      </TableCell>

      {/* Latest Updated Time */}
      <TableCell sx={{ padding: "5px", borderBottom: "1px solid #40444b" }}>
        <Typography variant="h6" color="white">
          {formatTimestamp(latestUpdatedTime)}
        </Typography>
      </TableCell>

      {/* Number of Commits */}
      <TableCell sx={{ padding: "5px", borderBottom: "1px solid #40444b" }}>
        <Typography variant="h6" color="white">
          {commitCount}
        </Typography>
      </TableCell>

      {/* Interactive Timeline */}
      <TableCell sx={{ padding: "5px", borderBottom: "1px solid #40444b" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            width: "100%",
            overflow: "hidden",
          }}
        >
          <Timeline
            sx={{
              display: "flex",
              flexDirection: "row", // Make the timeline horizontal
              padding: 0,
              margin: 0,
            }}
          >
            {timelineData.slice(0, 4).map((item, index) => (
              <TimelineItem
                key={item.id}
                sx={{ minWidth: "50px", padding: 0, rotate: "-90deg" }}
              >
                <TimelineSeparator>
                  <TimelineDot sx={{ backgroundColor: "#7289da" }}>
                    <Brightness1OutlinedIcon
                      fontSize="small"
                      sx={{ color: "white" }}
                    />
                  </TimelineDot>
                  {index != timelineData.length - 1 && <TimelineConnector />}
                </TimelineSeparator>
              </TimelineItem>
            ))}

            <TimelineItem
              sx={{
                minWidth: "50px",
                padding: 0,
                display: "flex",
                justifyContent: "center",
                right: 40,
              }}
            >
              <Typography
                variant="h6"
                color={timelineData.length > 4 ? "white" : "transparent"}
                sx={{ marginLeft: "4px" }}
              >
                ...
              </Typography>
            </TimelineItem>
          </Timeline>
        </Box>
      </TableCell>
    </TableRow>
  );
}
