import { inject, Injectable } from '@angular/core';
import { Languages, Usecase } from '../models';
import { Observable } from 'rxjs';
import { LanguagesPort } from '@core/ports';


@Injectable({
  providedIn: 'root',
})
export class ListLanguagesUsecase implements Usecase<void, Languages> {
  readonly #languagesRepository = inject(LanguagesPort);

  execute(): Observable<Languages> {
    return this.#languagesRepository.listLanguages();
  }
}
