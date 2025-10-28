import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-logo',
  imports: [MatTooltipModule, RouterLink],
  template: `
    <a
      routerLink="/"
      matTooltip="Google Native Translate"
      class="flex flex-wrap items-center gap-2 h-12 text-[22px] cursor-pointer"
    >
      <div class="c-google-word space-x-px font-semibold">
        <span>G</span>
        <span>o</span>
        <span>o</span>
        <span>g</span>
        <span>l</span>
        <span>e</span>
      </div>
      <span class="line-clamp-1"
        ><strong class="font-normal text-secondary tracking-[1px]">Native</strong> Translate</span
      >
    </a>
  `,
  styles: `
   .c-google-word{
      span:is(:nth-child(1), :nth-child(4)) {
        color: var(--google-blue);
      }

      span:is(:nth-child(2), :nth-child(6)) {
        color: var(--google-red);
      }

      span:nth-child(3) {
        color: var(--google-yellow);
      }

      span:nth-child(5) {
        color: var(--google-green);
      }
   }
  `,
  host: {
    'style.display': 'contents',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Logo {}
