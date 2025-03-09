import React, { useEffect, useState } from "react";
import { Box, Stack, TextField, Button, Grid, Fade } from "@mui/material";
import { ButtonWithDropdown } from "./HomeContainers/LeftListMenu";
import { LeftMenuListItem } from "./HomeContainers/LeftMenuListItem";
import { ButtonRow } from "./HomeContainers/ButtonRow";
import { PdfContainer } from "./HomeContainers/EmbeddedBinariesComponent";
import {
  add,
  commit,
  getDiff,
  push,
  switchBranch,
} from "../../service/CommitHistoryService";

interface FileStructureItem {
  id: string;
  name: string;
  type: string;
  level: number;
  path: string;
  diff: string | undefined;
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
  const [currentDiff, setCurrentDiff] = useState<[]>([]);
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

  const fetchDiffData = async () => {
    if (currentBranch) {
      const result = await getDiff(currentBranch);
      setCurrentDiff(result.result);

      setFilePath((prevState) => {
        const updatedFilePaths: Record<string, FileStructureItem> = {};
        let idCounter = 1;

        const addItem = (path: string, isFolder: boolean, diff?: string) => {
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
          };
        };

        Object.keys(result.result).forEach((filePath) => {
          const pathParts = filePath.split("/");
          let currentPath = "";

          pathParts.forEach((part, index) => {
            currentPath += index === 0 ? part : `/${part}`;
            const isFolder = index < pathParts.length - 1;

            const exists = Object.values(updatedFilePaths).some(
              (item) => item.path === currentPath
            );

            if (!exists) {
              addItem(
                currentPath,
                isFolder,
                isFolder ? undefined : result.result[filePath]
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
  };
  const handleCommit = async () => {
    await commit(commitMessage);
    setGitState("push");
    setCurrentDiff([]);
  };

  const handlePush = async () => {
    await push();
    setGitState("commit");
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
              addDisabled={filePath ? Object.keys(filePath).length == 0 : true}
              selectBranchDisabled={
                filePath ? Object.keys(filePath).length !== 0 : false
              }
            />
            <Stack spacing={0} sx={{ mt: 2, flex: 1 }}>
              {filePath &&
                Object.values(filePath).map((item) => (
                  <LeftMenuListItem
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    type={item.type}
                    level={item.level}
                    path={item.path}
                    isSelected={selectedId === item.id}
                    onClick={handleItemClick}
                  />
                ))}
            </Stack>

            {/* Commit Section */}
            <Box
              sx={{
                p: 2,
                bgcolor: "#1e1e1e",
                borderTop: "1px solid #333",
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
                    sx={{ bgcolor: "white" }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleCommit}
                    sx={{
                      bgcolor: "#7289da",
                      "&:hover": {
                        bgcolor: "#3700b3",
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
