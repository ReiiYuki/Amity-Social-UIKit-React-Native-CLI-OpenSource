import * as React from 'react';
import {
  CategoryRepository,
  CommunityRepository,
} from '@amityco/ts-sdk-react-native';
import { useState, useEffect, useCallback } from 'react';
// import { useTranslation } from 'react-i18next';

import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useStyles } from './styles';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import useAuth from '../../hooks/useAuth';
import RecommendedCard from './Components/RecommendedCard';
import TrendingCard from './Components/TrendingCard';

export default function Explore() {
  const styles = useStyles();
  const { apiRegion } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [recommendCommunityList, setRecommendCommunityList] = useState<
    Amity.Community[]
  >([]);
  const [trendingCommunityList, setTrendingCommunityList] = useState<
    Amity.Community[]
  >([]);
  const [categoryList, setCategoryList] = useState<Amity.Category[]>([]);

  const loadRecommendCommunities = () => {
    const unsubscribe = CommunityRepository.getRecommendedCommunities(
      { limit: 5 },
      ({ data: recommendCommunities }) =>
        setRecommendCommunityList(recommendCommunities)
    );
    unsubscribe();
  };

  const loadTrendingCommunities = async () => {
    CommunityRepository.getTrendingCommunities(
      { limit: 5 },
      ({ data, loading, error }) => {
        if (error) return;
        if (!loading) {
          setTrendingCommunityList(data);
        }
      }
    );
  };
  const loadCategories = async () => {
    CategoryRepository.getCategories(
      { sortBy: 'name', limit: 8 },
      ({ data }) => {
        if (data) {
          data.sort((a, b) => b.name.localeCompare(a.name));
          setCategoryList(data);
        }
      }
    );
  };
  const handleCategoryListClick = () => {
    setTimeout(() => {
      navigation.navigate('CategoryList');
    }, 100);
  };

  useEffect(() => {
    loadRecommendCommunities();
    loadTrendingCommunities();
    loadCategories();
  }, []);

  const handleCategoryClick = useCallback(
    (categoryId: string, categoryName: string) => {
      setTimeout(() => {
        navigation.navigate('CommunityList', { categoryId, categoryName });
      }, 100);
    },
    [navigation]
  );

  const renderCategoryList = useCallback(() => {
    return (
      <View style={styles.wrapContainer}>
        {categoryList.map((category) => {
          return (
            <TouchableOpacity
              style={styles.rowContainer}
              key={category.categoryId}
              onPress={() =>
                handleCategoryClick(category.categoryId, category.name)
              }
            >
              <Image
                style={styles.avatar}
                source={
                  category.avatarFileId
                    ? {
                        uri: `https://api.${apiRegion}.amity.co/api/v3/files/${category.avatarFileId}/download`,
                      }
                    : require('../../../assets/icon/Placeholder.png')
                }
              />
              <Text
                ellipsizeMode="tail"
                numberOfLines={1}
                style={styles.columnText}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }, [apiRegion, categoryList, handleCategoryClick, styles]);

  // console.log(recommendCommunityList.map(r => r.displayName + ' ' + r.categoryIds))

  useEffect(() => {
    CategoryRepository.getCategory('9b9a2f74e45888bb9c88ed5c604ecccb').then(
      (r) => {
        console.log(r.data.name);
      }
    );
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.recommendContainer}>
        <Text style={styles.title}>Recommended for you</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {recommendCommunityList.map((community) => (
            <RecommendedCard community={community} />
          ))}
        </ScrollView>
      </View>
      <View style={styles.trendingContainer}>
        <Text style={styles.title}>Today's trending</Text>
        <View>
          {trendingCommunityList.map((community, index) => (
            <TrendingCard ranking={index + 1} community={community} />
          ))}
        </View>
      </View>
      <View style={styles.categoriesContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Categories</Text>
          <TouchableOpacity onPress={handleCategoryListClick}>
            <Image
              source={require('../../../assets/icon/arrowRight.png')}
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
        </View>
        {renderCategoryList()}
      </View>
    </ScrollView>
  );
}
