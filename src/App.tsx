import { useState } from "react";
import "./App.css";
import { type Token, Artist } from "./types/Types";
import { type Playlist, Item } from "./types/Playlist";

const CLIENT_ID = "97362199d7f74269bdb541165bb7fdd0";
const URI = "http://localhost:5173/";
const CLIENT_SECRET = "d4d7413c59c040aa823025b12655650c";

function App() {
  const [token, setToken] = useState(localStorage.getItem("access_token"));
  const [playlist, setPlaylist] = useState<Playlist>();
  const SPOTIFY_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${URI}`;

  const autenticateUser = async () => {
    try {
      const bodyFetch = `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`;

      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        body: bodyFetch,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      const data: Token = await response.json();
      localStorage.setItem("access_token", data.access_token);
      setToken(data.access_token);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = () => {
    window.location.replace(SPOTIFY_URL);
    autenticateUser();
  };

  const handleArtist = async () => {
    const response = await fetch(
      "https://api.spotify.com/v1/playlists/3cEYpjA9oz9GiPac4AsH4n",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer  ${token}`,
        },
      }
    );

    const data: Playlist = await response.json();
    setPlaylist(data);
  };

  const trackList = () => {
    if (playlist == undefined) return;
    return (
      <ul>
        {playlist.tracks.items.map((song: Item) => {
          return <li key={song.track.id}>{song.track.name}</li>;
        })}
      </ul>
    );
  };

  return (
    <>
      <div>
        <button onClick={handleClick}>Login</button>
        {token != "" ? (
          <button onClick={handleArtist}>Get Playlist</button>
        ) : (
          "No hay Token"
        )}
        {playlist ? trackList() : "No"}
      </div>
    </>
  );
}

export default App;
