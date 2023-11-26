const supertest = require('supertest');
const expect = require('chai').expect;
const app = require('../src/app');

describe('Shopping List Controller Tests', () => {
  let mockListId; // To store a list ID for testing other endpoints
  let mockItemId; // To store an item ID for testing item deletion

  // Test for POST /shopping-list
  describe('POST /shopping-list', () => {
    it('should create a shopping list', (done) => {
      supertest(app)
        .post('/shopping-list')
        .send({ name: 'Test List' })
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.include.keys('listId', 'name', 'createdAt', 'ownerId');
          mockListId = res.body.listId; // Save list ID for other tests
          done();
        });
    });
  });

  // Test for PUT /shopping-list
  describe('PUT /shopping-list', () => {
    it('should update a shopping list', (done) => {
      supertest(app)
        .put('/shopping-list')
        .send({ listId: mockListId, name: 'Updated List' })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.include.keys('listId', 'name', 'updatedAt');
          expect(res.body.name).to.equal('Updated List');
          done();
        });
    });
  });

  // Test for POST /shopping-list/item
  describe('POST /shopping-list/item', () => {
    it('should add an item to the shopping list', (done) => {
      supertest(app)
        .post('/shopping-list/item')
        .send({ listId: mockListId, itemName: 'Test Item' })
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.include.keys('itemId', 'itemName', 'addedAt');
          mockItemId = res.body.itemId; // Save item ID for delete test
          done();
        });
    });
  });

  // Test for PUT /shopping-list/share
  describe('PUT /shopping-list/share', () => {
    it('should share the shopping list with a user', (done) => {
      supertest(app)
        .put('/shopping-list/share')
        .send({ listId: mockListId, userId: 'user123' })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.include.keys('listId', 'userId', 'sharedAt');
          done();
        });
    });
  });

  // Test for DELETE /shopping-list/share
  describe('DELETE /shopping-list/share', () => {
    it('should unshare the shopping list with a user', (done) => {
      supertest(app)
        .delete('/shopping-list/share')
        .send({ listId: mockListId, userId: 'user123' })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.include.keys('listId', 'userId', 'unsharedAt');
          done();
        });
    });
  });

  // Test for DELETE /shopping-list
  describe('DELETE /shopping-list', () => {
    it('should delete a shopping list', (done) => {
      supertest(app)
        .delete('/shopping-list')
        .send({ listId: mockListId })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.include.keys('listId', 'deletedAt');
          done();
        });
    });
  });

});

describe('Shopping List Controller Tests - Failure Scenarios', () => {

  // Failing test for POST /shopping-list (no name provided)
  describe('POST /shopping-list (fail)', () => {
    it('should fail to create a shopping list without name', (done) => {
      supertest(app)
        .post('/shopping-list')
        .send({})
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.error).to.have.property('code');
          done();
        });
    });
  });

  // Failing test for PUT /shopping-list (list not found)
  describe('PUT /shopping-list (fail)', () => {
    it('should fail to update a non-existent shopping list', (done) => {
      supertest(app)
        .put('/shopping-list')
        .send({ listId: 'nonexistent', name: 'Updated List' })
        .expect(404)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.error).to.have.property('code');
          done();
        });
    });
  });

  // Failing test for DELETE /shopping-list (list not found)
  describe('DELETE /shopping-list (fail)', () => {
    it('should fail to delete a non-existent shopping list', (done) => {
      supertest(app)
        .delete('/shopping-list')
        .send({ listId: 'nonexistent' })
        .expect(404)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.error).to.have.property('code');
          done();
        });
    });
  });

  // Failing test for POST /shopping-list/item (list not found)
  describe('POST /shopping-list/item (fail)', () => {
    it('should fail to add an item to a non-existent shopping list', (done) => {
      supertest(app)
        .post('/shopping-list/item')
        .send({ listId: 'nonexistent', itemName: 'Test Item' })
        .expect(404)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.error).to.have.property('code');
          done();
        });
    });
  });

  // Failing test for DELETE /shopping-list/item (item not found)
  describe('DELETE /shopping-list/item (fail)', () => {
    it('should fail to remove a non-existent item from the shopping list', (done) => {
      supertest(app)
        .delete('/shopping-list/item')
        .send({ listId: 'valid-list-id', itemId: 'nonexistent' }) // Assume 'valid-list-id' exists
        .expect(404)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.error).to.have.property('code');
          done();
        });
    });
  });

  // Failing test for PUT /shopping-list/share (list not found)
  describe('PUT /shopping-list/share (fail)', () => {
    it('should fail to share a non-existent shopping list', (done) => {
      supertest(app)
        .put('/shopping-list/share')
        .send({ listId: 'nonexistent', userId: 'user123' })
        .expect(404)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.error).to.have.property('code');
          done();
        });
    });
  });

  // Failing test for DELETE /shopping-list/share (list not found)
  describe('DELETE /shopping-list/share (fail)', () => {
    it('should fail to unshare a non-existent shopping list', (done) => {
      supertest(app)
        .delete('/shopping-list/share')
        .send({ listId: 'nonexistent', userId: 'user123' })
        .expect(404)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.error).to.have.property('code');
          done();
        });
    });
  });

});
