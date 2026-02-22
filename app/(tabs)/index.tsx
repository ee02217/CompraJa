import { View, Text, StyleSheet } from 'react-native';
import Constants from 'expo-constants';

export default function HomeScreen() {
  const version = Constants.expoConfig?.version || '1.0.0';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CompraJa</Text>
      <Text style={styles.version}>Version {version}</Text>
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
});
