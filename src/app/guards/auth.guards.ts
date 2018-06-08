import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild, CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../auth/services/auth.service';
 

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(
    private auth:AuthService,
    private router:Router
  ) { }

  canActivate(route:ActivatedRouteSnapshot, state:RouterStateSnapshot):Observable<boolean>|Promise<boolean>|boolean{
    const expectedRole= route.data.expectedRole;
    let user=this.auth.getUser();
      if(!this.auth.check() || user.rol!==expectedRole){
          this.router.navigate(['/'+user.rol]);
          return false;
      }
      else{
        return true;
      }   
  }
  canActivateChild(route:ActivatedRouteSnapshot, state:RouterStateSnapshot):Observable<boolean>|Promise<boolean>|boolean{
    
    if(this.auth.check()){
      return true;
    }
    this.router.navigate(['auth/login']);
    return false;
  }

}