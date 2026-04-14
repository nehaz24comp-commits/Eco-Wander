import React, { useState } from "react";
import { Container, Paper, Typography, Button, Box, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { UserPlus } from "lucide-react";

const Signup: React.FC = () => {
  const [error, setError] = useState("");
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSignup = async () => {
    setError("");
    try {
      await loginWithGoogle();
      navigate("/dashboard");
    } catch (err: any) {
      if (err.code === "auth/unauthorized-domain") {
        setError("This domain is not authorized in Firebase. Please add this URL to your Firebase Console > Authentication > Settings > Authorized domains.");
      } else {
        setError("Signup failed. Please try again.");
      }
      console.error("Signup error:", err);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 700 }}>
          Join EcoWander
        </Typography>
        <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
          Start your sustainable travel journey today
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Button
          fullWidth
          variant="contained"
          color="primary"
          size="large"
          onClick={handleGoogleSignup}
          startIcon={<UserPlus size={20} />}
          sx={{ mt: 3, mb: 2, py: 1.5 }}
        >
          Sign Up with Google
        </Button>

        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Quick, secure, and eco-friendly signup with your Google account.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Signup;
