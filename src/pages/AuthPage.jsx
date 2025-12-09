import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Card,
  useTheme,
  Container,
  Grid,
  Snackbar,
  Alert,
  CircularProgress,
  keyframes,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";
import FacebookIcon from "@mui/icons-material/Facebook";
import MicrosoftIcon from "@mui/icons-material/Microsoft";
import CommonButton from "../components/CommonButton";
import DynamicFormField from "../components/DynamicFormField";
import { useNavigate } from "react-router-dom";
import { setToken } from "../api/auth";
import axiosClient from "../api/axiosClient";
import ENDPOINTS from "../api/endpoints";
import APP_CONFIG from "../constants/appConfig";

// Floating animation for decorative elements
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
`;

const floatSlow = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(5deg); }
`;

// Simulated API response for signup fields
const mockFieldResponse = [
  {
    name: "firstname",
    label: "First Name",
    type: "text",
    required: true,
    length: 50,
    width: 4,
    inputWidth: "220px",
  },
  {
    name: "lastname",
    label: "Last Name",
    type: "text",
    required: true,
    length: 50,
    width: 4,
    inputWidth: "220px",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    required: true,
    length: 100,
    width: 4,
    inputWidth: "220px",
  },
  {
    name: "mobile",
    label: "Mobile Number",
    type: "text",
    required: true,
    length: 20,
    width: 4,
    inputWidth: "220px",
  },
  {
    name: "dob",
    label: "Date of Birth",
    type: "date",
    required: false,
    defaultValue: "",
    width: 4,
    inputWidth: "220px",
  },
  {
    name: "course",
    label: "Course",
    type: "select",
    options: [
      { value: "react", label: "React Fundamentals" },
      { value: "js", label: "Advanced JavaScript" },
      { value: "fullstack", label: "Full Stack Development" },
    ],
    required: true,
    defaultValue: "react",
    width: 4,
    inputWidth: "220px",
  },
  {
    name: "college",
    label: "College",
    type: "text",
    required: false,
    defaultValue: "",
    length: 100,
    width: 12,
    inputWidth: "220px",
  },
  {
    name: "mark10",
    label: "10th Mark (%)",
    type: "number",
    required: false,
    defaultValue: 0,
    width: 4,
    inputWidth: "220px",
  },
  {
    name: "mark12",
    label: "12th Mark (%)",
    type: "number",
    required: false,
    defaultValue: 0,
    width: 4,
    inputWidth: "220px",
  },
];

export default function AuthPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  // Login state
  const [loginForm, setLoginForm] = useState({ name: "", password: "" });
  const [loginErrors, setLoginErrors] = useState({});

  // Signup state
  const [signupFields, setSignupFields] = useState([]);
  const [signupForm, setSignupForm] = useState({});
  const [signupErrors, setSignupErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "info",
    message: "",
  });

  // Initialize signup fields
  useEffect(() => {
    const fetchFields = async () => {
      try {
        if (ENDPOINTS && ENDPOINTS.SIGNUP_FIELDS) {
          const res = await axiosClient.get(ENDPOINTS.SIGNUP_FIELDS);
          const data = res.data;
          setSignupFields(data);
          const initial = (data || []).reduce(
            (acc, f) => ({
              ...acc,
              [f.name]: f.defaultValue !== undefined ? f.defaultValue : "",
            }),
            {}
          );
          setSignupForm(initial);
        } else {
          setSignupFields(mockFieldResponse);
          const initial = mockFieldResponse.reduce(
            (acc, f) => ({
              ...acc,
              [f.name]: f.defaultValue !== undefined ? f.defaultValue : "",
            }),
            {}
          );
          setSignupForm(initial);
        }
      } catch (err) {
        setSignupFields(mockFieldResponse);
        const initial = mockFieldResponse.reduce(
          (acc, f) => ({
            ...acc,
            [f.name]: f.defaultValue !== undefined ? f.defaultValue : "",
          }),
          {}
        );
        setSignupForm(initial);
        setSnackbar({
          open: true,
          severity: "warning",
          message: "Unable to load form fields from server, using defaults.",
        });
      }
    };

    fetchFields();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Login validation and submission
  const validateLogin = () => {
    const newErrors = {};
    if (!loginForm.name.trim()) {
      newErrors.name = "Username is required";
    }
    if (!loginForm.password.trim()) {
      newErrors.password = "Password is required";
    }
    setLoginErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    if (!validateLogin()) return;
    setToken("demo-token");
    navigate("/home");
  };

  const handleSocialLogin = (provider) => {
    // try ENDPOINTS first
    try {
      const key1 = provider.toUpperCase();
      const key2 = provider.toLowerCase();
      // ENDPOINTS shape may vary; check common patterns
      const url =
        (ENDPOINTS && ENDPOINTS.SOCIAL_LOGIN && ENDPOINTS.SOCIAL_LOGIN[key2]) ||
        (ENDPOINTS && ENDPOINTS.SOCIAL_LOGIN && ENDPOINTS.SOCIAL_LOGIN[key1]) ||
        (ENDPOINTS && ENDPOINTS.SOCIAL_AUTH_URL) ||
        (ENDPOINTS &&
          ENDPOINTS.SOCIAL_LOGIN_URL &&
          ENDPOINTS.SOCIAL_LOGIN_URL[key2]);

      if (url) {
        // if url is a function, call it
        if (typeof url === "function") {
          window.location.href = url();
        } else {
          // append provider param if the endpoint is a generic social auth URL
          const finalUrl = url.includes("provider=")
            ? url
            : `${url}${url.includes("?") ? "&" : "?"}provider=${key2}`;
          window.location.href = finalUrl;
        }
        return;
      }

      setSnackbar({
        open: true,
        severity: "info",
        message: `Social login for ${provider} is not configured on this demo.`,
      });
    } catch (err) {
      setSnackbar({
        open: true,
        severity: "error",
        message: `Unable to start ${provider} login.`,
      });
    }
  };

  // Signup validation and submission
  const validateSignup = () => {
    const newErrors = {};
    signupFields.forEach((f) => {
      if (f.required && !signupForm[f.name]) {
        newErrors[f.name] = `${f.label} is required`;
      }
    });
    setSignupErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = () => {
    if (!validateSignup()) return;
    const submit = async () => {
      setLoading(true);
      try {
        if (ENDPOINTS && ENDPOINTS.SIGNUP) {
          await axiosClient.post(ENDPOINTS.SIGNUP, signupForm);
        } else {
          await axiosClient.post("/posts", signupForm);
        }
        setSnackbar({
          open: true,
          severity: "success",
          message: "Signup successful",
        });
        setTimeout(() => navigate("/home"), 900);
      } catch (err) {
        setSnackbar({
          open: true,
          severity: "error",
          message: "Signup failed. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    submit();
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        position: "relative",
        overflow: "hidden",
        background: `linear-gradient(135deg, 
          ${theme.palette.primary.main} 0%, 
          #2D68C4 50%, 
          #1560BD 100%)`,
      }}
    >
      {/* Animated Background Elements */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: "hidden",
          opacity: 0.1,
        }}
      >
        {/* Floating circles */}
        <Box
          sx={{
            position: "absolute",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "white",
            top: "-200px",
            left: "-100px",
            animation: `${float} 6s ease-in-out infinite`,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "white",
            bottom: "-150px",
            right: "-50px",
            animation: `${floatSlow} 8s ease-in-out infinite`,
          }}
        />
      </Box>

      {/* Main Content */}
      <Container
        maxWidth={isLogin ? "sm" : "lg"}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          zIndex: 2,
          py: 4,
        }}
      >
        <Card
          sx={{
            ...theme.custom.loginCard,
            maxWidth: isLogin ? undefined : 700,
          }}
        >
          {/* Header with Toggle Button */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Box sx={theme.custom.loginHeader}>
              {/* <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}
              >
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {APP_CONFIG.name}
                </Typography>
              </Box> */}
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  mb: 0.5,
                  background:
                    "linear-gradient(90deg, #05206A 0%, #0F4BD8 50%, #3B82F6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {APP_CONFIG.name}
              </Typography>
              {/* <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                {isLogin ? "Login" : "Create an Account"}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {isLogin
                  ? "Sign in to your account"
                  : "Fill the fields below to sign up"}
              </Typography> */}
            </Box>
          </Box>

          {/* Login Form */}
          {isLogin ? (
            <Box sx={theme.custom.loginForm}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                  Username
                </Typography>
                <DynamicFormField
                  field={{
                    name: "name",
                    label: "Username",
                    type: "text",
                    inputWidth: "100%",
                  }}
                  value={loginForm.name}
                  onChange={(fieldName, val) =>
                    setLoginForm({ ...loginForm, [fieldName]: val })
                  }
                  error={loginErrors.name}
                />
              </Box>

              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                  Password
                </Typography>
                <DynamicFormField
                  field={{
                    name: "password",
                    label: "Password",
                    type: "password",
                    inputWidth: "100%",
                  }}
                  value={loginForm.password}
                  onChange={(fieldName, val) =>
                    setLoginForm({ ...loginForm, [fieldName]: val })
                  }
                  error={loginErrors.password}
                />
              </Box>

              <CommonButton
                variant="contained"
                fullWidth
                size="large"
                onClick={handleLogin}
                sx={{ mt: 2 }}
              >
                Login
              </CommonButton>

              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Don't have an account?{" "}
                  <Typography
                    component="span"
                    sx={{
                      color: theme.palette.primary.main,
                      fontWeight: 600,
                      cursor: "pointer",
                      "&:hover": { textDecoration: "underline" },
                    }}
                    onClick={() => {
                      setIsLogin(false);
                      setLoginErrors({});
                    }}
                  >
                    Sign Up
                  </Typography>
                </Typography>
              </Box>

              {/* Social login buttons */}
              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Or continue with
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    justifyContent: "center",
                    mt: 1,
                  }}
                >
                  <GoogleIcon onClick={() => handleSocialLogin("google")} />
                  <GitHubIcon onClick={() => handleSocialLogin("github")} />
                  <MicrosoftIcon
                    onClick={() => handleSocialLogin("microsoft")}
                  />
                  <FacebookIcon onClick={() => handleSocialLogin("facebook")} />
                  {/* <CommonButton
                    variant="outlined"
                    startIcon={<GoogleIcon />}
                    onClick={() => handleSocialLogin("google")}
                    sx={{ minWidth: 180, height: "50px" }}
                  >
                    Continue with Google
                  </CommonButton>
                  <CommonButton
                    variant="outlined"
                    startIcon={<GitHubIcon />}
                    onClick={() => handleSocialLogin("github")}
                    sx={{ minWidth: 180, height: "50px" }}
                  >
                    Continue with GitHub
                  </CommonButton> */}
                </Box>
              </Box>
            </Box>
          ) : (
            /* Signup Form */
            <Box sx={theme.custom.loginForm}>
              <Grid container spacing={2}>
                {signupFields.map((field) => (
                  <Grid item xs={12} sm={field.width || 6} key={field.name}>
                    <DynamicFormField
                      field={field}
                      value={signupForm[field.name]}
                      onChange={(fieldName, val) =>
                        setSignupForm({
                          ...signupForm,
                          [fieldName]: val,
                        })
                      }
                      error={signupErrors[field.name]}
                    />
                  </Grid>
                ))}
              </Grid>

              <CommonButton
                variant="contained"
                fullWidth
                size="large"
                onClick={handleSignup}
                sx={{ mt: 2 }}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "Sign Up"
                )}
              </CommonButton>

              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Already have an account?{" "}
                  <Typography
                    component="span"
                    sx={{
                      color: theme.palette.primary.main,
                      fontWeight: 600,
                      cursor: "pointer",
                      "&:hover": { textDecoration: "underline" },
                    }}
                    onClick={() => {
                      setIsLogin(true);
                      setSignupErrors({});
                    }}
                  >
                    Login
                  </Typography>
                </Typography>
              </Box>
            </Box>
          )}
        </Card>
      </Container>

      {/* Snackbar for signup feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
