export class Track {
    constructor(spotify_uri, added_at, played_at, album_image, album_name, artist_names, artist_url, track_duration, track_link, track_name, added_to) {
        this.spotify_uri = spotify_uri;
        this.added_at = added_at;
        this.played_at = played_at;
        this.album_image = album_image;
        this.album_name = album_name;
        this.artist_names = artist_names;
        this.artist_url = artist_url;
        this.track_duration = track_duration;
        this.track_link = track_link;
        this.track_name = track_name;
        this.added_to = added_to;
    }
}

let track = new Track(null, null, null, null, null, null, null, null, null);