import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs'
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  endpoint = 'http://localhost:3800/api/';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor( private http: HttpClient ) { }

  private extractData(res: Response){
    let body = res;
    return body || [] || {};
  }

  register(dataUser){
  let params = JSON.stringify(dataUser);
  return this.http.post(this.endpoint + 'register', params, this.httpOptions).pipe(
    map(this.extractData)
  );
  }

  login(dataUser){
  let params = JSON.stringify(dataUser);
  return this.http.post(this.endpoint + 'login', params, this.httpOptions).pipe(
    map(this.extractData)
  )
  }

  updateUser(dataUser){
    let params = JSON.stringify(dataUser);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });
    return this.http.put(this.endpoint + 'update-user/'+ dataUser._id, params, {headers: headers}).pipe(
      map(this.extractData)
    )
  }
}
