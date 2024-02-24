export class Playlist{
    constructor(id, playlist_name, tracks, image_refs, description, uri) {
        this.id = id;
        this.playlist_name = playlist_name;
        this.tracks = tracks;
        this.image_refs = image_refs;
        this.description = description;
        this.uri = uri;
    }
}

let playlist = new Playlist(null, null, null, null, null, null);