import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders,HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  protected apiUrl = environment.apiUrl;
  constructor(protected http: HttpClient) { }

  protected getUrl(controller: string,action:string): string {
    return `${this.apiUrl}/${controller}/${action}`;
  }

  protected GenerateHeaders(headerObj?:{ [key: string]: string }):HttpHeaders {
    let headers= new HttpHeaders(); 
    if (headerObj) {
      for (const key in headerObj) {
        if (headerObj.hasOwnProperty(key)) {
          headers = headers.set(key, headerObj[key]);
        }
      }
    }
    return headers
  }

  protected DeleteHeader(httpHeaders : HttpHeaders,key:string):HttpHeaders {
    
    return httpHeaders.delete(key);
  }

  prepareParamsOptions(queryParams?: { [key: string]: string }): any {
    let params = new HttpParams();
    if (queryParams) {
      for (const key in queryParams) {
        if (queryParams.hasOwnProperty(key)) {
          params = params.set(key, queryParams[key]);
        }
      }
    }
    else {
      params= params.set( 'Content-Type', 'application/json' );
    }

    return {
      params: params,
      headers: this.GenerateHeaders()
    };
  }

  prepareBodyOptions(): any {
    return {
      headers: this.GenerateHeaders()
    };
  }

  
}