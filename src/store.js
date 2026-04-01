// store.js — localStorage as primary source of truth, Firestore sync
import { queueSync } from './js/services/sync.js';

const KEYS = {
  rutinas: 'gym_rutinas',
  plan: 'gym_plan_v2',
  overrides: 'gym_day_overrides',
  sesiones: 'gym_sesiones',
  progresion: 'gym_ejercicio_progresion',
  theme: 'gym_theme',
  version: 'gym_version',
  filterLugar: 'gym_filter_lugar',
  activeUser: 'gym_active_user',
};

export const store = {
  get(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
    this._notify(key, value);
    queueSync(key);
  },

  // Array helpers
  getAll(key) {
    return this.get(key) || [];
  },

  push(key, item) {
    const arr = this.getAll(key);
    arr.push(item);
    this.set(key, arr);
    return item;
  },

  update(key, id, updates) {
    const arr = this.getAll(key);
    const idx = arr.findIndex(item => item.id === id);
    if (idx === -1) return null;
    arr[idx] = { ...arr[idx], ...updates, updatedAt: new Date().toISOString() };
    this.set(key, arr);
    return arr[idx];
  },

  remove(key, id) {
    const arr = this.getAll(key);
    this.set(key, arr.filter(item => item.id !== id));
  },

  findById(key, id) {
    return this.getAll(key).find(item => item.id === id) || null;
  },

  // Object helpers (for plan, overrides, progresion)
  getObj(key) {
    return this.get(key) || {};
  },

  setObj(key, value) {
    this.set(key, value);
  },

  mergeObj(key, partial) {
    const obj = this.getObj(key);
    this.set(key, { ...obj, ...partial });
  },

  // Active user
  getActiveUser() {
    return this.get(KEYS.activeUser) || 'Lean';
  },

  setActiveUser(user) {
    this.set(KEYS.activeUser, user);
  },

  // Filter lugar
  getFilterLugar() {
    return this.get(KEYS.filterLugar) || ['SPORT_FITNESS', 'RIO', 'URUGUAY'];
  },

  setFilterLugar(places) {
    this.set(KEYS.filterLugar, places);
  },

  // Progresion
  getProgresion(ejercicio, usuario) {
    const prog = this.getObj(KEYS.progresion);
    return prog[ejercicio]?.[usuario] || null;
  },

  setProgresion(ejercicio, usuario, data) {
    const prog = this.getObj(KEYS.progresion);
    if (!prog[ejercicio]) prog[ejercicio] = {};
    prog[ejercicio][usuario] = { ...data, lastDate: new Date().toISOString().slice(0, 10) };
    this.set(KEYS.progresion, prog);
  },

  // Sync queue
  markPendingSync(key, id) {
    this.update(key, id, { pendingSync: true });
  },

  getPendingSync(key) {
    return this.getAll(key).filter(item => item.pendingSync);
  },

  clearPendingSync(key, id) {
    this.update(key, id, { pendingSync: false });
  },

  // Listeners
  _listeners: {},

  on(key, fn) {
    if (!this._listeners[key]) this._listeners[key] = [];
    this._listeners[key].push(fn);
    return () => {
      this._listeners[key] = this._listeners[key].filter(f => f !== fn);
    };
  },

  _notify(key, value) {
    (this._listeners[key] || []).forEach(fn => fn(value));
  },

  // Version
  getVersion() {
    return this.get(KEYS.version);
  },

  setVersion(v) {
    this.set(KEYS.version, v);
  },

  KEYS,
};
