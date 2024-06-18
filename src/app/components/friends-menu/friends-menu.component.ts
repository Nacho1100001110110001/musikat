import { Component } from '@angular/core';

@Component({
  selector: 'app-friends-menu',
  templateUrl: './friends-menu.component.html',
  styleUrl: './friends-menu.component.scss'
})
export class FriendsMenuComponent {
  isVisible = false;

  toggleVisibility() {
    this.isVisible = !this.isVisible;
  }
}
