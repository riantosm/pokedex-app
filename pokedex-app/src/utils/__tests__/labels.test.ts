import {
  compareEncounterConditions,
  compareItemPockets,
  compareVersionGroupsNewestFirst,
  compareVersions,
  conditionLabel,
  damageClassLabel,
  encounterConditionName,
  encounterMethodIcon,
  genderBucket,
  genderRateLabel,
  generationRoman,
  moveCategoryLabel,
  sortItemCategories,
  versionGroupLabel,
  versionLabel,
} from '../labels';

describe('labels', () => {
  it('label Indonesia + fallback formatName', () => {
    expect(damageClassLabel('special')).toBe('Khusus');
    expect(damageClassLabel('unknown-class')).toBe('Unknown Class');
  });

  it('kondisi "tanpa syarat" disembunyikan', () => {
    expect(conditionLabel('time-day')).toBe('Siang');
    expect(conditionLabel('backlot-not-mentioned')).toBeNull();
    expect(conditionLabel('radar-off')).toBeNull();
    expect(conditionLabel('johto-safari-blocks-inactive')).toBeNull();
  });

  it('nilai kondisi dirapikan tanpa prefiks', () => {
    expect(conditionLabel('swarm-yes')).toBe('Kawanan muncul');
    expect(conditionLabel('time-minute-00-to-19')).toBe('Menit 00–19');
    expect(conditionLabel('slot2-ruby')).toBe('Ruby');
    expect(conditionLabel('johto-safari-blocks-plains-min-2')).toBe(
      'Plains Min 2',
    );
    expect(encounterConditionName('season')).toBe('Musim');
    expect(
      ['item', 'swarm', 'time', 'season'].sort(compareEncounterConditions),
    ).toEqual(['time', 'season', 'swarm', 'item']);
  });

  it('ikon metode & angka romawi generasi', () => {
    expect(encounterMethodIcon('super-rod')).toBe('fish');
    expect(generationRoman('generation-iv')).toBe('IV');
  });
});

describe('genderRateLabel / genderBucket', () => {
  it('memberi label tiap rasio', () => {
    expect(genderRateLabel(-1)).toBe('Tanpa gender');
    expect(genderRateLabel(0)).toBe('Jantan saja');
    expect(genderRateLabel(1)).toBe('♂ 87,5%');
    expect(genderRateLabel(4)).toBe('50 : 50');
    expect(genderRateLabel(6)).toBe('♀ 75%');
    expect(genderRateLabel(8)).toBe('Betina saja');
  });

  it('mengelompokkan rasio', () => {
    expect(genderBucket(-1)).toBe('genderless');
    expect(genderBucket(0)).toBe('male-only');
    expect(genderBucket(3)).toBe('mixed');
    expect(genderBucket(8)).toBe('female-only');
  });
});

describe('versionGroupLabel / versionLabel', () => {
  it('memakai nama pendek desain, fallback formatName', () => {
    expect(versionGroupLabel('brilliant-diamond-shining-pearl')).toBe(
      'BD & SP',
    );
    expect(versionGroupLabel('crystal')).toBe('Crystal');
    expect(versionLabel('firered')).toBe('FireRed');
    expect(versionLabel('omega-ruby')).toBe('Omega Ruby');
  });
});

describe('compareVersions', () => {
  it('mengurutkan kronologis, versi asing di akhir', () => {
    expect(
      ['lets-go-pikachu', 'unknown', 'red', 'firered', 'blue'].sort(
        compareVersions,
      ),
    ).toEqual(['red', 'blue', 'firered', 'lets-go-pikachu', 'unknown']);
  });
});

describe('compareVersionGroupsNewestFirst', () => {
  it('grup Jepang dianggap lama, grup baru di depan', () => {
    expect(
      ['blue-japan', 'scarlet-violet', 'red-blue', 'sword-shield'].sort(
        compareVersionGroupsNewestFirst,
      ),
    ).toEqual(['scarlet-violet', 'sword-shield', 'red-blue', 'blue-japan']);
  });
});

describe('moveCategoryLabel', () => {
  it('slug + dari /move dan - dari list sama-sama dikenali', () => {
    expect(moveCategoryLabel('damage+ailment')).toBe('Damage + status');
    expect(moveCategoryLabel('damage-ailment')).toBe('Damage + status');
    expect(moveCategoryLabel('new-category')).toBe('New Category');
  });
});

describe('urutan item', () => {
  it('kantong mengikuti desain, kantong asing di akhir', () => {
    expect(
      ['misc', 'unknown', 'medicine', 'pokeballs'].sort(compareItemPockets),
    ).toEqual(['pokeballs', 'medicine', 'misc', 'unknown']);
  });

  it('kategori utama di depan, sisanya urutan PokéAPI', () => {
    expect(
      sortItemCategories('pokeballs', [
        'special-balls',
        'standard-balls',
        'apricorn-balls',
      ]),
    ).toEqual(['standard-balls', 'special-balls', 'apricorn-balls']);
    expect(sortItemCategories('mail', ['all-mail'])).toEqual(['all-mail']);
  });
});
