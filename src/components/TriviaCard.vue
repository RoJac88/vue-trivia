<template>
  <v-card outlined>
    <v-list-item>
      <v-list-item-content>
        <div class="overline">{{ card.category }}</div>
        <span class="headline">{{ card.prompt }}</span>
      </v-list-item-content>
    </v-list-item>
    <v-btn
      block
      @click="makeChoice(choice)"
      v-for="(choice, index) in card.choices"
      :key="`choice-${index}`"
      :class="{ 'correct': isCorrect(choice), 'incorrect': isIncorrect(choice), 'not-chosen': notChosen(choice) }"
    >
      {{ choice }}
    </v-btn>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'TriviaCard',

  data: () => ({
    hasChosen: false,
    myChoice: '',
    canClick: true
  }),

  props: ['card'],

  methods: {
    makeChoice (choice: string) {
      if (this.canClick) {
        this.canClick = false
        this.myChoice = choice
        this.hasChosen = true
        setTimeout(() => {
          this.hasChosen = false
          this.$emit('next-card')
          if (choice === this.card.correct) {
            this.$emit('add-score')
          }
        }, 2900)
      }
    },
    notChosen (choice: string): boolean {
      return (this.hasChosen === true && this.myChoice !== choice)
    },
    isCorrect (choice: string): boolean {
      return (this.hasChosen === true && this.myChoice === choice && choice === this.card.correct)
    },
    isIncorrect (choice: string): boolean {
      return (this.hasChosen === true && this.myChoice === choice && choice !== this.card.correct)
    }
  }

})
</script>

<style>

@keyframes fade {
  from {
    opacity: 1.0;
  }
  to {
    opacity: 0;
  }
}

@keyframes grow {
  from {
    transform: scale(1.0);
  }
  to {
    transform: scale(1.1);
  }
}

@keyframes fail {
  from {
    background-color: grey;
    color: black;
  }
  to {
    background-color: #d9534f;
    color: white;
  }
}

@keyframes success {
  from {
    background-color: grey;
    color: black;
  }
  to {
    background-color: #5cb85c;
    color: white;
  }
}

.not-chosen {
  animation-name: fade;
  animation-duration: 2s;
  animation-fill-mode: forwards;
  animation-iteration-count: 1;
}

.correct {
  animation-name: grow, success;
  animation-duration: 2s, 0.2s;
  animation-delay: 0.2s, 2s;
  animation-fill-mode: forwards;
  animation-iteration-count: 1;
  animation-timing-function: ease-in-out;
}

.incorrect {
  animation-name: grow, fail;
  animation-duration: 2s, 0.2s;
  animation-delay: 0.2s, 1.8s;
  animation-fill-mode: forwards;
  animation-iteration-count: 1;
  animation-timing-function: ease-in-out;
}

</style>
