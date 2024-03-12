// SCRIPT FOR READING ZIP FILE USER STREAMING HISTORY, SORTS FREQUENCIES OF PLAY COUNT 

const fs = require('fs');
const path = require('path');
const unzipper = require('unzipper');
const Track = require("./shared_objects/Track");

// A map to keep track of song play counts and details
const songFrequencies = new Map();

// Function to read JSON files from a ZIP and create Track objects
const processSpotifyHistoryFromZip = (zipFilePath) => {
  fs.createReadStream(zipFilePath)
    .pipe(unzipper.Parse())
    .on('entry', function (entry) {
      const fileName = entry.path;
      const fileType = entry.type; // 'Directory' or 'File'
      const isJsonFile = path.extname(fileName) === '.json';
      const isInMyDataFolder = fileName.startsWith('MyData/');

      if (fileType === 'File' && isJsonFile && isInMyDataFolder) {

        entry.buffer().then(function (content) {
          const tracksData = JSON.parse(content.toString());

          tracksData.forEach((item) => {
            const spotifyTrackUri = item.spotify_track_uri;
            const trackName = item.master_metadata_track_name;
            const albumName = item.master_metadata_album_album_name;
            const artistName = item.master_metadata_album_artist_name;
            
            // Create a Track object with specified fields initialized
            const track = new Track(
              spotifyTrackUri, // spotify_id
              null, // added_at
              null, // album_image
              albumName, // album_name
              artistName, // artist_names
              null, // artist_url
              null, // track_duration
              null, // track_link
              trackName // track_name
            );

            // Update the play count for the track along with storing track details
            const currentCount = songFrequencies.get(spotifyTrackUri) || {
              name: trackName,
              count: 0,
              artist: artistName,
              album: albumName
            };
            currentCount.count += 1;
            songFrequencies.set(spotifyTrackUri, currentCount);
          });
        });
      } else {
        entry.autodrain();
      }
    })
    .on('close', function () {
      // All entries are read, sort and write the frequencies to a CSV file
      const sortedFrequencies = Array.from(songFrequencies).sort((a, b) => b[1].count - a[1].count);
      let csvContent = "Play Count Frequency,Track Name,Artist Name,Album Name,Spotify Track URI\n"; // CSV header
      sortedFrequencies.forEach(([key, value]) => {
        const line = `${value.count},"${value.name}","${value.artist}","${value.album}",${key}`;
        csvContent += line + "\n"; // Append each line to CSV content
        console.log(line); // Print each line to the console
      });

      // Write the CSV content to a file
      fs.writeFile('sortedFrequencies.csv', csvContent, (err) => {
        if (err) {
          console.error('Error writing CSV file', err);
        } else {
          console.log('CSV file has been saved with sorted frequencies.');
        }
      });
    });
};

// The path to the ZIP file containing JSON files
const zipFilePath = './spotify_data.zip'; // Update this path to the correct ZIP file
processSpotifyHistoryFromZip(zipFilePath);