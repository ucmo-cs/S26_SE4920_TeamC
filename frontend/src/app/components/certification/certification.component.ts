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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CertificationApiService } from '../../services/certification-api.service';

interface Certification {
  uuid?: string;
  name: string;
  issuer: string;
  status: string;
  dateObtained?: string;
}

@Component({
  selector: 'app-certification',
  templateUrl: './certification.component.html',
  styleUrls: ['./certification.component.scss'],
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
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule
  ]
})
export class CertificationComponent implements OnInit {
  certifications: Certification[] = [];
  loading = false;
  error = '';
  userId = 'test-user-1';
  
  showForm = false;
  editingId: string | null = null;
  
  form: Certification = {
    name: '',
    issuer: '',
    status: 'ACTIVE'
  };

  displayedColumns = ['name', 'issuer', 'status', 'actions'];

  constructor(private certificationApi: CertificationApiService) {}

  ngOnInit(): void {
    this.loadCertifications();
  }

  loadCertifications(): void {
    this.loading = true;
    this.error = '';
    this.certificationApi.listByUser(this.userId).subscribe({
      next: (res: any) => {
        this.certifications = res.items || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load certifications';
        console.error(err);
        this.loading = false;
      }
    });
  }

  openForm(): void {
    this.showForm = true;
    this.editingId = null;
    this.form = { name: '', issuer: '', status: 'ACTIVE' };
  }

  editCertification(cert: Certification): void {
    this.form = { ...cert };
    this.editingId = cert.uuid || null;
    this.showForm = true;
  }

  saveCertification(): void {
    if (!this.form.name.trim() || !this.form.issuer.trim()) {
      this.error = 'Please fill all required fields';
      return;
    }

    const payload = {
      userId: this.userId,
      ...this.form
    };

    if (this.editingId) {
      this.certificationApi.update(this.editingId, payload).subscribe({
        next: () => {
          this.loadCertifications();
          this.showForm = false;
        },
        error: (err) => {
          this.error = 'Failed to update certification';
          console.error(err);
        }
      });
    } else {
      this.certificationApi.create(payload).subscribe({
        next: () => {
          this.loadCertifications();
          this.showForm = false;
        },
        error: (err) => {
          this.error = 'Failed to create certification';
          console.error(err);
        }
      });
    }
  }

  deleteCertification(uuid: string): void {
    if (!confirm('Are you sure you want to delete this certification?')) return;

    this.certificationApi.delete(uuid).subscribe({
      next: () => {
        this.loadCertifications();
      },
      error: (err) => {
        this.error = 'Failed to delete certification';
        console.error(err);
      }
    });
  }

  cancel(): void {
    this.showForm = false;
    this.editingId = null;
    this.form = { name: '', issuer: '', status: 'ACTIVE' };
    this.error = '';
  }
}
