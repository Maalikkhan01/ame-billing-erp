import { useState, useRef } from "react";
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

  const [editingCustomer, setEditingCustomer] = useState(null);
  const [deleteCustomerId, setDeleteCustomerId] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

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
      <PageHeader title="Customers" subtitle="Manage your customers and dues" />

      <div className="customers-page">
        <Card title="Add Customer">
          <form onSubmit={handleSubmit}>
            <div className="customer-form-grid">
              <FormField
                ref={nameRef}
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

              <FormField
                ref={mobileRef}
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

              <FormField
                ref={addressRef}
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
              <Button type="submit" className="add-customer-btn">
                Add Customer
              </Button>
            </div>
          </form>
        </Card>

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

        <Modal
          open={!!editingCustomer}
          title="Edit Customer"
          onClose={() => setEditingCustomer(null)}
        >
          {editingCustomer && (
            <>
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
            </>
          )}
        </Modal>

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
