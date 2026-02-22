import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useEffect, useState } from 'react';
import { openDatabase, printDbDiagnostics, ListRepository, ProductRepository, StoreRepository } from './src/database';

export default function App() {
  const [dbReady, setDbReady] = useState(false);
  const [message, setMessage] = useState('Initializing...');

  useEffect(() => {
    initDb();
  }, []);

  const initDb = async () => {
    try {
      const db = await openDatabase();
      await printDbDiagnostics(db);
      
      // Quick CRUD test
      const listRepo = new ListRepository(db);
      const productRepo = new ProductRepository(db);
      const storeRepo = new StoreRepository(db);
      
      // Create test data
      const listId = await listRepo.create({ name: 'Test List' });
      const productId = await productRepo.create({ name: 'Milk', barcode: '123456789' });
      const storeId = await storeRepo.create({ name: 'Local Store' });
      
      // Read back
      const list = await listRepo.findById(listId);
      const product = await productRepo.findByBarcode('123456789');
      
      setMessage(`✅ DB Ready!\nList: "${list?.name}"\nProduct: "${product?.name}"\nStore: "${storeId}"`);
      setDbReady(true);
    } catch (error) {
      console.error('DB Error:', error);
      setMessage(`❌ Error: ${error}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CompraJa</Text>
      <Text style={styles.version}>Version 1.0.0</Text>
      <Text style={styles.message}>{message}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  version: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  message: {
    fontSize: 14,
    color: '#666',
    marginTop: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
