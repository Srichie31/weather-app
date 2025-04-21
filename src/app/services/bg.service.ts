import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BgService {
  private numberSource = new BehaviorSubject<number>(0);
  number$ = this.numberSource.asObservable();

  private themeSubject = new BehaviorSubject<'light' | 'dark'>('light');
  theme$ = this.themeSubject.asObservable();

  constructor() {}

  setBackGround(num:number){
    this.numberSource.next(num);
  }

  setTheme(mode: 'light' | 'dark') {
    // console.log(mode);
    
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(`${mode}-theme`);
    this.themeSubject.next(mode);
  }
  getCurrentTheme(): 'light' | 'dark' {
    return this.themeSubject.value;
  }

  getBackGroundColor(index: any): string {    
    switch (index) {
      case 0:
        return '#00000c';
      case 1:
        return ' linear-gradient(to bottom, #020111 85%,#191621 100%)';
      case 2:
        return ' linear-gradient(to bottom, #020111 60%,#20202c 100%)';
      case 3:
        return ' linear-gradient(to bottom, #020111 10%,#3a3a52 100%)'
      case 4:
        return ' linear-gradient(to bottom, #20202c 0%,#515175 100%)'
      case 5:
        return ' linear-gradient(to bottom, #40405c 0%,#6f71aa 80%,#8a76ab 100%)'
      case 6:
        return ' linear-gradient(to bottom, #4a4969 0%,#7072ab 50%,#cd82a0 100%)'
      case 7:
        return ' linear-gradient(to bottom, #757abf 0%,#8583be 60%,#eab0d1 100%)'
      case 8:
        return ' linear-gradient(to bottom, #82addb 0%,#ebb2b1 100%)'
      case 9:
        return ' linear-gradient(to bottom, #94c5f8 1%,#a6e6ff 70%,#b1b5ea 100%)'
      case 10:
        return ' linear-gradient(to bottom, #b7eaff 0%,#94dfff 100%)'
      case 11:
        return ' linear-gradient(to bottom, #9be2fe 0%,#67d1fb 100%)'
      case 12:
        return ' linear-gradient(to bottom, #90dffe 0%,#38a3d1 100%)'
      case 13:
        return ' linear-gradient(to bottom, #57c1eb 0%,#246fa8 100%)'
      case 14:
        return ' linear-gradient(to bottom, #2d91c2 0%,#1e528e 100%)'
      case 15:
        return ' linear-gradient(to bottom, #2473ab 0%,#1e528e 70%,#5b7983 100%)'
      case 16:
        return ' linear-gradient(to bottom, #1e528e 0%,#265889 50%,#9da671 100%)'
      case 17:
        return ' linear-gradient(to bottom, #1e528e 0%,#728a7c 50%,#e9ce5d 100%)'
      case 18:
        return ' linear-gradient(to bottom, #154277 0%,#576e71 30%,#e1c45e 70%,#b26339 100%)'
      case 19:
        return ' linear-gradient(to bottom, #163C52 0%,#4F4F47 30%,#C5752D 60%,#B7490F 80%, #2F1107 100%)'
      case 20:
        return ' linear-gradient(to bottom, #071B26 0%,#071B26 30%,#8A3B12 80%,#240E03 100%)'
      case 21:
        return ' linear-gradient(to bottom, #010A10 30%,#59230B 80%,#2F1107 100%)'
      case 22:
        return ' linear-gradient(to bottom, #090401 50%,#4B1D06 100%)'
      case 23:
        return 'linear-gradient(to bottom, #00000c 80%,#150800 100%)'
      case 24:
          return '#00000c';
      default:
        return ' skyblue';
      }
  }
}
