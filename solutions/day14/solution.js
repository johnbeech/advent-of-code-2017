const path = require('path')
const {read} = require('promise-path')
const knothash = require('./knothash')
const NL = '\n'

function ConvertBase (num) {
  return {
    from: function (baseFrom) {
      return {
        to: function (baseTo) {
          return parseInt(num, baseFrom).toString(baseTo)
        }
      }
    }
  }
}

function zp (str, len) {
  while (str.length < len) {
    str = 0 + str
  }
  return str
}

const hex2bin = function (num) {
  return zp(ConvertBase(num).from(16).to(2), 4)
}

function solve (key) {
  let squaresInUse = 0
  const grid = {}

  const hashes = []
  let hash
  while (hashes.length < 128) {
    hash = knothash(`${key}-${hashes.length}`)
    hash.split('').map(hex2bin).join('').split('').map(n => parseInt(n)).forEach((d, i) => {
      grid[`${i},${hashes.length}`] = d
      squaresInUse = squaresInUse + d
    })
    hashes.push(hash)
  }

  return {
    key,
    squaresInUse,
    grid
  }
}

function print8x8 (solution) {
  console.log('Solution for:', solution.key, ': Squares in use :', solution.squaresInUse)

  const size = 8
  const grid = solution.grid

  let row
  let key

  for (let j = 0; j < size; j++) {
    row = []
    for (let i = 0; i < size; i++) {
      key = `${i},${j}`
      row.push(grid[key] ? '#' : '.')
    }
    console.log(row.join(' '))
  }
  console.log('')
}

async function run () {
  const input = await read(path.join(__dirname, 'input.txt'), 'utf8')
  let solution = 'UNSOLVED'

  const keys = input.split(NL).map(n => n.trim()).filter(n => n)

  const solutions = keys.map(solve)

  solutions.map(print8x8)

  report(input, solution)
}

function report (input, solution) {
  const solutionName = __dirname.split(path.sep).pop()
  console.log('Advent of Code 2017 :', solutionName, 'solution for', input, ':', solution)
}

run()
