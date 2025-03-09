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
import { LeftMenuListItem } from "./HomeContainers/LeftMenuListItem";
import { ButtonRow } from "./HomeContainers/ButtonRow";
import { PdfContainer } from "./HomeContainers/EmbeddedBinariesComponent";
import {
  add,
  commit,
  getDiff,
  getStatus,
  push,
  switchBranch,
} from "../../service/CommitHistoryService";

interface FileStructureItem {
  id: string;
  name: string;
  type: "file" | "folder";
  level: number;
  path: string;
  diff?: string;
  staged?: boolean; // Boolean indicating if the file has staged changes
  unstaged?: boolean; // Boolean indicating if the file has unstaged changes
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
    fetchDiffData();
  }, [currentBranch]);

  const fetchStatusCheck = async () => {
    if (currentBranch) {
      const result = await getStatus(currentBranch);
      if (hasStaging != result.result.hasStaging) {
        setHasStaging(result.result.hasStaging);
      }
      if (hasUnstaged != result.result.hasUnstaged) {
        setHasUnstaged(result.result.hasUnstaged);
      }
      return result;
    }
    return null;
  };
  const fetchDiffData = async () => {
    if (currentBranch) {
      // Fetch both the diff data and the status check
      const [diffResult, statusResult] = await Promise.all([
        getDiff(currentBranch),
        fetchStatusCheck(),
      ]);

      setFilePath((prevState) => {
        const updatedFilePaths: Record<string, FileStructureItem> = {};
        let idCounter = 1;

        // Helper function to normalize paths
        const normalizePath = (path: string) => {
          return path.replace(/\\/g, "/").replace(/^\/|\/$/g, ""); // Normalize slashes and remove leading/trailing slashes
        };

        const addItem = (
          path: string,
          isFolder: boolean,
          diff?: string,
          staged?: boolean,
          unstaged?: boolean
        ) => {
          const pathParts = path.split("/");
          const name = pathParts.pop() || path;
          const level = pathParts.length;

          const id = String(idCounter);
          idCounter++;

          updatedFilePaths[id] = {
            id,
            name,
            type: isFolder ? "folder" : "file",
            level,
            path,
            diff: isFolder ? undefined : diff,
            staged, // Boolean indicating if the file has staged changes
            unstaged, // Boolean indicating if the file has unstaged changes
          };
        };

        // Normalize staged and unstaged file paths
        const stagedFiles = new Set(
          (statusResult?.result.result.staged || []).map(normalizePath)
        );
        const unstagedFiles = new Set(
          (statusResult?.result.result.unstaged || []).map(normalizePath)
        );

        Object.keys(diffResult.result).forEach((filePath) => {
          const normalizedFilePath = normalizePath(filePath);
          const pathParts = normalizedFilePath.split("/");
          let currentPath = "";

          pathParts.forEach((part, index) => {
            currentPath += index === 0 ? part : `/${part}`;
            const isFolder = index < pathParts.length - 1;

            const exists = Object.values(updatedFilePaths).some(
              (item) => item.path === currentPath
            );

            if (!exists) {
              // Determine if the file has staged or unstaged changes
              let staged = false;
              let unstaged = false;
              if (!isFolder && statusResult) {
                staged = stagedFiles.has(normalizedFilePath); // Check if the file has staged changes
                unstaged = unstagedFiles.has(normalizedFilePath); // Check if the file has unstaged changes
              }

              addItem(
                currentPath,
                isFolder,
                isFolder ? undefined : diffResult.result[filePath],
                staged,
                unstaged
              );
            }
          });
        });
        return updatedFilePaths;
      });
    }
  };
  const handleSwitch = async (branch: string) => {
    await switchBranch(branch);
    setCurrentBranch(branch);
  };
  const handleAdd = async () => {
    await add();
    fetchDiffData();
  };
  const handleCommit = async () => {
    await commit(commitMessage);
    setGitState("push");
    fetchDiffData();
  };

  const handlePush = async () => {
    await push();
    setGitState("commit");
    fetchDiffData();
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
              handleAdd={handleAdd}
              addDisabled={!hasUnstaged}
              selectBranchDisabled={hasUnstaged}
            />
            <hr style={{ width: "90%" }} />
            <Stack spacing={0} sx={{ mt: 2, flex: 1 }}>
              {filePath && Object.values(filePath).length > 1 ? (
                Object.values(filePath).map((item) => (
                  <LeftMenuListItem
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    type={item.type}
                    level={item.level}
                    staged={item.staged ?? false}
                    unstaged={item.unstaged ?? false}
                    path={item.path}
                    isSelected={selectedId === item.id}
                    onClick={handleItemClick}
                  />
                ))
              ) : (
                <Typography color="white" textAlign="center">
                  No new changes!
                </Typography>
              )}
            </Stack>

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
