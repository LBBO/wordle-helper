import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { map, withLatestFrom } from 'rxjs/operators'

export type InexistentRequirement = {
  type: 'inexistent'
  letter: string
}
export type ExistsRequirement = {
  type: 'exists'
  letter: string
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
export class WordPossibilitiesService {
  private static alphabet = Array(26)
    .fill(1)
    .map((_, i) => String.fromCharCode(0x61 + i))
  private _possibilities$ = new BehaviorSubject<string[]>([])
  private _requirements$ = new BehaviorSubject<Requirement[]>([])
  private _filteredPossibilities = this._requirements$.pipe(
    withLatestFrom(this._possibilities$),
    // tap<[Requirement[], string[]]>(console.log),
    map(([requirements, possibilities]) =>
      possibilities.filter((possibility) =>
        requirements.reduce((fitsRequirements, requirement) => {
          switch (requirement.type) {
            case 'inexistent':
              return !possibility.includes(requirement.letter)
            case 'exists':
              return possibility.includes(requirement.letter)
            case 'exact':
              return possibility[requirement.index] === requirement.letter
          }
        }, true as boolean),
      ),
    ),
    // tap<string[]>(console.log),
  )

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
  }

  resetPossibilities(wordLength = 5) {
    this.setPossibilities(this.generateAllPossibilities(wordLength))
  }

  setPossibilities(newOptions: string[]) {
    this._possibilities$.next(newOptions)
  }

  get possibilities$(): Observable<string[]> {
    return this._filteredPossibilities
  }
}
