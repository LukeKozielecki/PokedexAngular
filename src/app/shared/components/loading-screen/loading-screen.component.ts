import { Component } from '@angular/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-loading-screen',
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    NgOptimizedImage
  ],
  templateUrl: './loading-screen.html',
  styleUrls: ['./loading-screen.scss']
})
export class LoadingScreenComponent {

}
