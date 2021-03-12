import gc from '../config/gcloud';

const bucket = gc.bucket('nothungry-images');
export default async (file: any) =>
  new Promise((resolve, reject) => {
    const { originalname, buffer } = file;

    const blob = bucket.file(originalname.replace(/ /g, '_'));
    const blobStream = blob.createWriteStream({
      resumable: false,
    });
    blobStream
      .on('finish', () => {
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        resolve(publicUrl);
      })
      .on('error', () => {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject(`Unable to upload image, something went wrong`);
      })
      .end(buffer);
  });
