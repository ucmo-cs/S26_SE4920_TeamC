import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Injectable({ providedIn: 'root' })
export class AuthService {
  public user: Promise<any>;
  public loggedIn: boolean | undefined;

  constructor(
    private router: Router,
    private dialogRef: MatDialog
  ) {
    this.user = this.setUser("USER1");
  }

  signOut() {
    this.dialogRef.closeAll();
    //apply logout if needed
    this.router.navigate(['/login']);
  }

  getUser() {
    return this.user;
  }

  async setUser(uuid: String) {
    console.log(uuid);
    try {
      const user = await fetch(`http://localhost:3000/dev/user?uuid=${uuid}`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        },
      })

      console.log(user);
      
      return new Promise((resolve) => { resolve(user) })
    } catch (err) {
      console.log('not signed in: ' + err)
      this.router.navigate(['/login'])
      return null;
    }
  }

  checkLoggedIn() {
    return this.user;
  }

  async adminCheck() {
    let user = await this.user;
    if (user.roles.includes('ADMIN')) {
      return true;
    } else {
      return false;
    }
  }
  async leadCheck() {
    let user = await this.user;
    if (user.roles.includes('LEAD')) {
      return true;
    } else {
      return false;
    }
  }
  async leadAdminCheck() {
    let user = await this.user;
    if (user.roles.includes('LEAD') || user.roles.includes('ADMIN')) {
      return true;
    } else {
      return false;
    }
  }
  async testerCheck() {
    let user = await this.user;
    if (user.roles.includes('TESTER')) {
      return true;
    } else {
      return false;
    }
  }
  async pmCheck() {
    let user = await this.user;
    if (user.roles.includes('PM')) {
      return true;
    } else {
      return false;
    }
  }
  async pmAdminCheck() {
    let user = await this.user;
    if (user.roles.includes('PM') || user.roles.includes('ADMIN')) {
      return true;
    } else {
      return false;
    }
  }
  async interimLeadCheck() {
    let user = await this.user;
    if (user.roles.includes('INTERIM_LEAD')) {
      return true;
    } else {
      return false;
    }
  }
}
