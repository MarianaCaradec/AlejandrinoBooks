import { NextResponse } from "next/server";
import { Storage } from "@google-cloud/storage";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const bucketName = process.env.BUCKET_NAME!;
    const storage = new Storage();
    const bucket = storage.bucket(bucketName);

    const formData = await req.formData();
    const fileCandidate = formData.get("file");

    if (!fileCandidate || !(fileCandidate instanceof File)) {
      const defaultUrl = `https://storage.googleapis.com/${bucketName}/profile_imgs/default_profile_pic.jpeg`;
      return NextResponse.json({ fileUrl: defaultUrl });
    }

    const file = fileCandidate;
    const originalFileName = file.name || "uploaded.jpeg";
    const fileName = `profile_imgs/${uuidv4()}_${originalFileName}`;

    const contentType =
      file.type && file.type !== "application/octet-stream"
        ? file.type
        : "image/jpeg";

    const fileToBeUploaded = bucket.file(fileName);
    const buffer = Buffer.from(await file.arrayBuffer());

    await fileToBeUploaded.save(buffer, {
      metadata: { contentType },
      public: true,
    });
    console.log("Archivo recibido:", fileCandidate);
    console.log("Nombre del archivo:", fileCandidate?.name);
    console.log("Tipo MIME:", fileCandidate?.type);
    const fileUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
    return NextResponse.json({ fileUrl }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al subir el archivo" },
      { status: 500 }
    );
  }
}
