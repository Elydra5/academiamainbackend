const { generateInvoicePDF } = require('../middleware/billingMiddleware');


async function generateInvoice(req, res) {
    try {
        const { studentId, hoursStudied, totalAmount } = req.body;

        if (!studentId || !hoursStudied || !totalAmount) {
            return res.status(400).json({
                error: 'Missing data',
                message: 'The studentId, hoursStudied and totalAmount fields are required'
            });
        }

        if (isNaN(studentId) || isNaN(hoursStudied) || isNaN(totalAmount)) {
            return res.status(400).json({
                error: 'Invalid data',
                message: 'The studentId, hoursStudied and totalAmount fields must be numbers'
            });
        }

        if (hoursStudied <= 0 || totalAmount <= 0) {
            return res.status(400).json({
                error: 'Invalid values',
                message: 'The number of hours studied and the total amount must be positive numbers'
            });
        }

        const pdfBuffer = await generateInvoicePDF({
            studentId: parseInt(studentId),
            hoursStudied: parseFloat(hoursStudied),
            totalAmount: parseFloat(totalAmount)
        });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="invoice_${studentId}_${Date.now()}.pdf"`);
        res.setHeader('Content-Length', pdfBuffer.length);
        
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Invoice generation error:', error);
        res.status(500).json({
            error: 'Server error',
            message: error.message || 'An error occurred while generating the invoice'
        });
    }
}

module.exports = {
    generateInvoice
};

