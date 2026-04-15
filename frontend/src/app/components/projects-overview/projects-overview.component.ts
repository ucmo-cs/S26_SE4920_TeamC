import { Component, OnInit } from '@angular/core';
import { ProjectApiService } from '../../services/project-api.service';
import { Project } from '../../models/project';

@Component({
  selector: 'app-projects-overview',
  templateUrl: './projects-overview.component.html',
  styleUrls: ['./projects-overview.component.css']
})
export class ProjectsOverviewComponent implements OnInit {
  projects: Project[] = [];
  selectedProject: Project | null = null;
  displayedColumns: string[] = ['projectName', 'status', 'productManager', 'startDate', 'actions'];
  isLoading = false;

  constructor(private projectApi: ProjectApiService) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.isLoading = true;
    this.projectApi.getProjects().subscribe({
      next: (projects) => {
        this.projects = (projects ?? []).map((project) => this.normalizeProject(project));
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  selectProject(project: Project): void {
    this.selectedProject = project;
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
}
