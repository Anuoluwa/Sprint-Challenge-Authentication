const db = require('./dbConfig');
const Users = require('./auth-model');

beforeEach(async () => {
  await db('user').truncate();
});

describe('Users.insert', () => {
  it('is able to create new user to the db!', async () => {
    let user = await Users.get();
    expect(user).toHaveLength(0);
    await Users.insert({ username: 'John Doe', password: '12345' });
    await Users.insert({ username: 'Jane Doe', password: '12345' });
    user = await Users.get();
    expect(user).toHaveLength(2);
  });

  it('is able to insert the correct user', async () => {
    let user = await Users.get();
    expect(user).toHaveLength(0);
    await Users.insert({ username: 'John Doe', password: '12345' });
    await Users.insert({ username: 'Jane Doe', password: '12345' });
    user = await Users.get();

    expect(user[0].username).toBe('John Doe');
    expect(user[1].username).toBe('Jane Doe');
    expect(user[0].password).toHaveLength(1);
    expect(user[1].password).toHaveLength(1);
  });

  it('returns the newly inserted user', async () => {
    const user = await Users.insert({ username: 'John Doe' });
    expect(user.username).toBe('John Doe');
  });
});