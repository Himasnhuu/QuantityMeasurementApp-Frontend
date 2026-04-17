import { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Divider,
  Snackbar,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  Email,
  Lock,
  Google,
  PersonOutline,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { loginUser } from "../api/authApi";
import { saveToken } from "../utils/auth";

function Login() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const response = await loginUser(data);
      saveToken(response.token);

      setSnackbar({
        open: true,
        message: "Login successful!",
        severity: "success",
      });

      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (error) {
      setSnackbar({
        open: true,
        message:
          error.response?.status === 401
            ? "Invalid email or password"
            : "Something went wrong",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 4,
        background:
          "radial-gradient(circle at 86% 14%, rgba(90, 103, 204, 0.34) 0%, rgba(8,12,27,0) 44%), radial-gradient(circle at 8% 84%, rgba(80, 95, 191, 0.2) 0%, rgba(8,12,27,0) 45%), linear-gradient(160deg, #060b1e 0%, #040919 48%, #040815 100%)",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "min(560px, 100%)",
          p: { xs: 3, md: 4.5 },
          borderRadius: "34px",
          border: "1px solid rgba(121, 136, 214, 0.28)",
          background:
            "linear-gradient(120deg, rgba(19,24,44,0.86), rgba(11,16,34,0.78))",
          boxShadow: "0 26px 52px rgba(5, 8, 24, 0.42)",
          backdropFilter: "blur(8px)",
        }}
      >
        <Typography
          align="center"
          sx={{
            color: "rgba(212,220,248,0.74)",
            letterSpacing: "0.1em",
            fontWeight: 600,
            fontSize: "0.95rem",
          }}
        >
          WELCOME BACK
        </Typography>

        <Typography
          align="center"
          sx={{
            mt: 0.8,
            fontFamily: "'Playfair Display', serif",
            color: "#f2f4ff",
            fontWeight: 600,
            fontSize: { xs: "2.35rem", md: "2.75rem" },
            lineHeight: 1,
          }}
        >
          Sign In
        </Typography>

        <Typography align="center" sx={{ color: "rgba(206,215,246,0.82)", mt: 1.3, mb: 2.2 }}>
          Continue to Quantity Measurement
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email format",
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email sx={{ color: "rgba(224,232,255,0.84)" }} />
                </InputAdornment>
              ),
            }}
            sx={loginFieldSx}
          />

          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Minimum 6 characters",
              },
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: "rgba(224,232,255,0.84)" }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    sx={{ color: "rgba(224,232,255,0.84)" }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={loginFieldSx}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 2.3,
              py: 1.38,
              borderRadius: "999px",
              textTransform: "none",
              fontWeight: 700,
              fontSize: "1.04rem",
              boxShadow: "0 14px 30px rgba(95, 112, 255, 0.44)",
              background:
                "linear-gradient(90deg, rgba(79,108,244,0.97), rgba(133,95,241,0.96))",
            }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
          </Button>

          <Divider
            sx={{
              my: 2.5,
              color: "rgba(201,209,238,0.72)",
              "&::before, &::after": {
                borderColor: "rgba(126, 140, 199, 0.3)",
              },
            }}
          >
            OR CONTINUE WITH
          </Divider>

          <Button
            variant="contained"
            fullWidth
            startIcon={<Google />}
            onClick={() =>
              (window.location.href =
                "http://localhost:8080/oauth2/authorization/google")
            }
            sx={{
              py: 1.2,
              borderRadius: "999px",
              textTransform: "none",
              fontWeight: 700,
              backgroundColor: "#ffffff",
              color: "#242733",
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "#f2f3f7",
                boxShadow: "none",
              },
            }}
          >
            Continue with Google
          </Button>

          <Button
            variant="outlined"
            fullWidth
            startIcon={<PersonOutline />}
            sx={{
              mt: 1.5,
              py: 1.12,
              borderRadius: "999px",
              textTransform: "none",
              fontWeight: 600,
              color: "#dce4ff",
              borderColor: "rgba(122,137,208,0.6)",
              "&:hover": {
                borderColor: "rgba(157,173,240,0.85)",
                backgroundColor: "rgba(47,58,102,0.24)",
              },
            }}
            onClick={() => {
              localStorage.setItem("mode", "GUEST");
              localStorage.removeItem("token");
              navigate("/dashboard");
            }}
          >
            Continue as Guest
          </Button>

          <Typography sx={{ mt: 2.2, color: "rgba(210,219,247,0.8)" }} align="center">
            Don’t have an account?{" "}
            <Link to="/signup" style={{ color: "#f0f4ff", fontWeight: 600 }}>
              Signup
            </Link>
          </Typography>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}

export default Login;

const loginFieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "16px",
    color: "#f2f6ff",
    background: "linear-gradient(90deg, rgba(42,47,68,0.52), rgba(30,35,52,0.58))",
    "& fieldset": {
      borderColor: "rgba(140,154,211,0.32)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(164,177,236,0.6)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "rgba(159,177,255,0.84)",
    },
  },
  "& .MuiInputLabel-root": {
    color: "rgba(214,223,252,0.8)",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#e3ebff",
  },
  "& .MuiFormHelperText-root": {
    marginLeft: 0,
  },
};
