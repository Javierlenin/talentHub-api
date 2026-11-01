import 'dotenv/config';

import { execFileSync } from 'node:child_process';

import { MongoClient } from 'mongodb';

import { createMongoClient } from '../../../../shared/database/mongoClient';
import { MongoCompanyRepository } from './MongoCompanyRepository';

const sampleCompany = {
  name: 'Tech Andes',
  industry: 'Tecnología',
  benefits: ['Seguro médico', 'Trabajo remoto'],
  socialLinks: { linkedin: 'https://linkedin.com/company/techandes' },
  locations: [{ city: 'Quito' }, { city: 'Guayaquil' }],
};

const testUri = process.env.MONGODB_TEST_URI;

const mongoIsReachable = (): boolean => {
  if (!testUri || testUri === process.env.MONGODB_URI) {
    return false;
  }

  try {
    execFileSync(
      process.execPath,
      [
        '-e',
        'const net = require("net"); const url = new URL(process.argv[1]); const socket = net.connect(Number(url.port || 27017), url.hostname); const done = (code) => { socket.destroy(); process.exit(code); }; socket.setTimeout(1000); socket.once("connect", () => done(0)); socket.once("timeout", () => done(1)); socket.once("error", () => done(1));',
        testUri,
      ],
      { timeout: 3000, stdio: 'ignore' },
    );
    return true;
  } catch {
    return false;
  }
};

const describeWithMongo = mongoIsReachable() ? describe : describe.skip;

describeWithMongo('MongoCompanyRepository', () => {
  let client: MongoClient;
  let repository: MongoCompanyRepository;

  beforeAll(() => {
    client = createMongoClient(testUri as string);
    repository = new MongoCompanyRepository(client);
  });

  beforeEach(async () => {
    await client.db().collection('companies').deleteMany({});
  });

  afterAll(async () => {
    await client.close();
  });

  it('starts empty', async () => {
    expect(await repository.findAll()).toEqual([]);
  });

  it('saves a company with its flexible data and assigns a text id', async () => {
    const saved = await repository.save(sampleCompany);

    expect(saved.id).toMatch(/^[0-9a-f]{24}$/);
    expect(saved).toEqual({ id: saved.id, ...sampleCompany });
  });

  it('lists what was saved', async () => {
    const saved = await repository.save(sampleCompany);

    expect(await repository.findAll()).toEqual([saved]);
  });

  it('finds a company by id', async () => {
    const saved = await repository.save(sampleCompany);

    expect(await repository.findById(saved.id)).toEqual(saved);
  });

  it('returns undefined when the id does not exist or is not valid', async () => {
    expect(await repository.findById('507f1f77bcf86cd799439011')).toBeUndefined();
    expect(await repository.findById('abc')).toBeUndefined();
  });
});
