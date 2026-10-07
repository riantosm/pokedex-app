import reducer from '../networkSlice';

const initial = reducer(undefined, { type: '@@init' });

describe('networkSlice', () => {
  it('request gagal tanpa response → API tidak terjangkau', () => {
    const state = reducer(initial, {
      type: 'pokeApi/executeQuery/rejected',
      payload: { status: null, message: 'Network Error' },
    });
    expect(state.apiUnreachable).toBe(true);
  });

  it('error HTTP (ada response) bukan tanda offline', () => {
    const state = reducer(initial, {
      type: 'pokeApi/executeQuery/rejected',
      payload: { status: 404, message: 'Not Found' },
    });
    expect(state.apiUnreachable).toBe(false);
  });

  it('rejected tanpa payload (kondisi cache) diabaikan', () => {
    const state = reducer(initial, { type: 'pokeApi/executeQuery/rejected' });
    expect(state.apiUnreachable).toBe(false);
  });

  it('request berhasil → kembali terjangkau', () => {
    const offline = { apiUnreachable: true };
    expect(
      reducer(offline, { type: 'pokeApi/executeQuery/fulfilled' })
        .apiUnreachable,
    ).toBe(false);
  });

  it('action di luar pokeApi diabaikan', () => {
    const offline = { apiUnreachable: true };
    expect(
      reducer(offline, { type: 'favorites/toggleFavorite' }).apiUnreachable,
    ).toBe(true);
  });
});
