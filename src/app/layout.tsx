import { Outlet } from "react-router";
import { SnackbarProvider } from "notistack";
import LocalizationProvider from "./_components/providers/localization";
import SessionProvider from "./_components/providers/session";
import ProkerSessionProvider from "./_components/providers/proker-session";
import ThemeProvider from "./_components/providers/theme";
import "./global.css";

function MainLayout() {
  return (
    <SessionProvider>
      <ProkerSessionProvider>
        <LocalizationProvider>
          <SnackbarProvider>
            <ThemeProvider>
              <Outlet />
            </ThemeProvider>
          </SnackbarProvider>
        </LocalizationProvider>
      </ProkerSessionProvider>
    </SessionProvider>
  );
}
export default MainLayout;
