// import {PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
// import {NextRequest} from "next/server";
// import uniqid from 'uniqid';

// export async function POST(req: NextRequest) {
//   const data = await req.formData();
//   const file = data.get('file') as File;

//   const s3Client = new S3Client({
//     region: 'us-east-1',
//     credentials: {
//       accessKeyId: process.env.S3_ACCESS_KEY as string,
//       secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
//     },
//   });


//   //name 345234523-test.jpg
//   const newFilename = `${uniqid()}-${file.name}`;

//   // blob data of our file
//   const chunks = [];
//   // @ts-ignore
//   for await (const chunk of file.stream()) {
//     chunks.push(chunk);
//   }
//   const buffer = Buffer.concat(chunks);

//   const bucketName = 'dawid-job-board';
//   await s3Client.send(new PutObjectCommand({
//     Bucket: bucketName,
//     Key: newFilename,
//     ACL: 'public-read',
//     Body: buffer,
//     ContentType: file.type,
//   }));

//   return Response.json({
//     newFilename,
//     url: `https://${bucketName}.s3.amazonaws.com/${newFilename}`,
//   });
// }


// app/api/upload/route.ts

import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result: any = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "job-board",
          resource_type: "auto",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      stream.end(buffer);
    });

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error: any) {
    console.error("Cloudinary upload error:", error);

    return NextResponse.json(
      {
        error: error.message || "Upload failed",
      },
      { status: 500 }
    );
  }
}