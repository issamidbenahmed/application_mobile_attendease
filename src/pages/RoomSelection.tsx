import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';

const RoomSelection = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        console.log('Chargement des salles...');
        const response = await axios.get('/api/exam-rooms');
        console.log('Salles chargées:', response.data);
        setRooms(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement des salles:', err);
        setError('Erreur lors du chargement des salles');
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleRoomSelect = (roomId: number) => {
    console.log('Salle sélectionnée:', roomId);
    router.push(`/scan/${roomId}`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Sélection de la salle d'examen
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {rooms.map((room: any) => (
          <Grid item xs={12} sm={6} md={4} key={room.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {room.name}
                </Typography>
                {room.location && (
                  <Typography color="textSecondary" gutterBottom>
                    Emplacement: {room.location}
                  </Typography>
                )}
                {room.capacity && (
                  <Typography color="textSecondary" gutterBottom>
                    Capacité: {room.capacity} places
                  </Typography>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => handleRoomSelect(room.id)}
                  sx={{ mt: 2 }}
                >
                  Sélectionner
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default RoomSelection; 