import type { SC2KCompressedChunkName } from "../../../declaration/sc2ktojson";

/**
 * Decompress SC2K chunk data.
 * 
 * See SC2K specific RLE compression algorithm.
 * @see {@link https://djm.cc/simcity-2000-info.txt#:~:text=The%20data%20in%20most%20SimCity%20segments%20is%20compressed%20using%20a%20form%20of%20run%2Dlength%20encoding%2E%20When%20this%20is%20done%2C%20the%20data%20in%20the%20segment%20consists%20of%20a%20series%20of%20chunks%20of%20two%20kinds%2E}
 * @see {@link https://github.com/OpenCity2k/SC2k-docs/blob/master/sc2%20file%20spec.md#compression}
 */
export function decompressChunkData(chunkData: Uint8Array, chunkName: SC2KCompressedChunkName): Uint8Array {
  const decompressedChunkSize: Record<SC2KCompressedChunkName, number> = {
    MISC: 4800,
    XTER: 16384,
    XBLD: 16384,
    XZON: 16384,
    XUND: 16384,
    XTXT: 16384,
    XLAB: 6400,
    XMIC: 1200,
    XTHG: 480,
    XBIT: 16384,
    XTRF: 4096,
    XPLT: 4096,
    XVAL: 4096,
    XCRM: 4096,
    XPLC: 1024,
    XFIR: 1024,
    XPOP: 1024,
    XROG: 1024,
    XGRP: 3328,
  }

  const decompressedChunkData = new Uint8Array(decompressedChunkSize[chunkName]);
  for (let i = 0, lastOffset = 0, length = chunkData.byteLength; i < length;) {
    const currentValue = chunkData[i];
    if (currentValue > 128) {
      const length = currentValue - 127;
      ++i;
      decompressedChunkData.fill(chunkData[i], lastOffset, lastOffset + length);
      lastOffset += length;
      ++i;
    }
    else {
      const length = currentValue;
      i++;
      const data = chunkData.slice(i, i + length);
      decompressedChunkData.set(data, lastOffset);
      lastOffset += length;
      i += length;
    }
  }
  return decompressedChunkData;
}
