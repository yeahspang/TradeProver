import { ApiService } from 'src/app/services/api.service';
import { Component, OnInit } from '@angular/core';
import { Trade } from 'src/app/models/trade';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.less']
})
export class VerifyComponent implements OnInit {

  code: string;
  invalid: boolean;
  decodedTrade: Trade;
  constructor(private api: ApiService) { }

  ngOnInit() {

  }

  verify() {
    this.api.getProof(this.code).subscribe((resp: any) => {
        this.decodedTrade = resp;
    }, err => {
      this.invalid = true;
    });
  }

}
