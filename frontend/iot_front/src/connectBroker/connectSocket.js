import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const useSocket = ({ setAir, setLight, setSwitch, setLed, setToggle,deviceId }) => {
    const socketRef = useRef(null);

    useEffect(() => {
        if (!deviceId) return; // Không làm gì nếu deviceId chưa được cung cấp

        console.log(deviceId)
        // Khởi tạo socket với deviceId
        const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:8080', {
            query: { deviceId }, // Gửi deviceId trong query
        });

        // Lưu tham chiếu socket
        socketRef.current = socket;

        // Khi kết nối với server thành công
        socket.on('connect', () => {
            console.log('Connected to WebSocket server with deviceId:', deviceId);
        });

        // Lắng nghe sự kiện 'receive-data' từ server
        socket.on('receive-data', (data) => {
            console.log('Data received from server:', data);
            if (data.type === 'air') setAir(data.mqttData.a);
            else if (data.type === 'light') setLight(data.mqttData.a);
            else if (data.type === 'switch') setSwitch(data.mqttData.a);
            else if(data.type === 'led') setLed(data.mqttData.a);
            else if(data.type === 'toggle') setToggle(data.mqttData.a);
            else console.log('Không nhận được data');
        });

        // Xử lý ngắt kết nối
        socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });

        // Cleanup socket khi deviceId thay đổi hoặc component bị unmount
        return () => {
            console.log(`Cleaning up socket for deviceId: ${deviceId}`);
            socket.disconnect();
            socketRef.current = null;
        };
    }, [deviceId]); // Re-run effect khi deviceId thay đổi

    // Hàm để gửi dữ liệu qua socket
    const send = (topic, data) => {
        if (socketRef.current) {
            console.log(`Sending message with data:`, data);
            socketRef.current.emit('message', {topic, data});
        } else {
            console.error('Socket is not initialized');
        }
    };

    // Trả về hàm send
    return { send }; 
};

export default useSocket;
