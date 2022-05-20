import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss']
})
export class SearchInputComponent implements OnInit {

  @Output() searchChange = new EventEmitter<string>();

  inputValue = new Subject<string>();
  trigger = this.inputValue.pipe(
    debounceTime(300),
    distinctUntilChanged()
  );

  subscriptions: Subscription[] = [];

  constructor() {}

  ngOnInit() {
    const subscription = this.trigger.subscribe(currentValue => {
      this.searchChange.emit(currentValue);
    });
    this.subscriptions.push(subscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onInput(e: any) {
    this.inputValue.next(e.target.value);
  }

}
