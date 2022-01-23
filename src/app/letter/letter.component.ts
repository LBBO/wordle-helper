import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
} from '@angular/core'
import { GuessedLetter, GuessingResult } from '../app.component'

@Component({
  selector: 'app-letter',
  templateUrl: './letter.component.html',
  styleUrls: ['./letter.component.scss'],
})
export class LetterComponent {
  @Input()
  letter: GuessedLetter = {
    letter: '',
    result: 'unknown',
  }

  @Output()
  letterChange = new EventEmitter<GuessedLetter>()

  @Output()
  letterTyped = new EventEmitter()

  @Output()
  backspace = new EventEmitter()

  get char() {
    return this.letter?.letter ?? ''
  }

  set char(value: string) {
    this.letterChange.emit({
      ...this.letter,
      letter: value.slice(0, 1),
    })

    this.letterTyped.emit()
  }

  toggle(result: GuessingResult) {
    this.letterChange.emit({
      ...this.letter,
      result: this.letter.result === result ? 'unknown' : result,
    })
  }

  @HostBinding('class')
  get result(): GuessingResult | 'wrong' {
    return this.letter.letter.length > 0 && this.letter.result === 'unknown'
      ? 'wrong'
      : this.letter.result
  }
}
