import { memo } from 'react';
import AppText from '@/components/atoms/AppText';
import { useDataLanguage } from '@/hooks/useDataLanguage';
import { useGetAbilityQuery } from '@/services/api/ability.service';
import { pickName } from '@/utils/i18n';

/** Nama ability sesuai bahasa data (data yang sama dipakai sheet Ability). */
function AbilityName({ name }: { name: string }) {
  const lang = useDataLanguage();
  const { data } = useGetAbilityQuery(name);
  return (
    <AppText variant="bodyStrong">{pickName(data?.names, lang, name)}</AppText>
  );
}

export default memo(AbilityName);
