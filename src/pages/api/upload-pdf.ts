/**
 * External dependencies
 */
import type { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import multer from 'multer';

/**
 * Internal dependencies
 */
import { aiPdfHandler } from '@Utils/aiPdfHandler';
import { Schema } from '@Types/schemaTypes';

// Define the MulterFile interface manually
interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

// Configure multer for file uploads using memory storage
const upload = multer({ storage: multer.memoryStorage() });

const uploadMiddleware = upload.single('pdf');

// Define a custom request type extending NextApiRequest to include multer file
type ExtendedNextApiRequest = NextApiRequest & {
  file: MulterFile; // Use the manually defined MulterFile interface
};

// Create the API handler
const handler = nextConnect<ExtendedNextApiRequest, NextApiResponse>();

// Use the multer middleware for handling file uploads
handler.use(uploadMiddleware);

// Handle POST requests
handler.post(async (req, res) => {
  try {
    if (!req.file) {
      throw new Error('No file received');
    }

    // Get the schema from the formData
    const schema: Schema = JSON.parse(req.body.schema);

    // Process the uploaded PDF with the schema
    const aiResponse = await aiPdfHandler(req.file.buffer, schema);

    res.status(200).json({ fileName: req.file.originalname, data: aiResponse });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default handler;

export const config = {
  api: {
    bodyParser: false, // Disable the default body parser to handle file uploads
  },
};
