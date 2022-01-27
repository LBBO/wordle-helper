import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'
import { waitUntil } from '../../util/waitUntil'
import { wait } from '../../util/wait'

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss'],
})
export class LoadingSpinnerComponent implements OnInit {
  @ViewChild('rootElement')
  rootChild?: ElementRef<HTMLDivElement>

  @Output()
  mounted: EventEmitter<void> = new EventEmitter<void>()

  @Input()
  size: 'normal' | 'small' = 'normal'

  constructor() {}

  ngOnInit() {
    waitUntil(() => Boolean(this.rootChild?.nativeElement))
      .then(wait)
      .then(() => {
        this.mounted.emit()
      })
  }
}
