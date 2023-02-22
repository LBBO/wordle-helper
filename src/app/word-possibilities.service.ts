import { Injectable, OnDestroy } from '@angular/core'
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs'
import { distinctUntilChanged, map } from 'rxjs/operators'

export type InexistentRequirement = {
  type: 'inexistent'
  letter: string
}
export type ExistsRequirement = {
  type: 'exists'
  letter: string
  incorrectIndex: number
}
export type ExactRequirement = {
  type: 'exact'
  letter: string
  index: number
}

export type Requirement =
  | InexistentRequirement
  | ExistsRequirement
  | ExactRequirement

@Injectable({
  providedIn: 'root',
})
export class WordPossibilitiesService implements OnDestroy {
  private static alphabet = Array(26)
    .fill(1)
    .map((_, i) => String.fromCharCode(0x61 + i))
  private _possibilities$ = new BehaviorSubject<string[]>([])
  private _requirements$ = new BehaviorSubject<Requirement[][]>([])
  private _filteredPossibilities = combineLatest(
    this._requirements$,
    this._possibilities$,
  ).pipe(
    // tap<[Requirement[], string[]]>(console.log),
    map(([requirements, possibilities]) =>
      possibilities.filter((possibility) =>
        requirements.reduce((fitsRequirements, requirements) => {
          return (
            fitsRequirements &&
            WordPossibilitiesService.checkWordAgainstRequirements(
              requirements,
              possibility,
            )
          )
        }, true as boolean),
      ),
    ),
    distinctUntilChanged((a, b) => a.length === b.length),
    // tap<string[]>(console.log),
  )

  private static checkWordAgainstRequirements(
    requirements: Requirement[],
    possibility: string,
  ): boolean {
    const letters = possibility.split('')
      .map((char, index) => (
        {
          char,
          index,
          used: false,
        }
      ))

    const getUnused = () => letters.filter(({ used }) => !used)

    return requirements
      .sort((a, b) => {
        // TODO: refactor to use array indexes somehow?
        const getPriority = (r: Requirement) => {
          switch (r.type) {
            case 'exact':
              return 1
            case 'exists':
              return 2
            case 'inexistent':
              return 3
          }
        }
        // return > 0 if a > b
        return getPriority(a) - getPriority(b)
      })
      .reduce((matchesPreviousRequirements, requirement, index) => {
        let matchesCurrRequirement: boolean

        switch (requirement.type) {
          case 'exact':
            matchesCurrRequirement = letters[requirement.index].char === requirement.letter
            letters[requirement.index].used = true
            break
          case 'exists':
            const hasOtherCharAtIncorrectIndex = letters[requirement.incorrectIndex].char !== requirement.letter
            const firstRemainingOccurrence = getUnused()
              .find(({ char, index }) => char === requirement.letter && index !== requirement.incorrectIndex)
            matchesCurrRequirement = hasOtherCharAtIncorrectIndex && Boolean(firstRemainingOccurrence)
            if (firstRemainingOccurrence) {
              firstRemainingOccurrence.used = true
            }
            break
          case 'inexistent':
            matchesCurrRequirement = getUnused().find(({ char }) => char === requirement.letter) === undefined
        }

        return matchesCurrRequirement && matchesPreviousRequirements
      }, true as boolean)
  }

  private _subscriptions: Subscription[] = []

  constructor() {
    this._subscriptions.push(
      this._filteredPossibilities.subscribe(this._possibilities$),
    )
  }

  ngOnDestroy() {
    this._subscriptions.forEach((sub) => sub.unsubscribe())
  }

  getPossibleCharsAtIndex(index: number): string[] {
    const exactCharRequirementExists = this._requirements$.getValue().flat()
      .find(requirement => requirement.type === 'exact' && requirement.index === index)

    if (exactCharRequirementExists) {
      return [exactCharRequirementExists.letter]
    }

    const impossibleChars = this._requirements$.getValue().flat()
      .filter(r => r.type === 'inexistent' || (
        r.type === 'exists' && index === r.incorrectIndex
      ))
      .map(r => r.letter)
    return WordPossibilitiesService.alphabet.filter(char => !impossibleChars.includes(char))
  }

  generateAllPossibilities(length: number): string[] {
    const result: string[] = []

    const fillResultWithWords = (
      currentPrefix: string,
      remainingLength: number,
    ) => {
      if (remainingLength >= 1) {
        const newRemainingLength = remainingLength - 1
        WordPossibilitiesService.alphabet.forEach((letter) =>
          fillResultWithWords(currentPrefix + letter, newRemainingLength),
        )
      } else {
        result.push(currentPrefix)
      }
    }

    fillResultWithWords('', length)
    return result
  }

  removeWord(word: string) {
    const currentWords = this._possibilities$.getValue()
    const newWords = currentWords.filter((curr) => curr !== word)
    this.setPossibilities(newWords)
  }

  addSimultaneousRequirements(requirements: Requirement[]) {
    return new Promise<void>((resolve) => {
      const currRequirements = this._requirements$.getValue()
      this.setRequirements([...currRequirements, requirements])
      resolve()
    })
  }

  setRequirements(requirements: Requirement[][]) {
    this._requirements$.next(requirements)
  }

  resetPossibilities(wordLength = 5) {
    return new Promise<void>((resolve) => {
      console.time('generator')
      const words = this.generateAllPossibilities(wordLength)
      this.setPossibilities(words)
      console.timeEnd('generator')
      resolve()
    })
  }

  setPossibilities(newOptions: string[]) {
    this._possibilities$.next(newOptions)
  }

  get possibilities$(): Observable<string[]> {
    return this._filteredPossibilities
  }

  get requirements$() {
    return this._requirements$.asObservable()
  }

  get upperBoundForPossibilities$(): Observable<number> {
    return this.possibilities$.pipe(map(possibilities => possibilities.length))
  }
}
