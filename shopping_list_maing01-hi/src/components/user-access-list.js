import React, { useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import {
  Lsi,
} from "uu5g05";
import importLsi from "../lsi/import-lsi.js";

const UserAccessList = () => {
  // Hardcoded user data
  const [users, setUsers] = useState([
    { name: 'John Doe', email: 'john.doe@example.com' },
    { name: 'Jane Smith', email: 'jane.smith@example.com' },
  ]);

  // State for adding new user
  const [newUserEmail, setNewUserEmail] = useState('');
  const [addingUser, setAddingUser] = useState(false);

  const handleAddUser = () => {
    // Check if user email exists in the hardcoded list
    const userExists = users.some(user => user.email === newUserEmail);
    if (userExists) {
      alert('User already exists!');
    } else {
      alert('User not found!');
    }
    setNewUserEmail('');
    setAddingUser(false);
  };

  const handleDeleteUser = (email) => {
    setUsers(users.filter(user => user.email !== email));
  };

  return (
    <div>
      {!addingUser && (
        <Button variant="contained" onClick={() => setAddingUser(true)}>
          <Lsi import={importLsi} path={["AccessList", "share"]} />
        </Button>
      )}
      {addingUser && (
        <TextField
          label=<Lsi import={importLsi} path={["AccessList", "  "]} />
          value={newUserEmail}
          onChange={(e) => setNewUserEmail(e.target.value)}
          onBlur={handleAddUser}
          autoFocus
        />
      )}
      <List>
        {users.map((user, index) => (
          <ListItem key={index}>
            <ListItemText primary={user.name} secondary={user.email} />
            <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteUser(user.email)}>
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default UserAccessList;
