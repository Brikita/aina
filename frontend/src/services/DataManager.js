class DataManager {
  constructor() {
    this.cache = {};
    this.loading = {};
    this.MAX_CACHE_SIZE = 5;
    this.cacheOrder = [];
  }

  has(key) {
    return this.cache.hasOwnProperty(key);
  }

  get(key) {
    if (this.has(key)) {
      this.cacheOrder = this.cacheOrder.filter(k => k !== key);
      this.cacheOrder.unshift(key);
      return this.cache[key];
    }
    return null;
  }

  set(key, data) {
    if (this.cacheOrder.length >= this.MAX_CACHE_SIZE) {
      const oldestKey = this.cacheOrder.pop();
      delete this.cache[oldestKey];
    }
    
    this.cache[key] = data;
    this.cacheOrder = this.cacheOrder.filter(k => k !== key);
    this.cacheOrder.unshift(key);
  }

  clear() {
    this.cache = {};
    this.cacheOrder = [];
  }

  size() {
    return this.cacheOrder.length;
  }

  isLoading(key) {
    return this.loading.hasOwnProperty(key) && this.loading[key] === true;
  }

  setLoading(key, status) {
    this.loading[key] = status;
  }

  getStats() {
    return {
      size: this.size(),
      keys: this.cacheOrder,
      maxSize: this.MAX_CACHE_SIZE,
    };
  }
}

const dataManager = new DataManager();
export default dataManager;