import { useMemo, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  MenuItem,
  Button,
  Paper,
  Snackbar,
  Alert,
  CircularProgress,
  Divider,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { alpha } from "@mui/material/styles";
import { measurementTypes } from "../utils/unitConfig";
import {
  convertMeasurement,
  compareMeasurement,
  arithmeticMeasurement,
} from "../api/measurementApi";

function Dashboard() {
  const [selectedType, setSelectedType] = useState("LENGTH");
  const [selectedAction, setSelectedAction] = useState("CONVERT");

  const [formData, setFormData] = useState({
    value1: "",
    unit1: "FEET",
    value2: "",
    unit2: "INCHES",
    resultUnit: "FEET",
    operator: "ADD",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const currentType = useMemo(() => {
    return measurementTypes.find((type) => type.key === selectedType);
  }, [selectedType]);

  const availableActions = currentType?.actions || [];
  const availableUnits = currentType?.units || [];

  const handleTypeChange = (typeKey) => {
    const newType = measurementTypes.find((type) => type.key === typeKey);

    setSelectedType(typeKey);
    setSelectedAction(newType.actions[0]);

    setFormData({
      value1: "",
      unit1: newType.units[0] || "",
      value2: "",
      unit2: newType.units[1] || newType.units[0] || "",
      resultUnit: newType.units[0] || "",
      operator: "ADD",
    });

    setResult(null);
  };

  const handleActionChange = (_, newAction) => {
    if (!newAction) return;

    setSelectedAction(newAction);
    setResult(null);

    setFormData((prev) => ({
      ...prev,
      value1: "",
      value2: "",
      resultUnit: availableUnits[0] || "",
      operator: "ADD",
    }));
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.value1 || !formData.unit1) {
      return "Please fill the first value and unit.";
    }

    if (selectedAction === "CONVERT" && !formData.resultUnit) {
      return "Please select target unit.";
    }

    if (
      (selectedAction === "COMPARE" || selectedAction === "ARITHMETIC") &&
      (!formData.value2 || !formData.unit2)
    ) {
      return "Please fill the second value and unit.";
    }

    return null;
  };

  const handleSubmit = async () => {
    const validationError = validateForm();

    if (validationError) {
      setSnackbar({
        open: true,
        message: validationError,
        severity: "warning",
      });
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      let response;

      if (selectedAction === "CONVERT") {
        const payload = {
          value: Number(formData.value1),
          unit: formData.unit1,
        };

        response = await convertMeasurement(payload, formData.resultUnit);
      }

      if (selectedAction === "COMPARE") {
        const payload = [
          {
            value: Number(formData.value1),
            unit: formData.unit1,
          },
          {
            value: Number(formData.value2),
            unit: formData.unit2,
          },
        ];

        response = await compareMeasurement(payload);
      }

      if (selectedAction === "ARITHMETIC") {
        const payload = [
          {
            value: Number(formData.value1),
            unit: formData.unit1,
          },
          {
            value: Number(formData.value2),
            unit: formData.unit2,
          },
        ];

        response = await arithmeticMeasurement(payload, formData.operator);
      }

      setResult(response);

      setSnackbar({
        open: true,
        message: "Operation completed successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Operation failed:", error);

      setSnackbar({
        open: true,
        message: "Request failed. Please check backend/API mapping.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatActionLabel = (action) => {
    return action.charAt(0) + action.slice(1).toLowerCase();
  };

  const renderResult = () => {
    if (typeof result !== "boolean" && !result) {
      return (
        <Typography color="text.secondary" sx={{ fontStyle: "italic" }}>
          Ready when you are - calculate to see the result.
        </Typography>
      );
    }

    // CONVERT & ARITHMETIC (object response)
    if (typeof result === "object" && result.value !== undefined) {
      return (
        <Typography variant="h4" fontWeight="bold" color="primary">
          {Number(result.value).toFixed(3)} {result.unit}
        </Typography>
      );
    }

    // COMPARE (boolean response)
    // if (typeof result === "boolean") {
    //   return (
    //     <Typography
    //       variant="h5"
    //       fontWeight="bold"
    //       color={result ? "success.main" : "error.main"}
    //     >
    //       {result ? "Values are equal ✅" : "Values are NOT equal ❌"}
    //     </Typography>
    //   );
    // }
    // Check if it's a boolean OR a string that says "false"
    if (
      typeof result === "boolean" ||
      result === "false" ||
      result === "true"
    ) {
      const isTrue = String(result) === "true"; // Normalize to a boolean
      return (
        <Typography
          variant="h5"
          fontWeight="bold"
          color={isTrue ? "success.main" : "error.main"}
        >
          {isTrue ? "Values are equal ✅" : "Values are NOT equal ❌"}
        </Typography>
      );
    }

    // fallback
    return (
      <Typography variant="h4" fontWeight="bold">
        {JSON.stringify(result)}
      </Typography>
    );
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 72px)",
        display: "flex",
        justifyContent: "center",
        px: { xs: 1.5, md: 3 },
        py: { xs: 2, md: 4 },
        color: "#d9dff4",
        background:
          "radial-gradient(circle at 20% 85%, rgba(73, 78, 255, 0.22) 0%, rgba(8, 12, 28, 0) 45%), radial-gradient(circle at 72% 18%, rgba(119, 136, 255, 0.28) 0%, rgba(8, 12, 28, 0) 38%), linear-gradient(160deg, #060b1e 0%, #050919 45%, #040815 100%)",
      }}
    >
      <Box sx={{ width: "min(1040px, 100%)", mx: "auto" }}>
        <Box textAlign="center" mb={2.15}>
          <Typography
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 600,
              letterSpacing: "0.01em",
              color: "#f2f4ff",
              fontSize: { xs: "2rem", md: "2.7rem" },
              lineHeight: 1.1,
            }}
          >
            Measure. Convert. Simplify.
          </Typography>
          <Typography sx={{ color: "rgba(210,220,255,0.82)", mt: 0.55, fontSize: "0.83rem" }}>
            Precision conversion workspace
          </Typography>
        </Box>

        <Typography
          variant="subtitle2"
          sx={{
            mb: 1.3,
            textAlign: "center",
            color: "rgba(202,213,255,0.78)",
            fontWeight: 500,
            letterSpacing: "0.14em",
            fontSize: "0.82rem",
          }}
        >
          MEASUREMENT TYPE
        </Typography>

        <Grid container spacing={1.8} mb={2.3} justifyContent="center">
          {measurementTypes.map((type) => (
            <Grid item xs={6} sm={6} md="auto" key={type.key}>
              <Button
                onClick={() => handleTypeChange(type.key)}
                sx={{
                  width: { xs: "100%", md: 248 },
                  minWidth: { md: 248 },
                  height: { xs: 82, md: 144 },
                  borderRadius: "44px",
                  textTransform: "none",
                  color: "#eef1ff",
                  fontSize: { xs: "1.15rem", md: "1.72rem" },
                  fontWeight: 700,
                  border: `1px solid ${
                    selectedType === type.key
                      ? "rgba(129,149,255,0.9)"
                      : "rgba(130,146,214,0.2)"
                  }`,
                  background:
                    selectedType === type.key
                      ? "linear-gradient(135deg, rgba(70,86,164,0.62), rgba(53,62,111,0.5))"
                      : "linear-gradient(120deg, rgba(23,31,59,0.62), rgba(30,37,68,0.4))",
                  boxShadow:
                    selectedType === type.key
                      ? "0 16px 34px rgba(72, 98, 244, 0.35), inset 0 1px 0 rgba(255,255,255,0.16)"
                      : "inset 0 1px 0 rgba(255,255,255,0.06)",
                  backdropFilter: "blur(8px)",
                }}
              >
                {type.label}
              </Button>
            </Grid>
          ))}
        </Grid>

        <Typography
          variant="subtitle2"
          sx={{
            mb: 1.8,
            mt: 0.2,
            textAlign: "center",
            color: "rgba(202,213,255,0.78)",
            fontWeight: 500,
            letterSpacing: "0.14em",
            fontSize: "0.82rem",
          }}
        >
          ACTION
        </Typography>

        <ToggleButtonGroup
          value={selectedAction}
          exclusive
          onChange={handleActionChange}
          sx={{
            width: "min(760px, 100%)",
            mx: "auto",
            mb: 1.8,
            display: "grid",
            gridTemplateColumns: `repeat(${availableActions.length}, minmax(0, 1fr))`,
            gap: 0.8,
          }}
        >
          {availableActions.map((action) => (
            <ToggleButton
              key={action}
              value={action}
              sx={{
                py: 1.02,
                color: "#d8def7",
                border: "1px solid rgba(129,146,214,0.25) !important",
                borderRadius: "20px !important",
                textTransform: "none",
                fontSize: "0.92rem",
                fontWeight: 600,
                background: "rgba(22,28,52,0.5)",
                "&.Mui-selected": {
                  background:
                    "linear-gradient(135deg, rgba(85,104,194,0.78), rgba(97,111,188,0.68))",
                  color: "#ffffff",
                },
              }}
            >
              {formatActionLabel(action)}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <Paper
          elevation={0}
          sx={{
            px: { xs: 1.4, md: 1.8 },
            py: 1.8,
            mb: 2.4,
            borderRadius: "34px",
            border: "1px solid rgba(124, 141, 215, 0.22)",
            background:
              "linear-gradient(120deg, rgba(14,19,38,0.72), rgba(10,14,30,0.66))",
            boxShadow: "0 20px 50px rgba(6, 10, 30, 0.35)",
          }}
        >
          <Typography
            sx={{
              color: "rgba(202,213,255,0.76)",
              fontSize: "0.86rem",
              letterSpacing: "0.09em",
              fontWeight: 600,
              mb: 1.25,
              pl: 0.6,
              fontSize: "0.95rem",
            }}
          >
            MEASUREMENT INPUTS
          </Typography>

          {selectedAction === "CONVERT" && (
            <Grid container spacing={1.6} alignItems="stretch" justifyContent="center">
              <Grid item xs={12} md={5} sx={{ display: "flex" }}>
                <Paper
                  elevation={0}
                  sx={{
                    width: "100%",
                    p: 1.8,
                    borderRadius: "28px",
                    border: "1px solid rgba(117,130,198,0.24)",
                    background: "rgba(11,17,35,0.58)",
                  }}
                >
                  <Typography sx={{ color: "#b8c3ec", mb: 1, fontSize: "0.94rem" }}>
                    FROM
                  </Typography>
                  <TextField
                    placeholder="Value"
                    type="number"
                    fullWidth
                    margin="normal"
                    value={formData.value1}
                    onChange={(e) => handleChange("value1", e.target.value)}
                    sx={fieldSx}
                  />
                  <TextField
                    select
                    label="From Unit"
                    fullWidth
                    margin="normal"
                    value={formData.unit1}
                    onChange={(e) => handleChange("unit1", e.target.value)}
                    sx={fieldSx}
                  >
                    {availableUnits.map((unit) => (
                      <MenuItem key={unit} value={unit}>
                        {unit}
                      </MenuItem>
                    ))}
                  </TextField>
                </Paper>
              </Grid>

              <Grid item xs={12} md={1} sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    mx: "auto",
                    border: "1px solid rgba(140,153,210,0.35)",
                    bgcolor: "rgba(29,36,66,0.6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#dce3ff",
                  }}
                >
                  <ArrowForwardIcon fontSize="small" />
                </Box>
              </Grid>

              <Grid item xs={12} md={5} sx={{ display: "flex" }}>
                <Paper
                  elevation={0}
                  sx={{
                    width: "100%",
                    height: "100%",
                    p: 1.8,
                    borderRadius: "28px",
                    border: "1px solid rgba(117,130,198,0.24)",
                    background: "rgba(11,17,35,0.58)",
                  }}
                >
                  <Typography sx={{ color: "#b8c3ec", mb: 1, fontSize: "0.94rem" }}>
                    TO
                  </Typography>
                  <Typography
                    sx={{
                      color: "rgba(216,226,255,0.9)",
                      fontSize: "0.82rem",
                      mb: 0.5,
                      ml: 0.7,
                    }}
                  >
                    Target Unit
                  </Typography>
                  <TextField
                    select
                    fullWidth
                    margin="normal"
                    value={formData.resultUnit}
                    onChange={(e) => handleChange("resultUnit", e.target.value)}
                    sx={fieldSx}
                  >
                    {availableUnits.map((unit) => (
                      <MenuItem key={unit} value={unit}>
                        {unit}
                      </MenuItem>
                    ))}
                  </TextField>
                </Paper>
              </Grid>
            </Grid>
          )}

          {selectedAction === "COMPARE" && (
            <Grid container spacing={1.5} alignItems="stretch" justifyContent="center">
              <Grid item xs={12} md={5}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.8,
                    borderRadius: "28px",
                    border: "1px solid rgba(117,130,198,0.24)",
                    background: "rgba(11,17,35,0.58)",
                    height: "100%",
                  }}
                >
                  <Typography sx={{ color: "#b8c3ec", mb: 1, fontSize: "0.94rem" }}>
                    VALUE 1
                  </Typography>
                  <TextField
                    placeholder="Value 1"
                    type="number"
                    fullWidth
                    margin="normal"
                    value={formData.value1}
                    onChange={(e) => handleChange("value1", e.target.value)}
                    sx={fieldSx}
                  />
                  <TextField
                    select
                    label="Unit 1"
                    fullWidth
                    margin="normal"
                    value={formData.unit1}
                    onChange={(e) => handleChange("unit1", e.target.value)}
                    sx={fieldSx}
                  >
                    {availableUnits.map((unit) => (
                      <MenuItem key={unit} value={unit}>
                        {unit}
                      </MenuItem>
                    ))}
                  </TextField>
                </Paper>
              </Grid>

              <Grid item xs={12} md={5}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.8,
                    borderRadius: "28px",
                    border: "1px solid rgba(117,130,198,0.24)",
                    background: "rgba(11,17,35,0.58)",
                    height: "100%",
                  }}
                >
                  <Typography sx={{ color: "#b8c3ec", mb: 1, fontSize: "0.94rem" }}>
                    VALUE 2
                  </Typography>
                  <TextField
                    placeholder="Value 2"
                    type="number"
                    fullWidth
                    margin="normal"
                    value={formData.value2}
                    onChange={(e) => handleChange("value2", e.target.value)}
                    sx={fieldSx}
                  />
                  <TextField
                    select
                    label="Unit 2"
                    fullWidth
                    margin="normal"
                    value={formData.unit2}
                    onChange={(e) => handleChange("unit2", e.target.value)}
                    sx={fieldSx}
                  >
                    {availableUnits.map((unit) => (
                      <MenuItem key={unit} value={unit}>
                        {unit}
                      </MenuItem>
                    ))}
                  </TextField>
                </Paper>
              </Grid>
            </Grid>
          )}

          {selectedAction === "ARITHMETIC" && (
            <Grid container spacing={1.5} alignItems="stretch" justifyContent="center">
              <Grid item xs={12} md={4}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.8,
                    borderRadius: "28px",
                    border: "1px solid rgba(117,130,198,0.24)",
                    background: "rgba(11,17,35,0.58)",
                    height: "100%",
                  }}
                >
                  <Typography sx={{ color: "#b8c3ec", mb: 1, fontSize: "0.94rem" }}>
                    VALUE 1
                  </Typography>
                  <TextField
                    placeholder="Value 1"
                    type="number"
                    fullWidth
                    margin="normal"
                    value={formData.value1}
                    onChange={(e) => handleChange("value1", e.target.value)}
                    sx={fieldSx}
                  />
                  <TextField
                    select
                    label="Unit 1"
                    fullWidth
                    margin="normal"
                    value={formData.unit1}
                    onChange={(e) => handleChange("unit1", e.target.value)}
                    sx={fieldSx}
                  >
                    {availableUnits.map((unit) => (
                      <MenuItem key={unit} value={unit}>
                        {unit}
                      </MenuItem>
                    ))}
                  </TextField>
                </Paper>
              </Grid>

              <Grid item xs={12} md={2}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.8,
                    borderRadius: "28px",
                    border: "1px solid rgba(117,130,198,0.24)",
                    background: "rgba(11,17,35,0.58)",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    select
                    label="Operator"
                    fullWidth
                    value={formData.operator}
                    onChange={(e) => handleChange("operator", e.target.value)}
                    sx={fieldSx}
                  >
                    <MenuItem value="ADD">+</MenuItem>
                    <MenuItem value="SUBTRACT">-</MenuItem>
                    <MenuItem value="DIVIDE">/</MenuItem>
                  </TextField>
                </Paper>
              </Grid>

              <Grid item xs={12} md={4}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.8,
                    borderRadius: "28px",
                    border: "1px solid rgba(117,130,198,0.24)",
                    background: "rgba(11,17,35,0.58)",
                    height: "100%",
                  }}
                >
                  <Typography sx={{ color: "#b8c3ec", mb: 1, fontSize: "0.94rem" }}>
                    VALUE 2
                  </Typography>
                  <TextField
                    placeholder="Value 2"
                    type="number"
                    fullWidth
                    margin="normal"
                    value={formData.value2}
                    onChange={(e) => handleChange("value2", e.target.value)}
                    sx={fieldSx}
                  />
                  <TextField
                    select
                    label="Unit 2"
                    fullWidth
                    margin="normal"
                    value={formData.unit2}
                    onChange={(e) => handleChange("unit2", e.target.value)}
                    sx={fieldSx}
                  >
                    {availableUnits.map((unit) => (
                      <MenuItem key={unit} value={unit}>
                        {unit}
                      </MenuItem>
                    ))}
                  </TextField>
                </Paper>
              </Grid>
            </Grid>
          )}
        </Paper>

        <Box display="flex" justifyContent="center" mb={2.4}>
          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={loading}
            sx={{
              minWidth: 126,
              px: 3.4,
              py: 1.12,
              borderRadius: "999px",
              textTransform: "none",
              fontWeight: 700,
              fontSize: "0.95rem",
              letterSpacing: "0.01em",
              boxShadow: "0 10px 32px rgba(95, 112, 255, 0.46)",
              background:
                "linear-gradient(90deg, rgba(80,107,243,0.95), rgba(132,93,240,0.95))",
              "&:hover": {
                background:
                  "linear-gradient(90deg, rgba(74,100,228,0.95), rgba(123,87,226,0.95))",
              },
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Calculate"
            )}
          </Button>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 2.6 },
            borderRadius: "30px",
            border: "1px solid rgba(123, 139, 211, 0.28)",
            background: "rgba(8,12,27,0.62)",
            minHeight: 118,
          }}
        >
          <Typography
            variant="subtitle2"
            color="rgba(195,208,255,0.75)"
            sx={{ letterSpacing: "0.08em" }}
            mb={1}
          >
            RESULT
          </Typography>

          <Divider sx={{ mb: 2, borderColor: "rgba(124,140,206,0.22)" }} />

          {renderResult()}
        </Paper>
      </Box>

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

export default Dashboard;

const fieldSx = {
  mt: 0.85,
  "& .MuiInputBase-root": {
    color: "#f2f6ff",
    height: 42,
    borderRadius: "18px",
    background: "linear-gradient(90deg, rgba(41,46,67,0.52), rgba(29,34,52,0.58))",
    fontSize: "0.86rem",
    "& fieldset": {
      borderColor: "rgba(138,150,206,0.24)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(165,178,236,0.44)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "rgba(151,172,255,0.68)",
    },
  },
  "& .MuiInputLabel-root": {
    color: alpha("#dce5ff", 0.74),
    fontSize: "0.86rem",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#dde6ff",
  },
  "& .MuiOutlinedInput-input::placeholder": {
    color: "rgba(215,223,255,0.7)",
    opacity: 1,
  },
};
