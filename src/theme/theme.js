import { createTheme } from "@mui/material/styles";
import { keyframes } from "@mui/material";

/**
 * ============================================================================
 * EDUPRO CENTRALIZED DESIGN SYSTEM & THEME CONFIGURATION
 * ============================================================================
 *
 * All design tokens, styles, and theme configurations in one place
 * Sections:
 * 1. Animations & Keyframes
 * 2. Color Palette & Gradients
 * 3. Typography System
 * 4. Spacing System
 * 5. Shadows
 * 6. Border Radius
 * 7. Transitions
 * 8. Breakpoints
 * 9. Z-Index System
 * 10. MUI Theme Configuration
 * 11. Custom Utility Styles
 */

// ============================================================================
// 1. ANIMATIONS & KEYFRAMES
// ============================================================================

export const animations = {
  float: keyframes`
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  `,
  floatSlow: keyframes`
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-15px) rotate(5deg); }
  `,
  pulse: keyframes`
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  `,
  fadeIn: keyframes`
    from { opacity: 0; }
    to { opacity: 1; }
  `,
  slideInLeft: keyframes`
    from { transform: translateX(-100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  `,
  slideInRight: keyframes`
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  `,
  scaleUp: keyframes`
    from { transform: scale(0.9); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  `,
  bounce: keyframes`
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  `,
  rotate: keyframes`
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  `,
  shimmer: keyframes`
    0% { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
  `,
};

// ============================================================================
// 2. COLOR PALETTE & GRADIENTS
// ============================================================================

export const colors = {
  primary: {
    main: "#1976d2",
    light: "#42a5f5",
    dark: "#1565c0",
    contrastText: "#fff",
  },
  secondary: {
    main: "#dc004e",
    light: "#f73378",
    dark: "#9a0036",
    contrastText: "#fff",
  },
  success: { main: "#4caf50", light: "#81c784", dark: "#388e3c" },
  warning: { main: "#ff9800", light: "#ffb74d", dark: "#f57c00" },
  error: { main: "#f44336", light: "#ef5350", dark: "#d32f2f" },
  info: { main: "#2196f3", light: "#64b5f6", dark: "#1976d2" },
  background: { default: "#fafafa", paper: "#ffffff", dark: "#f5f5f5" },
  text: {
    primary: "rgba(0, 0, 0, 0.87)",
    secondary: "rgba(0, 0, 0, 0.60)",
    disabled: "rgba(0, 0, 0, 0.38)",
  },
  grey: {
    50: "#fafafa",
    100: "#f5f5f5",
    200: "#eeeeee",
    300: "#e0e0e0",
    400: "#bdbdbd",
    500: "#9e9e9e",
    600: "#757575",
    700: "#616161",
    800: "#424242",
    900: "#212121",
  },
  login: {
    gradientStart: "#1976d2",
    gradientMid: "#2D68C4",
    gradientEnd: "#1560BD",
    overlayLight: "rgba(255, 255, 255, 0.2)",
    overlayMedium: "rgba(255, 255, 255, 0.15)",
    glassBorder: "rgba(255, 255, 255, 0.3)",
  },
  notification: {
    unreadBg: "#f0f4ff",
    unreadHover: "#e3f2fd",
    readBg: "#ffffff",
    readHover: "#f9f9f9",
    successBg: "#e8f5e9",
    infoBg: "#e3f2fd",
  },
  code: {
    headerBg: "#424242",
    languageBadgeBg: "#616161",
    blockBg: "#212121",
    lineNumberColor: "#757575",
    lineNumberBorder: "#616161",
    textColor: "#f5f5f5",
  },
};

export const gradients = {
  primary: `linear-gradient(135deg, ${colors.primary.main}, ${colors.primary.dark})`,
  loginBackground: `linear-gradient(135deg, ${colors.login.gradientStart} 0%, ${colors.login.gradientMid} 50%, ${colors.login.gradientEnd} 100%)`,
  card: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
};

// ============================================================================
// 3. TYPOGRAPHY SYSTEM
// ============================================================================

export const typography = {
  fontFamily: {
    primary: '"Roboto", "Helvetica", "Arial", sans-serif',
    code: "'Fira Code', 'Courier New', monospace",
  },
  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    semiBold: 600,
    bold: 700,
    extraBold: 800,
  },
  fontSize: {
    xs: "0.65rem",
    sm: "0.75rem",
    base: "0.875rem",
    md: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.75rem",
    "4xl": "2rem",
    "5xl": "2.5rem",
  },
  lineHeight: { tight: 1.2, normal: 1.5, relaxed: 1.6, loose: 1.8 },
  letterSpacing: {
    tight: "-0.05em",
    normal: "0",
    wide: "0.025em",
    wider: "0.05em",
    widest: "0.1em",
  },
};

// ============================================================================
// 4. SPACING SYSTEM
// ============================================================================

export const spacing = {
  unit: 8,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  pagePadding: { xs: 16, sm: 24, md: 32, lg: 48 },
  component: { cardPadding: 24, sectionMargin: 32, elementGap: 16 },
  layout: { drawerWidth: 240, appBarHeight: 64, contentPadding: 24 },
};

// ============================================================================
// 5. SHADOWS
// ============================================================================

export const shadows = {
  none: "none",
  xs: "0 1px 2px rgba(0, 0, 0, 0.05)",
  sm: "0 2px 4px rgba(0, 0, 0, 0.1)",
  md: "0 4px 8px rgba(0, 0, 0, 0.12)",
  lg: "0 8px 16px rgba(0, 0, 0, 0.15)",
  xl: "0 12px 24px rgba(0, 0, 0, 0.18)",
  "2xl": "0 20px 40px rgba(0, 0, 0, 0.2)",
  "3xl": "0 30px 60px rgba(0, 0, 0, 0.25)",
  card: "0 2px 8px rgba(0, 0, 0, 0.08)",
  cardHover: "0 8px 24px rgba(0, 0, 0, 0.15)",
  button: "0 2px 4px rgba(0, 0, 0, 0.1)",
  appBar: "0 2px 8px rgba(0, 0, 0, 0.08)",
  login: "0 10px 40px rgba(0, 0, 0, 0.2)",
  loginCard: "0 20px 60px rgba(0, 0, 0, 0.3)",
  text: {
    sm: "0 1px 2px rgba(0, 0, 0, 0.1)",
    md: "0 2px 4px rgba(0, 0, 0, 0.15)",
    lg: "0 2px 20px rgba(0, 0, 0, 0.2)",
  },
};

// ============================================================================
// 6. BORDER RADIUS
// ============================================================================

export const borderRadius = {
  none: "0px",
  xs: "2px",
  sm: "4px",
  md: "8px",
  lg: "12px",
  xl: "16px",
  "2xl": "20px",
  "3xl": "24px",
  full: "9999px",
  button: "4px",
  card: "8px",
  input: "4px",
  chip: "4px",
  dialog: "8px",
  iconButton: "4px",
  loginCard: "16px",
  codeBlock: "8px",
};

// ============================================================================
// 7. TRANSITIONS
// ============================================================================

export const transitions = {
  duration: {
    shortest: 150,
    shorter: 200,
    short: 250,
    standard: 300,
    complex: 375,
    enteringScreen: 225,
    leavingScreen: 195,
  },
  easing: {
    easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    easeOut: "cubic-bezier(0.0, 0, 0.2, 1)",
    easeIn: "cubic-bezier(0.4, 0, 1, 1)",
    sharp: "cubic-bezier(0.4, 0, 0.6, 1)",
  },
  common: {
    fast: "all 0.2s ease",
    normal: "all 0.3s ease",
    slow: "all 0.5s ease",
  },
  button: "all 0.3s ease",
  card: "all 0.3s ease",
  hover: "all 0.2s ease",
  drawer: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
};

// ============================================================================
// 8. BREAKPOINTS
// ============================================================================

export const breakpoints = {
  values: { xs: 0, sm: 600, md: 960, xl: 1920 },
};

// ============================================================================
// 9. Z-INDEX SYSTEM
// ============================================================================

export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  notification: 1080,
  appBar: 1100,
  drawer: 1200,
  snackbar: 1400,
};

// ============================================================================
// 10. MUI THEME CONFIGURATION
// ============================================================================

const theme = createTheme({
  palette: {
    primary: colors.primary,
    secondary: colors.secondary,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    info: colors.info,
    background: colors.background,
    text: colors.text,
  },

  typography: {
    fontFamily: typography.fontFamily.primary,
    h1: {
      fontSize: "2.5rem",
      fontWeight: typography.fontWeight.semiBold,
      lineHeight: typography.lineHeight.tight,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: typography.fontWeight.semiBold,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: typography.fontWeight.semiBold,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: typography.fontWeight.semiBold,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: typography.fontWeight.semiBold,
      lineHeight: typography.lineHeight.normal,
    },
    h6: {
      fontSize: "1rem",
      fontWeight: typography.fontWeight.semiBold,
      lineHeight: typography.lineHeight.relaxed,
    },
    body1: { fontSize: "1rem", lineHeight: typography.lineHeight.normal },
    body2: { fontSize: "0.875rem", lineHeight: 1.43 },
    button: {
      textTransform: "none",
      fontWeight: typography.fontWeight.semiBold,
      fontSize: "1rem",
    },
    caption: { fontSize: "0.75rem", lineHeight: 1.66 },
  },

  spacing: spacing.unit,
  breakpoints: breakpoints,
  shape: { borderRadius: 4 },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: typography.fontWeight.semiBold,
          fontSize: "1rem",
          padding: "10px 24px",
          borderRadius: borderRadius.button,
          transition: transitions.button,
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          },
          "&.MuiButton-sizeLarge": { padding: "12px 32px", fontSize: "1.1rem" },
        },
        contained: { boxShadow: shadows.button },
        outlined: { border: "2px solid" },
      },
      defaultProps: { disableElevation: false },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: borderRadius.input,
            backgroundColor: colors.background.default,
            "&:hover fieldset": { borderColor: colors.primary.main },
          },
        },
      },
      defaultProps: { variant: "outlined" },
    },

    MuiPaper: {
      styleOverrides: {
        root: { borderRadius: borderRadius.card, boxShadow: shadows.card },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: shadows.appBar,
          backgroundColor: colors.background.paper,
          color: colors.primary.main,
        },
      },
    },

    MuiTable: {
      styleOverrides: { root: { borderCollapse: "collapse" } },
    },

    MuiTableHead: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-head": {
            backgroundColor: colors.grey[100],
            fontWeight: typography.fontWeight.bold,
            fontSize: "0.875rem",
            color: colors.primary.main,
            borderBottom: `2px solid ${colors.grey[300]}`,
          },
        },
      },
    },

    MuiTableBody: {
      styleOverrides: {
        root: {
          "& .MuiTableRow-root:hover": {
            backgroundColor: colors.grey[50],
            transition: transitions.hover,
          },
          "& .MuiTableCell-body": {
            borderBottom: `1px solid ${colors.grey[300]}`,
            fontSize: "0.875rem",
          },
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: { padding: "8px 12px" },
        head: {
          fontWeight: typography.fontWeight.bold,
          textTransform: "uppercase",
          fontSize: "0.75rem",
          letterSpacing: typography.letterSpacing.wide,
        },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: colors.background.paper,
          borderRight: `1px solid ${colors.grey[300]}`,
        },
      },
    },

    MuiListItemIcon: {
      styleOverrides: { root: { color: "inherit", minWidth: 0 } },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.button,
          margin: "4px 8px",
          color: colors.primary.main,
          "&.Mui-selected": {
            backgroundColor: colors.info.light + "20",
            color: colors.primary.main,
            "& .MuiListItemIcon-root": { color: colors.primary.main },
            "&:hover": { backgroundColor: colors.info.light + "40" },
          },
          "&:hover": { backgroundColor: colors.grey[100] },
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.card,
          boxShadow: shadows.card,
          transition: transitions.card,
          "&:hover": {
            boxShadow: shadows.cardHover,
            transform: "translateY(-8px)",
          },
        },
      },
    },

    MuiDialog: {
      styleOverrides: { paper: { borderRadius: borderRadius.dialog } },
    },

    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: borderRadius.button, fontSize: "0.875rem" },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.chip,
          fontWeight: typography.fontWeight.semiBold,
        },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.iconButton,
          transition: transitions.hover,
          "&:hover": { backgroundColor: colors.primary.main + "14" },
        },
      },
    },
  },

  // ============================================================================
  // 11. CUSTOM UTILITY STYLES
  // ============================================================================

  custom: {
    // Login Page
    loginContainer: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: gradients.loginBackground,
    },
    loginCard: {
      width: "100%",
      maxWidth: 450,
      padding: 4,
      boxShadow: shadows.login,
      borderRadius: 2,
    },
    loginHeader: { textAlign: "center", marginBottom: 4 },
    loginForm: { display: "grid", gap: 2.5 },

    // Drawer
    drawerHeaderPageName: {
      mt: 1,
      flex: 1,
      textAlign: "left",
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.bold,
      color: colors.primary.main,
      textTransform: "uppercase",
      letterSpacing: typography.letterSpacing.wide,
    },

    breadcrumbs: {
      flex: 1,
      textAlign: "center",
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.light,
      color: colors.primary.main,
      textTransform: "lowercase",
      letterSpacing: typography.letterSpacing.wide,
    },

    // Course Content
    courseHeader: {
      mb: 4,
      pb: 3,
      borderBottom: `1px solid ${colors.grey[300]}`,
    },
    lessonItem: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      p: 2,
      borderRadius: 1,
      transition: transitions.hover,
      cursor: "pointer",
      "&:hover": { backgroundColor: colors.primary.main + "0D" },
    },

    // Reusable Patterns
    glassmorphism: {
      background: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(20px)",
      border: `1px solid ${colors.login.glassBorder}`,
    },
    cardHoverEffect: {
      transition: transitions.card,
      "&:hover": {
        boxShadow: shadows.cardHover,
        transform: "translateY(-8px)",
      },
    },
    gradientText: {
      background: gradients.primary,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
    },
    // DataTable styles
    dataTable: {
      header: {
        p: 1,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#2a52a483",
      },
      collapse: {
        p: 1,
        borderTop: "1px solid rgba(0,0,0,0.08)",
        backgroundColor: "#f5f5f5",
      },
      filtersStack: { gap: 2, width: "100%", display: "flex" },
      toolbarOuter: {
        p: 1,
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: { xs: "flex-start", sm: "space-between" },
        alignItems: { xs: "stretch", sm: "center" },
        gap: { xs: 1, sm: 1 },
        backgroundColor: "#2a52a483",
      },
      toolbarLeft: {
        display: "flex",
        gap: 0.5,
        alignItems: "center",
        overflowX: "auto",
        flexWrap: { xs: "nowrap", sm: "nowrap" },
        flex: { xs: "1 1 100%", sm: "auto" },
      },
      toolbarRight: {
        display: "flex",
        gap: 1,
        alignItems: "center",
        width: { xs: "100%", sm: "auto" },
        minWidth: 0,
      },
      filterFieldBox: {
        display: "flex",
        flexDirection: "column",
        width: { xs: "100%", sm: 160 },
        alignSelf: { xs: "center", sm: "flex-start" },
        minWidth: 0,
      },
      dataGrid: {
        border: 0,
        "& .MuiDataGrid-columnHeaders, & .MuiDataGrid-columnHeader, & .MuiDataGrid-columnHeaderTitle":
          {
            backgroundColor: "#ffffff",
            color: "#1976d2",
          },
        "& .MuiDataGrid-columnHeaderTitle": { fontWeight: 600 },
        "& .MuiDataGrid-row:nth-child(odd)": { backgroundColor: "#184bb04a" },
      },
    },
  },
});

export default theme;
