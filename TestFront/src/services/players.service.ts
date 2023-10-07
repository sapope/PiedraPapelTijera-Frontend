import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { PlayersDTO } from 'src/models/players.model';
import { ResultOperation } from 'src/models/resultOperation';

@Injectable({
  providedIn: 'root',
})
export class PlayersService extends BaseService {
    constructor(http: HttpClient) {
      super(http);
    }

    add(player: PlayersDTO) {
        let url = this.getUrl('Players','AddAsync') ;
        return this.http.post<any>(url, player);
      }
}  