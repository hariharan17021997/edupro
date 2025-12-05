import React, { useState } from "react";
import { Box, Paper, Typography, IconButton, Snackbar, Alert } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";

/**
 * CodeDisplay Component
 * Displays code snippets with syntax highlighting, line numbers, and copy functionality
 * 
 * Props:
 * - code: String of code to display
 * - language: Programming language (e.g., 'javascript', 'python', 'html')
 * - title: Optional title for the code block
 * - showLineNumbers: Boolean to show/hide line numbers (default: true)
 */

export default function CodeDisplay({ 
  code, 
  language = "javascript", 
  title,
  showLineNumbers = true 
}) {
  const theme = useTheme();
  const [copied, setCopied] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setSnackbarOpen(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Split code into lines for line numbering
  const codeLines = code.split("\n");

  return (
    <Box sx={{ mb: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: theme.palette.grey[800],
          color: theme.palette.common.white,
          px: 2,
          py: 1,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {title && (
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {title}
            </Typography>
          )}
          <Typography
            variant="caption"
            sx={{
              backgroundColor: theme.palette.grey[700],
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
              textTransform: "uppercase",
              fontSize: "0.65rem",
              fontWeight: 600,
            }}
          >
            {language}
          </Typography>
        </Box>
        <IconButton
          size="small"
          onClick={handleCopy}
          sx={{
            color: theme.palette.common.white,
            "&:hover": {
              backgroundColor: theme.palette.grey[700],
            },
          }}
        >
          {copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
        </IconButton>
      </Box>

      {/* Code Block */}
      <Paper
        elevation={0}
        sx={{
          backgroundColor: theme.palette.grey[900],
          color: theme.palette.grey[100],
          p: 2,
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
          overflow: "auto",
          maxHeight: 500,
          fontFamily: "'Fira Code', 'Courier New', monospace",
          fontSize: "0.875rem",
          lineHeight: 1.6,
        }}
      >
        <Box sx={{ display: "flex" }}>
          {/* Line Numbers */}
          {showLineNumbers && (
            <Box
              sx={{
                pr: 2,
                mr: 2,
                borderRight: `1px solid ${theme.palette.grey[700]}`,
                color: theme.palette.grey[600],
                userSelect: "none",
                textAlign: "right",
                minWidth: 40,
              }}
            >
              {codeLines.map((_, index) => (
                <Box key={index} sx={{ lineHeight: 1.6 }}>
                  {index + 1}
                </Box>
              ))}
            </Box>
          )}

          {/* Code Content */}
          <Box
            component="pre"
            sx={{
              margin: 0,
              flex: 1,
              whiteSpace: "pre",
              wordWrap: "break-word",
              overflowX: "auto",
            }}
          >
            <code>{code}</code>
          </Box>
        </Box>
      </Paper>

      {/* Copy Success Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Code copied to clipboard!
        </Alert>
      </Snackbar>
    </Box>
  );
}