const path = require('path')
const {read} = require('promise-path')
const NL = '\n'

function parseNetworkEntry (line) {
  const parts = line.split(': ')
  return {
    depth: parseInt(parts[0]),
    range: parseInt(parts[1])
  }
}

function parseNetworkScan (input) {
  const columns = input.split(NL).map(n => n.trim()).filter(n => n).map(parseNetworkEntry).reduce((a, n) => {
    a[n.depth] = n
    return a
  }, [])

  let i = 0
  while (i < columns.length) {
    columns[i] = columns[i] || {
      depth: i,
      range: 0
    }
    i++
  }

  return {
    columns,
    input
  }
}

function calculateSeverity (columns, delay) {
  return columns.map(c => {
    if (c.range) {
      const picosecond = delay + c.depth
      const circularRange = (c.range - 1) * 2
      const scannerPos = picosecond % circularRange
      if (scannerPos === 0) {
        return {caught: true, score: c.range * c.depth}
      }
    }
    return {caught: false, score: 0}
  })
}

function solve (networkScan) {
  let score = scoreRun(networkScan.columns, 0)

  let delay = 0

  do {
    delay = delay + 1
    score = scoreRun(networkScan.columns, delay)
    if (delay % 1000 === 0) {
      console.log('Delay', delay)
    }
  } while (score.gotCaught)

  return {
    input: networkScan.input,
    columns: networkScan.columns,
    actual: score.record.map(r => r.caught ? `(${r.score})` : 0).join(', ') + ' : Severity Score : ' + score.total + ' : Safepath Delay : ' + delay
  }
}

function scoreRun (columns, delay) {
  const severity = calculateSeverity(columns, delay)
  const total = severity.reduce((acc, n) => acc + n.score, 0)
  const gotCaught = severity.reduce((acc, n) => acc || n.caught, false)

  return {
    record: severity,
    gotCaught,
    total,
    delay
  }
}

async function run () {
  const sampleinput = await read(path.join(__dirname, 'sampleinput.txt'), 'utf8')
  const input = await read(path.join(__dirname, 'input.txt'), 'utf8')

  const solutions = [sampleinput, input].map(parseNetworkScan).map(solve)

  // console.log('Solutions', JSON.stringify(solutions, null, 2))

  solutions.forEach(report)
}

function report (solution) {
  const solutionName = __dirname.split(path.sep).pop()
  console.log('Advent of Code 2017 :', solutionName, 'solution for', solution.input, ':', solution.actual)
}

run()
