import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Trade } from 'src/app/models/trade';
import { Asset } from 'src/app/models/asset';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {



  trades: Trade[];
  tradeproof: string;
  public userkey: string;
  public assetIdToProof: number;
  constructor(private api: ApiService) { }

  ngOnInit() {

  }
  get() {
    this.api.getTrades(this.userkey).subscribe(resp => {
      this.trades = resp;
    });
  }

  checkId(assets : Asset[]) : boolean {
    //return assets[0].assetId.valueOf().toString();
    for(let a of assets) {
      if(a.assetId == this.assetIdToProof) {
        return true;  
      }
    }
    return false;
  }

  proof(tradeId: number) {
    this.api.generateProof(this.userkey, tradeId).subscribe((resp: any) => {
      this.tradeproof = resp.proof;
    });
  }
}
