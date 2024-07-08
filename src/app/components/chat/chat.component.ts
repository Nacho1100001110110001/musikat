import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {
  messages: { text: string, type: 'incoming' | 'outgoing' }[] = [
    { text: 'Hola el pepe etesech', type: 'incoming' },
    { text: 'y vo quien eri? *bloquear*', type: 'outgoing' },
    { text: 'pipipi', type: 'incoming' }
  ];

name : string = "Vicente InostrozAAAAAAAAAAa"

  @ViewChild('messageInput') messageInput!: ElementRef<HTMLInputElement>;
  @ViewChild('chatMessages') chatMessages!: ElementRef<HTMLDivElement>;

  sendMessage(messageInput: HTMLInputElement): void {
    const messageText = messageInput.value.trim();

    if (messageText) {
      this.messages.push({ text: messageText, type: 'outgoing' });

      messageInput.value = '';

      setTimeout(() => {
        this.chatMessages.nativeElement.scrollTop = this.chatMessages.nativeElement.scrollHeight;
      }, 0);
    }
  }

  onExitClick(): void {
    console.log('Salir del chat');
  }


  nameCut(): void {
    if (this.name.length > 15) {
      this.name = this.name.slice(0, 15) + '...';
    }
  }

}
