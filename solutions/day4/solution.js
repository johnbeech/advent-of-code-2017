const path = require('path')
const {read} = require('promise-path')
const NL = '\n'

function testForValidPhrase (phrase) {
  let uniqueWords = {}
  let words = phrase.split(' ')
  let validPhrase = true
  words.forEach(word => {
    uniqueWords[word] = (uniqueWords[word] || 0) + 1
    if (uniqueWords[word] > 1) {
      validPhrase = false
    }
  })
  return validPhrase
}

async function run () {
  const input = await read(path.join(__dirname, 'input.txt'), 'utf8')
  const phrases = input.split(NL).filter(n => n)

  let validPhrases = phrases.filter(testForValidPhrase)
  // let invalidPhrases = phrases.filter((n) => !testForValidPhrase(n))
  let solution = validPhrases.length

  report(input, solution)
}

function report (input, solution) {
  const solutionName = __dirname.split(path.sep).pop()
  console.log('Advent of Code 2017 :', solutionName, 'solution for', input, 'is:', solution)
}

run()
