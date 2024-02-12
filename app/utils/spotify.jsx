import { Track } from "../shared_objects/Track";
import { writeToFirestore } from "@/app/firebase/firebase"

export default async function refreshAccessToken(refresh_token){
    var refresh_token = refresh_token;
    var authOptions = {
      method: "POST",
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + (new Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64'))
      },
      body: `grant_type=refresh_token&refresh_token=${refresh_token}`,
      cache: "no-cache",
      json: true
    };
  
    const res = await fetch('https://accounts.spotify.com/api/token', authOptions)
    const info = await res.json()

    return info
}

async function testSpotify(access_token) {
    var myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      "Bearer " + access_token
    );
  
    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
  
    fetch("https://api.spotify.com/v1/me", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  }
  
async function testRefreshToken(refresh_token){
  var refresh_token = refresh_token;
  var authOptions = {
    method: "POST",
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + (new Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64'))
    },
    body: `grant_type=refresh_token&refresh_token=${refresh_token}`,
    cache: "no-cache",
    json: true
  };

  const res = await fetch('https://accounts.spotify.com/api/token', authOptions)
  console.log(await res.json())
}

export async function spotifyGetSavedTracks(access_token, user_name) {
  var myHeaders = new Headers();
  myHeaders.append(
    "Authorization",
    "Bearer " + access_token
  );

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };
  
  var tracks = [];
  var artistsNameArray = [];
  var artistsLinkArray = [];
  var nextSongBatchLink = "";
  // below 2 variables are purely for debugging
  var count = 0;
  var count_iter = 0;

  await fetch("https://api.spotify.com/v1/me/tracks?limit=50", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      nextSongBatchLink = result.next;
      count += result.items.length;

      artistsNameArray = [];
      artistsLinkArray = [];

      result.items.forEach((item) => {
          if(item != undefined){
            item.track.artists.forEach((artist) => {
              artistsNameArray.push(artist.name);
              artistsLinkArray.push(artist.external_urls.spotify);
            });
            
            tracks.push(
              new Track(
                item.track.id,
                item.added_at,
                (item.track.album.images.length !== 0) ? item.track.album.images[item.track.album.images.length - 1].url : "Unknown",
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

  while(nextSongBatchLink != null)
  {
    await fetch(nextSongBatchLink, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      nextSongBatchLink = result.next
      count += result.items.length;

      result.items.forEach(item => {
        artistsNameArray = [];
        artistsLinkArray = [];

        if(item != undefined){
          item.track.artists.forEach((artist) => {
            artistsNameArray.push(artist.name);
            artistsLinkArray.push(artist.external_urls.spotify);
          })

          tracks.push(
            new Track(
              item.track.id,
              item.added_at,
              (item.track.album.images.length !== 0) ? item.track.album.images[item.track.album.images.length - 1].url : "Unknown",
              item.track.album.name,
              artistsNameArray,
              artistsLinkArray,
              item.track.duration_ms,
              item.track.external_urls.spotify,
              item.track.name
            ),
          );

          count_iter += 1;
        }
      });
    })
    .catch((error) => console.log("error", error));
    // console.log("total songs:",count)
    console.log("saved songs:",count_iter)
    console.log("array lengt:",tracks.length)
    // console.log(nextSongBatchLink)
    // console.log("\n")
  }

  await writeToFirestore(user_name, tracks);
}