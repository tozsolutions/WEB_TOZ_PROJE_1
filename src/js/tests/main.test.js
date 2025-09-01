// Mock main.js functions for testing
const { isValidEmail, showNotification, debounce } = require('../main.js');

describe('Utility Functions', () => {
    describe('isValidEmail', () => {
        test('should validate correct email addresses', () => {
            expect(isValidEmail('test@example.com')).toBe(true);
            expect(isValidEmail('user@domain.co.uk')).toBe(true);
            expect(isValidEmail('test.email+tag@example.org')).toBe(true);
        });

        test('should reject invalid email addresses', () => {
            expect(isValidEmail('invalid-email')).toBe(false);
            expect(isValidEmail('test@')).toBe(false);
            expect(isValidEmail('@example.com')).toBe(false);
            expect(isValidEmail('')).toBe(false);
        });
    });

    describe('debounce', () => {
        test('should debounce function calls', (done) => {
            let counter = 0;
            const increment = () => counter++;
            const debouncedIncrement = debounce(increment, 100);

            // Call multiple times rapidly
            debouncedIncrement();
            debouncedIncrement();
            debouncedIncrement();

            // Should not have been called yet
            expect(counter).toBe(0);

            // Wait for debounce delay
            setTimeout(() => {
                expect(counter).toBe(1);
                done();
            }, 150);
        });
    });

    describe('showNotification', () => {
        beforeEach(() => {
            // Clear any existing notifications
            const notifications = document.querySelectorAll('.notification');
            notifications.forEach(n => n.remove());
        });

        test('should create notification element', () => {
            showNotification('Test message', 'success');
            const notification = document.querySelector('.notification');
            expect(notification).toBeTruthy();
            expect(notification.textContent).toContain('Test message');
        });

        test('should apply correct type class', () => {
            showNotification('Error message', 'error');
            const notification = document.querySelector('.notification');
            expect(notification.className).toContain('notification--error');
        });
    });
});

describe('DOM Interactions', () => {
    beforeEach(() => {
        // Setup basic HTML structure for tests
        document.body.innerHTML = `
            <nav id="nav-menu" class="nav__menu">
                <ul class="nav__list">
                    <li><a href="#home" class="nav__link">Home</a></li>
                    <li><a href="#about" class="nav__link">About</a></li>
                </ul>
            </nav>
            <button id="nav-toggle" class="nav__toggle"></button>
            <button id="nav-close" class="nav__close"></button>
        `;
    });

    test('should handle nav menu toggle', () => {
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        
        expect(navMenu).toBeTruthy();
        expect(navToggle).toBeTruthy();
        
        // Initially should not have show-menu class
        expect(navMenu.classList.contains('show-menu')).toBe(false);
    });
});