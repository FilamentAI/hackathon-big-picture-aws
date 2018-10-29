# AWS image server for Big Picture

An image server for Filament's [Big Picture](https://github.com/FilamentAI/hackathon-big-picture) hackathon project. Serves up random images and their parts from an AWS bucket.

## AWS setup

Below is an example of how pictures are hosted on AWS.

### One time link builder

  1. npm install
  2. npm run cli for example

## Filament AWS Links Code Example

```javascript
const FilamentBigPicture = require('filament-big-picture');

const bucketName = "filament-hackathon-images";
const fileName = "Squirrel.jpg";

const filamentBigPicture = new FilamentBigPicture({
    mongoDBHost:'<MONGE_DB_HOST>',
    mongoDBName:'<MONGE_DB_NAME>',
    awsClientId: '<S3_CLIENT_ID>',
    awsClientSecret: '<S3_CLIENT_SECRET>',
    awsBucket: '<BUCKET_NAME>',
    fileList: '</path/to/file/list>',
    maxSegments: 16
});

filamentBigPicture.getRandomImage().then(image => {
    console.log(image);
    console.log('Full Image URL', image.full_img);
    console.log('Image Segment URL', image.segment_img)
    const {
      imageId, tag, segmemt
    } = image;
    const usedSegments = [segment];
    filamentBigPicture.getRandomSegment(imageId, tag, usedSegments).then(nextImage => {
      console.log(nextImage);
    });
});
```
