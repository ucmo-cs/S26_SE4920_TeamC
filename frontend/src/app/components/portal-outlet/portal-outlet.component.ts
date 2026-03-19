import { Component, OnInit } from '@angular/core';
import { CdkPortalOutlet, ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import { ViewChild, TemplateRef, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-portal-outlet',
  standalone: true,
  imports: [CommonModule, CdkPortalOutlet],
  template: `
    <div class="portal-container">
      <h3>Portal Outlet Demo</h3>
      <ng-template #examplePortal>
        <div style="padding: 16px; background: #f0f0f0; border-radius: 4px;">
          <h4>This is rendered via Portal!</h4>
          <p>Portal content can be dynamically rendered outside the normal DOM hierarchy.</p>
        </div>
      </ng-template>
      
      <div cdkPortalOutlet [portal]="selectedPortal"></div>
      
      <button (click)="attachPortal()">Attach Portal</button>
      <button (click)="detachPortal()">Detach Portal</button>
    </div>
  `,
  styles: [`
    .portal-container {
      padding: 16px;
      border: 1px solid #ddd;
      border-radius: 4px;
      margin: 16px 0;
    }
    button {
      margin-right: 8px;
      padding: 8px 16px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    button:hover {
      background: #0056b3;
    }
  `]
})
export class PortalOutletComponent implements OnInit {
  @ViewChild('examplePortal') examplePortal!: TemplateRef<any>;
  @ViewChild(CdkPortalOutlet) portalOutlet!: CdkPortalOutlet;

  selectedPortal: TemplatePortal<any> | null = null;

  constructor(private viewContainerRef: ViewContainerRef) {}

  ngOnInit() {
    // Portal is ready to be attached
  }

  attachPortal() {
    if (this.examplePortal) {
      this.selectedPortal = new TemplatePortal(
        this.examplePortal,
        this.viewContainerRef
      );
    }
  }

  detachPortal() {
    if (this.portalOutlet) {
      this.portalOutlet.detach();
    }
    this.selectedPortal = null;
  }
}
