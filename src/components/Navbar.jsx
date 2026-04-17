import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import HistoryIcon from "@mui/icons-material/History";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LoginIcon from "@mui/icons-material/Login";
import { useNavigate } from "react-router-dom";
import { isGuest, removeToken } from "../utils/auth";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    localStorage.removeItem("mode"); // clear guest mode if any
    navigate("/");
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "rgba(4, 8, 21, 0.96)",
        borderBottom: "1px solid rgba(132, 147, 210, 0.2)",
        backdropFilter: "blur(6px)",
      }}
    >
      <Toolbar
        sx={{
          minHeight: "72px !important",
          display: "flex",
          justifyContent: "space-between",
          px: { xs: 2, md: 3 },
        }}
      >
        {/* App Title */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            letterSpacing: 0.1,
            color: "#edf2ff",
            fontSize: { xs: "1.35rem", md: "1.55rem" },
          }}
        >
          Quantity Measurement
        </Typography>

        {/* Right Side Buttons */}
        <Box>
          {isGuest() ? (
            // 👤 Guest Mode → Show Login Button
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<LoginIcon />}
              onClick={() => {
                localStorage.removeItem("mode"); // exit guest mode
                navigate("/");
              }}
              sx={{
                borderRadius: "999px",
                px: 2,
                borderColor: "rgba(166, 178, 230, 0.64)",
                color: "#f1f5ff",
                "&:hover": {
                  borderColor: "rgba(201, 211, 255, 0.95)",
                  backgroundColor: "rgba(255,255,255,0.08)",
                },
              }}
            >
              Login
            </Button>
          ) : (
            // 🔐 Logged-in Mode → Show Dashboard + History + Logout
            <>
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<DashboardIcon />}
                onClick={() => navigate("/dashboard")}
                sx={{
                  borderRadius: "999px",
                  px: 2,
                  borderColor: "rgba(166, 178, 230, 0.64)",
                  color: "#f1f5ff",
                  mr: 1.2,
                  "&:hover": {
                    borderColor: "rgba(201, 211, 255, 0.95)",
                    backgroundColor: "rgba(255,255,255,0.08)",
                  },
                }}
              >
                Dashboard
              </Button>

              <Button
                variant="outlined"
                color="inherit"
                startIcon={<HistoryIcon />}
                onClick={() => navigate("/history")}
                sx={{
                  borderRadius: "999px",
                  px: 2,
                  borderColor: "rgba(166, 178, 230, 0.64)",
                  color: "#f1f5ff",
                  mr: 1.2,
                  "&:hover": {
                    borderColor: "rgba(201, 211, 255, 0.95)",
                    backgroundColor: "rgba(255,255,255,0.08)",
                  },
                }}
              >
                History
              </Button>

              <Button
                variant="outlined"
                color="inherit"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                sx={{
                  borderRadius: "999px",
                  px: 2,
                  borderColor: "rgba(166, 178, 230, 0.64)",
                  color: "#f1f5ff",
                  "&:hover": {
                    borderColor: "rgba(201, 211, 255, 0.95)",
                    backgroundColor: "rgba(255,255,255,0.08)",
                  },
                }}
              >
                Logout
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
