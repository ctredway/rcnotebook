import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import {Pinion} from "../../models/pinion";

@Component({
  selector: 'app-rollout',
  templateUrl: './rollout.component.html',
  styleUrls: ['./rollout.component.css']
})
export class RolloutComponent implements OnInit, OnDestroy {
  tool = {};
  headers = [];
  pinions = [];
  roRows = [];
  fdrRows = [];
  urlParams: Subscription = new Subscription();
  pie = 3.14;
  numRange:number = 5;
  defaultHeaderBgColor:string = 'bg-primary';
  selectedBgColor:string = 'bg-danger';
  gutterColor:string = 'bg-dark';
  guideColor:string = 'bg-secondary';
  txtLight:string = 'text-light';
  buffer: number = 5;
  spur:number = 72;
  pinion:number = 45;
  tireDiameter:number = 41;
  fDrive:number = 1;
  startSpur:number = this.spur;
  startPinion:number = this.pinion;
  endSpur:number = this.startSpur+this.buffer;
  endPinion:number = this.pinion+this.buffer;
  rollOut:number = 0;
  fdr:number = 0;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.tool = this.route.snapshot.params['tool'];
    this.urlParams = this.route.params.subscribe(
      (params: Params) => {
        this.tool = this.route.snapshot.params['tool'];
      }
    );

    this.buildRollOut();
  }

  ngOnDestroy(): void {
      this.urlParams.unsubscribe();
  }

  buildRollOut(): void {
    let header;
    let bg;
    this.headers = Array();
    this.pinions = Array();

    for (let h = this.startSpur - this.buffer; h <= this.endSpur; h++) {
      let hv: any = {};
      hv.value = h;
      //console.log(hv);
      this.headers.push(hv);
    }
    //console.log(this.headers);
    const startHere = this.startSpur-this.buffer;

    for (let p = (this.startPinion - this.buffer); p <= this.endPinion; p++) {
      let curPinion: Pinion = new Pinion();
      let count:number = 0;
      curPinion.value = p;

      for (let s = startHere; s <= this.endSpur; s++) {

       // console.log(count);
        if(count == this.buffer && p == this.startPinion){
        //  console.log(count +'/'+ this.buffer);
          curPinion.selectSpur = this.startSpur;
        } else if(count != this.buffer && p != this.startPinion){
          curPinion.selectSpur = 0;
        }

        curPinion.rollOuts.push(this.calculateRollOut(this.tireDiameter, s, p, this.fDrive));
        curPinion.fdrs.push(this.calcFDR(s,p,this.fDrive));
        count++;
      }
     // console.log(curPinion);
      this.pinions.push(curPinion);
    }

  }
  calculateRollOut(tire, spur, pinion, drive): any {
    let rollOut;
    let preRollOut = (tire * this.pie) / ((spur / pinion) * drive)
    rollOut = Math.round(preRollOut * 100) / 100;
    return rollOut;
  }
  //
  calcFDR(spur, pinion, drive){
    let fdr;
    fdr = Math.round(((spur/pinion) * drive) * 1000) / 1000;
    return fdr;
  }

  runRollOut(event): void {
    switch (event.target.id) {
      case 'pinion':
        //console.log('pinion: ', event.target.value);
        this.startPinion = event.target.value;
        this.endPinion = (+event.target.value + this.buffer);
        break;
      case 'spur':
        this.startSpur = event.target.value;
        this.endSpur = (+event.target.value + this.buffer);
        break;
      case 'tireDia':
        this.tireDiameter = +event.target.value;
        break;
      case 'fdrive':
        this.fDrive = event.target.value;
        break;

    }
    this.buildRollOut();
  }
}
