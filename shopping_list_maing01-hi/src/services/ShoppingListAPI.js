const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    const error = (data && data.message) || response.statusText;
    return Promise.reject({ status: response.status, error });
  }
  return data;
};

const fetchShoppingLists = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/shopping-lists`);
    return handleResponse(response);
  } catch (error) {
    console.error('Fetch Shopping Lists Error:', error);
    throw error;
  }
};

const addShoppingList = async (newList) => {
  try {
    const response = await fetch(`${API_BASE_URL}/shopping-lists`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newList),
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Add Shopping List Error:', error);
    throw error;
  }
};

const updateShoppingList = async (listId, updatedList) => {
  try {
    const response = await fetch(`${API_BASE_URL}/shopping-lists/${listId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedList),
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Update Shopping List Error:', error);
    throw error;
  }
};

const deleteShoppingList = async (listId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/shopping-lists/${listId}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Delete Shopping List Error:', error);
    throw error;
  }
};

const shareShoppingList = async (listId, userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/shopping-lists/${listId}/share`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Share Shopping List Error:', error);
    throw error;
  }
};

const unshareShoppingList = async (listId, userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/shopping-lists/${listId}/share/${userId}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Unshare Shopping List Error:', error);
    throw error;
  }
};

export {
  fetchShoppingLists,
  addShoppingList,
  updateShoppingList,
  deleteShoppingList,
  shareShoppingList,
  unshareShoppingList
};
