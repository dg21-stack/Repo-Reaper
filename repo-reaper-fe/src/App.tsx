import React, { useEffect, useState } from "react";
import "./App.css";
import { GridContainer } from "./components/Home/GridContainer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box, CssBaseline, Stack } from "@mui/material";
import RepoHeader from "./components/Wrapper/RepoHeader";
import { BranchHistory } from "./components/BranchHistory/BranchHistory";
import { setActiveRepo } from "./service/StartupService";

const initializeActiveRepo = async (repoPath: string) => {
  try {
    const response = await setActiveRepo(repoPath);
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error setting active repository:", error);
    throw error;
  }
};

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const setActiveRepository = async () => {
      try {
        // Replace "C:/Users/Daniel/Repo-Reaper" with the actual repo path you want to set
        await initializeActiveRepo("C:/Users/Daniel/Repo-Reaper");
        setLoading(false);
      } catch (error) {
        setError("Failed to set active repository.");
        setLoading(false);
        console.error(error);
      }
    };

    setActiveRepository();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Add a loading spinner or message
  }

  if (error) {
    return <div>{error}</div>; // Display an error message
  }

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
