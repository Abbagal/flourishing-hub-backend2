import { env } from "../config/index.js";

const cacheStore = new Map();

const isExpired = (entry) => entry.expiresAt <= Date.now();

export const cache = {
  get(key) {
    const entry = cacheStore.get(key);

    if (!entry) {
      return null;
    }

    if (isExpired(entry)) {
      cacheStore.delete(key);
      return null;
    }

    return entry.value;
  },

  set(key, value, ttlSeconds = env.CACHE_TTL_SECONDS) {
    cacheStore.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000
    });
  },

  delete(key) {
    cacheStore.delete(key);
  },

  clear() {
    cacheStore.clear();
  }
};

