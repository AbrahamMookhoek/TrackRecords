import Calendar from "@/app/components/Calendar";
import { getServerSession } from "next-auth";
import { options } from "../../api/auth/[...nextauth]/options";

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

export default async function CalendarPage() {
  const session = await getServerSession(options);

  if (session) {
    console.log("IN CALENDER PAGE\n", session.user);
    // await testSpotify(session.user.spotify_access_token);
    console.log("CLIENT SECRET: " + process.env.SPOTIFY_CLIENT_SECRET)
    console.log("CLIENT ID: " + process.env.SPOTIFY_CLIENT_ID)
    await testRefreshToken(session.user.spotify_refresh_token);
  }
  return (
    <>
      <Calendar />
    </>
  );
}
