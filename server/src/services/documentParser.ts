import fs from 'fs';
import { PDFParse } from 'pdf-parse';
import mammoth from 'mammoth';
import officeParser from 'officeparser';

/**
 * Mengekstrak teks dari file berdasarkan ekstensi file.
 * Dukungan format: .txt, .pdf, .docx, .pptx, .ppt
 */
export async function extractTextFromFile(filePath: string, originalName: string): Promise<string> {
  const extension = originalName.substring(originalName.lastIndexOf('.')).toLowerCase();

  if (!fs.existsSync(filePath)) {
    throw new Error('File tidak ditemukan di server.');
  }

  switch (extension) {
    case '.txt': {
      return fs.readFileSync(filePath, 'utf-8');
    }
    case '.pdf': {
      const dataBuffer = fs.readFileSync(filePath);
      const parser = new PDFParse({ data: dataBuffer });
      const parsed = await parser.getText();
      return parsed.text || '';
    }
    case '.docx': {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value || '';
    }
    case '.pptx':
    case '.ppt': {
      try {
        const text = await (officeParser as any).parsePromise(filePath);
        return text || '';
      } catch (err: any) {
        console.error('OfficeParser error, falling back to basic extraction:', err);
        throw new Error('Gagal mengekstrak file presentasi PPTX/PPT: ' + err.message);
      }
    }
    default:
      throw new Error(`Format file ${extension} tidak didukung.`);
  }
}
