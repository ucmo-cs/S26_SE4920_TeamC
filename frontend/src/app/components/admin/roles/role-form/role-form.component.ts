import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RolesService } from '../roles.service';
import { Permission } from '../models';

@Component({
  selector: 'app-role-form',
  templateUrl: './role-form.component.html',
  styleUrls: ['./role-form.component.css'],
})
export class RoleFormComponent implements OnInit {
  id: string | null = null;
  permissions: Permission[] = [];
  loading = false;

  form = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    permissionCodes: this.fb.control<string[]>([])
  });

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private rolesService: RolesService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');

    this.rolesService.getPermissions().subscribe({
      next: (p) => (this.permissions = p),
      error: () => alert('Failed to load permissions')
    });

    if (this.id) {
      this.loading = true;
      this.rolesService.getRole(this.id).subscribe({
        next: (role) => {
          this.form.patchValue({
            name: role.name,
            description: role.description ?? '',
            permissionCodes: role.permissions?.map(x => x.code) ?? []
          });
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          alert('Failed to load role');
        }
      });
    }
  }

  onPermissionChange(code: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.togglePermission(code, checked);
  }

  togglePermission(code: string, checked: boolean) {
    const current = this.form.value.permissionCodes ?? [];
    this.form.patchValue({
      permissionCodes: checked ? [...current, code] : current.filter(c => c !== code)
    });
  }

  save() {
    if (this.form.invalid) return;

    const payload = {
      name: this.form.value.name!,
      description: this.form.value.description ?? '',
      permissionCodes: this.form.value.permissionCodes ?? []
    };

    const req = this.id
      ? this.rolesService.updateRole(this.id, payload)
      : this.rolesService.createRole(payload);

    req.subscribe({
      next: () => this.router.navigate(['/admin/roles']),
      error: () => alert('Save failed')
    });
  }
}