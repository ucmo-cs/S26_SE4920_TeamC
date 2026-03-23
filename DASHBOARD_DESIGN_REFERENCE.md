# Modern Dashboard Design System - Visual Reference

## 🎨 Color Palette Reference

### Primary Colors
```
┌─────────────────────────────────────────────────┐
│ Primary Blue        #3498db                    │
│ ███████████████████████████████████████████████ │
│ Used for: Links, buttons, icons, accents      │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ Primary Dark Blue   #2980b9                    │
│ ███████████████████████████████████████████████ │
│ Used for: Hover states, active states          │
└─────────────────────────────────────────────────┘
```

### Neutral Colors
```
┌─────────────────────────────────────────────────┐
│ White               #ffffff                    │
│ ███████████████████████████████████████████████ │
│ Used for: Backgrounds, cards                   │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ Light Gray          #f5f7fa                    │
│ ███████████████████████████████████████████████ │
│ Used for: Main content background              │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ Soft Gray           #f8f9fa                    │
│ ███████████████████████████████████████████████ │
│ Used for: Gradient backgrounds                 │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ Light Border        #ecf0f1                    │
│ ███████████████████████████████████████████████ │
│ Used for: Subtle backgrounds                   │
└─────────────────────────────────────────────────┘
```

### Text Colors
```
┌─────────────────────────────────────────────────┐
│ Primary Text        #2c3e50                    │
│ ███████████████████████████████████████████████ │
│ Used for: Main content, titles, labels        │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ Secondary Text      #7f8c8d                    │
│ ███████████████████████████████████████████████ │
│ Used for: Descriptions, secondary content      │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ Border/Divider      #e0e6ed                    │
│ ███████████████████████████████████████████████ │
│ Used for: Borders, dividers, separators        │
└─────────────────────────────────────────────────┘
```

---

## 📐 Component Spacing System

### Padding Scale
```
Extra Small:  8px   ▰▰▰▰▰▰▰▰
Small:       12px   ▰▰▰▰▰▰▰▰▰▰▰▰
Medium:      16px   ▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰
Large:       20px   ▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰
Extra Large: 24px   ▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰
```

### Gap Scale (flex/grid)
```
Extra Small:  8px    ▰▰▰▰▰▰▰▰
Small:       12px    ▰▰▰▰▰▰▰▰▰▰▰▰
Medium:      20px    ▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰
Large:       40px    ▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰
```

---

## 🔲 Border Radius System

```
Extra Small  4px   ┐
                   ├─ Subtle corners
                   ┘

Small        8px   ╭
                   ├─ Minimal rounding
                   ╰

Medium      12px   ╭──
                   ├─ Standard rounding
                   ╰──

Large       20px   ╭───
                   ├─ Prominent rounding
                   ╰───
```

### Usage:
- **4px**: Buttons, small UI elements
- **8px**: Menu items, small cards
- **12px**: Standard cards, form fields
- **20px**: Large cards, containers

---

## 💫 Shadow System

### Soft Shadow (0 2px 8px rgba(0, 0, 0, 0.1))
```
┌─────────────────┐
│                 │  Subtle depth
│   Card Content  │  Used for: Headers, footers, subtle elevation
│                 │  Blur: 8px, Spread: 0px
└─────────────────┘
```

### Medium Shadow (0 4px 12px rgba(0, 0, 0, 0.15))
```
┌─────────────────┐
│                 │  Clear depth
│   Card Content  │  Used for: Elevated cards, modals
│                 │  Blur: 12px, Spread: 0px
└─────────────────┘
```

### Top Shadow (Headers) - 0 2px 8px rgba(0, 0, 0, 0.1)
```
═════════════════════════════════════ ← Header with shadow below
┌─────────────────────────────────────┐
│ Logo    Title    User    Menu        │
└─────────────────────────────────────┘
```

### Bottom Shadow (Footers) - 0 -2px 8px rgba(0, 0, 0, 0.05)
```
┌─────────────────────────────────────┐
│ © 2024 Risen One Consulting         │
├─────────────────────────────────────┤
═════════════════════════════════════ ← Footer with shadow above
  (lighter shadow for footer)
```

---

## 📏 Layout Dimensions

### Header
```
Desktop:    70px height
Tablet:     70px height
Mobile:     60px height

┌─────────────────────────────────────────────────┐
│ [Logo] Company Title          [Photo] [Menu]    │  70px
└─────────────────────────────────────────────────┘
```

### Sidebar
```
Desktop:    240px width
Tablet:     180px width
Mobile:     Hidden

┌──────────┐
│          │
│ Home     │  240px
│ Daily    │  width
│ Projects │
│ Team     │
│ Admin    │
│          │
└──────────┘
```

### Main Content Area
```
┌───────────────────────────────────────────────┐
│                                               │ 
│  Flex: 1 1 auto                               │
│  Min-height: calc(100vh - header - footer)   │
│                                               │
│  Background: #f5f7fa                          │
│                                               │
└───────────────────────────────────────────────┘
```

### Footer
```
┌──────────────────────────────────────────────────┐
│  Left (1fr)  │  Center (3fr)  │  Right (1fr)    │  80px
│              │                │                  │
│ © 2024 Company  Terms  Privacy    Social Links  │
└──────────────────────────────────────────────────┘
```

---

## 🎯 Typography Hierarchy

```
H1 - Page Title
╔═══════════════════════════════════════════╗
║ Certification Management                  ║  32px, 600 weight
╚═══════════════════════════════════════════╝
 Manage and track employee certifications

H2 - Section Title
╔═══════════════════════════════════════════╗
║ Active Certifications                     ║  18px, 600 weight
╚═══════════════════════════════════════════╝

H3 - Card Title / Form Label
┌───────────────────────────────────────────┐
│ Certification Details                     │  16px, 600 weight
└───────────────────────────────────────────┘

Body - Regular Text
Regular content and descriptions             14px, 500 weight

Secondary - Muted Text  
Secondary information                        13px, 500 weight

Caption - Helper Text
Helper text and descriptions                 12px, 500 weight
```

---

## 🎨 Component States

### Button States
```
┌─────────────────────────┐
│      Default            │  Background: #3498db
│                         │  Color: #ffffff
└─────────────────────────┘

┌─────────────────────────┐
│ ⟲  Hover/Focus         │  Background: #2980b9
│                         │  Scale: 1.02
└─────────────────────────┘

┌─────────────────────────┐
│      Active             │  Background: #2980b9
│                         │  Box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2)
└─────────────────────────┘

┌─────────────────────────┐
│   Disabled              │  Background: #ecf0f1
│  (grayed out)           │  Color: #bdc3c7
└─────────────────────────┘
```

### Menu Item States
```
NORMAL
┌──────────────────────────┐
│ Home                     │  Color: #2c3e50
│                          │  Background: transparent
└──────────────────────────┘

HOVER
┌──────────────────────────┐
│ 🔹 Daily Status          │  Color: #3498db
│                          │  Background: #f5f7fa
│                          │  Padding-left: +8px
└──────────────────────────┘

ACTIVE
┌──────────────────────────┐
││ Projects                │  Color: #3498db
│                          │  Background: #f5f7fa
│                          │  Border-left: 4px #3498db
└──────────────────────────┘
```

### Form Input States
```
DEFAULT
┌────────────────────────────┐
│ Email Address              │
│ ┌──────────────────────┐   │
│ │                      │   │  Border: 1px #e0e6ed
│ └──────────────────────┘   │  Background: #ffffff
└────────────────────────────┘

FOCUS
┌────────────────────────────┐
│ Email Address              │
│ ┌──────────────────────┐   │
│ │ ●                    │   │  Border: 2px #3498db
│ └──────────────────────┘   │  Background: #ffffff
└────────────────────────────┘

FILLED
┌────────────────────────────┐
│ Email Address              │
│ ┌──────────────────────┐   │
│ │ user@example.com     │   │  Border: 1px #3498db
│ └──────────────────────┘   │  Background: #ffffff
└────────────────────────────┘

ERROR
┌────────────────────────────┐
│ Email Address              │
│ ┌──────────────────────┐   │
│ │ invalid@             │   │  Border: 2px #e74c3c
│ └──────────────────────┘   │  Background: #fff5f5
│ ⚠ Please enter valid email │  Color: #e74c3c
└────────────────────────────┘
```

---

## 📊 Card Layouts

### Standard Card
```
╔═══════════════════════════════════════╗ ← 12px border-radius
║  Card Title                    ⋯      ║ ← 24px padding
║                                       ║
║  Card content goes here               ║
║  Multiple lines of text               ║
║                                       ║
╚═══════════════════════════════════════╝
    ▼
  Shadow: 0 2px 8px rgba(0,0,0,0.1)
```

### Data Card with Image
```
╔═══════════════════════════════════════╗
║  ┌─────────────────┐  Title           ║
║  │                 │  Subtitle        ║
║  │    Image        │  Details         ║
║  │                 │  Status Badge    ║
║  └─────────────────┘                  ║
║  [Edit Button] [Delete Button]        ║
╚═══════════════════════════════════════╝
```

### Form Card
```
╔═══════════════════════════════════════╗
║  New Certification                    ║
║                                       ║
║  ┌─────────────────────────────────┐  ║
║  │ Certification Name              │  ║
║  └─────────────────────────────────┘  ║
║                                       ║
║  ┌─────────────────────────────────┐  ║
║  │ Issuing Organization            │  ║
║  └─────────────────────────────────┘  ║
║                                       ║
║  [Cancel]  [Save Certification]       ║
╚═══════════════════════════════════════╝
```

---

## 🎭 Animation Keyframes

### Slide Down (Menu Open)
```
Frame 0%:  opacity: 0
           max-height: 0
           
Frame 50%: opacity: 0.5
           max-height: 250px
           
Frame 100%: opacity: 1
            max-height: 500px

Duration: 0.2s ease-out
```

### Hover Expand
```
From:  padding-left: 16px

To:    padding-left: 24px
       color: #3498db
       background: #f5f7fa

Duration: 0.2s ease
```

### Scale on Click
```
From:  scale: 1
       box-shadow: none

To:    scale: 1.02
       box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2)

Duration: 0.2s ease
```

---

## 📱 Responsive Breakpoints

### Desktop (1920px)
```
┌──────────────────────────────────────────────────────────┐
│ [L] Title                    [Photo] [Menu]              │ 70px
├────────────┬──────────────────────────────────────────────┤
│            │  Content Area (Full Width - 240px sidebar)   │
│ Sidebar    │                                              │
│ 240px      │  • Comfortable spacing                       │
│            │  • Large touch targets                       │
│            │  • Full typography hierarchy                 │
│            │                                              │
└────────────┴──────────────────────────────────────────────┘
└──────────────────────────────────────────────────────────┘
```

### Tablet (768px)
```
┌─────────────────────────────────────────────────┐
│ [L] Title              [Photo] [Menu]           │ 70px
├────────┬───────────────────────────────────────┤
│        │  Content Area (Full Width - 180px)    │
│Sidebar │                                       │
│180px   │  • Adjusted spacing (16px padding)   │
│        │  • Optimized for touch               │
│        │                                       │
└────────┴───────────────────────────────────────┘
└─────────────────────────────────────────────────┘
```

### Mobile (375px)
```
┌────────────────────────────┐
│ [L] [Photo] [Menu]         │ 60px
├────────────────────────────┤
│  Content Area (Full)       │
│  • Sidebar Hidden          │
│  • Compact spacing (12px)  │
│  • Single column layout    │
│  • Vertical stacking       │
│  • Touch-friendly buttons  │
│                            │
└────────────────────────────┘
└────────────────────────────┘
```

---

## ✅ Design System Checklist

### Colors
- ✓ Primary blue: #3498db
- ✓ Primary dark: #2980b9
- ✓ Text primary: #2c3e50
- ✓ Text secondary: #7f8c8d
- ✓ Backgrounds: #f5f7fa, #f8f9fa, #ffffff
- ✓ Borders: #e0e6ed
- ✓ Status colors: Green, Red, Orange, Gray

### Typography
- ✓ Font family: Segoe UI
- ✓ H1: 32px/600
- ✓ H2: 18px/600
- ✓ H3: 16px/600
- ✓ Body: 14px/500
- ✓ Secondary: 13px/500
- ✓ Small: 12px/500

### Spacing
- ✓ Padding: 8px, 12px, 16px, 20px, 24px
- ✓ Gaps: 8px, 12px, 20px, 40px
- ✓ Header: 70px / 60px mobile
- ✓ Sidebar: 240px / 180px tablet / hidden mobile
- ✓ Footer: 80px

### Borders
- ✓ Radius: 4px, 8px, 12px, 20px
- ✓ Colors: #e0e6ed (light borders)
- ✓ Width: 1px (standard), 2px (focus)

### Shadows
- ✓ Soft: 0 2px 8px rgba(0,0,0,0.1)
- ✓ Medium: 0 4px 12px rgba(0,0,0,0.15)
- ✓ Header: soft shadow below
- ✓ Footer: soft shadow above

### Effects
- ✓ Transitions: 0.2s ease
- ✓ Hover effects: color + background changes
- ✓ Active states: border + highlight
- ✓ Animations: slide, fade, scale

---

## 🎯 Quick Reference

| Element | Color | Shadow | Radius | Padding |
|---------|-------|--------|--------|---------|
| Header | Gradient | 0 2px 8px | - | 0 24px |
| Sidebar | Gradient | Border | - | 12px |
| Card | #fff | 0 2px 8px | 12px | 24px |
| Button | #3498db | None | 8px | 12-16px |
| Input | #fff | Focus only | 4px | 12px |
| Footer | Gradient | 0 -2px 8px | - | 0 24px |

---

This visual reference guide ensures consistent implementation of the modern dashboard design system across the Risen One Consulting Employee Portal!

