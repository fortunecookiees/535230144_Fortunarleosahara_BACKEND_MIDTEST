const usersRepository = require('./users-repository');
const { hashPassword, passwordMatched } = require('../../../utils/password');

/**
 * Get list of users
 * @returns {Array}
 */
async function getUsers({
  page_number = 1,
  page_size = null,
  sort = 'email:asc',
  search = null,
}) {
  page_number = parseInt(page_number); //untuk dirubah menjadi angka integer
  page_size = parseInt(page_size); 
  if (!page_size || page_size <= 0) {
    page_size = null;
  }
  let [sortField, sortOrder] = sort.split(':'); //split untuk memisahkan string sort menjadi dua bagian
  if (!['email', 'name'].includes(sortField)) {
    sortField = 'email';
  }
  sortOrder = sortOrder.toLowerCase();
  if (!['asc', 'desc'].includes(sortOrder)) { //untuk memastikan kebenaran sorting nilainya asc atau desc
    sortOrder = 'asc';
  }
  let searchField = null;
  let searchKey = null;
  if (search) {
    const parts = search.split(':');
    if (parts.length === 2 && ['email', 'name'].includes(parts[0])) { //validasi format search sesuai kriteria
      searchField = parts[0];
      searchKey = parts[1];
    }
  }

  const users = await usersRepository.getUsers();
  let filteredUsers = users;
  if (searchField && searchKey) {
    const searchRegex = new RegExp(searchKey, 'i');
    filteredUsers = users.filter((user) => searchRegex.test(user[searchField]));
  }

  filteredUsers.sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    if (sortOrder === 'asc') {
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });

  let startIndex = (page_number - 1) * page_size;
  let endIndex = startIndex + page_size;
  if (!page_size) {
    startIndex = 0;
    endIndex = filteredUsers.length;
  }
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
  return {
    page_number,
    page_size: page_size || filteredUsers.length,
    count: paginatedUsers.length,
    total_pages: page_size ? Math.ceil(filteredUsers.length / page_size) : 1,
    has_previous_page: page_number > 1,
    has_next_page: endIndex < filteredUsers.length,
    data: paginatedUsers.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
    })),
  };
}


/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Object}
 */
async function getUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {boolean}
 */
async function createUser(name, email, password) {
  // Hash password
  const hashedPassword = await hashPassword(password);

  try {
    await usersRepository.createUser(name, email, hashedPassword);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {boolean}
 */
async function updateUser(id, name, email) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.updateUser(id, name, email);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {boolean}
 */
async function deleteUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.deleteUser(id);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Check whether the email is registered
 * @param {string} email - Email
 * @returns {boolean}
 */
async function emailIsRegistered(email) {
  const user = await usersRepository.getUserByEmail(email);

  if (user) {
    return true;
  }

  return false;
}

/**
 * Check whether the password is correct
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function checkPassword(userId, password) {
  const user = await usersRepository.getUser(userId);
  return passwordMatched(password, user.password);
}

/**
 * Change user password
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function changePassword(userId, password) {
  const user = await usersRepository.getUser(userId);

  // Check if user not found
  if (!user) {
    return null;
  }

  const hashedPassword = await hashPassword(password);

  const changeSuccess = await usersRepository.changePassword(
    userId,
    hashedPassword
  );

  if (!changeSuccess) {
    return null;
  }

  return true;
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  emailIsRegistered,
  checkPassword,
  changePassword,
};
