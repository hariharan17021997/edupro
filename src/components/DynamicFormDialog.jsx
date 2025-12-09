import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Grid,
} from "@mui/material";
import CommonButton from "./CommonButton";
import DynamicFormField from "./DynamicFormField";

// Reusable dialog that renders a dynamic form based on a fields array
// Props:
// - open: boolean
// - fields: array of field definitions (see DynamicFormField)
// - title: optional dialog title
// - onClose: () => void
// - onSubmit: (values) => void

export default function DynamicFormDialog({
  open,
  fields = [],
  title = "Create",
  submitLabel = "Create",
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const initial = (fields || []).reduce((acc, f) => {
      // If the field has an explicit defaultValue, use it
      if (f.defaultValue !== undefined) {
        return { ...acc, [f.name]: f.defaultValue };
      }

      // If it's a select and has options, default to the first option's value
      if (f.type === "select" && Array.isArray(f.options) && f.options.length) {
        const first = f.options[0];
        const val = first && first.value !== undefined ? first.value : first;
        return { ...acc, [f.name]: val };
      }

      // otherwise default to empty string
      return { ...acc, [f.name]: "" };
    }, {});
    setForm(initial);
    setErrors({});
  }, [fields, open]);

  const handleChange = (name, val) => {
    setForm((s) => ({ ...s, [name]: val }));
  };

  const validate = () => {
    const newErrors = {};
    (fields || []).forEach((f) => {
      if (f.required && (form[f.name] === undefined || form[f.name] === "")) {
        newErrors[f.name] = `${f.label} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit?.(form);
    onClose?.();
  };

  return (
    <Dialog open={!!open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ textAlign: "center" }}>{title}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1, display: "flex", justifyContent: "center" }}>
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="flex-start"
          >
            {(fields || []).map((f) => (
              <Grid item xs={12} sm={f.width || 6} key={f.name}>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "flex-start",
                  }}
                >
                  <DynamicFormField
                    field={f}
                    value={form[f.name]}
                    onChange={handleChange}
                    error={errors[f.name]}
                    disabled={!!f.disabled}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
        <CommonButton variant="outlined" onClick={onClose}>
          Cancel
        </CommonButton>
        <CommonButton
          variant="contained"
          color="primary"
          onClick={handleSubmit}
        >
          {submitLabel}
        </CommonButton>
      </DialogActions>
    </Dialog>
  );
}
