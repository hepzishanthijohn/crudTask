import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [editedEmail, setEditedEmail] = useState('');
  const [editedPhone, setEditedPhone] = useState('');
  const [editedWebsite, setEditedWebsite] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserWebsite, setNewUserWebsite] = useState('');
  const [newUserAddress, setNewUserAddress] = useState({}); 
  const [editedAddress, setEditedAddress] = useState({}); 

  useEffect(() => {
    axios.get(`https://jsonplaceholder.typicode.com/users`)
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  }, []);

  const deleteUser = (id) => {
    axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`)
      .then(response => {
        setUsers(users.filter(user => user.id !== id));
      })
      .catch(error => {
        console.error('Error deleting user:', error);
      });
  };

  const handleEdit = (id, name, email,phone,website, address) => {
    setEditingUserId(id);
    setEditedName(name);
    setEditedEmail(email);
    setEditedPhone(phone);
    setEditedWebsite(website)
    setEditedAddress(address);
  };

  const handleSave = () => {
    axios.put(`https://jsonplaceholder.typicode.com/users/${editingUserId}`, {
      name: editedName,
      email: editedEmail,
      phone: editedPhone,
      website: editedWebsite,
      address: editedAddress // Include edited address
    })
    .then(response => {
      setUsers(users.map(user => {
        if (user.id === editingUserId) {
          return {
            ...user,
            name: editedName,
            email: editedEmail,
            phone: editedPhone,
            website: editedWebsite,
            address: editedAddress // Update user's address
          };
        }
        return user;
      }));
      setEditingUserId(null);
      setEditedName('');
      setEditedEmail('');
      setEditedPhone('');
      setEditedWebsite('');
      setEditedAddress({});
    })
    .catch(error => {
      console.error('Error updating user:', error);
    });
  };

  const handleAddUser = () => {
    axios.post(`https://jsonplaceholder.typicode.com/users`, {
      name: newUserName,
      email: newUserEmail,
      phone: newUserPhone,
      website: newUserWebsite,
      address: newUserAddress // Include new address
    })
    .then(response => {
      setUsers([...users, response.data]);
      setNewUserName('');
      setNewUserEmail('');
      setNewUserPhone('');
      setNewUserWebsite('');
      setNewUserAddress({});
    })
    .catch(error => {
      console.error('Error adding user:', error);
    });
  };

  return (
    <>
    <Navbar/>
    <div>
      
      <h2>Add User</h2>
      <div>
        <input type="text" value={newUserName} onChange={e => setNewUserName(e.target.value)} placeholder="Name" />
        <input type="text" value={newUserEmail} onChange={e => setNewUserEmail(e.target.value)} placeholder="Email" />
        <input type="text" value={newUserPhone} onChange={e => setNewUserPhone(e.target.value)} placeholder="Phone" />
        <input type="text" value={newUserWebsite} onChange={e => setNewUserWebsite(e.target.value)} placeholder="Website" />
        {/* Address inputs */}
        <input type="text" value={newUserAddress.street} onChange={e => setNewUserAddress({...newUserAddress, street: e.target.value})} placeholder="Street" />
        <input type="text" value={newUserAddress.city} onChange={e => setNewUserAddress({...newUserAddress, city: e.target.value})} placeholder="City" />
        <input type="text" value={newUserAddress.zipcode} onChange={e => setNewUserAddress({...newUserAddress, zipcode: e.target.value})} placeholder="Zipcode" />
        <button onClick={handleAddUser}>Add User</button>
      </div>
      <h2>User Table</h2>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Website</th>
            <th>Address</th> {/* Extra information */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{editingUserId === user.id ? <input type="text" value={editedName} onChange={e => setEditedName(e.target.value)} /> : user.name}</td>
              <td>{editingUserId === user.id ? <input type="text" value={editedEmail} onChange={e => setEditedEmail(e.target.value)} /> : user.email}</td>
              <td>{editingUserId === user.id ? <input type="number" value={editedPhone} onChange={e => setEditedPhone(e.target.value)} /> : user.phone}</td>
              <td>{editingUserId === user.id ? <input type="text" value={editedWebsite} onChange={e => setEditedWebsite(e.target.value)} /> : user.website}</td>
              
              <td>{user.address ? `${user.address.street}, ${user.address.city}, ${user.address.zipcode}` : ''}</td> {/* Display address */}
              <td>
                {editingUserId === user.id ? (
                  <>
                    <button className="btn btn-success" onClick={handleSave}>Save</button>
                    <button className="btn btn-secondary ml-2" onClick={() => setEditingUserId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button className="btn btn-primary mr-2" onClick={() => handleEdit(user.id, user.name, user.email, user.address)}>Edit</button>
                  </>
                )}
                <Link to={`/user/${user.id}`} className="btn btn-primary mr-2">Read</Link>
                <button className="btn btn-danger" onClick={() => deleteUser(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
</>
      );
};

export default UserTable;
