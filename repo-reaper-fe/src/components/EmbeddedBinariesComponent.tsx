import { Box, Paper, Breadcrumbs, Typography } from "@mui/material";

interface PdfContainerProps {
  selectedFile: {
    path: string;
    link: string | null;
  } | null; // Selected file with path and link
}

export const PdfContainer = ({ selectedFile }: PdfContainerProps) => {
  // Split the file path into segments for the breadcrumb
  const pathSegments = selectedFile?.path ? selectedFile.path.split("/") : [];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "80vh", // Set a height for the parent container (e.g., 80% of viewport height)
        p: 1,
      }}
    >
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
     {selectedFile?.link ? (
        <Paper
        elevation={3}
        sx={{
          flex: 1, // Take up remaining space
          display: "flex",
          flexDirection: "column",
          border: "2px solid #e0e0e0", // Add a border
          borderRadius: "8px", // Rounded corners
          overflow: "hidden", // Ensure the iframe doesn't overflow the Paper
          backgroundColor: "#f5f5f5", // Light background color
        }}
      >
          <iframe
            src={selectedFile.link}
            width="100%"
            height="100%" // Fill the parent container
            title="PDF Document"
            style={{ border: "none", flex: 1 }} // Ensure iframe takes up remaining space
          />
      </Paper>
     ): (null)} 
    </Box>
  );
};