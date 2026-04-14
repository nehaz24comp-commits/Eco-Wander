import React, { useState, useEffect } from "react";
import { Container, Typography, Box, Grid, Card, CardContent, Button, Chip, Skeleton, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from "@mui/material";
import { Trash2, Edit, Plus, MapPin, Calendar, DollarSign, Leaf, User as UserIcon } from "lucide-react";
import { db } from "../lib/firebase";
import { collection, query, onSnapshot, deleteDoc, doc, orderBy, updateDoc, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

const AdminPortal: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTrip, setEditingTrip] = useState<any>(null);
  const [formData, setFormData] = useState({
    userId: "",
    city: "",
    hotelName: "",
    hotelPrice: 0,
    duration: 1,
    budget: 0,
    carbonFootprint: 0,
    travelType: "flight"
  });

  useEffect(() => {
    if (!user?.isAdmin) return;

    const q = query(collection(db, "trips"), orderBy("createdAt", "desc"));
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

  if (authLoading) return null;
  if (!user?.isAdmin) return <Navigate to="/dashboard" />;

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      try {
        await deleteDoc(doc(db, "trips", id));
      } catch (err) {
        console.error("Error deleting trip:", err);
      }
    }
  };

  const handleOpenDialog = (trip: any = null) => {
    if (trip) {
      setEditingTrip(trip);
      setFormData({
        userId: trip.userId,
        city: trip.city,
        hotelName: trip.hotelName || "",
        hotelPrice: trip.hotelPrice || 0,
        duration: trip.duration,
        budget: trip.budget || 0,
        carbonFootprint: trip.carbonFootprint,
        travelType: trip.travelType || "flight"
      });
    } else {
      setEditingTrip(null);
      setFormData({
        userId: "",
        city: "",
        hotelName: "",
        hotelPrice: 0,
        duration: 1,
        budget: 0,
        carbonFootprint: 0,
        travelType: "flight"
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTrip(null);
  };

  const handleSubmit = async () => {
    try {
      if (editingTrip) {
        await updateDoc(doc(db, "trips", editingTrip.id), {
          ...formData,
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, "trips"), {
          ...formData,
          createdAt: serverTimestamp()
        });
      }
      handleCloseDialog();
    } catch (err) {
      console.error("Error saving trip:", err);
      alert("Error saving trip. Check console for details.");
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>Admin Portal</Typography>
          <Typography variant="h6" color="text.secondary">Manage all bookings and eco-trips across the platform.</Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<Plus size={20} />} 
          onClick={() => handleOpenDialog()}
          sx={{ height: "fit-content" }}
        >
          Add New Booking
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 4, overflow: "hidden", border: "1px solid #e5e7eb", boxShadow: "none" }}>
        <Table>
          <TableHead sx={{ bgcolor: "#f9fafb" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>User ID</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Destination</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Duration</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Budget</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Carbon (kg)</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Created At</TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              [1, 2, 3, 4, 5].map(i => (
                <TableRow key={i}>
                  <TableCell colSpan={7}><Skeleton variant="text" height={40} /></TableCell>
                </TableRow>
              ))
            ) : trips.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">No bookings found.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              trips.map((trip) => (
                <TableRow key={trip.id} hover>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <UserIcon size={16} className="mr-2 text-gray-400" />
                      <Typography variant="body2" sx={{ fontFamily: "monospace" }}>{trip.userId.substring(0, 8)}...</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{trip.city}</Typography>
                  </TableCell>
                  <TableCell>{trip.duration} days</TableCell>
                  <TableCell>${trip.budget?.toLocaleString()}</TableCell>
                  <TableCell>
                    <Chip 
                      label={`${trip.carbonFootprint} kg`} 
                      size="small" 
                      color={trip.carbonFootprint < 200 ? "success" : "warning"}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    {trip.createdAt?.toDate ? trip.createdAt.toDate().toLocaleDateString() : "Pending"}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" color="primary" onClick={() => handleOpenDialog(trip)}>
                      <Edit size={18} />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(trip.id)}>
                      <Trash2 size={18} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {editingTrip ? "Edit Booking" : "Add New Booking"}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12 }}>
              <TextField 
                fullWidth 
                label="User ID" 
                value={formData.userId}
                onChange={(e) => setFormData({...formData, userId: e.target.value})}
                placeholder="Firebase User UID"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField 
                fullWidth 
                label="City" 
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField 
                fullWidth 
                select
                label="Travel Mode" 
                value={formData.travelType}
                onChange={(e) => setFormData({...formData, travelType: e.target.value})}
              >
                <MenuItem value="flight">Flight</MenuItem>
                <MenuItem value="car">Car</MenuItem>
                <MenuItem value="train">Train</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField 
                fullWidth 
                type="number"
                label="Duration (Days)" 
                value={formData.duration || 0}
                onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value) || 0})}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField 
                fullWidth 
                type="number"
                label="Budget ($)" 
                value={formData.budget || 0}
                onChange={(e) => setFormData({...formData, budget: parseFloat(e.target.value) || 0})}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField 
                fullWidth 
                type="number"
                label="Carbon Footprint (kg)" 
                value={formData.carbonFootprint || 0}
                onChange={(e) => setFormData({...formData, carbonFootprint: parseFloat(e.target.value) || 0})}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editingTrip ? "Update Booking" : "Create Booking"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminPortal;
