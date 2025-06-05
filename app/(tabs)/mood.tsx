import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";
import AwesomeAlert from "react-native-awesome-alerts";

interface Activity {
  id: number;
  name: string;
  date: string;
  category: string;
  completed?: boolean;
}

export default function Index() {
  const [form, setForm] = useState({ name: "", date: "", category: "" });
  const [showPicker, setShowPicker] = useState(false);
  const [aktivitas, setAktivitas] = useState<Activity[]>([]);
  const [filtercategory, setFilterCategory] = useState("");
  const [updateId, setUpdateId] = useState<number | null>(null);
  const [updateData, setUpdateData] = useState({
    name: "",
    date: "",
    category: "",
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState<"delete" | "update" | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const isFormValid = () =>
    form.name.length >= 3 && form.date.length >= 3 && form.category.length >= 3;

  const isUpdateFormValid = () =>
    updateData.name.length >= 3 &&
    updateData.date.length >= 3 &&
    updateData.category.length >= 3;

  const getAktivitas = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/mood");
      const dataWithCompleted = res.data.map((item: Activity) => ({
        ...item,
        completed: false,
      }));
      setAktivitas(dataWithCompleted);
    } catch (err) {
      console.error("Gagal memuat data:", err);
    }
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      return Alert.alert(
        "Input Tidak Lengkap",
        "Semua kolom harus diisi dan memiliki minimal 3 karakter."
      );
    }
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/mood", form);
      setAktivitas((prev) => [...prev, { ...res.data, completed: false }]);
      setForm({ name: "", date: "", category: "" });
      Alert.alert("Sukses", "Aktivitas berhasil ditambahkan!");
    } catch (err) {
      Alert.alert("Error", "Gagal mengirim data aktivitas. Silakan coba lagi.");
    }
  };

  const confirmDelete = (id: number) => {
    setAlertType("delete");
    setSelectedId(id);
    setShowAlert(true);
  };

  const confirmUpdate = (id: number) => {
    setAlertType("update");
    setSelectedId(id);
    setShowAlert(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/mood/${id}`);
      setAktivitas((prev) => prev.filter((a) => a.id !== id));
      Alert.alert("Terhapus", "Aktivitas berhasil dihapus.");
    } catch {
      Alert.alert("Error", "Gagal menghapus aktivitas. Silakan coba lagi.");
    }
  };

  const handleUpdate = async (id: number) => {
    if (!isUpdateFormValid()) {
      return Alert.alert(
        "Input Tidak Lengkap",
        "Semua kolom harus diisi dan memiliki minimal 3 karakter."
      );
    }
    try {
      await axios.put(`http://127.0.0.1:8000/api/mood/${id}`, updateData);
      setAktivitas((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...updateData } : a))
      );
      setUpdateId(null);
      setUpdateData({ name: "", date: "", category: "" });
      Alert.alert("Diperbarui", "Aktivitas berhasil diperbarui!");
    } catch {
      Alert.alert("Error", "Gagal memperbarui aktivitas. Silakan coba lagi.");
    }
  };

  const toggleChecked = (id: number) => {
    setAktivitas((prev) =>
      prev.map((a) => (a.id === id ? { ...a, completed: !a.completed } : a))
    );
  };

  useEffect(() => {
    getAktivitas();
  }, []);

  const categories = ["Senang", "Sedih", "Stress"];

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Platform.OS === "web" ? "#FEF1E1" : "#f8f9fa",
      }}
    >
      <View
        style={[
          tw`py-6 px-4 shadow-lg rounded-b-3xl items-center`,
          { backgroundColor: "#fff" },
        ]}
      >
        <Text style={{ fontSize: 28, fontWeight: "bold", color: "#FC350C" }}>
          MoodTracker
        </Text>
      </View>

      <ScrollView style={tw`p-2 mt-3`} contentContainerStyle={tw`pb-20`}>
        {/* Form Input */}
        <View
          style={[
            tw`p-6 rounded-3xl shadow-lg mb-8`,
            {
              backgroundColor: "#ffffff",
              borderWidth: 1,
              borderColor: "#e1e4e8",
            },
          ]}
        >
          <TextInput
            style={tw`border border-gray-200 p-4 rounded-2xl mb-4 text-base bg-gray-100`}
            placeholder="Nama Aktivitas"
            placeholderTextColor="#6c757d"
            value={updateId ? updateData.name : form.name}
            onChangeText={(text) =>
              updateId
                ? setUpdateData({ ...updateData, name: text })
                : setForm({ ...form, name: text })
            }
          />

          {Platform.OS === "web" ? (
            <input
              type="date"
              value={updateId ? updateData.date : form.date}
              onChange={(e) =>
                updateId
                  ? setUpdateData({ ...updateData, date: e.target.value })
                  : setForm({ ...form, date: e.target.value })
              }
              style={{
                padding: 16,
                borderRadius: 16,
                border: "1px solid #e1e4e8",
                marginBottom: 16,
                width: "90%",
                fontSize: "16px",
                backgroundColor: "#f8f9fa",
              }}
            />
          ) : (
            <TouchableOpacity onPress={() => setShowPicker(true)}>
              <TextInput
                style={tw`border border-gray-200 p-4 rounded-2xl mb-4 text-base bg-gray-100`}
                placeholder="Pilih Tanggal"
                placeholderTextColor="#6c757d"
                value={updateId ? updateData.date : form.date}
                editable={false}
              />
              {showPicker && (
                <DateTimePicker
                  value={new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    if (selectedDate) {
                      const dateStr = selectedDate.toISOString().split("T")[0];
                      updateId
                        ? setUpdateData({ ...updateData, date: dateStr })
                        : setForm({ ...form, date: dateStr });
                    }
                    setShowPicker(false);
                  }}
                />
              )}
            </TouchableOpacity>
          )}

          <select
            value={updateId ? updateData.category : form.category}
            onChange={(e) =>
              updateId
                ? setUpdateData({ ...updateData, category: e.target.value })
                : setForm({ ...form, category: e.target.value })
            }
            style={{
              padding: 16,
              borderRadius: 16,
              border: "1px solid #e1e4e8",
              marginBottom: 16,
              width: "100%",
              fontSize: "16px",
              backgroundColor: "#f8f9fa",
              color: "#495057",
            }}
          >
            <option value="">Pilih Kategori</option>
            {categories.map((cat) => (
              <option key={cat.toLowerCase()} value={cat.toLowerCase()}>
                {cat}
              </option>
            ))}
          </select>

          <TouchableOpacity
            onPress={() =>
              updateId ? confirmUpdate(updateId) : handleSubmit()
            }
            disabled={updateId ? !isUpdateFormValid() : !isFormValid()}
            style={{
              padding: 16,
              borderRadius: 16,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: updateId
                ? isUpdateFormValid()
                  ? "#FC350B"
                  : "#e9ecef"
                : isFormValid()
                ? "#FC350B"
                : "#e9ecef",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Ionicons
              name={updateId ? "create-outline" : "add-circle-outline"}
              size={24}
              color="white"
            />
            <Text style={tw`text-white ml-2 font-semibold text-base`}>
              {updateId ? "Perbarui Aktivitas" : "Tambah Aktivitas"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Filter */}
        <Text style={tw`text-xl font-semibold text-gray-800 mb-3`}>
          Filter Berdasarkan Kategori
        </Text>
        <View style={tw`flex-row justify-around mb-6`}>
          {["All", ...categories].map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() =>
                setFilterCategory(cat === "All" ? "" : cat.toLowerCase())
              }
              style={[
                tw`py-3 px-5 rounded-full border`,
                {
                  backgroundColor:
                    filtercategory === (cat === "All" ? "" : cat.toLowerCase())
                      ? "#FC350B"
                      : "#ffffff",
                  borderColor:
                    filtercategory === (cat === "All" ? "" : cat.toLowerCase())
                      ? "#FC350B"
                      : "#e1e4e8",
                },
              ]}
            >
              <Text
                style={{
                  color:
                    filtercategory === (cat === "All" ? "" : cat.toLowerCase())
                      ? "white"
                      : "#495057",
                  fontSize: 14,
                }}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Daftar Aktivitas */}
        {aktivitas
          .filter((item) =>
            filtercategory ? item.category === filtercategory : true
          )
          .sort((a, b) => {
            if (a.completed && !b.completed) return 1;
            if (!a.completed && b.completed) return -1;
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          })
          .map((item) => (
            <View
              key={item.id}
              style={tw`p-5 rounded-3xl shadow-md mb-4 bg-white border border-gray-200`}
            >
              <View style={tw`flex-row justify-between items-center`}>
                <TouchableOpacity onPress={() => toggleChecked(item.id)}>
                  <Ionicons
                    name={
                      item.completed ? "checkbox-outline" : "square-outline"
                    }
                    size={28}
                    color="#FC350B"
                  />
                </TouchableOpacity>
                <View style={tw`flex-1 ml-3`}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: item.completed ? "#a0aec0" : "#2d3748",
                      textDecorationLine: item.completed
                        ? "line-through"
                        : "none",
                    }}
                  >
                    {item.name}
                  </Text>
                  <Text style={tw`text-sm text-gray-500`}>
                    {item.date} - {item.category}
                  </Text>
                </View>
                {!item.completed && (
                  <View style={tw`flex-row gap-3`}>
                    <TouchableOpacity
                      onPress={() => confirmDelete(item.id)}
                      style={tw`bg-red-600 p-2 rounded-xl`}
                    >
                      <Ionicons name="trash-outline" size={20} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setUpdateId(item.id);
                        setUpdateData({
                          name: item.name,
                          date: item.date,
                          category: item.category,
                        });
                      }}
                      style={tw`bg-yellow-500 p-2 rounded-xl`}
                    >
                      <Ionicons name="create-outline" size={20} color="white" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          ))}
      </ScrollView>

      {/* Alert */}
      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title={
          alertType === "delete" ? "Konfirmasi Hapus" : "Konfirmasi Perbarui"
        }
        message={
          alertType === "delete"
            ? "Apakah Anda yakin ingin menghapus aktivitas ini?"
            : "Apakah Anda yakin ingin memperbarui aktivitas ini?"
        }
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        showConfirmButton={true}
        cancelText="Batal"
        confirmText="Ya, Lanjutkan"
        confirmButtonColor="#FC350B"
        onCancelPressed={() => setShowAlert(false)}
        onConfirmPressed={() => {
          if (alertType === "delete" && selectedId !== null) {
            handleDelete(selectedId);
          } else if (alertType === "update" && selectedId !== null) {
            handleUpdate(selectedId);
          }
          setShowAlert(false);
        }}
      />
    </SafeAreaView>
  );
}
