import React, { useEffect, useState } from "react";
import {
  Table,
  Container,
  Card,
  Button,
  Spinner,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';


const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [remainingTime, setRemainingTime] = useState(null); // Timer state
  const navigate = useNavigate();

  const pageSize = 4;
  const token = localStorage.getItem("token");

  // Decode and set timer
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const exp = decoded.exp * 1000; // JWT exp is in seconds
        const now = Date.now();
        const timeLeft = exp - now;

        if (timeLeft <= 0) {
          handleSessionExpired();
        } else {
          setRemainingTime(Math.floor(timeLeft / 1000));

          const timerInterval = setInterval(() => {
            setRemainingTime((prev) => {
              if (prev <= 1) {
                clearInterval(timerInterval);
                handleSessionExpired();
                return 0;
              }
              return prev - 1;
            });
          }, 1000);

          return () => clearInterval(timerInterval);
        }
      } catch (err) {
        console.error("Invalid token");
        handleSessionExpired();
      }
    } else {
      handleSessionExpired();
    }
  }, [token]);

  const handleSessionExpired = () => {
    alert("Session expired. Please log in again.");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const fetchData = async (pageNumber) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/users/getEmployees?page=${pageNumber}&size=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setUsers(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleEdit = (userId) => {
    navigate(`/editEmployee/${userId}`);
  };

  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this employee?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/users/delete/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert(result.message || "Employee deleted successfully.");
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      } else {
        alert(result.message || "Failed to delete employee.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Something went wrong while deleting the employee.");
    }
  };

  // Helper function to format seconds to MM:SS
  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const sec = (seconds % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  };

  return (
    <Container className="mt-4">
      {/* Session Timer Display */}
      {remainingTime !== null && (
        <Alert variant={remainingTime <= 10 ? "danger" : "info"} className="text-center fw-bold">
          Session expires in: {formatTime(remainingTime)}
        </Alert>
      )}

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <Button variant="primary" onClick={() => navigate("/addEmployeeForm")}>
            Add Employee
          </Button>
          <Button variant="danger" className="ms-2" onClick={handleLogout}>
            Logout
          </Button>
        </div>
        <h3 className="mb-0 text-dark fw-bold">Employee List</h3>
      </div>

      <Card className="shadow">
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <Table striped bordered hover responsive>
              <thead className="table-dark text-center">
                <tr>
                  <th>Id</th>
                  <th>Firstname</th>
                  <th>Lastname</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id} className="text-center align-middle">
                      <td>{user.id}</td>
                      <td>{user.firstName}</td>
                      <td>{user.lastName}</td>
                      <td>{user.department}</td>
                      <td>{user.designation}</td>
                      <td>{user.phoneNumber}</td>
                      <td>{user.address}</td>
                      <td>
                        <Button
                          variant="success"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEdit(user.id)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(user.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center text-muted">
                      No employee data available.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}

          {/* Pagination */}
          <Row className="justify-content-center mt-3">
            <Col xs="auto">
              <Button
                variant="secondary"
                onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                disabled={page === 0}
              >
                Previous
              </Button>
            </Col>
            <Col xs="auto" className="d-flex align-items-center">
              <span>
                Page {page + 1} of {totalPages}
              </span>
            </Col>
            <Col xs="auto">
              <Button
                variant="secondary"
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
                disabled={page + 1 >= totalPages}
              >
                Next
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default UserTable;
