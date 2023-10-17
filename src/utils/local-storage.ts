export function setLocalStorage(key: string, value: string) {
    localStorage.setItem(key, value);
}

export function getLocalStorageData<T>(key: string): T | null {
    const localData = localStorage.getItem(key);
    if (!localData) return null;
    return JSON.parse(localData);
}