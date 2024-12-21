import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  TextInput,
  ImageBackground,
} from 'react-native';
import {
  addTodo,
  deleteTodo,
  getTodos,
  initDatabase,
  updateTodoStatus,
} from './src/databases/Sqlite';
import {Todo} from './src/types/types';
import TodoItem from './src/components/TodoItem';

const App = () => {
  useEffect(() => {
    initDatabase();
  }, []);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const loadTodos = async () => {
    try {
      const result = await getTodos();
      setTodos(result);
    } catch (error) {
      console.error('Error loading todos:', error);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const handleAddTodo = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Judul tugas tidak boleh kosong');
      return;
    }

    try {
      await addTodo(title, description);
      loadTodos();
      setTitle('');
      setDescription('');
      setModalVisible(false);
    } catch (error) {
      console.error('Error adding todo:', error);
      Alert.alert('Error', 'Gagal menambahkan tugas');
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      await deleteTodo(id);
      loadTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleToggleComplete = async (id: number, currentStatus: number) => {
    try {
      await updateTodoStatus(id, currentStatus === 0);
      loadTodos();
    } catch (error) {
      console.error('Error updating todo status:', error);
    }
  };

  return (
    <>
      <ImageBackground
        source={{
          uri: 'https://i.pinimg.com/474x/d7/66/64/d7666498099c3d9edbf24018cd854296.jpg',
        }} // Gantilah dengan link gambar yang sesuai
        style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Daftar Liburan ({todos.length})</Text>
        </View>

        {todos.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Tidak ada agenda liburan</Text>
            <Text style={styles.emptySubtext}>
              Tambahkan rencana perjalanan baru dengan menekan tombol di bawah
            </Text>
          </View>
        ) : (
          <FlatList
            data={todos}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => (
              <TodoItem
                todo={item}
                onDelete={() => handleDeleteTodo(item.id)}
                onToggleComplete={() =>
                  handleToggleComplete(item.id, item.completed)
                }
              />
            )}
          />
        )}

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}>
          <Text style={styles.addButtonText}>+ Tambah Rencana Liburan</Text>
        </TouchableOpacity>
      </ImageBackground>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          console.log('Modal closed');
        }}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Tambah Rencana Liburan</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButtonText}>❌</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Judul</Text>
            <TextInput
              style={styles.inputField}
              value={title}
              onChangeText={text => setTitle(text)}
            />

            <Text style={styles.inputLabel}>Deskripsi</Text>
            <TextInput
              style={styles.inputField}
              value={description}
              onChangeText={text => setDescription(text)}
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleAddTodo}>
              <Text style={styles.saveButtonText}>Simpan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-start',
    backgroundColor: 'rgba(245, 245, 245, 0.7)', // Agar gambar sedikit transparan
  },
  header: {
    width: '100%',
    marginBottom: 16,
    backgroundColor: '#ffebcd',
    padding: 16,
    borderRadius: 8,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  emptySubtext: {
    marginTop: 8,
    color: 'white',
  },
  addButton: {
    backgroundColor: '#28a745',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 14,
    paddingVertical: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    marginBottom: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  inputLabel: {
    marginBottom: 8,
    color: '#6c757d',
  },
  inputField: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 4,
    padding: 10,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  saveButton: {
    backgroundColor: '#007bff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default App;
