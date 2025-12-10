import React, { useState, useEffect } from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  // Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

// Dayjs/MUI pickers for ranges
// NOTE: avoid using @mui/x-date-pickers-pro here to remove pro dependency.
// We'll render two native datetime-local fields inside a dialog instead.

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
  endAdornment,
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

  // shared range state (used for both date and datetime ranges)
  const [rangeOpen, setRangeOpen] = useState(false);
  const [rangeValue, setRangeValue] = useState([null, null]);

  useEffect(() => {
    if (type !== "daterange" && type !== "datetimerange") return;
    if (!value) {
      setRangeValue(["", ""]);
      return;
    }
    const parts = String(value)
      .split(",")
      .map((s) => s.trim());
    setRangeValue([parts[0] || "", parts[1] || ""]);
  }, [value, type]);

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
        InputProps={endAdornment ? { endAdornment } : undefined}
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
        InputProps={endAdornment ? { endAdornment } : undefined}
      />
    );
  }

  // Date range (two date inputs) - value is expected as "start,end"
  if (type === "daterange") {
    const apply = () => {
      const s = rangeValue[0] || "";
      const e = rangeValue[1] || "";
      onChange(name, `${s},${e}`);
      setRangeOpen(false);
    };

    return (
      <>
        <TextField
          size="small"
          label={label}
          type="text"
          variant="outlined"
          value={value || ""}
          onClick={() => !disabled && setRangeOpen(true)}
          placeholder={"YYYY-MM-DD,YYYY-MM-DD"}
          InputLabelProps={{ shrink: true }}
          error={!!error}
          helperText={error}
          sx={fieldSx}
          disabled={!!disabled}
          InputProps={endAdornment ? { endAdornment } : undefined}
          inputProps={{ readOnly: true }}
        />

        <Dialog open={rangeOpen} onClose={() => setRangeOpen(false)}>
          <DialogTitle>{label}</DialogTitle>
          <DialogContent sx={{ display: "flex", gap: 1, mt: 1 }}>
            <TextField
              label="Start"
              type="date"
              size="small"
              value={rangeValue[0] || ""}
              onChange={(e) =>
                setRangeValue([e.target.value, rangeValue[1] || ""])
              }
              InputLabelProps={{ shrink: true }}
              sx={{ flex: 1 }}
            />
            <TextField
              label="End"
              type="date"
              size="small"
              value={rangeValue[1] || ""}
              onChange={(e) =>
                setRangeValue([rangeValue[0] || "", e.target.value])
              }
              InputLabelProps={{ shrink: true }}
              sx={{ flex: 1 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setRangeOpen(false)}>Cancel</Button>
            <Button onClick={apply} variant="contained">
              Apply
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  // Datetime range (two datetime-local inputs) - value as "start,end"
  if (type === "datetimerange") {
    const apply = () => {
      const s = rangeValue[0] || "";
      const e = rangeValue[1] || "";
      onChange(name, `${s},${e}`);
      setRangeOpen(false);
    };

    return (
      <>
        <TextField
          size="small"
          label={label}
          type="text"
          variant="outlined"
          value={value || ""}
          onClick={() => !disabled && setRangeOpen(true)}
          placeholder={"YYYY-MM-DDTHH:MM,YYYY-MM-DDTHH:MM"}
          InputLabelProps={{ shrink: true }}
          error={!!error}
          helperText={error}
          sx={fieldSx}
          disabled={!!disabled}
          InputProps={endAdornment ? { endAdornment } : undefined}
          inputProps={{ readOnly: true }}
        />

        <Dialog open={rangeOpen} onClose={() => setRangeOpen(false)}>
          <DialogTitle>{label}</DialogTitle>
          <DialogContent sx={{ display: "flex", gap: 1, mt: 1 }}>
            <TextField
              label="Start"
              type="datetime-local"
              size="small"
              value={rangeValue[0] || ""}
              onChange={(e) =>
                setRangeValue([e.target.value, rangeValue[1] || ""])
              }
              InputLabelProps={{ shrink: true }}
              sx={{ flex: 1 }}
            />
            <TextField
              label="End"
              type="datetime-local"
              size="small"
              value={rangeValue[1] || ""}
              onChange={(e) =>
                setRangeValue([rangeValue[0] || "", e.target.value])
              }
              InputLabelProps={{ shrink: true }}
              sx={{ flex: 1 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setRangeOpen(false)}>Cancel</Button>
            <Button onClick={apply} variant="contained">
              Apply
            </Button>
          </DialogActions>
        </Dialog>
      </>
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
        InputProps={endAdornment ? { endAdornment } : undefined}
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
      InputProps={endAdornment ? { endAdornment } : undefined}
    />
  );
}
