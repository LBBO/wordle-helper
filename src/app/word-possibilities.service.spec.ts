import { TestBed } from '@angular/core/testing'

import { WordPossibilitiesService } from './word-possibilities.service'

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
})
