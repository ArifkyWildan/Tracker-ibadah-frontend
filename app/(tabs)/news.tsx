import { View, Text, FlatList, Image, StatusBar } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import tw from 'twrnc';

interface Currency {
  name: string;
  symbol: string;
}

interface Country {
  cca2: string;
  name: { common: string };
  capital: string[];
  flags: { png: string };
  region: string;
  subregion: string;
  currencies: { [key: string]: Currency };
  languages: { [key: string]: string };
}

export default function Countries() {
  const [countries, setCountries] = useState<Country[]>([]);

  const getCountries = async () => {
    try {
      const response = await axios.get<Country[]>('https://restcountries.com/v3.1/all');
      setCountries(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCountries();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#FEF1E1' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FEF1E1" />
      <View style={[tw`py-6 px-4 shadow-lg rounded-b-3xl items-center`, { backgroundColor: '#fff' }]}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#FC350C' }}>Daftar Negara</Text>
      </View>

      <FlatList
        data={countries}
        keyExtractor={(item) => item.cca2}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const name = item.name?.common || 'Nama tidak tersedia';
          const capital = item.capital?.[0] || 'Tidak tersedia';
          const flag = item.flags?.png || '';
          const region = item.region || 'Tidak tersedia';
          const subregion = item.subregion || 'Tidak tersedia';
          const currencies = item.currencies
            ? Object.values(item.currencies).map((c) => `${c.name} (${c.symbol})`).join(', ')
            : 'Tidak tersedia';
          const languages = item.languages
            ? Object.values(item.languages).join(', ')
            : 'Tidak tersedia';

          return (
            <View style={[tw`mx-4 mb-4 rounded-2xl overflow-hidden shadow-md mt-5`, { backgroundColor: '#fff' }]}>
              {flag ? (
                <Image
                  source={{ uri: flag }}
                  style={tw`w-full h-40`}
                  resizeMode="cover"
                />
              ) : null}
              <View style={tw`p-4`}>
                <Text style={{ fontSize: 20, fontWeight: '700', color: '#FC350C', marginBottom: 8 }}>{name}</Text>
                <Text style={{ color: '#333', marginBottom: 4 }}>
                  🏙️ Ibu Kota: <Text style={{ fontWeight: '600', color: '#555' }}>{capital}</Text>
                </Text>
                <Text style={{ color: '#333', marginBottom: 4 }}>
                  🌍 Wilayah: <Text style={{ fontWeight: '600', color: '#555' }}>{region} ({subregion})</Text>
                </Text>
                <Text style={{ color: '#333', marginBottom: 4 }}>
                  💱 Mata Uang: <Text style={{ fontWeight: '600', color: '#555' }}>{currencies}</Text>
                </Text>
                <Text style={{ color: '#333' }}>
                  🗣️ Bahasa: <Text style={{ fontWeight: '600', color: '#555' }}>{languages}</Text>
                </Text>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}
