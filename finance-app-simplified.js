// Ứng dụng Quản Lý Tài Chính Cá Nhân - Fixed Warning Logic
class FinanceManager {
    constructor() {
        this.data = {
            // Thẻ tín dụng mẫu
            creditCards: [
                {
                    id: 1,
                    bankName: "Vietcombank",
                    cardNumber: "****1234",
                    cardType: "Visa Gold",
                    creditLimit: 50000000,
                    currentSpending: 5000000,
                    createdDate: "2024-01-15",
                    closingDate: "15",
                    hotline: "1900545413"
                }
            ],

            // Trả góp thẻ tín dụng mẫu
            creditCardInstallments: [
                {
                    id: 1,
                    creditCardId: 1,
                    productName: "iPhone 15 Pro",
                    totalAmount: 28000000,
                    termMonths: 12,
                    interestRate: 2.0,
                    startDate: "2024-02-01",
                    paymentDay: 15,
                    remainingAmount: 20000000,
                    currentMonth: 8
                }
            ],

            // Vay tín chấp mẫu
            personalLoans: [
                {
                    id: 1,
                    bankName: "BIDV", 
                    loanAmount: 100000000,
                    termMonths: 36,
                    interestRate: 12.5,
                    startDate: "2024-01-01",
                    purpose: "Kinh doanh",
                    paymentDay: 5,
                    remainingBalance: 75000000,
                    paymentType: "decreasing",
                    currentMonth: 10
                }
            ],

            // Vay thế chấp mẫu
            mortgageLoans: [
                {
                    id: 1,
                    bankName: "Vietcombank",
                    loanAmount: 800000000,
                    termMonths: 240,
                    interestRate: 8.5,
                    startDate: "2023-06
Asset 3 of 3
