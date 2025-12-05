import { ThemeProvider } from "@mui/material/styles";
import Navbar from "./components/Navbar";
import theme from "./theme/theme";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <Navbar />
    </ThemeProvider>
  );
}
