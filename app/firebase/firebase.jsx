import { db } from "@/app/firebase/config"
import { Track } from "../shared_objects/Track";
import { collection, doc, setDoc, getDoc, getDocs, query, where } from "firebase/firestore";
import { firestore } from "firebase-admin";

export async function writeTracksToFirestore(user_name, tracks)
{    
    const q = query(collection(db, "users"), where("name", "==", user_name));
    const userSnap = await getDocs(q)
    var count = 0;
    
    for (const index in tracks) {
        try {
            const docRef = doc(db, "users", userSnap.docs[0].id, "tracks", tracks[index].spotify_id);
            await setDoc(docRef, {
              spotify_id: tracks[index].spotify_id,
              added_at: tracks[index].added_at,
              album_image: tracks[index].album_image,
              album_name: tracks[index].album_name,
              artist_names: tracks[index].artist_names,
              artist_url: tracks[index].artist_url,
              track_duration: tracks[index].track_duration,
              track_link: tracks[index].track_link,
              track_name: tracks[index].track_name
            });
            count += 1;
            // console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }
    console.log("added: ",count)
}

export async function readTracksFromFirestore(user_name)
{
    var tracks = []

    const q = query(collection(db, "users"), where("name", "==", user_name));
    const userSnap = await getDocs(q);

    const firestore_tracks = await getDocs(collection(db, "users", userSnap.docs[0].id, "tracks"));

    firestore_tracks.forEach((doc) => {
        tracks.push(
          new Track(
            doc.id,
            doc.data().added_at,
            doc.data().album_image,
            doc.data().album_name,
            doc.data().artist_names,
            doc.data().artist_url,
            doc.data().track_duration,
            doc.data().track_link,
            doc.data().track_name,
          ),
        );
    })

    console.log("saved:",tracks.length)

    return tracks
}

export async function readMonthTracksFromFirestore(user_name, month) {
  var tracks = [];

  const q = query(collection(db, "users"), where("name", "==", user_name));
  const userSnap = await getDocs(q);

  const firestore_tracks = await getDocs(collection(db, "users", userSnap.docs[0].id, "tracks"), where("added_at", "==", month));

  firestore_tracks.forEach((doc) => {
    tracks.push(
      new Track(
        doc.id,
        doc.data().added_at,
        doc.data().album_image,
        doc.data().album_name,
        doc.data().artist_names,
        doc.data().artist_url,
        doc.data().track_duration,
        doc.data().track_link,
        doc.data().track_name,
      ),
    );
  });

  console.log("saved:", tracks.length);

  return tracks;
}