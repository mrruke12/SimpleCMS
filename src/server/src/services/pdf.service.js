import markdownPdf from 'markdown-pdf'
import fs from 'fs';
import path, { resolve } from 'path'
import { promisify } from 'util'

export const mdToPdf = async (res, str) => {
    const dirname = process.cwd()
    console.log(dirname)
    const suffix = `${new Date().getTime()}-${Math.round(Math.random()*1000)}`
    const tempMdPath = path.join(dirname, `temp-${suffix}.md`);
    const tempPdfPath = path.join(dirname, `output-${suffix}.pdf`);

    await fs.promises.writeFile(tempMdPath, str);

    await new Promise((resolve, reject) => {
      markdownPdf()
        .from(tempMdPath)
        .to(tempPdfPath, (err) => {
          if (err) return reject(err);
          resolve();
        });
    });

    const pdfBuffer = await fs.promises.readFile(tempPdfPath);

    await Promise.all([
      fs.promises.unlink(tempMdPath),
      fs.promises.unlink(tempPdfPath)
    ]);

    res.send(pdfBuffer)
}