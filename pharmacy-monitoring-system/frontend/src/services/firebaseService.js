// src/services/firebaseService.js

import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBhvUVhQAP-xq7Rz939rUU6qIWoKxeryxc",
  authDomain: "iotdba.firebaseapp.com",
  databaseURL: "https://iotdba-default-rtdb.firebaseio.com",
  projectId: "iotdba",
  storageBucket: "iotdba.firebasestorage.app",
  messagingSenderId: "411508735012",
  appId: "1:411508735012:web:0fce1b1934e2fee6056cb1"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export function subscribeToSensorData(callback) {
  const sensorRef = ref(db, "logs");

  onValue(sensorRef, (snapshot) => {
    const logs = snapshot.val();

    if (!logs) {
      callback(null);
      return;
    }

    const records = Object.values(logs);

    const last30 = records.slice(-30);

    const history = last30.map((r, index) => ({
      time: r.time || index,
      temperature: r.temperature,
      humidity: r.humidity,
      light: r.light,
      airQuality: r.air_quality_ppm,
    }));

    const latest = last30[last30.length - 1];

    callback({
      current: {
        temperature: latest.temperature,
        humidity: latest.humidity,
        light: latest.light,
        airQuality: latest.air_quality_ppm,
        status: latest.status,
        timestamp: latest.timestamp,
      },
      history,
    });
  });
}