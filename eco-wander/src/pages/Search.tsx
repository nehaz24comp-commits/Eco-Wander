import React, { useState, useEffect } from "react";
import { Container, Typography, Box, Grid, Card, CardContent, CardMedia, Button, Chip, Skeleton, Alert } from "@mui/material";
import { useSearchParams, useNavigate } from "react-router-dom";
import { MapPin, Star, Leaf, ArrowRight } from "lucide-react";
import api from "../lib/api";

const Search: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!query) return;
      setLoading(true);
      try {
        const res = await api.get(`/search/city?q=${query}`);
        setData(res.data);
      } catch (err) {
        setError("Failed to fetch search results. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [query]);

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Skeleton variant="text" width="40%" height={60} sx={{ mb: 4 }} />
        <Grid container spacing={4}>
          {[1, 2, 3].map((i) => (
            <Grid size={{ xs: 12, md: 4 }} key={i}>
              <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 4, mb: 2 }} />
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="text" width="60%" />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
          Explore {query}
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Sustainable stays and attractions for your eco-trip.
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}

      {/* Images Gallery */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Gallery</Typography>
        <Grid container spacing={2}>
          {data?.images?.map((img: string, i: number) => (
            <Grid size={{ xs: 12, sm: 4 }} key={i}>
              <CardMedia component="img" height="250" image={img} sx={{ borderRadius: 4, objectFit: "cover" }} />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Grid container spacing={6}>
        {/* Hotels */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Eco-Friendly Stays</Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {data?.hotels?.map((hotel: any, i: number) => (
              <Card key={i} sx={{ display: "flex", borderRadius: 4, overflow: "hidden", border: "1px solid #e5e7eb", boxShadow: "none" }}>
                <CardMedia component="img" sx={{ width: 200, display: { xs: "none", sm: "block" } }} image={`https://picsum.photos/seed/${hotel.name}/400/400`} />
                <CardContent sx={{ flex: 1, p: 3 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>{hotel.name}</Typography>
                      <Box sx={{ display: "flex", alignItems: "center", mt: 0.5, mb: 1 }}>
                        <Star size={16} className="text-yellow-500 mr-1" fill="currentColor" />
                        <Typography variant="body2">{hotel.rating} / 5</Typography>
                      </Box>
                    </Box>
                    <Chip icon={<Leaf size={14} />} label="Eco-Certified" color="success" size="small" variant="outlined" />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Sustainable practices: Solar energy, zero-waste kitchen, local sourcing.
                  </Typography>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700 }}>
                      ${hotel.price} <Typography component="span" variant="caption" color="text.secondary">/ night</Typography>
                    </Typography>
                    <Button 
                      variant="contained" 
                      endIcon={<ArrowRight size={16} />}
                      onClick={() => navigate(`/plan?city=${query}&hotel=${hotel.name}&price=${hotel.price}`)}
                    >
                      Plan Trip
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Grid>

        {/* Attractions */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Must Visit</Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {data?.attractions?.map((attr: any, i: number) => (
              <Card key={i} sx={{ borderRadius: 4, border: "1px solid #e5e7eb", boxShadow: "none" }}>
                <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{attr.name}</Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 1 }}>
                    {attr.kinds.split(",").slice(0, 3).map((k: string, j: number) => (
                      <Chip key={j} label={k.replace("_", " ")} size="small" sx={{ fontSize: "0.65rem" }} />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Search;
