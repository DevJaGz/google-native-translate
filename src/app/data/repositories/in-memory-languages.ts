import { Injectable } from "@angular/core";
import { Language, Languages } from "@core/models";
import { LanguagesPort } from "@core/ports";
import { Observable, of } from "rxjs";


const LANGUAGES: Languages = [
  Language.create({ code: 'en', name: 'English' }),
  Language.create({ code: 'es', name: 'Spanish' }),
  Language.create({ code: 'fr', name: 'French' }),
  Language.create({ code: 'de', name: 'German' }),
  Language.create({ code: 'it', name: 'Italian' }),
] as const;


@Injectable({
  providedIn: 'root',
})
export class InMemoryLanguagesRepository implements LanguagesPort {
  listLanguages(): Observable<Languages> {
    return of(LANGUAGES)
  }
}
