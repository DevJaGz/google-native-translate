import { Injectable } from "@angular/core";
import { Translation, Usecase } from "@core/models";
import { Observable } from "rxjs";

export type TranslateTextRequest = {
  sourceLanguageCode: string;
  targetLanguageCode: string;
  text: string;
}

@Injectable({
  providedIn: 'root',
})
export class TranslateTextUsecase implements Usecase<TranslateTextRequest, Translation> {
  execute(request: TranslateTextRequest): Observable<Translation> {
    throw new Error("Method not implemented.");
  }
}
