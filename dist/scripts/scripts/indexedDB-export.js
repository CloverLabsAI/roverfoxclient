/* global indexedDB, console */
async function _exportIndexedDB() {
  const databases = [];

  // Get all database names
  const dbNames = await indexedDB.databases();

  for (const dbInfo of dbNames) {
    const dbName = dbInfo.name;
    if (!dbName) continue;

    try {
      // Open database
      const db = await new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });

      const dbData = {
        name: dbName,
        version: db.version,
        stores: [],
      };

      // Get all object stores
      for (const storeName of db.objectStoreNames) {
        const storeData = {
          name: storeName,
          autoIncrement: false,
          records: [],
          indexes: [],
        };

        // Start transaction to read store data
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);

        // Get store metadata
        storeData.autoIncrement = store.autoIncrement;
        if (store.keyPath) {
          if (Array.isArray(store.keyPath)) {
            storeData.keyPathArray = store.keyPath;
          } else {
            storeData.keyPathArray = [store.keyPath];
          }
        }

        // Get indexes
        for (const indexName of store.indexNames) {
          const index = store.index(indexName);
          storeData.indexes.push({
            name: indexName,
            keyPath: index.keyPath,
            multiEntry: index.multiEntry,
            unique: index.unique,
          });
        }

        // Get all records using cursor for better key-value pairing
        const recordsWithKeys = await new Promise((resolve, reject) => {
          const results = [];
          const request = store.openCursor();

          request.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
              results.push({
                key: cursor.key,
                value: cursor.value,
              });
              cursor.continue();
            } else {
              resolve(results);
            }
          };

          request.onerror = () => reject(request.error);
        });

        // Process records - ALWAYS use simple format like first storage state
        for (const { key, value } of recordsWithKeys) {
          const recordEntry = {};

          // Handle different store patterns
          if (!storeData.keyPathArray || storeData.keyPathArray.length === 0) {
            // Key-value stores (like keyval)
            recordEntry.key = key;
            recordEntry.value = cleanValue(value);
          } else {
            // Stores with keyPath - always use simple value format
            recordEntry.value = cleanValue(value);
          }

          storeData.records.push(recordEntry);
        }

        dbData.stores.push(storeData);
      }

      databases.push(dbData);
      db.close();
    } catch (error) {
      console.error(`Error processing database ${dbName}:`, error);
    }
  }

  return databases;
}

// Helper function to clean and standardize values (remove any encoding artifacts)
function cleanValue(value) {
  if (value === null || value === undefined) {
    return value;
  }

  // Handle primitive types
  if (typeof value !== 'object') {
    return value;
  }

  // Handle arrays
  if (Array.isArray(value)) {
    return value.map((item) => cleanValue(item));
  }

  // Handle objects - create clean copy
  const cleaned = {};
  for (const [key, val] of Object.entries(value)) {
    cleaned[key] = cleanValue(val);
  }

  return cleaned;
}

// exportIndexedDB is used via page.evaluate
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function exportIndexedDB() {
  const databases = await _exportIndexedDB();

  return databases.map((db) => ({
    name: db.name,
    version: db.version,
    stores: db.stores.map((store) => ({
      name: store.name,
      autoIncrement: store.autoIncrement,
      keyPathArray: store.keyPathArray,
      records: store.records,
      indexes: store.indexes,
    })),
  }));
}
