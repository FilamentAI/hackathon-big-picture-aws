# Hackathon project: Big Picture game

Big Picture is a Google Assistant game where users guess an object from a part of a picture. It is a [Filament](http://filament.ai) hackathon project, see full report and demo in this [Medium post](https://medium.com/filament-ai/filament-google-hackathon-deb629a14b3f).

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
