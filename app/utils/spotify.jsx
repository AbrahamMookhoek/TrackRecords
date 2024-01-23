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