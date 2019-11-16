import { QCard } from '@/types'
import axios from 'axios'

const API: string = 'https://opentdb.com/api.php?amount=8&type=multiple&encode=base64'

/* eslint-disable camelcase */
interface Result {
  category: string,
  type: string,
  difficulty: string,
  question: string,
  correct_answer: string,
  incorrect_answers: Array<string>
}
/* eslint-enable camelcase */

function shuffle (array: any[]) {
  var currentIndex = array.length; var temporaryValue; var randomIndex
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1
    // And swap it with the current element.
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }
  return array
}

async function pullQuestions () {
  let count = 0
  let questions: Array<QCard> = []
  let data = await axios.get(API)
  data.data.results.forEach((el: Result) => {
    count++
    let alternatives: Array<string> = []
    alternatives.push(atob(el.correct_answer))
    el.incorrect_answers.forEach((e) => {
      alternatives.push(atob(e))
    })
    let shuffledAlternatives = shuffle(alternatives)
    questions.push({
      id: count,
      category: atob(el.category),
      prompt: atob(el.question),
      choices: shuffledAlternatives,
      correct: atob(el.correct_answer)
    })
  })
  return questions
}

export { pullQuestions }
