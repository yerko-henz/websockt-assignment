// Centralized theme configuration for both frontends

export const theme = {
  // Colors
  colors: {
    background: "#f0f0f0",
    surface: "white",
    border: "#333",
    borderLight: "#ccc",
    primary: "#007bff",
    primaryHover: "#0056b3",
    danger: "#dc3545",
    dangerHover: "#c82333",
    secondary: "#6c757d",
    secondaryHover: "#5a6268",
    success: "#d4edda",
    successText: "#155724",
    error: "#f8d7da",
    errorText: "#721c24",
    messagesArea: "#fafafa",
    placeholder: "#999",
    disabled: "#ccc",
    modalOverlay: "rgba(0,0,0,0.5)",
    text: "white",
  },

  // Border radius
  borderRadius: {
    sm: "5px",
    md: "10px",
  },

  // Border widths
  borderWidth: {
    thin: "1px",
    thick: "2px",
  },

  // Padding
  padding: {
    xs: "8px",
    sm: "10px",
    md: "16px",
    lg: "20px",
    xl: "30px",
  },

  // Box shadows
  shadows: {
    default: "0 4px 6px rgba(0,0,0,0.1)",
  },

  // Dimensions
  dimensions: {
    chatBoxWidth: "400px",
    chatBoxHeight: "500px",
  },

  // Transitions
  transitions: {
    default: "all 0.2s ease-in-out",
  },
};

export type Theme = typeof theme;
export type ThemeColors = typeof theme.colors;
export type ThemeBorderRadius = typeof theme.borderRadius;
export type ThemePadding = typeof theme.padding;
export type ThemeShadows = typeof theme.shadows;
export type ThemeDimensions = typeof theme.dimensions;
