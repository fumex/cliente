import { Component, OnInit } from '@angular/core';
import { User } from '../interfaces/user.model';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user:User;
  constructor(
    private authService:AuthService
  ) { 
    this.user=this.authService.getUser();
  }

  ngOnInit() {
    this.user;
  }
}
