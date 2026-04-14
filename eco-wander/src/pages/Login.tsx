import React, { useState } from "react";
import { Container, Paper, Typography, Button, Box, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { LogIn } from "lucide-react";

const Login: React.FC = () => {
  const [error, setError] = useState("");
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setError("");
    try {
      await loginWithGoogle();
      navigate("/dashboard");
    } catch (err: any) {
      if (err.code === "auth/unauthorized-domain") {
        setError("This domain is not authorized in Firebase. Please add this URL to your Firebase Console > Authentication > Settings > Authorized domains.");
      } else {
        setError("Login failed. Please try again.");
      }
      console.error("Login error:", err);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 700 }}>
          Welcome Back
        </Typography>
        <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
          Log in to manage your eco-trips
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Button
          fullWidth
          variant="contained"
          color="primary"
          size="large"
          onClick={handleGoogleLogin}
          startIcon={<LogIn size={20} />}
          sx={{ mt: 3, mb: 2, py: 1.5 }}
        >
          Login with Google
        </Button>

        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            We use Google for secure, eco-friendly authentication.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
