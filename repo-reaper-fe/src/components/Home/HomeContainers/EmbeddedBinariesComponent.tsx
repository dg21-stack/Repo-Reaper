import {
  Box,
  Paper,
  Breadcrumbs,
  Typography,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

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
      let bgcolor = "#1e1e1e"; // Default background for unchanged lines
      let borderColor = "transparent";
      let textColor = "#ffffff"; // Default text color for unchanged lines

      if (line.startsWith("+")) {
        bgcolor = "#2a2f2a"; // Greenish background for added lines
        borderColor = "#28a745"; // Green border for added lines
        textColor = "#4caf50"; // Green text for added lines
      } else if (line.startsWith("-")) {
        bgcolor = "#3a2a2a"; // Reddish background for removed lines
        borderColor = "#cb2431"; // Red border for removed lines
        textColor = "#f44336"; // Red text for removed lines
      }

      return (
        <Box
          key={index}
          sx={{
            display: "flex",
            alignItems: "center",
            bgcolor,
            p: 1,
            borderLeft: `4px solid ${borderColor}`,
            fontFamily: "monospace",
            fontSize: "0.875rem",
            lineHeight: "1.5",
          }}
        >
          <Typography
            variant="body2"
            component="span"
            sx={{ color: textColor, fontFamily: "monospace" }}
          >
            {line}
          </Typography>
        </Box>
      );
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
          bgcolor: "#1e1e1e", // Dark background for the entire container
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
              p: 2,
            }}
          >
            No files selected
          </Typography>
        )}
      </Paper>
    </Box>
  );
};
