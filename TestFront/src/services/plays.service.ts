import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { PlaysDTO } from 'src/models/plays.model';
import { ResultOperation } from 'src/models/resultOperation';
import { GamePlayRequestDTO } from 'src/models/game-play.model';

@Injectable({
  providedIn: 'root',
})
export class PlaysService extends BaseService {
    constructor(http: HttpClient) {
      super(http);
    }

    add(play: PlaysDTO) {
        let url = this.getUrl('Plays','AddAsync') ;
        return this.http.post<any>(url, play);
      }

      gamePlay(gamePlay: GamePlayRequestDTO) {
        let url = this.getUrl('Plays','GamePlay') ;
        return this.http.put<any>(url, gamePlay);
      }
}  