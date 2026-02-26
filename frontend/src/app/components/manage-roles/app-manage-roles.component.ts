import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'manage-roles',
  templateUrl: './app-manage-roles.component.html',
  styleUrls: ['./app-manage-roles.component.css'],
})
export class ManageRolesComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {}
}