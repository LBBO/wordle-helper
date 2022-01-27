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

  @Input()
  disabled: boolean = false

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
      letter: value.slice(0, 1).toLowerCase(),
    })

    this.letterTyped.emit()
  }

  toggle(result: GuessingResult) {
    if (!this.disabled) {
      this.letterChange.emit({
        ...this.letter,
        result: this.letter.result === result ? 'unknown' : result,
      })
    }
  }

  get result(): GuessingResult | 'wrong' {
    return this.letter.letter.length > 0 && this.letter.result === 'unknown'
      ? 'wrong'
      : this.letter.result
  }

  @HostBinding('class')
  get classes() {
    const result: string[] = []
    result.push(this.result)

    if (this.disabled) {
      result.push('disabled')
    }

    return result.join(' ')
  }
}
