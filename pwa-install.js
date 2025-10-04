// PWA Installation Logic
class PWAInstaller {
    constructor() {
        this.deferredPrompt = null;
        this.isInstalled = false;
        this.init();
    }

    init() {
        // Check if already installed
        this.checkInstallStatus();

        // Listen for install prompt
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('PWA: Install prompt available');
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallPrompt();
        });

        // Listen for app installed
        window.addEventListener('appinstalled', () => {
            console.log('PWA: App was installed');
            this.isInstalled = true;
            this.hideInstallPrompt();
            this.showToast('Ứng dụng đã được cài đặt thành công!', 'success');
        });

        // Bind install button
        this.bindInstallButton();
    }

    checkInstallStatus() {
        // Check if running in standalone mode (PWA installed)
        if (window.matchMedia('(display-mode: standalone)').matches) {
            this.isInstalled = true;
            console.log('PWA: Running in standalone mode');
            return;
        }

        // Check if launched from home screen
        if (window.navigator.standalone === true) {
            this.isInstalled = true;
            console.log('PWA: Running from home screen');
            return;
        }

        // Check if service worker is supported
        if (!('serviceWorker' in navigator)) {
            console.log('PWA: Service Worker not supported');
            return;
        }

        console.log('PWA: Not installed, can show install prompt');
    }

    showInstallPrompt() {
        if (this.isInstalled) return;

        const prompt = document.getElementById('pwa-prompt');
        if (prompt) {
            prompt.style.display = 'block';

            // Auto-hide after 10 seconds if not interacted
            setTimeout(() => {
                if (prompt.style.display === 'block') {
                    this.hideInstallPrompt();
                }
            }, 10000);
        }
    }

    hideInstallPrompt() {
        const prompt = document.getElementById('pwa-prompt');
        if (prompt) {
            prompt.style.display = 'none';
        }
    }

    bindInstallButton() {
        const installBtn = document.getElementById('pwa-install');
        const dismissBtn = document.getElementById('pwa-dismiss');

        if (installBtn) {
            installBtn.addEventListener('click', () => {
                this.installApp();
            });
        }

        if (dismissBtn) {
            dismissBtn.addEventListener('click', () => {
                this.dismissInstall();
            });
        }
    }

    async installApp() {
        if (!this.deferredPrompt) {
            console.log('PWA: No install prompt available');
            return;
        }

        try {
            // Show install prompt
            this.deferredPrompt.prompt();

            // Wait for user response
            const { outcome } = await this.deferredPrompt.userChoice;

            console.log('PWA: Install prompt result:', outcome);

            if (outcome === 'accepted') {
                console.log('PWA: User accepted install');
                this.showToast('Đang cài đặt ứng dụng...', 'info');
            } else {
                console.log('PWA: User dismissed install');
                this.showToast('Bạn có thể cài đặt ứng dụng bất kỳ lúc nào từ menu trình duyệt', 'info');
            }

        } catch (error) {
            console.error('PWA: Install failed:', error);
            this.showToast('Không thể cài đặt ứng dụng. Vui lòng thử lại sau.', 'error');
        }

        // Clear the prompt
        this.deferredPrompt = null;
        this.hideInstallPrompt();
    }

    dismissInstall() {
        console.log('PWA: User dismissed install prompt');
        this.hideInstallPrompt();

        // Remember dismissal (for current session)
        sessionStorage.setItem('pwa-install-dismissed', 'true');
    }

    // Check if user previously dismissed install prompt
    isDismissed() {
        return sessionStorage.getItem('pwa-install-dismissed') === 'true';
    }

    // Show install prompt manually (for menu option)
    showManualInstallPrompt() {
        if (this.isInstalled) {
            this.showToast('Ứng dụng đã được cài đặt!', 'info');
            return;
        }

        if (this.deferredPrompt) {
            this.showInstallPrompt();
        } else {
            this.showToast('Để cài đặt ứng dụng, vui lòng sử dụng menu "Thêm vào màn hình chính" trong trình duyệt của bạn.', 'info');
        }
    }

    // Utility function to show toast (assuming it exists)
    showToast(message, type = 'info') {
        if (typeof showToast === 'function') {
            showToast(message, type);
        } else {
            console.log(`PWA Toast [${type}]: ${message}`);
        }
    }

    // Get install stats
    getInstallInfo() {
        return {
            isInstalled: this.isInstalled,
            canInstall: !!this.deferredPrompt,
            isDismissed: this.isDismissed(),
            isSupported: 'serviceWorker' in navigator
        };
    }

    // Handle shortcuts from manifest
    handleShortcuts() {
        const urlParams = new URLSearchParams(window.location.search);
        const shortcut = urlParams.get('shortcut');

        if (shortcut && typeof financeManager !== 'undefined') {
            switch (shortcut) {
                case 'dashboard':
                    financeManager.showSection('dashboard');
                    break;
                case 'add-loan':
                    // Show a menu to select loan type
                    this.showLoanTypeSelector();
                    break;
                case 'schedule':
                    financeManager.showSection('payment-schedule');
                    break;
                default:
                    console.log('PWA: Unknown shortcut:', shortcut);
            }
        }
    }

    showLoanTypeSelector() {
        if (typeof showToast === 'function') {
            showToast('Chọn loại vay từ menu bên trái', 'info');
        }

        // Highlight menu items briefly
        const menuItems = document.querySelectorAll('[data-section*="loan"], [data-section="installments"], [data-section="overdrafts"]');
        menuItems.forEach(item => {
            item.style.background = 'rgba(59, 130, 246, 0.2)';
            setTimeout(() => {
                item.style.background = '';
            }, 2000);
        });
    }
}

// Initialize PWA installer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.pwaInstaller = new PWAInstaller();

    // Handle shortcuts after app is initialized
    setTimeout(() => {
        window.pwaInstaller.handleShortcuts();
    }, 1000);
});

// Export for global use
window.PWAInstaller = PWAInstaller;