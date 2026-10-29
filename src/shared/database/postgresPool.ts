import { Pool } from 'pg';

// Crea el conjunto de conexiones a partir de la cadena DATABASE_URL.
export const createPostgresPool = (connectionString: string): Pool => new Pool({ connectionString });
