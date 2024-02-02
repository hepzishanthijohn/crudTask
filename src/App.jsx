// App.js
import React from 'react';
import {Route,Routes } from 'react-router-dom';
import UserDetail from './components/UserDetail';
import UserTable from './components/UserTable';

import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  return (
    <Routes>
          
          <Route path="/" element={<UserTable/>}/>
          <Route path="/user/:id" element={<UserDetail/>} />  
    </Routes>
  );
};

export default App;



export const ReadOperation=() =>{
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleShowUserDetails = (userId) => {
    setSelectedUserId(userId);
    const selectedUser = users.find(user => user.id === userId);
    if (selectedUser) {
      setName(selectedUser.name);
      setEmail(selectedUser.email);
    }
  };

  return (
    <>
      
      <h1>Users</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {selectedUserId === user.id ? (
              <>
                <div>Name: {name}</div>
                <div>Email: {email}</div>
              </>
            ) : (
              <>
                {user.name} - {user.email}
                <button onClick={() => handleShowUserDetails(user.id)}>Read</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}


