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

let track = new Track(null, null, null, null, null, null, null, null);