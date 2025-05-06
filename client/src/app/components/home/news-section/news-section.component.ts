import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-news-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './news-section.component.html',
  styleUrls: ['./news-section.component.css']
})
export class NewsSectionComponent {
  newsItems = [
    { title: 'New Furniture Collection Launched!', date: 'May 1, 2025', summary: 'Discover our latest collection.' },
    { title: 'Summer Sale Now On!', date: 'May 3, 2025', summary: 'Get up to 50% off.' },
    { title: 'Eco-Friendly Materials Update', date: 'May 5, 2025', summary: 'Sustainable furniture line.' }
  ];
}
