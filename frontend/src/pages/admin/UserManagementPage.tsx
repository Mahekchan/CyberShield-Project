import React, { useEffect, useState } from "react";
import axios from "axios";
import { io, Socket } from "socket.io-client";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

type StudentProfile = {
  _id?: string;
  userId: string;
  fullName: string;
  emailAddress: string;
  mobileNumber: string;
  studentClass: string;
  dateOfBirth: string;
  gender: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
};

const UserManagementPage: React.FC = () => {
  const theme = useTheme();
  const [users, setUsers] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let socket: Socket | null = null;

    // Fetch users from API
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await axios.get<{ users: StudentProfile[] }>(
          "http://localhost:5000/api/users"
        );
        // If response is an array, use it directly
        setUsers(Array.isArray(res.data) ? res.data : res.data.users || []);
      } catch {
        setUsers([]);
      }
      setLoading(false);
    };

    fetchUsers();

    // Connect to Socket.IO for real-time updates
    socket = io("http://localhost:5000");
    socket.on("usersUpdate", (data: { users: StudentProfile[] }) => {
      // If data is an array, use it directly; else use data.users
      if (Array.isArray(data)) {
        setUsers(data);
      } else if (data && Array.isArray(data.users)) {
        setUsers(data.users);
      }
    });

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  return (
    <Box sx={{ p: 2 }}>
      <Typography
        variant="h4"
        fontWeight={800}
        mb={3}
        sx={{ color: "#0e0f0fff" }} // Set heading color to white
      >
        User Management
      </Typography>
      <Paper sx={{ p: 2, borderRadius: 3, overflowX: "auto" }}>
        {loading ? (
          <Box sx={{ textAlign: "center", py: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>Full Name</b>
                </TableCell>
                <TableCell>
                  <b>Email</b>
                </TableCell>
                <TableCell>
                  <b>Mobile</b>
                </TableCell>
                <TableCell>
                  <b>Class</b>
                </TableCell>
                <TableCell>
                  <b>DOB</b>
                </TableCell>
                <TableCell>
                  <b>Gender</b>
                </TableCell>
                <TableCell>
                  <b>Parent Name</b>
                </TableCell>
                <TableCell>
                  <b>Parent Email</b>
                </TableCell>
                <TableCell>
                  <b>Parent Phone</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user, idx) => (
                  <TableRow key={user.userId || user._id || idx}>
                    <TableCell>{user.fullName}</TableCell>
                    <TableCell>{user.emailAddress}</TableCell>
                    <TableCell>{user.mobileNumber}</TableCell>
                    <TableCell>{user.studentClass}</TableCell>
                    <TableCell>{user.dateOfBirth?.slice(0, 10)}</TableCell>
                    <TableCell>{user.gender}</TableCell>
                    <TableCell>{user.parentName}</TableCell>
                    <TableCell>{user.parentEmail}</TableCell>
                    <TableCell>{user.parentPhone}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Box>
  );
};

export default UserManagementPage;
