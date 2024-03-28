export class Track {
  constructor(
    spotify_uri,
    album_image,
    album_name,
    artist_names,
    artist_url,
    track_duration,
    track_link,
    track_name,
    playlists_added_to,
    played_at,
  ) {
    this.spotify_uri = spotify_uri;
    this.album_image = album_image;
    this.album_name = album_name;
    this.artist_names = artist_names;
    this.artist_url = artist_url;
    this.track_duration = track_duration;
    this.track_link = track_link;
    this.track_name = track_name;
    this.playlists_added_to = playlists_added_to;
    this.played_at = played_at;
  }
}

let track = new Track(
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
);
