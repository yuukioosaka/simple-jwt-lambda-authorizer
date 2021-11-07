# simple-jwt-lambda-authorizer
- Simple jwt lambda authorizer. dynamodb + lambda + api gateway.

# Feature
- node.js 14.x compatible jwt authorizer on aws lambda.
- algo is HS256.
- support payload is
- sub : userid
- exp : expired time (12 hour by default)

# Setup
1. Create aws lambda function(in any name), use runtime node.js 14.x.
2. Paste or upload index.js
3. change private key(test will work if not)
4. Deploy.
5. Create Dynamodb name is "UserPool". key name is "userid".
6. Add Item userid and password.(testuser, testpassowrd)
7. Create API Gatewaty for lambda function.
8. Test Post(userid=testuser&passowrd=testpassowrd)
9. if you see jwt token, setup is completed
