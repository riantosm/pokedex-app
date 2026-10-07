import {
  POKEMON_TYPE_NAMES,
  type PokemonTypeName,
  type TypeRelations,
} from '@/types';

export interface TypeEffectiveness {
  /** Damage ×2 atau ×4, terurut dari yang paling besar. */
  weak: { type: PokemonTypeName; multiplier: number }[];
  /** Damage ×½ atau ×¼. */
  resist: { type: PokemonTypeName; multiplier: number }[];
  /** Damage ×0. */
  immune: PokemonTypeName[];
}

/**
 * Hitung efektivitas serangan terhadap Pokémon dengan satu atau dua tipe.
 * `relations` = `damage_relations` dari `GET /type/{name}` untuk setiap tipe Pokémon itu.
 */
export function defensiveEffectiveness(
  relations: TypeRelations[],
): TypeEffectiveness {
  const multipliers = new Map<PokemonTypeName, number>(
    POKEMON_TYPE_NAMES.map(t => [t, 1]),
  );
  const apply = (names: { name: string }[], factor: number) => {
    for (const { name } of names) {
      const current = multipliers.get(name as PokemonTypeName);
      if (current !== undefined) {
        multipliers.set(name as PokemonTypeName, current * factor);
      }
    }
  };

  for (const r of relations) {
    apply(r.double_damage_from, 2);
    apply(r.half_damage_from, 0.5);
    apply(r.no_damage_from, 0);
  }

  const result: TypeEffectiveness = { weak: [], resist: [], immune: [] };
  for (const [type, multiplier] of multipliers) {
    if (multiplier === 0) {
      result.immune.push(type);
    } else if (multiplier > 1) {
      result.weak.push({ type, multiplier });
    } else if (multiplier < 1) {
      result.resist.push({ type, multiplier });
    }
  }
  result.weak.sort((a, b) => b.multiplier - a.multiplier);
  result.resist.sort((a, b) => a.multiplier - b.multiplier);
  return result;
}

/** `2` → `×2`, `0.5` → `×½`, `0.25` → `×¼`. */
export function formatMultiplier(multiplier: number): string {
  const labels: Record<number, string> = {
    0: '×0',
    0.25: '×¼',
    0.5: '×½',
    2: '×2',
    4: '×4',
  };
  return labels[multiplier] ?? `×${multiplier}`;
}
