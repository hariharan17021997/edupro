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
  Tooltip,
  Button,
  Grid,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";

/**
 * CommonDataTable - A reusable data table component with pagination, sorting, and search
 *
 * Props:
 * - columns: Array of column definitions, e.g., [{ id: 'name', label: 'Name', sortable: true, tooltipFields: ['email', 'phone'] }]
 *   - id: unique column identifier
 *   - label: display name
 *   - sortable: (optional) whether column is sortable
 *   - tooltipFields: (optional) array of field names to show in tooltip on hover
 * - rows: Array of data rows
 * - onRowClick: (optional) callback when a row is clicked
 * - searchPlaceholder: (optional) placeholder for search input (default: "Search...")
 * - pageSize: (optional) initial rows per page (default: 10)
 */

export default function CommonDataTable({
  columns,
  rows,
  onRowClick,
  searchPlaceholder = "Search...",
  pageSize = 10,
}) {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pageSize);
  // sortArray: [{ id: columnId, direction: 'asc'|'desc' }, ...]
  const [sortArray, setSortArray] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [searchInputs, setSearchInputs] = useState(
    columns.reduce((acc, col) => ({ ...acc, [col.id]: "" }), {})
  );
  const [activeSearch, setActiveSearch] = useState(
    columns.reduce((acc, col) => ({ ...acc, [col.id]: "" }), {})
  );
  const [columnFilters, setColumnFilters] = useState(
    columns.reduce((acc, col) => ({ ...acc, [col.id]: "" }), {})
  );

  // Measure header height so filter row can be positioned correctly
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const measure = () => {
      const h = headerRef.current?.offsetHeight || 0;
      setHeaderHeight(h);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [columns, showFilters]);

  // Filter rows based on column-specific search terms
  const filteredRows = rows.filter((row) => {
    // Apply column-specific filters
    const columnFiltersPassed = columns.every((col) => {
      const filterValue = columnFilters[col.id];
      if (!filterValue) return true; // No filter for this column
      const cellValue = row[col.id];
      return (
        cellValue &&
        cellValue.toString().toLowerCase().includes(filterValue.toLowerCase())
      );
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

  const handleFilterChange = (columnId, value) => {
    setColumnFilters((prev) => ({
      ...prev,
      [columnId]: value,
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
          <Tooltip title={showAdd ? "Hide search" : "Show search"}>
            <IconButton
              onClick={() => {
                if (showAdd) {
                  // Clear search when hiding
                  const cleared = columns.reduce(
                    (acc, col) => ({ ...acc, [col.id]: "" }),
                    {}
                  );
                  setSearchInputs(cleared);
                  setActiveSearch(cleared);
                }
                setShowAdd(!showAdd);
              }}
              color={showAdd ? "primary" : "default"}
              size="small"
            >
              <AddOutlinedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={showFilter ? "Hide search" : "Show search"}>
            <IconButton
              onClick={() => {
                if (showFilter) {
                  // Clear search when hiding
                  const cleared = columns.reduce(
                    (acc, col) => ({ ...acc, [col.id]: "" }),
                    {}
                  );
                  setSearchInputs(cleared);
                  setActiveSearch(cleared);
                }
                setShowFilter(!showFilter);
              }}
              color={showFilter ? "primary" : "default"}
              size="small"
            >
              <FilterAltOutlinedIcon />
            </IconButton>
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
            {columns.map((column) => (
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
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                // Apply search values on button click
                setActiveSearch(searchInputs);
                setPage(0);
              }}
            >
              Search
            </Button>
            <Button
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
            </Button>
          </Box>
        </Box>
      )}

      {/* Table */}
      <TableContainer
        component={Paper}
        sx={{
          maxHeight: "calc(10 * 36px + 57px)", // 10 rows (36px each) + header (57px)
          overflow: "auto",
        }}
      >
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow
              ref={headerRef}
              sx={{
                backgroundColor: "#2b88ea !important",
                // background:"linear-gradient(90deg, #05206A 0%, #0F4BD8 50%, #3B82F6 100%) !important",
                // background:"linear-gradient(90deg, #05486aff 0%, #0F4BD8 50%, #3ba5f6ff 100%)",
                height: 20,
                position: "sticky",
                top: 0,
                zIndex: 10,
                "& .MuiTableCell-head": {
                  backgroundColor: "transparent !important",
                  backgroundImage: "none !important",
                },
              }}
            >
              {columns.map((column) => {
                const sortEntry = sortArray.find((s) => s.id === column.id);
                return (
                  <TableCell
                    key={column.id}
                    align="left"
                    sx={{
                      padding: "8px 4px",
                      color: theme.palette.common.white,
                      fontWeight: 700,
                      backgroundColor: "transparent",
                      borderBottom: "none",
                    }}
                  >
                    {column.sortable ? (
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
                        {column.label}
                      </TableSortLabel>
                    ) : (
                      column.label
                    )}
                    {showFilters && (
                      <TextField
                        size="small"
                        placeholder={column.label}
                        variant="outlined"
                        value={columnFilters[column.id]}
                        onChange={(e) =>
                          handleFilterChange(column.id, e.target.value)
                        }
                        sx={{ width: "100%" }}
                      />
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
            {/* Filter Row - Conditional Render
            {showFilters && (
              <TableRow
                sx={{
                  height: 30,
                  backgroundColor: "#f9f9f9",
                  position: "sticky",
                  top: `${headerHeight}px`,
                  zIndex: 9,
                }}
              >
                {columns.map((column) => (
                  <TableCell
                    key={`filter-${column.id}`}
                    align="left"
                    sx={{ padding: "8px 4px" }}
                  >
                    <TextField
                      size="small"
                      placeholder={`Filter ${column.label}`}
                      variant="outlined"
                      value={columnFilters[column.id]}
                      onChange={(e) =>
                        handleFilterChange(column.id, e.target.value)
                      }
                      sx={{ width: "100%" }}
                    />
                  </TableCell>
                ))}
              </TableRow>
            )} */}
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
                {columns.map((column) => {
                  const tooltipContent = getTooltipContent(row, column);
                  return (
                    <Tooltip
                      key={column.id}
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
                      <TableCell
                        align="left"
                        sx={{
                          padding: "4px",
                          cursor: tooltipContent ? "help" : "default",
                        }}
                      >
                        {row[column.id] || "-"}
                      </TableCell>
                    </Tooltip>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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
