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

  function locRef (i, j) {
    return {
      i, j, key: `${i},${j}`
    }
  }

  function gridLoc (i, j) {
    const loc = locRef(i, j)
    return grid[loc.key] ? loc : false
  }

  function adjacent (i, j) {
    return [
      gridLoc(i, j - 1),
      gridLoc(i - 1, j),
      gridLoc(i, j + 1),
      gridLoc(i + 1, j)
    ].filter(n => n)
  }

  const regions = {}
  let regionCount = 0
  let filled = []

  for (let j = 0; j < 128; j++) {
    for (let i = 0; i < 128; i++) {
      let loc = locRef(i, j)
      if (grid[loc.key] && !regions[loc.key]) {
        console.log('Increasing region count', regionCount, 'at', loc.key, 'grid', grid[loc.key])
        regionCount++
        regions[loc.key] = regionCount
        filled.push(loc)
        do {
          loc = filled.shift()
          filled = filled.concat(adjacent(loc.i, loc.j).filter(loc => !regions[loc.key])).map(loc => {
            regions[loc.key] = regionCount
            return loc
          })
        } while (filled.length > 0)
      }
    }
  }

  return {
    key,
    squaresInUse,
    grid,
    regions,
    regionCount
  }
}

function printGrid (solution) {
  const size = 96
  console.log('Solution for:', solution.key, ': Squares in use :', solution.squaresInUse, 'Regions in use : ', solution.regionCount)

  const grid = solution.grid
  const regions = solution.regions

  let row
  let key

  const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz'.split('')

  for (let j = 0; j < size; j++) {
    row = []
    for (let i = 0; i < size; i++) {
      key = `${i},${j}`
      row.push(grid[key] ? alphabet[regions[key]] || '#' : '.')
    }
    console.log(row.join(' '))
  }
  console.log('')
}

async function run () {
  const input = await read(path.join(__dirname, 'input.txt'), 'utf8')

  const keys = input.split(NL).map(n => n.trim()).filter(n => n)

  const solutions = keys.map(solve)

  solutions.map(printGrid)
}

run()
