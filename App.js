import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editingItem, setEditingItem] = useState(null);

  // Fetch items
  const fetchItems = async () => {
    const response = await axios.get('http://127.0.0.1:5000/items');
    setItems(response.data);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Add or update item
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingItem) {
      await axios.put(`http://127.0.0.1:5000/item/${editingItem.id}`, {
        name,
        description,
      });
    } else {
      await axios.post('http://127.0.0.1:5000/item', { name, description });
    }
    fetchItems();
    setName('');
    setDescription('');
    setEditingItem(null);
  };

  // Edit item
  const handleEdit = (item) => {
    setName(item.name);
    setDescription(item.description);
    setEditingItem(item);
  };

  // Delete item
  const handleDelete = async (id) => {
    await axios.delete(`http://127.0.0.1:5000/item/${id}`);
    fetchItems();
  };

  return (
    <div className="App">
      <h1>CRUD Application</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">{editingItem ? 'Update' : 'Add'} Item</button>
      </form>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <strong>{item.name}</strong>: {item.description}
            <button onClick={() => handleEdit(item)}>Edit</button>
            <button onClick={() => handleDelete(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
