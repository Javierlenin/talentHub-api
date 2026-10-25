import request from 'supertest';
import app from './app';

describe('GET /vacancies', () => {
  it('responds with 200 and an array', async () => {
    const response = await request(app).get('/vacancies');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});

describe('POST /vacancies', () => {
  it('creates a vacancy and responds with 201', async () => {
    const payload = { title: 'QA Tester', company: 'Tech Andes', modality: 'presencial', salary: 800 };

    const response = await request(app).post('/vacancies').send(payload);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(payload);
    expect(response.body.id).toBeDefined();
  });

  it('responds with 400 when required fields are missing', async () => {
    const response = await request(app).post('/vacancies').send({ company: 'Tech Andes' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('El título, la empresa y la modalidad son obligatorios');
  });

  it('responds with 400 when salary is not a positive number', async () => {
    const response = await request(app)
      .post('/vacancies')
      .send({ title: 'QA Tester', company: 'Tech Andes', modality: 'remoto', salary: '900' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('El salario debe ser un número mayor que 0');
  });
});

const candidatePayload = { name: 'Ana Ruiz', email: 'ana@example.com', city: 'Quito', experienceYears: 3 };

describe('candidates', () => {
  it('lists candidates with 200', async () => {
    const response = await request(app).get('/candidates');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('creates a candidate with 201 and returns it by id', async () => {
    const created = await request(app).post('/candidates').send(candidatePayload);

    expect(created.status).toBe(201);
    expect(created.body).toMatchObject(candidatePayload);

    const found = await request(app).get(`/candidates/${created.body.id}`);
    expect(found.status).toBe(200);
    expect(found.body).toEqual(created.body);
  });

  it('responds with 400 and the broken rule message', async () => {
    const response = await request(app).post('/candidates').send({ name: 'Ana Ruiz', city: 'Quito' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('El nombre y el correo son obligatorios');
  });

  it('responds with 404 when the candidate does not exist', async () => {
    const response = await request(app).get('/candidates/99999');

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Candidato no encontrado');
  });

  it('updates a candidate with 200 and deletes it with 204', async () => {
    const created = await request(app).post('/candidates').send(candidatePayload);
    const updated = await request(app)
      .put(`/candidates/${created.body.id}`)
      .send({ ...candidatePayload, experienceYears: 5 });

    expect(updated.status).toBe(200);
    expect(updated.body.experienceYears).toBe(5);

    const deleted = await request(app).delete(`/candidates/${created.body.id}`);
    expect(deleted.status).toBe(204);
    expect(deleted.body).toEqual({});
  });

  it('responds with 400 when the id is not a number', async () => {
    const response = await request(app).get('/candidates/abc');

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('El identificador no es válido');
  });
});

describe('unknown routes', () => {
  it('responds with 404 in JSON', async () => {
    const response = await request(app).get('/unknown');

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Ruta no encontrada');
  });
});
 