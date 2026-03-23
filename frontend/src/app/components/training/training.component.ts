import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TrainingApiService } from '../../services/training-api.service';

interface Training {
  uuid?: string;
  title: string;
  provider: string;
  status: string;
  hours?: number;
  completionDate?: string;
}

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatProgressBarModule,
    MatProgressSpinnerModule
  ]
})
export class TrainingComponent implements OnInit {
  trainings: Training[] = [];
  loading = false;
  error = '';
  userId = 'test-user-1';
  
  showForm = false;
  editingId: string | null = null;
  
  form: Training = {
    title: '',
    provider: '',
    status: 'IN_PROGRESS',
    hours: 0
  };

  displayedColumns = ['title', 'provider', 'status', 'hours', 'actions'];
  statusOptions = [
    { value: 'NOT_STARTED', label: 'Not Started' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELLED', label: 'Cancelled' }
  ];

  constructor(private trainingApi: TrainingApiService) {}

  ngOnInit(): void {
    this.loadTrainings();
  }

  loadTrainings(): void {
    this.loading = true;
    this.error = '';
    this.trainingApi.listByUser(this.userId).subscribe({
      next: (res: any) => {
        this.trainings = Array.isArray(res) ? res : (res.items || []);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load trainings';
        console.error(err);
        this.loading = false;
      }
    });
  }

  openForm(): void {
    this.showForm = true;
    this.editingId = null;
    this.form = { title: '', provider: '', status: 'IN_PROGRESS', hours: 0 };
  }

  editTraining(training: Training): void {
    this.form = { ...training };
    this.editingId = training.uuid || null;
    this.showForm = true;
  }

  saveTraining(): void {
    if (!this.form.title.trim() || !this.form.provider.trim()) {
      this.error = 'Please fill all required fields';
      return;
    }

    const payload = {
      userId: this.userId,
      ...this.form
    };

    if (this.editingId) {
      this.trainingApi.update(this.editingId, payload).subscribe({
        next: () => {
          this.loadTrainings();
          this.showForm = false;
        },
        error: (err) => {
          this.error = 'Failed to update training';
          console.error(err);
        }
      });
    } else {
      this.trainingApi.create(payload).subscribe({
        next: () => {
          this.loadTrainings();
          this.showForm = false;
        },
        error: (err) => {
          this.error = 'Failed to create training';
          console.error(err);
        }
      });
    }
  }

  deleteTraining(uuid: string): void {
    if (!confirm('Are you sure you want to delete this training?')) return;

    this.trainingApi.delete(uuid).subscribe({
      next: () => {
        this.loadTrainings();
      },
      error: (err) => {
        this.error = 'Failed to delete training';
        console.error(err);
      }
    });
  }

  getStatusLabel(status: string): string {
    const option = this.statusOptions.find(o => o.value === status);
    return option ? option.label : status;
  }

  getProgressPercentage(status: string): number {
    switch (status) {
      case 'NOT_STARTED': return 0;
      case 'IN_PROGRESS': return 50;
      case 'COMPLETED': return 100;
      default: return 0;
    }
  }

  cancel(): void {
    this.showForm = false;
    this.editingId = null;
    this.form = { title: '', provider: '', status: 'IN_PROGRESS', hours: 0 };
    this.error = '';
  }
}
