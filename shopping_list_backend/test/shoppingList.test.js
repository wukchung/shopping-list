const supertest = require('supertest');
const expect = require('chai').expect;
const app = require('../src/app');

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

before(async () => {
  console.log('Connecting to MongoDB...');
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  mongoose.connection.on('connected', () => {
    console.log('MongoDB connected!');
  });

  mongoose.connection.on('error', (err) => {
    console.error(`MongoDB connection error: ${err}`);
    process.exit(-1);
  });

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

after(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Shopping List Controller Tests', () => {
  let mockListId; // To store a list ID for testing other endpoints
  let mockItemId; // To store an item ID for testing item deletion
  const shoppingListName = 'Test List';

  // Test for getting all shopping lists
  describe('GET /shopping-list', () => {
    it('should get all shopping lists', async () => {
      await supertest(app)
        .get('/shopping-list')
        .expect(200)
        .then((response) => {
          expect(response.body).to.be.an('array');
        });
    });
  });

  // Test for creating a shopping list
  describe('POST /shopping-list', () => {
    it('should create a shopping list', async () => {
      const res = await supertest(app)
        .post('/shopping-list')
        .send({ name: shoppingListName })
        .expect(201);

      expect(res.body).to.include.keys('listId', 'name', 'createdAt', 'ownerId');
      mockListId = res.body.listId; // Save list ID for other tests
    });
  });

// Test for getting all shopping lists
  describe('GET /shopping-list', () => {
    it('should get all shopping lists with correct items', async () => {
      const response = await supertest(app).get(`/shopping-list`).expect(200);

      expect(response.body).to.be.an("array").with.lengthOf(1);

      // Find the specific list by mockListId
      const specificList = response.body.find(
        (list) => list.listId === mockListId
      );

      // Check if the specific list exists
      expect(specificList).to.not.be.undefined;
      expect(specificList).to.have.property("name", shoppingListName);
    });
  });

  // Test for updating a shopping list
  describe('PUT /shopping-list', () => {
    it('should update a shopping list', async () => {
      await supertest(app)
        .put(`/shopping-list/${mockListId}`)
        .send({ name: 'Updated List' })
        .expect(200);
    });
  });

  // Test for getting items of a shopping list
  describe('GET /shopping-list/:listId', () => {
    it('should get items of a shopping list', async () => {
      await supertest(app)
        .get(`/shopping-list/${mockListId}`)
        .expect(200)
        .then((response) => {
          expect(response.body).to.be.an('array');
        });
    });
  });

  // Test for adding an item to a shopping list
  describe('POST /shopping-list/:listId/item', () => {
    it('should add an item to the shopping list', async () => {
      const res = await supertest(app)
        .post(`/shopping-list/${mockListId}/item`)
        .send({ itemName: 'Test Item' })
        .expect(201);

      expect(res.body).to.include.keys('itemId', 'itemName', 'addedAt');
      mockItemId = res.body.itemId; // Save item ID for delete test
    });
  });

  // Test for removing an item from a shopping list
  describe('DELETE /shopping-list/:listId/item/:itemId', () => {
    it('should remove an item from the shopping list', async () => {
      await supertest(app)
        .delete(`/shopping-list/${mockListId}/item/${mockItemId}`)
        .expect(200);
    });
  });

  // Test for sharing a shopping list
  describe('PUT /shopping-list/:listId/share', () => {
    it('should share the shopping list with a user', async () => {
      await supertest(app)
        .put(`/shopping-list/${mockListId}/share`)
        .send({ userId: 'user123' })
        .expect(200);
    });
  });

  // Test for unsharing a shopping list
  describe('DELETE /shopping-list/:listId/share', () => {
    it('should unshare the shopping list with a user', async () => {
      await supertest(app)
        .delete(`/shopping-list/${mockListId}/share`)
        .send({ userId: 'user123' })
        .expect(200);
    });
  });

  // Test for deleting a shopping list
  describe('DELETE shopping-list', () => {
    it('should delete a shopping list', async () => {
      await supertest(app)
        .delete(`/shopping-list/${mockListId}`)
        .send({ listId: mockListId })
        .expect(200);
    });
  });
});


describe('Shopping List Controller "Not Happy" Path Tests', () => {
  const incorrectId = "999999";
  const nonExistentId = "507f1f77bcf86cd799439011"; // Example non-existent ID for negative tests

  // Test for creating a shopping list with invalid data
  it("should not create a shopping list without a name", async () => {
    await supertest(app)
      .post("/shopping-list")
      .send({ wrongProperty: "Some Name" }) // Incorrect property
      .expect(400); // Bad Request
  });

  // Test for updating a incorect list ID
  it("should not update incorrect list ID", async () => {
    await supertest(app)
      .put(`/shopping-list/${incorrectId}`)
      .send({ name: "Updated List" })
      .expect(400); // Not Found
  });

  // Test for updating a non existent ID
  it("should not update a non-existent shopping list", async () => {
    await supertest(app)
      .put(`/shopping-list/${nonExistentId}`)
      .send({ name: "Updated List" })
      .expect(404); // Not Found
  });

  // Test for getting items of a non-existent shopping list
  it("should not get items of a non-existent shopping list", async () => {
    await supertest(app).get(`/shopping-list/${nonExistentId}`).expect(404); // Not Found
  });

  // Test for adding an item to a non-existent shopping list
  it("should not add an item to a non-existent shopping list", async () => {
    await supertest(app)
      .post(`/shopping-list/${nonExistentId}/item`)
      .send({ itemName: "Test Item" })
      .expect(404); // Not Found
  });

  // Test for removing an item from a non-existent shopping list
  it("should not remove an item from a non-existent shopping list", async () => {
    await supertest(app)
      .delete(`/shopping-list/${nonExistentId}/item/${nonExistentId}`)
      .expect(404); // Not Found
  });

  // Test for sharing a non-existent shopping list
  it("should not share a non-existent shopping list with a user", async () => {
    await supertest(app)
      .put(`/shopping-list/${nonExistentId}/share`)
      .send({ userId: "user123" })
      .expect(404); // Not Found
  });

  // Test for unsharing a non-existent shopping list
  it("should not unshare a non-existent shopping list with a user", async () => {
    await supertest(app)
      .delete(`/shopping-list/${nonExistentId}/share`)
      .send({ userId: "user123" })
      .expect(404); // Not Found
  });

  // Test for deleting a non-existent shopping list
  it("should not delete a non-existent shopping list", async () => {
    await supertest(app).delete(`/shopping-list/${nonExistentId}`).expect(404); // Not Found
  });
});

