import { Component, ElementRef, ViewChild } from '@angular/core'
import { WordPossibilitiesService } from '../word-possibilities.service'

@Component({
  selector: 'app-wordlist',
  templateUrl: './wordlist.component.html',
  styleUrls: ['./wordlist.component.scss'],
})
export class WordlistComponent {
  @ViewChild('listContainer')
  listContainer?: ElementRef<HTMLUListElement>

  constructor(public wordPossibilityService: WordPossibilitiesService) {}

  focus(target: EventTarget | null) {
    ;(target as HTMLElement | null)?.focus()
  }

  removeWord(word: string, index: number) {
    console.log(index, this.listContainer?.nativeElement)
    this.wordPossibilityService.removeWord(word)
    requestAnimationFrame(() => {
      const newWord: HTMLElement | undefined | null =
        this.listContainer?.nativeElement?.querySelector(
          `li:nth-of-type(${index + 1})`, // index must be 1-based here
        )
      newWord?.focus()
      console.log(newWord, newWord?.innerText, this.listContainer)
    })
  }
}
