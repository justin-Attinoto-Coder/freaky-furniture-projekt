import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AdminSidebarComponent } from '../../../admin/admin-sidebar/admin-sidebar.component';
import { AdminTopbarComponent } from '../../../admin/admin-topbar/admin-topbar.component';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, RouterOutlet, AdminSidebarComponent, AdminTopbarComponent]
})
export class AdminDashboardComponent {}
