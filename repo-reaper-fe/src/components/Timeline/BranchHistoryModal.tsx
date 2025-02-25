import React, { useState, useEffect } from "react";
import {
  Box,
  Grow,
  Paper,
  IconButton,
  Fade,
  Typography,
  List,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack"; // Import the back arrow icon
import { formatTimestamp } from "./FormatTimestamp";
import CustomizedTimeline from "./Timeline";

interface IBranchHistoryModal {
  isOpen: boolean;
  selectedTimeline: number | null;
  selectedNode: { id: string | null };
  onClose: () => void;
  timelineData:
    | {
        title: string;
        commitHistory: {
          id: string;
          time: string;
          commandHistory: {
            time: string;
            command: string;
          }[];
        }[];
      }
    | undefined;
  openDeleteModal: () => void;
  deleteModal: boolean;
}

export const BranchHistoryModal = ({
  isOpen,
  selectedTimeline,
  selectedNode,
  onClose,
  timelineData,
  openDeleteModal,
  deleteModal,
}: IBranchHistoryModal) => {
  // State to store the grouped command history
  const [groupedHistory, setGroupedHistory] = useState<{
    [key: string]: {
      id: string;
      time: string;
      commands: { time: string; command: string }[];
    };
  }>({});
  const [title, setTitle] = useState<string>("");
  const [expandedCommitId, setExpandedCommitId] = useState<string | null>(null); // Track expanded commit

  // Default: Group commands by commit ID
  useEffect(() => {
    if (isOpen && timelineData) {
      const grouped = timelineData.commitHistory.reduce((acc, commit) => {
        acc[commit.id] = {
          id: commit.id,
          time: commit.time,
          commands: commit.commandHistory,
        };
        return acc;
      }, {} as { [key: string]: { id: string; time: string; commands: { time: string; command: string }[] } });

      setGroupedHistory(grouped);
      setTitle(timelineData.title);
      setExpandedCommitId(null); // Reset expanded commit when modal opens
    }
  }, [isOpen]);

  // Handler for node clicks (from timeline or commit list)
  const nodeClickHandler = (nodeId: string) => {
    if (timelineData) {
      const selectedNodeData = timelineData.commitHistory.find(
        (node) => node.id === nodeId
      );

      if (selectedNodeData) {
        setGroupedHistory({
          [selectedNodeData.id]: {
            id: selectedNodeData.id,
            time: selectedNodeData.time,
            commands: selectedNodeData.commandHistory,
          },
        });
        setTitle(selectedNodeData.id);
        setExpandedCommitId(nodeId); // Expand the clicked commit
      }
    }
  };
  useEffect(() => {
    if (selectedNode.id != null) nodeClickHandler(selectedNode.id);
  }, [selectedNode]);

  // Handler for connector clicks (reset to all commands)
  const connectorClickHandler = () => {
    if (timelineData) {
      const grouped = timelineData.commitHistory.reduce((acc, commit) => {
        acc[commit.id] = {
          id: commit.id,
          time: commit.time,
          commands: commit.commandHistory,
        };
        return acc;
      }, {} as { [key: string]: { id: string; time: string; commands: { time: string; command: string }[] } });

      setGroupedHistory(grouped);
      setTitle(timelineData.title);
      setExpandedCommitId(null); // Reset expanded commit
    }
  };

  return (
    <Fade in={isOpen}>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          zIndex: 1000,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "8px",
        }}
        onClick={onClose}
      >
        <Paper
          elevation={3}
          sx={{
            width: "80%",
            maxWidth: "1200px",
            height: "80%",
            maxHeight: "800px",
            backgroundColor: "#36393f",
            position: "relative",
            display: "flex",
            flexDirection: "row",
            overflow: "hidden",
          }}
          onClick={(e) => e.stopPropagation()} // Prevent click from closing modal
        >
          {/* Close Button */}
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              zIndex: 1,
              top: 16,
              right: 16,
              color: "red",
              "&:hover": { backgroundColor: "rgba(255, 0, 0, 0.2)" },
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* Left Side: Modal Timeline */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#2f3136",
              overflow: "auto",
              p: 2,
            }}
          >
            {timelineData && (
              <CustomizedTimeline
                branchName={timelineData.title}
                selectedName={title}
                selectedNode={selectedNode}
                selectedTimeline={selectedTimeline}
                handleNodeClick={(nodeIndex: number) => {
                  const nodeId = timelineData.commitHistory[nodeIndex].id;
                  nodeClickHandler(nodeId);
                }}
                handleConnectorClick={connectorClickHandler}
                timelineData={timelineData.commitHistory}
                isModalTimeline={true}
                isEditState={false}
                isAddState={false}
                isDeleteState={false}
                openDeleteModal={openDeleteModal}
                deleteModal={deleteModal}
              />
            )}
          </Box>

          {/* Right Side: Commit History */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              overflow: "auto",
              p: 4,
              position: "relative", // Add relative positioning for the back button
              "&::-webkit-scrollbar": {
                width: "8px", // Width of the scrollbar
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "#2f3136", // Track color
                borderRadius: "4px", // Rounded corners for the track
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#7289da", // Thumb color (Discord-like purple)
                borderRadius: "4px", // Rounded corners for the thumb
                "&:hover": {
                  backgroundColor: "#5b6eae", // Thumb color on hover
                },
              },
            }}
          >
            {/* Back Button */}
            {title != timelineData?.title && (
              <IconButton
                onClick={connectorClickHandler}
                sx={{
                  position: "absolute",
                  top: 16,
                  left: 16,
                  color: "#7289da",
                  "&:hover": { backgroundColor: "rgba(114, 137, 218, 0.2)" },
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            )}

            {/* Centered Title */}
            <Box sx={{ width: "100%", textAlign: "center" }}>
              <Typography
                variant="h5"
                gutterBottom
                color="white"
                sx={{ fontWeight: "bold" }}
              >
                {title}
              </Typography>
            </Box>

            <List sx={{ width: "100%" }}>
              {Object.values(groupedHistory).map((commit) => (
                <Button
                  key={commit.id}
                  onClick={
                    commit.id != title
                      ? () => nodeClickHandler(commit.id)
                      : () => {}
                  }
                  sx={{
                    textTransform: "none", // Prevent uppercase transformation
                    color: "white",
                    display: "block",
                    textAlign: "left",
                    width: "100%",
                    pointerEvents: commit.id != title ? "auto" : "none",
                    p: 2,
                    mb: 2,
                    backgroundColor: "transparent",
                    "&:hover": {
                      backgroundColor:
                        commit.id != title ? "#4e5969" : "transparent", // Background color on hover
                    },
                  }}
                >
                  {/* Commit Title */}
                  {title == timelineData?.title && (
                    <Typography
                      variant="h6"
                      color="white"
                      sx={{ fontWeight: "bold", mb: 1 }}
                    >
                      {commit.id}
                    </Typography>
                  )}
                  {/* Commit Data */}
                  <Box
                    sx={{
                      pl: 3, // Indent the commit data
                      borderLeft: "2px solid #7289da", // Add a vertical line
                    }}
                  >
                    {(expandedCommitId === commit.id
                      ? commit.commands
                      : commit.commands.slice(0, 4)
                    ).map((command, index) => (
                      <Box
                        key={index}
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        {/* Bullet point */}
                        <Box
                          sx={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            backgroundColor: "#7289da",
                            mr: 2,
                          }}
                        />
                        <Typography variant="body1" color="white">
                          <strong>{formatTimestamp(command.time)}:</strong>{" "}
                          {command.command}
                        </Typography>
                      </Box>
                    ))}
                    {/* Show "..." if there are more than 4 commands and the commit is not expanded */}
                    {commit.commands.length > 4 &&
                      expandedCommitId !== commit.id && (
                        <Typography variant="body1" color="white">
                          ...
                        </Typography>
                      )}
                  </Box>
                </Button>
              ))}
            </List>
          </Box>
        </Paper>
      </Box>
    </Fade>
  );
};
