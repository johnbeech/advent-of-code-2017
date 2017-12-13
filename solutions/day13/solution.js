const path = require('path')
const {read} = require('promise-path')
const NL = '\n'

function parseNetworkEntry (line) {
  const parts = line.split(': ')
  return {
    depth: parseInt(parts[0]),
    range: parseInt(parts[1])
  }
}

function parseNetworkScan (input) {
  const columns = input.split(NL).map(n => n.trim()).filter(n => n).map(parseNetworkEntry)
  return {
    columns,
    input
  }
}

function createNetwork (columns) {
  const network = []
  const networkSize = Math.max(...columns.map(c => c.depth))

  let c
  while (network.length <= networkSize) {
    c = network.length
    network[c] = columns.filter(c => c.depth === network.length)[0] || {
      depth: c,
      range: 0
    }

    network[c].scanner = {
      position: -1,
      direction: 1
    }
  }

  network.moveScanners = function () {
    network.forEach(n => {
      // reference the scanner
      const scanner = n.scanner

      // move the scanner along the track
      if (n.range) {
        scanner.position = scanner.position + scanner.direction

        // flip direction at either end
        if (scanner.direction === -1 && scanner.position === 0) {
          scanner.direction = -scanner.direction
        } else if (scanner.direction === 1 && scanner.position === (n.range - 1)) {
          scanner.direction = -scanner.direction
        }
      }
    })
  }

  network.moveScanners()

  return network
}

function sp (n) {
  n = n + ''
  if (n.length < 2) {
    n = ' ' + n
  }
  return n
}

function solve (networkScan) {
  const network = createNetwork(networkScan.columns)

  function printNetwork (network, pos) {
    console.log(' ' + network.map(n => sp(n.depth)).join(' '))
    console.log(' ' + network.map(n => sp(n.range)).join(' '))
    console.log(' ' + network.map(n => sp('-')).join(' '))
    console.log(' ' + network.map(n => sp(n.depth === pos ? 'X' : 'o')).join(' '))
    console.log(' ' + network.map(n => sp(n.scanner.position)).join(' '))
    console.log('')
  }

  const steps = network.length
  const severity = []
  while (severity.length < steps) {
    const pos = severity.length
    const node = network[pos]
    let score = 0

    if (node.scanner.position === 0) {
      score = node.depth * node.range
    }
    severity.push(score)

    network.moveScanners()

    printNetwork(network, pos)
  }

  return {
    input: networkScan.input,
    columns: networkScan.columns,
    actual: severity.join(', ') + ' : Severity Score : ' + severity.reduce((acc, n) => acc + n, 0)
  }
}

async function run () {
  const sampleinput = await read(path.join(__dirname, 'sampleinput.txt'), 'utf8')
  const input = await read(path.join(__dirname, 'input.txt'), 'utf8')

  const solutions = [sampleinput, input].map(parseNetworkScan).map(solve)

  // console.log('Solutions', JSON.stringify(solutions, null, 2))

  solutions.forEach(report)
}

function report (solution) {
  const solutionName = __dirname.split(path.sep).pop()
  console.log('Advent of Code 2017 :', solutionName, 'solution for', solution.input, ':', solution.actual)
}

run()
