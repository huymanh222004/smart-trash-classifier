// Import SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";

// Cấu hình Firebase của bạn
const firebaseConfig = {
  apiKey: "AIzaSyAVuywD6lftw9-gkLmsrMBxQwFjYKXjNC8",
  authDomain: "phan-loai-rac-thong-minh.firebaseapp.com",
  databaseURL: "https://phan-loai-rac-thong-minh-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "phan-loai-rac-thong-minh",
  storageBucket: "phan-loai-rac-thong-minh.firebasestorage.app",
  messagingSenderId: "690064789355",
  appId: "1:690064789355:web:601933bf26916e93f2c62e",
  measurementId: "G-DBHH3HSD11"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Tham chiếu đến UI
const dashboard = document.getElementById('dashboard');
const welcomeMsg = document.getElementById('welcome-msg');

// Lắng nghe dữ liệu Real-time
const statsRef = ref(database, 'smarttrash/live_stats');

onValue(statsRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
        // Có dữ liệu -> Hiển thị Dashboard
        welcomeMsg.classList.add('hidden');
        dashboard.classList.remove('hidden');
        updateDashboard(data);
    } else {
        // Chưa có dữ liệu
        welcomeMsg.innerHTML = `
            <h2>Chưa có dữ liệu</h2>
            <p>Đã kết nối Firebase thành công, nhưng hệ thống AI chưa gửi dữ liệu nào lên.</p>
        `;
    }
}, (error) => {
    console.error("Firebase read error: ", error);
    welcomeMsg.innerHTML = `
        <h2 style="color: #ef4444;">Lỗi kết nối Firebase</h2>
        <p>${error.message}</p>
    `;
});

function updateDashboard(data) {
    if (!data) return;

    // Cập nhật Tổng
    animateValue('lblTotal', data.total || 0);
    document.getElementById('lblTime').innerText = data.last_updated || '--:--:--';

    // Cập nhật các món rác
    if (data.stats) {
        const keys = ['Chai_nước', 'Lon_nước_ngọt', 'Vỏ_kẹo', 'Thuốc_lá'];
        const realKeys = ['Chai nước', 'Lon nước ngọt', 'Vỏ kẹo', 'Thuốc lá'];
        
        for(let i=0; i<keys.length; i++) {
            const val = data.stats[realKeys[i]] || 0;
            const elId = `val_${keys[i]}`;
            animateValue(elId, val);
        }
    }
}

function animateValue(id, newValue) {
    const el = document.getElementById(id);
    if (!el) return;
    const currentVal = parseInt(el.innerText) || 0;
    if (currentVal !== newValue) {
        el.innerText = newValue;
        // Thêm hiệu ứng pop
        el.classList.add('pop');
        setTimeout(() => el.classList.remove('pop'), 300);
    }
}
