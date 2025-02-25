import { Box, Paper, Breadcrumbs, Typography } from "@mui/material";

interface PdfContainerProps {
  selectedFile: {
    path: string;
    link: string | null;
  } | null;
}

export const PdfContainer = ({ selectedFile }: PdfContainerProps) => {
  const pathSegments = selectedFile?.path ? selectedFile.path.split("/") : [];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "80vh", p: 1 }}>
      {/* Breadcrumbs */}
      <Box sx={{ p: 2 }}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ color: "white" }}>
          {pathSegments.map((segment, index) => (
            <Typography key={index} sx={{ color: "white" }}>
              {segment}
            </Typography>
          ))}
        </Breadcrumbs>
      </Box>

      {/* PDF Viewer */}
      {selectedFile?.link && (
        <Paper
          elevation={3}
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            border: "2px solid #333",
            borderRadius: "8px",
            backgroundColor: "#121212",
            overflow: "hidden",
          }}
        >
          <iframe
            src={selectedFile.link}
            width="100%"
            height="100%"
            title="PDF Document"
            style={{ border: "none", flex: 1 }}
          />
        </Paper>
      )}
    </Box>
  );
};
