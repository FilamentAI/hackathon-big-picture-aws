const fs = require('fs');
const LineReader = require('readline');
const Mongo = require('mongodb').MongoClient;
const FilamentAWSLinks = require('./filament-aws');

module.exports = class FilamentBigPicture {
    constructor(options) {
        this.fileList = options.fileList || false;
        this.dbHost = options.mongoDBHost || 'mongodb://localhost:27017';
        this.dbName = options.mongoDBName || 'bigpicture';
        this.bucketName = options.awsBucket || 'filament-hackathon-images';
        this.maxSegments = options.maxSegments || 16;
        this.awsClientId = options.awsClientId;
        this.awsClientSecret = options.awsClientSecret;

        if (this.awsClientId && this.awsClientSecret) {
            this.aws = new FilamentAWSLinks({ clientId: this.awsClientId, clientSecret: this.awsClientSecret });
        }
    }

    async _getMongoDB() {
        if (!this.mongoReference) {
            this.mongoClient = await Mongo.connect(this.dbHost,
                { useNewUrlParser: true });
            this.mongoReference = this.mongoClient.db(this.dbName);
        }
        return this.mongoReference;
    }

    async getImageCollection(collectionName) {
        if (!this.dbHost || this.dbName) {
            throw new Error('MongoDB Credentials not provided. Missing constructor options: mongoDBHost, mongoDBName');
        }
        try {
            const db = await this._getMongoDB();
            return db.collection[collectionName];
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    getImageURL(imageId) {
        if (!this.aws) {
            throw new Error('AWS Credentials not provided. Missing constructor options: awsClientId, awsClientSecret');
        }
        return this.aws.getOneTimeLink(this.bucketName, imageId);
    }

    getRandomImage() {
        return new Promise((resolve, reject) => {
            if (!this.aws) {
                return reject(new Error('AWS Credentials not provided. Missing constructor options: awsClientId, awsClientSecret'));
            }
            if (!this.fileList) {
                return reject(new Error('File list not provided. Mising constructor option: fileList'));
            }
            const images = [];

            const lineReader = LineReader.createInterface({
                input: fs.createReadStream(this.fileList)
            });

            lineReader.on('line', async (line) => {
                const [_, tag, imageId] = line.split('/'); // eslint-disable-line

                images.push({
                    tag,
                    imageId
                });
            });

            lineReader.on('close', async () => {
                const randImage = images[Math.floor(Math.random() * images.length)];

                randImage.segment = Math.floor(Math.random() * this.maxSegments);

                const fullUrl = await this.aws.getFileForSegment(this.bucketName, randImage.imageId, randImage.tag);
                randImage.full_img = fullUrl;
                const segementUrl = await this.aws.getFileForSegment(this.bucketName, randImage.imageId, randImage.tag, randImage.segment);
                randImage.segment_img = segementUrl;
                return resolve(randImage);
            });

            return lineReader.on('error', (err) => {
                reject(err);
            });
        });
    }

    async getRandomSegment(imageID, imageTag, doneSegments) {
        let segment = Math.floor(Math.random() * this.maxSegments);

        while (doneSegments.indexOf(segment) > -1) {
            segment = Math.floor(Math.random() * this.maxSegments);
        }
        const url = await this.aws.getFileForSegment(this.bucketName, imageID, imageTag, segment);

        return {
            url,
            segment,
            id: imageID
        };
    }
};
