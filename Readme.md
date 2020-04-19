# Májèmú

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

A tool for testing APIs by specification and by example:

By Specification using an API description format - Support is currently limited to:
- [OpenApi version 3](https://swagger.io/docs/specification/about/)

By example using a simple yaml format described below.

Oh! and ahh... yes you can, and should use both an API description format and
examples to test your API.

So for those superheros with such great power that they are charged with the
great responsiblity of developing APIs without Batman's money and resources,
This tool will help you ensure that your Api is keeping the covenant, - what
[yoruba people](https://en.wikipedia.org/wiki/Yoruba_people) call Májèmú :).


## How to use this

Given that you have taken the pains to develop an API specification with paths
like

```yaml

```

And you want to test that the implementation of the request-response scenario
beelow is correct.

Then you would install this package -Hmmpff! like you don't know right?
```
npm install majemu
```

And then in one of your test files (mocha or jest) you would proceed like so:

``` javascript
  //off course you'll import the package
  const majemu = require('majemu')

  //Use this wrapper for a http api you want to test
  const httpApi = require('majemu/http-api')('https://example.com/basepath')

  //specify the specification and examples and test using the fluent expression
  majemu()
  .withOpenApi('path/to/openapi.yaml')
  .withExamples('path/to/examples.yaml')
  .provideWith('authorization', () => 'base63 encoded authkey perhaps')
  .test(httpApi)

  // you can test an express app like so
  const myExpressApp = require('path/to/my/express/app')
  const expressAppApi = require('majemu/express-app')(myExpressApp)

  majemu()
  .withOpenApi('path/to/openapi.yaml')
  .withExamples('path/to/examples.yaml')
  .provideWith('authorization', () => 'base63 encoded authkey perhaps')
  .test(myExpressAppApi)

  // you can test an AWS lambda function like so
  const myAwsLambdaFunction = require('path/to/my/lambda/function')
  const lambdaFunctionApi = require('majemu/express-app')(myAwsLambdaFunction)

  majemu()
  .withOpenApi('path/to/openapi.yaml')
  .withExamples('path/to/examples.yaml')
  .provideWith('authorization', () => 'base63 encoded authkey perhaps')
  .test(lambdaFunctionApi)
```
And that's it. Your test runner will report either success or let you know the
tests that are failing.
