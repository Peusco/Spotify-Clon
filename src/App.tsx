import { useState } from "react";
import "./App.css";
import { type Token, Artist } from "./types/Types";

const CLIENT_ID = "97362199d7f74269bdb541165bb7fdd0";
const URI = "http://localhost:5173/";
const CLIENT_SECRET = "d4d7413c59c040aa823025b12655650c";

function App() {
  const [token, setToken] = useState(localStorage.getItem("access_token"));
  const [artist, setArtis] = useState({});
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
      "https://api.spotify.com/v1/artists/4ShgdWtm52xvEr8uYmT0V6?si=X7YS7FGoSryLLdyKT8JjDA",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer  ${token}`,
        },
      }
    );

    const data: Artist = await response.json();
    console.log(data.name);
  };

  return (
    <>
      <div>
        <button onClick={handleClick}>Login</button>
        {token != "" ? (
          <button onClick={handleArtist}>Get Artist</button>
        ) : (
          "No hay Token"
        )}
      </div>
    </>
  );
}

export default App;
