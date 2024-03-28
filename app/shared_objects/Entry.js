export class Entry {
  constructor(title, track, date, content) {
    //this.id = id;
    this.title = title;
    this.track = track;
    //for now let's treat date as the id, we can change it later
    this.date = date;
    this.content = content;
  }
}

let entry = new Entry(null, null, null, null, null, null);
