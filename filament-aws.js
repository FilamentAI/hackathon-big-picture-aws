const Minio = require('minio');

module.exports = class FilamentAWSLinks {
    constructor(options) {
        this.clientId = options.clientId;
        this.clientSecret = options.clientSecret;
        this.expiryTime = options.expiryTime || 300;

        if (this.clientId && this.clientSecret) {
            this.minioClient = new Minio.Client({
                endPoint: 's3.amazonaws.com',
                accessKey: this.clientId,
                secretKey: this.clientSecret,
                secure: true // Default is true.
            });
        }
    }

    getOneTimeLink(bucketName, fileKey) {
        if (!this.minioClient) {
            throw new Error('AWS Credentials not provided. Missing constructor options: clientId, clientSecret');
        }
        // Presigned get object URL for my-objectname at my-bucketname, it expires in 7 days by default.
        return this.minioClient.presignedGetObject(bucketName, fileKey, this.expiryTime);
    }

    getFileForSegment(bucketName, imageID, tag, segment = 'total') {
        const imageClassId = imageID.split('_')[0];
        const fileKey = `chopped_images/${imageClassId}.${tag}/${imageID}/${imageID}_${segment}.jpg`;
        return this.getOneTimeLink(bucketName, fileKey);
    }

    listFiles(bucketName) {
        if (!this.minioClient) {
            throw new Error('AWS Credentials not provided. Missing constructor options: clientId, clientSecret');
        }
        const stream = this.minioClient.listObjects(bucketName);
        return new Promise((resolve, reject) => {
            stream.on('data', (data) => {
                resolve(data);
            });
            stream.on('error', (err) => {
                reject(err);
            });
        });
    }
};
