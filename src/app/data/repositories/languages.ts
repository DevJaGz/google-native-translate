import { Injectable } from "@angular/core";
import { Languages } from "@core/models";
import { LanguagesPort } from "@core/ports";
import { Observable } from "rxjs";


@Injectable({
  providedIn: 'root',
})
export class ListLanguagesRepository implements LanguagesPort {
  listLanguages(): Observable<Languages> {
    throw new Error('Method not implemented.');
  }
}
