import {
  NormalizedDesignSystem,
  CoverageReport,
  CategoryCoverage,
  AuditReport,
  MissingSpecificationItem,
  ElementStatus,
} from './types';

interface ElementEvaluation {
  category: string;
  id: string;
  name: string;
  status: ElementStatus;
  inherited_from?: string;
  isInheritedValid?: boolean;
  missingDetails?: { field: string; suggestion: string; severity: 'critical' | 'warning' | 'info' }[];
}

/**
 * Mathematically calculates coverage and audits the normalized design system
 */
export function calculateCoverageAndAudit(spec: NormalizedDesignSystem): AuditReport {
  const evaluations: ElementEvaluation[] = [];

  // 1. Evaluate Foundations (Colors, Spacing, Radius, Borders, Shadows)
  const colorEntries = [
    { id: 'color.primary', name: 'Primary Brand Color', token: spec.colors.primary },
    { id: 'color.secondary', name: 'Secondary Color', token: spec.colors.secondary },
    { id: 'color.accent', name: 'Accent Color', token: spec.colors.accent },
    { id: 'color.background', name: 'Background Surface', token: spec.colors.background },
    { id: 'color.surface', name: 'Card Surface', token: spec.colors.surface },
    { id: 'color.surface_elevated', name: 'Elevated Surface', token: spec.colors.surface_elevated },
    { id: 'color.text_primary', name: 'Text Primary', token: spec.colors.text_primary },
    { id: 'color.text_secondary', name: 'Text Secondary', token: spec.colors.text_secondary },
    { id: 'color.text_muted', name: 'Text Muted', token: spec.colors.text_muted },
    { id: 'color.border', name: 'Border Color', token: spec.colors.border },
    { id: 'color.success', name: 'Success Color', token: spec.colors.success },
    { id: 'color.error', name: 'Error Color', token: spec.colors.error },
    { id: 'color.warning', name: 'Warning Color', token: spec.colors.warning },
    { id: 'color.info', name: 'Info Color', token: spec.colors.info },
  ];

  for (const c of colorEntries) {
    const missing: { field: string; suggestion: string; severity: 'critical' | 'warning' | 'info' }[] = [];
    if (spec.meta.supported_modes === 'both' && !c.token.dark_value && c.token.status === 'DEFINED') {
      missing.push({
        field: 'dark_value',
        suggestion: `Definir valor escuro (dark_value) para o token ${c.name} pois o sistema declara suporte a light e dark mode.`,
        severity: 'warning',
      });
    }
    if (!c.token.usage && c.token.status === 'DEFINED') {
      missing.push({
        field: 'usage',
        suggestion: `Adicionar diretriz de uso (usage) recomendada para ${c.name}.`,
        severity: 'info',
      });
    }

    evaluations.push({
      category: 'Foundations',
      id: c.id,
      name: c.name,
      status: c.token.status,
      missingDetails: missing,
    });
  }

  // Spacing & Radius in Foundations
  evaluations.push({ category: 'Foundations', id: 'spacing.base_unit', name: 'Spacing Base Unit', status: spec.spacing.status });
  evaluations.push({ category: 'Foundations', id: 'radius.md', name: 'Border Radius Scale', status: spec.radius.status });
  evaluations.push({ category: 'Foundations', id: 'shadows.elevation', name: 'Elevation & Shadows', status: spec.shadows.status });

  // 2. Evaluate Typography
  const typeEntries = [
    { id: 'type.display', name: 'Display Hero', token: spec.typography.display },
    { id: 'type.h1', name: 'Heading 1', token: spec.typography.h1 },
    { id: 'type.h2', name: 'Heading 2', token: spec.typography.h2 },
    { id: 'type.h3', name: 'Heading 3', token: spec.typography.h3 },
    { id: 'type.section_title', name: 'Section Title', token: spec.typography.section_title },
    { id: 'type.card_title', name: 'Card Title', token: spec.typography.card_title },
    { id: 'type.body', name: 'Body Text', token: spec.typography.body },
    { id: 'type.secondary_body', name: 'Secondary Body', token: spec.typography.secondary_body },
    { id: 'type.caption', name: 'Caption', token: spec.typography.caption },
    { id: 'type.label', name: 'Label', token: spec.typography.label },
    { id: 'type.button', name: 'Button Label', token: spec.typography.button },
    { id: 'type.price', name: 'Price Tag', token: spec.typography.price },
    { id: 'type.metadata', name: 'Metadata Code', token: spec.typography.metadata },
  ];

  for (const t of typeEntries) {
    const missing: { field: string; suggestion: string; severity: 'critical' | 'warning' | 'info' }[] = [];
    if (!t.token.mobile_size && t.token.status === 'DEFINED' && (t.id === 'type.display' || t.id === 'type.h1')) {
      missing.push({
        field: 'mobile_size',
        suggestion: `Especificar mobile_size para ${t.name} para evitar overflow em telas estreitas.`,
        severity: 'warning',
      });
    }

    evaluations.push({
      category: 'Typography',
      id: t.id,
      name: t.name,
      status: t.token.status,
      missingDetails: missing,
    });
  }

  // 3. Evaluate Components
  const componentKeys = Object.keys(spec.components);
  for (const key of componentKeys) {
    const comp = spec.components[key];
    const missing: { field: string; suggestion: string; severity: 'critical' | 'warning' | 'info' }[] = [];

    if (comp.status === 'DEFINED') {
      // Check states
      if (comp.category === 'button') {
        if (!comp.states.hover) missing.push({ field: 'hover_state', suggestion: 'Definir feedback de hover para o botão.', severity: 'warning' });
        if (!comp.states.focus) missing.push({ field: 'focus_state', suggestion: 'Definir anel de foco (focus ring) para acessibilidade do teclado.', severity: 'critical' });
        if (!comp.states.disabled) missing.push({ field: 'disabled_state', suggestion: 'Definir aparência e cursor para o estado desabilitado.', severity: 'warning' });
      } else if (comp.category === 'input') {
        if (!comp.states.focus) missing.push({ field: 'focus_state', suggestion: 'Definir borda/shadow de foco para inputs.', severity: 'critical' });
        if (!comp.states.error) missing.push({ field: 'error_state', suggestion: 'Definir estado visual de validação/erro para o input.', severity: 'warning' });
      }
    } else if (comp.status === 'NOT_DEFINED') {
      missing.push({
        field: 'component_spec',
        suggestion: `Componente ${comp.name} (${comp.id}) não possui especificação. Definir no markdown ou declarar NOT_APPLICABLE.`,
        severity: 'warning',
      });
    }

    const isInheritedValid = comp.status === 'INHERITED' ? !!(comp.inherited_from && spec.components[comp.inherited_from]) : undefined;

    evaluations.push({
      category: 'Components',
      id: comp.id,
      name: comp.name,
      status: comp.status,
      inherited_from: comp.inherited_from,
      isInheritedValid,
      missingDetails: missing,
    });
  }

  // 4. Evaluate Patterns
  const patternKeys = Object.keys(spec.patterns);
  for (const key of patternKeys) {
    const pat = spec.patterns[key];
    evaluations.push({
      category: 'Patterns',
      id: pat.id,
      name: pat.name,
      status: pat.status,
    });
  }

  // 5. Evaluate Interaction & States
  evaluations.push({
    category: 'Interaction',
    id: 'state.focus_management',
    name: 'Keyboard Focus Management',
    status: spec.accessibility.keyboard_navigable ? 'DEFINED' : 'NOT_DEFINED',
  });
  evaluations.push({
    category: 'Interaction',
    id: 'state.hover_system',
    name: 'Micro-interaction Feedback',
    status: 'DEFINED',
  });

  // 6. Evaluate Responsive
  evaluations.push({
    category: 'Responsive',
    id: 'responsive.breakpoints',
    name: 'Breakpoints (Mobile/Tablet/Desktop)',
    status: spec.breakpoints.status,
  });
  evaluations.push({
    category: 'Responsive',
    id: 'responsive.containers',
    name: 'Max Width Containers',
    status: spec.containers.status,
  });

  // 7. Evaluate Accessibility
  evaluations.push({
    category: 'Accessibility',
    id: 'a11y.contrast',
    name: 'Color Contrast Target (WCAG)',
    status: spec.accessibility.status,
  });
  evaluations.push({
    category: 'Accessibility',
    id: 'a11y.screen_reader',
    name: 'Screen Reader Support & ARIA',
    status: spec.accessibility.screen_reader_tested ? 'DEFINED' : 'NOT_DEFINED',
  });

  // 8. Evaluate Motion
  evaluations.push({
    category: 'Motion',
    id: 'motion.durations',
    name: 'Animation Durations & Easing',
    status: spec.motion.status,
  });
  evaluations.push({
    category: 'Motion',
    id: 'motion.reduced_motion',
    name: 'Reduced Motion Preference',
    status: spec.motion.reduced_motion_rule ? 'DEFINED' : 'NOT_DEFINED',
  });

  // Compute Categories Breakdown
  const categoriesList = ['Foundations', 'Typography', 'Components', 'Patterns', 'Interaction', 'Responsive', 'Accessibility', 'Motion'];
  const categoryCoverages: CategoryCoverage[] = [];

  let overallDefined = 0;
  let overallInherited = 0;
  let overallNotDefined = 0;
  let overallNotApplicable = 0;
  let overallTotal = 0;

  const missingSpecs: MissingSpecificationItem[] = [];
  const warnings: string[] = [];

  for (const catName of categoriesList) {
    const items = evaluations.filter((e) => e.category === catName);
    let defined = 0;
    let inherited = 0;
    let notDefined = 0;
    let notApplicable = 0;

    for (const item of items) {
      if (item.status === 'DEFINED') defined++;
      else if (item.status === 'INHERITED' && item.isInheritedValid !== false) inherited++;
      else if (item.status === 'NOT_APPLICABLE') notApplicable++;
      else notDefined++;

      if (item.missingDetails) {
        for (const m of item.missingDetails) {
          missingSpecs.push({
            section: catName,
            elementId: item.id,
            name: item.name,
            severity: m.severity,
            missingField: m.field,
            suggestion: m.suggestion,
          });
        }
      }
    }

    const total = items.length;
    const effectiveTotal = Math.max(1, total - notApplicable);
    const score = Math.min(100, Math.round(((defined + inherited) / effectiveTotal) * 100));

    categoryCoverages.push({
      category: catName,
      defined,
      inherited,
      not_defined: notDefined,
      not_applicable: notApplicable,
      total,
      effectiveTotal,
      percentage: score,
    });

    overallDefined += defined;
    overallInherited += inherited;
    overallNotDefined += notDefined;
    overallNotApplicable += notApplicable;
    overallTotal += total;
  }

  const overallEffective = Math.max(1, overallTotal - overallNotApplicable);
  const overallPercentage = Math.min(100, Math.round(((overallDefined + overallInherited) / overallEffective) * 100));

  const coverage: CoverageReport = {
    overallPercentage,
    totalDefined: overallDefined,
    totalInherited: overallInherited,
    totalNotDefined: overallNotDefined,
    totalNotApplicable: overallNotApplicable,
    totalSpecs: overallTotal,
    categories: categoryCoverages,
  };

  return {
    timestamp: new Date().toISOString(),
    specName: spec.meta.name,
    specVersion: spec.meta.spec_version,
    coverage,
    missingSpecifications: missingSpecs,
    warnings,
    inconsistencies: [],
    passedTests: overallDefined + overallInherited,
    totalTests: overallEffective,
  };
}
