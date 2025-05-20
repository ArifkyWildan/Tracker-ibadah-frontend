import { View, Text, FlatList, Image, TouchableOpacity, Linking } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import tw from 'twrnc'

interface Article {
  url: string;
  urlToImage: string;
  title: string;
  author: string;
  description: string;
  publishedAt: string;
  source: {
    id: string | null;
    name: string;
  };
  content: string;
}
export default function Explore() {
  const [articles, setArticles] = useState<Article[]>([]);

  const getNews = async () => {
    try {
      const response = await axios.get('https://newsapi.org/v2/top-headlines?country=us&apiKey=b67226388eca4095844c27e34188bd4b ')
      setArticles(response.data.articles)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getNews();
  }, [])

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <View style={tw`bg-gray-100 flex-1`}>
      <View style={tw`bg-white py-4 px-4 shadow-sm`}>
        <Text style={tw`text-2xl font-bold text-gray-800`}>Top Headlines</Text>
      </View>
      <FlatList
        data={articles}
        keyExtractor={(item) => item.url}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`p-4`}
        ItemSeparatorComponent={() => <View style={tw`h-4`} />}
        renderItem={({item}) => (
          <TouchableOpacity 
            style={tw`bg-white rounded-xl shadow-md overflow-hidden`}
            onPress={() => Linking.openURL(item.url)}
          >
            <Image 
              source={{ uri: item.urlToImage || 'https://via.placeholder.com/400' }} 
              style={tw`w-full h-48`}
              resizeMode="cover"
            />
            <View style={tw`p-4`}>
              <Text style={tw`text-xs text-blue-600 font-semibold mb-2`}>
                {item.source.name} • {formatDate(item.publishedAt)}
              </Text>
              <Text style={tw`text-xl font-bold text-gray-900 mb-2`}>
                {item.title}
              </Text>
              {item.author && (
                <Text style={tw`text-sm text-gray-600 mb-2`}>
                  By {item.author}
                </Text>
              )}
              <Text style={tw`text-base text-gray-700 leading-6`}>
                {item.description}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}