import express from 'express'
import bodyParser from 'body-parser'
import viewEngine from './config/viewEngine'
import initWebRouter from './route/web'
import connectDB from './config/connectDB'
import { userClients, connectUser, publishToTopic } from './config/connectBroker'
import http from 'http'  // Thêm http module
import socketIo from 'socket.io'  // Thêm socket.io module
require('dotenv').config()


let cors = require('cors')
let app = express()
let server = http.createServer(app)  // Tạo server HTTP từ Express app
let io = socketIo(server, {
  cors: {
      origin: process.env.URL_REACT || "http://localhost:3000", // Đổi thành URL React của bạn
      methods: ["GET", "POST"], // Phương thức được phép
      allowedHeaders: ["X-Requested-With", "content-type"], // Các header được phép
      credentials: true, // Cho phép gửi cookie hoặc thông tin xác thực
  },
})  // Khởi tạo socket.io server

export function sendDataToDevice(deviceId, data) {
  if (clientSockets[deviceId]) {
      clientSockets[deviceId].emit('receive-data', data); // Gửi dữ liệu đến deviceId tương ứng
  } else {
      console.error(`Socket for device ${deviceId} not found`);
  }
}

let port = process.env.PORT || 8080
let clientSockets = {};
// const clientStatuses = Object.keys(clientSockets).reduce((acc, deviceId) => {
//   acc[deviceId] = clientSockets[deviceId].connected; // Trạng thái kết nối của mỗi client
//   return acc;
// }, {});
// Cấu hình CORS
app.use(cors())
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', process.env.URL_REACT)
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
    res.setHeader('Access-Control-Allow-Credentials', true)
    next()
})

app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

viewEngine(app)
initWebRouter(app)

connectDB()

// Kết nối các user
connectUser('dev001')
connectUser('dev002')

// Thiết lập sự kiện khi một client kết nối WebSocket
io.on('connection', (socket) => {
    console.log('A new WebSocket client connected')

    const deviceId = socket.handshake.query.deviceId; // Giả sử deviceId được gửi trong query

    // Lưu socket vào đối tượng userClients
    clientSockets[deviceId] = socket;

    // Lắng nghe sự kiện từ client
    socket.on('message', (msg) => {
        console.log('Received message:', msg)
        publishToTopic(deviceId, msg.topic, msg.data);

        // Gửi lại thông điệp cho client (echo message)
        socket.emit('message', `Echo: ${msg}`)
    })

    // Khi client ngắt kết nối
    socket.on('disconnect', () => {
        console.log('A client disconnected')
        delete clientSockets[deviceId];
    })

    // Gửi thông điệp chào mừng khi client mới kết nối
    socket.emit('message', 'Welcome to the Socket.io server!')
})

// Bắt đầu server tại cổng đã chỉ định
server.listen(port, () => {
    console.log(`Server is running at: http://localhost:${port}`)
})


module.exports = {
  clientSockets,
  sendDataToDevice
}