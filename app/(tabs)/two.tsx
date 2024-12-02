import React, { useState } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { TouchableOpacity, GestureHandlerRootView } from 'react-native-gesture-handler';

interface Suggestion {
  id: number;
  title: string;
  description: string;
}

const suggestions: Suggestion[] = [
  { id: 1, title: "Breathing Exercises", description: "Practice deep breathing for 5 minutes." },
  { id: 2, title: "Grounding Techniques", description: "Touch grass." },
  { id: 3, title: "Meditation", description: "Meditate for 10 minutes to clear your mind." },
];

export default function TabTwoScreen() {
  const [data, setData] = useState(suggestions);
  const [selectedSuggestion, setSelectedSuggestion] = useState<number | null>(null);

  const renderItem = ({ item, drag, isActive }: { item: Suggestion, drag: () => void, isActive: boolean }) => (
    <TouchableOpacity
      onLongPress={drag}
      onPress={() => setSelectedSuggestion(item.id)}
      style={[
        styles.suggestionContainer,
        isActive && styles.active,
        selectedSuggestion === item.id && styles.selected
      ]}
    >
      <Image source={require('../(tabs)/pics/arrows-up-down.png')} style={styles.dragIcon} />
      <View style={styles.textContainer}>
        <Text style={styles.suggestionTitle}>{item.title}</Text>
        <Text style={styles.suggestionDescription}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#f8f8f8' }}>
      <View style={styles.header}>
        <Text style={styles.title}>Personalized Coping Tools</Text>
        <View style={styles.separator} />
      </View>
      <DraggableFlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => `draggable-item-${item.id}`}
        onDragEnd={({ data }) => setData(data)}
        contentContainerStyle={styles.listContainer}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  separator: {
    marginVertical: 10,
    height: 1,
    width: '80%',
    backgroundColor: '#ccc',
    alignSelf: 'center',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  suggestionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    padding: 15,
    marginVertical: 10,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  suggestionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  suggestionDescription: {
    fontSize: 16,
    color: 'gray',
    marginTop: 5,
  },
  selected: {
    borderColor: '#007bff',
    borderWidth: 2,
  },
  active: {
    opacity: 0.8,
  },
  dragIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
});
