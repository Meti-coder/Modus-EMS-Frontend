import React, { useEffect, useState } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const EditEmployeeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const adminId = localStorage.getItem("id");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    password: "",
    email: "",
    department: "",
    designation: "",
    phoneNumber: "",
    address: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Token expiration check and auto-logout
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        const timeout = setTimeout(() => {
          alert("Session expired. Please log in again.");
          localStorage.removeItem("token");
          navigate("/login");
        }, (decoded.exp - currentTime) * 1000);

        return () => clearTimeout(timeout);
      }
    } catch (err) {
      console.error("Invalid token:", err);
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate, token]);

  // ✅ Fetch employee data by ID
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/users/findEmployee/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch employee data");

        const data = await res.json();
        setFormData(data);
      } catch (err) {
        setError(err.message || "Error loading employee data");
      }
    };

    fetchEmployee();
  }, [id, token]);

  // ✅ Handle input change
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ✅ Submit update
  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:8080/api/users/updateEmployee/${adminId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          createdBy: { id: 1 },
          modifiedBy: { id: 1 },
        }),
      });

      if (!response.ok) throw new Error("Failed to update employee");

      navigate("/home");
    } catch (err) {
      setError(err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <h3>Edit Employee</h3>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleUpdate}>
        <Form.Group className="mb-3">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Department</Form.Label>
          <Form.Control
            name="department"
            value={formData.department}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Designation</Form.Label>
          <Form.Control
            name="designation"
            value={formData.designation}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Address</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </Form.Group>

        <Button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Employee"}
        </Button>
      </Form>
    </Container>
  );
};

export default EditEmployeeForm;