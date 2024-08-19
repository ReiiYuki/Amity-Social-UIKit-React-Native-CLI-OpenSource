import * as React from 'react';
// import { useTranslation } from 'react-i18next';

import { Text, Image, TouchableOpacity, View } from 'react-native';
import { useStyles } from '../../styles';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SvgXml } from 'react-native-svg';
import { communityIcon } from '../../../../svg/svg-xml-list';
import useAuth from '../../../../hooks/useAuth';
import { useCallback, useEffect, useState } from 'react';
import { CategoryRepository } from '@amityco/ts-sdk-react-native';
import { formatNumber } from '../../../../util/numberUtil';

interface Props {
  ranking: number;
  community: Amity.Community;
}

export default function TrendingCard({ ranking, community }: Props) {
  const styles = useStyles();

  const { apiRegion } = useAuth();

  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const [category, setCategory] = useState<Amity.Category>();

  const handleCommunityClick = (communityId: string, communityName: string) => {
    setTimeout(() => {
      navigation.navigate('CommunityHome', { communityId, communityName });
    }, 100);
  };

  const loadCategory = useCallback(async () => {
    const result = await CategoryRepository.getCategory(
      community.categoryIds[0]
    );

    setCategory(result.data);
  }, [community.categoryIds]);

  useEffect(() => {
    loadCategory();
  }, [loadCategory]);

  return (
    <TouchableOpacity
      key={community.communityId}
      style={styles.itemContainer}
      onPress={() =>
        handleCommunityClick(community.communityId, community.displayName)
      }
    >
      {community.avatarFileId ? (
        <Image
          style={styles.avatar}
          source={
            community.avatarFileId
              ? {
                  uri: `https://api.${apiRegion}.amity.co/api/v3/files/${community.avatarFileId}/download`,
                }
              : require('../../../../../assets/icon/Placeholder.png')
          }
        />
      ) : (
        <SvgXml
          xml={communityIcon}
          style={styles.avatar}
          width={40}
          height={40}
        />
      )}

      <View style={styles.trendingTextContainer}>
        <Text style={styles.number}>{ranking}</Text>
        <View style={styles.memberContainer}>
          <View style={styles.memberTextContainer}>
            <Text style={styles.memberText}>{community.displayName}</Text>
            <Text style={styles.memberCount}>
              {category && category.name} {'\u2022'}{' '}
              {community.membersCount && formatNumber(community.membersCount)}{' '}
              members
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
