const PDFDocument = require('pdfkit');
const db = require('../config/db');


async function generateInvoicePDF(invoiceData) {
    const { studentId, hoursStudied, totalAmount } = invoiceData;

    const studentQuery = 'SELECT * FROM student WHERE id = ?';
    const students = await db.query(studentQuery, [studentId]);
    
    if (!students || students.length === 0) {
        throw new Error('Student not found');
    }

    const student = students[0];
    const studentName = `${student.first_name} ${student.last_name || ''}`.trim();
    const currentDate = new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 50, bottom: 50, left: 50, right: 50 }
    });

    const chunks = [];
    doc.on('data', chunk => chunks.push(chunk));
    
    return new Promise((resolve, reject) => {
        doc.on('end', () => {
            const pdfBuffer = Buffer.concat(chunks);
            resolve(pdfBuffer);
        });

        doc.on('error', reject);

        try {
            doc.fontSize(24)
                .font('Helvetica-Bold')
                .text('FACTURA', { align: 'center' })
                .moveDown(2);

            doc.fontSize(12)
                .font('Helvetica')
                .text(`Fecha de emisión: ${currentDate}`, { align: 'left' })
                .moveDown(1);

            doc.moveTo(50, doc.y)
                .lineTo(545, doc.y)
                .stroke()
                .moveDown(2);

            doc.fontSize(14)
                .font('Helvetica-Bold')
                .text('Datos del estudiante:', { continued: false })
                .moveDown(0.5);

            doc.fontSize(12)
                .font('Helvetica')
                .text(`Nombre: ${studentName}`)
                .text(`Teléfono: ${student.phone || 'No proporcionado'}`)
                .text(`ID del estudiante: ${student.id}`)
                .moveDown(1.5);

            doc.fontSize(14)
                .font('Helvetica-Bold')
                .text('Detalles del servicio:', { continued: false })
                .moveDown(0.5);

            doc.fontSize(12)
                .font('Helvetica')
                .text(`Horas estudiadas: ${hoursStudied} horas`)
                .text(`Precio por hora: ${(totalAmount / hoursStudied).toFixed(2)} €/hora`)
                .moveDown(1.5);

            doc.moveTo(50, doc.y)
                .lineTo(545, doc.y)
                .stroke()
                .moveDown(1);

            doc.fontSize(16)
                .font('Helvetica-Bold')
                .text(`Total a pagar: ${totalAmount.toFixed(2)} €`, { align: 'right' })
                .moveDown(3);

            doc.fontSize(10)
                .font('Helvetica')
                .text('Firma:', { align: 'left' })
                .moveDown(2);

            doc.moveTo(50, doc.y)
                .lineTo(250, doc.y)
                .stroke()
                .moveDown(0.5);

            doc.fontSize(10)
                .text('Creado por: Academia Main Sistema', { align: 'left' });

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = {
    generateInvoicePDF
};

