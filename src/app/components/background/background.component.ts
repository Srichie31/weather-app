import { Component,Input, OnInit } from '@angular/core';
import { BgService } from '../../services/bg.service';
import { Subscription } from 'rxjs';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'app-background',
  standalone: false,
  templateUrl: './background.component.html',
  styleUrl: './background.component.scss',
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 1 })),
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms ease-in')
      ]),
      transition(':leave', [
        animate('400ms ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class BackgroundComponent implements OnInit {
  constructor(public service:BgService){
    
  }
  bgColor = 'white'
  numberSubscription !:Subscription
  themeSubscription !:Subscription
  isDarkTheme = false;
  
  ngOnInit(): void {
    this.numberSubscription= this.service.number$.subscribe(num => {
      this.bgColor = this.service.getBackGroundColor(num);
    });
    this.themeSubscription = this.service.theme$.subscribe(theme => {
      this.isDarkTheme = theme === 'dark';
      
    });
  }
  ngOnDestroy() {
    if (this.numberSubscription) {
      this.numberSubscription.unsubscribe();
      this.themeSubscription.unsubscribe()
    }
    
  }

}
