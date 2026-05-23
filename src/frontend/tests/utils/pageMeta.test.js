import { describe, it, expect } from 'vitest';
import { getPageTitle } from '../../src/utils/pageMeta.js';

describe('page metadata', () => {
  it('returns route-specific browser titles', () => {
    expect(getPageTitle('/')).toBe('Medbook | Accueil');
    expect(getPageTitle('/booking')).toBe('Medbook | Prendre rendez-vous');
    expect(getPageTitle('/admin/doctors')).toBe('Medbook | Médecins');
  });

  it('falls back to the product name for unknown routes', () => {
    expect(getPageTitle('/unknown')).toBe('Medbook');
  });
});
