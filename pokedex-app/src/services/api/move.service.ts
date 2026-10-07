import type {
  ContestEffect,
  LocalizedEffect,
  LocalizedName,
  Machine,
  Move,
  MoveFlavorText,
  MoveGroup,
  NamedAPIResource,
  SuperContestEffect,
} from '@/types';
import { latestPerLanguage, supportedOnly } from '@/utils/i18n';
import { MAX_POKEMON_ID, idFromUrl } from '@/utils/pokemon';
import { pokeApi } from './pokeApi';

interface RawMove
  extends Omit<
    Move,
    'machines' | 'contestEffectId' | 'superContestEffectId' | 'learnedBy'
  > {
  machines: { machine: { url: string }; version_group: NamedAPIResource }[];
  contest_effect: { url: string } | null;
  super_contest_effect: { url: string } | null;
  learned_by_pokemon: NamedAPIResource[];
}

interface RawMoveGroup {
  id: number;
  name: string;
  names?: LocalizedName[];
  moves: NamedAPIResource[];
}

export const moveApi = pokeApi.injectEndpoints({
  endpoints: build => ({
    /** Detail move. `learned_by_pokemon` (bisa ratusan) disimpan sebagai daftar id saja. */
    getMove: build.query<Move, string>({
      query: name => `/move/${name}`,
      transformResponse: (res: RawMove): Move => ({
        id: res.id,
        name: res.name,
        names: supportedOnly(res.names),
        accuracy: res.accuracy,
        power: res.power,
        pp: res.pp,
        priority: res.priority,
        effect_chance: res.effect_chance,
        type: res.type,
        damage_class: res.damage_class,
        target: res.target,
        generation: res.generation,
        meta: res.meta
          ? {
              ailment: res.meta.ailment,
              category: res.meta.category,
              ailment_chance: res.meta.ailment_chance,
            }
          : null,
        effect_entries: latestPerLanguage(
          res.effect_entries as LocalizedEffect[],
        ),
        flavor_text_entries: latestPerLanguage(
          res.flavor_text_entries as MoveFlavorText[],
        ),
        machines: res.machines.map(m => ({
          machineId: idFromUrl(m.machine.url),
          versionGroup: m.version_group.name,
        })),
        contest_type: res.contest_type,
        contestEffectId: res.contest_effect
          ? idFromUrl(res.contest_effect.url)
          : null,
        superContestEffectId: res.super_contest_effect
          ? idFromUrl(res.super_contest_effect.url)
          : null,
        learnedBy: res.learned_by_pokemon
          .map(p => idFromUrl(p.url))
          .filter(id => id <= MAX_POKEMON_ID),
      }),
    }),
    /** Daftar move per damage class (Fisik/Khusus/Status) untuk segmen di daftar Moves. */
    getMoveDamageClass: build.query<MoveGroup, string>({
      query: name => `/move-damage-class/${name}`,
      transformResponse: (res: RawMoveGroup): MoveGroup => ({
        id: res.id,
        name: res.name,
        names: supportedOnly(res.names ?? []),
        moves: res.moves.map(m => m.name),
      }),
    }),
    /** Nama + deskripsi resource referensi move (target, ailment, category, learn method). */
    getMoveReference: build.query<
      {
        name: string;
        names: LocalizedName[];
        descriptions: { description: string; language: NamedAPIResource }[];
      },
      {
        resource:
          | 'move-target'
          | 'move-ailment'
          | 'move-category'
          | 'move-learn-method'
          | 'move-battle-style';
        name: string;
      }
    >({
      query: ({ resource, name }) => `/${resource}/${name}`,
      transformResponse: (res: {
        name: string;
        names?: LocalizedName[];
        descriptions?: { description: string; language: NamedAPIResource }[];
      }) => ({
        name: res.name,
        names: supportedOnly(res.names ?? []),
        descriptions: latestPerLanguage(res.descriptions ?? []),
      }),
    }),
    getMachine: build.query<Machine, number>({
      query: id => `/machine/${id}`,
    }),
    getContestEffect: build.query<ContestEffect, number>({
      query: id => `/contest-effect/${id}`,
      transformResponse: (res: ContestEffect): ContestEffect => ({
        id: res.id,
        appeal: res.appeal,
        jam: res.jam,
        effect_entries: latestPerLanguage(res.effect_entries),
      }),
    }),
    getSuperContestEffect: build.query<SuperContestEffect, number>({
      query: id => `/super-contest-effect/${id}`,
      transformResponse: (res: SuperContestEffect): SuperContestEffect => ({
        id: res.id,
        appeal: res.appeal,
        flavor_text_entries: latestPerLanguage(res.flavor_text_entries),
      }),
    }),
  }),
});

export const {
  useGetMoveQuery,
  useGetMoveDamageClassQuery,
  useGetMoveReferenceQuery,
  useGetMachineQuery,
  useGetContestEffectQuery,
  useGetSuperContestEffectQuery,
} = moveApi;
