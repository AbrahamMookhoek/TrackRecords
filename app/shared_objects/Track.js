export class Track {
    constructor(spotify_uri, added_at, album_image, album_name, artist_names, artist_url, track_duration, track_link, track_name, playlists_added_to) {
        this.spotify_uri = spotify_uri;
        this.added_at = added_at;
        this.album_image = album_image;
        this.album_name = album_name;
        this.artist_names = artist_names;
        this.artist_url = artist_url;
        this.track_duration = track_duration;
        this.track_link = track_link;
        this.track_name = track_name;
        this.playlists_added_to = playlists_added_to;
    }
}

let track = new Track(null, null, null, null, null, null, null, null, null);