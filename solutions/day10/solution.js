const path = require('path')
const {read} = require('promise-path')
const NL = '\n'

function parseTest (line) {
  const parts = line.split(':')
  return {
    length: parseInt(parts[0]),
    input: parts[1],
    actual: 0,
    expected: parts[2],
    expectedHash: parts[3]
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

function solve1 (test) {
  test.data = []
  test.skipSize = 0
  test.position = 0
  test.lengths = test.input.split(',').map(n => parseInt(n))
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

function zp (str) {
  if (str.length < 2) {
    return '0' + str
  }
  return str
}

function hexCode (value) {
  return zp(value.toString(16))
}

function solve2 (test) {
  test.data = []
  test.skipSize = 0
  test.position = 0
  test.lengths = test.input.split('').map(n => (n + '').charCodeAt(0)).concat(17, 31, 73, 47, 23)
  test.expected = test.expectedHash
  while (test.data.length < test.length) {
    test.data.push(test.data.length)
  }

  for (let r = 0; r < 64; r++) {
    test.lengths.forEach(length => {
      const section = readCircularSection(test.data, test.position, length)
      section.reverse()
      setCircularSection(test.data, test.position, section)

      test.position = test.position + test.skipSize + length
      test.skipSize++
    })
  }

  test.sparseHash = [].concat(test.data)
  test.denseHash = bitwiseBlock(test.sparseHash, 16)
  test.knotHash = test.denseHash.map(hexCode).join('')

  test.actual = test.knotHash

  return test
}

function bitwiseBlock (array, blockSize) {
  const result = []
  for (let i = 0; i < blockSize; i++) {
    result[i] = 0
    for (let j = 0; j < blockSize; j++) {
      result[i] = result[i] ^ array[(i * blockSize) + j]
    }
  }
  return result
}

async function run () {
  const input1 = await read(path.join(__dirname, 'input.txt'), 'utf8')
  const input2 = await read(path.join(__dirname, 'input-part2.txt'), 'utf8')

  const solutions1 = parseTests(input1).map(solve1)
  const solutions2 = parseTests(input2).map(solve2)

  solutions1.map(report)
  solutions2.map(report)
}

function report (test) {
  const solutionName = __dirname.split(path.sep).pop()
  console.log('Advent of Code 2017 :', solutionName, 'solution for', `"${test.input}"`, ':', test.actual, `(${test.expected})`)
}

run()
