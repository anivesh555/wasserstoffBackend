const Image = require('./../image/model')
const constant = require('../../utilities/constant')
const { customResponse, customPagination } = require("../../utilities/customResponse")
const User = require('../user/model')
const PDFDocument = require('pdfkit');
const { createObjectCsvWriter } = require('csv-writer');



const getAllImages = async (req, res) => {
    try {

        const data = await Image.find({})
        return res.status(constant.HTTP_200_CODE).send(customResponse({
            code: constant.HTTP_200_CODE,
            message: constant.LOGIN_SUCCESS,
            data: data
        }))


    } catch (err) {
        console.log(err, "-->>>");
        res.status(constant.HTTP_500_CODE).send(customResponse({
            code: constant.HTTP_500_CODE,
            message: err.message,
        }));
    }


}

const reviewImages = async (req, res) => {
    try {
        let msg;
        const { id } = req.params;
        const { review } = req.body;
    
        if (!['reject', 'approve', 'pending'].includes(review)) {
            msg = 'Invalid review status'
            return res.status(constant.HTTP_400_CODE).send(customResponse({
                code: constant.HTTP_400_CODE,
                message: msg,
            }));
        }
        const image = await Image.findByIdAndUpdate(id, { review }, { new: true });
        if (!image) {
            msg = 'image not found'
            return res.status(constant.HTTP_400_CODE).send(customResponse({
                code: constant.HTTP_400_CODE,
                message: msg,
            }));
        }
        return res.status(constant.HTTP_200_CODE).send(customResponse({
            code: constant.HTTP_200_CODE,
            message: constant.LOGIN_SUCCESS,
            data: image
        }))


    } catch (err) {
        console.log(err, "-->>>");
        res.status(constant.HTTP_500_CODE).send(customResponse({
            code: constant.HTTP_500_CODE,
            message: err.message,
        }));
    }


}
const exportCsv = async (req, res) => {
    try {
        
        const images = await User.find().lean();

        const fields = ['url', 'review', 'annotations.label', 'annotations.confidence'];
        const opts = { fields };
        const parser = new Parser(opts);
        const csv = parser.parse(images);

        res.header('Content-Type', 'text/csv');
        res.attachment('images.csv');
        res.send(csv);
        
        // return res.status(constant.HTTP_200_CODE).send(customResponse({
        //     code: constant.HTTP_200_CODE,
        //     message: constant.LOGIN_SUCCESS,
        //     data: image
        // }))


    } catch (err) {
        console.log(err, "-->>>");
        res.status(constant.HTTP_500_CODE).send(customResponse({
            code: constant.HTTP_500_CODE,
            message: err.message,
        }));
    }

}
const exportPdf = async (req, res) => {
    try {

        const doc = new PDFDocument();
        const user = await User.find().lean();
        
        res.setHeader('Content-disposition', 'attachment; filename=user_collection.pdf');
        res.setHeader('Content-type', 'application/pdf');
    
        // Pipe PDF to response
        doc.pipe(res);
    
        // Add content to the PDF
        doc.fontSize(25).text('User Collection', { align: 'center' });
        doc.moveDown();
    
        user.forEach(user => {
            doc.fontSize(14).text(`ID: ${user._id}`, { continued: true }).text(` Name: ${user.username}`, { continued: true }).text(` Email: ${user.email}`);
            doc.moveDown();
        });
    
        // Finalize the PDF and end the stream
        doc.end();
    
        
        return res.status(constant.HTTP_200_CODE).send(customResponse({
            code: constant.HTTP_200_CODE,
            message: constant.LOGIN_SUCCESS,
            data: doc
        }))


    } catch (err) {
        console.log(err, "-->>>");
        res.status(constant.HTTP_500_CODE).send(customResponse({
            code: constant.HTTP_500_CODE,
            message: err.message,
        }));
    }

}
const exportPdfImage = async (req, res) => {
    try {

        const doc = new PDFDocument();
        const user = await Image.find().lean();
        
        res.setHeader('Content-disposition', 'attachment; filename=user_collection.pdf');
        res.setHeader('Content-type', 'application/pdf');
    
        // Pipe PDF to response
        doc.pipe(res);
    
        // Add content to the PDF
        doc.fontSize(25).text('Image Collection', { align: 'center' });
        doc.moveDown();
    
        user.forEach(user => {
            doc.fontSize(14).text(`ID: ${user._id}`, { continued: true }).text(` url: ${user.url}`, { continued: true }).text(` review: ${user.review}`, { continued: true }).text(` annotations: ${user.annotations}`);
            doc.moveDown();
        });
    
        // Finalize the PDF and end the stream
        doc.end();
    
        
        return res.status(constant.HTTP_200_CODE).send(customResponse({
            code: constant.HTTP_200_CODE,
            message: constant.LOGIN_SUCCESS,
            data: doc
        }))


    } catch (err) {
        console.log(err, "-->>>");
        res.status(constant.HTTP_500_CODE).send(customResponse({
            code: constant.HTTP_500_CODE,
            message: err.message,
        }));
    }

}
const exportUserCsv = async(req,res) =>{
    try {
        // Fetch user collection from the database
        const userCollection = await User.find().lean();

        const csvWriter = createObjectCsvWriter({
            path: 'user_collection.csv',
            header: [
                { id: '_id', title: 'ID' },
                { id: 'name', title: 'Name' },
                { id: 'email', title: 'Email' },
            ],
        });

        // Write user collection data to CSV
        await csvWriter.writeRecords(userCollection);

        // Send CSV file in response
        res.download('user_collection.csv');
    } catch (err) {
        console.error('Error generating CSV:', err);
        res.status(500).send('Internal Server Error');
    }
}



module.exports = {getAllImages,
    reviewImages,
    exportCsv,
    exportPdf,
    exportPdfImage,
    exportPdfImage,
    exportUserCsv
}