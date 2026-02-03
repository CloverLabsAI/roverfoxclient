/* global localStorage */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function exportLocalStorage() {
  const storageData = [];

  // Iterate through all localStorage items
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key !== null) {
      const value = localStorage.getItem(key);
      if (value !== null) {
        storageData.push({
          name: key,
          value: value,
        });
      }
    }
  }

  // Sort by name for consistent output
  storageData.sort((a, b) => a.name.localeCompare(b.name));

  return storageData;
}
