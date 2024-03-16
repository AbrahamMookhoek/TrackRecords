import { Track } from "../shared_objects/Track";

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
              item.added_at.split("T")[0],
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
                item.added_at.split("T")[0],
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

export async function getRecentlyPlayed(access_token) {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + access_token);

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  // get recently listened to
  await fetch(
    "https://api.spotify.com/v1/me/player/recently-played?limit=50",
    requestOptions,
  )
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
  }
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
        // console.log(`Tracks in playlist ${playlist.name}:`, playlistTracks);
      }
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

  console.log("savedTracks", savedTracks);
  console.log("tracksFromPlaylists", tracksFromPlaylists);

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
        undefined,
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
      );

      playlistItem.track = trackObj;

      formattedTracksFromPlaylists.push(playlistItem);
    });
  } catch (error) {
    console.log(error);
  }

  console.log("formattedTracksFromPlaylists", formattedTracksFromPlaylists);

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

  return savedTracks;
}

export function createCalendarEvents(tracks) {
  if (tracks === undefined) {
    return [];
  }
  var events = [];

  const tracksByDay = new Map();
  tracks.forEach((track) => {
    // currently doesnt check for playlist songs
    if (track.added_at) {
      // Extract the date part from the timestamp
      const dateKey = track.added_at.substring(0, 10);

      if (tracksByDay.has(dateKey)) {
        // If the date key exists, add the track to the existing array
        tracksByDay.get(dateKey).push(track);
      } else {
        // If the date key doesn't exist, create a new array with the track
        tracksByDay.set(dateKey, [track]);
      }
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
  console.log(tracksByDay);

  return [tracksByDay, events];
}
