import { Component, input,output } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  template: `
   <button class="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer " (click)="btnClicked.emit()" >{{title()}}</button>
  `,
  styles: ``
})
export class ButtonComponent {
  title = input('')
  btnClicked = output()

  

}
