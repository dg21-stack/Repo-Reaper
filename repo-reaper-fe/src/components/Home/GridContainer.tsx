import React, { useEffect, useState } from "react";
import {
  Box,
  Stack,
  TextField,
  Button,
  Grid,
  Fade,
  Typography,
  FormGroup,
} from "@mui/material";
import { ButtonWithDropdown } from "./HomeContainers/LeftListMenu";
import { LeftMenuListItem } from "./HomeContainers/LeftMenuListItem";
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
    fetchDiff();
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
    fetchDiff();
  };

  const handleAddSpecific = async () => {
    await addSpecific([]);
    fetchDiff();
  };

  const handleCommit = async () => {
    await commit(commitMessage);
    setGitState("push");
    fetchDiff();
  };

  const handlePush = async () => {
    await push();
    setGitState("commit");
    fetchDiff();
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
            <Stack spacing={0} sx={{ mt: 2, flex: 1 }}>
              {filePath && Object.values(filePath).length > 1 ? (
                Object.values(filePath).map((item) => (
                  <FormGroup>
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
                  </FormGroup>
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
