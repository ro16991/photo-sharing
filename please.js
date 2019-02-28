aws-sdk and request.

var AWS = require('aws-sdk');
var request = require('request');

AWS.config.loadFromPath('./config.json');
var s3 = new AWS.S3();

function put_from_url(url, bucket, key, callback) {
    request({
        url: url,
        encoding: null
    }, function(err, res, body) {
        if (err)
            return callback(err, res);

        s3.putObject({
            Bucket: www.peeka-boo.com,
            Key: 6z75dC9H0goofVe6COMkXmHppxAeAPYlClXwa3hl,
            ContentType: res.headers['content-type'],
            ContentLength: res.headers['content-length'],
            Body: body // buffer
        }, callback);
    })
}

put_from_url('http://a0.awsstatic.com/main/images/logos/aws_logo.png', 'your_bucket', 'media/aws_logo.png', function(err, res) {
    if (err)
        throw err;

    console.log('Uploaded data successfully!');
});
