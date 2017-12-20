const path = require('path')
const {read} = require('promise-path')
const stats = require('stats-lite')
const NL = '\n'

function parseVector (inputFragment) {
  let vector = inputFragment.substr(3).replace('>', '').split(',').map(n => parseInt(n))

  return {x: vector[0], y: vector[1], z: vector[2]}
}

function parseLine (line) {
  const parts = line.split(', ').map(p => p.trim())
  return {
    p: parseVector(parts[0]),
    v: parseVector(parts[1]),
    a: parseVector(parts[2]),
    distances: []
  }
}

function updatePosition (particle) {
  // Increase the X velocity by the X acceleration.
  particle.v.x = particle.v.x + particle.a.x
  // Increase the Y velocity by the Y acceleration.
  particle.v.y = particle.v.y + particle.a.y
  // Increase the Z velocity by the Z acceleration.
  particle.v.z = particle.v.z + particle.a.z

  // Increase the X position by the X velocity.
  particle.p.x = particle.p.x + particle.v.x
  // Increase the Y position by the Y velocity.
  particle.p.y = particle.p.y + particle.v.y
  // Increase the Z position by the Z velocity.
  particle.p.z = particle.p.z + particle.v.z

  // Calculate Manhattan distance, which in this situation is simply the sum of the absolute values of a particle's X, Y, and Z position.
  particle.distance = Math.abs(particle.p.x) + Math.abs(particle.p.y) + Math.abs(particle.p.z)
  particle.distances.push(particle.distance)

  particle.key = particle.p.x + ',' + particle.p.y + ',' + particle.p.z
}

function tick (state, processCollisions = false) {
  state.forEach(updatePosition)

  if (processCollisions) {
    state = destroy(state)
  }

  return state
}

function destroy (state) {
  const points = {}
  state.forEach(particle => {
    points[particle.key] = (points[particle.key] || 0) + 1
  })

  return state.filter(particle => points[particle.key] === 1)
}

function solve (input, processCollisions) {
  let state = input

  let n = 0
  while (n < 100) {
    state = tick(state, processCollisions)
    n++
  }

  const ordered = state.map((p, i) => {
    p.index = i
    p.minimum = Math.min(...p.distances)
    p.average = stats.median(p.distances)
    p.measure = p.average
    p.distances = []
    return p
  }).sort((a, b) => a.measure > b.measure ? 1 : -1)

  console.log('Final State', state)

  return {
    input: input.length + ' particles',
    lowestIndex: ordered[0].index,
    finalLength: state.length
  }
}

function parseInput (input) {
  return input.trim().split(NL).map(parseLine)
}

async function run () {
  const input = await read(path.join(__dirname, 'input.txt'), 'utf8')

  const solution1 = await Promise.resolve(parseInput(input)).then(input => solve(input, false))
  const solution2 = await Promise.resolve(parseInput(input)).then(input => solve(input, true))

  report({
    input: solution1.input,
    part1: solution1.lowestIndex,
    part2: solution2.finalLength
  })
}

/* p=< 3,0,0>, v=< 2,0,0>, a=<-1,0,0>    -4 -3 -2 -1  0  1  2  3  4
p=< 4,0,0>, v=< 0,0,0>, a=<-2,0,0> */

function report (solution) {
  const solutionName = __dirname.split(path.sep).pop()
  console.log('Advent of Code 2017 :', solutionName, 'solution for', solution.input, ': part 1 : ', solution.part1, ': part 2 : ', solution.part2)
}

run()
