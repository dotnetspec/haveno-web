import { describe, expect, test } from 'vitest';
import { sum } from './xmrHardwareInterop';

describe('sum function', () => {
  test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
  });
  
  test('adds 1 + 2 not to equal 4', () => {
    expect(sum(1, 2)).not.toBe(4);
  });
});
