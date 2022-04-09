import { TestBed } from '@angular/core/testing'

import {
  ExactRequirement,
  ExistsRequirement,
  InexistentRequirement,
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
        incorrectIndex: 2,
      }
      noERequirement = {
        type: 'inexistent',
        letter: 'e',
      }
      done()
    })

    it('should update the requirements observable', (done) => {
      // given
      const newRequirements: Requirement[][] = [
        [
          {
            type: 'inexistent',
            letter: 'a',
          },
        ],
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
      const newRequirements = [[correctCRequirement, aExistsRequirement, noERequirement]]

      // then
      let isFirst = true
      service.possibilities$
        .subscribe((possibilities) => {
          if (!isFirst) {
            possibilities.forEach((possibility) => {
              expect(possibility).not.toContain(noERequirement.letter)
              expect(possibility[correctCRequirement.index]).toBe(correctCRequirement.letter)
              expect(possibility).toContain(aExistsRequirement.letter)
              expect(possibility[aExistsRequirement.incorrectIndex]).not.toBe(aExistsRequirement.letter)
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

  describe('filtered possibilities', () => {
    const possibilities = 'tools, frown, clown, class'.split(', ')

    beforeEach(() => {
      service.setPossibilities(possibilities)
    })

    it('should handle two occurrences of the same letter when both are exact', (done) => {
      // given
      // word: tools
      const requirements: Requirement[][] = [
        [
          {
            type: 'exact',
            letter: 'o',
            index: 1,
          },
          {
            type: 'exact',
            letter: 'o',
            index: 2,
          },
        ],
      ]
      // when
      service.setRequirements(requirements)

      // then
      service.possibilities$.subscribe((
        possibilities => {
          expect(possibilities).toHaveSize(1)
          expect(possibilities).toContain('tools')
          done()
        }
      ))
    })

    it('should handle two occurrences of the same letter when one is exact and one is existent', (done) => {
      // given
      // word: tools
      const requirements: Requirement[][] = [
        [
          {
            type: 'exact',
            letter: 'o',
            index: 2,
          },
          {
            type: 'exists',
            letter: 'o',
            incorrectIndex: 0,
          },
        ],
      ]
      // when
      service.setRequirements(requirements)

      // then
      service.possibilities$.subscribe((
        possibilities => {
          expect(possibilities).toHaveSize(1)
          expect(possibilities).toContain('tools')
          done()
        }
      ))
    })

    it('should handle two occurrences of the same letter when both are existent', (done) => {
      // given
      // word: tools
      const requirements: Requirement[][] = [
        [
          {
            type: 'exists',
            letter: 'o',
            incorrectIndex: 0,
          },
          {
            type: 'exists',
            letter: 'o',
            incorrectIndex: 3,
          },
        ],
      ]

      // when
      service.setRequirements(requirements)

      // then
      service.possibilities$.subscribe((
        possibilities => {
          expect(possibilities).toHaveSize(1)
          expect(possibilities).toContain('tools')
          done()
        }
      ))
    })
  })

  describe('upperBoundForPossibilities$', () => {
    const possibilities = 'tools, frown, clown, class'.split(', ')

    beforeEach(() => {
      service.setPossibilities(possibilities)
    })

    it('should contain the correct initial value', (done) => {
      service.upperBoundForPossibilities$.subscribe(value => {
        expect(value).toBe(possibilities.length)
        done()
      })
    })

    it('should contain the correct value after filtering', (done) => {
      service.addSimultaneousRequirements([
        {
          type: 'exact',
          letter: 't',
          index: 0,
        },
        {
          type: 'exact',
          letter: 'o',
          index: 1,
        },
        {
          type: 'exact',
          letter: 'o',
          index: 2,
        },
        {
          type: 'exact',
          letter: 'l',
          index: 3,
        },
        {
          type: 'exact',
          letter: 's',
          index: 4,
        },
      ])

      service.upperBoundForPossibilities$.subscribe(value => {
        expect(value).toBe(1)
        done()
      })
    })
  })
})
