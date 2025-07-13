import express from "express";
import spotifyRoutes from "./routes/spotify.routes";

const app = express();
const PORT = 3000;

app.use(express.json());

// Mount Spotify routes under /api/spotify
spotifyRoutes(app);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
