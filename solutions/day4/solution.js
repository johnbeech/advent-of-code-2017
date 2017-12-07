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

function testForValidPhraseAdvanced (phrase) {
  let uniqueWords = {}
  let words = phrase.split(' ')
  let validPhrase = true
  words.forEach(word => {
    const anagram = sortWord(word)
    uniqueWords[anagram] = (uniqueWords[anagram] || 0) + 1
    if (uniqueWords[anagram] > 1) {
      validPhrase = false
    }
  })
  return validPhrase
}

function sortWord (word) {
  return word.split('').sort().join('')
}

async function run () {
  const input = await read(path.join(__dirname, 'input.txt'), 'utf8')
  const phrases = input.split(NL).filter(n => n)

  let validPhrases1 = phrases.filter(testForValidPhrase)
  let solution1 = validPhrases1.length

  let validPhrases2 = phrases.filter(testForValidPhraseAdvanced)
  let solution2 = validPhrases2.length

  report(input.length, solution1)
  report(input.length, solution2)
}

function report (input, solution) {
  const solutionName = __dirname.split(path.sep).pop()
  console.log('Advent of Code 2017 :', solutionName, 'solution for', input, 'is:', solution)
}

run()
