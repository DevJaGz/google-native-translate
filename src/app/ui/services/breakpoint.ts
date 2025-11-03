import { inject, Injectable, signal } from "@angular/core";
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

export type ViewportType = 'web' | 'tablet' | 'handset'

@Injectable({
    providedIn: 'root'
})
export class BreakpointService {
    readonly #breakpointObserver = inject(BreakpointObserver);
    protected readonly _isHandset = signal<boolean>(false);
    protected readonly _isTablet = signal<boolean>(false);
    protected readonly _isWeb = signal<boolean>(true);
    protected readonly _viewportType = signal<ViewportType>('web');

    readonly isHandset = this._isHandset.asReadonly();
    readonly isTablet = this._isTablet.asReadonly();
    readonly isWeb = this._isWeb.asReadonly();
    readonly viewportType = this._viewportType.asReadonly();
  
    constructor() {
      this.#breakpointObserver
        .observe([Breakpoints.Handset, Breakpoints.Tablet, Breakpoints.Web])
        .subscribe((result) => {
          if (result.matches) {
            this._isHandset.set(result.breakpoints[Breakpoints.HandsetLandscape] || result.breakpoints[Breakpoints.HandsetPortrait]);
            this._isTablet.set(result.breakpoints[Breakpoints.TabletLandscape] || result.breakpoints[Breakpoints.TabletPortrait]);
            this._isWeb.set(result.breakpoints[Breakpoints.WebLandscape] || result.breakpoints[Breakpoints.WebPortrait]);
          
            if (this.isHandset()){
                this._viewportType.set('handset');
            }else if (this.isTablet()){
                this._viewportType.set('tablet');
            }else{
                this._viewportType.set('web');
            }
          }
        });
      }
}