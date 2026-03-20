import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectApiService } from '../../services/project-api.service';
import { Project } from '../../models/project';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];
  selectedProject: Project | null = null;
  projectForm: FormGroup;
  displayedColumns: string[] = ['projectName', 'status', 'productManager', 'startDate', 'actions'];
  isLoading = false;
  isViewMode = false;

  constructor(private projectApi: ProjectApiService, private fb: FormBuilder) {
    this.projectForm = this.fb.group({
      uuid: [{ value: '', disabled: true }],
      projectName: ['', Validators.required],
      status: ['', Validators.required],
      description: [''],
      contract: [''],
      hash: [''],
      productManager: [''],
      productOwner: [''],
      fullName: [''],
      startDate: ['']
    });
  }

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.isLoading = true;
    this.projectApi.getProjects().subscribe({
      next: (projects) => {
        this.projects = (projects ?? []).map((project) => this.normalizeProject(project));
        this.isLoading = false;
        if (this.selectedProject) {
          const refreshed = this.projects.find((project) => project.uuid === this.selectedProject?.uuid);
          if (refreshed) {
            if (this.isViewMode) {
              this.viewProject(refreshed);
            } else {
              this.selectProject(refreshed);
            }
          }
        }
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  startNewProject(): void {
    this.isViewMode = false;
    this.selectedProject = null;
    this.projectForm.reset();
    this.projectForm.enable();
    this.projectForm.get('uuid')?.disable();
    this.projectForm.patchValue({ status: 'Active' });
  }

  selectProject(project: Project): void {
    this.isViewMode = false;
    this.selectedProject = project;
    this.projectForm.reset();
    this.projectForm.enable();
    this.projectForm.patchValue({ ...project });
    this.projectForm.get('uuid')?.disable();
  }

  viewProject(project: Project): void {
    this.isViewMode = true;
    this.selectedProject = project;
    this.projectForm.reset();
    this.projectForm.patchValue({ ...project });
    this.projectForm.disable();
  }

  editSelectedProject(): void {
    if (!this.selectedProject) {
      return;
    }

    this.selectProject(this.selectedProject);
  }

  saveProject(): void {
    if (this.projectForm.invalid) {
      return;
    }

    const raw = this.projectForm.getRawValue();
    const payload: Project = {
      ...this.emptyProject(),
      ...this.selectedProject,
      ...raw,
      uuid: raw.uuid || this.selectedProject?.uuid || this.generateUuid()
    };

    if (this.selectedProject) {
      this.projectApi.editProject(payload).subscribe((updated) => {
        const normalized = this.normalizeProject(updated);
        const index = this.projects.findIndex((project) => project.uuid === normalized.uuid);
        if (index >= 0) {
          this.projects[index] = normalized;
          this.projects = [...this.projects];
        }
        this.selectProject(normalized);
      });
      return;
    }

    this.projectApi.addProject(payload).subscribe((created) => {
      const normalized = this.normalizeProject(created as Project);
      this.projects = [normalized, ...this.projects];
      this.selectProject(normalized);
    });
  }

  deleteProject(project: Project): void {
    if (!confirm(`Delete ${project.projectName}?`)) {
      return;
    }

    this.projectApi.deleteProject(project.uuid).subscribe(() => {
      this.projects = this.projects.filter((item) => item.uuid !== project.uuid);
      if (this.selectedProject?.uuid === project.uuid) {
        this.startNewProject();
      }
    });
  }

  trackByUuid(index: number, project: Project): string {
    return project.uuid;
  }

  private normalizeProject(project: Partial<Project>): Project {
    return {
      uuid: project.uuid ?? '',
      contract: project.contract ?? '',
      description: project.description ?? '',
      hash: project.hash ?? '',
      productManager: project.productManager ?? '',
      productOwner: project.productOwner ?? '',
      fullName: project.fullName ?? '',
      projectName: project.projectName ?? '',
      startDate: project.startDate ?? '',
      status: project.status ?? ''
    };
  }

  private emptyProject(): Project {
    return {
      uuid: '',
      contract: '',
      description: '',
      hash: '',
      productManager: '',
      productOwner: '',
      fullName: '',
      projectName: '',
      startDate: '',
      status: ''
    };
  }

  private generateUuid(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }
    return `local-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
  }
}
