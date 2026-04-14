import React from "react";
import { Box, Container, Typography, Link } from "@mui/material";
import Navbar from "./Navbar";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "#f9fafb" }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        {children}
      </Box>
      <Box component="footer" sx={{ py: 6, px: 2, mt: "auto", backgroundColor: "white", borderTop: "1px solid #e5e7eb" }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            {"Copyright © "}
            <Link color="inherit" href="/">
              EcoWander
            </Link>{" "}
            {new Date().getFullYear()}
            {"."}
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
            Sustainable travel for a better planet.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
