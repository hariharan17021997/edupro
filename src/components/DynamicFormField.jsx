import React from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

// DynamicFormField: renders a form field based on a JSON field definition
// Field definition example:
// { name: 'firstName', label: 'First Name', type: 'text', required: true, length: 50, inputWidth: '100%' }
// Supported types: text, email, number, date, select, textarea

export default function DynamicFormField({ field, value, onChange, error }) {
  const {
    name,
    label,
    type = "text",
    options = [],
    placeholder,
    length,
  } = field;

  // When inside a Grid item, always use 100% width to fill the column
  // Otherwise use inputWidth if provided, or default to 100%
  const fieldSx = { width: field.inputWidth || "100%" };

  // Select/Dropdown
  if (type === "select") {
    return (
      <FormControl sx={fieldSx}>
        <InputLabel>{label}</InputLabel>
        <Select
          value={value || ""}
          label={label}
          onChange={(e) => onChange(name, e.target.value)}
        >
          {options.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  // Date input
  if (type === "date") {
    return (
      <TextField
        label={label}
        type="date"
        variant="outlined"
        value={value || ""}
        onChange={(e) => onChange(name, e.target.value)}
        InputLabelProps={{ shrink: true }}
        error={!!error}
        helperText={error}
        sx={fieldSx}
      />
    );
  }

  // Textarea
  if (type === "textarea") {
    return (
      <TextField
        label={label}
        variant="outlined"
        multiline
        minRows={3}
        value={value || ""}
        onChange={(e) => onChange(name, e.target.value)}
        placeholder={placeholder}
        error={!!error}
        helperText={error}
        inputProps={{ maxLength: length }}
        sx={fieldSx}
      />
    );
  }

  // Default: text, email, number, etc.
  return (
    <TextField
      label={label}
      type={type}
      variant="outlined"
      value={value || ""}
      onChange={(e) => onChange(name, e.target.value)}
      placeholder={placeholder}
      error={!!error}
      helperText={error}
      inputProps={{ maxLength: length }}
      sx={fieldSx}
    />
  );
}
