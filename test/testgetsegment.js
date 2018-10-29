const aws = require('../filament-aws');

aws.getFileForSegment('filament-hackathon-images', '009_0059', 'bear', 0).then((data) => {
    console.log(data);
});
