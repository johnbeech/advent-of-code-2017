const path = require('path')
const {read, write} = require('promise-path')
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

function saveHTMLGrid (solution) {
  const size = 128
  console.log('Solution for:', solution.key, ': Squares in use :', solution.squaresInUse, 'Regions in use : ', solution.regionCount)

  const grid = solution.grid
  const regions = solution.regions

  let row
  let key

  const colors = {}
  function color (num) {
    if (colors[num]) {
      return colors[num]
    }
    let hash = knothash(num)
    let r = hash[0].toString(16) + hash[1].toString(16)
    let g = hash[2].toString(16) + hash[3].toString(16)
    let b = hash[4].toString(16) + hash[5].toString(16)

    colors[num] = '#' + r + g + b

    return colors[num]
  }

  const rows = []
  for (let j = 0; j < size; j++) {
    row = []
    for (let i = 0; i < size; i++) {
      key = `${i},${j}`
      row.push(grid[key] ? color(regions[key]) : '#000')
    }
    rows.push(row)
  }
  const html = `
<html>
  <head><title>${solution.key}</title></head>
  <style>
    .grid {
      display: block;
      width: 512px;
      height: 512px;
      overflow: hidden;
    }
    .grid > div {
      width: 4px;
      height: 4px;
      display: inline-block;
      overflow: hidden;
    }
  </style>
<body>
  <div class="grid">
    ${rows.map((row, i) => {
      return row.map((col, i) => {
        return '<div style="background:' + col + '"></div>'
      }).join('')
    }).join('')}
  </div>
</body>
</html>
  `

  write(`${__dirname}/${solution.key}.html`, html, 'utf8').then(() => {
    console.log('Wrote', `${solution.key}.html`)
  })
}

function printGrid (solution) {
  const size = 16
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
  solutions.map(saveHTMLGrid)
}

run()
