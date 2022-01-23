import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import {
  Requirement,
  WordPossibilitiesService,
} from './word-possibilities.service'

export type GuessingResult = 'unknown' | 'exists' | 'exact'

export type GuessedLetter = {
  letter: string
  result: GuessingResult
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  private static readonly numberOfGuesses = 6
  private static readonly wordLength = 5

  @ViewChild('wordsContainer')
  wordsContainer?: ElementRef<HTMLDivElement>

  title = 'wordle-helper'
  requiredLetters = ''
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

  constructor(public wordPossibilitiesService: WordPossibilitiesService) {}

  ngOnInit() {
    this.wordPossibilitiesService.resetPossibilities(2)
  }

  updateRequiredLetters() {
    this.wordPossibilitiesService.setRequirements(
      this.requiredLetters.split('').map((letter) => ({
        type: 'exists',
        letter,
      })),
    )
  }

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

  checkLetter(row: number, col: number) {
    const letter = this.guesses[row][col]
    let newLetter = letter.letter ?? ''
    if ((letter.letter?.length ?? 0) > 1) {
      newLetter = letter.letter?.slice(0, 1) ?? ''
    }
    this.guesses[row][col] = {
      ...letter,
      letter: newLetter,
    }

    this.focusRelative(row, col, 1)
  }
}
