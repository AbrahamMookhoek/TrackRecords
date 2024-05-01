<img src="https://github.com/AbrahamMookhoek/TrackRecords/assets/97973770/504c0066-f9ff-4465-9c50-075715bc5ace" alt="drawing" width="200"/>

# Track Records

Track Records is a music analytics web application designed to provide users with a comprehensive overview of their music streaming history. With Track Records, users can gain valuable insights into their listening habits, favorite artists, and much more, all sourced directly from their registered Spotify account.

## Features

- **📅 Calendar View:** Track Records presents users with an intuitive calendar view of their listening history, allowing them to visualize their music consumption over time.

- **📊 Interactive Graphs:** Explore your music data through interactive graphs such as histograms and bubble-charts. Compare various values such as top artists, track features, and more.

- **🔎 Personalized Insights:** Gain a better understanding of your relationship with music and how it influences your daily life with personalized insights derived from your streaming history.
  
- **📝 Journal Entries:** Write dated journal entries to document your thoughts and feelings about a particular track! Review past journal entries and reminisce. 

## Demo
<img width="600" alt="1" src="https://github.com/AbrahamMookhoek/TrackRecords/assets/97973770/7408b07d-3821-41f7-811f-2d6d85c2834c">
<img width="600" alt="1" src="https://github.com/AbrahamMookhoek/TrackRecords/assets/97973770/835dfeba-f7ce-461c-85f6-d8ed5562ce7a">
<img width="600" alt="1" src="https://github.com/AbrahamMookhoek/TrackRecords/assets/97973770/9c3a4f10-6c39-495e-b4d0-59ba7f8dd9b7">

## Installation

To run Track Records locally, follow these steps:

1. Clone this repository.
2. Install dependencies using `npm install`.
3. Add the following crucial fields to your `.env.local` file:
`SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
NEXT_PUBLIC_FIREBASE=your_firebase_credentials
GOOGLE_APPLICATION_CREDENTIALS=your_google_application_credentials
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email`
4. Create a Spotify Developer application to obtain `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET`.
5. Set up a Firebase database and obtain the necessary credentials (`NEXT_PUBLIC_FIREBASE`, `GOOGLE_APPLICATION_CREDENTIALS`, `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`).
6. Start the development server with `npm start`.

Make sure you have Node.js and npm installed on your machine.

## Usage

1. Sign in with your Spotify account.
2. Explore your music streaming history through the calendar view and interactive graphs.
3. Gain insights into your listening habits and preferences.
4. Enjoy a personalized music analytics experience!

## Authors

- Patrick Arzoumanian
- Gustavo Chavez
- AJ Mookhoek
- Spencer Whitehead
- Ahmed Ullah

## Acknowledgments

Special thanks to Spotify for providing the API and inspiration for this project as well as our UTA Senior Design Class.

---

**Note:** This project is not affiliated with Spotify.
