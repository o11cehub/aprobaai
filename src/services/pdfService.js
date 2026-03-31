/**
 * Extrae el texto de un archivo PDF en el navegador usando pdf.js.
 */
export async function extractTextFromPDF(file) {
  // Carga pdf.js de forma dinámica para evitar problemas con el worker
  const pdfjsLib = await import('pdfjs-dist')
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.mjs',
    import.meta.url
  ).toString()

  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

  let fullText = ''
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const pageText = content.items.map((item) => item.str).join(' ')
    fullText += pageText + '\n\n'
  }

  return fullText.trim()
}
