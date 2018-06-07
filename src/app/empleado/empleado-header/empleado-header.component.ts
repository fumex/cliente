import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-empleado-header',
  templateUrl: './empleado-header.component.html',
  styleUrls: ['./empleado-header.component.css']
})
export class EmpleadoHeaderComponent implements OnInit {

  constructor(
    private auth:AuthService
  ) { }

  ngOnInit() {
  }
  logout(e){
    e.preventDefault();
    this.auth.logout();
  }
}
