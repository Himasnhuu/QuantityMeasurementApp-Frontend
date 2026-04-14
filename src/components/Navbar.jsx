import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import HistoryIcon from "@mui/icons-material/History";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { useNavigate } from "react-router-dom";
import { removeToken, getToken } from "../utils/auth";

// ✅ Extract user from JWT
const getUser = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.sub || payload.email || null;
  } catch (e) {
    return null;
  }
};

function Navbar() {
  const navigate = useNavigate();

  const user = getUser();
  const isLoggedIn = !!user;

  const handleLogout = () => {
    removeToken();
    navigate("/");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleDashboard = () => {
    navigate("/");
  };

  const handleHistory = () => {
    navigate("/history");
  };

  return (
    <AppBar position="static" elevation={3}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        
        {/* App Title */}
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", letterSpacing: 0.5 }}
        >
          Quantity Measurement App
        </Typography>

        {/* Right Section */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          
          {/* 👤 User Email */}
          {isLoggedIn && (
            <Typography variant="body1">
              {user}
            </Typography>
          )}

          {/* 🔹 Navigation Buttons (only when logged in) */}
          {isLoggedIn && (
            <>
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<DashboardIcon />}
                onClick={handleDashboard}
                sx={{
                  borderColor: "white",
                  "&:hover": {
                    borderColor: "white",
                    backgroundColor: "rgba(255,255,255,0.1)",
                  },
                }}
              >
                Dashboard
              </Button>

              <Button
                variant="outlined"
                color="inherit"
                startIcon={<HistoryIcon />}
                onClick={handleHistory}
                sx={{
                  borderColor: "white",
                  "&:hover": {
                    borderColor: "white",
                    backgroundColor: "rgba(255,255,255,0.1)",
                  },
                }}
              >
                History
              </Button>
            </>
          )}

          {/* 🔐 Login / Logout */}
          {isLoggedIn ? (
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{
                borderColor: "white",
                "&:hover": {
                  borderColor: "white",
                  backgroundColor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              Logout
            </Button>
          ) : (
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<LoginIcon />}
              onClick={handleLogin}
              sx={{
                borderColor: "white",
                "&:hover": {
                  borderColor: "white",
                  backgroundColor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;