import type { ChainLink, EvolutionDetail } from '@/types';
import { evolutionTriggerLabel, flattenEvolutionChain } from '../evolution';

const res = (name: string, url = '') => ({ name, url });
const detail = (patch: Partial<EvolutionDetail> = {}): EvolutionDetail => ({
  trigger: res('level-up'),
  min_level: null,
  item: null,
  held_item: null,
  min_happiness: null,
  time_of_day: '',
  ...patch,
});
const link = (
  name: string,
  id: number,
  details: EvolutionDetail[],
  next: ChainLink[] = [],
): ChainLink => ({
  is_baby: false,
  species: res(name, `https://pokeapi.co/api/v2/pokemon-species/${id}/`),
  evolution_details: details,
  evolves_to: next,
});

describe('flattenEvolutionChain', () => {
  it('Pichu → Pikachu → Raichu', () => {
    const chain = link(
      'pichu',
      172,
      [],
      [
        link(
          'pikachu',
          25,
          [detail({ min_happiness: 220 })],
          [
            link('raichu', 26, [
              detail({ trigger: res('use-item'), item: res('thunder-stone') }),
            ]),
          ],
        ),
      ],
    );
    const steps = flattenEvolutionChain(chain);
    expect(steps.map(s => [s.id, s.stage])).toEqual([
      [172, 0],
      [25, 1],
      [26, 2],
    ]);
    expect(steps[0].detail).toBeNull();
  });

  it('cabang tetap di stage yang sama', () => {
    const chain = link(
      'eevee',
      133,
      [],
      [link('vaporeon', 134, [detail()]), link('jolteon', 135, [detail()])],
    );
    expect(flattenEvolutionChain(chain).map(s => s.stage)).toEqual([0, 1, 1]);
  });
});

describe('evolutionTriggerLabel', () => {
  it('level, item, tukar', () => {
    expect(evolutionTriggerLabel(detail({ min_level: 16 }))).toBe('Level 16');
    expect(evolutionTriggerLabel(detail({ item: res('thunder-stone') }))).toBe(
      'Pakai Thunder Stone',
    );
    expect(evolutionTriggerLabel(detail({ trigger: res('trade') }))).toBe(
      'Tukar',
    );
  });
});
