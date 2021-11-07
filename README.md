# simple-jwt-lambda-authorizer
Simple jwt lambda authorizer. dynamodb + lambda + api gateway.

Feature
node.js 14.x compatible jwt authorizer on aws lambda.
algo is HS256.
support payload is
sub : userid
exp : expired time (12 hour by default)

Setup

1.Create aws lambda function(in any name), use runtime node.js 14.x.
2.Paste or upload index.js
3.Deploy.
4.Create Dynamodb name is "UserPool". key name is "userid".
5.Add Item userid and password.(testuser, testpassowrd)
6.Create API Gatewaty for lambda function.
7.Test Post(userid=testuser&passowrd=testpassowrd)
8.if you see jwt token, setup was completed
