import React, { useState, useRef, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Paper,
  TextField,
  Box,
  IconButton,
  Checkbox,
  Stack,
  Tooltip,
  Grid,
} from "@mui/material";
import CommonButton from "./CommonButton";
import { useTheme } from "@mui/material/styles";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import DynamicFormDialog from "./DynamicFormDialog";
import DynamicFormField from "./DynamicFormField";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import InputAdornment from "@mui/material/InputAdornment";

export default function CommonDataTable({
  columns,
  rows,
  onRowClick,
  createSchema = [],
  onCreate,
  onEditRow,
  onDeleteRow,
  onBulkDelete,
  searchPlaceholder = "Search...",
  pageSize = 10,
}) {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pageSize);
  // sortArray: [{ id: columnId, direction: 'asc'|'desc' }, ...]
  // Initialize sortArray only when a column explicitly requests default sorting
  const computeInitialSortArray = (cols) => {
    if (!cols || cols.length === 0) return [];
    const explicit = cols.find(
      (c) =>
        c.defaultSort === true ||
        c.defaultSort === "asc" ||
        c.defaultSort === "desc"
    );
    if (explicit) {
      const ds = explicit.defaultSort;
      const dir = ds === "desc" ? "desc" : "asc"; // true or 'asc' => asc
      return [{ id: explicit.id, direction: dir }];
    }
    return [];
  };

  const [sortArray, setSortArray] = useState(() =>
    computeInitialSortArray(columns)
  );

  useEffect(() => {
    // If columns change and no sort is active, re-evaluate default sort
    if ((!sortArray || sortArray.length === 0) && columns) {
      const initial = computeInitialSortArray(columns);
      if (initial && initial.length) setSortArray(initial);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns]);

  const [showFilters, setShowFilters] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [selected, setSelected] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFields, setEditFields] = useState([]);
  const [editTitle, setEditTitle] = useState("Edit");
  const [searchInputs, setSearchInputs] = useState(
    columns.reduce((acc, col) => ({ ...acc, [col.id]: "" }), {})
  );
  const [activeSearch, setActiveSearch] = useState(
    columns.reduce((acc, col) => ({ ...acc, [col.id]: "" }), {})
  );
  // columnFilters stores operator + value: { [colId]: { operator: 'LIKE', value: '' } }
  const [columnFilters, setColumnFilters] = useState(
    columns.reduce(
      (acc, col) => ({ ...acc, [col.id]: { operator: "LIKE", value: "" } }),
      {}
    )
  );

  // Filter builder panel state (single filter builder similar to search panel)
  const [filterField, setFilterField] = useState(columns?.[0]?.id || "");
  const [filterOperator, setFilterOperator] = useState("EQ");
  const [filterValue, setFilterValue] = useState("");

  // Ensure filter builder defaults update when columns change
  useEffect(() => {
    setFilterField(columns?.[0]?.id || "");
    setFilterOperator("EQ");
    setFilterValue("");
    // also initialize columnFilters structure when columns change
    setColumnFilters(
      columns.reduce(
        (acc, col) => ({ ...acc, [col.id]: { operator: "LIKE", value: "" } }),
        {}
      )
    );
    // clear selection when columns/rows change
    setSelected([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns]);

  // Header ref (kept for anchoring header row)
  const headerRef = useRef(null);

  // Filter rows based on column-specific search terms
  const filteredRows = rows.filter((row) => {
    // Apply column-specific filters (support operators)
    const columnFiltersPassed = columns.every((col) => {
      const entry = columnFilters[col.id];
      if (!entry) return true;
      const op = entry.operator || "LIKE";
      const v = entry.value;
      if (!v && op !== "IS_NULL" && op !== "IS_NOT_NULL") return true;

      const cellValue = row[col.id];
      const toStr = (x) => (x === null || x === undefined ? "" : String(x));

      const colType = String(col?.type || "").toLowerCase();
      const isDateLike =
        colType.includes("date") || colType.includes("datetime");

      switch (op) {
        case "IS_NULL":
          return (
            cellValue === null ||
            cellValue === undefined ||
            toStr(cellValue) === ""
          );
        case "IS_NOT_NULL":
          return !(
            cellValue === null ||
            cellValue === undefined ||
            toStr(cellValue) === ""
          );
        case "EQ":
          return toStr(cellValue) === toStr(v);
        case "NEQ":
          return toStr(cellValue) !== toStr(v);
        case "LIKE":
          return toStr(cellValue)
            .toLowerCase()
            .includes(toStr(v).toLowerCase());
        case "IN": {
          const parts = toStr(v)
            .split(",")
            .map((s) => s.trim().toLowerCase());
          return parts.includes(toStr(cellValue).toLowerCase());
        }
        case "NOT_IN": {
          const parts = toStr(v)
            .split(",")
            .map((s) => s.trim().toLowerCase());
          return !parts.includes(toStr(cellValue).toLowerCase());
        }
        case "BETWEEN": {
          const parts = toStr(v)
            .split(",")
            .map((s) => s.trim());
          if (parts.length < 2) return false;
          if (isDateLike) {
            const a = Date.parse(parts[0]);
            const b = Date.parse(parts[1]);
            const num = Date.parse(cellValue);
            if (isNaN(a) || isNaN(b) || isNaN(num)) return false;
            return num >= Math.min(a, b) && num <= Math.max(a, b);
          }
          // fallback numeric
          const a = Number(parts[0]);
          const b = Number(parts[1]);
          const num = Number(cellValue);
          if (isNaN(a) || isNaN(b) || isNaN(num)) return false;
          return num >= Math.min(a, b) && num <= Math.max(a, b);
        }
        case "GT":
          if (isDateLike) return Date.parse(cellValue) > Date.parse(v);
          return Number(cellValue) > Number(v);
        case "GTE":
          if (isDateLike) return Date.parse(cellValue) >= Date.parse(v);
          return Number(cellValue) >= Number(v);
        case "LT":
          if (isDateLike) return Date.parse(cellValue) < Date.parse(v);
          return Number(cellValue) < Number(v);
        default:
          return true;
      }
    });

    // Apply search exact match (only if search is active and values entered)
    const hasSearchTerms = Object.values(activeSearch).some(
      (v) => v.trim() !== ""
    );
    if (!hasSearchTerms) return columnFiltersPassed;

    const searchPassed = columns.every((col) => {
      const searchValue = activeSearch[col.id];
      if (!searchValue.trim()) return true; // No search term for this column
      const cellValue = row[col.id];
      return (
        cellValue && cellValue.toString() === searchValue // Exact match
      );
    });

    return columnFiltersPassed && searchPassed;
  });

  // Multi-sort rows using sortArray (priority order)
  const sortedRows = [...filteredRows].sort((a, b) => {
    if (!sortArray || sortArray.length === 0) return 0;

    for (let s of sortArray) {
      const id = s.id;
      const dir = s.direction || "asc";
      const aValue = a[id];
      const bValue = b[id];

      if (aValue === bValue) continue;

      // handle null/undefined
      if (aValue == null) return dir === "asc" ? 1 : -1;
      if (bValue == null) return dir === "asc" ? -1 : 1;

      if (typeof aValue === "string") {
        const cmp = aValue.localeCompare(bValue);
        if (cmp !== 0) return dir === "asc" ? cmp : -cmp;
        continue;
      }

      if (typeof aValue === "number" || typeof aValue === "boolean") {
        if (aValue > bValue) return dir === "asc" ? 1 : -1;
        if (aValue < bValue) return dir === "asc" ? -1 : 1;
        continue;
      }

      // fallback string compare
      const cmp = String(aValue).localeCompare(String(bValue));
      if (cmp !== 0) return dir === "asc" ? cmp : -cmp;
    }

    return 0;
  });

  // Paginate rows
  const paginatedRows = sortedRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Selection handlers (checkbox column)
  const isRowSelected = (id) => selected.includes(id);
  const handleToggleSelect = (id) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      return [...prev, id];
    });
  };

  const handleSelectAllOnPage = (checked) => {
    if (checked) {
      const ids = paginatedRows.map((r) => r.id).filter((x) => x !== undefined);
      // merge unique
      setSelected((prev) => Array.from(new Set([...prev, ...ids])));
    } else {
      const ids = paginatedRows.map((r) => r.id).filter((x) => x !== undefined);
      setSelected((prev) => prev.filter((id) => !ids.includes(id)));
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Click header to cycle: asc -> desc -> remove
  // Shift+click to add/remove from multi-sort priority
  const handleSort = (event, columnId) => {
    const isShift = !!event.shiftKey;
    const existingIndex = sortArray.findIndex((s) => s.id === columnId);

    // helper to cycle direction: undefined -> asc -> desc -> removed(undefined)
    const nextDirection = (current) => {
      if (!current) return "asc";
      if (current === "asc") return "desc";
      return undefined; // remove
    };

    if (isShift) {
      // multi-sort: update/add/remove while preserving other priorities
      const existing = sortArray[existingIndex];
      const dir = nextDirection(existing?.direction);
      let next = [...sortArray];
      if (existing) {
        if (dir) {
          next[existingIndex] = { id: columnId, direction: dir };
        } else {
          next.splice(existingIndex, 1);
        }
      } else {
        // add to end
        next.push({ id: columnId, direction: dir });
      }
      setSortArray(next);
    } else {
      // single-column sort (reset others)
      const existing = sortArray[existingIndex];
      const dir = nextDirection(existing?.direction);
      if (dir) {
        setSortArray([{ id: columnId, direction: dir }]);
      } else {
        setSortArray([]);
      }
    }
  };

  const handleFilterChange = (columnId, value, operator = undefined) => {
    setColumnFilters((prev) => ({
      ...prev,
      [columnId]: {
        operator: operator || prev[columnId]?.operator || "LIKE",
        value,
      },
    }));
    setPage(0); // Reset to first page on filter
  };

  // Generate tooltip content from specified fields
  const getTooltipContent = (row, column) => {
    if (!column.tooltipFields || column.tooltipFields.length === 0) {
      return null;
    }

    const tooltipLines = column.tooltipFields.map((fieldId) => {
      const fieldLabel =
        columns.find((col) => col.id === fieldId)?.label || fieldId;
      const fieldValue = row[fieldId] || "-";
      return `${fieldLabel}: ${fieldValue}`;
    });

    return tooltipLines.join("\n");
  };

  // Helpers for dynamic operators & input types based on selected column
  const findColumnById = (id) => columns.find((c) => c.id === id) || {};

  const getOperatorsForColumn = (col) => {
    const t = (col && col.type) || "string";
    if (!col) return ["EQ", "NEQ", "LIKE", "IN", "NOT_IN"];
    const numTypes = ["number", "int", "float", "integer"];
    const dateTypes = ["date", "datetime", "datetimerange", "daterange"];
    if (numTypes.includes(String(t).toLowerCase())) {
      return ["EQ", "NEQ", "GT", "GTE", "LT", "LTE"];
    }
    if (dateTypes.includes(String(t).toLowerCase())) {
      return ["EQ", "NEQ", "GT", "GTE", "LT", "LTE", "BETWEEN"];
    }
    if (String(t).toLowerCase() === "boolean") {
      return ["EQ", "NEQ"];
    }
    // default: string-like
    return ["EQ", "NEQ", "LIKE", "IN", "NOT_IN"];
  };

  const currentFilterColumn = findColumnById(filterField);
  const operatorOptions = getOperatorsForColumn(currentFilterColumn);
  // Determine value input type for the filter value field.
  // If operator is BETWEEN and column is date/datetime, use daterange/datetimerange.
  const valueInputType = (() => {
    const t = (currentFilterColumn && currentFilterColumn.type) || "text";
    if (filterOperator === "BETWEEN") {
      if (String(t).toLowerCase() === "date") return "daterange";
      if (String(t).toLowerCase() === "datetime") return "datetimerange";
    }
    return t || "text";
  })();

  return (
    <Box>
      {/* Filter & Search Toggle Buttons */}
      <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
        <Box
          sx={{
            borderRadius: 1,
            backgroundColor: "#58535158",
          }}
        >
          <Tooltip title={showFilters ? "Hide filters" : "Show filters"}>
            <IconButton
              onClick={() => {
                if (showFilters) {
                  // Clear filters when hiding
                  setColumnFilters(
                    columns.reduce((acc, col) => ({ ...acc, [col.id]: "" }), {})
                  );
                }
                setShowFilters(!showFilters);
              }}
              color={showFilters ? "primary" : "default"}
              size="small"
            >
              <FilterListIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={showFilter ? "Hide Filter" : "Show Filter"}>
            <IconButton
              onClick={() => {
                if (showFilter) {
                  // Clear filters and filter UI when hiding the filter panel
                  setColumnFilters(
                    columns.reduce(
                      (acc, col) => ({
                        ...acc,
                        [col.id]: { operator: "LIKE", value: "" },
                      }),
                      {}
                    )
                  );
                  setFilterValue("");
                  setFilterOperator("EQ");
                  setFilterField(columns?.[0]?.id || "");
                  setPage(0);
                }
                setShowFilter(!showFilter);
              }}
              color={showFilter ? "primary" : "default"}
              size="small"
            >
              <FilterAltOutlinedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={showSearch ? "Hide search" : "Show search"}>
            <IconButton
              onClick={() => {
                if (showSearch) {
                  // Clear search when hiding
                  const cleared = columns.reduce(
                    (acc, col) => ({ ...acc, [col.id]: "" }),
                    {}
                  );
                  setSearchInputs(cleared);
                  setActiveSearch(cleared);
                }
                setShowSearch(!showSearch);
              }}
              color={showSearch ? "primary" : "default"}
              size="small"
            >
              <SearchIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={showAdd ? "Hide Add" : "Close Add"}>
            <IconButton
              onClick={() => setShowAdd(true)}
              color={showAdd ? "primary" : "default"}
              size="small"
            >
              <AddOutlinedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip
            title={
              selected && selected.length > 0
                ? `Delete selected (${selected.length})`
                : "Select rows to enable bulk delete"
            }
          >
            <span>
              <IconButton
                onClick={() => {
                  if (!selected || selected.length === 0) return;
                  if (
                    !window.confirm(`Delete ${selected.length} selected rows?`)
                  )
                    return;

                  if (typeof onBulkDelete === "function") {
                    onBulkDelete(selected);
                  } else if (typeof onDeleteRow === "function") {
                    // fallback: call per-row delete handler
                    selected.forEach((id) => {
                      const row = rows.find((r) => r.id === id);
                      if (row) onDeleteRow(row);
                    });
                  } else {
                    // no handler provided
                    // eslint-disable-next-line no-console
                    console.warn("No bulk delete handler provided");
                  }

                  setSelected([]);
                  setPage(0);
                }}
                color={selected && selected.length > 0 ? "error" : "default"}
                size="small"
                disabled={!selected || selected.length === 0}
              >
                <DeleteIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </Box>

      {/* Advanced Search Panel - All columns with exact match */}
      {showSearch && (
        <Box
          sx={{
            mb: 2,
            p: 2,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
            backgroundColor: theme.palette.background.default,
          }}
        >
          <Grid container spacing={1.5} sx={{ mb: 2 }}>
            {columns
              .filter(
                (column) =>
                  column.type !== "checkbox" && column.type !== "actions"
              )
              .map((column) => (
                <Grid item xs={12} sm={6} md={4} key={`search-${column.id}`}>
                  <TextField
                    label={column.label}
                    variant="outlined"
                    size="small"
                    placeholder={`Exact match for ${column.label}`}
                    value={searchInputs[column.id]}
                    onChange={(e) =>
                      setSearchInputs((prev) => ({
                        ...prev,
                        [column.id]: e.target.value,
                      }))
                    }
                    fullWidth
                  />
                </Grid>
              ))}
          </Grid>

          <Box sx={{ display: "flex", gap: 1 }}>
            <CommonButton
              variant="contained"
              color="primary"
              onClick={() => {
                // Apply search values on button click
                setActiveSearch(searchInputs);
                setPage(0);
              }}
            >
              Search
            </CommonButton>
            <CommonButton
              variant="outlined"
              onClick={() => {
                // Clear both inputs and active search
                const cleared = columns.reduce(
                  (acc, col) => ({ ...acc, [col.id]: "" }),
                  {}
                );
                setSearchInputs(cleared);
                setActiveSearch(cleared);
                setPage(0);
              }}
            >
              Clear All
            </CommonButton>
          </Box>
        </Box>
      )}

      {/* Filter builder panel - inline, same style as search */}
      {showFilter && (
        <Box
          sx={{
            mb: 2,
            p: 2,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
            backgroundColor: theme.palette.background.default,
          }}
        >
          <Grid container spacing={1.5} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={4} md={4}>
              <DynamicFormField
                field={{
                  name: "filterField",
                  label: "Field",
                  type: "select",
                  inputWidth: "220px",
                  options: columns.map((c) => ({
                    value: c.id,
                    label: c.label,
                  })),
                }}
                value={filterField}
                onChange={(_, v) => {
                  const newField = v;
                  setFilterField(newField);
                  // update operator to a sensible default for the new field
                  const col = columns.find((c) => c.id === newField) || {};
                  const ops = getOperatorsForColumn(col);
                  setFilterOperator(ops && ops.length ? ops[0] : "LIKE");
                  // If the column has predefined options, default the filter value
                  if (
                    col.options &&
                    Array.isArray(col.options) &&
                    col.options.length > 0
                  ) {
                    const first = col.options[0];
                    setFilterValue(
                      first && first.value !== undefined ? first.value : first
                    );
                  } else {
                    setFilterValue("");
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={4} md={4}>
              <DynamicFormField
                field={{
                  name: "filterOperator",
                  label: "Operator",
                  type: "select",
                  inputWidth: "220px",
                  options: operatorOptions.map((op) => ({
                    value: op,
                    label: op,
                  })),
                }}
                value={filterOperator}
                onChange={(_, op) => {
                  setFilterOperator(op);
                  if (op === "IS_NULL" || op === "IS_NOT_NULL")
                    setFilterValue("");
                }}
              />
            </Grid>

            <Grid item xs={12} sm={4} md={4}>
              {
                // Use DynamicFormField so filter value input matches form fields
              }
              <DynamicFormField
                field={{
                  name: filterField,
                  label:
                    columns.find((c) => c.id === filterField)?.label ||
                    filterField,
                  type: valueInputType,
                  options:
                    columns.find((c) => c.id === filterField)?.options || [],
                  placeholder:
                    valueInputType === "daterange" ||
                    valueInputType === "datetimerange"
                      ? undefined
                      : filterOperator === "BETWEEN"
                      ? "start,end"
                      : filterOperator === "IN" || filterOperator === "NOT_IN"
                      ? "comma separated"
                      : undefined,
                }}
                value={filterValue}
                onChange={(_, v) => setFilterValue(v)}
                disabled={
                  filterOperator === "IS_NULL" ||
                  filterOperator === "IS_NOT_NULL"
                }
              />
            </Grid>
          </Grid>

          <Box sx={{ display: "flex", gap: 1 }}>
            <CommonButton
              variant="contained"
              color="primary"
              onClick={() => {
                handleFilterChange(filterField, filterValue, filterOperator);
              }}
            >
              Apply
            </CommonButton>
            
            <CommonButton
              variant="outlined"
              onClick={() => {
                setColumnFilters(
                  columns.reduce(
                    (acc, col) => ({
                      ...acc,
                      [col.id]: { operator: "LIKE", value: "" },
                    }),
                    {}
                  )
                );
                setFilterValue("");
                setPage(0);
              }}
            >
              Clear All
            </CommonButton>
          </Box>
        </Box>
      )}

      {/* Table */}
      <TableContainer
        component={Paper}
        sx={{
          maxHeight: "calc(10 * 36px + 57px)", // 10 rows (36px each) + header (57px)
          maxWidth: "91vw !important",
        }}
      >
        <Table size="small" stkyHeader>
          <TableHead>
            <TableRow
              ref={headerRef}
              sx={{
                backgroundColor: "#2b88ea !important",
                
                height: 20,
                position: "sticky",
                top: 0,
                zIndex: 10,
                "& .MuiTableCell-head": {
                  backgroundColor: "transparent !important",
                  backgroundImage: "none !important",
                },
                // show dividers only on header hover and use theme divider color
                "&:hover > .MuiTableCell-root": {
                  borderRight: `1px solid ${theme.palette.divider}`,
                },
                // also apply to body cells when header is hovered
                "&:hover ~ .MuiTableBody-root .MuiTableCell-root": {
                  borderRight: `1px solid ${theme.palette.divider}`,
                },
              }}
            >
              {columns.map((column, colIndex) => {
                const sortEntry = sortArray.find((s) => s.id === column.id);
                return (
                  <TableCell
                    key={column.id}
                    align="left"
                    sx={{
                      padding: "8px 4px",
                      width: column.width || "auto",
                      maxWidth: column.maxWidth
                        ? `${column.maxWidth}px`
                        : "240px",
                      color: theme.palette.common.white,
                      fontWeight: 700,
                      backgroundColor: "transparent",
                      borderBottom: "none",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      borderRight: "none",
                    }}
                  >
                    {column.type === "checkbox" ? (
                      // header checkbox (select all on page)
                      <Checkbox
                        color="default"
                        size="small"
                        checked={
                          paginatedRows.length > 0 &&
                          paginatedRows.every((r) => selected.includes(r.id))
                        }
                        indeterminate={
                          paginatedRows.some((r) => selected.includes(r.id)) &&
                          !paginatedRows.every((r) => selected.includes(r.id))
                        }
                        onChange={(e) =>
                          handleSelectAllOnPage(e.target.checked)
                        }
                        sx={{ color: theme.palette.common.white }}
                      />
                    ) : column.sortable ? (
                      <Tooltip title={column.label} arrow placement="top">
                        <TableSortLabel
                          active={!!sortEntry}
                          direction={sortEntry?.direction || "asc"}
                          onClick={(e) => handleSort(e, column.id)}
                          sx={{
                            color: theme.palette.common.white,
                            "&.Mui-active": {
                              color: theme.palette.common.white,
                            },
                            "& .MuiTableSortLabel-icon": {
                              color: `${theme.palette.common.white} !important`,
                            },
                          }}
                        >
                          <Box
                            component="span"
                            sx={{
                              display: "inline-block",
                              maxWidth: column.maxWidth
                                ? `${column.maxWidth - 32}px`
                                : "200px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              color: theme.palette.common.white,
                            }}
                          >
                            {column.label}
                          </Box>
                        </TableSortLabel>
                      </Tooltip>
                    ) : (
                      <Tooltip title={column.label} arrow placement="bottom">
                        <Box
                          component="span"
                          sx={{
                            display: "inline-block",
                            maxWidth: column.maxWidth
                              ? `${column.maxWidth - 8}px`
                              : "200px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            color: theme.palette.common.white,
                          }}
                        >
                          {column.label}
                        </Box>
                      </Tooltip>
                    )}
                    
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      
                      {showFilters &&
                        column.type !== "checkbox" &&
                        column.type !== "actions" && (
                          <TextField
                            size="small"
                            placeholder={column.label}
                            variant="outlined"
                            value={columnFilters[column.id]?.value || ""}
                            onChange={(e) =>
                              handleFilterChange(column.id, e.target.value)
                            }
                            sx={{ width: "200px" }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    size="small"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // Handle additional icon click
                                    }}
                                  >
                                    <FilterAltOutlinedIcon fontSize="small" />
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                    </Box>
                  </TableCell>
                );
              })}
            </TableRow>
            
          </TableHead>
          <TableBody>
            {paginatedRows.map((row, index) => (
              <TableRow
                key={index}
                onClick={() => onRowClick?.(row)}
                sx={{
                  cursor: onRowClick ? "pointer" : "default",
                  // background:index % 2 === 0 ? "linear-gradient(90deg, rgba(23,99,157,0.4) 0%, rgba(59,129,246,0.12) 100%)" : theme.palette.action.hover,
                  background: index % 2 === 0 ? "#ffffffff" : "#5853511f",

                  "&:hover": onRowClick
                    ? {
                        backgroundColor: "#d3e3fd !important",

                        transition: "background-color 0.2s ease",
                      }
                    : {},
                  height: 36,
                }}
              >
                {columns.map((column, colIndex) => {
                  const tooltipContent = getTooltipContent(row, column);
                  return (
                    <TableCell
                      key={column.id}
                      align="left"
                      sx={{
                        padding: "4px",
                        borderRight: "none",
                      }}
                    >
                      {column.type === "checkbox" ? (
                        <Checkbox
                          size="small"
                          checked={isRowSelected(row.id)}
                          onChange={() => handleToggleSelect(row.id)}
                        />
                      ) : column.type === "actions" ? (
                        <Stack direction="row" spacing={1}>
                          {column.actions?.includes("edit") && (
                            <Tooltip title="Edit">
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Prefer using createSchema for edit dialog so Create and
                                  // Edit share the same form layout. Fall back to columns
                                  // if createSchema is not provided.
                                  if (createSchema && createSchema.length > 0) {
                                    const fields = createSchema.map((f) => ({
                                      ...f,
                                      defaultValue:
                                        row[f.name] !== undefined
                                          ? row[f.name]
                                          : row[f.id] !== undefined
                                          ? row[f.id]
                                          : f.defaultValue,
                                      disabled:
                                        f.name === "id" ||
                                        f.name === "ID" ||
                                        f.disabled,
                                    }));

                                    if (
                                      !fields.some((ff) => ff.name === "id")
                                    ) {
                                      fields.unshift({
                                        name: "id",
                                        label: "ID",
                                        type: "number",
                                        defaultValue: row.id,
                                        disabled: true,
                                        width: 12,
                                        inputWidth: "100%",
                                      });
                                    }

                                    setEditFields(fields);
                                    setEditTitle("Edit");
                                    setEditDialogOpen(true);
                                    return;
                                  }

                                  // Fallback: build from columns
                                  const fields = columns
                                    .filter(
                                      (c) =>
                                        c.type !== "checkbox" &&
                                        c.type !== "actions"
                                    )
                                    .map((c) => ({
                                      name: c.id,
                                      label: c.label,
                                      type: c.type || "text",
                                      options: c.options || c.enum || [],
                                      width: c.width || 6,
                                      inputWidth: c.inputWidth || "100%",
                                      defaultValue:
                                        row[c.id] !== undefined &&
                                        row[c.id] !== null
                                          ? row[c.id]
                                          : c.defaultValue !== undefined
                                          ? c.defaultValue
                                          : "",
                                      disabled:
                                        c.id === "id" ||
                                        c.id === "ID" ||
                                        c.disabled,
                                    }));

                                  if (!fields.some((ff) => ff.name === "id")) {
                                    fields.unshift({
                                      name: "id",
                                      label: "ID",
                                      type: "number",
                                      defaultValue: row.id,
                                      disabled: true,
                                      width: 12,
                                      inputWidth: "100%",
                                    });
                                  }

                                  setEditFields(fields);
                                  setEditTitle("Edit");
                                  setEditDialogOpen(true);
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          {column.actions?.includes("delete") && (
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteRow?.(row);
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Stack>
                      ) : (
                        <Tooltip
                          title={tooltipContent || ""}
                          arrow
                          disableHoverListener={!tooltipContent}
                          placement="right"
                          componentsProps={{
                            tooltip: {
                              sx: {
                                backgroundColor: "#074a7dc2",
                                color: "#fff",
                                fontSize: "12px",
                                padding: "8px 12px",
                                borderRadius: "4px",
                                whiteSpace: "pre-line",
                                lineHeight: "1.8",
                                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                              },
                            },
                            arrow: {
                              sx: {
                                color: "#333",
                              },
                            },
                          }}
                        >
                          <span
                            style={{
                              cursor: tooltipContent ? "help" : "default",
                            }}
                          >
                            {row[column.id] || "-"}
                          </span>
                        </Tooltip>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create dialog (opens when + is clicked) */}
      <DynamicFormDialog
        open={!!showAdd}
        fields={createSchema || []}
        title="Create"
        onClose={() => setShowAdd(false)}
        onSubmit={(values) => {
          try {
            onCreate?.(values);
          } finally {
            setShowAdd(false);
          }
        }}
      />

      {/* Edit dialog (opens when edit action clicked) */}
      <DynamicFormDialog
        open={!!editDialogOpen}
        fields={editFields || []}
        title={editTitle}
        submitLabel="Save"
        onClose={() => setEditDialogOpen(false)}
        onSubmit={(values) => {
          try {
            // values come from the dialog; call onEditRow with the values
            onEditRow?.(values);
          } finally {
            setEditDialogOpen(false);
          }
        }}
      />

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={filteredRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
}
