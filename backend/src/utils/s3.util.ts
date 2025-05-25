import { S3Client, PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3";


const BUCKET_NAME = process.env.AWS_S3_BUCKET!; // Default bucket name

const s3 = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

// Accept bucket name as an optional parameter (falls back to default)
export const uploadToS3 = async (
    key: string,
    buffer: Buffer,
    contentType: string,
    bucket: string = BUCKET_NAME
): Promise<string> => {
    const params: PutObjectCommandInput = {
        Bucket: bucket,
        Key: key,
        Body: buffer,
        ContentType: contentType,
        ACL: "public-read", // or "private"
    };

    await s3.send(new PutObjectCommand(params));

    return `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
};
