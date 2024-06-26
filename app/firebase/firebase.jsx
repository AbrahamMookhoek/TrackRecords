import { db } from "@/app/firebase/config";
import { Track } from "../shared_objects/Track";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  updateDoc,
  query,
  where,
  getDoc,
} from "firebase/firestore";

export async function writeTracksToFirestore(user_name, tracks) {
  const queryForUser = query(
    collection(db, "users"),
    where("name", "==", user_name),
  );

  const userSnap = await getDocs(queryForUser);
  var count = 0;

  for (const index in tracks) {
    try {
      const docRef = doc(
        db,
        "users",
        userSnap.docs[0].id,
        "tracks",
        tracks[index].spotify_id,
      );
      await setDoc(docRef, {
        spotify_id: tracks[index].spotify_id,
        album_image: tracks[index].album_image,
        album_name: tracks[index].album_name,
        artist_names: tracks[index].artist_names,
        artist_url: tracks[index].artist_url,
        track_duration: tracks[index].track_duration,
        track_link: tracks[index].track_link,
        track_name: tracks[index].track_name,
        added_at: tracks[index].added_at,
        played_at: tracks[index].played_at,
      });
      count += 1;
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
  console.log("added: ", count);
}

export async function readTracksFromFirestore(user_name) {
  console.log("RETREIVING INFO");
  var tracks = [];

  const q = query(collection(db, "users"), where("name", "==", user_name));
  const userSnap = await getDocs(q);

  const firestore_tracks = await getDocs(
    collection(db, "users", userSnap.docs[0].id, "tracks"),
  );

  firestore_tracks.forEach((doc) => {
    tracks.push(
      new Track(
        doc.id,
        doc.data().album_image,
        doc.data().album_name,
        doc.data().artist_names,
        doc.data().artist_url,
        doc.data().track_duration,
        doc.data().track_link,
        doc.data().track_name,
        doc.data().added_at,
        doc.data().played_at,
      ),
    );
  });

  console.log("saved:", tracks.length);

  return tracks;
}

export async function readMonthTracksFromFirestore(user_name, month) {
  var tracks = [];

  const q = query(collection(db, "users"), where("name", "==", user_name));
  const userSnap = await getDocs(q);

  const firestore_tracks = await getDocs(
    collection(db, "users", userSnap.docs[0].id, "tracks"),
    where("added_at", "==", month),
  );

  firestore_tracks.forEach((doc) => {
    tracks.push(
      new Track(
        doc.id,
        doc.data().album_image,
        doc.data().album_name,
        doc.data().artist_names,
        doc.data().artist_url,
        doc.data().track_duration,
        doc.data().track_link,
        doc.data().track_name,
        doc.data().added_at,
        doc.data().played_at,
      ),
    );
  });

  console.log("saved:", tracks.length);

  return tracks;
}

export async function updateTracks(spotifyTotalTracks, username) {
  const queryForUser = query(
    collection(db, "users"),
    where("name", "==", username),
  );
  const userSnap = await getDocs(queryForUser);

  const queryForExistingTracks = query(
    collection(db, "users", userSnap.docs[0].id, "tracks"),
  );
  const queryForExistingTracksSnap = await getDocs(queryForExistingTracks);

  if (spotifyTotalTracks == queryForExistingTracksSnap.size) {
    console.log(
      "No need to write to Firestore, user's library has not changed",
    );
    return false;
  }

  return true;
}

export async function writeListeningHistoryToFireStore(
  username,
  listeningHistory,
) {
  const queryForUser = query(
    collection(db, "users"),
    where("name", "==", username),
  );
  const userSnap = await getDocs(queryForUser);

  const userId = userSnap.docs[0].id;

  const userHistory = query(
    collection(db, "users", userSnap.docs[0].id, "history"),
  );
  const userHistorySnap = await getDocs(userHistory);

  if (userHistorySnap.size > 0) {
    console.log(userHistorySnap.size);
  }

  for (let [key, value] of listeningHistory) {
    const docRef = doc(db, "users", userId, "history", key);
    const docSnap = await getDoc(docRef);
    const docData = docSnap.data();

    if (docData != undefined) {
      console.log("docData:", docData);
      console.log("value:", value);
      await updateDoc(docRef, {
        played_at: docData.played_at.concat(value.played_at),
      });
    } else {
      console.log("NO ASSOCIATED ENTRY FOUND");
      setDoc(docRef, { played_at: value.played_at });
    }
  }
}

export async function readListeningHistoryFromFirestore(username) {
  const queryForUser = query(
    collection(db, "users"),
    where("name", "==", username),
  );
  const userSnap = await getDocs(queryForUser);

  const firestore_history = await getDocs(
    collection(db, "users", userSnap.docs[0].id, "history"),
  );

  const historyData = [];
  firestore_history.forEach((doc) => {
    historyData.push({ id: doc.id, ...doc.data() });
  });

  return historyData;
}

export async function writeEntryToFireStore(username, journalEntry) {
  const queryForUser = query(
    collection(db, "users"),
    where("name", "==", username),
  );
  const userSnap = await getDocs(queryForUser);

  const userId = userSnap.docs[0].id;

  const userEntries = query(
    collection(db, "users", userSnap.docs[0].id, "entries"),
  );
  const userEntriesSnap = await getDocs(userEntries);

  if (userEntriesSnap.size > 0) {
    console.log(userEntriesSnap.size);
  }

  const docRef = doc(
    db,
    "users",
    userId,
    "entries",
    journalEntry.date.format("YYYY-MM-DD").toString(),
  );
  const docSnap = await getDoc(docRef);
  const docData = docSnap.data();

  if (docData != undefined) {
    console.log("docData:", docData);
    console.log("entry:", journalEntry);
    await updateDoc(docRef, {
      title: journalEntry.title,
      track: journalEntry.track.spotify_uri,
      date: journalEntry.date.format("YYYY-MM-DD").toString(),
      content: journalEntry.content,
    });
  } else {
    console.log("NO ASSOCIATED ENTRY FOUND");
    await setDoc(docRef, {
      title: journalEntry.title,
      track: journalEntry.track.spotify_uri,
      date: journalEntry.date.format("YYYY-MM-DD").toString(),
      content: journalEntry.content,
    });
  }
}

export async function readEntriesFromFirestore(username) {
  const queryForUser = query(
    collection(db, "users"),
    where("name", "==", username),
  );
  const userSnap = await getDocs(queryForUser);

  const entriesSnap = await getDocs(
    collection(db, "users", userSnap.docs[0].id, "entries"),
  );

  const firestore_entries = new Map();

  entriesSnap.forEach(async (doc) => {
    firestore_entries.set(doc.data().date, doc.data());
  });

  return firestore_entries;
}

export async function generateMasterEntryList(username) {
  const firestore_entries = await readEntryFromFirestore(username);

  return firestore_entries;
}

export async function getUserEpoch(username) {
  const queryForUser = query(
    collection(db, "users"),
    where("name", "==", username),
  );
  const userSnap = await getDocs(queryForUser);

  var queryParam = "";
  var oldEpoch = undefined;
  if (userSnap.docs[0] !== undefined) {
    oldEpoch = userSnap.docs[0].data().epoch;
  }

  if (oldEpoch !== undefined) {
    queryParam = "&after=" + oldEpoch;
  }

  await updateDoc(doc(db, "users", userSnap.docs[0].id), {
    epoch: Date.now(),
  });

  return queryParam;
}
