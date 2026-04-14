import React from "react";
import { Container, Typography, Button, Box, Grid, Card, CardContent, CardMedia } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { motion } from "motion/react";
import { Compass, Leaf, Shield, Globe } from "lucide-react";

const Home: React.FC = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Box sx={{ 
        background: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "80vh",
        display: "flex",
        alignItems: "center",
        color: "white",
        mb: 8
      }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography variant="h1" sx={{ fontWeight: 800, fontSize: { xs: "3rem", md: "5rem" }, mb: 2 }}>
              Travel Green, <br /> Wander Free.
            </Typography>
            <Typography variant="h5" sx={{ mb: 4, maxWidth: "600px", fontWeight: 400, opacity: 0.9 }}>
              Discover eco-friendly destinations, plan sustainable trips, and reduce your carbon footprint while exploring the world.
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button component={RouterLink} to="/signup" variant="contained" size="large" sx={{ px: 4, py: 1.5, fontSize: "1.1rem" }}>
                Start Planning
              </Button>
              <Button component={RouterLink} to="/dashboard" variant="outlined" size="large" sx={{ px: 4, py: 1.5, fontSize: "1.1rem", color: "white", borderColor: "white", "&:hover": { borderColor: "white", bgcolor: "rgba(255,255,255,0.1)" } }}>
                Explore
              </Button>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 12 }}>
        <Typography variant="h3" align="center" sx={{ fontWeight: 700, mb: 8 }}>
          Why Choose EcoWander?
        </Typography>
        <Grid container spacing={4}>
          {[
            { title: "Eco-Friendly Stays", desc: "We prioritize hotels and lodges with verified sustainability certifications.", icon: <Leaf className="text-green-600" size={40} /> },
            { title: "Carbon Tracking", desc: "Estimate and offset the carbon footprint of your flights and local travel.", icon: <Globe className="text-blue-600" size={40} /> },
            { title: "Local Impact", desc: "Discover attractions that support local communities and conservation.", icon: <Compass className="text-orange-600" size={40} /> },
            { title: "Secure Planning", desc: "Save your itineraries and share them securely with your travel companions.", icon: <Shield className="text-purple-600" size={40} /> },
          ].map((feature, i) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
              <motion.div
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card sx={{ height: "100%", textAlign: "center", p: 2, borderRadius: 4, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
                  <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>{feature.icon}</Box>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>{feature.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{feature.desc}</Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{ bgcolor: "primary.main", color: "white", py: 10 }}>
        <Container maxWidth="md" sx={{ textAlign: "center" }}>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 3 }}>
            Ready for your next sustainable adventure?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Join thousands of eco-conscious travelers making a difference.
          </Typography>
          <Button component={RouterLink} to="/signup" variant="contained" color="secondary" size="large" sx={{ px: 6, py: 2, fontSize: "1.2rem", fontWeight: 600, bgcolor: "white", color: "primary.main", "&:hover": { bgcolor: "#f3f4f6" } }}>
            Create Free Account
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
