import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; 

const screenWidth = Dimensions.get('window').width;

export default function TabOneScreen() {
  const [ecgData, setEcgData] = useState({
    labels: Array.from({ length: 60 }, (_, i) => `${(i % 5 === 0) ? i : ''}`), // Mark every 5 units
    datasets: [{
      data: Array.from({ length: 60 }, () => 50), // Start at a base value
      color: (opacity = 1) => `rgba(75, 123, 236, ${opacity})`, // Using a soft blue
    }]
  });
  const [heartRate, setHeartRate] = useState(84); // Example static heart rate
  const [signalQuality, setSignalQuality] = useState('Great'); // Example signal quality

  useEffect(() => {
    let tick = 0;

    const intervalId = setInterval(() => {
      tick++;
      const angle = tick * Math.PI / 180;
      const newPoint = 50 + Math.sin(angle * 5) * 25; // Simulate an ECG waveform
      const randomHR = Math.floor(Math.random() * (90 - 70 + 1) + 70); // Randomize heart rate for demonstration

      setHeartRate(randomHR);
      setEcgData(prevData => ({
        ...prevData,
        datasets: [{
          ...prevData.datasets[0],
          data: [...prevData.datasets[0].data.slice(1), newPoint]
        }]
      }));
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Record ECG</Text>
      </View>
      <LineChart
        data={ecgData}
        width={screenWidth - 20}
        height={220}
        chartConfig={chartConfig}
        withHorizontalLabels={false}
        withVerticalLabels={false}
        withDots={false}
        withInnerLines={true}
        withOuterLines={false}
        bezier
      />
      <View style={styles.stats}>
        <View style={styles.heartRate}>
          <Icon name="heart-pulse" size={24} color="red" />
          <Text style={styles.statsText}>{heartRate} BPM</Text>
        </View>
        <View style={styles.signal}>
          <Icon name="wifi" size={24} color="green" />
          <Text style={styles.statsText}>{signalQuality} Signal</Text>
        </View>
      </View>
    </View>
  );
}

const chartConfig = {
  backgroundColor: '#f7f4f4',
  backgroundGradientFrom: '#fde2e2',
  backgroundGradientTo: '#a6dcef',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(75, 123, 236, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  strokeWidth: 2,
  propsForDots: {
    r: '6',
    strokeWidth: '2',
    stroke: '#ffa726'
  },
  propsForLabels: {
    fontSize: 12
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#f7f4f4',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    padding: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
  heartRate: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signal: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsText: {
    fontSize: 18,
    marginLeft: 5,
    color: '#222',
  },
});
