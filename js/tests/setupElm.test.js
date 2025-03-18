import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { initializeElmApp } from '../setupElm.mjs';

describe('initializeElmApp', () => {
    let originalGetElementById;
    let originalConsoleLog;
    let mockElm;
    let mockSubscribe;

    beforeEach(() => {
        // Mock document.getElementById
        originalGetElementById = document.getElementById;
        document.getElementById = vi.fn().mockReturnValue({
            id: 'elm',
        });

        // Mock console.log
        originalConsoleLog = console.log;
        console.log = vi.fn();

        // Mock Elm object
        mockSubscribe = vi.fn();
        mockElm = {
            Main: {
                init: vi.fn().mockReturnValue({
                    ports: {
                        jsInterop: {
                            subscribe: mockSubscribe,
                        },
                        jsInteropFromAccounts: {
                            subscribe: vi.fn(),
                        },
                    },
                }),
            },
        };
    });

    afterEach(() => {
        // Restore original document.getElementById and console.log
        document.getElementById = originalGetElementById;
        console.log = originalConsoleLog;
    });

    it('should initialize the Elm app with the correct flags', () => {
        const jsonUrl = JSON.stringify('http://localhost');
        const eapp = initializeElmApp(mockElm, jsonUrl);

        expect(document.getElementById).toHaveBeenCalledWith('elm');
        expect(mockElm.Main.init).toHaveBeenCalledWith({
            node: { id: 'elm' },
            flags: jsonUrl,
        });
        expect(console.log).toHaveBeenCalledWith('elm init:', eapp);
        expect(eapp).toEqual({
            ports: {
                jsInterop: {
                    subscribe: expect.any(Function),
                },
                jsInteropFromAccounts: {
                    subscribe: expect.any(Function),
                },
            },
        });
    });
});