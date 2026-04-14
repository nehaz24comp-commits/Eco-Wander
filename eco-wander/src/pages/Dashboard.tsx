import React, { useState } from "react";
import { Container, Typography, TextField, Button, Box, Grid, Card, CardContent, CardMedia, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Search as SearchIcon, MapPin, TrendingUp, Award } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "motion/react";

const Dashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Welcome back, {user?.name}! 🌿
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Where would you like to wander sustainably today?
        </Typography>
      </Box>

      {/* Search Bar */}
      <Paper elevation={0} sx={{ p: 4, mb: 8, borderRadius: 4, bgcolor: "white", border: "1px solid #e5e7eb" }}>
        <form onSubmit={handleSearch}>
          <Grid container spacing={2} sx={{ alignItems: "center" }}>
            <Grid size={{ xs: 12, md: 9 }}>
              <TextField
                fullWidth
                placeholder="Search city (e.g., Kyoto, Amsterdam, Costa Rica)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: <SearchIcon className="text-gray-400 mr-2" size={20} />,
                  }
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <Button fullWidth variant="contained" size="large" type="submit" sx={{ py: 1.5 }}>
                Explore Eco-Options
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Grid container spacing={4}>
        {/* Quick Stats */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: 4, height: "100%", border: "1px solid #e5e7eb", boxShadow: "none" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <TrendingUp className="text-green-600 mr-2" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Your Impact</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 800, color: "primary.main" }}>0 kg</Typography>
              <Typography variant="body2" color="text.secondary">CO₂ saved this year through sustainable choices.</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Eco Tips */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ borderRadius: 4, height: "100%", border: "1px solid #e5e7eb", boxShadow: "none" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Award className="text-orange-600 mr-2" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Eco-Travel Tip of the Day</Typography>
              </Box>
              <Typography variant="body1" sx={{ mb: 2, fontStyle: "italic" }}>
                "Pack a reusable water bottle and a set of bamboo utensils to reduce single-use plastic waste during your travels."
              </Typography>
              <Button size="small" color="primary">Read more tips</Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Destinations */}
        <Grid size={{ xs: 12 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, mt: 4 }}>Trending Eco-Destinations</Typography>
          <Grid container spacing={3}>
            {[
              { name: "Costa Rica", img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80", tag: "Biodiversity" },
              { name: "Iceland", img: "https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=800&q=80", tag: "Clean Energy" },
              { name: "Bhutan", img: "https://images.unsplash.com/photo-1524230507669-5ff97982bb5e?auto=format&fit=crop&w=800&q=80", tag: "Carbon Negative" },
            ].map((dest, i) => (
              <Grid size={{ xs: 12, sm: 4 }} key={i}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card 
                    sx={{ 
                      borderRadius: 4, 
                      overflow: "hidden", 
                      cursor: "pointer", 
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                      "&:hover": { borderColor: "primary.main" },
                      transition: "border-color 0.3s"
                    }} 
                    onClick={() => navigate(`/search?q=${dest.name}`)}
                  >
                    <CardMedia component="img" height="200" image={dest.img} alt={dest.name} />
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>{dest.name}</Typography>
                      <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                        <MapPin size={14} className="text-gray-400 mr-1" />
                        <Typography variant="caption" color="text.secondary">{dest.tag}</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
