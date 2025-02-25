import * as React from "react";
import {
  Box,
  Stack,
  Button,
  MobileStepper,
  useTheme,
  Fade,
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction,
  Menu,
  MenuItem,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  ButtonGroup,
  Paper,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomizedTimeline from "./Timeline/Timeline";
import { BranchHistoryModal } from "./Timeline/BranchHistoryModal";
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  Sort,
} from "@mui/icons-material";
import branchData from "../test-data/branchHistory.json"; // Import the updated JSON file
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import ListViewTimeline from "./Timeline/ListViewTimeline";
import { DeleteBranchModal } from "./Timeline/DeleteBranchModal";

export function BranchHistory() {
  const navigate = useNavigate();
  const theme = useTheme();

  const [selectedTimeline, setSelectedTimeline] = useState<number | null>(null);
  const [selectedNode, setSelectedNode] = useState<{ id: string | null }>({
    id: null,
  });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [branches, setBranches] = useState(branchData.branchHistory);
  const [deleteModal, setDeleteModal] = useState(false);

  const [deleteState, setDeleteState] = useState<boolean>(false);
  const [editState, setEditState] = useState<boolean>(false);
  const [addState, setAddState] = useState<boolean>(false);

  const [sortCriteria, setSortCriteria] = useState<
    "branchName" | "latestUpdatedTime" | "commitCount" | null
  >(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(
    null
  );
  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);

  const [viewMode, setViewMode] = useState<"timeline" | "list">("timeline"); // State to track view mode

  const visibleCount = 3; // Number of branches visible at once
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = Math.ceil(branches.length / visibleCount);

  const openDeleteModal = () => {
    setDeleteModal(true);
  };

  const handleNext = () => {
    setActiveStep((prev) => Math.min(prev + 1, maxSteps - 1));
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const visibleBranches = branches.slice(
    activeStep * visibleCount,
    (activeStep + 1) * visibleCount
  );

  const handleNodeClick = (
    branchIndex: number,
    commitIndex: number,
    event: React.MouseEvent
  ) => {
    setSelectedTimeline(branchIndex);
    setSelectedNode({
      id: branches[branchIndex].commitHistory[commitIndex].id,
    });
    setIsModalOpen(true);
  };

  const handleConnectorClick = (
    branchIndex: number,
    event: React.MouseEvent
  ) => {
    setSelectedTimeline((prev) => (prev === branchIndex ? null : branchIndex));
    setSelectedNode({ id: null });
    setIsModalOpen(true);
  };

  const handleClickOutside = () => {
    setIsModalOpen(false);
    setSelectedNode({ id: null });
    setSelectedTimeline(null);
  };

  const handleSpeedDialClick = (dial: string) => {
    switch (dial) {
      case "edit":
        setEditState(true);
        setDeleteState(false);
        setAddState(false);
        break;
      case "delete":
        setDeleteState(true);
        setEditState(false);
        setAddState(false);
        break;
      case "add":
        setAddState(true);
        setEditState(false);
        setDeleteState(false);
        break;
      default:
        setAddState(false);
        setEditState(false);
        setDeleteState(false);
        break;
    }
  };

  const handleCancel = () => {
    setEditState(false);
    setAddState(false);
    setDeleteState(false);
  };

  // Sort branches based on the selected criteria and direction
  const sortBranches = (
    criteria: "branchName" | "latestUpdatedTime" | "commitCount" | null,
    direction: "asc" | "desc" | null
  ) => {
    let sortedBranches = [...branches];

    if (criteria && direction) {
      sortedBranches.sort((a, b) => {
        if (criteria === "branchName") {
          return direction === "asc"
            ? a.title.localeCompare(b.title) // Ascending order
            : b.title.localeCompare(a.title); // Descending order
        } else if (criteria === "latestUpdatedTime") {
          const aTime = new Date(a.latestUpdatedTime).getTime();
          const bTime = new Date(b.latestUpdatedTime).getTime();
          return direction === "asc"
            ? aTime - bTime // Ascending order
            : bTime - aTime; // Descending order
        } else if (criteria === "commitCount") {
          return direction === "asc"
            ? a.commitHistory.length - b.commitHistory.length // Ascending order
            : b.commitHistory.length - a.commitHistory.length; // Descending order
        }
        return 0;
      });
    } else {
      sortedBranches = branchData.branchHistory;
    }

    setBranches(sortedBranches);
    setSortCriteria(criteria);
    setSortDirection(direction);
  };

  // Handle sort button click
  const handleSortClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setSortAnchorEl(event.currentTarget);
  };

  // Handle sort menu item click
  const handleSortMenuItemClick = (
    criteria: "branchName" | "latestUpdatedTime" | "commitCount"
  ) => {
    let newDirection: "asc" | "desc" | null = "asc"; // Default to ascending

    if (sortCriteria === criteria) {
      // Toggle direction if the same criteria is selected again
      newDirection =
        sortDirection === "asc"
          ? "desc"
          : sortDirection === "desc"
          ? null
          : "asc";
    }

    sortBranches(criteria, newDirection);
    setSortAnchorEl(null);
  };

  // Close the sort menu
  const handleSortMenuClose = () => {
    setSortAnchorEl(null);
  };

  // Toggle between timeline and list view
  const toggleViewMode = (mode: "timeline" | "list") => {
    setViewMode(mode);
  };

  const keyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
    if (e.key == "ArrowRight") {
      handleNext();
    }
    if (e.key == "ArrowLeft") {
      handleBack();
    }
  };

  return (
    <Fade in={true} onKeyDown={keyDown}>
      <Stack
        spacing={2}
        sx={{
          height: "100vh",
          p: 2,
          backgroundColor: "#2f3136",
          borderRadius: "8px",
          position: "relative",
        }}
        onClick={handleClickOutside}
      >
        {/* Back Button for Navigation */}
        <Box
          sx={{
            position: "absolute",
            top: 43,
            left: 16,
            zIndex: 1,
          }}
        >
          <Button
            variant="contained"
            onClick={() => navigate(-1)}
            sx={{
              backgroundColor: "#ff4444",
              color: "white",
              "&:hover": { backgroundColor: "#ae2b2b" },
              width: "100px",
              minWidth: "unset",
              padding: "6px 12px",
            }}
          >
            ← Back
          </Button>
        </Box>

        {/* Toggle View Button Group */}
        <Box
          sx={{
            position: "absolute",
            top: 26,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1,
          }}
        >
          <ButtonGroup variant="contained">
            <Button
              onClick={() => toggleViewMode("timeline")}
              sx={{
                backgroundColor:
                  viewMode === "timeline" ? "#7289da" : "#40444b",
                color: "white",
                "&:hover": {
                  backgroundColor:
                    viewMode === "timeline" ? "#677bc4" : "#4e5969",
                },
                width: "150px",
                minWidth: "unset",
                padding: "6px 12px",
              }}
            >
              Timeline View
            </Button>
            <Button
              onClick={() => toggleViewMode("list")}
              sx={{
                backgroundColor: viewMode === "list" ? "#7289da" : "#40444b",
                color: "white",
                "&:hover": {
                  backgroundColor: viewMode === "list" ? "#677bc4" : "#4e5969",
                },
                width: "150px",
                minWidth: "unset",
                padding: "6px 12px",
              }}
            >
              List View
            </Button>
          </ButtonGroup>
        </Box>

        {/* Cancel Button (Conditional Rendering) */}
        {(editState || addState || deleteState) && (
          <Box
            sx={{
              position: "absolute",
              top: 26,
              right: 16,
              zIndex: 1,
            }}
          >
            <Button
              variant="contained"
              onClick={handleCancel}
              sx={{
                backgroundColor: "#7289da",
                color: "white",
                "&:hover": { backgroundColor: "#4e5d94" },
                width: "100px",
                minWidth: "unset",
                padding: "6px 12px",
              }}
            >
              Cancel {editState ? "Edit" : deleteState ? "Delete" : "Add"}
            </Button>
          </Box>
        )}

        {/* Sort Button (Conditional Rendering) */}
        {!editState && !deleteState && !addState && (
          <Box
            sx={{
              position: "absolute",
              top: 26,
              right: 16,
              zIndex: 1,
            }}
          >
            <Button
              variant="contained"
              onClick={handleSortClick}
              sx={{
                backgroundColor: "#43b581",
                color: "white",
                "&:hover": { backgroundColor: "#368f6a" },
                width: "100px",
                minWidth: "unset",
                padding: "6px 12px",
              }}
            >
              <Sort sx={{ mr: 1 }} /> Sort
            </Button>
            <Menu
              anchorEl={sortAnchorEl}
              open={Boolean(sortAnchorEl)}
              onClose={handleSortMenuClose}
            >
              <MenuItem onClick={() => handleSortMenuItemClick("branchName")}>
                Sort by Branch Name{" "}
                {sortCriteria === "branchName" &&
                  (sortDirection === "asc"
                    ? "↑"
                    : sortDirection === "desc"
                    ? "↓"
                    : "")}
              </MenuItem>
              <MenuItem
                onClick={() => handleSortMenuItemClick("latestUpdatedTime")}
              >
                Sort by Latest Update{" "}
                {sortCriteria === "latestUpdatedTime" &&
                  (sortDirection === "asc"
                    ? "↑"
                    : sortDirection === "desc"
                    ? "↓"
                    : "")}
              </MenuItem>
              <MenuItem onClick={() => handleSortMenuItemClick("commitCount")}>
                Sort by # of Commits{" "}
                {sortCriteria === "commitCount" &&
                  (sortDirection === "asc"
                    ? "↑"
                    : sortDirection === "desc"
                    ? "↓"
                    : "")}
              </MenuItem>
            </Menu>
          </Box>
        )}

        {/* Timeline or List Container */}
        <Box
          sx={{
            overflow: "hidden",
            display: "flex",
            justifyContent: viewMode === "timeline" ? "center" : "center",
            alignItems: viewMode === "timeline" ? "center" : "center",
            flexGrow: 1,
            width: "100%",
            position: "relative",
            backgroundColor: "#36393f",
            borderRadius: "8px",
          }}
        >
          {viewMode === "timeline" ? (
            // Customized Timeline View
            <Box
              sx={{
                display: "flex",
                transition: "transform 0.5s ease-in-out",
                width: "100%",
              }}
            >
              {visibleBranches.map((branch: any, branchIndex: any) => (
                <Box
                  key={branch.id}
                  sx={{
                    width: `${100 / visibleCount}%`,
                    flexShrink: 0,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <CustomizedTimeline
                    branchName={branch.title}
                    selectedNode={selectedNode}
                    selectedTimeline={selectedTimeline}
                    handleNodeClick={(
                      commitIndex: number,
                      event: React.MouseEvent
                    ) =>
                      handleNodeClick(
                        branchIndex + activeStep * visibleCount,
                        commitIndex,
                        event
                      )
                    }
                    handleConnectorClick={(event: React.MouseEvent) =>
                      handleConnectorClick(
                        branchIndex + activeStep * visibleCount,
                        event
                      )
                    }
                    isModalTimeline={false}
                    deleteModal={deleteModal}
                    timelineData={branch.commitHistory} // Pass commit history as timeline data
                    isEditState={editState}
                    isDeleteState={deleteState}
                    isAddState={addState}
                    openDeleteModal={openDeleteModal}
                  />
                </Box>
              ))}
            </Box>
          ) : (
            // List View
            <Box
              sx={{
                display: "flex",
                transition: "transform 0.5s ease-in-out",
                width: "100%",
                height: "80%",
              }}
            >
              <Fade
                in={viewMode == "list" && !isModalOpen && !deleteModal}
                timeout={300}
                onClick={(e) => e.stopPropagation()}
              >
                <TableContainer
                  component={Paper}
                  sx={{
                    backgroundColor: "#3e4046",
                    borderRadius: "10",
                    borderColor: "white",
                    maxHeight: branches.length > 10 ? "1000px" : "auto", // Set max height for scrolling
                    overflowY: branches.length > 3 ? "auto" : "visible", // Enable vertical scrollbar if more than 3 entries
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
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          sx={{
                            backgroundColor: "#36393f",
                            color: "white",
                            padding: "12px",
                            borderBottom: "1px solid #40444b",
                          }}
                        >
                          Branch Name
                        </TableCell>
                        <TableCell
                          sx={{
                            backgroundColor: "#36393f",
                            color: "white",
                            padding: "12px",
                            borderBottom: "1px solid #40444b",
                          }}
                        >
                          Last Updated
                        </TableCell>
                        <TableCell
                          sx={{
                            backgroundColor: "#36393f",
                            color: "white",
                            padding: "12px",
                            borderBottom: "1px solid #40444b",
                          }}
                        >
                          # of Commits
                        </TableCell>
                        <TableCell
                          sx={{
                            backgroundColor: "#36393f",
                            color: "white",
                            padding: "12px",
                            borderBottom: "1px solid #40444b",
                          }}
                        >
                          Timeline
                        </TableCell>
                        {deleteState && (
                          <TableCell
                            sx={{
                              backgroundColor: "#36393f",
                              color: "white",
                              padding: "12px",
                              borderBottom: "1px solid #40444b",
                            }}
                          >
                            Actions
                          </TableCell>
                        )}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {branches.map((branch, branchIndex) => (
                        <ListViewTimeline
                          key={branch.id}
                          branchName={branch.title}
                          latestUpdatedTime={branch.latestUpdatedTime}
                          commitCount={branch.commitHistory.length}
                          timelineData={branch.commitHistory}
                          handleConnectorClick={(event: React.MouseEvent) =>
                            handleConnectorClick(branchIndex, event)
                          }
                          openDeleteModal={openDeleteModal}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Fade>
            </Box>
          )}

          {/* SpeedDial for Actions (Disabled in List View) */}
          {viewMode === "timeline" && (
            <SpeedDial
              ariaLabel="SpeedDial example"
              sx={{ position: "absolute", bottom: 16, right: 16 }}
              icon={<SpeedDialIcon />}
              FabProps={{
                sx: {
                  backgroundColor: "#7289da",
                  "&:hover": { bgcolor: "#3700b3" },
                },
              }}
            >
              <SpeedDialAction
                onClick={() => handleSpeedDialClick("delete")}
                icon={
                  <DeleteIcon
                    sx={{ color: "#ff4d4d", "&:hover": { color: "#fff" } }}
                  />
                }
                tooltipTitle="Delete"
                sx={{ bgcolor: "#2c2f33", "&:hover": { bgcolor: "#ff4d4d" } }}
              />
              <SpeedDialAction
                onClick={() => handleSpeedDialClick("add")}
                icon={
                  <AddIcon
                    sx={{ color: "#43b581", "&:hover": { color: "#fff" } }}
                  />
                }
                tooltipTitle="Add"
                sx={{ bgcolor: "#2c2f33", "&:hover": { bgcolor: "#43b581" } }}
              />
              <SpeedDialAction
                onClick={() => handleSpeedDialClick("edit")}
                icon={
                  <EditIcon
                    sx={{ color: "#faa61a", "&:hover": { color: "#fff" } }}
                  />
                }
                tooltipTitle="Edit"
                sx={{ bgcolor: "#2c2f33", "&:hover": { bgcolor: "#faa61a" } }}
              />
            </SpeedDial>
          )}
        </Box>

        {/* Mobile Stepper Navigation */}
        {viewMode === "timeline" && (
          <MobileStepper
            steps={maxSteps}
            position="static"
            activeStep={activeStep}
            nextButton={
              <Button
                size="small"
                onClick={handleNext}
                disabled={activeStep >= maxSteps - 1}
                sx={{
                  color: "white",
                  "&:hover": { backgroundColor: "#4e5969" },
                }}
              >
                Next <KeyboardArrowRight />
              </Button>
            }
            backButton={
              <Button
                size="small"
                onClick={handleBack}
                disabled={activeStep === 0}
                sx={{
                  color: "white",
                  "&:hover": { backgroundColor: "#4e5969" },
                }}
              >
                <KeyboardArrowLeft /> Back
              </Button>
            }
            sx={{
              justifyContent: "center",
              backgroundColor: "#36393f",
            }}
          />
        )}

        {/* Commit History Modal */}
        <BranchHistoryModal
          isOpen={isModalOpen}
          selectedNode={selectedNode}
          selectedTimeline={selectedTimeline}
          onClose={handleClickOutside}
          timelineData={branches.find(
            (branch, index) => index == selectedTimeline
          )} // Pass commit history
          openDeleteModal={openDeleteModal}
          deleteModal={deleteModal}
        />
        <DeleteBranchModal
          isOpen={deleteModal}
          onClose={() => setDeleteModal(false)}
          onConfirm={() => setDeleteModal(false)}
        />
      </Stack>
    </Fade>
  );
}
