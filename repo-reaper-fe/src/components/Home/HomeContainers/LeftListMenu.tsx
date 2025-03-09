import React, { useEffect, useState } from "react";
import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { getAllBranches } from "../../../service/CommitHistoryService";
import { Add } from "@mui/icons-material";

interface IButtonWithDropdown {
  currentBranch: string | null;
  handleAdd: () => void;
  addDisabled: boolean;
  selectBranchDisabled: boolean;
}
export const ButtonWithDropdown = ({
  currentBranch,
  handleAdd,
  addDisabled,
  selectBranchDisabled,
}: IButtonWithDropdown) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [branchAnchorEl, setBranchAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [branches, setBranches] = useState<string[]>([]);

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
      <Tooltip title="Enabled when no unstaged changes">
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
          disabled={selectBranchDisabled}
        >
          Select Branch
        </Button>
      </Tooltip>

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
      <Tooltip title="add to git branch">
        <IconButton
          sx={{ color: "white" }}
          disabled={addDisabled}
          onClick={handleAdd}
        >
          <Add />
        </IconButton>
      </Tooltip>
      {/* Right Side - More Options Dropdown Button */}
      <Tooltip title="extra settings">
        <IconButton onClick={handleClick} sx={{ color: "white" }}>
          <MoreVertIcon fontSize="medium" />
        </IconButton>
      </Tooltip>

      {/* More Options Dropdown Menu */}
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={handleClose}>Option 1</MenuItem>
        <MenuItem onClick={handleClose}>Option 2</MenuItem>
        <MenuItem onClick={handleClose}>Option 3</MenuItem>
      </Menu>
    </Stack>
  );
};
