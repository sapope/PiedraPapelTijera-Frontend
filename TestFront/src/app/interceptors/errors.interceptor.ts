import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorsInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
        catchError((error: HttpErrorResponse) => {
          const errorMessage = this.getErrorMessage(error, request.url);
          const detailedError = new Error(errorMessage);
          console.error('Error HTTP:', detailedError);
          return throwError(() => detailedError);
        })
      );
    }
    private getErrorMessage(error: HttpErrorResponse, url: string): string {
        if (error.error instanceof ErrorEvent) {
           
            return `Error de red: ${error.error.message}`;
          } else {
           
            let errorMessage = `Error de servidor (Status ${error.status}): ${error.message}`;
  
           
            if (error.error) {
            
              const responseKeys = Object.keys(error.error);
              if (responseKeys.length > 0) {
                errorMessage += `\nResponse: ${JSON.stringify(error.error)}`;
              }
            }

            return errorMessage;
        }
    }
}