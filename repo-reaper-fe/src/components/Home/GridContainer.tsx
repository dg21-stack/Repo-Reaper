import React, { useEffect, useState } from "react";
import {
  Box,
  Stack,
  TextField,
  Button,
  Grid,
  Fade,
  Typography,
} from "@mui/material";
import { ButtonWithDropdown } from "./HomeContainers/LeftListMenu";
import { ButtonRow } from "./HomeContainers/ButtonRow";
import { PdfContainer } from "./HomeContainers/EmbeddedBinariesComponent";
import {
  addSpecific,
  addAll,
  commit,
  getDiff,
  getStatus,
  push,
  switchBranch,
} from "../../service/CommitHistoryService";
import { SimpleTreeView } from "@mui/x-tree-view";
import { ChevronRight, ExpandMore } from "@mui/icons-material";
import { LeftMenuListItem } from "./HomeContainers/LeftMenuListItem";

export interface FileStructureItem {
  id: string;
  name: string;
  type: "file" | "folder";
  level: number;
  path: string;
  diff?: string;
  staged?: boolean; // Boolean indicating if the file has staged changes
  unstaged?: boolean; // Boolean indicating if the file has unstaged changes
  children?: FileStructureItem[]; // Optional children for folders
}

interface IGridContainer {
  currentBranch: string | null;
  setCurrentBranch: React.Dispatch<React.SetStateAction<string | null>>;
}

export const GridContainer = ({
  currentBranch,
  setCurrentBranch,
}: IGridContainer) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [gitState, setGitState] = useState<"commit" | "push">("commit");
  const [commitMessage, setCommitMessage] = useState("");
  const [hasStaging, setHasStaging] = useState(false);
  const [hasUnstaged, setHasUnstaged] = useState(false);
  const [filePath, setFilePath] = useState<Record<
    string,
    FileStructureItem
  > | null>(null);

  const handleItemClick = (id: string) => {
    setSelectedId(id);
  };

  useEffect(() => {
    fetchDiff();
  }, [currentBranch]);

  const [fileStructure, setFileStructure] = useState<any>({});

  const fetchStatus = async () => {
    if (currentBranch) {
      const result = await getStatus(currentBranch);
      console.log(result);

      setFileStructure(result.result);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [currentBranch]);

  const fetchDiff = async () => {
    if (currentBranch) {
      const result = await getDiff(currentBranch);
      console.log(result);
      if (hasStaging != result.result.hasStaging) {
        setHasStaging(result.result.hasStaging);
      }
      if (hasUnstaged != result.result.hasUnstaged) {
        setHasUnstaged(result.result.hasUnstaged);
      }
      setFilePath(result.result.diff_dict);
      return result;
    }
    return null;
  };

  const handleSwitch = async (branch: string) => {
    await switchBranch(branch);
    setCurrentBranch(branch);
  };
  const handleAddAll = async () => {
    await addAll();
    await fetchDiff();
  };

  const handleAddSpecific = async (filePaths: string[]) => {
    await addSpecific(filePaths);
    await fetchDiff();
  };

  const handleCommit = async () => {
    await commit(commitMessage);
    setGitState("push");
    await fetchDiff();
    await fetchStatus();
  };

  const handlePush = async () => {
    await push();
    setGitState("commit");
    await fetchDiff();
    await fetchStatus();
  };

  const selectedFile = selectedId && filePath ? filePath[selectedId] : null;
  return (
    <Fade in={true}>
      <Grid
        container
        sx={{ height: "100vh", bgcolor: "#181818" }}
        spacing={0.5}
      >
        {/* Top Bar */}
        <Grid item xs={12}>
          <Box
            sx={{
              height: 60,
              bgcolor: "#36393f",
              borderBottom: "1px solid #333",
            }}
          >
            <ButtonRow />
          </Box>
        </Grid>

        {/* Left Panel */}
        <Grid item xs={3}>
          <Box
            sx={{
              height: "calc(100vh - 120px)",
              bgcolor: "#36393f",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              borderRight: "1px solid #333",
            }}
          >
            <ButtonWithDropdown
              currentBranch={currentBranch}
              handleAdd={handleAddAll}
              addDisabled={!hasUnstaged}
              selectBranchDisabled={hasUnstaged}
            />
            <hr style={{ width: "90%" }} />
            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                p: 1,
              }}
            >
              {fileStructure.top_level_files &&
                fileStructure.top_level_files.map((item: string) => (
                  <LeftMenuListItem
                    key={item}
                    id={item}
                    name={item}
                    type={fileStructure.structure[item].type}
                    level={0}
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
                    isSelected={
                      fileStructure.structure[item].path == selectedId
                    }
                    onClick={handleItemClick}
                    children={fileStructure.structure[item].children}
                    fileStructure={fileStructure}
                    filePath={filePath}
                    selectedId={selectedId ?? ""}
                  />
                ))}
            </Box>

            {/* Commit Section */}
            <Box
              sx={{
                p: 2,
                bgcolor: "#36393f",
                borderTop: "4.5px solid black",
                position: "absolute",
                bottom: 0,
                width: "100%",
              }}
            >
              {gitState === "commit" ? (
                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Enter commit message"
                    value={commitMessage}
                    onChange={(e) => setCommitMessage(e.target.value)}
                    sx={{
                      bgcolor: "white",
                      "& .MuiInputBase-root.Mui-disabled": {
                        backgroundColor: "#3f3f3f", // Change background color when disabled
                        color: "#767676", // Change text color when disabled
                      },
                      "& .MuiInputLabel-root.Mui-disabled": {
                        backgroundColor: "#343333",
                        color: "#767676", // Change text color when disabled
                      },
                    }}
                    disabled={!hasStaging}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleCommit}
                    disabled={!hasStaging}
                    sx={{
                      bgcolor: "#7289da",
                      "&:hover": {
                        bgcolor: "#3700b3",
                      },
                      "&.Mui-disabled": {
                        backgroundColor: "#3f3f3f", // Change background color when disabled
                        color: "#767676", // Change text color when disabled
                      },
                    }}
                  >
                    Commit
                  </Button>
                </Stack>
              ) : (
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  onClick={handlePush}
                  sx={{
                    bgcolor: "#03dac6",
                    "&:hover": {
                      bgcolor: "#018786",
                    },
                  }}
                >
                  Push
                </Button>
              )}
            </Box>
          </Box>
        </Grid>

        {/* Right Panel */}
        <Grid item xs={9}>
          <Box
            sx={{
              height: "calc(100vh - 120px)",
              bgcolor: "#36393f",
              overflow: "hidden",
            }}
          >
            <PdfContainer selectedFile={selectedFile} />
          </Box>
        </Grid>
      </Grid>
    </Fade>
  );
};
