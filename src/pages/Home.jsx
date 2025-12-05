import { useEffect, useState } from "react";
import { Container, Typography, Box } from "@mui/material";

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
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+1 (555) 123-4567",
        country: "USA",
        status: "Active",
      },
      {
        id: 2,
        name: "Jane Smith",
        email: "jane.smith@example.com",
        phone: "+1 (555) 234-5678",
        country: "Canada",
        status: "Active",
      },
      {
        id: 3,
        name: "Bob Johnson",
        email: "bob.johnson@example.com",
        phone: "+44 (0) 20 7946 0958",
        country: "UK",
        status: "Inactive",
      },
      {
        id: 4,
        name: "Alice Williams",
        email: "alice.williams@example.com",
        phone: "+61 2 9999 9999",
        country: "Australia",
        status: "Active",
      },
      {
        id: 5,
        name: "Charlie Brown",
        email: "charlie.brown@example.com",
        phone: "+33 1 42 34 56 78",
        country: "France",
        status: "Pending",
      },
      {
        id: 6,
        name: "Diana Prince",
        email: "diana.prince@example.com",
        phone: "+49 30 1234 5678",
        country: "Germany",
        status: "Active",
      },
      {
        id: 7,
        name: "Edward Norton",
        email: "edward.norton@example.com",
        phone: "+81 3-1234-5678",
        country: "Japan",
        status: "Active",
      },
      {
        id: 8,
        name: "Fiona Green",
        email: "fiona.green@example.com",
        phone: "+39 06 1234 5678",
        country: "Italy",
        status: "Inactive",
      },
      {
        id: 5,
        name: "Charlie Brown",
        email: "charlie.brown@example.com",
        phone: "+33 1 42 34 56 78",
        country: "France",
        status: "Pending",
      },
      {
        id: 6,
        name: "Diana Prince",
        email: "diana.prince@example.com",
        phone: "+49 30 1234 5678",
        country: "Germany",
        status: "Active",
      },
      {
        id: 7,
        name: "Edward Norton",
        email: "edward.norton@example.com",
        phone: "+81 3-1234-5678",
        country: "Japan",
        status: "Active",
      },
      {
        id: 8,
        name: "Fiona Green",
        email: "fiona.green@example.com",
        phone: "+39 06 1234 5678",
        country: "Italy",
        status: "Inactive",
      },
      {
        id: 7,
        name: "Edward Norton",
        email: "edward.norton@example.com",
        phone: "+81 3-1234-5678",
        country: "Japan",
        status: "Active",
      },
      {
        id: 8,
        name: "Fiona Green",
        email: "fiona.green@example.com",
        phone: "+39 06 1234 5678",
        country: "Italy",
        status: "Inactive",
      },
      {
        id: 7,
        name: "Edward Norton",
        email: "edward.norton@example.com",
        phone: "+81 3-1234-5678",
        country: "Japan",
        status: "Active",
      },
      {
        id: 8,
        name: "Fiona Green",
        email: "fiona.green@example.com",
        phone: "+39 06 1234 5678",
        country: "Italy",
        status: "Inactive",
      },
      {
        id: 7,
        name: "Edward Norton",
        email: "edward.norton@example.com",
        phone: "+81 3-1234-5678",
        country: "Japan",
        status: "Active",
      },
      {
        id: 8,
        name: "Fiona Green",
        email: "fiona.green@example.com",
        phone: "+39 06 1234 5678",
        country: "Italy",
        status: "Inactive",
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
      tooltipFields: ["email", "phone", "status"],
    },
    {
      id: "name",
      label: "Name",
      sortable: true,
    },
    { id: "email", label: "Email", sortable: true },
    { id: "phone", label: "Phone", sortable: true },
    {
      id: "country",
      label: "Country",
      sortable: true,
    },
    { id: "status", label: "Status", sortable: true },
  ];

  return (
    <Container sx={{ mt: 4 }}>
      {/* <Typography variant="h4" gutterBottom>
        Home Page – User List
      </Typography> */}

      <Box sx={{ mt: 3 }}>
        <CommonDataTable
          columns={columns}
          rows={users}
          searchPlaceholder="Search users..."
          pageSize={10}
          onRowClick={(row) => console.log("Row clicked:", row)}
        />
      </Box>
    </Container>
  );
}
