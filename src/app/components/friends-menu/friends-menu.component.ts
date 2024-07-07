import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-friends-menu',
  templateUrl: './friends-menu.component.html',
  styleUrl: './friends-menu.component.scss'
})
export class FriendsMenuComponent {
  isVisible = false;
  user!: any;
  friendList: any[];

  constructor(private userService: UserService) { this.friendList = [] }

  ngOnInit(){
    this.getUser();
    // this.user.friends.array.forEach(friend => {
      
    // });
  }

  toggleVisibility() {
    this.isVisible = !this.isVisible;
  }

  getUser(){
    this.userService.getUserProfile().subscribe({
      next: (result) => {
        this.user = result;
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {},
    });
  }

  getNameById(id: string){

  }
}
