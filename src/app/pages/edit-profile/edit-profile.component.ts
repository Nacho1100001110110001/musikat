import { Component } from '@angular/core';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss'
})
export class EditProfileComponent {
  selectedTab: string = 'home';

  selectTab(tab: string) {
    this.selectedTab = tab;
  }
}
