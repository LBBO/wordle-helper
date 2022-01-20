import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppComponent } from './app.component'
import { LetterComponent } from './letter/letter.component'
import { FormsModule } from '@angular/forms'

@NgModule({
  declarations: [AppComponent, LetterComponent],
  imports: [BrowserModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
