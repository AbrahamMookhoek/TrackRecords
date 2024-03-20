export class Entry {
  constructor(id, title, track, date, content) {
    //id will let different entries be identified even if they have the same content/title.
    //don't know how we'll generate the id though
    this.id = id;
    this.title = title;
    this.track = track;
    this.date = date;
    this.content = content;
  }
}

let entry = new Entry(null, null, null, null, null, null);
