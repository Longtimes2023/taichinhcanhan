// Ứng dụng Quản Lý Tài Chính Cá Nhân - Enhanced Dashboard với Biểu Đồ
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
                },
                {
                    id: 2,
                    bankName: "BIDV",
                    cardNumber: "****5678",
                    cardType: "Mastercard Platinum",
                    creditLimit: 80000000,
                    currentSpending: 45000000,
                    createdDate: "2024-03-20",
                    closingDate: "20",
                    hotline: "1900585858"
                },
                {
                    id: 3,
                    bankName: "Techcombank",
                    cardNumber: "****9012",
                    cardType: "Visa Signature",
                    creditLimit: 100000000,
                    currentSpending: 95000000,
                    createdDate: "2024-05-10",
                    closingDate: "10",
                    hotline: "1800588822"
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
                },
                {
