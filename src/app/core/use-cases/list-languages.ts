import { inject, Injectable } from '@angular/core';
import { Language, Usecase } from '../models';
import { Observable } from 'rxjs';
import { LanguagesPort } from '@core/ports';


@Injectable({
  providedIn: 'root',
})
export class ListLanguagesUsecase implements Usecase<void, Language[]> {
  readonly #languagesRepository = inject(LanguagesPort);

  execute(): Observable<Language[]> {
    return this.#languagesRepository.listLanguages();
  }
}
