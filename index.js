import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';

const s3client = new S3Client({ region: 'us-west-2' });

export const handler = async (event) => {
  console.log('Lambda code is running!');
  const bucketName = event.Records[0].s3.bucket.name;
  const fileName = event.Records[0].s3.object.key;

  // Fetch existing images.json from S3, or initialize an empty array if it doesn't exist.
  let images = [];
  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: 'images.json',
    });
    const data = await s3client.send(command);

    // Check if the data.Body is a JSON string
    if (data.Body && typeof data.Body === 'string') {
      images = JSON.parse(data.Body);
    } else {
      console.log('Data from S3 is not in JSON format:', data.Body);
    }
  } catch (err) {
    if (err.name !== 'NoSuchKey') {
      console.error("Error fetching images.json:", err);
      throw err;
    }
  }

  // If the uploaded file is not images.json, then it's an image.
  // Update the images array with the metadata of the new image.
  if (fileName !== 'images.json') {
    const imageMetadata = {
      Name: fileName,
      Size: event.Records[0].s3.object.size,
      Type: fileName.split('.').pop()
    };

    // If the image with the same name exists, update it, else add a new entry.
    const existingImageIndex = images.findIndex(img => img.Name === fileName);
    if (existingImageIndex > -1) {
      images[existingImageIndex] = imageMetadata;
    } else {
      images.push(imageMetadata);
    }

    // Convert the images array to JSON
    const updatedImagesJSON = JSON.stringify(images);

    // Re-upload the updated images.json back to S3
    await s3client.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: 'images.json',
      Body: updatedImagesJSON,
      ContentType: 'application/json'
    }));
  }

  // Return a response. 
  const response = {
    statusCode: 200,
    body: JSON.stringify('Processed ' + fileName),
  };
  return response;
};
