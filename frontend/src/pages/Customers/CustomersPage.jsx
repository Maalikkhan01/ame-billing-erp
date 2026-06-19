import { useState, useRef } from "react";
import { Link } from "react-router-dom";

import MainLayout from "../../components/layout/MainLayout";

import "./CustomersPage.css";
import useCustomers from "../../hooks/useCustomers";

function CustomersPage() {
  const {
    customers,
    loading,
    addCustomer,

    page,
    totalPages,

    loadCustomers,

    searchCustomer,

    editCustomer,

    removeCustomer,
  } = useCustomers();

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [search, setSearch] = useState("");

  const [editingCustomer, setEditingCustomer] = useState(null);

  const nameRef = useRef(null);
  const mobileRef = useRef(null);
  const addressRef = useRef(null);
  const handleSubmit = async (e) => {
    e.preventDefault();

    await addCustomer({
      name,
      mobile,
      address,
    });

    setName("");
    setMobile("");
    setAddress("");

    nameRef.current?.focus();
  };

  return (
    <MainLayout>
      <h1>Customers</h1>

      <div className="customers-page">
        <div className="customer-form-card">
          <h3>Add Customer</h3>

          <form onSubmit={handleSubmit}>
            <div className="customer-form-grid">
              <input
                ref={nameRef}
                className="customer-input"
                placeholder="Customer Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    mobileRef.current?.focus();
                  }
                }}
              />

              <input
                ref={mobileRef}
                className="customer-input"
                placeholder="Mobile"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addressRef.current?.focus();
                  }
                }}
              />

              <input
                ref={addressRef}
                className="customer-input"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onKeyDown={async (e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();

                    await addCustomer({
                      name,
                      mobile,
                      address,
                    });

                    setName("");
                    setMobile("");
                    setAddress("");

                    nameRef.current?.focus();
                  }
                }}
              />

              <button type="submit" className="add-btn">
                Add Customer
              </button>
            </div>
          </form>
        </div>

        <div className="customer-search-card">
          <input
            className="customer-search-input"
            placeholder="Search Customer..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);

              if (e.target.value.trim()) {
                searchCustomer(e.target.value);
              } else {
                loadCustomers(1);
              }
            }}
          />
        </div>

        {loading ? (
          <div className="customer-table-card">
            <h3>Loading Customers...</h3>
          </div>
        ) : (
          <div className="customer-table-card">
            <div className="customer-table-wrapper">
              <table className="customer-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Mobile</th>
                    <th>Address</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer._id}>
                      <td>{customer.name}</td>

                      <td>{customer.mobile}</td>

                      <td>{customer.address}</td>

                      <td>
                        <div className="action-group">
                          <Link
                            className="profile-btn"
                            to={`/customers/${customer._id}`}
                          >
                            Profile
                          </Link>

                          <button
                            className="edit-btn"
                            onClick={() => setEditingCustomer(customer)}
                          >
                            Edit
                          </button>

                          <button
                            className="delete-btn"
                            onClick={async () => {
                              const confirmDelete =
                                window.confirm("Delete customer?");

                              if (!confirmDelete) return;

                              await removeCustomer(customer._id);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="pagination">
          <button
            className="page-btn"
            disabled={page === 1}
            onClick={() => loadCustomers(page - 1)}
          >
            Previous
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button
            className="page-btn"
            disabled={page === totalPages}
            onClick={() => loadCustomers(page + 1)}
          >
            Next
          </button>
        </div>

        {editingCustomer && (
          <div className="modal-overlay">
            <div
              style={{
                background: "#fff",

                padding: "20px",

                borderRadius: "10px",
              }}
            >
              <h2>Edit Customer</h2>

              <input
                value={editingCustomer.name}
                onChange={(e) =>
                  setEditingCustomer({
                    ...editingCustomer,

                    name: e.target.value,
                  })
                }
              />

              <input
                value={editingCustomer.mobile}
                onChange={(e) =>
                  setEditingCustomer({
                    ...editingCustomer,

                    mobile: e.target.value,
                  })
                }
              />

              <input
                value={editingCustomer.address}
                onChange={(e) =>
                  setEditingCustomer({
                    ...editingCustomer,

                    address: e.target.value,
                  })
                }
              />

              <button
                onClick={async () => {
                  await editCustomer(
                    editingCustomer._id,

                    {
                      name: editingCustomer.name,

                      mobile: editingCustomer.mobile,

                      address: editingCustomer.address,
                    },
                  );

                  setEditingCustomer(null);
                }}
              >
                Save
              </button>

              <button onClick={() => setEditingCustomer(null)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default CustomersPage;
