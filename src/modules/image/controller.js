
const Image = require('./model');
const openaiClient = require('./../../config/openai');
const constant = require('../../utilities/constant')
const { customResponse, customPagination } = require("../../utilities/customResponse")
const User = require("./model")
const fs = require('fs');
const path = require('path');


async function transformFileObject(fileObject) {
    try {
        // Read the file from the file system
        const fileData = await fs.readFile(fileObject.path);

        // Create a buffer from the file data
        const fileBuffer = Buffer.from(fileData);

        // Construct the transformed file object
        const transformedFile = {
            fieldname: 'file', // Change the fieldname if needed
            originalname: fileObject.originalname,
            encoding: fileObject.encoding,
            mimetype: fileObject.mimetype,
            buffer: fileBuffer,
            size: fileObject.size
        };

        return transformedFile;
    } catch (error) {
        throw error;
    }
}

const getAnnotations = async (req, res) => {
    try {
        const fileLocation = path.join(__dirname, req.file.path);
        
        // const completion = await openaiClient.chat.completions.create({
        //     messages: [{ role: "system", content: "You are a helpful assistant." }],
        //     model: "gpt-3.5-turbo",
        //   });
        
        //   console.log(completion.choices[0]);
        
        const file = await transformFileObject(req.file);
        const uploadedFile = await openaiClient.files.create({
            file: file.buffer,
            purpose: 'fine-tune',  // Adjust the purpose as needed, 'fine-tune' is an example
        });


        res.sendStatus(200);
    } catch (err) {
        res.status(500).send({
            code: 500,
            message: err.message,
        });
    }
};

module.exports = {
    getAnnotations
};
