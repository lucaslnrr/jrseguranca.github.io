const fs = require('fs');
const path = require('path');

(async () => {
  try {
    const { PDFParse } = await import('pdf-parse/node');
    const filePath = path.resolve(__dirname, 'jrseguranca.pdf');
    const buffer = fs.readFileSync(filePath);
    const parser = new PDFParse({
      data: buffer,
      useSystemFonts: true,
      cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@5.4.296/cmaps/',
      cMapPacked: true,
      standardFontDataUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@5.4.296/standard_fonts/'
    });
    const result = await parser.getText({
      lineThreshold: 12,
      cellSeparator: ' ',
      parseHyperlinks: false
    });
    await parser.destroy();
    const outputPath = path.resolve(__dirname, 'jrseguranca.txt');
    fs.writeFileSync(outputPath, result.text, 'utf8');
    console.log(`Texto extraído para ${outputPath}`);
  } catch (error) {
    console.error('Falha ao extrair texto do PDF:', error);
    process.exit(1);
  }
})();
