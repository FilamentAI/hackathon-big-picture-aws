/*
 * Create a list of available images in MongoDB using a
 * files.txt file
 */
const fs = require('fs');
const LineReader = require('readline');

const FILE_LIST = './data/files.txt';
const Main = require('./index.js');

const readImageListToMongo = function (filename) {
    const lineReader = LineReader.createInterface({
        input: fs.createReadStream(filename)
    });

    lineReader.on('line', async (line) => {
        const [_, tag, imageId] = line.split('/'); // eslint-disable-line
        const collection = await Main.getImageCollection();
        console.log(collection);
        const response = await collection.insertOne({
            tag,
            imageId
        });
        console.log(response);
        return;
    });

    return lineReader.on('close', () => {
        return Promise.resolve();
    });
};

readImageListToMongo(FILE_LIST);

