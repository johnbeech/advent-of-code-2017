const path = require('path')
const {read} = require('promise-path')
const NL = '\n'

const testMatcher = /(\{[{<!!>,a-z}]*\}), score of ([\d+ +?]+)? ?=? ?(\d+)\./ // {{<ab>},{<ab>},{<ab>},{<ab>}}, score of 1 + 2 + 2 + 2 + 2 = 9.

function parseTest (line) {
  const matches = line.match(testMatcher)
  if (!matches) {
    return console.log('Unable to match', `"${line}"`)
  }

  const solution = parseInt(matches.pop())
  matches.shift()
  const entry = {
    input: matches.shift(),
    solution,
    sums: (matches.shift() || '').split(' + ').map(n => parseInt(n)).filter(n => n)
  }

  if (entry.sums.length === 0) {
    entry.sums.push(solution)
  }

  return entry
}

function parseTests (input) {
  return input.split(NL).map(n => n.trim()).filter(n => n).map(parseTest)
}

function solve (entry) {
  let stream = entry.input.split('')

  const state = {
    groupLevel: 0,
    groupSum: [],
    openGroups: 0,
    closedGroups: 0,
    openGarbage: 0,
    closedGarbage: 0,
    nextGroupComma: 0,
    skipTokens: 0,
    garbageTokens: 0,
    previousTokens: [],
    action: 'start'
  }

  while (stream.length > 0) {
    readToken(stream, state)
  }

  return {
    solution: state.groupSum.reduce((acc, n) => acc + n, 0),
    sums: {
      input: entry.input,
      solution: entry.solution
    }
  }
}

function readToken (stream, state) {
  const token = stream.shift()
  const action = states[state.action][token] || states[state.action].default

  state.previousTokens.push(token)
  if (state.previousTokens.length > 10) {
    state.previousTokens.shift()
  }

  if (states[state.action][token]) {
    usedCombinations[[state.action, token].join(':')]++
  } else {
    usedCombinations[[state.action, 'default'].join(':')]++
  }

  if (action) {
    methods[action](state)
    state.action = action
  } else {
    throw new Error('Unexpected token ' + token + ' at action ' + state.action + ' given ' + state.previousTokens.join('') + ' ' + JSON.stringify(state))
  }
}

const states = {
  'start': {
    '{': 'openGroup'
  },
  'openGroup': {
    '{': 'openGroup',
    '}': 'closeGroup',
    '<': 'openGarbage'
  },
  'closeGroup': {
    ',': 'nextGroup',
    '}': 'closeGroup'
  },
  'openGarbage': {
    '>': 'closeGarbage',
    '!': 'skipGarbage',
    'default': 'anyGarbage'
  },
  'anyGarbage': {
    '>': 'closeGarbage',
    '!': 'skipGarbage',
    'default': 'anyGarbage'
  },
  'closeGarbage': {
    ',': 'nextGroup',
    '}': 'closeGroup'
  },
  'skipGarbage': {
    'default': 'anyGarbage'
  },
  'nextGroup': {
    '{': 'openGroup',
    '<': 'openGarbage'
  }
}

const usedCombinations = {}
Object.keys(states).forEach(action => {
  const options = states[action]
  Object.keys(options).forEach(token => {
    usedCombinations[[action, token].join(':')] = 0
  })
})

const methods = {
  start, openGroup, closeGroup, openGarbage, closeGarbage, skipGarbage, nextGroup, anyGarbage
}

function start () {

}

function openGroup (state) {
  state.groupLevel++
  state.groupSum.push(state.groupLevel)
  state.openGroups++
}

function closeGroup (state) {
  state.groupLevel--
  state.closedGroups++
}

function openGarbage (state) {
  state.openGarbage++
}

function closeGarbage (state) {
  state.closedGarbage++
}

function nextGroup (state) {
  state.nextGroupComma++
}

function skipGarbage (state) {
  state.skipTokens++
}

function anyGarbage (state) {
  state.garbageTokens++
}

async function run () {
  const testInput = await read(path.join(__dirname, 'tests.txt'), 'utf8')
  const input = await read(path.join(__dirname, 'input.txt'), 'utf8')

  const tests = parseTests(testInput)

  tests.push({
    input: input.trim(),
    solution: 'UNSOLVED',
    sums: []
  })

  const solutions = tests.map(solve)

  solutions.forEach(s => report(s.sums, s.solution))

  console.log('[DEBUG]', JSON.stringify(usedCombinations, null, 2))
}

function report (input, solution) {
  const solutionName = __dirname.split(path.sep).pop()
  console.log('Advent of Code 2017 :', solutionName, 'solution for', input, ':', solution)
}

run()
