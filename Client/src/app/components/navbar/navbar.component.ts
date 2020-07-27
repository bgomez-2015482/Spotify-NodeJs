import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  user: string;
  token: string;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.user = localStorage.getItem('user');
    this.token = localStorage.getItem('token');
    if(this.token == null){
      console.log('No ha iniciado sesión')
    }
  }

  logOut(){
    this.token = '';
    localStorage.clear();
    this.router.navigateByUrl('home');
  }

}
