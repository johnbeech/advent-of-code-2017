const path = require('path')
const {read} = require('promise-path')
const NL = '\n'

function parseLine (line) {
  const parts = line.split(':')
  return {
    input: line,
    A: parseInt(parts[0]),
    B: parseInt(parts[1]),
    expected: parts[2],
    actual: 0
  }
}

function parseInput (input) {
  return input.split(NL).map(n => n.trim()).filter(n => n).map(parseLine)
}

function lp (str, len = 16) {
  str = str + ''
  while (str.length < len) {
    str = ' ' + str
  }
  return str
}

function solve (item) {
  const genAOffset = 16807
  const genBOffset = 48271
  const remainderOffset = 2147483647

  let n = 0
  let valueA = item.A
  let valueB = item.B
  let totalMatchces = 0

  let bitsA = 0
  let bitsB = 0

  console.log([lp('Generator A'), lp('Generator B')].join(' '))
  console.log([lp('-----------'), lp('-----------')].join(' '))
  console.log([lp(valueA), lp(valueB)].join(' '))

  while (n < 10) {
    valueA = (genAOffset * valueA) % remainderOffset
    valueB = (genBOffset * valueB) % remainderOffset

    console.log([lp(valueA), lp(valueB)].join(' '))

    bitsA = valueA & 0xFFFF
    bitsB = valueB & 0xFFFF

    if (bitsA === bitsB) {
      console.log([lp(bitsA.toString(2)), lp(bitsB.toString(2))].join(' '))
      totalMatchces++
    }

    n++
  }

  while (n < 40000000) {
    valueA = (genAOffset * valueA) % remainderOffset
    valueB = (genBOffset * valueB) % remainderOffset

    bitsA = valueA & 0xFFFF
    bitsB = valueB & 0xFFFF

    if (bitsA === bitsB) {
      totalMatchces++
    }

    n++
  }

  console.log([lp('..........'), lp('..........')].join(' '))
  console.log([lp(valueA), lp(valueB)].join(' '))

  console.log('')

  item.actual = totalMatchces

  return item
}

async function run () {
  const input = await read(path.join(__dirname, 'input.txt'), 'utf8')

  const solutions = parseInput(input).map(solve)

  solutions.map(report)
}

function report (solution) {
  const solutionName = __dirname.split(path.sep).pop()
  console.log('Advent of Code 2017 :', solutionName, 'solution for', solution.input, ':', solution.actual, ':', solution.expected)
}

run()
