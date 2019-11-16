<template>
  <v-container>
    <v-layout class="justify-space-around">
      <v-flex>
        <h1>Trivia Game</h1>
        <v-btn dark v-if="!clicked" @click="loadQuestions()" class="indigo"><v-icon left>play_arrow</v-icon>Play</v-btn>
      </v-flex>
      <v-flex>
        <v-chip v-if="clicked" color="warning" :class="{ 'pulse': isPulsing }" style="margin-top: 6px;">
          <v-icon left>stars</v-icon>Score: {{ score }}/{{ currentCard - 1 }}
        </v-chip>
      </v-flex>
    </v-layout>
    <div v-if="clicked && !loading">
      <transition-group name="slide-fade" appear v-on:after-enter="stopPulsing">
        <TriviaCard
          v-for="card in cards"
          v-show="card.id === currentCard"
          :key="card.id"
          :card="card"
          v-on:next-card="nextCard"
          v-on:add-score="addScore"
        >
      </TriviaCard>
      </transition-group>
    </div>
    <div v-else-if="clicked && loading">
      <v-card loading>
        <v-card-title>Loading questions...</v-card-title>
      </v-card>
    </div>
    <transition name="slide-fade">
      <div v-if="cards.length > 0 && currentCard > cards.length">
        <v-card
          outlined
          height="100%"
        >
          <v-list-item three-line>
            <v-list-item-content>
              <v-list-item-title class="headline">{{ message }}</v-list-item-title>
              <v-list-item-subtitle>Score: {{ score }}/{{ currentCard - 1 }}</v-list-item-subtitle>
            </v-list-item-content>

            <v-icon color="success" large>done_outline</v-icon>
          </v-list-item>
        </v-card>
        <v-btn dark color="indigo" @click="replayGame"><v-icon left>play_arrow</v-icon>Play again</v-btn>
      </div>
    </transition>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import TriviaCard from '@/components/TriviaCard.vue'
import { QCard } from '@/types'
import { pullQuestions } from '@/services'

let cards: QCard[]

export default Vue.extend({

  name: 'TriviaContainer',

  data: () => ({
    clicked: false,
    loading: false,
    score: 0,
    isPulsing: false,
    currentCard: 1,
    cards: []
  }),

  components: {
    TriviaCard
  },

  computed: {
    message () {
      if (this.score / this.cards.length > 0.5 && this.score / this.cards.length < 0.8) {
        return 'Acceptable score... I guess...'
      } else if (this.score / this.cards.length >= 0.8 && this.score !== this.cards.length) {
        return 'Impressive Starfox! Now watch out for enemies in the asteroid field!'
      } else if (this.score === this.cards.length) {
        return 'Perfect score! Mission Accomplished!'
      } else {
        return 'Oof! Better luck next time!'
      }
    }
  },

  methods: {
    addScore (): void {
      this.isPulsing = true
      this.score++
    },
    nextCard (): void {
      this.currentCard++
    },
    stopPulsing (): void {
      this.isPulsing = false
    },
    async loadQuestions () {
      this.loading = true
      this.clicked = true
      let questions = await pullQuestions()
      if (questions) {
        // Why do I need this ts-ignore? If you know how to fix this tell me on github
        // @ts-ignore
        this.cards = questions
      }
      this.loading = false
    },
    async replayGame () {
      this.loading = true
      this.clicked = true
      this.isPulsing = false
      this.score = 0
      this.currentCard = 1
      let questions = await pullQuestions()
      if (questions) {
        // Why do I need this ts-ignore? If you know how to fix this tell me on github
        // @ts-ignore
        this.cards = questions
      }
      this.loading = false
    }
  }
})

</script>

<style>
  .slide-fade-enter-active {
    transition: all 0.8s ease;
    transition-delay: 0.6s;
  }
  .slide-fade-leave-active {
    transition: all 0.3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to {
    transform: translateX(100px);
    opacity: 0;
  }

  @keyframes pulse {
    0% {
      transform: scale(1.0)
    }
    50% {
      transform: scale(1.2)
    }
    100% {
      transform: scale(1.0)
    }
  }

  .pulse {
    animation-name: pulse;
    animation-timing-function: ease-out, linear;
    animation-duration: 0.8s;
    animation-iteration-count: 1;
  }
</style>
