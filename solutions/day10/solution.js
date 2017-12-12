const path = require('path')
const {read} = require('promise-path')
const NL = '\n'

function parseTest (line) {
  const parts = line.split(':')
  return {
    input: line,
    length: parseInt(parts[0]),
    lengths: parts[1].split(',').map(n => parseInt(n)),
    actual: 0,
    expected: parts[2]
  }
}

function parseTests (input) {
  return input.split(NL).map(n => n.trim()).filter(n => n).map(parseTest)
}

function readCircularSection (array, start, distance) {
  const result = []
  for (let i = 0; i < distance; i++) {
    let index = (start + i) % array.length
    result.push(array[index])
  }
  return result
}

function setCircularSection (array, start, data) {
  for (let i = 0; i < data.length; i++) {
    let index = (start + i) % array.length
    array[index] = data[i]
  }
}

function solve (test) {
  test.data = []
  test.skipSize = 0
  test.position = 0
  while (test.data.length < test.length) {
    test.data.push(test.data.length)
  }

  test.lengths.forEach(length => {
    const section = readCircularSection(test.data, test.position, length)
    section.reverse()
    setCircularSection(test.data, test.position, section)

    test.position = test.position + test.skipSize + length
    test.skipSize++
  })

  test.actual = test.data[0] * test.data[1]

  return test
}

async function run () {
  const input = await read(path.join(__dirname, 'input.txt'), 'utf8')
  const tests = parseTests(input)

  const solutions = tests.map(solve)

  solutions.map(report)
}

function report (test) {
  const solutionName = __dirname.split(path.sep).pop()
  console.log('Advent of Code 2017 :', solutionName, 'solution for', test.input, ':', test.actual, `(${test.expected})`)
}

run()
