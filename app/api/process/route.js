import { NextRequest, NextResponse } from "next/server";
import unzipper from "unzipper"; // Or use any other zip library

export async function POST(request, response) {
  const start = Date.now();
  const formData = await request.formData();
  const file = formData.get("files");
  let trackMap = new Map();

  if (!file) {
    return NextResponse.json({ message: "No file was attached to this request" }, { status: 500 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const directory = await unzipper.Open.buffer(buffer);

  let audioHistoryFiles = directory.files.filter((file) => {
    return file.path.includes(".json") && file.path.includes("Audio");
  });

  const fileProcessingPromises = audioHistoryFiles.map(async (audioFile) => {
    try {
      const fileBuffer = await audioFile.buffer();
      const fileContent = fileBuffer.toString("utf-8"); // Assuming the content is UTF-8 encoded JSON

      // Process file content as needed
      // For example, you can parse JSON content
      const parsedContent = JSON.parse(fileContent);

      return parsedContent; // Return the parsed content
    } catch (error) {
      console.error("Error processing audio history file:", error);
      throw error; // Propagate the error to the outer catch block
    }
  });

  // Wait for all file processing promises to resolve
  const extractedFiles = await Promise.all(fileProcessingPromises);

  let total_listening_time = 0;

  extractedFiles.forEach((file) => {
    file.forEach((obj) => {
      if (obj && obj.spotify_track_uri) {
        if (obj.ms_played && obj.ms_played > 30 * 1000) {
          total_listening_time += obj.ms_played / 1000 / 60 / 60 / 24;
          if (!trackMap.has(obj.spotify_track_uri.split(":").pop())) {
            trackMap.set(obj.spotify_track_uri.split(":").pop(), {
              name: obj.master_metadata_track_name,
              count: 1,
            });
          } else {
            obj = trackMap.get(obj.spotify_track_uri.split(":").pop());
            obj.count += 1;
          }
        }
      }
    });
  });

  console.log(trackMap.entries(), total_listening_time);

  return NextResponse.json(
    { message: "Success in processing" },
    { status: 200 },
  );
}

export async function GET(request) {
  return NextResponse.json({message: "You should use a post request at this endpoint. Also be sure to attach you zip file to the request"}, {status: 200})
}
