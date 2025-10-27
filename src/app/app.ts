import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: ` <h1 class="text-3xl font-bold underline">Hello world!</h1>
    <button class="bg-neutral-500">
      <span class="material-symbols-outlined"> mic </span>
    </button>
    <router-outlet></router-outlet>`,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
