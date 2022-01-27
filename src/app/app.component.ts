import { Component, ElementRef, ViewChild } from '@angular/core'
import {
  ExactRequirement,
  ExistsRequirement,
  InexistentRequirement,
  Requirement,
  WordPossibilitiesService,
} from './word-possibilities.service'

export type GuessingResult = 'unknown' | 'exists' | 'exact'

export type GuessedLetter = {
  letter: string
  result: GuessingResult
}

export enum State {
  IDLE,
  LOADING,
  RUNNING,
}

export enum WordState {
  SAVED,
  LOADING,
  UNSAVED,
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  private static readonly numberOfGuesses = 6
  private static readonly wordLength = 5

  @ViewChild('wordsContainer')
  wordsContainer?: ElementRef<HTMLDivElement>

  title = 'wordle-helper'
  requiredLettersRules: Requirement[] = []
  guesses: GuessedLetter[][] = Array(AppComponent.numberOfGuesses)
    .fill(1)
    .map(() =>
      Array(AppComponent.wordLength)
        .fill(1)
        .map(() => ({
          result: 'unknown',
          letter: '',
        })),
    )
  readonly State = State
  readonly WordState = WordState
  state: State = State.IDLE
  wordStates: WordState[] = Array(AppComponent.numberOfGuesses)
    .fill(1)
    .map(() => WordState.UNSAVED)

  constructor(public wordPossibilitiesService: WordPossibilitiesService) {}

  private static rowAndColToIndex(row: number, col: number) {
    return row * AppComponent.wordLength + col
  }

  private static indexToRowAndCol(index: number) {
    return {
      row: Math.floor(index / this.wordLength),
      col: index % this.wordLength,
    }
  }

  backspace(row: number, col: number) {
    const { row: prevRow, col: prevCol } = AppComponent.indexToRowAndCol(
      AppComponent.rowAndColToIndex(row, col) - 1,
    )

    const prevItem = this.guesses[prevRow][prevCol]
    if (prevItem) {
      prevItem.letter = ''
    }

    this.focusRelative(row, col, -1)
  }

  focusRelative(currRow: number, currCol: number, delta: number) {
    const letters: NodeListOf<HTMLElement> | undefined =
      this.wordsContainer?.nativeElement.querySelectorAll('app-letter input')
    letters?.[AppComponent.rowAndColToIndex(currRow, currCol) + delta]?.focus()
  }

  updateRules(newGuesses: GuessedLetter[]) {
    return Promise.all(
      newGuesses
        .map((letter, index) => ({ ...letter, index }))
        .flat()
        .map(({ result, letter, index }): Requirement | undefined => {
          if (result === 'exact') {
            return {
              type: 'exact',
              letter,
              index,
            } as ExactRequirement
          } else if (result === 'exists') {
            return {
              type: 'exists',
              letter,
              incorrectIndex: index,
            } as ExistsRequirement
          } else if (letter.length) {
            return {
              type: 'inexistent',
              letter,
            } as InexistentRequirement
          } else {
            return undefined
          }
        })
        .filter((v): v is Requirement => v !== undefined)
        .map((r) => this.wordPossibilitiesService.addRequirement(r)),
    )
  }

  commitRules(wordIndex: number) {
    this.updateRules(this.guesses[wordIndex]).then(() => {
      this.wordStates[wordIndex] = WordState.SAVED
    })
  }

  loadPossibilities() {
    this.wordPossibilitiesService.resetPossibilities(5).then(() => {
      this.state = State.RUNNING
    })
  }
}
