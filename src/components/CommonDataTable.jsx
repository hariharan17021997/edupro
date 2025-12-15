import React, { useState, useMemo } from "react";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Popover from "@mui/material/Popover";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
// InputAdornment was removed; kept imports minimal
import CommonButton from "./CommonButton";
import DynamicFormField from "./DynamicFormField";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import Collapse from "@mui/material/Collapse";
import Stack from "@mui/material/Stack";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
// import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import GradingTwoToneIcon from "@mui/icons-material/GradingTwoTone";
import FilterAltOffTwoToneIcon from "@mui/icons-material/FilterAltOffTwoTone";
import CachedTwoToneIcon from "@mui/icons-material/CachedTwoTone";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import Badge from "@mui/material/Badge";
import { styled, useTheme } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
// import useMediaQuery from "@mui/material/useMediaQuery";
// dataTable styles are now stored in the theme under `theme.custom.dataTable`
import BuildIcon from "@mui/icons-material/Build";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LibraryAddCheckIcon from "@mui/icons-material/LibraryAddCheck";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import DoneIcon from "@mui/icons-material/Done";

export default function DataTable({
  columns = [],
  rows = [],
  createSchema = [],
  searchSchema = [],
  paginationModel,
  pageSizeOptions = [10, 30, 50, 100, 200, 300, 500],
  checkboxSelection = true,
  sx,
  onEditRow,
  onDeleteRow,
  onAddRow,
  onSearch,
  onBulkDelete,
  // zebra striping for even rows (2nd,4th...). Default light blue.
  rowEvenBg = "#184bb04a",
  ...rest
}) {
  const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [searchText, setSearchText] = useState("");
  const [selectionModel, setSelectionModel] = useState([]);
  const [showColumnFilters, setShowColumnFilters] = useState(true);
  const [columnFilters, setColumnFilters] = useState({});
  const [multiFilters, setMultiFilters] = useState([]);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [tempFilter, setTempFilter] = useState({
    field: "",
    operator: "",
    value: "",
  });
  const [stagedFilters, setStagedFilters] = useState([]);
  const initialState = paginationModel
    ? { pagination: { paginationModel } }
    : {
        pagination: {
          paginationModel: { page: 0, pageSize: pageSizeOptions?.[0] || 10 },
        },
      };

  // MUI X MIT DataGrid caps pageSize at 100. Clamp options and defaults
  // so we don't pass values >100 which would throw at runtime.
  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      right: -2,
      top: 5,
      border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
      padding: "0 4px",
    },
  }));
  const MAX_MIT_PAGE_SIZE = 100;
  const safePageSizeOptions = useMemo(() => {
    const arr = (pageSizeOptions || []).map((p) => {
      const n = Number(p) || 0;
      return Math.min(n, MAX_MIT_PAGE_SIZE);
    });
    // unique and sorted
    return Array.from(new Set(arr)).sort((a, b) => a - b);
  }, [pageSizeOptions]);

  // Controlled pagination state: initialize from prop if provided,
  // otherwise default to first page and the first pageSize option.
  const [localPaginationModel, setLocalPaginationModel] = useState(() => {
    if (paginationModel) {
      const initialPageSize =
        paginationModel.pageSize != null
          ? paginationModel.pageSize
          : safePageSizeOptions[0] != null
          ? safePageSizeOptions[0]
          : 10;
      return {
        page: paginationModel.page ?? 0,
        pageSize: Math.min(initialPageSize, MAX_MIT_PAGE_SIZE),
      };
    }
    return { page: 0, pageSize: safePageSizeOptions[0] || 10 };
  });

  const checkIt = () => {
    console.log(selectionModel);
  };

  const openFilterPopover = (e) => {
    setFilterAnchorEl(e.currentTarget);
    // initialize staging with currently committed filters
    setStagedFilters(multiFilters || []);
  };
  const cancelFilterPopover = () => {
    // discard staged changes
    setStagedFilters(multiFilters || []);
    setTempFilter({ field: "", operator: "", value: "" });
    setFilterAnchorEl(null);
  };
  const commitFilterPopover = () => {
    // commit staged filters to active filters (apply filtering)
    setMultiFilters(stagedFilters || []);
    setTempFilter({ field: "", operator: "", value: "" });
    // setFilterAnchorEl(null);
  };

  const filterOpen = Boolean(filterAnchorEl);

  const getColByField = (field) =>
    mappedColumns.find((c) => c.field === field) || null;

  const operatorOptionsForType = (type) => {
    if (!type) return ["contains", "equals"];
    const t = String(type || "").toLowerCase();
    if (t === "number") return ["=", "!=", ">", "<", "between"];
    if (t.includes("date")) return ["=", "!=", "before", "after", "between"];
    if (t.includes("select")) return ["equals", "not equals"];
    return ["contains", "equals", "startsWith", "endsWith"];
  };

  const addTempFilter = () => {
    if (!tempFilter.field || !tempFilter.operator) return;
    setStagedFilters((prev) => [...(prev || []), tempFilter]);
    setTempFilter({ field: "", operator: "", value: "" });
  };

  // const removeMultiFilter = (idx) => {
  //   setStagedFilters((prev) => (prev || []).filter((_, i) => i !== idx));
  //   setMultiFilters((prev) => prev.filter((_, i) => i !== idx));
  // };
  const removeStagedFilter = (idx) => {
    setStagedFilters((prev) => (prev || []).filter((_, i) => i !== idx));
    setMultiFilters((prev) => prev.filter((_, i) => i !== idx));
  };
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

  // Filter rows by global search `searchText` AND per-column `columnFilters`.
  const filteredRows = useMemo(() => {
    const q = (searchText || "").trim().toLowerCase();

    return (rows || []).filter((row) => {
      // global search: if provided, at least one visible column must match
      if (q) {
        const any = mappedColumns.some((col) => {
          const field = col.field;
          if (!field) return false;
          const raw = row?.[field];
          if (raw == null) return false;
          let s = raw instanceof Date ? raw.toISOString() : String(raw);
          return s.toLowerCase().includes(q);
        });
        if (!any) return false;
      }

      // column filters: all active column filters must match (AND semantics)
      for (const [field, v] of Object.entries(columnFilters || {})) {
        if (
          v == null ||
          v === "" ||
          (typeof v === "object" && !v.from && !v.to)
        )
          continue;
        const raw = row?.[field];
        if (raw == null) return false;

        // find column definition to get type
        const colDef = mappedColumns.find((c) => c.field === field) || {};
        const type = colDef.type || colDef._schemaType || "string";

        if (type === "date" || type === "dateTime" || type === "datetime") {
          const cellDate = raw instanceof Date ? raw : new Date(raw);
          if (Number.isNaN(cellDate.getTime())) return false;

          if (typeof v === "string" && v.trim() !== "") {
            // If the filter is a simple date string (YYYY-MM-DD), match by date portion
            if (/^\d{4}-\d{2}-\d{2}$/.test(v)) {
              if (cellDate.toISOString().slice(0, 10) !== v) return false;
            } else {
              // try parse exact datetime
              const target = new Date(v);
              if (!Number.isNaN(target.getTime())) {
                if (cellDate.getTime() !== target.getTime()) return false;
              } else {
                if (
                  !cellDate
                    .toISOString()
                    .toLowerCase()
                    .includes(String(v).toLowerCase())
                )
                  return false;
              }
            }
          } else if (typeof v === "object") {
            const from = v.from ? new Date(v.from) : null;
            const to = v.to ? new Date(v.to) : null;
            if (from && cellDate < from) return false;
            if (to && cellDate > to) return false;
          }
        } else {
          // text/number: simple substring match
          const needle = String(v).toLowerCase();
          const hay = raw instanceof Date ? raw.toISOString() : String(raw);
          if (!hay.toLowerCase().includes(needle)) return false;
        }
      }

      // multiFilters: additional ad-hoc filters (AND semantics)
      for (const f of multiFilters || []) {
        if (!f || !f.field || !f.operator) continue;
        const field = f.field;
        const v = f.value;
        const raw = row?.[field];
        if (raw == null) return false;

        const colDef = mappedColumns.find((c) => c.field === field) || {};
        const type = colDef.type || colDef._schemaType || "string";

        if (type === "date" || type === "dateTime" || type === "datetime") {
          const cellDate = raw instanceof Date ? raw : new Date(raw);
          if (Number.isNaN(cellDate.getTime())) return false;

          if (typeof v === "string" && v.trim() !== "") {
            if (/^\d{4}-\d{2}-\d{2}$/.test(v)) {
              if (cellDate.toISOString().slice(0, 10) !== v) return false;
            } else {
              const target = new Date(v);
              if (!Number.isNaN(target.getTime())) {
                if (cellDate.getTime() !== target.getTime()) return false;
              } else {
                if (
                  !cellDate
                    .toISOString()
                    .toLowerCase()
                    .includes(String(v).toLowerCase())
                )
                  return false;
              }
            }
          } else if (typeof v === "object") {
            const from = v.from ? new Date(v.from) : null;
            const to = v.to ? new Date(v.to) : null;
            if (from && cellDate < from) return false;
            if (to && cellDate > to) return false;
          }
        } else {
          // text/number: apply operator-specific matching
          const needle = String(v).toLowerCase();
          const hay = raw instanceof Date ? raw.toISOString() : String(raw);
          const hayLower = hay.toLowerCase();

          // Check operator and apply appropriate match logic
          const operator = f.operator || "contains";
          if (operator === "equals" || operator === "=") {
            // Exact match
            if (hayLower !== needle) return false;
          } else if (operator === "not equals" || operator === "!=") {
            // Inverse exact match
            if (hayLower === needle) return false;
          } else if (operator === "startsWith") {
            // Starts with
            if (!hayLower.startsWith(needle)) return false;
          } else if (operator === "endsWith") {
            // Ends with
            if (!hayLower.endsWith(needle)) return false;
          } else if (operator === ">" || operator === "<") {
            // Numeric comparison
            const numRaw = Number(raw);
            const numVal = Number(v);
            if (isNaN(numRaw) || isNaN(numVal)) return false;
            if (operator === ">" && !(numRaw > numVal)) return false;
            if (operator === "<" && !(numRaw < numVal)) return false;
          } else {
            // Default: "contains" - substring match
            if (!hayLower.includes(needle)) return false;
          }
        }
      }

      return true;
    });
  }, [rows, mappedColumns, searchText, columnFilters, multiFilters]);

  // number of rows visible on the current page (respecting current page and pageSize)
  const visibleRowsCount = useMemo(() => {
    const page = localPaginationModel?.page ?? 0;
    const pageSize =
      localPaginationModel?.pageSize ?? (pageSizeOptions?.[0] || 10);
    const start = page * pageSize;
    if (!filteredRows || filteredRows.length === 0) return 0;
    if (start >= filteredRows.length) return 0;
    return Math.min(pageSize, filteredRows.length - start);
  }, [filteredRows, localPaginationModel, pageSizeOptions]);

  // mark even rows (2nd, 4th, ...) so we can apply zebra styling
  const getRowClassName = (params) =>
    params.indexRelativeToCurrentPage % 2 === 1 ? "even-row" : "";

  return (
    <Paper sx={{ height: 400, width: "100%", maxWidth: "90vw" }}>
      <Box sx={theme.custom.dataTable.header}>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          {/* <IconButton
            size="small"
            startIcon={<AddIcon />}
            onClick={() => onAddRow && onAddRow()}
          >
            <AddIcon />
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
          </IconButton> */}
          <Typography
            variant="caption"
            sx={{
              // backgroundColor: theme.palette.grey[700],
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
              textTransform: "uppercase",
              fontSize: "0.65rem",
              fontWeight: 600,
            }}
          >
            Users
          </Typography>
        </Box>
        <Box
          sx={{
            minWidth: 180,
            display: "flex",
            justifyContent: "flex-end",
            gap: 1,
            alignItems: "center",
          }}
        >
          {/* <DynamicFormField
            field={{
              name: "_search",
              label: "",
              type: "text",
              placeholder: rest.searchPlaceholder || "Search...",
              inputWidth: "280px",
            }}
            value={searchText}
            onChange={(n, v) => setSearchText(v)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  aria-label="clear-search"
                  onClick={() => setSearchText("")}
                >
                  <CloseIcon />
                </IconButton>
              </InputAdornment>
            }
          /> */}
          <Tooltip title="Manage Search Fields" placement="top">
            <IconButton
              size="small"
              onClick={() => setShowColumnFilters((s) => !s)}
              aria-label="toggle-column-filters"
            >
              <BuildIcon />
            </IconButton>
          </Tooltip>

          <IconButton
            size="small"
            onClick={() => setShowColumnFilters((s) => !s)}
            aria-label="toggle-column-filters"
          >
            {/* <ArrowDropDownCircleIcon /> */}
            {showColumnFilters ? (
              <Tooltip title="Close Search" placement="top">
                <ExpandMoreIcon />
              </Tooltip>
            ) : (
              <Tooltip title="Expand Search" placement="top">
                <ExpandLessIcon />
              </Tooltip>
            )}
          </IconButton>
        </Box>
      </Box>
      <Collapse in={showColumnFilters}>
        <Box sx={theme.custom.dataTable.collapse}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            flexWrap="wrap"
            alignItems={{ xs: "center", sm: "flex-start" }}
            sx={theme.custom.dataTable.filtersStack}
          >
            {(searchSchema || []).map((f) => {
              const name = f.name;
              const normalizedType = (f.type || "text")
                .toString()
                .toLowerCase();
              const fieldDef = {
                name,
                label: f.label || name,
                type:
                  normalizedType === "datetime"
                    ? "datetime"
                    : normalizedType === "date"
                    ? "date"
                    : normalizedType,
                options: f.options || f.choices || f.valueOptions || [],
                inputWidth: f.inputWidth || "160px",
              };

              return (
                <Box
                  key={name}
                  sx={{
                    ...theme.custom.dataTable.filterFieldBox,
                    width: { xs: "100%", sm: fieldDef.inputWidth || 160 },
                  }}
                >
                  <DynamicFormField
                    field={fieldDef}
                    value={columnFilters[name] || ""}
                    onChange={(n, v) =>
                      setColumnFilters((prev) => ({ ...(prev || {}), [n]: v }))
                    }
                  />
                </Box>
              );
            })}
            {/* buttons moved below Stack for a new row */}
          </Stack>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
            <CommonButton
              size="small"
              variant="outlined"
              // startIcon={<ClearAllIcon />}
              sx={{ ml: 1 }}
              onClick={() => {
                setColumnFilters({});
                setSearchText("");
                if (typeof onSearch === "function") {
                  try {
                    onSearch({ searchText: "", filters: {} });
                  } catch (e) {
                    // eslint-disable-next-line no-console
                    console.error("onSearch handler error", e);
                  }
                }
              }}
            >
              Clear
            </CommonButton>
            <CommonButton
              size="small"
              variant="contained"
              onClick={() => {
                if (typeof onSearch === "function") {
                  try {
                    onSearch({ searchText, filters: columnFilters });
                  } catch (e) {
                    // eslint-disable-next-line no-console
                    console.error("onSearch handler error", e);
                  }
                } else {
                  // eslint-disable-next-line no-console
                  console.warn("DataTable: onSearch prop not provided");
                }
              }}
            >
              Search
            </CommonButton>
          </Box>
        </Box>
      </Collapse>
      <br></br>
      <Box sx={theme.custom.dataTable.toolbarOuter}>
        {/* Left: Action icons & text */}
        <Box sx={theme.custom.dataTable.toolbarLeft}>
          <Tooltip title="Selected count" placement="top">
            <IconButton aria-label="cart" size="small">
              <StyledBadge badgeContent={4} color="primary">
                <LibraryAddCheckIcon />
              </StyledBadge>
            </IconButton>
          </Tooltip>

          <Typography
            variant="caption"
            sx={{
              px: 1,
              py: 0.5,
              borderRadius: 1,
              fontSize: { xs: "0.7rem", sm: "0.85rem" },
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}
          >
            {visibleRowsCount.toLocaleString()} items
          </Typography>

          {/* Show only on md+ */}
          {/* {!isMobile && ( */}
          <>
            <Tooltip title="Show Selected" placement="top">
              <IconButton size="small" onClick={() => onAddRow && onAddRow()}>
                <GradingTwoToneIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Filters" placement="top">
              <IconButton
                size="small"
                onClick={openFilterPopover}
                aria-label="open-filters"
              >
                <StyledBadge badgeContent={multiFilters.length} color="primary">
                  <FilterAltOutlinedIcon />
                </StyledBadge>
              </IconButton>
            </Tooltip>
            <Tooltip title="Clear Filters" placement="top">
              <IconButton
                size="small"
                onClick={() => {
                  setMultiFilters([]);
                  setColumnFilters({});
                  setSearchText("");
                }}
              >
                <FilterAltOffTwoToneIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Reload" placement="top">
              <IconButton size="small" onClick={() => onAddRow && onAddRow()}>
                <CachedTwoToneIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Download" placement="top">
              <IconButton size="small" onClick={() => onAddRow && onAddRow()}>
                <CloudDownloadIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Upload" placement="top">
              <IconButton size="small" onClick={() => onAddRow && onAddRow()}>
                <CloudUploadIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Audit trail" placement="top">
              <IconButton size="small" onClick={checkIt}>
                <VisibilityIcon />
              </IconButton>
            </Tooltip>
          </>
          {/* )} */}

          <Tooltip title="Add" placement="top">
            <IconButton size="small" onClick={() => onAddRow && onAddRow()}>
              <AddIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Selected" placement="top">
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
          </Tooltip>
        </Box>

        {/* Right: Search & settings */}
        <Box sx={theme.custom.dataTable.toolbarRight}>
          <Box sx={{ flex: { xs: 1, sm: "auto" }, minWidth: 0 }}>
            <DynamicFormField
              field={{
                name: "_search",
                label: "",
                type: "text",
                placeholder: rest.searchPlaceholder || "Search...",
                inputWidth: "100%",
              }}
              value={searchText}
              onChange={(n, v) => setSearchText(v)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    aria-label="clear-search"
                    onClick={() => setSearchText("")}
                  >
                    <Tooltip title="Clear Search" placement="top">
                      <CloseIcon />
                    </Tooltip>
                  </IconButton>
                </InputAdornment>
              }
            />
          </Box>
          <Tooltip title="Manage Columns" placement="top">
            <IconButton
              size="small"
              onClick={() => setShowColumnFilters((s) => !s)}
              aria-label="toggle-column-filters"
            >
              <BuildIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Popover
        open={filterOpen}
        anchorEl={filterAnchorEl}
        onClose={cancelFilterPopover}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Box
          sx={{
            p: 2,
            width: 600,
            maxWidth: "90vw",
            backgroundColor: "#2a53a430",
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Add filter
          </Typography>
          <Box
            sx={{ display: "flex", gap: 1, justifyContent: "flex-end", mb: 1 }}
          >
            <TextField
              select
              size="small"
              label="Column"
              value={tempFilter.field}
              onChange={(e) => {
                const f = e.target.value;
                setTempFilter({ field: f, operator: "", value: "" });
              }}
              fullWidth
              sx={{ mb: 1 }}
            >
              {(mappedColumns || []).map((c) =>
                c.field ? (
                  <MenuItem key={c.field} value={c.field}>
                    {c.headerName || c.field}
                  </MenuItem>
                ) : null
              )}
            </TextField>

            <TextField
              select
              size="small"
              label="Operator"
              value={tempFilter.operator}
              onChange={(e) =>
                setTempFilter((p) => ({
                  ...p,
                  operator: e.target.value,
                  value: "",
                }))
              }
              fullWidth
              sx={{ mb: 1 }}
              disabled={!tempFilter.field}
            >
              {(
                operatorOptionsForType(getColByField(tempFilter.field)?.type) ||
                []
              ).map((op) => (
                <MenuItem key={op} value={op}>
                  {op}
                </MenuItem>
              ))}
            </TextField>

            {/* Value input (single or between) */}
            {tempFilter.operator === "between" ? (
              <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                <TextField
                  size="small"
                  label="From"
                  value={tempFilter.value?.from || ""}
                  onChange={(e) =>
                    setTempFilter((p) => ({
                      ...p,
                      value: { ...(p.value || {}), from: e.target.value },
                    }))
                  }
                  fullWidth
                />
                <TextField
                  size="small"
                  label="To"
                  value={tempFilter.value?.to || ""}
                  onChange={(e) =>
                    setTempFilter((p) => ({
                      ...p,
                      value: { ...(p.value || {}), to: e.target.value },
                    }))
                  }
                  fullWidth
                />
              </Box>
            ) : (
              <TextField
                size="small"
                label="Value"
                value={tempFilter.value || ""}
                onChange={(e) =>
                  setTempFilter((p) => ({ ...p, value: e.target.value }))
                }
                fullWidth
                sx={{ mb: 1 }}
                disabled={!tempFilter.operator}
              />
            )}
            {/* <Button
              size="small"
              variant="outlined"
              onClick={() => {
                addTempFilter();
              }}
              disabled={!tempFilter.field || !tempFilter.operator}
            >
              <AddIcon />
            </Button> */}
            <Tooltip title="Add" placement="top">
              <IconButton
                size="small"
                onClick={() => {
                  addTempFilter();
                }}
                disabled={!tempFilter.field || !tempFilter.operator}
                aria-label="add filter"
              >
                <AddIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Reset">
              <IconButton
                size="small"
                variant="outlined"
                disabled={
                  !tempFilter.field && !tempFilter.operator && !tempFilter.value
                }
                onClick={() => {
                  setTempFilter({ field: "", operator: "", value: "" });
                }}
              >
                <RestartAltIcon />
              </IconButton>
            </Tooltip>
          </Box>

          {/* <Box
            sx={{ display: "flex", gap: 1, justifyContent: "flex-end", mb: 1 }}
          >
            <Tooltip title="Clear All">
              <IconButton
                size="small"
                variant="outlined"
                onClick={() => setStagedFilters([])}
              >
                <ClearAllIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Done">
              <IconButton
                size="small"
                variant="contained"
                onClick={commitFilterPopover}
              >
                <DoneIcon />
              </IconButton>
            </Tooltip> */}

          {/* <Button
              size="small"
              variant="outlined"
              onClick={() => setMultiFilters([])}
            >
              Clear All
            </Button> */}
          {/* <Button
              size="small"
              variant="contained"
              onClick={closeFilterPopover}
            >
              Done
            </Button> */}
          {/* <Button
              size="small"
              variant="outlined"
              onClick={() => {
                setTempFilter({ field: "", operator: "", value: "" });
              }}
            >
              Reset
            </Button> */}
          {/* <Button
              size="small"
              variant="contained"
              onClick={() => {
                addTempFilter();
              }}
              disabled={!tempFilter.field || !tempFilter.operator}
            >
              Add
            </Button> */}
          {/* </Box> */}

          <Divider sx={{ my: 1 }} />

          <Typography variant="caption">Staged filters</Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
            {stagedFilters == null || stagedFilters.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                (None)
              </Typography>
            ) : null}
            {(stagedFilters || []).map((f, i) => {
              const col = getColByField(f.field);
              const label = `${col?.headerName || f.field} ${f.operator} ${
                typeof f.value === "object"
                  ? `${f.value.from || ""} - ${f.value.to || ""}`
                  : f.value
              }`;
              return (
                <Chip
                  key={i}
                  label={label}
                  size="small"
                  onDelete={() => removeStagedFilter(i)}
                />
              );
            })}
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              justifyContent: "flex-end",
              mb: 1,
            }}
          >
            <Tooltip title="Clear All">
              <IconButton
                size="small"
                variant="outlined"
                onClick={() => {
                  setStagedFilters([]);
                  setMultiFilters([]);
                  setColumnFilters({});
                  setSearchText("");
                  setTempFilter({ field: "", operator: "", value: "" });
                }}
              >
                <ClearAllIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Apply filter">
              <IconButton
                size="small"
                variant="contained"
                onClick={commitFilterPopover}
              >
                <DoneIcon />
              </IconButton>
            </Tooltip>
          </Box>

          {/* <Box
            sx={{ display: "flex", gap: 1, justifyContent: "flex-end", mt: 2 }}
          >
            <Button
              size="small"
              variant="outlined"
              onClick={() => setMultiFilters([])}
            >
              Clear All
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={closeFilterPopover}
            >
              Done
            </Button>
          </Box> */}
        </Box>
      </Popover>

      <DataGrid
        rows={filteredRows}
        columns={mappedColumns}
        rowHeight={38}
        headerHeight={50}
        showToolbar
        // filterModel={filterModel}
        pagination
        paginationModel={localPaginationModel}
        onPaginationModelChange={(model) =>
          setLocalPaginationModel({
            page: model.page,
            pageSize: Math.min(model.pageSize, MAX_MIT_PAGE_SIZE),
          })
        }
        selectionModel={selectionModel}
        onSelectionModelChange={(newModel) => setSelectionModel(newModel)}
        initialState={initialState}
        pageSizeOptions={safePageSizeOptions}
        checkboxSelection={checkboxSelection}
        sx={{
          border: 0,
          ...(sx || {}),
          "& .MuiDataGrid-columnHeaders, & .MuiDataGrid-columnHeader, & .MuiDataGrid-columnHeaderTitle":
            {
              backgroundColor: "#ffffff",
              color: "#1976d2",
            },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: 600,
          },
          // zebra for even rows: apply background to all cells in the row
          // "& .MuiDataGrid-row.even-row .MuiDataGrid-cell": {
          //   backgroundColor: rowEvenBg,
          // },
          "& .MuiDataGrid-row:nth-child(odd)": {
            backgroundColor: rowEvenBg,
          },
        }}
        experimentalFeatures={{ columnResizing: true }}
        getRowClassName={getRowClassName}
        {...rest}
        // disableRowSelectionOnClick
      />
    </Paper>
  );
}
