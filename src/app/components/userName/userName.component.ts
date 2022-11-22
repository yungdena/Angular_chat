import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-userName',
  templateUrl: './userName.component.html',
  styleUrls: ['./userName.component.scss']
})
export class UserNameComponent {
  @Output() userNameEvent = new EventEmitter<string>();

  userName = '';

  setUserName(): void {
    this.userNameEvent.emit(this.userName);
  }
}
