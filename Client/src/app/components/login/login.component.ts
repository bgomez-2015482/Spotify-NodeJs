import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userLogin

  constructor(private rest: UserService, private router: Router) {
    this.userLogin = {
      email: '',
      username: '',
      password: '',
      gettoken: 'true'
    }
   }

  ngOnInit(): void {
  }

  onSubmit(){
    if(this.userLogin.username != '' || this.userLogin.email){
      if(this.userLogin.password != ''){
        this.rest.login(this.userLogin).subscribe((res:any)=>{
          if(res.message){
            alert(res.message)
          }else if(res.token){
            alert('Bienvenido ' + res.user);
            localStorage.setItem('token', res.token);
            res.password = '';
            localStorage.setItem('user', JSON.stringify(res.user));
            this.router.navigateByUrl('register');
          }else{
            alert('Ha ocurrido un error desconocido')
          }
        })
      }else{
        alert('Ingresa la contraseña')
      }
    }else{
      alert('Ingresa los datos de autenticación')
    }
  }

}
