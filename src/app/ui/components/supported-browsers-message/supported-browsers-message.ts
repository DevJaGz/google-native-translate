import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { BrowserInfo } from '@core/models';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-supported-browsers-message',
  imports: [Icon],
  template: `
    <div class="flex flex-col  p-4 rounded-lg bg-google-gray-blue">
      <div class="flex flex-col justify-center items-center mb-2 gap-2">
        <app-icon [size]="56">error</app-icon>
        <h2 class="text-xl font-bold">Browser not supported</h2>
      </div>
      <p>
        Oops! It looks like your browser doesn't support local AI models. To use
        this app, please switch to one of the supported browsers below:
      </p>
      <br />
      <ul class="list-disc ps-8">
        @for (
          supportedBrowser of supportedBrowsers();
          track supportedBrowser.name
        ) {
          <li>
            <strong>{{ supportedBrowser.name }}</strong> version
            <strong>{{ supportedBrowser.majorVersion }}</strong> or higher.
          </li>
        }
      </ul>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SupportedBrowsersMessage {
  readonly supportedBrowsers = input<BrowserInfo[]>([]);
}
