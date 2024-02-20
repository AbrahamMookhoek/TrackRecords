"use client"; // you need this if you want to have it loading in the background

import ListeningHistory from "./ListeningHistory";
import Calendar from "./Calendar";
import { Suspense, useEffect } from "react";
import { readTracksFromFirestore } from "../firebase/firebase";
import { spotifyGetSavedTracks } from "../utils/spotify";
import { useQuery } from "@tanstack/react-query";

import { useTrackStore } from "../store/trackStore";

export function Wrapper({ user }) {
  console.log("IN WRAPPER");

  if (user.new_session) {
    console.log(
      "This is the first time the user signs since their last session",
    );
    user.new_session = false;
  }

  // const { data, error } = useQuery({
  //   queryKey: ["tracks"],
  //   queryFn: () => spotifyGetSavedTracks(user.spotify_access_token),
  // })

  // useEffect(() => {
  //   console.log(data)
  // }, [data])

  // UNCOMMENT AND COMMENT THE ABOVE CODE TO TEST THE LOADING SCREEN
  // await spotifyGetSavedTracks(user.spotify_access_token)
  return (
    <>
      <ListeningHistory />
      <Calendar />
    </>
  );
}
