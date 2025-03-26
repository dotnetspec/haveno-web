import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { initializeElmApp } from '../setupElm.mjs';

describe('initializeElmApp', () => {
    let originalGetElementById;
    let originalConsoleLog;
    let mockElm;
    let mockSubscribe;
    let mockSend;

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
        mockSend = vi.fn();
        mockElm = {
            Main: {
                init: vi.fn().mockReturnValue({
                    ports: {
                        receiveMsgsFromJs: {
                            send: mockSend,
                        },
                        msgFromAccounts: {
                            subscribe: mockSubscribe,
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
        expect(console.log).toHaveBeenCalledWith('Elm app initialized:', eapp);
        expect(eapp).toEqual({
            ports: {
                receiveMsgsFromJs: {
                    send: expect.any(Function),
                },
                msgFromAccounts: {
                    subscribe: expect.any(Function),
                },
            },
        });
    });

    it('should ensure receiveMsgsFromJs.send is a function', () => {
        const jsonUrl = JSON.stringify('http://localhost');
        const eapp = initializeElmApp(mockElm, jsonUrl);

        expect(eapp.ports).toBeDefined();
        expect(eapp.ports.receiveMsgsFromJs).toBeDefined();
        expect(typeof eapp.ports.receiveMsgsFromJs.send).toBe('function');
    });
});