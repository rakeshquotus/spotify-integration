import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
import { Request, Response } from 'express';

// Replace with a dynamic method in production
const accessToken = process.env.SPOTIFY_ACCESS_TOKEN as string;

export const getSongs = async (req: Request, res: Response) => {
  try {
    const response = await axios.get('https://api.spotify.com/v1/me/top/tracks?limit=10', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const topTracks = response.data.items.map((track: any) => ({
      name: track.name,
      artists: track.artists.map((a: any) => a.name).join(', '),
      album: track.album.name,
      uri: track.uri,
      preview_url: track.preview_url,
    }));

    res.json({ topTracks });
  } catch (error: any) {
    console.error('Error fetching top tracks:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch top tracks from Spotify' });
  }
};


export const pausePlayback = async (req: Request, res: Response) => {
  const accessToken = process.env.SPOTIFY_ACCESS_TOKEN as string;
  const { device_id } = req.query;

  try {
    const url = device_id
      ? `https://api.spotify.com/v1/me/player/pause?device_id=${device_id}`
      : `https://api.spotify.com/v1/me/player/pause`;

    await axios.put(
      url,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({ message: "Playback paused successfully" });
  } catch (error: any) {
    console.error("Error pausing playback:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data || "Failed to pause playback",
    });
  }
};


