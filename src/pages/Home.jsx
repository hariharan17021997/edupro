import { useEffect, useState } from "react";
import { Container, Box } from "@mui/material";

import CommonDataTable from "../components/CommonDataTable";

export default function Home() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    // Sample user data - In a real app, fetch this from an API endpoint
    const sampleUsers = [
      {
        id: 1,
        firstname: "John",
        lastname: "Doe",
        email: "john.doe@example.com",
        mobile: "+1 (555) 123-4567",
        country: "India",
        status: "Active",
        dob: "2025-12-01",
        subscriptionexpdate: "2025-12-01T14:30:00",
      },
      {
        id: 2,
        firstname: "Jane",
        lastname: "Smith",
        email: "jane.smith@example.com",
        mobile: "+1 (555) 234-5678",
        country: "Canada",
        status: "Active",
        dob: "2025-12-02",
        subscriptionexpdate: "2025-12-02T14:30:00",
      },
      {
        id: 3,
        firstname: "Bob",
        lastname: "Johnson",
        email: "bob.johnson@example.com",
        mobile: "+44 (0) 20 7946 0958",
        country: "India",
        status: "Inactive",
        dob: "2025-12-03",
        subscriptionexpdate: "2025-12-03T14:30:00",
      },
      {
        id: 4,
        firstname: "Alice",
        lastname: "Williams",
        email: "alice.williams@example.com",
        mobile: "+61 2 9999 9999",
        country: "Japan",
        status: "Active",
        dob: "2025-12-04",
        subscriptionexpdate: "2025-12-04T14:30:00",
      },
      {
        id: 5,
        firstname: "Charlie",
        lastname: "Brown",
        email: "charlie.brown@example.com",
        mobile: "+33 1 42 34 56 78",
        country: "Japan",
        status: "Pending",
        dob: "2025-12-05",
        subscriptionexpdate: "2025-12-05T14:30:00",
      },
      {
        id: 6,
        firstname: "Diana",
        lastname: "Prince",
        email: "diana.prince@example.com",
        mobile: "+49 30 1234 5678",
        country: "India",
        status: "Active",
        dob: "2025-12-06",
        subscriptionexpdate: "2025-12-06T14:30:00",
      },
      {
        id: 7,
        firstname: "Edward",
        lastname: "Norton",
        email: "edward.norton@example.com",
        mobile: "+81 3-1234-5678",
        country: "China",
        status: "Active",
        dob: "2025-12-07",
        subscriptionexpdate: "2025-12-07T14:30:00",
      },
      {
        id: 8,
        firstname: "Fiona",
        lastname: "Green",
        email: "fiona.green@example.com",
        mobile: "+39 06 1234 5678",
        country: "China",
        status: "Inactive",
        dob: "2025-12-08",
        subscriptionexpdate: "2025-12-08T14:30:00",
      },
      {
        id: 8,
        firstname: "Fiona",
        lastname: "Green",
        email: "fiona.green@example.com",
        mobile: "+39 06 1234 5678",
        country: "China",
        status: "Inactive",
        dob: "2025-12-08",
        subscriptionexpdate: "2025-12-08T14:30:00",
      },
      {
        id: 8,
        firstname: "Fiona",
        lastname: "Green",
        email: "fiona.green@example.com",
        mobile: "+39 06 1234 5678",
        country: "China",
        status: "Inactive",
        dob: "2025-12-08",
        subscriptionexpdate: "2025-12-08T14:30:00",
      },
      {
        id: 8,
        firstname: "Fiona",
        lastname: "Green",
        email: "fiona.green@example.com",
        mobile: "+39 06 1234 5678",
        country: "China",
        status: "Inactive",
        dob: "2025-12-08",
        subscriptionexpdate: "2025-12-08T14:30:00",
      },
      {
        id: 8,
        firstname: "Fiona",
        lastname: "Green",
        email: "fiona.green@example.com",
        mobile: "+39 06 1234 5678",
        country: "China",
        status: "Inactive",
        dob: "2025-12-08",
        subscriptionexpdate: "2025-12-08T14:30:00",
      },
      {
        id: 8,
        firstname: "Fiona",
        lastname: "Green",
        email: "fiona.green@example.com",
        mobile: "+39 06 1234 5678",
        country: "China",
        status: "Inactive",
        dob: "2025-12-08",
        subscriptionexpdate: "2025-12-08T14:30:00",
      },
      {
        id: 8,
        firstname: "Fiona",
        lastname: "Green",
        email: "fiona.green@example.com",
        mobile: "+39 06 1234 5678",
        country: "China",
        status: "Inactive",
        dob: "2025-12-08",
        subscriptionexpdate: "2025-12-08T14:30:00",
      },
      {
        id: 8,
        firstname: "Fiona",
        lastname: "Green",
        email: "fiona.green@example.com",
        mobile: "+39 06 1234 5678",
        country: "China",
        status: "Inactive",
        dob: "2025-12-08",
        subscriptionexpdate: "2025-12-08T14:30:00",
      },
      {
        id: 8,
        firstname: "Fiona",
        lastname: "Green",
        email: "fiona.green@example.com",
        mobile: "+39 06 1234 5678",
        country: "China",
        status: "Inactive",
        dob: "2025-12-08",
        subscriptionexpdate: "2025-12-08T14:30:00",
      },
      {
        id: 8,
        firstname: "Fiona",
        lastname: "Green",
        email: "fiona.green@example.com",
        mobile: "+39 06 1234 5678",
        country: "China",
        status: "Inactive",
        dob: "2025-12-08",
        subscriptionexpdate: "2025-12-08T14:30:00",
      },
      {
        id: 8,
        firstname: "Fiona",
        lastname: "Green",
        email: "fiona.green@example.com",
        mobile: "+39 06 1234 5678",
        country: "China",
        status: "Inactive",
        dob: "2025-12-08",
        subscriptionexpdate: "2025-12-08T14:30:00",
      },
      {
        id: 8,
        firstname: "Fiona",
        lastname: "Green",
        email: "fiona.green@example.com",
        mobile: "+39 06 1234 5678",
        country: "China",
        status: "Inactive",
        dob: "2025-12-08",
        subscriptionexpdate: "2025-12-08T14:30:00",
      },
      {
        id: 8,
        firstname: "Fiona",
        lastname: "Green",
        email: "fiona.green@example.com",
        mobile: "+39 06 1234 5678",
        country: "China",
        status: "Inactive",
        dob: "2025-12-08",
        subscriptionexpdate: "2025-12-08T14:30:00",
      },
      {
        id: 8,
        firstname: "Fiona",
        lastname: "Green",
        email: "fiona.green@example.com",
        mobile: "+39 06 1234 5678",
        country: "China",
        status: "Inactive",
        dob: "2025-12-08",
        subscriptionexpdate: "2025-12-08T14:30:00",
      },
      {
        id: 8,
        firstname: "Fiona",
        lastname: "Green",
        email: "fiona.green@example.com",
        mobile: "+39 06 1234 5678",
        country: "China",
        status: "Inactive",
        dob: "2025-12-08",
        subscriptionexpdate: "2025-12-08T14:30:00",
      },
      {
        id: 8,
        firstname: "Fiona",
        lastname: "Green",
        email: "fiona.green@example.com",
        mobile: "+39 06 1234 5678",
        country: "China",
        status: "Inactive",
        dob: "2025-12-08",
        subscriptionexpdate: "2025-12-08T14:30:00",
      },
      {
        id: 8,
        firstname: "Fiona",
        lastname: "Green",
        email: "fiona.green@example.com",
        mobile: "+39 06 1234 5678",
        country: "China",
        status: "Inactive",
        dob: "2025-12-08",
        subscriptionexpdate: "2025-12-08T14:30:00",
      },
      {
        id: 8,
        firstname: "Fiona",
        lastname: "Green",
        email: "fiona.green@example.com",
        mobile: "+39 06 1234 5678",
        country: "China",
        status: "Inactive",
        dob: "2025-12-08",
        subscriptionexpdate: "2025-12-08T14:30:00",
      },
      {
        id: 8,
        firstname: "Fiona",
        lastname: "Green",
        email: "fiona.green@example.com",
        mobile: "+39 06 1234 5678",
        country: "China",
        status: "Inactive",
        dob: "2025-12-08",
        subscriptionexpdate: "2025-12-08T14:30:00",
      },
      {
        id: 8,
        firstname: "Fiona",
        lastname: "Green",
        email: "fiona.green@example.com",
        mobile: "+39 06 1234 5678",
        country: "China",
        status: "Inactive",
        dob: "2025-12-08",
        subscriptionexpdate: "2025-12-08T14:30:00",
      },
      {
        id: 8,
        firstname: "Fiona",
        lastname: "Green",
        email: "fiona.green@example.com",
        mobile: "+39 06 1234 5678",
        country: "China",
        status: "Inactive",
        dob: "2025-12-08",
        subscriptionexpdate: "2025-12-08T14:30:00",
      },
      {
        id: 8,
        firstname: "Fiona",
        lastname: "Green",
        email: "fiona.green@example.com",
        mobile: "+39 06 1234 5678",
        country: "China",
        status: "Inactive",
        dob: "2025-12-08",
        subscriptionexpdate: "2025-12-08T14:30:00",
      },
      {
        id: 8,
        firstname: "Fiona",
        lastname: "Green",
        email: "fiona.green@example.com",
        mobile: "+39 06 1234 5678",
        country: "China",
        status: "Inactive",
        dob: "2025-12-08",
        subscriptionexpdate: "2025-12-08T14:30:00",
      },
      {
        id: 8,
        firstname: "Fiona",
        lastname: "Green",
        email: "fiona.green@example.com",
        mobile: "+39 06 1234 5678",
        country: "China",
        status: "Inactive",
        dob: "2025-12-08",
        subscriptionexpdate: "2025-12-08T14:30:00",
      },
      {
        id: 8,
        firstname: "Fiona",
        lastname: "Green",
        email: "fiona.green@example.com",
        mobile: "+39 06 1234 5678",
        country: "China",
        status: "Inactive",
        dob: "2025-12-08",
        subscriptionexpdate: "2025-12-08T14:30:00",
      },
    ];

    // Simulate async operation
    setUsers(sampleUsers);
  };

  // Define table columns for user data
  const columns = [
    {
      id: "id",
      label: "ID",
      sortable: true,
      tooltipFields: ["email", "mobile", "status"],
      defaultSort: true,
      type: "number",
    },
    {
      id: "firstname",
      label: "First Name",
      sortable: true,
      type: "string",
    },
    {
      id: "lastname",
      label: "Last Name",
      sortable: true,
      type: "string",
    },
    {
      id: "email",
      label: "Email",
      sortable: true,
      type: "string",
      width: 200,
      resizable: true,
    },
    {
      id: "mobile",
      label: "Mobile number",
      sortable: true,
      type: "string",
      width: 200,
      resizable: true,
    },
    {
      id: "country",
      label: "Country",
      sortable: true,
      type: "string",
    },
    { id: "status", label: "Status", sortable: true, type: "select" },
    {
      id: "dob",
      label: "Date",
      sortable: true,
      type: "Date",
      width: 140,
      resizable: true,
    },
    {
      id: "subscriptionexpdate",
      label: "Date Time",
      sortable: true,
      type: "DateTime",
      width: 200,
      resizable: true,
    },
    {
      id: "actions",
      label: "Actions",
      type: "actions",
      actions: ["edit"],
    },
  ];

  // Schema for the create popup (dynamic fields)
  const createSchema = [
    {
      name: "id",
      label: "ID",
      type: "text",
      required: true,
      disabled: true,
      length: 50,
      width: 6,
      inputWidth: "220px",
    },
    {
      name: "firstname",
      label: "First Name",
      type: "text",
      required: true,
      length: 50,
      width: 6,
      inputWidth: "220px",
    },
    {
      name: "lastname",
      label: "Last Name",
      type: "text",
      required: true,
      length: 50,
      width: 6,
      inputWidth: "220px",
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      required: true,
      length: 100,
      width: 6,
      inputWidth: "220px",
    },
    {
      name: "mobile",
      label: "Mobile Number",
      type: "text",
      required: true,
      length: 20,
      width: 6,
      inputWidth: "220px",
    },
    {
      name: "country",
      label: "Country",
      type: "select",
      options: [
        { value: "India", label: "India" },
        { value: "China", label: "China" },
        { value: "Pending", label: "Japan" },
      ],
      required: true,
      defaultValue: "India",
      width: 6,
      inputWidth: "220px",
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "Active", label: "Active" },
        { value: "Inactive", label: "Inactive" },
        { value: "Pending", label: "Pending" },
      ],
      required: true,
      defaultValue: "Active",
      width: 6,
      inputWidth: "220px",
    },
    {
      name: "dob",
      label: "Date of Birth",
      type: "Date",
      required: false,
      defaultValue: "",
      width: 6,
      inputWidth: "220px",
    },
    {
      name: "subscriptionexpdate",
      label: "Subscription Expiry Date",
      type: "DateTime",
      required: false,
      defaultValue: "",
      width: 6,
      inputWidth: "220px",
    },
  ];

  const searchSchema = [
    {
      name: "id",
      label: "ID",
      type: "text",
      required: true,
      disabled: true,
      length: 50,
      width: 6,
      inputWidth: "220px",
    },
    {
      name: "firstname",
      label: "First Name",
      type: "text",
      required: true,
      length: 50,
      width: 6,
      inputWidth: "220px",
    },
    {
      name: "lastname",
      label: "Last Name",
      type: "text",
      required: true,
      length: 50,
      width: 6,
      inputWidth: "220px",
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      required: true,
      length: 100,
      width: 6,
      inputWidth: "220px",
    },
    {
      name: "mobile",
      label: "Mobile Number",
      type: "text",
      required: true,
      length: 20,
      width: 6,
      inputWidth: "220px",
    },
    {
      name: "country",
      label: "Country",
      type: "select",
      options: [
        { value: "India", label: "India" },
        { value: "China", label: "China" },
        { value: "Pending", label: "Japan" },
      ],
      required: true,
      defaultValue: "India",
      width: 6,
      inputWidth: "220px",
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "Active", label: "Active" },
        { value: "Inactive", label: "Inactive" },
        { value: "Pending", label: "Pending" },
      ],
      required: true,
      defaultValue: "Active",
      width: 6,
      inputWidth: "220px",
    },
    // {
    //   name: "dob",
    //   label: "Date of Birth",
    //   type: "DateRange",
    //   required: false,
    //   defaultValue: "",
    //   width: 6,
    //   inputWidth: "250px",
    // },
    // {
    //   name: "subscriptionexpdate",
    //   label: "Subscription Expiry Date",
    //   type: "DateTimeRange",
    //   required: false,
    //   defaultValue: "",
    //   width: 6,
    //   inputWidth: "300px",
    // },
  ];

  const handleCreate = (values) => {
    // Map create form to the table row shape. Use next id if not provided.
    const maxId =
      users && users.length ? Math.max(...users.map((u) => u.id || 0)) : 0;
    const newRow = {
      id: (values.id && Number(values.id)) || maxId + 1,
      firstname: values.firstname || "",
      lastname: values.lastname || "",
      email: values.email || "",
      mobile: values.mobile || "",
      country: values.country || "",
      status: values.status || "Active",
    };
    setUsers((prev) => [newRow, ...(prev || [])]);
  };

  const handleEditRow = (valuesOrRow) => {
    // valuesOrRow may be either the original row object (if CommonDataTable
    // didn't open its own dialog), or the values returned from the edit dialog.
    const values = valuesOrRow || {};
    if (!values.id) {
      // If no id, nothing we can update reliably
      // eslint-disable-next-line no-console
      console.warn("Edit payload missing id", values);
      return;
    }

    setUsers((prev) =>
      (prev || []).map((u) =>
        u.id === Number(values.id) ? { ...u, ...values } : u
      )
    );
  };

  const handleDeleteRow = (row) => {
    if (!window.confirm(`Delete row ${row.id}?`)) return;
    setUsers((prev) => (prev || []).filter((u) => u.id !== row.id));
  };

  return (
    <Container sx={{ mt: 4 }}>
      {/* <Typography variant="h4" gutterBottom>
        Home Page – User List
      </Typography> */}

      <Box sx={{ mt: 3 }}>
        <CommonDataTable
          columns={columns}
          rows={users}
          createSchema={createSchema}
          searchSchema={searchSchema}
          onCreate={handleCreate}
          searchPlaceholder="Search users..."
          pageSize={10}
          onRowClick={(row) => console.log("Row clicked:", row)}
          onEditRow={handleEditRow}
          onDeleteRow={handleDeleteRow}
        />
      </Box>
    </Container>
  );
}
