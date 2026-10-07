import { createMigrate } from 'redux-persist';
import { PERSIST_VERSION, createMigrations } from '../migrations';

describe('migrasi persist', () => {
  const migrate = createMigrate(createMigrations('pokeApi'), { debug: false });

  it('v1 → v2 membuang cache API lama, favorit & pengaturan tetap', async () => {
    const v1 = {
      _persist: { version: 1, rehydrated: true },
      favorites: { items: [{ id: 25, name: 'pikachu' }] },
      pokeApi: { queries: { 'getPokemonSpecies(25)': {} } },
    };
    const migrated = (await migrate(v1, PERSIST_VERSION)) as Record<
      string,
      unknown
    >;
    expect(migrated.pokeApi).toBeUndefined();
    expect(migrated.favorites).toEqual(v1.favorites);
  });

  it('state versi terbaru tidak disentuh', async () => {
    const v2 = {
      _persist: { version: PERSIST_VERSION, rehydrated: true },
      pokeApi: { queries: {} },
    };
    expect(await migrate(v2, PERSIST_VERSION)).toEqual(v2);
  });
});
