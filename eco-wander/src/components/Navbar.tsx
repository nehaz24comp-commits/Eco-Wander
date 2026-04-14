import React from "react";
import { AppBar, Toolbar, Typography, Button, Box, Container } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Leaf } from "lucide-react";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <AppBar position="sticky" color="default" elevation={1} sx={{ backgroundColor: "rgba(255, 255, 255, 0.8)", backdropFilter: "blur(8px)" }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Box component={RouterLink} to="/" sx={{ display: "flex", alignItems: "center", textDecoration: "none", color: "primary.main", mr: 4 }}>
            <Leaf size={28} className="text-green-600 mr-2" />
            <Typography variant="h6" component="div" sx={{ fontWeight: 700, color: "text.primary" }}>
              EcoWander
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1, display: "flex", gap: 2 }}>
            {user && (
              <>
                <Button component={RouterLink} to="/dashboard" color="inherit">Dashboard</Button>
                <Button component={RouterLink} to="/saved-trips" color="inherit">My Trips</Button>
                {user.isAdmin && (
                  <Button component={RouterLink} to="/admin" color="primary" sx={{ fontWeight: 700 }}>Admin Portal</Button>
                )}
              </>
            )}
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            {user ? (
              <>
                <Typography variant="body2" sx={{ alignSelf: "center", mr: 2, color: "text.secondary" }}>
                  Hi, {user.name}
                </Typography>
                <Button variant="outlined" color="primary" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button component={RouterLink} to="/login" color="inherit">Login</Button>
                <Button component={RouterLink} to="/signup" variant="contained" color="primary">Signup</Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
