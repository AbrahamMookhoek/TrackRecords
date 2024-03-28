import { Track } from "../shared_objects/Track";
import {
  getUserEpoch,
  readListeningHistoryFromFirestore,
  writeListeningHistoryToFireStore,
} from "@/app/firebase/firebase";

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

export async function spotifyGetTracks(access_token, track_ids) {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + access_token);

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  // below 2 variables are purely for debugging
  var temp_tracks = [];

  // get all tracks in saved library
  await fetch(
    "https://api.spotify.com/v1/tracks?ids=" + track_ids,
    requestOptions,
  )
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      var artistsNameArray = [];
      var artistsLinkArray = [];

      if (result != undefined) {
        result.tracks.forEach((track) => {
          artistsNameArray = [];
          artistsLinkArray = [];

          track.artists.forEach((artist) => {
            artistsNameArray.push(artist.name);
            artistsLinkArray.push(artist.external_urls.spotify);
          });

          temp_tracks.push(
            new Track(
              track.uri.split(":").pop(),
              track.album.images.length !== 0
                ? track.album.images[track.album.images.length - 1].url
                : "Unknown",
              track.album.name,
              artistsNameArray,
              artistsLinkArray,
              track.duration_ms,
              track.external_urls.spotify,
              track.name,
              [],
              [],
            ),
          );
        });
      }
    })
    .catch((error) => console.log("error", error));

  return temp_tracks;
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
  var artistsNameArray = [];
  var artistsLinkArray = [];
  var nextSongBatchLink = "";
  // below 2 variables are purely for debugging
  var count = 0;
  var count_iter = 0;

  // get all tracks in saved library
  await fetch("https://api.spotify.com/v1/me/tracks?limit=50", requestOptions)
    .then((response) => {
      return response.json();
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

          tracks_added.push(
            new Track(
              item.track.uri.split(":").pop(),
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
              [
                {
                  name: "Liked Songs",
                  playlist_link: "",
                  added_at: item.added_at.split("T")[0],
                },
              ],
              [],
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

            tracks_added.push(
              new Track(
                item.track.uri.split(":").pop(),
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
                [
                  {
                    name: "Liked Songs",
                    playlist_link: "",
                    added_at: item.added_at.split("T")[0],
                  },
                ],
                [],
              ),
            );

            count_iter += 1;
          }
        });
      })
      .catch((error) => console.log("error", error));
  }

  console.log("Retreived all songs");

  const trackMap = new Map();
  tracks_added.forEach((track) => {
    trackMap.set(track.spotify_uri, track);
  });

  return trackMap;
}

export async function getRecentlyPlayed(access_token, username) {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + access_token);

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  var tracks_played = [];
  var artistsNameArray = [];
  var artistsLinkArray = [];
  // below 2 variables are purely for debugging
  var count = 0;
  var count_iter = 0;

  const queryParam = await getUserEpoch(username);

  // get recently listened to up to 50 songs
  // TODO: We need to somehow save the Unix Epoch time and update it everytime we run this query
  //       We can save this in Firebase under the user and slap it on to the url using "before=UNIX EPOCH TIME"
  await fetch(
    "https://api.spotify.com/v1/me/player/recently-played?limit=50" +
      queryParam,
    requestOptions,
  )
    .then((response) => response.json())
    .then((result) => {
      count += result.items.length;
      if (result.items != undefined) {
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
                item.track.uri.split(":").pop(),
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
                [],
                [item.played_at],
              ),
            );
            count_iter += 1;
          }
        });
      }
    })
    .catch((error) => console.log("error", error));

  const trackMap = new Map();

  try {
    tracks_played.forEach((track) => {
      if (trackMap.has(track.spotify_uri)) {
        let trackObj = trackMap.get(track.spotify_uri);
        trackObj.played_at.push(track.played_at[0]);
      } else {
        trackMap.set(track.spotify_uri, track);
      }
    });
  } catch (error) {
    console.log(error);
  }

  await writeListeningHistoryToFireStore(username, trackMap);

  return;
}

// Function to retrieve all playlists
async function getAllPlaylists(access_token) {
  const url = `https://api.spotify.com/v1/me/playlists`;
  return await makePaginatedRequest(url, access_token);
}

// Function to retrieve all tracks from a playlist
async function getAllPlaylistTracks(access_token, playlistId) {
  const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
  return await makePaginatedRequest(url, access_token);
}

// Function takes in the spotify url and makes paginated requests
export async function makePaginatedRequest(url, access_token) {
  const limit = 50;
  let offset = 0;
  let allItems = [];

  while (true) {
    const response = await fetch(`${url}?limit=${limit}&offset=${offset}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const items = data.items;

    if (items.length === 0) {
      break;
    }

    allItems = allItems.concat(items);
    offset += limit;
  }

  return allItems;
}

async function getAllPlaylistsAndTracks(access_token, username) {
  try {
    var tracksToReturn = [];
    const playlists = await getAllPlaylists(access_token, username);
    for (const playlist of playlists) {
      if (playlist.owner.display_name === username) {
        const playlistTracks = await getAllPlaylistTracks(
          access_token,
          playlist.id,
        );
        const tracksWithPlaylistInfo = playlistTracks.map((track) => ({
          ...track,
          playlistName: playlist.name,
          playlistId: playlist.id,
          playlistUrl: playlist.external_urls.spotify,
        }));
        tracksToReturn.push(...tracksWithPlaylistInfo);
      }
      break;
    }

    return tracksToReturn;
  } catch (error) {
    console.error("Error", error);
  }
}

export async function generateMasterSongList(access_token, username) {
  var savedTracks = await spotifyGetSavedTracks(access_token);
  var tracksFromPlaylists = await getAllPlaylistsAndTracks(
    access_token,
    username,
  );

  try {
    await getRecentlyPlayed(access_token, username);
  } catch (error) {
    console.log(error);
  }

  const listening_history = await readListeningHistoryFromFirestore(username);

  try {
    var formattedTracksFromPlaylists = [];
    tracksFromPlaylists.map((playlistItem) => {
      let artistsNameArray = [];
      let artistsLinkArray = [];

      if (playlistItem != undefined) {
        playlistItem.track.artists.forEach((artist) => {
          artistsNameArray.push(artist.name);
          artistsLinkArray.push(artist.external_urls.spotify);
        });
      }

      let trackObj = new Track(
        playlistItem.track.uri.split(":").pop(),
        playlistItem.track.album.images.length !== 0
          ? playlistItem.track.album.images[
              playlistItem.track.album.images.length - 1
            ].url
          : "Unknown",
        playlistItem.track.album.name,
        artistsNameArray,
        artistsLinkArray,
        playlistItem.track.duration_ms,
        playlistItem.track.external_urls.spotify,
        playlistItem.track.name,
        [
          {
            name: playlistItem.playlistName,
            playlist_link: playlistItem.playlistUrl,
            added_at: playlistItem.added_at.split("T")[0],
          },
        ],
        [],
      );

      playlistItem.track = trackObj;

      formattedTracksFromPlaylists.push(playlistItem);
    });
  } catch (error) {
    console.log(error);
  }

  try {
    formattedTracksFromPlaylists.forEach((playlistItem) => {
      let key = playlistItem.track.spotify_uri.split(":").pop();

      if (savedTracks.has(key)) {
        let trackObj = savedTracks.get(key);
        trackObj.playlists_added_to.push({
          name: playlistItem.playlistName,
          playlist_link: playlistItem.playlistUrl,
          added_at: playlistItem.added_at.split("T")[0],
        });
      } else {
        savedTracks.set(key, playlistItem.track);
      }
    });
  } catch (error) {
    console.log(error);
  }

  var spotify_ids = [];

  try {
    listening_history.forEach(async (doc) => {
      if (savedTracks.has(doc.id)) {
        let trackObj = savedTracks.get(doc.id);
        const docData = doc.data();
        trackObj.played_at = trackObj.played_at.concat(docData.played_at);
      } else {
        if (spotify_ids.length === 50) {
          let id_string = spotify_ids.join(",");
          let temp_tracks = await spotifyGetTracks(access_token, id_string);

          temp_tracks.forEach((track) => {
            savedTracks.set(track.spotify_uri, track);
          });

          spotify_ids = [];
        } else {
          spotify_ids.push(doc.id);
        }
      }
    });
  } catch (error) {
    console.log(error);
  }

  if (spotify_ids.length > 0) {
    let id_string = spotify_ids.join(",");
    let temp_tracks = await spotifyGetTracks(access_token, id_string);

    temp_tracks.forEach((track) => {
      savedTracks.set(track.spotify_uri, track);
    });
  }

  return savedTracks;
}

export function createCalendarEvents(tracks) {
  if (tracks === undefined) {
    return [];
  }
  var events = [];

  const addedTracksByDay = new Map();
  tracks.forEach((track_obj, track_uri) => {
    // split track_obj into 2 track obj
    track_obj.playlists_added_to.map((playlist) => {
      let tempTrack = new Track(
        track_obj.spotify_uri,
        track_obj.album_image,
        track_obj.album_name,
        track_obj.artist_names,
        track_obj.artist_url,
        track_obj.track_duration,
        track_obj.track_link,
        track_obj.track_name,
        playlist,
        track_obj.played_at,
      );

      let tempVal = undefined;
      if (addedTracksByDay.has(playlist.added_at)) {
        tempVal = addedTracksByDay.get(playlist.added_at);
        tempVal.push(tempTrack);
      } else {
        addedTracksByDay.set(playlist.added_at, [tempTrack]);
      }
    });
  });

  addedTracksByDay.forEach((tracksForDate, date) => {
    let currTrack = {
      title: tracksForDate.length + " Added",
      color: "green",
      start: date,
      id: "addedTrack",
    };

    events.push(currTrack);
  });

  const listenedTracksByDay = new Map();
  tracks.forEach((track_obj, track_uri) => {
    // split track_obj into 2 track obj
    track_obj.played_at.map((listened) => {
      let tempTrack = new Track(
        track_obj.spotify_uri,
        track_obj.album_image,
        track_obj.album_name,
        track_obj.artist_names,
        track_obj.artist_url,
        track_obj.track_duration,
        track_obj.track_link,
        track_obj.track_name,
        track_obj.playlist,
        listened,
      );

      let tempVal = undefined;
      if (listenedTracksByDay.has(listened.split("T")[0])) {
        tempVal = listenedTracksByDay.get(listened.split("T")[0]);
        tempVal.push(tempTrack);
      } else {
        listenedTracksByDay.set(listened.split("T")[0], [tempTrack]);
      }
    });
  });

  listenedTracksByDay.forEach((tracksForDate, date) => {
    let currTrack = {
      title: tracksForDate.length + " Listened",
      color: "purple",
      start: date,
      id: "listenedTrack",
    };

    events.push(currTrack);
  });

  return [addedTracksByDay, listenedTracksByDay, events];
}
