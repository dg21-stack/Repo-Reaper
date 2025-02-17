import * as React from "react";
import { CssBaseline, Box, Grid, Stack, TextField, Button } from "@mui/material";
import { ButtonWithDropdown } from "./LeftListMenu";
import { LeftMenuListItem } from "./LeftMenuListItem";
import RepoHeader from "./RepoHeader";
import { ButtonRow } from "./ButtonRow";
import { PdfContainer } from "./EmbeddedBinariesComponent";

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
  const [selectedId, setSelectedId] = React.useState<string | null>(null); // State to manage the selected file id
  const [gitState, setGitState] = React.useState<"commit" | "push">("commit"); // State to manage Git state
  const [commitMessage, setCommitMessage] = React.useState(""); // State to manage commit message

  const handleItemClick = (id: string) => {
    setSelectedId(id); // Update the selected file id when an item is clicked
  };

  const handleCommit = () => {
    console.log("Commit message:", commitMessage);
    setGitState("push")
    // Add logic to handle commit
  };

  const handlePush = () => {
    console.log("Pushing changes...");
    setGitState("commit")
    // Add logic to handle push
  };

  // Get the selected file based on the selectedId
  const selectedFile = selectedId ? fileStructure[selectedId] : null;

  return (
    <Box sx={{ height: "100vh", width: "100vw", overflow: "hidden" }}>
      <CssBaseline />
      <Grid container sx={{ height: "100vh" }} spacing={0.5}>
        {/* Top Bar - Repo Header */}
        <Grid item flex="1">
          <Box sx={{ height: 60, bgcolor: "primary.main" }}>
            <RepoHeader repoName="repo" />
          </Box>
        </Grid>

        {/* Container for Buttons */}
        <Grid item xs={12}>
          <Box sx={{ height: 60, bgcolor: "primary.main" }}>
            <ButtonRow />
          </Box>
        </Grid>

        {/* Left Narrow Panel */}
        <Grid item xs={3}>
          <Box
            sx={{
              height: "calc(100vh - 120px)",
              bgcolor: "secondary.main",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
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
                  isSelected={selectedId === item.id} // Check if the item is selected
                  onClick={handleItemClick} // Pass the click handler
                />
              ))}
            </Stack>

            {/* Additional Container for Git Actions */}
            <Box
              sx={{
                p: 2,
                bgcolor: "background.paper",
                borderTop: "1px solid #e0e0e0",
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
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleCommit}
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
                >
                  Push
                </Button>
              )}
            </Box>
          </Box>
        </Grid>

        {/* Right Wider Panel */}
        <Grid item xs={9}>
          <Box
            sx={{
              height: "calc(100vh - 120px)",
              bgcolor: "success.main",
              overflow: "hidden",
            }}
          >
            {/* Pass the selected file to PdfContainer */}
            <PdfContainer selectedFile={selectedFile} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};