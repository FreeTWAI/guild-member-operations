import {test} from 'node:test';
import assert from 'node:assert/strict';
import {build} from '../scripts/build.mjs';

test('build performance is within limits', async () => {
  const root = process.cwd();
  const iterations = 100;

  // Warmup
  await build(root);

  const startMemory = process.memoryUsage().heapUsed;
  const start = performance.now();

  for (let i = 0; i < iterations; i++) {
    await build(root);
  }

  const end = performance.now();
  const endMemory = process.memoryUsage().heapUsed;

  const averageTime = (end - start) / iterations;
  const memoryUsed = endMemory - startMemory;

  assert.ok(averageTime < 50, `Average time per build should be < 50ms, but was ${averageTime}ms`);

  // A crude memory check. A large memory spike could indicate a leak.
  assert.ok(memoryUsed < 50 * 1024 * 1024, `Memory increased by more than 50MB during ${iterations} iterations`);
});
