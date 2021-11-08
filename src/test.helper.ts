import { getConnection } from 'typeorm';

export function clearDB() {
  const entities = getConnection().entityMetadatas;
  for (const entity of entities) {
    console.log(entity);
  }
}
