import { Observable } from 'rxjs';

export type Usecase<Request, Response> = {
  execute(request?: Request): Observable<Response>;
};
