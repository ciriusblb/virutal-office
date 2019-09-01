import { Component, OnInit } from '@angular/core';
import { AccountHistoryService } from '../../services/account-history/account-history.service';
import { UserService } from '../../services/user/user.service';


@Component({
  selector: 'app-account-history',
  templateUrl: './account-history.component.html',
  styles: []
})
export class AccountHistoryComponent implements OnInit {
  accounts: Array<any> = [];
  payments: Array<any> = [];
  date: Date = new Date();
  constructor(public _accountHistoryService: AccountHistoryService, public _userService: UserService) { }

  ngOnInit() {
    this.getAccountHistory();
  }
  getAccountHistory() {
    this._accountHistoryService.getAccountHistory()
      .subscribe(resp => {
        this.accounts = resp;
            if (new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0) === new Date()) {
              this.setpaymentHistory();
            }
            // this.getpaymentHistory();
      });
  }
  setpaymentHistory() {
    this._accountHistoryService.setpaymentHistory()
      .subscribe(resp => {
        this.payments = resp;
        console.log(this.payments);
      });
  }
  getpaymentHistory() {
    this._accountHistoryService.getpaymentHistory()
      .subscribe(resp => {
        this.payments = resp;

      });
  }

}
