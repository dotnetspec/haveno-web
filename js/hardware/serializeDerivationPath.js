// src/hardware/serializeDerivationPath.js
export function serializeDerivationPath(path) {
    const buffer = new ArrayBuffer(1 + path.length * 4); // 1 byte for path length + 4 bytes for each path element
    const dataView = new DataView(buffer);
    dataView.setUint8(0, path.length); // First byte: path length
  
    path.forEach((element, index) => {
      dataView.setUint32(1 + index * 4, element);
    });
  
    return new Uint8Array(buffer);
  }