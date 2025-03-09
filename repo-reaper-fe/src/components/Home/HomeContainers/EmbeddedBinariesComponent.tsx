import { Box, Paper, Breadcrumbs, Typography } from "@mui/material";

interface PdfContainerProps {
  selectedFile: {
    id: string;
    name: string;
    type: "file" | "folder";
    level: number;
    path: string;
    diff?: string;
    stagingStatus?: "staged" | "unstaged" | "untracked";
  } | null;
}

export const PdfContainer = ({ selectedFile }: PdfContainerProps) => {
  const pathSegments = selectedFile?.path ? selectedFile.path.split("/") : [];

  const renderDiffLines = (diff: string) => {
    const lines = diff.split("\n");
    return lines.map((line, index) => {
      if (line.startsWith("+")) {
        return (
          <Box
            key={index}
            sx={{
              bgcolor: "#2a2f2a",
              p: 0.5,
              borderLeft: "2px solid #28a745",
            }}
          >
            <Typography
              variant="body2"
              component="span"
              sx={{ color: "#4caf50", fontFamily: "monospace" }}
            >
              {line}
            </Typography>
          </Box>
        );
      } else if (line.startsWith("-")) {
        return (
          <Box
            key={index}
            sx={{
              bgcolor: "#3a2a2a",
              p: 0.5,
              borderLeft: "2px solid #cb2431",
            }}
          >
            <Typography
              variant="body2"
              component="span"
              sx={{ color: "#f44336", fontFamily: "monospace" }}
            >
              {line}
            </Typography>
          </Box>
        );
      } else {
        return (
          <Box
            key={index}
            sx={{
              p: 0.5,
              borderLeft: "2px solid transparent",
            }}
          >
            <Typography
              variant="body2"
              component="span"
              sx={{ color: "#ffffff", fontFamily: "monospace" }}
            >
              {line}
            </Typography>
          </Box>
        );
      }
    });
  };

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", height: "80vh", p: 1 }}
    >
      <Box sx={{ p: 2 }}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ color: "white" }}>
          {pathSegments.map((segment, index) => (
            <Typography key={index} sx={{ color: "white" }}>
              {segment}
            </Typography>
          ))}
        </Breadcrumbs>
      </Box>

      <Paper
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 2,
          bgcolor: "#36393f",
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#2f3136",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#7289da",
            borderRadius: "4px",
            "&:hover": {
              backgroundColor: "#5b6eae",
            },
          },
        }}
      >
        {selectedFile?.diff ? (
          renderDiffLines(selectedFile.diff)
        ) : (
          <Typography
            variant="body1"
            sx={{
              color: "white",
              textAlign: "center",
            }}
          >
            No files selected
          </Typography>
        )}
      </Paper>
    </Box>
  );
};
