export class Track {
    constructor(spotify_id, added_at, album_image, album_name, artist_names, artist_url, track_duration, track_link, track_name) {
        this.spotify_id = spotify_id;
        this.added_at = added_at;
        this.album_image = album_image;
        this.album_name = album_name;
        this.artist_names = artist_names;
        this.artist_url = artist_url;
        this.track_duration = track_duration;
        this.track_link = track_link;
        this.track_name = track_name;
    }
}

// Firestore data converter
const trackConverter = {
    toFirestore: (track) => {
        return {
          spotify_id: track.spotify_id,
          added_at: track.added_at,
          album_image: track.album_image,
          album_name: track.album_name,
          artist_names: track.artist_names,
          artist_url: track.artist_url,
          track_duration: track.track_duration,
          track_link: track.track_link,
          track_name: track.track_name,
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new Track(
          data.spotify_id,
          data.added_at,
          data.album_image,
          data.album_name,
          data.artist_names,
          data.artist_url,
          data.track_duration,
          data.track_link,
          data.track_name
        );
    }
};

let track = new Track(null, null, null, null, null, null, null, null);