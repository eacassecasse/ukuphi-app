const request = require('supertest');
const app = require('../app'); // Your main app file

describe('POST /api/v1/posts', () => {
  it('should create a new post and return 201 status', async () => {
    const response = await request(app)
      .post('/api/v1/posts')
      .send({
        title: 'Test Post Title',
        content: 'Test post content',
      });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe('Test Post Title');
  });

  it('should return 400 for invalid input', async () => {
    const response = await request(app)
      .post('/api/v1/posts')
      .send({ title: '', content: '' });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Title is required');
  });
});

describe('GET /api/v1/posts', () => {
  it('should return a list of posts', async () => {
    const response = await request(app).get('/api/v1/posts');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('posts');
    expect(response.body.posts.length).toBeGreaterThan(0);
  });

  it('should return 404 if no posts are found', async () => {
    // Assuming db returns empty array when no posts are available
    const response = await request(app).get('/api/v1/posts');
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'No posts found');
  });
});

describe('GET /api/v1/posts/:id', () => {
  it('should return a single post by ID', async () => {
    // Assuming 1 is a valid post ID
    const response = await request(app).get('/api/v1/posts/1');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', 1);
  });

  it('should return 404 for non-existing post ID', async () => {
    const response = await request(app).get('/api/v1/posts/999');
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Post not found');
  });
});

describe('PATCH /api/v1/posts/:id', () => {
  it('should update the post and return 200 status', async () => {
    const response = await request(app)
      .patch('/api/v1/posts/1')
      .send({
        title: 'Updated Post Title',
        content: 'Updated content',
      });
    expect(response.status).toBe(200);
    expect(response.body.title).toBe('Updated Post Title');
  });

  it('should return 403 for unauthorized updates', async () => {
    const response = await request(app)
      .patch('/api/v1/posts/999') // Assuming this post belongs to another user
      .send({
        title: 'Unauthorized Update Attempt',
      });
    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty('message', 'You are not authorized to update this post');
  });
});

describe('DELETE /api/v1/posts/:id', () => {
  it('should delete the post and return 200 status', async () => {
    const response = await request(app).delete('/api/v1/posts/1');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Post deleted successfully');
  });

  it('should return 404 for non-existing post ID', async () => {
    const response = await request(app).delete('/api/v1/posts/999');
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Post not found');
  });
});
