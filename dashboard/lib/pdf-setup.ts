import { getData } from 'pdf-parse/worker'
import { PDFParse } from 'pdf-parse'

// Required for Next.js / serverless — avoids missing pdf.worker.mjs in .next chunks
PDFParse.setWorker(getData())
