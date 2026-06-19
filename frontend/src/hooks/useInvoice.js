import { useEffect, useState } from "react";

import { getInvoiceById } from "../services/invoiceService";

export default function useInvoice(id) {
  const [invoice, setInvoice] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadInvoice();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadInvoice = async () => {
    try {
      const data =
        await getInvoiceById(id);

      setInvoice(data.bill);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    invoice,
    loading,
  };
}