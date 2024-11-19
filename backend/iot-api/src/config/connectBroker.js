import mqtt from 'mqtt'
import {
    handleUpdateDate
} from '../controllers/controller'
// import { clientSockets, io } from '../server';
import { sendDataToDevice } from '../server';
export const userClients = {};

export const connectUser = (deviceId) => {
    const client = mqtt.connect('mqtt://192.168.63.114');
    // mqtt://192.168.63.114
    let mqttData = null
    let data = null
    let type = null
    client.on('connect', () => {
        console.log(`${deviceId} connected to MQTT broker`);
        client.subscribe(`${deviceId}/data/+`, (err) => {
            if (err) {
                console.error(`${deviceId} subscription error:`, err);
            }
        });
    });

    client.on('message', (topic, message) => {
        console.log(`${deviceId} received message on ${topic}: ${message.toString()}`);
        const now = new Date();

        const time = now.toLocaleTimeString();
        const date = now.toLocaleDateString();

        type = topic == `${deviceId}/data/air` ? "air" : topic == `${deviceId}/data/light` ? "light" : "rain"

        mqttData = {
            a: message.toString(),
            deviceId: deviceId,
            time: time,
            date: date
        }
        data = {
            type: type,
            mqttData: mqttData
        }

        // lưu data vào db
        handleUpdateDate(data)
        // truyền data tới client
        sendDataToDevice(deviceId, data);
        console.log(data);
    });

    userClients[deviceId] = client;
}

export const publishToTopic = (deviceId, subTopic, message) => {
    const client = userClients[deviceId];
    if (client) {
        const topic = `${deviceId}/${subTopic}`;
        client.publish(topic, message, (err) => {
            if (err) {
                console.error(`Publish error for user ${deviceId} on topic ${topic}:`, err);
            } else {
                console.log(`Message published to ${topic} for user ${deviceId}: ${message}`);
            }
        });
    } else {
        console.error(`Client not found for user ${deviceId}. Please ensure the user is connected.`);
    }
}