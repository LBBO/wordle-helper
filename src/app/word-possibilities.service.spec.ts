import { TestBed } from '@angular/core/testing'

import {
  ExactRequirement,
  ExistsRequirement, InexistentRequirement,
  Requirement,
  WordPossibilitiesService,
} from './word-possibilities.service'

describe('WordPossibilitiesService', () => {
  let service: WordPossibilitiesService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(WordPossibilitiesService)
  })

  describe('generateAllPossibilities', () => {
    it('should generate the alphabet when called with length 1', () => {
      expect(service.generateAllPossibilities(1)).toEqual([
        'a',
        'b',
        'c',
        'd',
        'e',
        'f',
        'g',
        'h',
        'i',
        'j',
        'k',
        'l',
        'm',
        'n',
        'o',
        'p',
        'q',
        'r',
        's',
        't',
        'u',
        'v',
        'w',
        'x',
        'y',
        'z',
      ])
    })

    it('should generate the correct amount of results', () => {
      expect(service.generateAllPossibilities(2)).toHaveSize(26 ** 2)
    })
  })

  describe('setRequirements', () => {
    const word = 'car'
    let correctCRequirement: ExactRequirement
    let aExistsRequirement: ExistsRequirement
    let noERequirement: InexistentRequirement

    beforeEach((done) => {
      service.resetPossibilities(3)
      correctCRequirement = {
        type: 'exact',
        letter: 'c',
        index: 0,
      }
      aExistsRequirement = {
        type: 'exists',
        letter: 'a',
        incorrectIndex: 3,
      }
      noERequirement = {
        type: 'inexistent',
        letter: 'e',
      }
      done()
    })

    it('should update the requirements observable', (done) => {
      // given
      const newRequirements: Requirement[] = [
        {
          type: 'inexistent',
          letter: 'a',
        },
      ]

      // then
      let isFirstValue = false
      service.requirements$.subscribe((nextValue) => {
        if (!isFirstValue) {
          expect(nextValue).not.toBe(newRequirements)
          isFirstValue = true
        } else {
          expect(nextValue).toBe(newRequirements)
          done()
        }
      })

      // when
      service.setRequirements(newRequirements)
    })

    it('should update the filtered possibilities', (done) => {
      // given
      const newRequirements = [correctCRequirement, aExistsRequirement, noERequirement]

      // then
      let isFirst = true
      service.possibilities$.subscribe((possibilities) => {
        if (!isFirst) {
          possibilities.forEach(word => {
            expect(word).not.toContain(noERequirement.letter)
            expect(word[correctCRequirement.index]).toBe(correctCRequirement.letter)
            expect(word).toContain(aExistsRequirement.letter)
            expect(word[aExistsRequirement.incorrectIndex]).not.toBe(aExistsRequirement.letter)
          })
          expect(possibilities.includes(word)).toBeTrue()
          done()
        } else {
          isFirst = false
        }
      })

      // when
      service.setRequirements(newRequirements)
    })
  })
})
