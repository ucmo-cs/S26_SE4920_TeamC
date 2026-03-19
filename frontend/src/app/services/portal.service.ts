import { Injectable, Injector, ViewContainerRef } from '@angular/core';
import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import { ComponentRef, TemplateRef } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PortalService {
  constructor(private injector: Injector) {}

  /**
   * Attach a component portal to a ViewContainerRef
   */
  attachComponentPortal<T>(
    component: any,
    viewContainerRef: ViewContainerRef
  ): ComponentRef<T> {
    const componentPortal = new ComponentPortal(component, viewContainerRef, this.injector);
    return viewContainerRef.createComponent(componentPortal.component as any) as ComponentRef<T>;
  }

  /**
   * Attach a template portal to a ViewContainerRef
   */
  attachTemplatePortal(
    templateRef: TemplateRef<any>,
    viewContainerRef: ViewContainerRef,
    context?: any
  ) {
    return viewContainerRef.createEmbeddedView(templateRef, context);
  }

  /**
   * Create a component portal (for use with portal outlet)
   */
  createComponentPortal<T>(component: any): ComponentPortal<T> {
    return new ComponentPortal(component);
  }

  /**
   * Create a template portal (for use with portal outlet)
   */
  createTemplatePortal<T>(
    templateRef: TemplateRef<T>,
    viewContainerRef: ViewContainerRef,
    context?: T
  ): TemplatePortal<T> {
    return new TemplatePortal(templateRef, viewContainerRef, context);
  }
}
