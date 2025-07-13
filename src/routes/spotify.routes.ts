import { Express, Router } from 'express';
import axios from 'axios';
import { getSongs, pausePlayback } from '../controllers/spotify.controller';

export default (app: Express) => {
  const router = Router();

  // Mount this group under /api/spotify
  app.use('/spotify', router);

  // GET /api/spotify/top-tracks
  router.get('/top-tracks', getSongs);

  
  router.put('/pause', pausePlayback);












  // GET /api/spotify/login
router.get('/login', (req, res) => {
    const scopes = [
      'user-top-read',
      'user-read-playback-state',
      'user-modify-playback-state',
      'user-read-currently-playing'
    ].join(' ');
  
    const redirectUri = 'http://localhost:3000/api/spotify/callback';
  
    const url = `https://accounts.spotify.com/authorize` +
                `?response_type=code` +
                `&client_id=${process.env.SPOTIFY_CLIENT_ID}` +
                `&scope=${encodeURIComponent(scopes)}` +
                `&redirect_uri=${encodeURIComponent(redirectUri)}`;
  
    res.redirect(url);
  });


  // GET /api/spotify/callback
router.get('/callback', async (req, res) => {
    const code = req.query.code as string;
  
    const tokenResponse = await axios.post('https://accounts.spotify.com/api/token',
      new URLSearchParams({
        code,
        redirect_uri: 'http://localhost:3000/api/spotify/callback',
        grant_type: 'authorization_code',
      }),
      {
        headers: {
          Authorization: 'Basic ' + Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      }
    );
  
    const { access_token, refresh_token } = tokenResponse.data;
  
    // You can save to DB or return as response (for testing)
    res.json({ access_token, refresh_token });
    console.log("access token is", access_token, "refresh token is", refresh_token);
  });
  
  
};
