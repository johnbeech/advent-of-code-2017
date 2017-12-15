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

const genAOffset = 16807
const genBOffset = 48271

const genAFilter = 4
const genBFilter = 8

const remainderOffset = 2147483647

function printLine (a, b) {
  console.log([lp(a), lp(b)].join(' '))
}

function solvePart1 (item) {
  let n = 0
  let valueA = item.A
  let valueB = item.B
  let totalMatchces = 0

  let bitsA = 0
  let bitsB = 0

  printLine('Generator A:1', 'Generator B:1')
  printLine('-------------', '-------------')
  printLine(valueA, valueB)

  while (n < 10) {
    valueA = (genAOffset * valueA) % remainderOffset
    valueB = (genBOffset * valueB) % remainderOffset

    console.log([lp(valueA), lp(valueB)].join(' '))

    bitsA = valueA & 0xFFFF
    bitsB = valueB & 0xFFFF

    if (bitsA === bitsB) {
      printLine(bitsA.toString(2), bitsB.toString(2))
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

  printLine('............', '............')
  printLine(valueA, valueB)

  console.log('')

  item.actual = totalMatchces

  return item
}

function solvePart2 (item) {
  const generatorA = createGenerator(item.A, genAOffset, genAFilter)
  const generatorB = createGenerator(item.B, genBOffset, genBFilter)

  let valueA = item.A
  let valueB = item.B

  printLine('Generator A:2', 'Generator B:2')
  printLine('-------------', '-------------')
  printLine(valueA, valueB)

  let n = 0
  let totalMatchces = 0

  let bitsA = 0
  let bitsB = 0

  while (n < 10) {
    valueA = generatorA.generate()
    valueB = generatorB.generate()
    printLine(valueA, valueB)

    bitsA = valueA & 0xFFFF
    bitsB = valueB & 0xFFFF

    if (bitsA === bitsB) {
      printLine(bitsA.toString(2), bitsB.toString(2))
      totalMatchces++
    }

    n++
  }

  while (n < 5000000) {
    valueA = generatorA.generate()
    valueB = generatorB.generate()

    bitsA = valueA & 0xFFFF
    bitsB = valueB & 0xFFFF

    if (bitsA === bitsB) {
      totalMatchces++
    }

    n++
  }

  printLine('............', '............')
  printLine(valueA, valueB)

  console.log('')

  item.actual = totalMatchces

  return item
}

function createGenerator (startValue, factorOffset, filter) {
  const remainderOffset = 2147483647

  let value = startValue

  function generate () {
    do {
      value = (factorOffset * value) % remainderOffset
    } while (value % filter !== 0)

    return value
  }

  return {
    generate
  }
}

async function run () {
  const input = await read(path.join(__dirname, 'input.txt'), 'utf8')

  const part1solutions = parseInput(input).map(solvePart1)
  const part2solutions = parseInput(input).map(solvePart2)

  part1solutions.map(report)
  part2solutions.map(report)
}

function report (solution) {
  const solutionName = __dirname.split(path.sep).pop()
  console.log('Advent of Code 2017 :', solutionName, 'solution for', solution.input, ':', solution.actual, ':', solution.expected)
}

run()
