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
  return entry
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
}

function report (input, solution) {
  const solutionName = __dirname.split(path.sep).pop()
  console.log('Advent of Code 2017 :', solutionName, 'solution for', input, ':', solution)
}

run()
