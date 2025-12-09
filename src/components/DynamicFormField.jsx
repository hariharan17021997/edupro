import React from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from "@mui/material";

// DynamicFormField: renders a form field based on a JSON field definition
// Field definition example:
// { name: 'firstName', label: 'First Name', type: 'text', required: true, length: 50, inputWidth: '100%' }
// Supported types: text, email, number, date, select, textarea
// Added: 'datetime' -> renders a native datetime-local input

export default function DynamicFormField({
  field,
  value,
  onChange,
  error,
  disabled,
}) {
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
          size="small"
          value={value || ""}
          label={label}
          onChange={(e) => onChange(name, e.target.value)}
          disabled={!!disabled}
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
  if (type === "datetime") {
    return (
      <TextField
        size="small"
        label={label}
        type="datetime-local"
        variant="outlined"
        value={value || ""}
        onChange={(e) => onChange(name, e.target.value)}
        InputLabelProps={{ shrink: true }}
        error={!!error}
        helperText={error}
        sx={fieldSx}
        disabled={!!disabled}
      />
    );
  }

  if (type === "date") {
    return (
      <TextField
        size="small"
        label={label}
        type="date"
        variant="outlined"
        value={value || ""}
        onChange={(e) => onChange(name, e.target.value)}
        InputLabelProps={{ shrink: true }}
        error={!!error}
        helperText={error}
        sx={fieldSx}
        disabled={!!disabled}
      />
    );
  }

  // Date range (two date inputs) - value is expected as "start,end"
  if (type === "daterange") {
    const parseRange = (val) => {
      if (!val && val !== 0) return ["", ""];
      const parts = String(val)
        .split(",")
        .map((s) => s.trim());
      return [parts[0] || "", parts[1] || ""];
    };

    const [start, end] = parseRange(value);

    return (
      <Box
        sx={{
          display: "flex",
          gap: 1,
          alignItems: "center",
          width: fieldSx.width,
        }}
      >
        <TextField
          size="small"
          label={`${label} (start)`}
          type="date"
          variant="outlined"
          value={start}
          onChange={(e) => onChange(name, `${e.target.value},${end}`)}
          InputLabelProps={{ shrink: true }}
          sx={{ flex: 1 }}
          disabled={!!disabled}
        />
        <TextField
          size="small"
          label={`${label} (end)`}
          type="date"
          variant="outlined"
          value={end}
          onChange={(e) => onChange(name, `${start},${e.target.value}`)}
          InputLabelProps={{ shrink: true }}
          sx={{ flex: 1 }}
          disabled={!!disabled}
        />
      </Box>
    );
  }

  // Datetime range (two datetime-local inputs) - value as "start,end"
  if (type === "datetimerange") {
    const parseRange = (val) => {
      if (!val && val !== 0) return ["", ""];
      const parts = String(val)
        .split(",")
        .map((s) => s.trim());
      return [parts[0] || "", parts[1] || ""];
    };

    const [start, end] = parseRange(value);

    return (
      <Box
        sx={{
          display: "flex",
          gap: 1,
          alignItems: "center",
          width: fieldSx.width,
        }}
      >
        <TextField
          size="small"
          label={`${label} (start)`}
          type="datetime-local"
          variant="outlined"
          value={start}
          onChange={(e) => onChange(name, `${e.target.value},${end}`)}
          InputLabelProps={{ shrink: true }}
          sx={{ flex: 1 }}
          disabled={!!disabled}
        />
        <TextField
          size="small"
          label={`${label} (end)`}
          type="datetime-local"
          variant="outlined"
          value={end}
          onChange={(e) => onChange(name, `${start},${e.target.value}`)}
          InputLabelProps={{ shrink: true }}
          sx={{ flex: 1 }}
          disabled={!!disabled}
        />
      </Box>
    );
  }

  // Textarea
  if (type === "textarea") {
    return (
      <TextField
        size="small"
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
        disabled={!!disabled}
      />
    );
  }

  // Default: text, email, number, etc.
  return (
    <TextField
      size="small"
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
      disabled={disabled}
    />
  );
}
