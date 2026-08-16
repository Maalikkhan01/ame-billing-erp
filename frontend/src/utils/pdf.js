import html2pdf from "html2pdf.js";

export async function downloadPdf({
  element,
  filename = "document.pdf",
  paperSize = "A5",
}) {
  if (!element) {
    throw new Error("Element not found");
  }

  const isA6 = paperSize === "A6";
  const normalizedPaperSize = isA6 ? "a6" : "a5";

  /*
   * The invoice itself already has the required paper width.
   *
   * Therefore html2pdf should not add large external margins.
   */
  const options = {
    margin: 0,

    filename,

    image: {
      type: "jpeg",
      quality: 0.98,
    },

    html2canvas: {
      scale: 3,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      letterRendering: true,
      removeContainer: true,

      /*
       * Keep the rendered invoice inside its actual
       * A5/A6 DOM width.
       */
      width: element.scrollWidth,
      windowWidth: element.scrollWidth,
    },

    jsPDF: {
      unit: "mm",
      format: normalizedPaperSize,
      orientation: "portrait",
      compress: true,
    },

    pagebreak: {
      mode: ["css", "legacy"],
    },
  };

  return html2pdf().set(options).from(element).save();
}
