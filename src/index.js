//change here
//jwt exipred time in hour
let expiredHour = 12 ;
//private key(no passphrase)
let privateKey =
    "-----BEGIN RSA PRIVATE KEY-----\n" +
    "MIIEpgIBAAKCAQEA5xLFzYo1jV3i09fzyvygmF0G1tFeSjUChi5lVn2ve8BFWxHL\n" +
    "ULgc0vLTwKMkVFCCXoqXXs4jmXg6F+PPMJYMDVyqvDJQwQ2Z6SpOOVQQmzN6ud2X\n" +
    "tkwXRjD6UpfjAVJAW4OtcA2hzQm1AR7rVHzESp1+7sNPhGJ7z5EoxFj3k9fUNyi9\n" +
    "hhfAFlWPL00prAiH/MWa0PEZUR+zp0AQoVLMeOXNbzuBp2qbQXFocZBDnEACCELp\n" +
    "68F/WEvqSZQ45c/zFUMtKJjS6WzQtf7kdsg0I2nl2uVV4XQWsADlLunnxujPWaK8\n" +
    "BsDQFIACXC3UbSkIqDTcDDOK8tmJ/J1vOiXh6QIDAQABAoIBAQC1F0g/sf4QITEf\n" +
    "9tFQFrZBUj6G4iR0IaEtyXSP2QZLBL8WBRcC1pd4VufOw8w367SQJStGGGVb5BYb\n" +
    "HOUGXcFqQ2JnBUO2WFNzoT0WvqQZDbozqc85Bd8DmmTDj9dO9MgNMGAfPf+88cuR\n" +
    "6kphtzoag92zfwt1Y71GSavaXSMCEBks1KNshOD6QXYyXL7D1DDFB3aomYNuLLMu\n" +
    "ZWjWYBFPWMH5jDQvNuk+o6O2WVN/27Ek3Ry7w1f2+PJPnF7ac5W4fve4KBJljSfk\n" +
    "0W+zVQzoi8vU0Fdy1LGZvX7jZbKCSF8s7UR35Kic4iGb2RdPLbPcowPLytLwgTTQ\n" +
    "56WNYaABAoGBAPfkgLXdweWabkcBnPozZTOtvyOqEFUqy5oLnlnrLRBVdRJ2cWyr\n" +
    "aIUdmLDhqXFeYRf7wFS5bANSdnSXuQFsj6wLBmZVToKdb42spZvK/Kz4O7GRdmjT\n" +
    "kg4GUWzkYgMcld06JkSyUNzezaph6W1A0hDQfYDx/5UBkbmkY15DumQBAoGBAO6h\n" +
    "cxSELrqfnnLevyrtexZ/OPfbWYGiq/8yDP1+uN+xzq2m9fcfCFRd2YhgJEJCLmY4\n" +
    "ewTC7ILLf2n1eGUmoPKZoMk9/F74+kJS6nCYwEwPwhjo7k8ijBjPVOGws52/mQNf\n" +
    "TF7SM4HwL78yuJ8s/ht73uOvD9DSlNHxrU59LN3pAoGBAPQm1q5JL8QYiizdZeL3\n" +
    "4+E2a1+RDG0VrVqXvusJOmUwBhKdHbHOUS9qqwzr9Zt3PWIFzrSju8K54XmMRecl\n" +
    "KYxlf3Qi6SS0Mz7yoFoFX0BtbT3C60DrwJqXlnMNrYsrCF/P+gkHJ6WivCXoMaQt\n" +
    "h7iP4Ey0DOqRlRmm00fwpRABAoGBAIIAFIiNxkNHJ/PeY3jIbXEBGBD3P5i+/UKG\n" +
    "issi2SaMYFL8DS12i3wisJp5/ebW1R49EM+0PVK3+A7Keq9oTvA7P3vCuBUpQHUX\n" +
    "ZL64iLInN4+IfiNAZ+AwO0bEk+WRdpN+vEU/8G2OYwSfZjLZOQnR/sg9G7mgrxB8\n" +
    "v/Rtfx7ZAoGBAKwYODiU4pqqvxKLA4HmFhzWIbD5PbOju9iF6dIqNOG09n5SA73Z\n" +
    "ACq1Ejga7CnMDlqlx0R421NiqLZWb4xdsY8FJ6pvYB06he8/gx/pqpE6mY9kCbH/\n" +
    "C2wc3zs/XpIg9OWj7eXW5ajXCCXrUjlyvgGKNu1SlvdpH6cvtLc6h9it\n" +
    "-----END RSA PRIVATE KEY-----\n";
//Dynamodb table name
let usertable = "UserPool";
//table key
let tablekey = "userid";
//password key
let passkey = "password";
//end

//do not modify below
let qs = require('querystring');
let AWS = require("aws-sdk");
let docClient = new AWS.DynamoDB.DocumentClient();
let crypto = require('crypto');

exports.handler = async(event) => {
    var statusCode = null;
    var body = null;
    
    try {
        body = await handle(event);
        statusCode = 200;
    } catch (e) {
        body = e.toString();
        statusCode = 400;
        throw e;
    }

    let response = {
        statusCode: statusCode,
        body: body
    };

    return response;
};

async function handle(event) {
    let q = qs.parse(event.body);

    if (q.userid == null || q.password == null || q.userid == "" || q.password == "") {
        throw "Auth Failed."
    }

    let params = {
        TableName: "UserPool",
        Key: {
        }
    };
    params.Key[tablekey] = q.userid;

    let result = await docClient.get(params).promise();

    if (result.Item == null) {
        throw "Auth Failed."
    }

    if (q.password != result.Item[passkey]) {
        throw "Auth Failed."
    }

    let header = '{"typ":"JWT", "alg":"HS256"}';
    let exp = new Date().getTime() + expiredHour * 60 * 60
    let payload = '{"sub":"' + q.userid + '", "exp":"' + exp + '"}';

    let b64 = new Buffer(header).toString('base64') + "." + new Buffer(payload).toString('base64');
    let sign = crypto.createSign('SHA256');
    sign.update(b64);
    sign.end();
    const signature = sign.sign(privateKey, 'base64');

    return b64 + "." + signature;
}
