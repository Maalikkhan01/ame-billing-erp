import html2pdf from "html2pdf.js";

export async function downloadPdf({ element, filename = "document.pdf" }) {
  if (!element) {
    throw new Error("Element not found");
  }

  const options = {
    margin: [5, 5, 5, 5],

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
    },

    jsPDF: {
      unit: "mm",
      format: "a5",
      orientation: "portrait",
      compress: true,
    },

    pagebreak: {
      mode: ["avoid-all", "css", "legacy"],
    },
  };

  return html2pdf().set(options).from(element).save();
}
