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
  private _requirements$ = new BehaviorSubject<Requirement[]>([])
  private _filteredPossibilities = combineLatest(
    this._requirements$,
    this._possibilities$,
  ).pipe(
    // tap<[Requirement[], string[]]>(console.log),
    map(([requirements, possibilities]) =>
      possibilities.filter((possibility) =>
        requirements.reduce((fitsRequirements, requirement) => {
          return (
            fitsRequirements &&
            WordPossibilitiesService.checkWordAgainstRequirement(
              requirement,
              possibility,
            )
          )
        }, true as boolean),
      ),
    ),
    distinctUntilChanged((a, b) => a.length === b.length),
    // tap<string[]>(console.log),
  )

  private static checkWordAgainstRequirement(
    requirement: InexistentRequirement | ExistsRequirement | ExactRequirement,
    possibility: string,
  ) {
    switch (requirement.type) {
      case 'inexistent':
        // TODO implement some actual logic
        // return !possibility.includes(requirement.letter)
        return true
      case 'exists':
        return (
          possibility.includes(requirement.letter) &&
          possibility[requirement.incorrectIndex] !== requirement.letter
        )
      case 'exact':
        return possibility[requirement.index] === requirement.letter
    }
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

  addRequirement(requirement: Requirement) {
    const currRequirements = this._requirements$.getValue()
    this.setRequirements([...currRequirements, requirement])
  }

  setRequirements(requirements: Requirement[]) {
    this._requirements$.next(requirements)
    console.log(requirements)
  }

  resetPossibilities(wordLength = 5) {
    console.time('generator')
    const words = this.generateAllPossibilities(wordLength)
    this.setPossibilities(words)
    console.timeEnd('generator')
    console.log(words)
  }

  setPossibilities(newOptions: string[]) {
    this._possibilities$.next(newOptions)
  }

  get possibilities$(): Observable<string[]> {
    return this._filteredPossibilities
  }
}
