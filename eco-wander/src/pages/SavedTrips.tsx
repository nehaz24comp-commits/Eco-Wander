import React, { useState, useEffect } from "react";
import { Container, Typography, Box, Grid, Card, CardContent, Button, Chip, Skeleton, IconButton } from "@mui/material";
import { Trash2, MapPin, Calendar, DollarSign, Leaf } from "lucide-react";
import { db } from "../lib/firebase";
import { collection, query, where, onSnapshot, deleteDoc, doc, orderBy } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";

const SavedTrips: React.FC = () => {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "trips"),
      where("userId", "==", user.id)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tripData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTrips(tripData);
      setLoading(false);
    }, (error) => {
      console.error("Firestore error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const deleteTrip = async (id: string) => {
    try {
      await deleteDoc(doc(db, "trips", id));
    } catch (err) {
      console.error("Error deleting trip:", err);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Skeleton variant="text" width="30%" height={50} sx={{ mb: 4 }} />
        <Grid container spacing={3}>
          {[1, 2].map(i => (
            <Grid size={{ xs: 12 }} key={i}><Skeleton variant="rectangular" height={150} sx={{ borderRadius: 4 }} /></Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>My Eco-Trips</Typography>
        <Typography variant="h6" color="text.secondary">Your collection of sustainable adventures.</Typography>
      </Box>

      {trips.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 10 }}>
          <Typography variant="h5" color="text.secondary" gutterBottom>No trips saved yet.</Typography>
          <Button variant="contained" href="/dashboard">Start Exploring</Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {trips.map((trip) => (
            <Grid size={{ xs: 12 }} key={trip.id}>
              <Card sx={{ borderRadius: 4, border: "1px solid #e5e7eb", boxShadow: "none", overflow: "hidden" }}>
                <CardContent sx={{ p: 3 }}>
                  <Grid container spacing={2} sx={{ alignItems: "center" }}>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <MapPin size={20} className="text-green-600 mr-2" />
                        <Typography variant="h5" sx={{ fontWeight: 700 }}>{trip.city}</Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">{trip.hotelName}</Typography>
                    </Grid>
                    
                    <Grid size={{ xs: 6, md: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Calendar size={16} className="text-gray-400 mr-2" />
                        <Typography variant="body2">{trip.duration} Nights</Typography>
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 6, md: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <DollarSign size={16} className="text-gray-400 mr-2" />
                        <Typography variant="body2">${trip.budget}</Typography>
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 10, md: 3 }}>
                      <Chip 
                        icon={<Leaf size={14} />} 
                        label={`${trip.carbonFootprint} kg CO₂`} 
                        color="success" 
                        variant="outlined" 
                      />
                    </Grid>

                    <Grid size={{ xs: 2, md: 1 }} sx={{ textAlign: "right" }}>
                      <IconButton color="error" onClick={() => deleteTrip(trip.id)}>
                        <Trash2 size={20} />
                      </IconButton>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default SavedTrips;
