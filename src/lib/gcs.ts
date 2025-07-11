import { Storage } from "@google-cloud/storage";

const storage = new Storage({
  projectId: process.env.GCLOUD_PROJECT_ID,
  credentials: {
    client_email: process.env.GCLOUD_CLIENT_EMAIL,
    private_key: process.env.GCLOUD_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
});

const bucketName = process.env.GCLOUD_STORAGE_BUCKET!;
const bucket = storage.bucket(bucketName);

export async function uploadFileToGCS(
  fileBuffer: Buffer,
  destination: string,
  contentType: string
) {
  const file = bucket.file(destination);
  await file.save(fileBuffer, {
    metadata: { contentType },
    resumable: false,
    public: false,
    encryptionKey: process.env.GCLOUD_ENCRYPTION_KEY,
  });
  return file.publicUrl(); // Or use file.getSignedUrl for private access
}
