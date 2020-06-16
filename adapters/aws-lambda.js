const querystring = require('querystring')
/*
const awsLambdaFunctionResponseFormat = {
  "isBase64Encoded": true|false,
  "statusCode": httpStatusCode,
  "headers": { "headerName": "headerValue", ... },
  "multiValueHeaders": { "headerName": ["headerValue", "headerValue2", ...], ... },
  "body": "..."
}
*/

const awsPayloadMajemuRequest = majemuRequest => {
  return {
    version: '2.0',
    routeKey: '$default',
    rawPath: majemuRequest.path,
    rawQueryString: querystring.encode(majemuRequest.query),
    cookies: majemuRequest.headers['set-cookie'] || [], // should be an array
    header: majemuRequest.headers,
    queryStringParameters: majemuRequest.query,
    requestContext: {
      accountId: '123456789012',
      apiId: 'api-id',
      authorizer: { jwt: {
        claims: { 'claim1': 'value1', 'claim2': 'value2' },
        scopes: ['scope1', 'scope2']
      } },
      domainName: 'id.execute-api.us-east-1.amazonaws.com',
      domainPrefix: 'id',
      http: {
        method: majemuRequest.method,
        path: majemuRequest.path,
        protocol: 'HTTP/1.1',
        sourceIp: 'IP',
        userAgent: 'agent'
      },
      requestId: 'id',
      routeKey: '$default',
      stage: '$default',
      time: '12/Mar/2020:19:03:58 +0000',
      timeEpoch: 1583348638390
    },
    body: majemuRequest.body,
    pathParameters: { 'parameter1': 'value1' },
    isBase64Encoded: false,
    stageVariables: { 'stageVariable1': 'value1', 'stageVariable2': 'value2' }
  }
}

module.exports = (lambdaFn, options) => async majemuRequest => {
  return lambdaFn(awsPayloadMajemuRequest(majemuRequest))
}
