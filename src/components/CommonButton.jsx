import React from "react";
import Button from "@mui/material/Button";

// Reusable common button component
// Props:
// - children: Button label/content
// - variant: MUI variant (default "contained")
// - fullWidth, size, disabled, startIcon, endIcon, onClick, sx ...rest spread

export default function CommonButton({
  children,
  variant = "contained",
  fullWidth = false,
  size = "medium",
  disabled = false,
  onClick,
  startIcon,
  endIcon,
  sx,
  ...rest
}) {
  return (
    <Button
      variant={variant}
      fullWidth={fullWidth}
      size={size}
      disabled={disabled}
      onClick={onClick}
      startIcon={startIcon}
      endIcon={endIcon}
      sx={sx}
      {...rest}
    >
      {children}
    </Button>
  );
}
