import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { RocConstants } from '../shared/constants/roc-constants';
import { Project } from '../models/project';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProjectApiService {
  private baseUrl = environment.rocApiUrl;
  private projectUrl = `${this.baseUrl}/${RocConstants.APIS.PROJECTS}`;

  constructor(private http: HttpClient) {}

  public getProjectInfo(uuid: string) {
    return of({ uuid, projectName: 'Mock Project', status: 'Active' });
  }

  addProject(requestParams: any) {
    return of({ ...requestParams });
  }

  editProject(projectInfo: Project) {
    return of(projectInfo);
  }

  deleteProject(uuid: string) {
    return of({ success: true });
  } 

  getProjects() {
    return this.http.get<Project[]>(this.projectUrl);
  }
}
