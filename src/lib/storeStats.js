const DAY_MS = 24 * 60 * 60 * 1000;

export function countStoresCreatedSince(stores, since = Date.now() - DAY_MS) {
  if (!stores) return 0;
  return stores.filter((store) => new Date(store.create_time).getTime() > since).length;
}
