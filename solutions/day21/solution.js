const path = require('path')
const {read} = require('promise-path')
const NL = '\n'

function mirrorArray (matrix) {
  matrix = JSON.parse(JSON.stringify(matrix))
  return matrix.map(line => line.reverse())
}

function rotateArray (matrix) {
  matrix = JSON.parse(JSON.stringify(matrix))
  // reverse the rows
  matrix = matrix.reverse()
  // swap the symmetric elements
  for (var i = 0; i < matrix.length; i++) {
    for (var j = 0; j < i; j++) {
      var temp = matrix[i][j]
      matrix[i][j] = matrix[j][i]
      matrix[j][i] = temp
    }
  }
  return matrix
}

const binariseLine = n => n.split('').map(n => (n === '#') ? 1 : 0)
const displayLine = n => n.map(n => n ? 'X' : '.').join('')
const displayPattern = n => n.map(displayLine).join(NL)
const startPattern = `
  .#.
  ..#
  ###
  `.trim().split(NL).map(n => n.trim()).filter(n => n).map(binariseLine)

function parseLine (line) {
  // ../.# => ##./#../...
  // .#./..#/### => #..#/..../..../#..#
  const parts = line.split(' => ')
  return {
    pattern: parts[0].split('/').map(binariseLine),
    division: parts[1].split('/').map(binariseLine)
  }
}

function parseInput (input) {
  return input.trim().split(NL).map(parseLine)
}

function transposePatterns (instruction) {
  const pattern = instruction.pattern
  const patternSet = new Set([
    pattern,
    rotateArray(pattern),
    rotateArray(rotateArray(pattern)),
    rotateArray(rotateArray(rotateArray(pattern))),
    mirrorArray(pattern),
    mirrorArray(rotateArray(pattern)),
    mirrorArray(rotateArray(rotateArray(pattern))),
    mirrorArray(rotateArray(rotateArray(rotateArray(pattern))))
  ].map(n => JSON.stringify(n)))

  // console.log('Pattern Set', [...patternSet])

  return {
    pattern,
    patterns: [...patternSet].map(n => JSON.parse(n)),
    division: instruction.division
  }
}

function solve (instructions) {
  const expandedInstructions = instructions.map(transposePatterns)

  console.log('Instructions')
  expandedInstructions.forEach(n => {
    console.log([`Pattern (${n.patterns.length} variants)`, displayPattern(n.pattern), 'Division', displayPattern(n.division)].join(NL + NL), NL)
  })

  // console.log('Expanded Instructions')
  // expandedInstructions.map(n => n.patterns.map(displayPattern).map(n => console.log(n, NL)))

  return {
    input: instructions.length + ' instructions',
    actual: 0
  }
}

async function run () {
  const sampleinput = await read(path.join(__dirname, 'sampleinput.txt'), 'utf8')
  const input = await read(path.join(__dirname, 'input.txt'), 'utf8')

  const solutions = [sampleinput, input].map(parseInput).map(solve)

  console.log('Start Pattern', NL + displayPattern(startPattern))
  solutions.forEach(report)
}

function report (solution) {
  const solutionName = __dirname.split(path.sep).pop()
  console.log('Advent of Code 2017 :', solutionName, 'solution for', solution.input)
  console.log(solution.actual)
}

run()
