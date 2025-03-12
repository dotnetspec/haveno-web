import { describe, it, expect, beforeEach } from 'vitest';

// -- NOTE: These tests just check that localstorage is functioning correctly in this context
// There is no corresponding storage.js

describe('storage', () => {
    const key = 'secureMessage';
    const message = 'Sensitive bank details';

    beforeEach(() => {
        localStorage.clear(); // Reset storage before each test
        expect(localStorage.length).toBe(0); // Verify that localStorage is cleared
    });

    it('should store data in localStorage', () => {
        // Store data in localStorage
        localStorage.setItem(key, message);

        // Verify that the data is stored in localStorage
        const storedData = localStorage.getItem(key);
        
        expect(storedData).not.toBeNull();
        expect(storedData).toBe(message);
    });

    it('should retrieve data from localStorage', () => {
        // Store data in localStorage
        localStorage.setItem(key, message);

        // Retrieve the data from localStorage
        const storedData = localStorage.getItem(key);
      
        expect(storedData).not.toBeNull();
        expect(storedData).toBe(message);
    });

    it('should return null if no data is stored', () => {
        const storedData = localStorage.getItem(key);
        expect(storedData).toBeNull();
    });

    it('should remove data from localStorage', () => {
        // Store data in localStorage
        localStorage.setItem(key, message);

        // Remove the data from localStorage
        localStorage.removeItem(key);

        // Verify that the data is removed from localStorage
        const storedData = localStorage.getItem(key);
        expect(storedData).toBeNull();
    });

    it('should clear all data from localStorage', () => {
        // Store data in localStorage
        localStorage.setItem(key, message);
        localStorage.setItem('anotherKey', 'anotherValue');

        // Clear all data from localStorage
        localStorage.clear();

        // Verify that all data is cleared from localStorage
        expect(localStorage.getItem(key)).toBeNull();
        expect(localStorage.getItem('anotherKey')).toBeNull();
        expect(localStorage.length).toBe(0);
    });
});