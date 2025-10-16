// Custom JavaScript for Freaky Furniture API Swagger UI
(function() {
    // Add custom footer
    const footer = document.createElement('div');
    footer.className = 'footer';
    footer.innerHTML = '<p><strong>Freaky Furniture API</strong> - Backend-2 Course VG Project</p><p>Built with ASP.NET Core, Entity Framework, and JWT Authentication</p>';
    document.body.appendChild(footer);

    // Enhance authentication section
    const authContainer = document.querySelector('.auth-container');
    if (authContainer) {
        authContainer.classList.add('enhanced-auth');
    }

    // Add loading indicators for better UX
    const tryItOutButtons = document.querySelectorAll('.try-out__btn');
    tryItOutButtons.forEach(button => {
        button.addEventListener('click', function() {
            const executeBtn = this.closest('.opblock').querySelector('.execute');
            if (executeBtn) {
                executeBtn.innerHTML = '<span>Executing...</span>';
                executeBtn.disabled = true;

                // Reset after 5 seconds
                setTimeout(() => {
                    executeBtn.innerHTML = 'Execute';
                    executeBtn.disabled = false;
                }, 5000);
            }
        });
    });

    // Add response time tracking
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        const startTime = Date.now();
        return originalFetch.apply(this, args).then(response => {
            const endTime = Date.now();
            const duration = endTime - startTime;

            // Add duration to response headers display
            setTimeout(() => {
                const responseHeaders = document.querySelector('.responses .response .response-headers');
                if (responseHeaders) {
                    const durationDiv = document.createElement('div');
                    durationDiv.innerHTML = `<strong>Response Time:</strong> ${duration}ms`;
                    durationDiv.style.cssText = 'background: #e8f5e8; padding: 8px; border-radius: 4px; margin: 8px 0; font-family: monospace;';
                    responseHeaders.appendChild(durationDiv);
                }
            }, 100);

            return response;
        });
    };

    // Auto-expand successful responses
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('execute')) {
            setTimeout(() => {
                const successResponses = document.querySelectorAll('.responses .response-200');
                successResponses.forEach(response => {
                    const toggle = response.querySelector('.response-col_status');
                    if (toggle && !response.classList.contains('response_open')) {
                        toggle.click();
                    }
                });
            }, 2000);
        }
    });

    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl+Enter to execute current operation
        if (e.ctrlKey && e.key === 'Enter') {
            const activeExecuteBtn = document.querySelector('.opblock.is-open .execute:not(:disabled)');
            if (activeExecuteBtn) {
                activeExecuteBtn.click();
            }
        }

        // Ctrl+/ to focus search
        if (e.ctrlKey && e.key === '/') {
            const searchInput = document.querySelector('.swagger-ui .download-url-wrapper input');
            if (searchInput) {
                searchInput.focus();
                e.preventDefault();
            }
        }
    });

    console.log('🚀 Freaky Furniture API Swagger UI Enhanced!');
})();