/**
 * Ứng dụng Quản Lý Tài Chính - Version Fix Dashboard
 * Fixed: Navigation system, DOM loading, và dashboard display
 */

class FinanceManager {
    constructor() {
        this.data = {
            // Thẻ tín dụng
            creditCards: [
                {
                    id: 1,
                    bankName: "Vietcombank",
                    cardNumber: "1234",
                    creditLimit: 50000000,
                    currentSpending: 5000000,
                    createdDate: "2024-01-15"
                }
            ],
            // Trả góp thẻ tín dụng
            creditCardInstallments: [
                {
                    id: 1,
                    creditCardId: 1,
                    productName: "iPhone 15 Pro",
                    totalAmount: 28000000,
                    termMonths: 12,
                    interestRate: 2.0, // %/tháng
                    startDate: "2024-02-01",
                    // Tự động tính
                    paymentDay: this.calculatePaymentDay("2024-02-01"),
                    remainingAmount: 20000000
                }
            ],
            // Vay tín chấp
            personalLoans: [
                {
                    id: 1,
                    bankName: "BIDV",
                    loanAmount: 100000000,
                    termMonths: 36,
                    interestRate: 12.5, // %/năm
                    startDate: "2024-01-01",
                    purpose: "Kinh doanh",
                    // Tự động tính
                    paymentDay: this.calculatePaymentDay("2024-01-01"),
                    remainingBalance: 75000000,
                    paymentType: "decreasing" // Mặc định dư nợ giảm dần
                }
            ],
            // Vay thế chấp
            mortgageLoans: [
                {
                    id: 1,
                    bankName: "Vietcombank", 
                    loanAmount: 800000000,
                    termMonths: 240, // 20 năm
                    interestRate: 8.5, // %/năm
                    startDate: "2023-06-01",
                    purpose: "Mua nhà",
                    // Tự động tính
                    paymentDay: this.calculatePaymentDay("2023-06-01"),
                    remainingBalance: 720000000,
                    paymentType: "equal", // Thế chấp thường dùng trả đều
                    gracePeriodMonths: 0
                }
            ],
            // Thấu chi (đơn giản hóa)
            overdrafts: [
                {
                    id: 1,
                    bankName: "Techcombank",
                    amount: 5000000, // Số tiền đang sử dụng
                    creditLimit: 20000000,
                    interestRate: 15.0, // %/năm
                    startDate: "2024-01-01",
                    purpose: "Vốn lưu động"
                }
            ]
        };
        
        this.init();
    }

    init() {
        console.log("FinanceManager initializing...");
        this.bindEvents();
        this.showDashboard();
        console.log("FinanceManager initialized successfully");
    }

    bindEvents() {
        console.log("Binding events...");
        
        // Sử dụng event delegation để bind tất cả menu items
        document.addEventListener('click', (e) => {
            const menuItem = e.target.closest('.menu-item');
            if (menuItem) {
                e.preventDefault();
                
                // Lấy href và extract section name
                const href = menuItem.getAttribute('href');
                if (href && href.startsWith('#')) {
                    const section = href.substring(1);
                    this.showSection(section);
                    
                    // Update active state
                    document.querySelectorAll('.menu-item').forEach(item => {
                        item.classList.remove('active');
                    });
                    menuItem.classList.add('active');
                }
            }
        });
        
        console.log("Events bound successfully");
    }

    showSection(section) {
        console.log("Showing section:", section);
        
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(sec => {
            sec.classList.remove('active');
            sec.style.display = 'none';
        });
        
        // Show target section
        const targetSection = document.getElementById(section);
        if (targetSection) {
            targetSection.classList.add('active');
            targetSection.style.display = 'block';
        }

        // Handle different sections
        switch(section) {
            case 'dashboard':
                this.showDashboard();
                break;
            case 'credit-cards':
                this.showCreditCards();
                break;
            case 'installment':
                this.showInstallments();
                break;
            case 'loans':
            case 'unsecured-loans':
                this.showPersonalLoans();
                break;
            case 'secured-loans':
                this.showMortgageLoans();
                break;
            case 'overdraft':
                this.showOverdrafts();
                break;
            case 'reports':
            case 'payment-schedule':
                this.showPaymentScheduleAll();
                break;
            default:
                this.showDashboard();
                break;
        }
        
        console.log("Section", section, "displayed");
    }

    // === DASHBOARD TỔNG HỢP ===
    showDashboard() {
        console.log("Loading dashboard...");
        
        const stats = this.calculateDashboardStats();
        const content = document.getElementById('main-content');
        
        if (!content) {
            console.error("main-content element not found!");
            return;
        }

        content.innerHTML = `
            <div class="dashboard">
                <div class="section-header">
                    <h1>Dashboard Tổng Quan</h1>
                </div>
                
                <!-- Stats Cards -->
                <div class="dashboard-stats">
                    <div class="stat-card debt">
                        <div class="stat-content">
                            <div class="stat-icon">💳</div>
                            <div class="stat-info">
                                <h3>Tổng Nợ Hiện Tại</h3>
                                <div class="stat-value">${this.formatCurrency(stats.totalDebt)}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="stat-card available-credit">
                        <div class="stat-content">
                            <div class="stat-icon">💰</div>
                            <div class="stat-info">
                                <h3>Tín Dụng Còn Lại</h3>
                                <div class="stat-value">${this.formatCurrency(stats.totalAvailableCredit)}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="stat-card monthly-payment">
                        <div class="stat-content">
                            <div class="stat-icon">📈</div>
                            <div class="stat-info">
                                <h3>Trả Hàng Tháng</h3>
                                <div class="stat-value">${this.formatCurrency(stats.monthlyPayment)}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="stat-card loans-count">
                        <div class="stat-content">
                            <div class="stat-icon">🏦</div>
                            <div class="stat-info">
                                <h3>Tổng Khoản Vay</h3>
                                <div class="stat-value">${stats.totalLoans}</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Quick Summary -->
                <div class="dashboard-section">
                    <h3>Tóm Tắt Nhanh</h3>
                    <div class="quick-summary">
                        <div class="summary-item">
                            <span>Thẻ tín dụng</span>
                            <span>${this.data.creditCards.length} thẻ</span>
                        </div>
                        <div class="summary-item">
                            <span>Trả góp</span>
                            <span>${this.data.creditCardInstallments.length} khoản</span>
                        </div>
                        <div class="summary-item">
                            <span>Vay tín chấp</span>
                            <span>${this.data.personalLoans.length} khoản</span>
                        </div>
                        <div class="summary-item">
                            <span>Vay thế chấp</span>
                            <span>${this.data.mortgageLoans.length} khoản</span>
                        </div>
                        <div class="summary-item">
                            <span>Thấu chi</span>
                            <span>${this.data.overdrafts.length} khoản</span>
                        </div>
                    </div>
                </div>
                
                <!-- Charts Section -->
                <div class="dashboard-charts">
                    <div class="chart-container">
                        <h4>Phân Bổ Nợ</h4>
                        <canvas id="debtDistributionChart" width="400" height="200"></canvas>
                    </div>
                    <div class="chart-container">
                        <h4>Lịch Trả Nợ</h4>
                        <canvas id="paymentScheduleChart" width="400" height="200"></canvas>
                    </div>
                </div>
            </div>
        `;
        
        // Initialize charts after DOM is updated
        setTimeout(() => {
            this.initializeCharts();
        }, 100);
        
        console.log("Dashboard loaded successfully");
    }

    calculateDashboardStats() {
        let totalDebt = 0;
        let totalAvailableCredit = 0;
        let monthlyPayment = 0;

        // Tổng nợ từ thẻ tín dụng
        this.data.creditCards.forEach(card => {
            totalDebt += this.getCardUsedAmount(card.id);
            totalAvailableCredit += this.getCardAvailableLimit(card.id);
        });

        // Tổng nợ từ vay tín chấp
        this.data.personalLoans.forEach(loan => {
            totalDebt += (loan.remainingBalance || loan.loanAmount);
        });

        // Tổng nợ từ vay thế chấp
        this.data.mortgageLoans.forEach(loan => {
            totalDebt += (loan.remainingBalance || loan.loanAmount);
        });

        // Tổng nợ từ thấu chi
        this.data.overdrafts.forEach(overdraft => {
            totalDebt += (overdraft.currentBalance || overdraft.amount);
            totalAvailableCredit += Math.max(0, (overdraft.creditLimit || overdraft.amount * 2) - (overdraft.currentBalance || overdraft.amount));
        });

        // Tính toán thanh toán hàng tháng (simplified)
        [...this.data.personalLoans, ...this.data.mortgageLoans].forEach(loan => {
            if (loan.loanAmount && loan.termMonths && loan.interestRate) {
                const calculation = this.calculateLoanDetails("personal", {
                    amount: loan.loanAmount,
                    termMonths: loan.termMonths,
                    interestRate: loan.interestRate,
                    startDate: loan.startDate
                });
                monthlyPayment += calculation.firstPayment;
            }
        });

        this.data.creditCardInstallments.forEach(inst => {
            if (inst.totalAmount && inst.termMonths && inst.interestRate) {
                const calculation = this.calculateLoanDetails("installment", {
                    amount: inst.totalAmount,
                    termMonths: inst.termMonths,
                    interestRate: inst.interestRate,
                    startDate: inst.startDate
                });
                monthlyPayment += calculation.firstPayment;
            }
        });

        return {
            totalDebt,
            totalAvailableCredit,
            monthlyPayment,
            totalLoans: this.data.personalLoans.length + this.data.mortgageLoans.length + this.data.overdrafts.length + this.data.creditCardInstallments.length
        };
    }

    initializeCharts() {
        console.log("Initializing charts...");
        
        if (typeof Chart === 'undefined') {
            console.error("Chart.js not loaded!");
            return;
        }

        // Debt Distribution Chart
        const debtCtx = document.getElementById('debtDistributionChart');
        if (debtCtx) {
            new Chart(debtCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Thẻ Tín Dụng', 'Vay Tín Chấp', 'Vay Thế Chấp', 'Thấu Chi'],
                    datasets: [{
                        data: [
                            this.data.creditCards.reduce((sum, card) => sum + this.getCardUsedAmount(card.id), 0),
                            this.data.personalLoans.reduce((sum, loan) => sum + (loan.remainingBalance || loan.loanAmount), 0),
                            this.data.mortgageLoans.reduce((sum, loan) => sum + (loan.remainingBalance || loan.loanAmount), 0),
                            this.data.overdrafts.reduce((sum, od) => sum + (od.currentBalance || od.amount), 0)
                        ],
                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }

        // Payment Schedule Chart (simplified)
        const paymentCtx = document.getElementById('paymentScheduleChart');
        if (paymentCtx) {
            const monthlyData = this.calculateMonthlyPayments();
            new Chart(paymentCtx, {
                type: 'bar',
                data: {
                    labels: monthlyData.labels,
                    datasets: [{
                        label: 'Thanh Toán Hàng Tháng',
                        data: monthlyData.amounts,
                        backgroundColor: '#36A2EB'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                        minimumFractionDigits: 0
                                    }).format(value);
                                }
                            }
                        }
                    }
                }
            });
        }
        
        console.log("Charts initialized successfully");
    }

    calculateMonthlyPayments() {
        // Simplified calculation for next 6 months
        const labels = [];
        const amounts = [];
        
        for (let i = 0; i < 6; i++) {
            const date = new Date();
            date.setMonth(date.getMonth() + i);
            labels.push(date.toLocaleDateString('vi-VN', { month: 'short', year: 'numeric' }));
            
            let monthlyAmount = 0;
            // Add fixed monthly payments from all loans
            const stats = this.calculateDashboardStats();
            monthlyAmount = stats.monthlyPayment;
            
            amounts.push(monthlyAmount);
        }
        
        return { labels, amounts };
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0
        }).format(amount);
    }

    // === UTILITY METHODS ===
    calculatePaymentDay(startDate) {
        const date = new Date(startDate);
        return date.getDate();
    }

    getCardUsedAmount(cardId) {
        const card = this.data.creditCards.find(c => c.id === cardId);
        if (!card) return 0;
        
        const currentSpending = card.currentSpending || 0;
        const installmentAmount = this.data.creditCardInstallments
            .filter(inst => inst.creditCardId === cardId)
            .reduce((sum, inst) => sum + (inst.remainingAmount || 0), 0);
        
        return currentSpending + installmentAmount;
    }

    getCardAvailableLimit(cardId) {
        const card = this.data.creditCards.find(c => c.id === cardId);
        if (!card) return 0;
        
        const usedAmount = this.getCardUsedAmount(cardId);
        return card.creditLimit - usedAmount;
    }

    calculateLoanDetails(loanType, params) {
        const { amount, termMonths, interestRate, startDate } = params;
        
        if (loanType === "overdraft") {
            // Thấu chi - tính lãi đơn giản
            const monthlyInterestRate = interestRate / 12 / 100;
            const monthlyInterest = amount * monthlyInterestRate;
            return {
                amount: amount,
                termMonths: termMonths,
                interestRate: interestRate,
                monthlyInterest: monthlyInterest,
                totalPayment: amount + (monthlyInterest * termMonths),
                totalInterest: monthlyInterest * termMonths,
                firstPayment: monthlyInterest,
                lastPayment: monthlyInterest
            };
        }

        // Các loại vay khác - dùng dư nợ giảm dần
        const isInstallment = loanType === "installment";
        const monthlyRate = isInstallment ? 
            interestRate / 100 : // Trả góp thẻ TD (%/tháng)
            interestRate / 12 / 100; // Vay (%/năm) -> (%/tháng)

        // Tính lịch trả nợ
        const schedule = [];
        let remainingBalance = amount;
        const principalPerMonth = amount / termMonths;

        for (let month = 1; month <= termMonths; month++) {
            const interestThisMonth = remainingBalance * monthlyRate;
            const totalPaymentThisMonth = principalPerMonth + interestThisMonth;
            remainingBalance -= principalPerMonth;

            schedule.push({
                month: month,
                principalPayment: principalPerMonth,
                interestPayment: interestThisMonth,
                totalPayment: totalPaymentThisMonth,
                remainingBalance: Math.max(0, remainingBalance)
            });
        }

        const totalInterest = schedule.reduce((sum, month) => sum + month.interestPayment, 0);
        const firstPayment = schedule[0].totalPayment;
        const lastPayment = schedule[schedule.length - 1].totalPayment;

        return {
            amount: amount,
            termMonths: termMonths,
            interestRate: interestRate,
            schedule: schedule,
            totalInterest: totalInterest,
            totalPayment: amount + totalInterest,
            firstPayment: firstPayment,
            lastPayment: lastPayment,
            isDecreasing: true // Dùng dư nợ giảm dần
        };
    }

    // === PLACEHOLDER METHODS ===
    showCreditCards() {
        document.getElementById('main-content').innerHTML = `
            <div class="section-header">
                <h1>Quản Lý Thẻ Tín Dụng</h1>
            </div>
            <div class="placeholder">
                <p>Chức năng quản lý thẻ tín dụng đang được phát triển...</p>
            </div>
        `;
    }

    showInstallments() {
        document.getElementById('main-content').innerHTML = `
            <div class="section-header">
                <h1>Trả Góp</h1>
            </div>
            <div class="placeholder">
                <p>Chức năng trả góp đang được phát triển...</p>
            </div>
        `;
    }

    showPersonalLoans() {
        document.getElementById('main-content').innerHTML = `
            <div class="section-header">
                <h1>Vay Tín Chấp</h1>
            </div>
            <div class="placeholder">
                <p>Chức năng vay tín chấp đang được phát triển...</p>
            </div>
        `;
    }

    showMortgageLoans() {
        document.getElementById('main-content').innerHTML = `
            <div class="section-header">
                <h1>Vay Thế Chấp</h1>
            </div>
            <div class="placeholder">
                <p>Chức năng vay thế chấp đang được phát triển...</p>
            </div>
        `;
    }

    showOverdrafts() {
        document.getElementById('main-content').innerHTML = `
            <div class="section-header">
                <h1>Thấu Chi</h1>
            </div>
            <div class="placeholder">
                <p>Chức năng thấu chi đang được phát triển...</p>
            </div>
        `;
    }

    showPaymentScheduleAll() {
        document.getElementById('main-content').innerHTML = `
            <div class="section-header">
                <h1>Lịch Trả Nợ Tổng Hợp</h1>
            </div>
            <div class="placeholder">
                <p>Chức năng lịch trả nợ đang được phát triển...</p>
            </div>
        `;
    }
}

// Khởi tạo ứng dụng
let financeManager;

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded, initializing FinanceManager...");
    
    // Hide loading overlay
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        setTimeout(() => {
            loadingOverlay.style.display = 'none';
        }, 1000);
    }
    
    // Initialize app
    financeManager = new FinanceManager();
});

// Global error handling
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
});

console.log("FinanceManager script loaded successfully");
