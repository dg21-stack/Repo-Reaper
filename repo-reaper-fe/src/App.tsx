import React from "react";
import "./App.css";
import { GridContainer } from "./components/GridContainer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box, CssBaseline, Stack } from "@mui/material";
import RepoHeader from "./components/RepoHeader";
import { BranchHistory } from "./components/BranchHistory";

function App() {
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        background: "#36393f",
      }}
    >
      <CssBaseline />
      <Stack sx={{ height: "100%" }}>
        {/* Top Bar - Repo Header */}
        <Box sx={{ bgcolor: "primary.main" }}>
          <RepoHeader repoName="repo" />
        </Box>

        <Router>
          <Routes>
            <Route path="/" element={<GridContainer />} />
            <Route path="/history" element={<BranchHistory />} />
          </Routes>
        </Router>
      </Stack>
    </Box>
  );
}

export default App;
