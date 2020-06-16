const http = require('http')

const awsPayloadHttpRequest = httpRequest => {
  const url = new URL(httpRequest.url, `http://${httpRequest.headers.host}`)
  return {
    version: '2.0',
    routeKey: '$default',
    rawPath: url.pathname,
    rawQueryString: (url.search || '').slice(1),
    cookies: httpRequest.headers['set-cookie'], // should be an array
    header: httpRequest.headers,
    queryStringParameters: url.searchParams,
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
        method: httpRequest.method,
        path: url.pathname,
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
    body: 'Hello from Lambda',
    pathParameters: { 'parameter1': 'value1' },
    isBase64Encoded: false,
    stageVariables: { 'stageVariable1': 'value1', 'stageVariable2': 'value2' }
  }
}

/*
const awsLambdaFunctionResponseFormat = {
  "isBase64Encoded": true|false,
  "statusCode": httpStatusCode,
  "headers": { "headerName": "headerValue", ... },
  "multiValueHeaders": { "headerName": ["headerValue", "headerValue2", ...], ... },
  "body": "..."
}
*/

/**
 * Wraps a http server around  a lambda function that takes  events in the
 * [2.0 aws
 * PayloadFormat.](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html#2.0)
 * It is up to the caller to invoke listen on the server
 * @param {AsyncFunction} lambdaFn
 * @returns {HttpServer} A nodejs [http
 * server](https://nodejs.org/api/http.html#http_class_http_server)
 */
exports.httpServer = (lambdaFn, options) => {
  return http.createServer((req, res) => {
    lambdaFn(awsPayloadHttpRequest(req))
      .then(response => {
        res.writeHead(response.statusCode, response.headers)
        res.end(response.body)
      }).catch(err => {
        res.writeHead(500, err.message)
        res.end()
      })
  })
}

const awsPayloadMajemuRequest = majemuRequest => {
  const url = new URL(majemuRequest.url, `http://${req.headers.host}`)
  return {
    version: '2.0',
    routeKey: '$default',
    rawPath: majemuRequest.path,
    rawQueryString: (url.search || '').slice(1),
    cookies: majemuRequest.headers['set-cookie'], // should be an array
    header: majemuRequest.headers,
    queryStringParameters: url.searchParams,
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
        path: url.pathname,
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
    body: 'Hello from Lambda',
    pathParameters: { 'parameter1': 'value1' },
    isBase64Encoded: false,
    stageVariables: { 'stageVariable1': 'value1', 'stageVariable2': 'value2' }
  }
}

exports.majemuSink = (lambdaFn, options) => async majemuRequest => {
  return lambdaFn(awsPayloadMajemuRequest(majemuRequest))
}
