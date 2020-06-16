# Májèmú

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

A tool for testing APIs by specification and by example:

- By Specification — using an API description format — support is currently limited to:
    - [OpenApi version 3](https://swagger.io/docs/specification/about/)

- By example — using a simple yaml format described below.

And ahh... yes you can, and should use both an API description format and
examples to test your API.

So for those superheros with such great power as to be charged with the
great responsiblity of developing APIs without Batman's money and resources,
this tool will help you ensure that your Api is keeping the covenant, - what
[yoruba people](https://en.wikipedia.org/wiki/Yoruba_people) call Májèmú :).


## How to use this

Given that you have taken the pains to develop an API specification with paths
like so,

```yaml

```

And you want to test that your implementation of the API is correct for the specific
request-response scenario below,

```yaml

```

Then you would install this package - Humpf! like you don't know right?
```
npm install --save-dev majemu
```

And then in one of your test files (mocha or jest) you would proceed like so:

``` javascript
  //Of course you'll import the package
  const majemu = require('majemu')

  //Use this wrapper for a http API you want to test
  const httpApi = require('majemu/adapters/http-api')('https://example.com/basepath')

  //point to the specification and examples, and test using the fluent expression
  majemu()
  .withOpenApi('path/to/openapi.yaml')
  .withExamples('path/to/examples.yaml')
  .provideWith('authorization', () => 'base63 encoded authkey perhaps')
  .test(httpApi)

  // you can test an express app like so
  const myExpressApp = require('path/to/my/express/app')
  const expressAppApi = require('majemu/adapters/express-app')(myExpressApp)

  majemu()
  .withOpenApi('path/to/openapi.yaml')
  .withExamples('path/to/examples.yaml')
  .provideWith('authorization', () => 'JWT token perhaps')
  .test(myExpressAppApi)

  // you can test an AWS lambda function like so
  const myAwsLambdaFunction = require('path/to/my/lambda/function')
  const lambdaFunctionApi = require('majemu/adapters/aws-lambda')(myAwsLambdaFunction)

  majemu()
  .withOpenApi('path/to/openapi.yaml')
  .withExamples('path/to/examples.yaml')
  .provideWith('authorization', () => 'SIG4 authorization key')
  .test(lambdaFunctionApi)
```
And that's it. Your test runner will report either success or let you know which
tests are failing.
