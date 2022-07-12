import { Component, OnInit } from '@angular/core';
import { HttpService } from '../common/http.service';

/**
 * !!! Only for testing !!!
 * Show validation codes of a user that were actually sent by email
 */
@Component({
  selector: 'app-testing-tokens',
  templateUrl: './testing-tokens.component.html',
  styleUrls: ['./testing-tokens.component.scss'],
})
export class TestingTokensComponent implements OnInit {
  email: string = '';
  data: {
    validation_token: string | null;
    new_email_token: string | null;
    new_password_token: string | null;
  } | null = null;

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {}

  loadTokens(): void {
    if (null != this.email) {
      this.httpService
        .getWithoutAuth(`auth/tokens/${btoa(this.email)}`)
        .subscribe((result) => {
          this.data = result as any;
        });
    }
  }
}
