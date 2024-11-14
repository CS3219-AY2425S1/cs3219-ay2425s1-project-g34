import { Storage } from '@google-cloud/storage';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const { IMAGE_PROJECT_ID, IMAGE_BUCKET } = process.env;
const storage = new Storage({projectId: IMAGE_PROJECT_ID});
const bucket = storage.bucket(IMAGE_BUCKET);

async function generateNewVersion(questionId) {
    const [files] = await bucket.getFiles({ prefix: `${questionId}-` });
    return files.length + 1;
}

export const uploadImage = async (questionId, file) => {
    const fileName = `${questionId}-${await generateNewVersion(questionId)}${path.extname(file.originalname)}`;
    const blob = bucket.file(fileName);

    const blobStream = blob.createWriteStream({
        resumable: false,
        contentType: file.mimetype,
    });

    return new Promise((resolve, reject) => {
        blobStream.on('finish', async () => {
            try {
                const [url] = await blob.getSignedUrl({
                    action: 'read',
                    expires: '03-01-2500', // Set an appropriate expiration date
                });
                resolve(url);
            } catch (error) {
                reject(error);
            }
        }).on('error', (err) => {
            reject(err);
        }).end(file.buffer);
    });
};

export const deleteImage = async (imageUrl) => {
    const fileName = imageUrl.split('?')[0].split('/').pop();
    const file = bucket.file(fileName);

    try {
        await file.delete();
    } catch (error) {
        console.error(`Failed to delete image ${imageUrl}:`, error);
    }
};