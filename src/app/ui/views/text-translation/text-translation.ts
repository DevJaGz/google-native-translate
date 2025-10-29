import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-text-translation',
  imports: [],
  template: `
    <p>
      text-translation works!
    </p>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextTranslation {

}
