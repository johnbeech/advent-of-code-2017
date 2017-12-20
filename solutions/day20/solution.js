const path = require('path')
const {read} = require('promise-path')
const NL = '\n'

function parseVector (inputFragment) {
  let vector = inputFragment.substr(3).replace('>', '').split(',').map(n => parseInt(n))

  return {
    x: vector[0],
    y: vector[1],
    z: vector[2]
  }
}

function parseLine (line) {
  const parts = line.split(', ').map(p => p.trim())
  return {
    p: parseVector(parts[0]),
    v: parseVector(parts[1]),
    a: parseVector(parts[2])
  }
}

function solve (input) {
  console.log('Solve', input)

  return {
    input: input.length + ' particles',
    actual: 'unknown'
  }
}

function parseInput (input) {
  return input.trim().split(NL).map(parseLine)
}

async function run () {
  const sampleinput = await read(path.join(__dirname, 'sampleinput.txt'), 'utf8')
  const input = await read(path.join(__dirname, 'input.txt'), 'utf8')

  const solutions = [sampleinput, input].map(parseInput).map(solve)

  solutions.forEach(report)
}

/*
p=< 3,0,0>, v=< 2,0,0>, a=<-1,0,0>    -4 -3 -2 -1  0  1  2  3  4
p=< 4,0,0>, v=< 0,0,0>, a=<-2,0,0>
*/

function report (solution) {
  const solutionName = __dirname.split(path.sep).pop()
  console.log('Advent of Code 2017 :', solutionName, 'solution for', solution.input, ':', solution.actual)
}

run()
