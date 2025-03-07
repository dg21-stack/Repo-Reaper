import React from "react";
import { Box, Stack, TextField, Button, Grid, Fade } from "@mui/material";
import { ButtonWithDropdown } from "./HomeContainers/LeftListMenu";
import { LeftMenuListItem } from "./HomeContainers/LeftMenuListItem";
import { ButtonRow } from "./HomeContainers/ButtonRow";
import { PdfContainer } from "./HomeContainers/EmbeddedBinariesComponent";
import { commit, push } from "../../service/CommitHistoryService";

// Define the structure of a file/folder item
interface FileStructureItem {
  id: string; // Unique identifier
  name: string;
  type: string;
  level: number; // Determines indentation
  path: string; // Full path of the file/folder
  link: string | null; // Link to the file (null for folders)
}

// Define the file structure as a dictionary indexed by id
const fileStructure: Record<string, FileStructureItem> = {
  "1": {
    id: "1",
    name: "Documents",
    type: "folder",
    level: 0,
    path: "Documents",
    link: null,
  },
  "2": {
    id: "2",
    name: "Project",
    type: "folder",
    level: 1,
    path: "Documents/Project",
    link: null,
  },
  "3": {
    id: "3",
    name: "report.docx",
    type: "file",
    level: 2,
    path: "Documents/Project/report.docx",
    link: "https://www.rd.usda.gov/sites/default/files/pdf-sample_0.pdf",
  },
};

export const GridContainer = () => {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [gitState, setGitState] = React.useState<"commit" | "push">("commit");
  const [commitMessage, setCommitMessage] = React.useState("");

  const handleItemClick = (id: string) => {
    setSelectedId(id);
  };

  const handleCommit = async () => {
    console.log("Commit message:", commitMessage);
    await commit(commitMessage);
    setGitState("push");
  };

  const handlePush = async () => {
    console.log("Pushing changes...");
    await push();
    setGitState("commit");
  };

  const selectedFile = selectedId ? fileStructure[selectedId] : null;

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
            <ButtonWithDropdown />
            <Stack spacing={0} sx={{ mt: 2, flex: 1 }}>
              {Object.values(fileStructure).map((item) => (
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
                      bgcolor: "#7289da", // Purple color
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
                    bgcolor: "#03dac6", // Teal
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
