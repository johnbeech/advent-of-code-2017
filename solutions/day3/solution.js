const path = require('path')
const {read} = require('promise-path')

function createGrid (size) {
  const grid = {
    direction: 0,
    x: 0,
    y: 0,
    size: 0,
    cells: {}
  }

  grid.get = (x, y) => {
    const key = [x, y].join(':')
    return grid.cells[key] || false
  }

  grid.set = (x, y, value) => {
    const key = [x, y].join(':')
    grid.cells[key] = value
  }

  let i = 0
  while (i < size) {
    createCell(grid)
    i++
  }

  grid.distance = Math.abs(grid.x) + Math.abs(grid.y) - 1

  return grid
}

function createCell (grid) {
  let { x, y } = grid
  let key = [x, y].join(':')
  grid.size = grid.size + 1
  grid.cells[key] = true

  // console.log('Populating:', key, grid.get(grid.x, grid.y))
  let location = moveForward(grid)

  // console.log('Moved', 'from', grid.x, grid.y, 'to', location.x, location.y)
  grid.x = location.x
  grid.y = location.y

  if (shouldTurn(grid)) {
    turnLeft(grid)
    // console.log(`Turning ${(['East', 'North', 'West', 'South'])[grid.direction]}`)
  }

  return { x, y }
}

function numerateGrid (maxCount) {
  const grid = createGrid(1)
  grid.cells['0:0'] = 1

  let location
  let value = 0
  while (value < maxCount) {
    location = createCell(grid)
    value = sumNeighbours(grid, location)
    grid.set(location.x, location.y, value)
    console.log('Location', location, value)
  }

  console.log('Max value', value, 'at', location)
}

function sumNeighbours (grid, location) {
  let sum = 0
  let { x, y } = location
  sum = sum + (grid.get(x + 0, y - 1) || 0)
  sum = sum + (grid.get(x + 0, y + 1) || 0)
  sum = sum + (grid.get(x + 1, y - 1) || 0)
  sum = sum + (grid.get(x + 1, y + 0) || 0)
  sum = sum + (grid.get(x + 1, y + 1) || 0)
  sum = sum + (grid.get(x - 1, y - 1) || 0)
  sum = sum + (grid.get(x - 1, y + 0) || 0)
  sum = sum + (grid.get(x - 1, y + 1) || 0)

  return sum
}

function shouldTurn (grid) {
  let { x, y, direction } = grid
  let tx = x
  let ty = y

  if (direction === 0) {
    ty = y - 1
  } else if (direction === 1) {
    tx = x - 1
  } else if (direction === 2) {
    ty = y + 1
  } else {
    tx = x + 1
  }
  // console.log('At:', x, y, 'Checking:', tx, ty, ':', grid.get(tx, ty))
  return grid.get(tx, ty) === false
}

function moveForward ({x, y, direction}) {
  if (direction === 0) {
    x = x + 1
  } else if (direction === 1) {
    y = y - 1
  } else if (direction === 2) {
    x = x - 1
  } else {
    y = y + 1
  }

  return {x, y}
}

function turnLeft (grid) {
  grid.direction = (grid.direction + 1) % 4
}

async function run () {
  const input = await read(path.join(__dirname, 'input.txt'), 'utf8')

  const gridSize = Number.parseInt(input)

  const tests = [{
    position: gridSize,
    solution: 'unknown'
  }, {
    position: 1,
    solution: 0
  }, {
    position: 12,
    solution: 3
  }, {
    position: 23,
    solution: 2
  }, {
    position: 1024,
    solution: 31
  }]

  tests.forEach(test => {
    const grid = createGrid(test.position)
    test.calculation = grid.distance
    test.x = grid.x
    test.y = grid.y
  })

  report(input, tests)

  numerateGrid(gridSize)
}

function report (input, solution) {
  const solutionName = __dirname.split(path.sep).pop()
  console.log('Advent of Code 2017 :', solutionName, 'solution for', input, ':', solution)
}

run()
