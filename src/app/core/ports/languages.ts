import { Observable } from "rxjs";
import { Languages } from "../models";

export abstract class LanguagesPort {
  abstract listLanguages(): Observable<Languages>;
}
