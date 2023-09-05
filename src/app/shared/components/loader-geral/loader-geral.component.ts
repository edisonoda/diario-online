import { inOutAnimationFast } from 'src/app/core/animations/animations';
import { LoadingService } from './loader-geral.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loader-geral',
  templateUrl: './loader-geral.component.html',
  styleUrls: ['./loader-geral.component.css'],
  animations: [inOutAnimationFast]
})
export class LoaderGeralComponent implements OnInit {

  loading: boolean = false;

  constructor(private loadingService: LoadingService) { }

  ngOnInit(): void {
    this.listenToLoading();
  }

  listenToLoading(): void {
    this.loadingService.loadingSub
      .subscribe((loading) => {
        this.loading = loading;
      });
  }

}
