import { Observable } from 'rxjs';

export type Usecase<TRequest, TResponse> = {
  execute(request?: TRequest): Observable<TResponse>;
};
