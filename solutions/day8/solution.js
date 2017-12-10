const path = require('path')
const {read} = require('promise-path')

function solve (input) {
  return 'UNSOLVED'
}

async function run () {
  const sampleinput = await read(path.join(__dirname, 'sampleinput.txt'), 'utf8')
  const input = await read(path.join(__dirname, 'input.txt'), 'utf8')

  let solution = solve(input)
  let samplesolution = solve(sampleinput)

  report(input, solution)
  report(sampleinput, samplesolution)
}

function report (input, solution) {
  const solutionName = __dirname.split(path.sep).pop()
  console.log('Advent of Code 2017 :', solutionName, 'solution for', input, ':', solution)
}

run()
