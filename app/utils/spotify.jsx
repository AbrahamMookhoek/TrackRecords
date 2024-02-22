import { Track } from "../shared_objects/Track";
import { writeTracksToFirestore, updateTracks } from "@/app/firebase/firebase";
import { useTrackStore } from "../store/trackStore";

export default async function refreshAccessToken(refresh_token) {
  var refresh_token = refresh_token;
  var authOptions = {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        new Buffer.from(
          process.env.SPOTIFY_CLIENT_ID +
            ":" +
            process.env.SPOTIFY_CLIENT_SECRET,
        ).toString("base64"),
    },
    body: `grant_type=refresh_token&refresh_token=${refresh_token}`,
    cache: "no-cache",
    json: true,
  };

  const res = await fetch(
    "https://accounts.spotify.com/api/token",
    authOptions,
  );
  const info = await res.json();

  return info;
}

export async function spotifyGetSavedTracks(access_token) {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + access_token);

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  var tracks_added = [];
  var tracks_played = [];
  var artistsNameArray = [];
  var artistsLinkArray = [];
  var nextSongBatchLink = "";
  // below 2 variables are purely for debugging
  var count = 0;
  var count_iter = 0;

  // get all tracks in saved library
  await fetch("https://api.spotify.com/v1/me/tracks?limit=50", requestOptions)
    .then((response) => {
      return response.json()
    })
    .then((result) => {
      nextSongBatchLink = result.next;
      count += result.items.length;

      result.items.forEach((item) => {
        artistsNameArray = [];
        artistsLinkArray = [];

        if (item != undefined) {
          item.track.artists.forEach((artist) => {
            artistsNameArray.push(artist.name);
            artistsLinkArray.push(artist.external_urls.spotify);
          });

          var date_added = item.added_at;
          date_added = date_added.split("T")[0];

          tracks_added.push(
            new Track(
              item.track.uri,
              date_added + "|Saved Songs",
              [],
              item.track.album.images.length !== 0
                ? item.track.album.images[item.track.album.images.length - 1]
                    .url
                : "Unknown",
              item.track.album.name,
              artistsNameArray,
              artistsLinkArray,
              item.track.duration_ms,
              item.track.external_urls.spotify,
              item.track.name,
            ),
          );

          count_iter += 1;
        }
      });
    })
    .catch((error) => console.log("error", error));

  while (nextSongBatchLink != null) {
    await fetch(nextSongBatchLink, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        nextSongBatchLink = result.next;
        count += result.items.length;

        result.items.forEach((item) => {
          artistsNameArray = [];
          artistsLinkArray = [];

          if (item != undefined) {
            item.track.artists.forEach((artist) => {
              artistsNameArray.push(artist.name);
              artistsLinkArray.push(artist.external_urls.spotify);
            });

            var date_added = item.added_at;
            date_added = date_added.split("T")[0];

            tracks_added.push(
              new Track(
                item.track.uri,
                date_added + "|Saved Songs",
                [],
                item.track.album.images.length !== 0
                  ? item.track.album.images[item.track.album.images.length - 1]
                      .url
                  : "Unknown",
                item.track.album.name,
                artistsNameArray,
                artistsLinkArray,
                item.track.duration_ms,
                item.track.external_urls.spotify,
                item.track.name,
              ),
            );

            count_iter += 1;
          }
        });
      })
      .catch((error) => console.log("error", error));
    // console.log("total songs:",count)
    console.log("saved songs:", count_iter);
    console.log("array lengt:", tracks_added.length);
    // console.log(nextSongBatchLink)
    // console.log("\n")
  }

  console.log(tracks_played);

  // await writeTracksToFirestore(user_name, tracks);

  return tracks_added;
}

export async function getRecentlyPlayed(access_token){
   // get recently listened to
   await fetch(
    "https://api.spotify.com/v1/me/player/recently-played?limit=50",
    requestOptions,
  )
    .then((response) => response.json())
    .then((result) => {
      // nextSongBatchLink = result.next;
      count += result.items.length;

      result.items.forEach((item) => {
        artistsNameArray = [];
        artistsLinkArray = [];

        if (item != undefined) {
          item.track.artists.forEach((artist) => {
            artistsNameArray.push(artist.name);
            artistsLinkArray.push(artist.external_urls.spotify);
          });

          tracks_played.push(
            new Track(
              item.track.uri,
              [],
              [item.played_at],
              item.track.album.images.length !== 0
                ? item.track.album.images[item.track.album.images.length - 1]
                    .url
                : "Unknown",
              item.track.album.name,
              artistsNameArray,
              artistsLinkArray,
              item.track.duration_ms,
              item.track.external_urls.spotify,
              item.track.name,
            ),
          );

          count_iter += 1;
        }
      });
    })
    .catch((error) => console.log("error", error));
  // console.log("total songs:", count);
  // console.log("saved songs:", count_iter);
  // console.log(nextSongBatchLink)
  // console.log("\n")

  while (nextSongBatchLink != null) {
    await fetch(nextSongBatchLink, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        nextSongBatchLink = result.next;
        count += result.items.length;

        result.items.forEach((item) => {
          artistsNameArray = [];
          artistsLinkArray = [];

          if (item != undefined) {
            item.track.artists.forEach((artist) => {
              artistsNameArray.push(artist.name);
              artistsLinkArray.push(artist.external_urls.spotify);
            });

            var date_added = item.added_at;
            date_added = date_added.split("T")[0];

            tracks_played.push(
              new Track(
                item.track.uri,
                [],
                [item.played_at],
                item.track.album.images.length !== 0
                  ? item.track.album.images[item.track.album.images.length - 1]
                      .url
                  : "Unknown",
                item.track.album.name,
                artistsNameArray,
                artistsLinkArray,
                item.track.duration_ms,
                item.track.external_urls.spotify,
                item.track.name,
              ),
            );

            count_iter += 1;
          }
        });
      })
      .catch((error) => console.log("error", error));
    // console.log("total songs:",count)
    console.log("saved songs:", count_iter);
    console.log("array length:", tracks.length);
    // console.log(nextSongBatchLink)
    // console.log("\n")
  }
}

export function createCalendarEvents(tracks) {
  if (tracks === undefined) {
    return [];
  }
  var events = [];

  const tracksByDay = new Map();
  tracks.forEach((track) => {
    // Extract the date part from the timestamp
    const dateKey = track.added_at.substring(0, 10);

    if (tracksByDay.has(dateKey)) {
      // If the date key exists, add the track to the existing array
      tracksByDay.get(dateKey).push(track);
    } else {
      // If the date key doesn't exist, create a new array with the track
      tracksByDay.set(dateKey, [track]);
    }
  });

  tracksByDay.forEach((tracksForDate, date) => {
    let currTrack = {
      title: tracksForDate.length + " Added",
      color: "green",
      start: date,
      id: "addedTrack",
    };

    events.push(currTrack);
  });

  console.log("Events Generated", events);

  return [tracksByDay, events];
}
