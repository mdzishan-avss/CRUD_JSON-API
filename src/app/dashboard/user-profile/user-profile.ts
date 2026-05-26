import { Component } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.html',
  styleUrls: ['./user-profile.css']
})
export class UserProfile {

  user: any;   

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
  }

}