import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppComponent } from './app.component'
import { LetterComponent } from './letter/letter.component'
import { FormsModule } from '@angular/forms'
import { ContenteditableValueAccessorModule } from '@tinkoff/angular-contenteditable-accessor'

@NgModule({
  declarations: [AppComponent, LetterComponent],
  imports: [BrowserModule, FormsModule, ContenteditableValueAccessorModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
