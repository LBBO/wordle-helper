import { Component, Host, HostBinding, Input } from '@angular/core'
import { GuessedLetter } from '../app.component'

@Component({
  selector: 'app-letter',
  templateUrl: './letter.component.html',
  styleUrls: ['./letter.component.scss'],
})
export class LetterComponent {
  private _letter?: GuessedLetter

  @HostBinding('contenteditable')
  contentEditable = true

  @HostBinding('class')
  result: GuessedLetter['result'] = 'unknown'

  @Input()
  set letter(value: GuessedLetter | undefined) {
    this._letter = value
    this.result = value?.result ?? 'unknown'
  }

  constructor() {}

  get letter(): GuessedLetter | undefined {
    return this._letter
  }
}
