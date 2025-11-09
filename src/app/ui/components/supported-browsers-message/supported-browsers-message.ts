import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BrowserInfo } from '@core/models';

@Component({
  selector: 'app-supported-browsers-message',
  imports: [],
  template: `
    <div class="flex flex-col  p-4 rounded-lg bg-google-gray-blue">
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
