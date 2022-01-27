import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppComponent } from './app.component'
import { LetterComponent } from './letter/letter.component'
import { FormsModule } from '@angular/forms'
import { ContenteditableValueAccessorModule } from '@tinkoff/angular-contenteditable-accessor'
import { WordlistComponent } from './wordlist/wordlist.component'
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component'

@NgModule({
  declarations: [
    AppComponent,
    LetterComponent,
    WordlistComponent,
    LoadingSpinnerComponent,
  ],
  imports: [BrowserModule, FormsModule, ContenteditableValueAccessorModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
