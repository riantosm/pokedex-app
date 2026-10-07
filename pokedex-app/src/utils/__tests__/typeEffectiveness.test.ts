import type { TypeRelations } from '@/types';
import { defensiveEffectiveness, formatMultiplier } from '../typeEffectiveness';

const r = (...names: string[]) => names.map(name => ({ name, url: '' }));

const fire: TypeRelations = {
  no_damage_to: [],
  half_damage_to: r('rock', 'fire', 'water', 'dragon'),
  double_damage_to: r('bug', 'steel', 'grass', 'ice'),
  no_damage_from: [],
  half_damage_from: r('bug', 'steel', 'fire', 'grass', 'ice', 'fairy'),
  double_damage_from: r('ground', 'rock', 'water'),
};

const grass: TypeRelations = {
  no_damage_to: [],
  half_damage_to: [],
  double_damage_to: [],
  no_damage_from: [],
  half_damage_from: r('ground', 'water', 'grass', 'electric'),
  double_damage_from: r('flying', 'poison', 'bug', 'fire', 'ice'),
};

const poison: TypeRelations = {
  no_damage_to: [],
  half_damage_to: [],
  double_damage_to: [],
  no_damage_from: [],
  half_damage_from: r('fighting', 'poison', 'bug', 'grass', 'fairy'),
  double_damage_from: r('ground', 'psychic'),
};

describe('defensiveEffectiveness', () => {
  it('satu tipe: Charmander (Fire)', () => {
    const e = defensiveEffectiveness([fire]);
    expect(e.weak.map(w => w.type).sort()).toEqual(['ground', 'rock', 'water']);
    expect(e.resist.map(w => w.type).sort()).toEqual([
      'bug',
      'fairy',
      'fire',
      'grass',
      'ice',
      'steel',
    ]);
    expect(e.immune).toEqual([]);
  });

  it('dua tipe: Bulbasaur (Grass/Poison) — ground saling meniadakan, grass jadi ×¼', () => {
    const e = defensiveEffectiveness([grass, poison]);
    expect(e.weak.map(w => w.type).sort()).toEqual([
      'fire',
      'flying',
      'ice',
      'psychic',
    ]);
    expect(e.resist.find(x => x.type === 'grass')?.multiplier).toBe(0.25);
    expect(e.weak.find(x => x.type === 'ground')).toBeUndefined();
    expect(e.resist.find(x => x.type === 'ground')).toBeUndefined();
  });

  it('kebal: no_damage_from → ×0', () => {
    const normal: TypeRelations = {
      ...fire,
      half_damage_from: [],
      double_damage_from: [],
      no_damage_from: r('ghost'),
    };
    expect(defensiveEffectiveness([normal]).immune).toEqual(['ghost']);
  });
});

describe('formatMultiplier', () => {
  it('pakai simbol pecahan', () => {
    expect(formatMultiplier(0.5)).toBe('×½');
    expect(formatMultiplier(0.25)).toBe('×¼');
    expect(formatMultiplier(4)).toBe('×4');
  });
});
