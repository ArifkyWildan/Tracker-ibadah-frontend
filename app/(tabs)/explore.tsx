import { View, Text, FlatList, Image, TouchableOpacity, Modal, Linking } from 'react-native'
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
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const getNews = async () => {
    try {
      const response = await axios.get('https://newsapi.org/v2/top-headlines?country=us&apiKey=08a2e66c7c114f138b6e60707f745c83');
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
    <View style={{ flex: 1, backgroundColor: '#FEF1E1' }}>
      {/* Header */}
      <View style={[tw`py-6 px-4 shadow-lg rounded-b-3xl items-center`, { backgroundColor: '#fff' }]}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#FC350C' }}>Top Headlines</Text>
      </View>

      {/* Article List */}
      <FlatList
        data={articles}
        keyExtractor={(item) => item.url}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`p-4 pb-20`}
        ItemSeparatorComponent={() => <View style={tw`h-6`} />}
        renderItem={({ item }) => (
          <View style={[tw`rounded-3xl shadow-md overflow-hidden`, { backgroundColor: '#fff' }]}>
            <Image
              source={{ uri: item.urlToImage || 'https://via.placeholder.com/400' }}
              style={tw`w-full h-56`}
              resizeMode="cover"
            />
            <View style={tw`p-5`}>
              <Text style={{ color: '#FC350C', fontWeight: '600', marginBottom: 4 }}>
                {item.source.name} • {formatDate(item.publishedAt)}
              </Text>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 8 }}>
                {item.title}
              </Text>
              {item.author && (
                <Text style={{ fontSize: 14, color: '#555', marginBottom: 8 }}>By {item.author}</Text>
              )}
              <Text style={{ fontSize: 16, color: '#444' }} numberOfLines={3}>
                {item.description}
              </Text>
              <TouchableOpacity
                style={{ marginTop: 16, backgroundColor: '#FC350C', paddingVertical: 12, borderRadius: 16 }}
                onPress={() => {
                  setSelectedArticle(item);
                  setModalVisible(true);
                }}
              >
                <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>Read More</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: '#FEF1E1' }}>
          <View style={tw`p-6`}>
            <TouchableOpacity
              style={tw`mb-4`}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: '#FC350C', fontSize: 20, fontWeight: '600' }}>← Back</Text>
            </TouchableOpacity>

            {selectedArticle && (
              <View>
                <Image
                  source={{ uri: selectedArticle.urlToImage || 'https://via.placeholder.com/400' }}
                  style={[tw`w-full h-64 rounded-2xl`]}
                  resizeMode="cover"
                />
                <View style={tw`py-6`}>
                  <Text style={{ color: '#FC350C', fontWeight: '600', marginBottom: 8 }}>
                    {selectedArticle.source.name} • {formatDate(selectedArticle.publishedAt)}
                  </Text>
                  <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 12 }}>
                    {selectedArticle.title}
                  </Text>
                  {selectedArticle.author && (
                    <Text style={{ fontSize: 16, color: '#555', marginBottom: 12 }}>
                      By {selectedArticle.author}
                    </Text>
                  )}
                  <Text style={{ fontSize: 16, color: '#444', lineHeight: 24, marginBottom: 20 }}>
                    {selectedArticle.content}
                  </Text>
                  <TouchableOpacity
                    style={{ backgroundColor: '#FC350C', paddingVertical: 14, borderRadius: 16 }}
                    onPress={() => Linking.openURL(selectedArticle.url)}
                  >
                    <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 18 }}>Read Full Article</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  )
}
