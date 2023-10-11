import AWS from '@aws-sdk/client-s3';
const s3 = new AWS.S3();

exports.handler = async (event) => {
  try {
    // Get the S3 bucket and object key from the event
    const bucket = event.Records[0].s3.bucket.name;
    const objectKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    
    // Check if the uploaded file is "images.json"
    if (objectKey === 'images.json') {
      console.log('Ignoring images.json');
      return;
    }
    
    // Fetch the current "images.json" content from the S3 bucket
    const params = {
      Bucket: bucket,
      Key: 'images.json'
    };
    
    const data = await s3.getObject(params).promise();
    const currentImages = JSON.parse(data.Body.toString() || '[]');
    
    // Extract metadata about the uploaded image
    const imageMetadata = {
      name: objectKey,
      size: event.Records[0].s3.object.size,
      type: event.Records[0].s3.object.contentType
    };
    
    // Check if an image with the same name already exists, and update it
    const existingImageIndex = currentImages.findIndex(image => image.name === objectKey);
    if (existingImageIndex !== -1) {
      currentImages[existingImageIndex] = imageMetadata;
    } else {
      currentImages.push(imageMetadata);
    }
    
    // Upload the updated "images.json" back to the S3 bucket
    await s3.putObject({
      Bucket: bucket,
      Key: 'images.json',
      Body: JSON.stringify(currentImages),
      ContentType: 'application/json'
    }).promise();
    
    return {
      statusCode: 200,
      body: 'Image processing complete'
    };
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
};
