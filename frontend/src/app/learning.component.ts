import { Component, OnInit } from '@angular/core';
import { CertificationApiService } from '../../services/certification-api.service';
import { TrainingApiService } from '../../services/training-api.service';

@Component({
  selector: 'app-learning',
  templateUrl: './learning.component.html',
  styleUrls: ['./learning.component.scss'],
})
export class LearningComponent implements OnInit {
  userId = 'test-user-1';

  certifications: any[] = [];
  trainings: any[] = [];

  certForm = { name: '', issuer: '', status: 'ACTIVE' };
  trainingForm = { title: '', provider: '', status: 'IN_PROGRESS' };

  constructor(
    private certApi: CertificationApiService,
    private trainingApi: TrainingApiService
  ) {}

  ngOnInit(): void {
    this.loadCerts();
    this.loadTrainings();
  }

  loadCerts() {
    this.certApi.listByUser(this.userId).subscribe((res) => {
      this.certifications = res.items || [];
    });
  }

  loadTrainings() {
    this.trainingApi.listByUser(this.userId).subscribe((res) => {
      this.trainings = res.items || [];
    });
  }

  addCert() {
    if (!this.certForm.name.trim() || !this.certForm.issuer.trim()) return;

    this.certApi
      .create({
        userId: this.userId,
        name: this.certForm.name.trim(),
        issuer: this.certForm.issuer.trim(),
        status: this.certForm.status,
      })
      .subscribe(() => {
        this.certForm = { name: '', issuer: '', status: 'ACTIVE' };
        this.loadCerts();
      });
  }

  deleteCert(uuid: string) {
    this.certApi.delete(uuid).subscribe(() => this.loadCerts());
  }

  addTraining() {
    if (!this.trainingForm.title.trim() || !this.trainingForm.provider.trim()) return;

    this.trainingApi
      .create({
        userId: this.userId,
        title: this.trainingForm.title.trim(),
        provider: this.trainingForm.provider.trim(),
        status: this.trainingForm.status,
      })
      .subscribe(() => {
        this.trainingForm = { title: '', provider: '', status: 'IN_PROGRESS' };
        this.loadTrainings();
      });
  }

  deleteTraining(uuid: string) {
    this.trainingApi.delete(uuid).subscribe(() => this.loadTrainings());
  }
}

