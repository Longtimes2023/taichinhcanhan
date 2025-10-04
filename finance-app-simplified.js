// Ứng dụng Quản Lý Tài Chính - Version Đơn Giản Tự Động Tính
class FinanceManager {
    constructor() {
        this.data = {
            // Thẻ tín dụng
            creditCards: [
                {
                    id: 1,
                    bankName: "Vietcombank",
                    cardNumber: "****1234",
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
                    // Tự động tính:
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
                    // Tự động tính:
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
                    // Tự động tính:
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
        this.bindEvents();
        this.showDashboard();
    }

    bindEvents() {
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.getAttribute('data-section');
                this.showSection(section);

                document.querySelectorAll('.menu-item').forEach(mi => mi.classList.remove('active'));
                item.classList.add('active');
            });
        });
    }

    showSection(section) {
        const addBtn = document.getElementById('add-btn');

        switch(section) {
            case 'dashboard':
                this.showDashboard();
                addBtn.style.display = 'none';
                break;
            case 'credit-cards':
                this.showCreditCards();
                addBtn.style.display = 'block';
                addBtn.onclick = () => this.showAddCreditCardForm();
                break;
            case 'installments':
                this.showInstallments();
                addBtn.style.display = 'block';
                addBtn.onclick = () => this.showAddInstallmentForm();
                break;
            case 'personal-loans':
                this.showPersonalLoans();
                addBtn.style.display = 'block';
                addBtn.onclick = () => this.showAddLoanForm('personal');
                break;
            case 'mortgage-loans':
                this.showMortgageLoans();
                addBtn.style.display = 'block';
                addBtn.onclick = () => this.showAddLoanForm('mortgage');
                break;
            case 'overdrafts':
                this.showOverdrafts();
                addBtn.style.display = 'block';
                addBtn.onclick = () => this.showAddLoanForm('overdraft');
                break;
            case 'payment-schedule':
                this.showPaymentScheduleAll();
                addBtn.style.display = 'none';
                break;
            default:
                this.showDashboard();
                addBtn.style.display = 'none';
                break;
        }

        document.getElementById('page-title').textContent = this.getSectionTitle(section);
    }

    getSectionTitle(section) {
        const titles = {
            'dashboard': 'Dashboard Tổng Quan',
            'credit-cards': 'Quản Lý Thẻ Tín Dụng',
            'installments': 'Trả Góp Thẻ Tín Dụng',
            'personal-loans': 'Vay Tín Chấp',
            'mortgage-loans': 'Vay Thế Chấp',
            'overdrafts': 'Thấu Chi',
            'payment-schedule': 'Lịch Trả Nợ Tổng Hợp'
        };
        return titles[section] || 'Dashboard';
    }

    // ===== TỰ ĐỘNG TÍNH TOÁN NGÀY TRẢ =====
    calculatePaymentDay(startDate) {
        const date = new Date(startDate);
        return date.getDate();
    }

    // ===== FORM ĐƠN GIẢN CHO TẤT CẢ LOẠI VAY =====
    showAddLoanForm(loanType) {
        const config = this.getLoanFormConfig(loanType);

        const content = document.getElementById('main-content');
        content.innerHTML = `
            <div class="form-container">
                <h3>${config.title}</h3>
                <form id="loanForm" onsubmit="financeManager.addLoan(event, '${loanType}')">

                    <!-- Thông tin cơ bản -->
                    <div class="form-section">
                        <h4>📋 Thông Tin Cơ Bản</h4>

                        <div class="form-row">
                            <div class="form-group">
                                <label>🏦 Ngân Hàng/Tổ Chức</label>
                                <select id="bankName" required>
                                    <option value="">Chọn ngân hàng</option>
                                    ${config.banks.map(bank => `<option value="${bank}">${bank}</option>`).join('')}
                                </select>
                            </div>
                            <div class="form-group">
                                <label>🎯 Mục Đích</label>
                                <select id="purpose" required>
                                    <option value="">Chọn mục đích</option>
                                    ${config.purposes.map(purpose => `<option value="${purpose}">${purpose}</option>`).join('')}
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- Thông số tài chính -->
                    <div class="form-section">
                        <h4>💰 Thông Số Tài Chính</h4>

                        <div class="form-row">
                            <div class="form-group">
                                <label>${config.amountLabel}</label>
                                <input type="number" id="amount" placeholder="${config.amountPlaceholder}" 
                                       min="${config.minAmount}" step="${config.amountStep}" required 
                                       onchange="financeManager.calculatePreview('${loanType}')">
                                <small>${config.amountHint}</small>
                            </div>
                            <div class="form-group">
                                <label>📅 Thời Hạn (tháng)</label>
                                <select id="termMonths" required onchange="financeManager.calculatePreview('${loanType}')">
                                    <option value="">Chọn thời hạn</option>
                                    ${config.terms.map(term => 
                                        `<option value="${term.months}">${term.label}</option>`
                                    ).join('')}
                                </select>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label>📈 Lãi Suất (${config.rateUnit})</label>
                                <input type="number" id="interestRate" placeholder="${config.ratePlaceholder}" 
                                       min="0" step="0.1" required 
                                       onchange="financeManager.calculatePreview('${loanType}')">
                                <small>${config.rateHint}</small>
                            </div>
                            <div class="form-group">
                                <label>📅 Ngày Bắt Đầu</label>
                                <input type="date" id="startDate" required 
                                       onchange="financeManager.calculatePreview('${loanType}')">
                            </div>
                        </div>
                    </div>

                    ${loanType === 'installment' ? this.renderCreditCardSelection() : ''}

                    <!-- Preview tự động tính -->
                    <div id="autoPreview" class="auto-preview" style="display: none;">
                        <h4>🤖 Tự Động Tính Toán:</h4>
                        <div id="previewContent"></div>
                    </div>

                    <div class="form-actions">
                        <button type="submit" class="btn btn--primary" id="submitBtn" disabled>
                            ✅ ${config.submitText}
                        </button>
                        <button type="button" class="btn btn--secondary" onclick="financeManager.goBackFromForm('${loanType}')">
                            ❌ Hủy
                        </button>
                    </div>
                </form>
            </div>
        `;

        // Set ngày mặc định
        document.getElementById('startDate').valueAsDate = new Date();
    }

    getLoanFormConfig(loanType) {
        const configs = {
            personal: {
                title: "💼 Thêm Vay Tín Chấp",
                amountLabel: "💰 Số Tiền Vay (VNĐ)",
                amountPlaceholder: "100000000",
                minAmount: "1000000",
                amountStep: "1000000",
                amountHint: "Số tiền cần vay",
                rateUnit: "%/năm",
                ratePlaceholder: "12.5",
                rateHint: "Lãi suất vay tín chấp: 8-25%/năm",
                submitText: "Thêm Vay Tín Chấp",
                banks: ["BIDV", "Vietcombank", "Techcombank", "VietinBank", "ACB", "MB Bank", "Sacombank"],
                purposes: ["Kinh doanh", "Tiêu dùng", "Mua xe", "Sửa nhà", "Du học", "Y tế", "Cưới xin", "Khác"],
                terms: [
                    {months: 12, label: "12 tháng (1 năm)"},
                    {months: 18, label: "18 tháng"},
                    {months: 24, label: "24 tháng (2 năm)"},
                    {months: 36, label: "36 tháng (3 năm)"},
                    {months: 48, label: "48 tháng (4 năm)"},
                    {months: 60, label: "60 tháng (5 năm)"},
                    {months: 84, label: "84 tháng (7 năm)"}
                ]
            },
            mortgage: {
                title: "🏠 Thêm Vay Thế Chấp",
                amountLabel: "💰 Số Tiền Vay (VNĐ)",
                amountPlaceholder: "800000000",
                minAmount: "50000000",
                amountStep: "10000000",
                amountHint: "Số tiền vay mua/xây nhà",
                rateUnit: "%/năm",
                ratePlaceholder: "8.5",
                rateHint: "Lãi suất vay thế chấp: 6-12%/năm",
                submitText: "Thêm Vay Thế Chấp",
                banks: ["Vietcombank", "BIDV", "Agribank", "Techcombank", "VietinBank", "ACB", "MB Bank"],
                purposes: ["Mua nhà", "Xây nhà", "Sửa nhà", "Mua đất", "Refinance", "Đầu tư BDS"],
                terms: [
                    {months: 120, label: "10 năm"},
                    {months: 180, label: "15 năm"},
                    {months: 240, label: "20 năm"},
                    {months: 300, label: "25 năm"},
                    {months: 360, label: "30 năm"}
                ]
            },
            overdraft: {
                title: "🏦 Thêm Thấu Chi",
                amountLabel: "💸 Số Tiền Đang Sử Dụng (VNĐ)",
                amountPlaceholder: "5000000",
                minAmount: "100000",
                amountStep: "100000",
                amountHint: "Số tiền hiện đang thấu chi",
                rateUnit: "%/năm",
                ratePlaceholder: "15.0",
                rateHint: "Lãi suất thấu chi: 12-20%/năm",
                submitText: "Thêm Thấu Chi",
                banks: ["Techcombank", "BIDV", "Vietcombank", "VietinBank", "ACB", "MB Bank", "VPBank"],
                purposes: ["Vốn lưu động", "Kinh doanh", "Thanh toán", "Khẩn cấp", "Đầu tư ngắn hạn"],
                terms: [
                    {months: 1, label: "1 tháng (ngắn hạn)"},
                    {months: 3, label: "3 tháng"},
                    {months: 6, label: "6 tháng"},
                    {months: 12, label: "12 tháng (gia hạn)"}
                ]
            },
            installment: {
                title: "🛍️ Thêm Trả Góp Thẻ Tín Dụng",
                amountLabel: "💰 Giá Trị Sản Phẩm (VNĐ)",
                amountPlaceholder: "28000000",
                minAmount: "1000000",
                amountStep: "100000",
                amountHint: "Giá trị sản phẩm trả góp",
                rateUnit: "%/tháng",
                ratePlaceholder: "2.0",
                rateHint: "Lãi suất trả góp: 0-3%/tháng",
                submitText: "Thêm Trả Góp",
                banks: ["Vietcombank", "Techcombank", "BIDV", "VietinBank", "ACB", "MB Bank"],
                purposes: ["iPhone", "Samsung", "MacBook", "Laptop", "Tivi", "Tủ lạnh", "Máy giặt", "Xe máy", "Khác"],
                terms: [
                    {months: 3, label: "3 tháng"},
                    {months: 6, label: "6 tháng"},
                    {months: 12, label: "12 tháng"},
                    {months: 18, label: "18 tháng"},
                    {months: 24, label: "24 tháng"},
                    {months: 36, label: "36 tháng"}
                ]
            }
        };

        return configs[loanType];
    }

    renderCreditCardSelection() {
        if (this.data.creditCards.length === 0) {
            return `
                <div class="form-section">
                    <div class="warning-message">
                        ⚠️ Vui lòng thêm ít nhất một thẻ tín dụng trước khi tạo trả góp!
                    </div>
                </div>
            `;
        }

        return `
            <div class="form-section">
                <h4>💳 Chọn Thẻ Tín Dụng</h4>
                <div class="form-group">
                    <label>Thẻ Sử Dụng Trả Góp</label>
                    <select id="creditCardId" required onchange="financeManager.updateCardAvailable()">
                        <option value="">-- Chọn thẻ --</option>
                        ${this.data.creditCards.map(card => `
                            <option value="${card.id}">
                                ${card.bankName} ${card.cardNumber} 
                                (Còn: ${this.formatCurrency(this.getCardAvailableLimit(card.id))})
                            </option>
                        `).join('')}
                    </select>
                </div>
                <div id="cardAvailableInfo" class="card-available-info" style="display: none;"></div>
            </div>
        `;
    }

    // ===== TỰ ĐỘNG TÍNH TOÁN PREVIEW =====
    calculatePreview(loanType) {
        const amount = document.getElementById('amount').value;
        const termMonths = document.getElementById('termMonths').value;
        const interestRate = document.getElementById('interestRate').value;
        const startDate = document.getElementById('startDate').value;

        const preview = document.getElementById('autoPreview');
        const previewContent = document.getElementById('previewContent');
        const submitBtn = document.getElementById('submitBtn');

        if (amount && termMonths && interestRate && startDate) {
            const calculation = this.calculateLoanDetails(loanType, {
                amount: parseInt(amount),
                termMonths: parseInt(termMonths),
                interestRate: parseFloat(interestRate),
                startDate: startDate
            });

            // Kiểm tra validation cho trả góp thẻ tín dụng
            if (loanType === 'installment') {
                const creditCardId = document.getElementById('creditCardId')?.value;
                if (creditCardId) {
                    const availableLimit = this.getCardAvailableLimit(parseInt(creditCardId));
                    if (parseInt(amount) > availableLimit) {
                        previewContent.innerHTML = `
                            <div class="error-message">
                                ❌ Số tiền trả góp vượt quá hạn mức còn lại của thẻ!
                                <br>Hạn mức còn lại: ${this.formatCurrency(availableLimit)}
                            </div>
                        `;
                        preview.style.display = 'block';
                        submitBtn.disabled = true;
                        return;
                    }
                }
            }

            previewContent.innerHTML = `
                <div class="preview-grid">
                    <div class="preview-item">
                        <span>💰 ${loanType === 'overdraft' ? 'Số tiền sử dụng' : 'Số tiền vay/trả góp'}:</span>
                        <span>${this.formatCurrency(calculation.amount)}</span>
                    </div>
                    <div class="preview-item">
                        <span>📅 Thời hạn:</span>
                        <span>${calculation.termMonths} tháng${calculation.termMonths >= 12 ? ` (${Math.round(calculation.termMonths/12)} năm)` : ''}</span>
                    </div>
                    <div class="preview-item">
                        <span>📈 Lãi suất:</span>
                        <span>${calculation.interestRate}%/${loanType === 'installment' ? 'tháng' : 'năm'}</span>
                    </div>
                    <div class="preview-item">
                        <span>🗓️ Ngày trả hàng tháng:</span>
                        <span>Ngày ${this.calculatePaymentDay(startDate)}</span>
                    </div>
                    ${loanType !== 'overdraft' ? `
                    <div class="preview-item">
                        <span>💸 ${calculation.isDecreasing ? 'Tháng đầu' : 'Hàng tháng'}:</span>
                        <span>${this.formatCurrency(calculation.firstPayment)}</span>
                    </div>
                    ${calculation.isDecreasing ? `
                    <div class="preview-item">
                        <span>💸 Tháng cuối:</span>
                        <span>${this.formatCurrency(calculation.lastPayment)}</span>
                    </div>` : ''}
                    <div class="preview-item">
                        <span>💸 Tổng lãi:</span>
                        <span>${this.formatCurrency(calculation.totalInterest)}</span>
                    </div>
                    <div class="preview-item highlight">
                        <span><strong>🎯 Tổng phải trả:</strong></span>
                        <span><strong>${this.formatCurrency(calculation.totalPayment)}</strong></span>
                    </div>` : `
                    <div class="preview-item">
                        <span>💸 Lãi hàng tháng:</span>
                        <span>${this.formatCurrency(calculation.monthlyInterest)}</span>
                    </div>
                    <div class="preview-item">
                        <span>🔄 Có thể tái sử dụng:</span>
                        <span>Có (sau khi trả nợ)</span>
                    </div>`}
                </div>
            `;

            preview.style.display = 'block';
            submitBtn.disabled = false;
        } else {
            preview.style.display = 'none';
            submitBtn.disabled = true;
        }
    }

    // ===== LOGIC TÍNH TOÁN CHI TIẾT =====
    calculateLoanDetails(loanType, params) {
        const { amount, termMonths, interestRate, startDate } = params;

        if (loanType === 'overdraft') {
            // Thấu chi - tính lãi đơn giản
            const monthlyInterestRate = interestRate / 12 / 100;
            const monthlyInterest = amount * monthlyInterestRate;

            return {
                amount: amount,
                termMonths: termMonths,
                interestRate: interestRate,
                monthlyInterest: monthlyInterest,
                totalPayment: amount + (monthlyInterest * termMonths),
                totalInterest: monthlyInterest * termMonths
            };
        }

        // Các loại vay khác - dùng dư nợ giảm dần
        const isInstallment = loanType === 'installment';
        const monthlyRate = isInstallment ? 
            interestRate / 100 : // Trả góp thẻ TD: %/tháng
            interestRate / 12 / 100; // Vay: %/năm -> %/tháng

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

    // ===== UPDATE CARD AVAILABLE INFO =====
    updateCardAvailable() {
        const cardSelect = document.getElementById('creditCardId');
        const cardInfo = document.getElementById('cardAvailableInfo');

        if (cardSelect && cardSelect.value) {
            const cardId = parseInt(cardSelect.value);
            const card = this.data.creditCards.find(c => c.id === cardId);
            const available = this.getCardAvailableLimit(cardId);

            cardInfo.innerHTML = `
                <div class="card-info-display">
                    <p><strong>🏦 ${card.bankName} ${card.cardNumber}</strong></p>
                    <p>💰 Hạn mức còn lại: <span class="amount-highlight ${available < 0 ? 'negative' : 'positive'}">${this.formatCurrency(available)}</span></p>
                    ${available < 0 ? '<p class="warning">⚠️ Thẻ đã vượt hạn mức!</p>' : ''}
                </div>
            `;
            cardInfo.style.display = 'block';
        } else {
            cardInfo.style.display = 'none';
        }

        // Tính lại preview khi thay đổi thẻ
        this.calculatePreview('installment');
    }

    // ===== THÊM VAY/TRẢ GÓP =====
    addLoan(event, loanType) {
        event.preventDefault();

        const formData = this.collectFormData(loanType);

        switch(loanType) {
            case 'personal':
                formData.paymentType = 'decreasing'; // Mặc định dư nợ giảm dần
                formData.remainingBalance = formData.loanAmount;
                this.data.personalLoans.push(formData);
                break;
            case 'mortgage':
                formData.paymentType = 'decreasing'; // Có thể thay đổi
                formData.remainingBalance = formData.loanAmount;
                formData.gracePeriodMonths = 0; // Mặc định không ân hạn
                formData.collateralType = formData.purpose; // Dùng purpose làm collateral type
                formData.collateralValue = formData.loanAmount * 1.2; // Tài sản thường > khoản vay
                this.data.mortgageLoans.push(formData);
                break;
            case 'overdraft':
                formData.creditLimit = Math.max(formData.amount * 2, formData.amount + 10000000); // Hạn mức ước tính
                formData.currentBalance = formData.amount;
                formData.minimumPaymentPercent = 5; // 5% mặc định
                formData.reviewDate = this.calculateReviewDate(formData.startDate);
                this.data.overdrafts.push(formData);
                break;
            case 'installment':
                formData.totalAmount = formData.amount;
                formData.remainingAmount = formData.amount; // Chưa trả gì
                formData.productName = formData.purpose;
                this.data.creditCardInstallments.push(formData);
                break;
        }

        alert(`✅ Đã thêm ${this.getLoanTypeName(loanType)} thành công!`);
        this.goBackFromForm(loanType);
    }

    collectFormData(loanType) {
        const baseData = {
            id: Date.now(),
            bankName: document.getElementById('bankName').value,
            purpose: document.getElementById('purpose').value,
            startDate: document.getElementById('startDate').value,
            paymentDay: this.calculatePaymentDay(document.getElementById('startDate').value)
        };

        if (loanType === 'installment') {
            return {
                ...baseData,
                amount: parseInt(document.getElementById('amount').value),
                termMonths: parseInt(document.getElementById('termMonths').value),
                interestRate: parseFloat(document.getElementById('interestRate').value),
                creditCardId: parseInt(document.getElementById('creditCardId').value)
            };
        }

        return {
            ...baseData,
            [loanType === 'overdraft' ? 'amount' : 'loanAmount']: parseInt(document.getElementById('amount').value),
            termMonths: parseInt(document.getElementById('termMonths').value),
            interestRate: parseFloat(document.getElementById('interestRate').value)
        };
    }

    calculateReviewDate(startDate) {
        const date = new Date(startDate);
        date.setFullYear(date.getFullYear() + 1);
        return date.toISOString().split('T')[0];
    }

    getLoanTypeName(loanType) {
        const names = {
            'personal': 'vay tín chấp',
            'mortgage': 'vay thế chấp',
            'overdraft': 'thấu chi',
            'installment': 'trả góp thẻ tín dụng'
        };
        return names[loanType];
    }

    goBackFromForm(loanType) {
        switch(loanType) {
            case 'personal':
                this.showPersonalLoans();
                break;
            case 'mortgage':
                this.showMortgageLoans();
                break;
            case 'overdraft':
                this.showOverdrafts();
                break;
            case 'installment':
                this.showInstallments();
                break;
        }
    }

    // ===== LOGIC TÍNH HẠN MỨC THẺ TÍN DỤNG =====
    getCardUsedAmount(cardId) {
        const card = this.data.creditCards.find(c => c.id === cardId);
        if (!card) return 0;

        const currentSpending = card.currentSpending || 0;
        const installmentAmount = this.data.creditCardInstallments
            .filter(inst => inst.creditCardId === cardId)
            .reduce((sum, inst) => sum + inst.remainingAmount, 0);

        return currentSpending + installmentAmount;
    }

    getCardAvailableLimit(cardId) {
        const card = this.data.creditCards.find(c => c.id === cardId);
        if (!card) return 0;

        const usedAmount = this.getCardUsedAmount(cardId);
        return card.creditLimit - usedAmount;
    }

    // ===== DASHBOARD TỰ ĐỘNG =====
    showDashboard() {
        const stats = this.calculateDashboardStats();

        const content = document.getElementById('main-content');
        content.innerHTML = `
            <div class="dashboard">
                <!-- Stats Cards -->
                <div class="stats-grid">
                    <div class="stat-card debt">
                        <div class="stat-icon">💰</div>
                        <div class="stat-content">
                            <h3>Tổng Nợ Hiện Tại</h3>
                            <div class="stat-value">${this.formatCurrency(stats.totalDebt)}</div>
                        </div>
                    </div>

                    <div class="stat-card available-credit">
                        <div class="stat-icon">🎯</div>
                        <div class="stat-content">
                            <h3>Tín Dụng Còn Lại</h3>
                            <div class="stat-value">${this.formatCurrency(stats.totalAvailableCredit)}</div>
                        </div>
                    </div>

                    <div class="stat-card monthly-payment">
                        <div class="stat-icon">📅</div>
                        <div class="stat-content">
                            <h3>Trả Hàng Tháng</h3>
                            <div class="stat-value">${this.formatCurrency(stats.monthlyPayment)}</div>
                        </div>
                    </div>

                    <div class="stat-card loans-count">
                        <div class="stat-icon">📊</div>
                        <div class="stat-content">
                            <h3>Tổng Khoản Vay</h3>
                            <div class="stat-value">${stats.totalLoans}</div>
                        </div>
                    </div>
                </div>

                <!-- Quick Summary -->
                <div class="dashboard-section">
                    <h3>📋 Tóm Tắt Nhanh</h3>
                    <div class="quick-summary">
                        <div class="summary-item">
                            <span>💳 Thẻ tín dụng: </span>
                            <span>${this.data.creditCards.length} thẻ</span>
                        </div>
                        <div class="summary-item">
                            <span>🛍️ Trả góp: </span>
                            <span>${this.data.creditCardInstallments.length} khoản</span>
                        </div>
                        <div class="summary-item">
                            <span>💼 Vay tín chấp: </span>
                            <span>${this.data.personalLoans.length} khoản</span>
                        </div>
                        <div class="summary-item">
                            <span>🏠 Vay thế chấp: </span>
                            <span>${this.data.mortgageLoans.length} khoản</span>
                        </div>
                        <div class="summary-item">
                            <span>🏦 Thấu chi: </span>
                            <span>${this.data.overdrafts.length} khoản</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    calculateDashboardStats() {
        let totalDebt = 0;
        let totalAvailableCredit = 0;
        let monthlyPayment = 0;

        // Tổng nợ
        this.data.creditCards.forEach(card => {
            totalDebt += this.getCardUsedAmount(card.id);
            totalAvailableCredit += this.getCardAvailableLimit(card.id);
        });

        this.data.personalLoans.forEach(loan => {
            totalDebt += loan.remainingBalance || loan.loanAmount;
        });

        this.data.mortgageLoans.forEach(loan => {
            totalDebt += loan.remainingBalance || loan.loanAmount;
        });

        this.data.overdrafts.forEach(overdraft => {
            totalDebt += overdraft.currentBalance || overdraft.amount;
            totalAvailableCredit += (overdraft.creditLimit || overdraft.amount * 2) - (overdraft.currentBalance || overdraft.amount);
        });

        // Ước tính thanh toán hàng tháng (simplified)
        [...this.data.personalLoans, ...this.data.mortgageLoans].forEach(loan => {
            if (loan.loanAmount && loan.termMonths && loan.interestRate) {
                const calculation = this.calculateLoanDetails('personal', {
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
                const calculation = this.calculateLoanDetails('installment', {
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
            totalLoans: this.data.personalLoans.length + this.data.mortgageLoans.length + 
                       this.data.overdrafts.length + this.data.creditCardInstallments.length
        };
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0
        }).format(amount);
    }

    // ===== PLACEHOLDER METHODS =====
    showCreditCards() { alert('Chức năng thẻ tín dụng'); }
    showInstallments() { alert('Chức năng trả góp'); }
    showPersonalLoans() { alert('Chức năng vay tín chấp'); }
    showMortgageLoans() { alert('Chức năng vay thế chấp'); }
    showOverdrafts() { alert('Chức năng thấu chi'); }
    showPaymentScheduleAll() { alert('Lịch trả nợ tổng hợp'); }
    showAddCreditCardForm() { alert('Form thêm thẻ tín dụng'); }
    showAddInstallmentForm() { this.showAddLoanForm('installment'); }
}

// Khởi tạo ứng dụng
let financeManager;
document.addEventListener('DOMContentLoaded', function() {
    financeManager = new FinanceManager();
});