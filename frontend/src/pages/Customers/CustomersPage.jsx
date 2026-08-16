import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

import MainLayout from "../../components/layout/MainLayout";

import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import SearchInput from "../../components/ui/SearchInput";
import EmptyState from "../../components/ui/EmptyState";
import TableWrapper from "../../components/ui/TableWrapper";
import ConfirmModal from "../../components/ui/ConfirmModal";
import useCustomers from "../../hooks/useCustomers";
import Pagination from "../../components/ui/Pagination";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import FormField from "../../components/ui/FormField";

import "./CustomersPage.css";

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
  const [addCustomerModalOpen, setAddCustomerModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [deleteCustomerId, setDeleteCustomerId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const nameRef = useRef(null);
  const mobileRef = useRef(null);
  const addressRef = useRef(null);

  // Modal open hone par name field par auto-focus karne ke liye
  useEffect(() => {
    if (addCustomerModalOpen) {
      requestAnimationFrame(() => {
        nameRef.current?.focus();
      });
    }
  }, [addCustomerModalOpen]);

  const closeAddCustomerModal = () => {
    setAddCustomerModalOpen(false);
    setName("");
    setMobile("");
    setAddress("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    await addCustomer({
      name,
      mobile,
      address,
    });

    closeAddCustomerModal();
  };

  return (
    <MainLayout>
      <PageHeader
        title="Customers"
        subtitle="Manage your customers and dues"
        right={
          <Button onClick={() => setAddCustomerModalOpen(true)}>
            + Add Customer
          </Button>
        }
      />

      <div className="customers-page">
        {/* ADD CUSTOMER MODAL */}
        <Modal
          open={addCustomerModalOpen}
          title="Add Customer"
          className="app-modal-form"
          onClose={closeAddCustomerModal}
        >
          <form onSubmit={handleSubmit}>
            <div className="customer-modal-form">
              <FormField
                ref={nameRef}
                placeholder="Customer Name"
                className="modal-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    mobileRef.current?.focus();
                  }
                }}
              />

              <FormField
                ref={mobileRef}
                placeholder="Mobile"
                className="modal-input"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addressRef.current?.focus();
                  }
                }}
              />

              <FormField
                ref={addressRef}
                placeholder="Address"
                className="modal-input"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onKeyDown={async (e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    await handleSubmit(e);
                  }
                }}
              />

              <div className="modal-actions">
                <Button type="submit">Add Customer</Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={closeAddCustomerModal}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        </Modal>

        {/* SEARCH BAR */}
        <SearchInput
          value={search}
          placeholder="Search customer..."
          onChange={(value) => {
            setSearch(value);

            if (value.trim()) {
              searchCustomer(value);
            } else {
              loadCustomers(1);
            }
          }}
        />

        {/* CUSTOMER LIST TABLE */}
        {loading ? (
          <Card title="Customer List">
            <EmptyState text="Loading customers..." />
          </Card>
        ) : (
          <Card title="Customer List">
            <TableWrapper>
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
                          <Button
                            as={Link}
                            to={`/customers/${customer._id}`}
                            variant="secondary"
                            size="sm"
                          >
                            Profile
                          </Button>

                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => setEditingCustomer(customer)}
                          >
                            Edit
                          </Button>

                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => {
                              setDeleteCustomerId(customer._id);
                              setDeleteModalOpen(true);
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableWrapper>
          </Card>
        )}

        <Pagination
          page={page}
          totalPages={totalPages}
          onPrevious={() => loadCustomers(page - 1)}
          onNext={() => loadCustomers(page + 1)}
        />

        {/* EDIT CUSTOMER MODAL */}
        <Modal
          open={!!editingCustomer}
          title="Edit Customer"
          className="app-modal-form"
          onClose={() => setEditingCustomer(null)}
        >
          {editingCustomer && (
            <div className="customer-modal-form">
              <FormField
                className="modal-input"
                value={editingCustomer.name}
                onChange={(e) =>
                  setEditingCustomer({
                    ...editingCustomer,
                    name: e.target.value,
                  })
                }
              />

              <FormField
                className="modal-input"
                value={editingCustomer.mobile}
                onChange={(e) =>
                  setEditingCustomer({
                    ...editingCustomer,
                    mobile: e.target.value,
                  })
                }
              />

              <FormField
                className="modal-input"
                value={editingCustomer.address}
                onChange={(e) =>
                  setEditingCustomer({
                    ...editingCustomer,
                    address: e.target.value,
                  })
                }
              />

              <div className="modal-actions">
                <Button
                  onClick={async () => {
                    await editCustomer(editingCustomer._id, {
                      name: editingCustomer.name,
                      mobile: editingCustomer.mobile,
                      address: editingCustomer.address,
                    });

                    setEditingCustomer(null);
                  }}
                >
                  Save
                </Button>

                <Button
                  variant="secondary"
                  onClick={() => setEditingCustomer(null)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* DELETE CONFIRMATION MODAL */}
        <ConfirmModal
          open={deleteModalOpen}
          title="Delete Customer"
          message="Are you sure you want to delete this customer? Customers with pending dues cannot be deleted."
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={async () => {
            if (!deleteCustomerId) return;

            await removeCustomer(deleteCustomerId);
            setDeleteCustomerId(null);
            setDeleteModalOpen(false);
          }}
          onCancel={() => {
            setDeleteCustomerId(null);
            setDeleteModalOpen(false);
          }}
        />
      </div>
    </MainLayout>
  );
}

export default CustomersPage;
