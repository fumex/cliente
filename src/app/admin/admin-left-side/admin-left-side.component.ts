import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-admin-left-side',
  templateUrl: './admin-left-side.component.html',
  styleUrls: ['./admin-left-side.component.css']
})
export class AdminLeftSideComponent implements OnInit {
  public user;
  constructor(
    private auth:AuthService
  ) { }

  ngOnInit() {
    console.log('menu lateral')
  }

}
