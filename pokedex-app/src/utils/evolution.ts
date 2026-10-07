import type { ChainLink, EvolutionDetail } from '@/types';
import { formatName } from './format';
import { idFromUrl } from './pokemon';

export interface EvolutionStep {
  id: number;
  name: string;
  /** Kedalaman di pohon: 0 = bentuk dasar. */
  stage: number;
  /** Syarat evolusi dari bentuk sebelumnya; `null` untuk bentuk dasar. */
  detail: EvolutionDetail | null;
}

/**
 * Ratakan pohon evolusi jadi daftar urut depth-first.
 * Cabang (mis. Eevee → 8 evolusi) tetap muncul berurutan dengan `stage` yang sama.
 */
export function flattenEvolutionChain(chain: ChainLink): EvolutionStep[] {
  const steps: EvolutionStep[] = [];
  const walk = (link: ChainLink, stage: number) => {
    steps.push({
      id: idFromUrl(link.species.url),
      name: link.species.name,
      stage,
      detail: link.evolution_details[0] ?? null,
    });
    link.evolves_to.forEach(next => walk(next, stage + 1));
  };
  walk(chain, 0);
  return steps;
}

/** Label syarat evolusi singkat, mis. `Level 16`, `Pakai Thunder Stone`. */
export function evolutionTriggerLabel(detail: EvolutionDetail): string {
  if (detail.min_level !== null) {
    return `Level ${detail.min_level}`;
  }
  if (detail.item) {
    return `Pakai ${formatName(detail.item.name)}`;
  }
  if (detail.min_happiness !== null) {
    return detail.time_of_day ? `Akrab (${detail.time_of_day})` : 'Akrab';
  }
  if (detail.trigger.name === 'trade') {
    return detail.held_item
      ? `Tukar + ${formatName(detail.held_item.name)}`
      : 'Tukar';
  }
  return formatName(detail.trigger.name);
}
