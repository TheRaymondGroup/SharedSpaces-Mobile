// DASHBOARD

import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';


import { useRouter } from 'expo-router';

// export default function TabOneScreen() {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Tab One</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   separator: {
//     marginVertical: 30,
//     height: 1,
//     width: '80%',
//   },
// });

const router = useRouter();

export default function TabOneScreen() {
  // Array of pastel colors for the buttons
  const pastelColors = [
    '#FFB6C1', // Light Pink
    '#AFEEEE', // Pale Turquoise
    '#FFDAB9', // Peach Puff
    '#D8BFD8', // Thistle (Light Purple)
    '#98FB98', // Pale Green
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      
      <View style={styles.buttonsContainer}>
        <View style={styles.column}>
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: pastelColors[0] }]}
            onPress={() => router.push('/shared-event-list')}
          >
            <Text style={styles.buttonText}>1</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: pastelColors[1] }]}
            onPress={() => router.push('/shared-task-list')}
          >
            <Text style={styles.buttonText}>2</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: pastelColors[2] }]}
            onPress={() => console.log('Button 3 pressed')}
          >
            <Text style={styles.buttonText}>3</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.column}>
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: pastelColors[3] }]}
            onPress={() => console.log('Button 4 pressed')}
          >
            <Text style={styles.buttonText}>4</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: pastelColors[4] }]}
            onPress={() => console.log('Button 5 pressed')}
          >
            <Text style={styles.buttonText}>5</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
  column: {
    alignItems: 'center',
  },
  button: {
    width: 100,
    height: 100,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    // Add shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    // Add elevation for Android
    elevation: 3,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#555',
  },
});