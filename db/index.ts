import { Pool, QueryResult, QueryResultRow } from 'pg';
import dotenv from 'dotenv';

// Load environment variables before creating the pool
dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
});

export function query<T extends QueryResultRow = any>(
  text: string,
  callback: (err: Error, result: QueryResult<T>) => void
): void;
export function query<T extends QueryResultRow = any>(
  text: string,
  params: any[],
  callback: (err: Error, result: QueryResult<T>) => void
): void;
export function query<T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>>;
export function query<T extends QueryResultRow = any>(
  text: string,
  paramsOrCallback?: any[] | ((err: Error, result: QueryResult<T>) => void),
  callback?: (err: Error, result: QueryResult<T>) => void
): Promise<QueryResult<T>> | void {
  if (typeof paramsOrCallback === 'function') {
    pool.query<T>(text, paramsOrCallback as any);
    return;
  }
  if (callback) {
    pool.query<T>(text, paramsOrCallback || [], callback as any);
    return;
  }
  return pool.query<T>(text, paramsOrCallback || []);
}

export default {
  query,
};