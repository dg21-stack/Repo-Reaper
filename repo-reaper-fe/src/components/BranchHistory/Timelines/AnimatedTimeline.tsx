import React, { useState } from "react";
import {
  Box,
  Fade,
  Typography,
  Button,
  TextField,
  Menu,
  MenuItem,
} from "@mui/material";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TimelineDot from "@mui/lab/TimelineDot";
import Brightness1OutlinedIcon from "@mui/icons-material/Brightness1Outlined";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import CheckIcon from "@mui/icons-material/Check";
import { formatTimestamp } from "../../Utils/FormatTimestamp";

interface IAnimatedTimeline {
  branchName: string;
  selectedNode: { id: string | null };
  handleNodeClick: (nodeIndex: number, event: React.MouseEvent) => void;
  handleConnectorClick: (event: React.MouseEvent) => void;
  selectedTimeline: number | null;
  isModalTimeline: boolean;
  timelineData: {
    id: string;
    time: string;
    commandHistory: { time: string; command: string }[];
  }[];
  isEditState: boolean;
  isDeleteState: boolean;
  isAddState: boolean;
  selectedName?: string;
  openDeleteModal: () => void;
  deleteModal: boolean;
}

export const AnimatedTimeline = ({
  selectedNode,
  handleNodeClick,
  handleConnectorClick,
  selectedTimeline,
  branchName,
  isModalTimeline,
  timelineData,
  isEditState,
  isDeleteState,
  isAddState,
  selectedName,
  openDeleteModal,
  deleteModal,
}: IAnimatedTimeline) => {
  const [state, setState] = useState(false);
  const [editedBranchName, setEditedBranchName] = useState(branchName);
  const [contextEditState, setContextEditState] = useState(false);

  // Context menu state
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const handleClick = () => {
    setState(true);
  };

  const handleBranchNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEditedBranchName(event.target.value.toLocaleUpperCase());
  };

  const saveBranchName = () => {
    setState(false);
    setContextEditState(false);
    console.log("New branch name:", editedBranchName);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      saveBranchName();
    }
  };

  const handleBlur = () => {
    saveBranchName();
  };

  // Handle right-click to open context menu
  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault(); // Prevent the default context menu
    setContextMenu(
      contextMenu === null
        ? { mouseX: event.clientX - 2, mouseY: event.clientY - 4 }
        : null
    );
  };

  // Close the context menu
  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const onEdit = () => {
    setContextEditState(true);
  };

  // Handle edit action from context menu
  const handleEditFromContextMenu = () => {
    onEdit(); // Trigger the edit action
    handleCloseContextMenu();
  };

  // Handle delete action from context menu
  const handleDeleteFromContextMenu = () => {
    handleCloseContextMenu();
    openDeleteModal();
  };
  const shouldFadeIn =
    (isModalTimeline ||
      (selectedNode.id === null && selectedTimeline === null)) &&
    !deleteModal;

  return (
    <>
      <Fade
        in={shouldFadeIn}
        timeout={300}
        onClick={(e) => e.stopPropagation()}
      >
        <Box
          className="timeline-container timeline-normal"
          onContextMenu={handleContextMenu}
        >
          {/* Context Menu */}
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

          {/* Branch Name Container */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mb: 0,
              position: "relative",
              height: "64px", // Fixed height to prevent layout shifts
              width: "100%", // Ensure the container takes full width
            }}
          >
            {(isEditState && state) || contextEditState ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  width: "100%",
                  maxWidth: "425px", // Match the width of the timeline
                  margin: "0 auto", // Center the container
                }}
              >
                <TextField
                  value={editedBranchName.toLocaleUpperCase()}
                  onChange={handleBranchNameChange}
                  onKeyDown={handleKeyDown}
                  onBlur={handleBlur}
                  variant="standard"
                  InputProps={{
                    disableUnderline: true, // Remove the underline
                    sx: {
                      fontSize: "2.125rem", // Match Typography h4 size
                      fontWeight: 400, // Match Typography h4 weight
                      color: "white", // Match Typography h4 color
                      textAlign: "center", // Center the text
                      width: "100%", // Take full width of the container
                      overflow: "hidden", // Hide overflow
                      textOverflow: "ellipsis", // Add ellipsis for overflow
                      whiteSpace: "nowrap", // Prevent text from wrapping
                      "& .MuiInputBase-input": {
                        textAlign: "center", // Center the input text
                        overflow: "hidden", // Hide overflow
                        textOverflow: "ellipsis", // Add ellipsis for overflow
                        whiteSpace: "nowrap", // Prevent text from wrapping
                      },
                    },
                  }}
                  autoFocus // Automatically focus the TextField when it appears
                />
                <Button
                  variant="contained"
                  onClick={saveBranchName}
                  sx={{
                    backgroundColor: "#43b581",
                    color: "white",
                    "&:hover": { backgroundColor: "#368f6a" },
                    height: "45px",
                  }}
                >
                  <CheckIcon />
                </Button>
              </Box>
            ) : isEditState ? (
              <Typography
                variant="h4"
                color="white"
                sx={{ height: "100%", display: "flex", alignItems: "center" }}
              >
                {editedBranchName.toLocaleUpperCase()}
              </Typography>
            ) : (
              <Button
                onClick={handleConnectorClick}
                sx={{
                  color: "white",
                  "&:hover": { backgroundColor: "#4e5969" },
                }}
              >
                <Typography variant="h4" color="white">
                  {editedBranchName}
                </Typography>
              </Button>
            )}
            {isEditState && !state && (
              <EditIcon
                sx={{
                  color: "#faa61a",
                  "&:hover": { color: "#fff" },
                  position: "absolute",
                  top: -10,
                  right: -10,
                  cursor: "pointer",
                }}
                onClick={handleClick}
              />
            )}
            {isDeleteState && !state && (
              <DeleteIcon
                sx={{
                  color: "#ff4d4d",
                  "&:hover": { color: "#fff" },
                  position: "absolute",
                  top: -10,
                  right: -10,
                  cursor: "pointer",
                }}
                onClick={openDeleteModal}
              />
            )}
            {isAddState && !state && (
              <AddIcon
                sx={{
                  color: "#43b581",
                  "&:hover": { color: "#fff" },
                  position: "absolute",
                  top: -10,
                  right: -10,
                  cursor: "pointer",
                }}
                onClick={handleClick}
              />
            )}
          </Box>

          {/* Timeline */}
          <Timeline
            sx={{
              backgroundColor: "#36393f",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              width: "425px", // Fixed width to match the container
              margin: "0 auto", // Center the timeline
            }}
          >
            {(isModalTimeline ? timelineData : timelineData.slice(0, 3)).map(
              (item, index) => (
                <TimelineItem key={item.id}>
                  <TimelineOppositeContent
                    sx={{ m: "auto 0", color: "#b9bbbe" }}
                    align="right"
                    variant="body2"
                    color="text.secondary"
                  >
                    <Typography variant="body2" color="#b9bbbe">
                      {formatTimestamp(item.time)}
                    </Typography>
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <IconButton onClick={(e) => handleNodeClick(index, e)}>
                      <TimelineDot
                        sx={{
                          backgroundColor:
                            selectedName == item.id ? "#3700b3" : "#7289da",
                          "&:hover": { bgcolor: "#3700b3" },
                        }}
                      >
                        <Brightness1OutlinedIcon />
                      </TimelineDot>
                    </IconButton>
                    <TimelineConnector
                      className="connector"
                      onClick={handleConnectorClick}
                      sx={{
                        height: "10px", // Adjust the height of the connector
                      }}
                    />
                  </TimelineSeparator>

                  <TimelineContent sx={{ py: "12px", px: 2, color: "white" }}>
                    <Typography variant="h6" component="span">
                      {item.id}
                    </Typography>
                  </TimelineContent>
                </TimelineItem>
              )
            )}
          </Timeline>

          {/* Ellipsis Button */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mb: 2,
            }}
          >
            {timelineData.length > 3 && !isModalTimeline && (
              <Button
                onClick={handleConnectorClick}
                sx={{
                  color: "white",
                  "&:hover": { backgroundColor: "#4e5969" },
                }}
              >
                <Typography variant="h6" color="#727272059">
                  ...
                </Typography>
              </Button>
            )}
          </Box>
        </Box>
      </Fade>
    </>
  );
};
