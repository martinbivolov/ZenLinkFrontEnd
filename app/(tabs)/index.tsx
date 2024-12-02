import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Dimensions, Alert } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';

const screenWidth = Dimensions.get('window').width;

export default function TabOneScreen() {
  const [ecgData, setEcgData] = useState({
    labels: Array.from({ length: 60 }, (_, i) => `${(i % 5 === 0) ? i : ''}`),
    datasets: [{
      data: Array.from({ length: 60 }, () => 50),
      color: (opacity = 1) => `rgba(75, 123, 236, ${opacity})`,
    }]
  });
  const [heartRate, setHeartRate] = useState(84);
  const [signalQuality, setSignalQuality] = useState('Great');
  const [timeoutActive, setTimeoutActive] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let tick = 0;

    const intervalId = setInterval(() => {
      if (!timeoutActive) {
        tick++;
        const angle = tick * Math.PI / 180;
        const newPoint = 50 + Math.sin(angle * 5) * 25;
        const randomHR = Math.floor(Math.random() * (160 - 70 + 1) + 70);

        if (randomHR > 155) { 
          Alert.alert('Panic Attack?', 'Are you experiencing a panic attack?', [
            { text: 'No', onPress: () => console.log('No panic attack') },
            { 
              text: 'Yes', onPress: () => {
                router.push('/two');
                setTimeoutActive(true);
                setTimeout(() => {
                  setTimeoutActive(false);
                }, 300000); // 5 minutes
              }
            },
          ]);
        }

        setHeartRate(randomHR);
        setEcgData(prevData => ({
          ...prevData,
          datasets: [{
            ...prevData.datasets[0],
            data: [...prevData.datasets[0].data.slice(1), newPoint]
          }]
        }));
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeoutActive]);

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

const ws = new WebSocket('ws://127.0.0.1:8082');

ws.onopen = () => {
    console.log('WebSocket connected');
    ws.send('Hello from React!');
};

ws.onmessage = (event) => {
  console.log('Message from server:', event.data);
  try {
      const data = JSON.parse(event.data);
      if(data.IBI && data.GSR) {
          const heartRateFromIBI = Math.round(60000 / data.IBI);
          console.log(`Updated Heart Rate: ${heartRateFromIBI} BPM`);
          console.log(`GSR Value: ${data.GSR}`);
      }
  } catch (error) {
      console.error('Error parsing JSON from WebSocket', error);
  }
};


ws.onerror = (error) => {
    console.error('WebSocket error:', error);
};

ws.onclose = () => {
    console.log('WebSocket closed');
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
