// utils/userPool.js
const userPool = [];

export const addUser = (user) => {
  userPool.push(user);
};

export const removeUser = (user) => {
  const index = userPool.findIndex(u => u.id === user.id);
  if (index > -1) {
    userPool.splice(index, 1);
  }
};

export const findPeerToConnect = (currentUserId) => {
  return userPool.find(u => u.id !== currentUserId);
};
