import React, { useState, useMemo, useRef } from "react";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function DataTable({
  columns = [],
  rows = [],
  paginationModel,
  pageSizeOptions = [5, 10],
  checkboxSelection = true,
  sx,
  onEditRow,
  onDeleteRow,
  onAddRow,
  onBulkDelete,
  // zebra striping for even rows (2nd,4th...). Default light blue.
  rowEvenBg = "#184bb04a",
  ...rest
}) {
  const [searchText, setSearchText] = useState("");
  const searchRef = useRef(null);
  const [selectionModel, setSelectionModel] = useState([]);
  const initialState = paginationModel
    ? { pagination: { paginationModel } }
    : undefined;

  const mappedColumns = useMemo(
    () =>
      (columns || []).map((c) => {
        // If the parent provides DataGrid-ready column defs, pass through
        if (c.field || c.headerName) return c;

        const base = {
          field: c.id,
          headerName: c.label || c.headerName || c.id,
          sortable: !!c.sortable,
        };

        // If a width is provided on the column schema, use it as the initial
        // width. If `resizable: true` is set on the column schema, allow the
        // column to be resized by the user; otherwise lock min/max to make it
        // fixed-size.
        if (typeof c.width === "number") {
          base.width = c.width;
          if (!c.resizable) {
            base.minWidth = c.width;
            base.maxWidth = c.width;
          } else {
            // allow DataGrid to resize this column
            base.resizable = true;
          }
        }

        if (c.type === "actions") {
          return {
            ...base,
            type: "actions",
            width: c.width || 120,
            getActions: (params) => {
              const items = [];
              if (Array.isArray(c.actions)) {
                if (c.actions.includes("edit")) {
                  items.push(
                    <GridActionsCellItem
                      icon={<EditIcon />}
                      label="Edit"
                      onClick={() => onEditRow && onEditRow(params.row)}
                      showInMenu={false}
                      key="edit"
                    />
                  );
                }
                if (c.actions.includes("delete")) {
                  items.push(
                    <GridActionsCellItem
                      icon={<DeleteIcon />}
                      label="Delete"
                      onClick={() => onDeleteRow && onDeleteRow(params.row)}
                      showInMenu={false}
                      key="delete"
                    />
                  );
                }
              }
              return items;
            },
          };
        }

        // Map some common types to DataGrid types and ensure date values are Date objects
        if (c.type === "select") base.type = "singleSelect";
        else if (c.type === "number") base.type = "number";
        else if (c.type === "date") {
          base.type = "date";
          if (!base.valueGetter) {
            base.valueGetter = (params) => {
              const raw = params.row?.[c.id];
              if (raw == null) return null;
              if (raw instanceof Date) return raw;
              const d = new Date(raw);
              return Number.isNaN(d.getTime()) ? null : d;
            };
          }
        } else if (c.type === "datetime") {
          base.type = "dateTime";
          if (!base.valueGetter) {
            base.valueGetter = (params) => {
              const raw = params.row?.[c.id];
              if (raw == null) return null;
              if (raw instanceof Date) return raw;
              const d = new Date(raw);
              return Number.isNaN(d.getTime()) ? null : d;
            };
          }
        }

        return base;
      }),
    [columns, onEditRow, onDeleteRow]
  );

  // Filter rows globally by the `searchText`. This checks each visible column's
  // value (stringified) for a case-insensitive substring match.
  const filteredRows = useMemo(() => {
    const q = (searchText || "").trim().toLowerCase();
    if (!q) return rows;
    return (rows || []).filter((row) => {
      return mappedColumns.some((col) => {
        const field = col.field;
        if (!field) return false;
        const raw = row?.[field];
        if (raw == null) return false;
        let s;
        if (raw instanceof Date) s = raw.toISOString();
        else s = String(raw);
        return s.toLowerCase().includes(q);
      });
    });
  }, [rows, mappedColumns, searchText]);

  // mark even rows (2nd, 4th, ...) so we can apply zebra styling
  const getRowClassName = (params) =>
    params.indexRelativeToCurrentPage % 2 === 1 ? "even-row" : "";

  return (
    <Paper sx={{ height: 400, width: "100%", maxWidth: "91vw" }}>
      <Box
        sx={{
          p: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <IconButton
            size="small"
            onClick={() => onAddRow && onAddRow()}
            aria-label="add-row"
          >
            <AddIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => searchRef.current && searchRef.current.focus()}
            aria-label="focus-search"
          >
            <SearchIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => onBulkDelete && onBulkDelete(selectionModel)}
            aria-label="bulk-delete"
            disabled={
              !(Array.isArray(selectionModel)
                ? selectionModel.length > 0
                : !!selectionModel)
            }
          >
            <DeleteIcon />
          </IconButton>
        </Box>
        <Box
          sx={{ minWidth: 180, display: "flex", justifyContent: "flex-end" }}
        >
          <TextField
            placeholder="Search..."
            size="small"
            inputRef={searchRef}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            sx={{ width: 280, maxWidth: "90%" }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    aria-label="clear-search"
                    onClick={() => setSearchText("")}
                    edge="end"
                  >
                    <CloseIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>
      <DataGrid
        rows={filteredRows}
        columns={mappedColumns}
        selectionModel={selectionModel}
        onSelectionModelChange={(newModel) => setSelectionModel(newModel)}
        initialState={initialState}
        pageSizeOptions={pageSizeOptions}
        checkboxSelection={checkboxSelection}
        sx={{
          border: 0,
          ...(sx || {}),
          "& .MuiDataGrid-columnHeaders, & .MuiDataGrid-columnHeader, & .MuiDataGrid-columnHeaderTitle":
            {
              backgroundColor: "#1976d2",
              color: "#ffffff",
            },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: 600,
          },
          // zebra for even rows: apply background to all cells in the row
          "& .MuiDataGrid-row.even-row .MuiDataGrid-cell": {
            backgroundColor: rowEvenBg,
          },
        }}
        experimentalFeatures={{ columnResizing: true }}
        getRowClassName={getRowClassName}
        {...rest}
      />
    </Paper>
  );
}
