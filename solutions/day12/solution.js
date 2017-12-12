const path = require('path')
const {read} = require('promise-path')

function solve (input) {
  return {
    input,
    actual: 'UNSOLVED'
  }
}

async function run () {
  const input = await read(path.join(__dirname, 'input.txt'), 'utf8')
  const sampleinput = await read(path.join(__dirname, 'sampleinput.txt'), 'utf8')

  const solution = solve(input)
  const sampleSolution = solve(sampleinput)

  report(solution)
  report(sampleSolution)
}

function report (solution) {
  const solutionName = __dirname.split(path.sep).pop()
  console.log('Advent of Code 2017 :', solutionName, 'solution for', solution.input, ':', solution.actual)
}

run()
