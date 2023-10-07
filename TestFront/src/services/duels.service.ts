import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DuelsDTO } from "src/models/duels.model";
import { BaseService } from "./base.service";
import { ResultOperation } from "src/models/resultOperation";

@Injectable({
    providedIn: 'root'
  })
  export class DuelsService extends BaseService  {
    constructor(http: HttpClient) { 
      super(http);
    }

      add(duel: DuelsDTO) {
          let url = this.getUrl('Duels','AddAsync') ;
          return this.http.post<any>(url, duel);
        }
   
  }