import * as React from 'react';
// import { useTranslation } from 'react-i18next';

import { Text, Image, TouchableOpacity } from 'react-native';
import { useStyles } from '../styles';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SvgXml } from 'react-native-svg';
import { communityIcon } from '../../../svg/svg-xml-list';
import useAuth from '../../../hooks/useAuth';
import { useEffect, useState } from 'react';
import { CategoryRepository } from '@amityco/ts-sdk-react-native';
import { formatNumber } from '../../../util/numberUtil';

interface Props {
  community: Amity.Community;
}

export default function RecommendedCard({ community }: Props) {
  const styles = useStyles();
  const { apiRegion } = useAuth();

  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const [category, setCategory] = useState<Amity.Category>();

  const handleCommunityClick = (communityId: string, communityName: string) => {
    setTimeout(() => {
      navigation.navigate('CommunityHome', { communityId, communityName });
    }, 100);
  };

  const loadCategory = async () => {
    const result = await CategoryRepository.getCategory(
      '9b9a2f74e45888bb9c88ed5c604ecccb'
    );

    setCategory(result.data);
  };

  useEffect(() => {
    loadCategory();
  }, []);

  return (
    <TouchableOpacity
      key={community.communityId}
      style={styles.card}
      onPress={() =>
        handleCommunityClick(community.communityId, community.displayName)
      }
    >
      {community.avatarFileId ? (
        <Image
          style={styles.avatar}
          source={{
            uri: `https://api.${apiRegion}.amity.co/api/v3/files/${community.avatarFileId}/download`,
          }}
        />
      ) : (
        <SvgXml
          xml={communityIcon}
          style={styles.avatar}
          width={40}
          height={40}
        />
      )}

      <Text style={styles.name}>{community.displayName}</Text>
      <Text style={styles.category}>{category && category.name}</Text>
      <Text style={styles.recommendSubDetail}>
        {community.membersCount && formatNumber(community.membersCount)} members
      </Text>
      <Text style={styles.bio}>{community.description}</Text>
    </TouchableOpacity>
  );
}
