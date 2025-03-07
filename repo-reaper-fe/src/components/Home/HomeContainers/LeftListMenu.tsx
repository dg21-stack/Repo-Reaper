import React, { useEffect, useState } from "react";
import { Button, IconButton, Menu, MenuItem, Stack } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import {
  add,
  getAllBranches,
  getDiff,
} from "../../../service/CommitHistoryService";
import { Add } from "@mui/icons-material";

interface IButtonWithDropdown {
  currentBranch: string | null;
  currentDiff: [];
  handleAdd: () => void;
}
export const ButtonWithDropdown = ({
  currentBranch,
  currentDiff,
  handleAdd,
}: IButtonWithDropdown) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [branchAnchorEl, setBranchAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [branches, setBranches] = useState<string[]>([]);
  const [addClicked, setAddClicked] = useState(false);
  useEffect(() => {
    fetchBranchData();
  }, [currentBranch]);

  const open = Boolean(anchorEl);
  const branchOpen = Boolean(branchAnchorEl);
  const fetchBranchData = async () => {
    const result = await getAllBranches();
    setBranches(result.branches);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleBranchClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setBranchAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleBranchClose = () => {
    setBranchAnchorEl(null);
  };

  // Example list of branches

  return (
    <Stack direction="row" alignItems="center" spacing={2} width="95%" p={2}>
      {/* Left Side - Branch Dropdown Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleBranchClick}
        endIcon={<ArrowDropDownIcon />}
        sx={{
          flexGrow: 1,
          bgcolor: "#7289da", // Purple color
          "&:hover": {
            bgcolor: "#3700b3",
          },
        }}
        disabled={Object.keys(currentDiff).length !== 0}
      >
        Select Branch
      </Button>

      {/* Branch Dropdown Menu */}
      <Menu
        anchorEl={branchAnchorEl}
        open={branchOpen}
        onClose={handleBranchClose}
      >
        {branches.map((branch) => (
          <MenuItem key={branch} onClick={handleBranchClose}>
            {branch}
          </MenuItem>
        ))}
      </Menu>
      <IconButton
        sx={{ color: "white" }}
        disabled={currentDiff.length < 2 || addClicked}
        onClick={handleAdd}
      >
        <Add />
      </IconButton>
      {/* Right Side - More Options Dropdown Button */}
      <IconButton onClick={handleClick} sx={{ color: "white" }}>
        <MoreVertIcon fontSize="medium" />
      </IconButton>

      {/* More Options Dropdown Menu */}
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={handleClose}>Option 1</MenuItem>
        <MenuItem onClick={handleClose}>Option 2</MenuItem>
        <MenuItem onClick={handleClose}>Option 3</MenuItem>
      </Menu>
    </Stack>
  );
};
