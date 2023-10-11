# Image Lambda Function

## Overview

This AWS Lambda function is designed to process image uploads to an S3 bucket. It maintains a dictionary of uploaded images in an "images.json" file and updates it whenever a new image is uploaded.

## How to Use

**Function Description:**

   - The Lambda function downloads the "images.json" file from the S3 bucket (if it exists).
   - It maintains an array of image objects in the "images.json" file, where each object describes an uploaded image, including its name, size, type, and other metadata.
   - If an image with a duplicate name is uploaded, the function updates the existing object in the array.
   - Finally, the Lambda function uploads the updated "images.json" file back to the S3 bucket.

## Issues Encountered

During the deployment of this Lambda function, no significant issues were encountered. The function was successfully configured to process image uploads and update the "images.json" file as expected.

## [Link to images.json](https://new-bucket-image.s3.us-west-2.amazonaws.com/images.json)
