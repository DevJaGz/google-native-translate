import { Injectable } from '@angular/core';
import { Languages, Usecase } from '../models';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class ListLanguagesUsecase implements Usecase<void, Languages> {
  execute(): Observable<Languages> {
    throw new Error('Method not implemented.');
  }
}
