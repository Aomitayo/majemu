/* global describe, before, it, expect */
const file = require('fs')
const yaml = require('yaml')
const expect = require('chai').expect

module.exports = () => {
  let apiSpec;

  const majemu = {
    withOpenApi (pathToOpenApi) {
      const specDoc = yaml.parse(
        file.readFileSync(pathToOpenApi, 'utf8')
      )

      majemu.specDoc = specDoc

      return majemu
    },
    withExamples (pathToExamples) {
      const example = yaml.parse(
        file.readFileSync(pathToExamples, 'utf8')
      )

      majemu.examples = (majemu.examples || []).concat([example])

      return majemu
    },
    provideWith (providableKey, provider) {
      majemu.providables = majemu.providables || {}

      majemu.providables[providableKey] = provider
      return majemu
    },
    test (systemUnderTest, sideEffectLog) {
      // Examples are scenarios
      (majemu.examples || []).forEach(exploreScenario({ majemuInstance: majemu })(systemUnderTest))
    }
  }

  return majemu
}

const exploreScenario = context => systemUnderTest => scenario => {
  describe(scenario.description || 'Scenario', function () {
    before(function () {
      this.majemuContext = { ...context }
    })

    exploreSequence(context)(systemUnderTest)(scenario.sequence)
  })
}

const exploreSequence = context => systemUnderTest => sequence => {
  sequence.forEach(exploreExample(context)(systemUnderTest))
}

const pre = ({ majemuInstance }) => systemUnderTest => async request => {
  const resolveProvidable = value => typeof value === 'function'
    ? value()
    : value

  const provided = Object.entries(majemuInstance.providables)
    .reduce((providables, [key, value]) => {
      if (/^!/.test(key)) {
        providables.defaults[key.substring(1)] = resolveProvidable(value)
      } else {
        providables.onDemand[key] = resolveProvidable(value)
      }
      return providables
    }, { defaults: {}, onDemand: {} })

  return {
    ...provided.defaults,
    ...request
  }
}

const exploreRequest = context => systemUnderTest => async ({ request }) => {
  before(function () {
    this.majemuContext = this.majemuContext || { ...context }
    const majemuContext = this.majemuContext

    return pre(context)(systemUnderTest)(request)
      .then(majemuRequest => {

        majemuContext.majemuRequest = majemuRequest
        return systemUnderTest(majemuRequest)
      })
      .then(result => {
        majemuContext.result = result
      })
      .catch(err => {
        console.error('Error', err)
        majemuContext.result = err
      })
  })
}

const exploreResponse = context => systemUnderTest => async ({ response }) => {
  it('Responded correctly', function () {
    const result = this.majemuContext.result

    expect(result).to.exist;

    if (response.statusCode) {
      expect(result.statusCode).to.equal(response.statusCode)
    }
  })
}

const exploreEvent = context => systemUnderTest => async response => {
}

const exploreNonExample = context => systemUnderTest => async nonExample => {
}

const exampleTransformers = {
  request: exploreRequest,
  response: exploreResponse,
  event: exploreEvent,
  sequence: exploreSequence,
  scenario: exploreScenario
}

const exampleType = example => (Object.keys(example)[0] || '').toLowerCase() || 'scenario'

const exploreExample = context => systemUnderTest => example => {
  (exampleTransformers[exampleType(example)] || exploreNonExample)(context)(systemUnderTest)(example)
}
