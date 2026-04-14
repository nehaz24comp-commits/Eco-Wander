import React, { useState, useEffect } from "react";
import { Container, Typography, Box, Grid, Card, CardContent, TextField, Button, Paper, Divider, Alert } from "@mui/material";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Calculator, Plane, Car, Leaf, Save } from "lucide-react";
import api from "../lib/api";
import { db } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";

const TripPlanner: React.FC = () => {
  const [searchParams] = useSearchParams();
  const city = searchParams.get("city");
  const hotelName = searchParams.get("hotel");
  const hotelPrice = parseFloat(searchParams.get("price") || "0") || 0;
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const [duration, setDuration] = useState(3);
  const [distance, setDistance] = useState(1000);
  const [travelType, setTravelType] = useState("flight");
  const [carbon, setCarbon] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const estimateCarbon = async () => {
      try {
        const res = await api.post("/carbon/estimate", { type: travelType, distance });
        setCarbon(res.data.carbon_kg);
      } catch (err) {
        setCarbon(distance * 0.15);
      }
    };
    estimateCarbon();
  }, [distance, travelType]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setError("");
    try {
      await addDoc(collection(db, "trips"), {
        userId: user.id,
        city,
        hotelName,
        hotelPrice,
        duration,
        budget: hotelPrice * duration + 200,
        carbonFootprint: carbon,
        createdAt: serverTimestamp()
      });
      navigate("/saved-trips");
    } catch (err) {
      console.error("Error saving trip:", err);
      setError("Failed to save trip. Please check your Firestore rules.");
    } finally {
      setSaving(false);
    }
  };

  const totalCost = hotelPrice * duration;

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>Trip Summary</Typography>
        <Typography variant="h6" color="text.secondary">Finalize your eco-friendly itinerary for {city}.</Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper sx={{ p: 4, borderRadius: 4, mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Trip Details</Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <TextField
                label="Duration (Nights)"
                type="number"
                fullWidth
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
              />
              <Box>
                <Typography variant="subtitle2" gutterBottom>Travel Mode to {city}</Typography>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button 
                    variant={travelType === "flight" ? "contained" : "outlined"} 
                    startIcon={<Plane size={18} />}
                    onClick={() => setTravelType("flight")}
                    sx={{ flex: 1 }}
                  >
                    Flight
                  </Button>
                  <Button 
                    variant={travelType === "car" ? "contained" : "outlined"} 
                    startIcon={<Car size={18} />}
                    onClick={() => setTravelType("car")}
                    sx={{ flex: 1 }}
                  >
                    Car
                  </Button>
                </Box>
              </Box>
              <TextField
                label="Estimated Travel Distance (km)"
                type="number"
                fullWidth
                value={distance}
                onChange={(e) => setDistance(parseInt(e.target.value) || 0)}
              />
            </Box>
          </Paper>

          <Card sx={{ borderRadius: 4, bgcolor: "rgba(76, 175, 80, 0.1)", border: "1px solid #4caf50", boxShadow: "none" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Leaf className="text-green-600 mr-2" />
                <Typography variant="h6" sx={{ fontWeight: 700, color: "green" }}>Carbon Footprint</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>{carbon} kg CO₂</Typography>
              <Typography variant="body2" color="text.secondary">
                This trip's estimated emissions. Consider donating to a reforestation project to offset this.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ p: 4, borderRadius: 4, position: "sticky", top: 100 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Cost Breakdown</Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <Typography color="text.secondary">Hotel ({duration} nights)</Typography>
              <Typography sx={{ fontWeight: 600 }}>${totalCost}</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <Typography color="text.secondary">Estimated Meals/Local</Typography>
              <Typography sx={{ fontWeight: 600 }}>$200</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Total Estimate</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main" }}>${totalCost + 200}</Typography>
            </Box>
            <Button 
              fullWidth 
              variant="contained" 
              size="large" 
              startIcon={<Save size={18} />}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Trip to Profile"}
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TripPlanner;
