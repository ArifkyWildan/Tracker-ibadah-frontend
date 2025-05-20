import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import tw from "twrnc";

const Index = () => {
  const [form, setForm] = useState({
    ibadah: "",
    jenis: "wajib",
    waktu: "",
  });

  const [updateId, setUpdateId] = useState<number | null>(null);
  const [updateData, setUpdateData] = useState({
    ibadah: "",
    jenis: "wajib",
    waktu: "",
  });

  interface IbadahItem {
    id: number;
    ibadah: string;
    jenis: string;
    waktu: string;
  }

  const [ibadah, setIbadah] = useState<IbadahItem[]>([]);

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleEdit = (item: IbadahItem) => {
    setUpdateId(item.id);
    setUpdateData({
      ibadah: item.ibadah,
      jenis: item.jenis,
      waktu: item.waktu,
    });
  };

  const handleUpdate = async () => {
    if (
      updateData.ibadah.trim() === "" ||
      updateData.jenis.trim() === "" ||
      updateData.waktu.trim() === ""
    ) {
      alert("Semua field harus diisi");
      return;
    }

    // Validasi format waktu
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(updateData.waktu)) {
      alert("Format waktu harus HH:MM (contoh: 08:30)");
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/ibadah/${updateId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );
      const data = await response.json();
      if (response.ok) {
        alert("Data berhasil diubah");
        setUpdateId(null);
        setUpdateData({
          ibadah: "",
          jenis: "wajib",
          waktu: "",
        });
        getIbadah();
      } else {
        alert("Gagal mengubah data" + data.message);
      }
    } catch (error) {
      console.error("Error updating data:", error);
      alert("Terjadi kesalahan saat mengubah data");
    }
  };

  const getIbadah = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/ibadah");
      const data = await response.json();
      setIbadah(data);
    } catch (error) {
      console.error("Error tidak bisa menampilkan data:", error);
      alert("Terjadi kesalahan saat mengambil data");
    }
  };

  const handleSubmit = async () => {
    if (
      form.ibadah.trim() === "" ||
      form.jenis.trim() === "" ||
      form.waktu.trim() === ""
    ) {
      alert("Semua field harus diisi");
      return;
    }

    // Validasi format waktu
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(form.waktu)) {
      alert("Format waktu harus HH:MM (contoh: 08:30)");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/ibadah", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      alert("Data berhasil ditambahkan");
      setForm({
        ibadah: "",
        jenis: "wajib",
        waktu: "",
      });
      getIbadah();
    } catch (error) {
      console.error("Error adding data:", error);
      alert("Terjadi kesalahan saat menambah data. Silakan coba lagi.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/ibadah/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        alert("Data berhasil dihapus");
        getIbadah();
      } else {
        alert("Gagal menghapus data");
      }
    } catch (error) {
      console.error("Error deleting data:", error);
      alert("Terjadi kesalahan saat menghapus data");
    }
  };

  useEffect(() => {
    getIbadah();
  }, []);

  return (
    <SafeAreaView style={tw`flex-1 bg-blue-50`}>
      <ScrollView>
        <View style={tw`p-6`}>
          <View style={tw`bg-white rounded-3xl shadow-2xl p-8 mb-8`}>
            <Text
              style={tw`text-4xl font-bold mb-3 text-center text-blue-900`}
            >
              MANAJEMEN IBADAH
            </Text>
            <Text style={tw`text-blue-800 text-center mb-8 text-lg font-medium`}>
              Catat dan buat aktivitas ibadah anda.
            </Text>

            <View style={tw`bg-blue-50 p-6 rounded-2xl mb-6 shadow-inner`}>
              <TextInput
                style={tw`h-[55px] border-2 border-blue-300 rounded-2xl px-4 mb-4 text-base bg-white shadow-sm`}
                placeholder="Nama Ibadah"
                placeholderTextColor="#3b82f6"
                value={updateId ? updateData.ibadah : form.ibadah}
                onChangeText={(value: string) => {
                  if (updateId) {
                    setUpdateData({ ...updateData, ibadah: value });
                  } else {
                    handleChange("ibadah", value);
                  }
                }}
              />

              <View
                style={tw`border-2 border-blue-300 rounded-2xl mb-4 bg-white shadow-sm`}
              >
                <Picker
                  selectedValue={updateId ? updateData.jenis : form.jenis}
                  onValueChange={(value: string) => {
                    if (updateId) {
                      setUpdateData({ ...updateData, jenis: value });
                    } else {
                      handleChange("jenis", value);
                    }
                  }}
                  style={tw`h-[55px] px-4`}
                >
                  <Picker.Item label="Wajib" value="wajib" />
                  <Picker.Item label="Sunah" value="sunah" />
                </Picker>
              </View>

              <TextInput
                style={tw`h-[55px] border-2 border-blue-300 rounded-2xl px-4 mb-6 text-base bg-white shadow-sm`}
                placeholder="Waktu Ibadah (HH:MM)"
                placeholderTextColor="#3b82f6"
                value={updateId ? updateData.waktu : form.waktu}
                onChangeText={(value: string) => {
                  if (updateId) {
                    setUpdateData({ ...updateData, waktu: value });
                  } else {
                    handleChange("waktu", value);
                  }
                }}
              />

              <TouchableOpacity
                style={tw`bg-blue-900 h-[55px] rounded-2xl items-center justify-center shadow-lg`}
                onPress={updateId !== null ? handleUpdate : handleSubmit}
              >
                <Text style={tw`text-white text-lg font-bold`}>
                  {updateId !== null ? "Perbarui Data" : "Simpan Data"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={tw`bg-white rounded-3xl shadow-2xl p-8`}>
            <Text
              style={tw`text-3xl font-bold mb-3 text-center text-blue-900`}
            >
              DAFTAR IBADAH
            </Text>
            <Text style={tw`text-blue-800 text-center mb-8 text-lg font-medium`}>
              Data card ibadah anda.
            </Text>

            {ibadah.map((item, index) => (
              <View
                key={index}
                style={tw`bg-blue-50 p-6 rounded-2xl mb-4 border-2 border-blue-200 shadow-lg`}
              >
                <Text style={tw`text-2xl font-bold text-blue-900 mb-3`}>
                  {item.ibadah}
                </Text>
                <View style={tw`flex-row items-center mb-3`}>
                  <Text style={tw`text-blue-800 font-medium text-lg`}>Jenis: </Text>
                  <View style={tw`bg-blue-200 px-4 py-2 rounded-full`}>
                    <Text style={tw`text-blue-900 font-bold`}>
                      {item.jenis}
                    </Text>
                  </View>
                </View>
                <Text style={tw`text-blue-800 font-medium text-lg mb-4`}>Waktu: {item.waktu}</Text>

                <View style={tw`flex-row space-x-4 gap-4`}>
                  <TouchableOpacity
                    style={tw`flex-1 bg-red-600 h-[45px] rounded-xl items-center justify-center shadow-lg`}
                    onPress={() => handleDelete(item.id)}
                  >
                    <Text style={tw`text-white font-bold text-lg`}>Hapus</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={tw`flex-1 bg-blue-800 h-[45px] rounded-xl items-center justify-center shadow-lg`}
                    onPress={() => handleEdit(item)}
                  >
                    <Text style={tw`text-white font-bold text-lg`}>Edit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Index;