import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#000000",      // Màu chính: đen
      contrastText: "#ffffff" // Màu chữ trên nền đen: trắng
    },
    secondary: {
      main: "#ffffff",      // Màu phụ: trắng
      contrastText: "#000000" // Màu chữ trên nền trắng: đen
    },
    background: {
      default: "#f5f5f5",   // Màu nền tổng thể (có thể điều chỉnh theo giao diện bạn muốn)
    },
    text: {
      primary: "#000000",   // Màu chữ chính: đen
      secondary: "#ffffff", // Màu chữ phụ: xám
    },
  },
  typography: {
    fontFamily: "'Montserrat', 'Arial', sans-serif",
    body1: {
      fontSize: "1rem",
      fontWeight: 500,
      color: "#000000", // Chữ chính: đen
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none", // Không viết hoa
          borderRadius: "8px",   // Bo góc nhẹ
          padding: "8px 16px",
        },
      },
    },
  },
});

export default theme;
