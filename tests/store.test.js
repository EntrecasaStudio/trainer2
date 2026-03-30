import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock localStorage
const localStore = {};
const localStorageMock = {
  getItem: vi.fn(key => localStore[key] || null),
  setItem: vi.fn((key, value) => { localStore[key] = value; }),
  removeItem: vi.fn(key => { delete localStore[key]; }),
  clear: vi.fn(() => { Object.keys(localStore).forEach(k => delete localStore[k]); }),
};

vi.stubGlobal('localStorage', localStorageMock);

const { store } = await import('../src/store.js');

describe('Store', () => {
  beforeEach(() => {
    Object.keys(localStore).forEach(k => delete localStore[k]);
  });

  it('get/set works', () => {
    store.set('test_key', { a: 1 });
    expect(store.get('test_key')).toEqual({ a: 1 });
  });

  it('getAll returns empty array for missing key', () => {
    expect(store.getAll('nonexistent')).toEqual([]);
  });

  it('push adds to array', () => {
    store.push('test_arr', { id: '1', name: 'a' });
    store.push('test_arr', { id: '2', name: 'b' });
    expect(store.getAll('test_arr')).toHaveLength(2);
  });

  it('findById returns correct item', () => {
    store.set('test_items', [{ id: 'x', name: 'hello' }]);
    expect(store.findById('test_items', 'x')).toEqual({ id: 'x', name: 'hello' });
    expect(store.findById('test_items', 'y')).toBeNull();
  });

  it('offline: escritura encola con pendingSync:true', () => {
    const item = { id: '1', name: 'test', pendingSync: false };
    store.set('test_sync', [item]);
    store.markPendingSync('test_sync', '1');
    const updated = store.findById('test_sync', '1');
    expect(updated.pendingSync).toBe(true);
  });

  it('sync limpia pendingSync al reconectar', () => {
    store.set('test_sync2', [{ id: '1', pendingSync: true }]);
    store.clearPendingSync('test_sync2', '1');
    const updated = store.findById('test_sync2', '1');
    expect(updated.pendingSync).toBe(false);
  });

  it('filtro persiste en localStorage', () => {
    store.setFilterLugar(['SPORT_FITNESS', 'RIO']);
    expect(store.getFilterLugar()).toEqual(['SPORT_FITNESS', 'RIO']);
  });

  it('active user defaults to Lean', () => {
    expect(store.getActiveUser()).toBe('Lean');
  });
});
