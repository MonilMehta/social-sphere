import * as React from 'react';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Grid from '@mui/joy/Grid';
import IconButton from '@mui/joy/IconButton';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Avatar from '@mui/joy/Avatar';
import Button from '@mui/joy/Button';
import { Link as Lk, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import axios from 'axios';

const posts = [
  { id: 1, imageUrl: 'https://via.placeholder.com/400', title: 'Post 1' },
  { id: 2, imageUrl: 'https://via.placeholder.com/400', title: 'Post 2' },
  { id: 3, imageUrl: 'https://via.placeholder.com/400', title: 'Post 3' },
  { id: 4, imageUrl: 'https://via.placeholder.com/400', title: 'Post 4' },
  { id: 5, imageUrl: 'https://via.placeholder.com/400', title: 'Post 5' },
  { id: 6, imageUrl: 'https://via.placeholder.com/400', title: 'Post 6' },
  { id: 7, imageUrl: 'https://via.placeholder.com/400', title: 'Post 7' },
  { id: 8, imageUrl: 'https://via.placeholder.com/400', title: 'Post 8' },
  { id: 9, imageUrl: 'https://via.placeholder.com/400', title: 'Post 9' },
];

export default function ProfilePage({ user }) {
  const { profileImage, name, followersCount } = user || {};
  const params = useParams();
  const [theUser, setTheUser] = useState()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          throw new Error('Access token not found');
        }

        const response = await axios.get(`https://social-sphere-xzkh.onrender.com/api/v1/users/profile/${params.username}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        console.log(response);

        const fetchedProfile = response.data; 
        setTheUser(fetchedProfile)
        console.log(theUser);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchProfile();
  }, []); 

  return (
    <Box sx={{ display: 'flex',flexDirection:'column' }}>
      {/* Sidebar */}
      <Navbar />
      
      <Box sx={{ display: 'flex',flexDirection:'row',marginTop:'70px' }}>
      <Sidebar />
      <Box sx={{ flex: 2 }}>
        {/* Navbar */}
        
        
        {/* Profile Content */}
        <Box sx={{ p: 4,marginLeft:'300px',marginTop:'10px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 10 }}>
          <Avatar sx={{ width: 200, height: 200 }} alt="Profile Image" src={profileImage || 'https://via.placeholder.com/150'} />
          <Box sx={{ ml: 15 }}>
            {/* Increased font size for name */}
            <Typography variant="h2" sx={{ fontSize: '3rem' }}>{name || 'John Doe'}</Typography>
            {/* Increased font size for followers count */}
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.5rem' }}>
              {followersCount || 10} followers
            </Typography>
            <Lk to="/edit-profile" style={{ textDecoration: 'none' }}>
              {/* Increased font size for Edit Profile button */}
              <Button variant="outlined" startIcon={<EditRoundedIcon />} sx={{ fontSize: '1.5rem', mt: 2 }}>
                Edit Profile
              </Button>
            </Lk>
          </Box>
          </Box>
          <Grid container spacing={3}>
            {posts.map((post) => (
              <Grid key={post.id} item xs={4}>
                <Card style={{ width: '80%'}}>
                  <CardContent>
                    <Typography variant="h6">{post.title}</Typography>
                    <img src={post.imageUrl} alt={post.title} style={{ width: '100%', marginTop: 10 }} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
    </Box>
  );
}
