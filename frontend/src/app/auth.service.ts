import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient,private router: Router) { }
  async login(username: string, password: string): Promise<Observable<boolean>> {
    // Your login logic with Lambda function
    // Simulating success for demonstration purposes
    const response = await fetch('http://localhost:3000/dev/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    })
    .then(response => {return response.json()});
        
    return new Observable<boolean>((observer) => {
      if (response.auth) {
        observer.next(true); // Notify subscribers that login was successful
        observer.complete(); // Complete the observable
      } else {
        observer.error('Login failed'); // Notify subscribers that login failed
      }
    });
  }

  logout() {
    // Your logout logic with Lambda function
    // Simulating success for demonstration purposes
    const logoutSuccess = true;

    if (logoutSuccess) {
      // Redirect to login page or any other desired page
      this.router.navigate(['/login']);
    } else {
      // Handle logout failure
      console.error('Logout failed');
    }
  }
}