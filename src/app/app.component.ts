import { Component, OnInit } from '@angular/core'
import {
  Requirement,
  WordPossibilitiesService,
} from './word-possibilities.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'wordle-helper'
  requiredLetters = ''
  requiredLettersRules: Requirement[] = []

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
}
