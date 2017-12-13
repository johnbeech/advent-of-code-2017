const path = require('path')
const {read} = require('promise-path')
const NL = '\n'

function parseNetworkEntry (line) {
  const parts = line.split(': ')
  return {
    id: parseInt(parts[0]),
    depth: parseInt(parts[1])
  }
}

function parseNetworkScan (input) {
  const columns = input.split(NL).map(n => n.trim()).filter(n => n).map(parseNetworkEntry)
  return {
    columns,
    input
  }
}

function solve (networkScan) {
  return {
    input: networkScan.input,
    columns: networkScan.columns,
    actual: 'UNSOLVED'
  }
}

async function run () {
  const sampleinput = await read(path.join(__dirname, 'sampleinput.txt'), 'utf8')
  const input = await read(path.join(__dirname, 'input.txt'), 'utf8')

  const solutions = [sampleinput, input].map(parseNetworkScan).map(solve)

  console.log('Solutions', JSON.stringify(solutions, null, 2))

  solutions.forEach(report)
}

function report (solution) {
  const solutionName = __dirname.split(path.sep).pop()
  console.log('Advent of Code 2017 :', solutionName, 'solution for', solution.input, ':', solution.actual)
}

run()
