import { View, Text, FlatList, Image, TouchableOpacity, Linking } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import tw from "twrnc";

export default function explore() {
  const [articles, setArticles] = useState([]);

  const getNews = async () => {
    try {
      const response = await axios.get('https://newsapi.org/v2/top-headlines?q=indonesia&apiKey=b67226388eca4095844c27e34188bd4b');
      setArticles(response.data.articles);
    }catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getNews();
  }, []);

  const handlePress = async (url) => {
    await Linking.openURL(url);
  };
  
  return (
    <View style={tw`bg-gray-100 flex-1`}>
      <Text style={tw`text-2xl font-bold p-4`}>Halaman Berita</Text>
      <FlatList
      data={articles}
      keyExtractor={(item) => item.url}
      renderItem={({ item }) => (
        <View style={tw`bg-white rounded-xl m-4 shadow-md overflow-hidden`}>
          <Image source={{ uri: item.urlToImage }} style={tw`w-full h-48 object-cover`} />
          <View style={tw`p-4`}>
            <Text style={tw`text-xl font-bold mb-2`}>{item.title}</Text>
            <Text style={tw`text-gray-600 mb-1`}>Penulis: {item.author}</Text>
            <Text style={tw`text-gray-800 mb-4`}>{item.description}</Text>
            <TouchableOpacity 
              onPress={() => handlePress(item.url)}
              style={tw`bg-blue-500 rounded-lg py-2 px-4 self-start`}
            >
              <Text style={tw`text-white font-semibold`}>Baca Selengkapnya</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      />
    </View>
  )
}