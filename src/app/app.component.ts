import { Component, OnInit } from '@angular/core';
import { LoadingService } from './shared/components/loader-geral/loader-geral.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  loading: boolean = false;

  constructor(private loadingService: LoadingService) { }

  ngOnInit(): void {
    this.loadingService.loadingSub
      .subscribe((loading) => {
        this.loading = loading;
      });
  }
}
