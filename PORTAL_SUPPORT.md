# Portal Support Implementation

This project now includes full **Angular CDK Portal** support for rendering components and templates outside their normal DOM hierarchy.

## What is Portal Support?

Portal support in Angular CDK allows you to:
- Render components dynamically in different parts of the DOM
- Create modals, dialogs, and tooltips that appear outside the normal component tree
- Manage dynamic content rendering with full type safety
- Use template portals for complex dynamic UIs

## Features Implemented

### 1. **Portal Service** (`src/app/services/portal.service.ts`)
A reusable service that provides:
- `attachComponentPortal()` - Attach a component to a ViewContainerRef
- `attachTemplatePortal()` - Attach a template to a ViewContainerRef
- `createComponentPortal()` - Create a reusable component portal
- `createTemplatePortal()` - Create a reusable template portal

### 2. **Portal Outlet Component** (`src/app/components/portal-outlet/`)
A demo component showing:
- Template portal usage with `cdkPortalOutlet`
- Dynamic attachment and detachment of portals
- Easy-to-understand UI examples

### 3. **CDK Portal Module**
- Added `PortalModule` to `AppModule` for global availability
- Compatible with Angular Material components (dialogs, popovers, etc.)
- Works with Material Design patterns

## Usage Examples

### Using the Portal Service

```typescript
import { PortalService } from './services/portal.service';
import { ComponentPortal } from '@angular/cdk/portal';

export class MyComponent {
  constructor(private portalService: PortalService, private viewContainerRef: ViewContainerRef) {}

  renderComponent() {
    // Attach a component dynamically
    this.portalService.attachComponentPortal(
      MyDynamicComponent,
      this.viewContainerRef
    );
  }

  renderTemplate() {
    // Attach a template dynamically
    this.portalService.attachTemplatePortal(
      this.myTemplate,
      this.viewContainerRef,
      { data: 'context' }
    );
  }
}
```

### Using Portal Outlet in Templates

```html
<!-- Template Portal Example -->
<ng-template #myPortalContent>
  <div>This content is rendered via portal</div>
</ng-template>

<!-- Portal outlet that renders the portal -->
<div cdkPortalOutlet [portal]="selectedPortal"></div>

<!-- Buttons to manage portal -->
<button (click)="attachPortal()">Show</button>
<button (click)="detachPortal()">Hide</button>
```

## Integration with Certifications & Training

Portal support enhances the certifications and training page by:
- Allowing dynamic modal dialogs for adding/editing items
- Supporting dropdown menus for status filtering
- Enabling dynamic content rendering for complex forms
- Providing better UX for large data sets

## Module Dependencies

- `@angular/cdk` (already installed)
- `@angular/material` (already installed)
- Angular 18+

## Further Reading

- [Angular CDK Portal Documentation](https://material.angular.io/cdk/portal/overview)
- [Angular CDK Components](https://material.angular.io/cdk)

## Testing Portal Features

1. Navigate to the Portal Outlet component example in the app
2. Click "Attach Portal" to render content dynamically
3. Click "Detach Portal" to remove the rendered content
4. Use portals in your certifications/training forms for enhanced UX
