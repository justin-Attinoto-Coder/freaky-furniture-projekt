import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, FaIconComponent]
})
export class SearchBarComponent {
  query = '';
  faSearch = faSearch;
  @Output() search = new EventEmitter<string>();

  onSubmit(event: Event): void {
    event.preventDefault();
    this.search.emit(this.query);
  }
}
