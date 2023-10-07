import { Component } from '@angular/core';
import { DuelsDTO } from 'src/models/duels.model';
import { PlayersDTO } from 'src/models/players.model';
import { PlaysDTO } from 'src/models/plays.model';
import { PlayersService } from 'src/services/players.service';
import { DuelsService } from 'src/services/duels.service';
import { PlaysService } from 'src/services/plays.service';
import * as bootstrap from 'bootstrap'
import { GamePlayRequestDTO } from 'src/models/game-play.model';
import { catchError, finalize, throwError } from 'rxjs';

// declare var bootstrap: any; 
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'TestFront';
  isLoading: boolean = false;
  private gameOptions:string[] =["Piedra",'Papel','Tijera'];
  gameModel = {
  enablePlay : 0,
  playing:false,
  player1: {id: 0, name: 'Jugador 1' },
  player2: { id: -1 , name: 'Jugador 2'},
  duel:{id:0,idPlayer1:0,idPlayer2:-1,scorePlayer1:0,scorePlayer2:0},
  player1LastPlay: {id:0,idDuel:0,idPlayer:0,step:0,optionValue:0},
  player2LastPlay: {id:0,idDuel:0,idPlayer:-1,step:0,optionValue:0},
  }
  optRockElement:any;
  optPaperElement:any;
  optScissorElement:any;
  modalPlayerName:any;
  modalMessage:any;
  modalGameOptions:any;
  modalInputNameValue:string='';
  modalNameValidation:string='';
  modalTextInfo:string = 'Nombre del jugador 1'
  fieldTextMessage: string = '';

  constructor(private playersService: PlayersService
    , private duelsService: DuelsService
    ,  private playsService: PlaysService){}


  ngAfterContentInit()
  {
    
    this.modalPlayerName = new bootstrap.Modal(this.getHTMLInput('modalPlayerName'));
    this.modalMessage = new bootstrap.Modal(this.getHTMLInput('modalMessage'));
    this.modalGameOptions = new bootstrap.Modal(this.getHTMLInput('modalGameOptions'));
    this.optRockElement=this.getHTMLElement('optRock');
    this.optPaperElement=this.getHTMLElement('optPaper');
    this.optScissorElement=this.getHTMLElement('optScissor');
    
  }
  showLoading(){
    this.isLoading = true;
  }
  hideLoading(){
    this.isLoading = false;
  }
  getHTMLInput(elementId:string):HTMLInputElement{
    return <HTMLInputElement>document.getElementById(elementId);
  }
  getHTMLElement(elementId:string):HTMLElement{
    return <HTMLElement>document.getElementById(elementId);
  }
  toggleHTMLElementClass(element:HTMLElement,cssClass:string){
      element.classList.toggle(cssClass);
  }
  visibleModalPlayerName(visible:boolean) {
    if (visible) {
      this.modalPlayerName.show();
    }
    else
    {
      this.modalPlayerName.hide();
    }
  }
  showModalMessage(text:string) {
    if (text.trim() !== '') {
      this.fieldTextMessage = text;
      this.modalMessage.show();
    }
  }
  hideModalMessage(){
    this.modalMessage.hide();
  }
  showModalGameOptions(){
    if(this.gameModel.enablePlay===1 && this.gameModel.enablePlay)
    {
      if(this.optRockElement.classList.contains("img-mirror"))
      {
        this.toggleDirectionGameOptions();
      }
    }
    else if(this.gameModel.enablePlay===2 && this.gameModel.enablePlay)
    {
      if(!this.optRockElement.classList.contains("img-mirror"))
      {
        this.toggleDirectionGameOptions();
      }
    }
    this.modalGameOptions.show();
  }
  toggleDirectionGameOptions(){
    this.optRockElement.classList.toggle('img-mirror');
    this.optPaperElement.classList.toggle('img-mirror');
    this.optScissorElement.classList.toggle('img-mirror');
  }
  hideModalGameOptions(){
    this.modalGameOptions.hide();
  }
  getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min) + min);
  }
  startGame() {
    this.visibleModalPlayerName(true);
    this.gameModel.enablePlay=1;
  }
  clearModalNameInput(){
    this.modalInputNameValue = '';
  }
  resetGame(){
    Object.assign(this.gameModel, {
      enablePlay: 1,
      playing:true,
      duel: { id: 0, idPlayer1: 0, idPlayer2: -1, scorePlayer1: 0, scorePlayer2: 0 },
      player1LastPlay: { id: 0, idDuel: 0, idPlayer: 0, step: 0, optionValue: 0 },
      player2LastPlay: { id: 0, idDuel: 0, idPlayer: -1, step: 0, optionValue: 0 },
    });
    this.clearModalNameInput();
    this.toggleModalNameTextInfo('Nombre del Jugador 1')
    this.fieldTextMessage ='';
    this.newDuel();
  }
  clearGame() {
    Object.assign(this.gameModel, {
      enablePlay: 0,
      playing: false,
      player1: { id: 0, name: 'Jugador 1' },
      player2: { id: -1, name: 'Jugador 2' },
      duel: { id: 0, idPlayer1: 0, idPlayer2: -1, scorePlayer1: 0, scorePlayer2: 0 },
      player1LastPlay: { id: 0, idDuel: 0, idPlayer: 0, step: 0, optionValue: 0 },
      player2LastPlay: { id: 0, idDuel: 0, idPlayer: -1, step: 0, optionValue: 0 },
    });
    this.clearModalNameInput();
    this.toggleModalNameTextInfo('Nombre del Jugador 1')
    this.fieldTextMessage ='';
  }
  toggleModalNameTextInfo(text:string='')
  {
    if(text === ''){
      if(!this.modalTextInfo.includes('jugador 1'))
      {
        this.modalTextInfo = 'Nombre del jugador 1';
      }
      else
      {
        this.modalTextInfo = 'Nombre del jugador 2';
      }
    }
    else
    {
      this.modalTextInfo = text;
    }
    
  }
  setNextMove()
  {
    if(this.gameModel.enablePlay === 2)
    {
      this.gameModel.enablePlay--;
    }
    else{
      this.gameModel.enablePlay++
    }
  }
  addPlayer(){
    if(this.validatePlayerName())
    {
      var newPlayer : PlayersDTO =  {id:0,name:this.modalInputNameValue.trim()};
    this.showLoading();
    if(this.gameModel.enablePlay===1){
      
      this.playersService.add(newPlayer).pipe(
        finalize(() => {
          this.hideLoading(); 
        })

      ).subscribe((response:any)=>{
     
        if(response && response.stateOperation)
        {
          this.gameModel.player1.id = response.result;
          this.gameModel.player1.name=this.modalInputNameValue.trim();
          this.gameModel.duel.idPlayer1 = response.result ;
   
         this.clearModalNameInput();
         this.toggleModalNameTextInfo();
         
        }
      });
    
    }
    else if(this.gameModel.enablePlay === 2)
    {
      this.playersService.add(newPlayer).pipe(
        finalize(() => {
          this.hideLoading(); 
        })
      ).subscribe((response:any)=>{
     
        if(response && response.stateOperation)
        {
          this.gameModel.player2.id = response.result;
          this.gameModel.player2.name=this.modalInputNameValue.trim();
          this.gameModel.duel.idPlayer2 = this.gameModel.player2.id  ;
          this.clearModalNameInput();
          this.visibleModalPlayerName(false);
          this.toggleModalNameTextInfo();
          this.newDuel();
        }
      });
    
    
    }
    this.setNextMove();
    }
  }
  newDuel()
  {
    var newDuel : DuelsDTO = {id:0,
      scorePlayer1 :0,
      scorePlayer2:0,
    idPlayer1: this.gameModel.player1.id,
    idPlayer2: this.gameModel.player2.id
    };
    this.showLoading();
    this.duelsService.add(newDuel).pipe(
      finalize(() => {
        this.hideLoading(); 
      })

    ).subscribe((response:any)=>{
      if(response && response.stateOperation)
      {
        this.gameModel.duel.id  = response.result;
        this.gameModel.playing=true;
        this.gameModel.player1LastPlay.idDuel = this.gameModel.duel.id ;
        this.gameModel.player1LastPlay.idPlayer = this.gameModel.player1.id;
        this.gameModel.player1LastPlay.step = 1;
        this.gameModel.player2LastPlay.idDuel = this.gameModel.duel.id ;
        this.gameModel.player2LastPlay.idPlayer = this.gameModel.player2.id;
        this.gameModel.player1LastPlay.step = 0; 
      
      }
    });
    
  }
  PlayMove(selectedValue:number)
  {
    

    if(this.gameModel.enablePlay===1)
    {
      var newPlay : PlaysDTO= { id:0,idDuel:this.gameModel.duel.id,idPlayer:this.gameModel.player1.id,step:this.gameModel.player1LastPlay.step,optionValue:selectedValue}
      this.showLoading();
       this.playsService.add(newPlay).pipe(
        finalize(() => {
          this.hideLoading(); 
        })

      ).subscribe((response:any)=>{
        if(response && response.stateOperation)
        {
          this.gameModel.player1LastPlay.id = response.result;
          this.gameModel.player1LastPlay.optionValue = selectedValue;
          this.toggleDirectionGameOptions();
          this.gameModel.player1LastPlay.step++
          this.setNextMove();
        }
        else
        {
          console.error(response);
        }
      });
      
      
    }
    else if(this.gameModel.enablePlay===2)
    {
      var newPlay : PlaysDTO= { id:0,idDuel:this.gameModel.duel.id,idPlayer:this.gameModel.player2.id,step:this.gameModel.player2LastPlay.step,optionValue:selectedValue}

      this.playsService.add(newPlay).subscribe((response:any)=>{
        if(response && response.stateOperation)
        {
          this.gameModel.player2LastPlay.id = response.result;
          this.gameModel.player2LastPlay.optionValue = selectedValue;
          this.toggleDirectionGameOptions();
          this.gameModel.player2LastPlay.step++;
          this.calculateScore();
        }
      });
      
    }
    
  }
   calculateScore()
    {
      var newGamePlay : GamePlayRequestDTO={idDuel:this.gameModel.duel.id,optionValuePlayer1:this.gameModel.player1LastPlay.optionValue,optionValuePlayer2:this.gameModel.  player2LastPlay.optionValue};
      var winner:number=0;
      this.showLoading();
      this.playsService.gamePlay(newGamePlay).pipe(
        finalize(() => {
          this.hideLoading(); 
        })

      ).subscribe((response:any)=>{
      if(response && response.stateOperation)
      {
        winner = response.result;
        let message ='';
      if (winner === 0) {
        message ='Empate';
      } else if(winner===1){

        if(this.gameModel.duel.scorePlayer1<2)
        {
          message+=`Punto para ${this.gameModel.player1.name} : ${this.gameOptions[this.gameModel.player1LastPlay.optionValue]} > ${this.gameOptions[this.gameModel.player2LastPlay.optionValue]}`;
        }
        else{
         message+= `El ganador es ${this.gameModel.player1.name}`;
         this.gameModel.playing=false;
         this.gameModel.enablePlay = 3;
         this.hideModalGameOptions();
        }
        this.gameModel.duel.scorePlayer1++;
      }
       else if (winner === 2) {
          if(this.gameModel.duel.scorePlayer2<2)
          {
            message+=`Punto para ${this.gameModel.player2.name} : ${this.gameOptions[this.gameModel.player2LastPlay.optionValue]} > ${this.gameOptions[this.gameModel.player1LastPlay.  optionValue]}`;
          }
          else{
            message+= `El ganador es ${this.gameModel.player2.name}`;
           this.gameModel.playing=false;
           this.gameModel.enablePlay = 3;
           this.hideModalGameOptions();
          }
          this.gameModel.duel.scorePlayer2++;
        }
        this.hideLoading();
       this.showModalMessage(message);

       if (this.gameModel.playing) {
        this.setNextMove();
       }
      }
      
       
    });
    
  }
 validatePlayerName()
 {
  const regex = /^[a-zA-Z0-9 ]+$/;
  this.modalNameValidation = this.modalInputNameValue.trim() ==='' ? 'Nombre requerido':this.modalInputNameValue.trim().length<3?'La longitud del nombre debe ser al menos 3 caracteres':this.modalInputNameValue.trim().length>100?'La longitud del nombre no debe ser mayor a 100 caracteres':!regex.test(this.modalInputNameValue.trim())?'El nombre solo debe contener letras, números o espacios entre las palabras':'';
  if (this.modalNameValidation === '') {
   return true;
  }
  else
  {
    return false;
  }
 }
 
}
