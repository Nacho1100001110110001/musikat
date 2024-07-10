import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { enviroments } from '../../../enviroments/enviroments';
import { Router } from '@angular/router';

@Component({
  selector: 'app-friends-menu',
  templateUrl: './friends-menu.component.html',
  styleUrl: './friends-menu.component.scss'
})
export class FriendsMenuComponent {
  isVisible = false;
  user!: any;
  friendList: any[];
  backupsrc: string = '../../../assets/images/profile-icon.png';

  constructor(private userService: UserService, private router: Router) { this.friendList = [] }

  ngOnInit(){
    this.userService.friendList$.subscribe(newFriendList => {
      this.friendList = newFriendList;
    });
  }

  toggleVisibility() {
    this.isVisible = !this.isVisible;
  }

  onImageError(event: any){
    event.target.src = this.backupsrc;
  }

  getSrc(id: number){
    return enviroments.apiConnect.photo + "/" + id;
  }

  verPerfil(index: number){
    this.isVisible = false;
    this.router.navigate(['perfil/'+ this.friendList[index].username]);
  }

  toggleMenu(index: number){
    this.friendList[index].showMenu = !this.friendList[index].showMenu;
  }
}
