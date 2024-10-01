import { describe, expect, test } from 'vitest';

import { serializeDerivationPath } from './serializeDerivationPath.js';

describe('serializeDerivationPath function', () => {
  test('should serialize the derivation path correctly', () => {
      const path = [0x8000002c, 0x80000080, 0x00000000, 0x00000000];
      const expected = new Uint8Array([
          4, // Path length
          0x80, 0x00, 0x00, 0x2c, // 44'
          0x80, 0x00, 0x00, 0x80, // 128'
          0x00, 0x00, 0x00, 0x00, // 0
          0x00, 0x00, 0x00, 0x00  // 0
      ]);

      expect(serializeDerivationPath(path)).toEqual(expected);
  });

  

  test('serializeDerivationPath should know if the path is incorrect the derivation path correctly', () => {
    const path = [0x8000002c, 0x80000080, 0x80000000];
    const expected = new Uint8Array([
      3, // Path length
      0x80, 0x00, 0x00, 0x2c, // 44'
      0x80, 0x00, 0x00, 0x00, // delibrately incorrect
      0x80, 0x00, 0x00, 0x00  // 0'
    ]);
  
    expect(serializeDerivationPath(path)).not.toEqual(expected);
  });
});



