import { describe, it, expect } from 'vitest';
import { render, version } from '../src/index';

describe('core API', () => {
  it('version should be a valid semver string', () => {
    expect(version).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it('render returns a string', () => {
    expect(typeof render()).toBe('string');
  });
});