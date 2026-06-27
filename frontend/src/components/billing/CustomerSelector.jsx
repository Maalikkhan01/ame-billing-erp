import { useEffect, useRef } from "react";

import Card from "../ui/Card";
import FormField from "../ui/FormField";

function CustomerSelector({
  customerSearchRef,

  customerSearch,
  setCustomerSearch,

  customerResults,

  customerId,
  setCustomerId,

  selectedCustomer,
  setSelectedCustomer,

  selectedCustomerIndex,
  setSelectedCustomerIndex,

  productSearchRef,
}) {
  const itemRefs = useRef([]);

  useEffect(() => {
    itemRefs.current[selectedCustomerIndex]?.scrollIntoView({
      block: "nearest",
      behavior: "smooth",
    });
  }, [selectedCustomerIndex]);

  return (
    <Card title="Customer">
      <FormField
        ref={customerSearchRef}
        placeholder="Search customer..."
        value={customerSearch}
        onChange={(e) => {
          setCustomerSearch(e.target.value);

          setCustomerId("");

          setSelectedCustomer(null);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();

            setSelectedCustomerIndex((prev) =>
              Math.min(prev + 1, customerResults.length - 1),
            );
          }

          if (e.key === "ArrowUp") {
            e.preventDefault();

            setSelectedCustomerIndex((prev) => Math.max(prev - 1, 0));
          }

          if (e.key === "Enter") {
            e.preventDefault();
            const customer = customerResults[selectedCustomerIndex];

            if (customer) {
              setCustomerId(customer._id);

              setSelectedCustomer(customer);

              setCustomerSearch(customer.name);

              productSearchRef.current?.focus();
            }
          }

          if (e.key === "Escape") {
            setSelectedCustomerIndex(0);
          }
        }}
      />

      {customerSearch && customerId === "" && (
        <div className="customer-dropdown">
          {customerResults.map((customer, index) => (
            <div
              key={customer._id}
              ref={(el) => (itemRefs.current[index] = el)}
              className={`dropdown-item ${
                index === selectedCustomerIndex ? "dropdown-active" : ""
              }`}
              onClick={() => {
                setCustomerId(customer._id);

                setSelectedCustomer(customer);

                setCustomerSearch(customer.name);
              }}
            >
              {customer.name}
            </div>
          ))}
        </div>
      )}

      {selectedCustomer && (
        <div className="customer-details">
          <span>Name: {selectedCustomer.name}</span>

          <span>Mobile: {selectedCustomer.mobile}</span>

          <span>
            Due: ₹
            {Number(selectedCustomer.currentDue || 0).toLocaleString("en-IN")}
          </span>
        </div>
      )}
    </Card>
  );
}

export default CustomerSelector;
