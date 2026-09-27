import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  FileText, 
  Settings, 
  LogOut, 
  Bell, 
  Search, 
  Download, 
  Plus, 
  TrendingUp, 
  AlertCircle,
  DollarSign,
  CheckCircle,
  Loader2,
  Store,
  Filter,
  Truck,
  Clock,
  MapPin,
  Map,
  X,
  ArrowRight,
  RefreshCw,
  User,
  Shield,
  Briefcase,
  ShoppingCart,
  Radio,
  Cpu,
  Trash2,
  AlertTriangle,
  Calendar,
  Info,
  Layers,
  PieChart as PieChartIcon,
  Activity,
  BarChart3,
  Zap
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Legend, Cell, AreaChart, Area, PieChart as RePieChart, Pie
} from 'recharts';

import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot, collection, query } from 'firebase/firestore';

let app, auth, db, appId, firebaseConfig;
try {
  firebaseConfig = JSON.parse(__firebase_config);
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
} catch (e) {}

const initialData = [
  { id: 'V001', name: 'Xúc xích tiệt trùng Heo 40g', category: 'Xúc xích', stock: 120, sold: 1500, price: 12000, minStock: 50, store: 'Kho Tổng' },
  { id: 'V002', name: 'Thịt heo Vissan đóng hộp 150g', category: 'Đồ hộp', stock: 85, sold: 420, price: 35000, minStock: 30, store: 'Kho Tổng' },
  { id: 'V003', name: 'Lạp xưởng Mai Quế Lộ 500g', category: 'Lạp xưởng', stock: 15, sold: 120, price: 95000, minStock: 20, store: 'Kho Tổng' },
  { id: 'V004', name: 'Pate gan heo hộp 170g', category: 'Đồ hộp', stock: 200, sold: 850, price: 25000, minStock: 40, store: 'Kho Tổng' },
  { id: 'V005', name: 'Xúc xích Cocktail 200g', category: 'Xúc xích', stock: 110, sold: 340, price: 42000, minStock: 30, store: 'Kho Tổng' },
  { id: 'V006', name: 'Thịt bò xay đông lạnh 500g', category: 'Thịt mát', stock: 45, sold: 90, price: 115000, minStock: 20, store: 'Kho Tổng' },
  { id: 'V007', name: 'Giăm bông vai Vissan 200g', category: 'Đồ nguội', stock: 8, sold: 110, price: 65000, minStock: 15, store: 'Kho Tổng' },

  { id: 'V008', name: 'Xúc xích Red 40g', category: 'Xúc xích', stock: 40, sold: 2100, price: 10000, minStock: 50, store: 'CN Quận 1' },
  { id: 'V009', name: 'Cá sốt cà Vissan hộp 170g', category: 'Đồ hộp', stock: 150, sold: 630, price: 18000, minStock: 30, store: 'CN Quận 1' },
  { id: 'V010', name: 'Thịt heo xay thảo mộc 300g', category: 'Thịt mát', stock: 12, sold: 180, price: 45000, minStock: 15, store: 'CN Quận 1' },
  { id: 'V011', name: 'Chả giò tôm thịt 500g', category: 'Chế biến sẵn', stock: 65, sold: 290, price: 55000, minStock: 25, store: 'CN Quận 1' },
  { id: 'V012', name: 'Ba rọi xông khói 200g', category: 'Đồ nguội', stock: 35, sold: 410, price: 72000, minStock: 20, store: 'CN Quận 1' },
  { id: 'V013', name: 'Thịt kho trứng Vissan 300g', category: 'Chế biến sẵn', stock: 18, sold: 150, price: 52000, minStock: 20, store: 'CN Quận 1' },

  { id: 'V014', name: 'Xúc xích phô mai 200g', category: 'Xúc xích', stock: 80, sold: 520, price: 48000, minStock: 25, store: 'CN Quận 3' },
  { id: 'V015', name: 'Sườn non heo sạch 500g', category: 'Thịt mát', stock: 5, sold: 85, price: 95000, minStock: 10, store: 'CN Quận 3' },
  { id: 'V016', name: 'Bò viên Vissan 200g', category: 'Chế biến sẵn', stock: 90, sold: 310, price: 38000, minStock: 20, store: 'CN Quận 3' },
  { id: 'V017', name: 'Thịt heo hầm Vissan 150g', category: 'Đồ hộp', stock: 110, sold: 200, price: 36000, minStock: 30, store: 'CN Quận 3' },
  { id: 'V018', name: 'Lạp xưởng tôm 500g', category: 'Lạp xưởng', stock: 25, sold: 160, price: 110000, minStock: 15, store: 'CN Quận 3' },
  { id: 'V019', name: 'Giò lụa đặc biệt 500g', category: 'Đồ nguội', stock: 14, sold: 220, price: 85000, minStock: 15, store: 'CN Quận 3' },

  { id: 'V020', name: 'Xúc xích tiệt trùng Bò 40g', category: 'Xúc xích', stock: 250, sold: 1800, price: 13000, minStock: 50, store: 'CN Thủ Đức' },
  { id: 'V021', name: 'Gà ta thả vườn nguyên con', category: 'Thịt mát', stock: 18, sold: 45, price: 180000, minStock: 15, store: 'CN Thủ Đức' },
  { id: 'V022', name: 'Háo cảo tôm thịt 500g', category: 'Chế biến sẵn', stock: 75, sold: 280, price: 62000, minStock: 20, store: 'CN Thủ Đức' },
  { id: 'V023', name: 'Xúc xích tỏi 200g', category: 'Xúc xích', stock: 9, sold: 190, price: 40000, minStock: 20, store: 'CN Thủ Đức' },
  { id: 'V024', name: 'Sườn ram mặn hộp 150g', category: 'Đồ hộp', stock: 130, sold: 210, price: 34000, minStock: 30, store: 'CN Thủ Đức' },
  { id: 'V025', name: 'Nạc dăm heo sạch 500g', category: 'Thịt mát', stock: 22, sold: 115, price: 75000, minStock: 15, store: 'CN Thủ Đức' },
];

const initialOrders = [
  { id: 'ORD-8801', customer: 'Đại lý Tạp hóa Q1', store: 'CN Quận 1', status: 'shipping', itemsCount: 5, total: 1250000, estimatedTime: '15 phút', progress: 85, orderTime: '08:30', destination: 'Nguyễn Đình Chiểu, Q1', currentLoc: 'Ngã tư Nguyễn Bỉnh Khiêm' },
  { id: 'ORD-8802', customer: 'Siêu thị Mini Thủ Đức', store: 'CN Thủ Đức', status: 'processing', itemsCount: 12, total: 4500000, estimatedTime: '2.5 giờ', progress: 10, orderTime: '10:15', destination: 'Kha Vạn Cân, Thủ Đức', currentLoc: 'Đang xếp hàng lên xe tại Kho' },
  { id: 'ORD-8803', customer: 'Khách lẻ (App)', store: 'Kho Tổng', status: 'shipping', itemsCount: 2, total: 240000, estimatedTime: '45 phút', progress: 45, orderTime: '11:20', destination: 'Lê Lợi, Q1', currentLoc: 'Đi qua cầu Sài Gòn' },
  { id: 'ORD-8804', customer: 'Cửa hàng Tiện lợi Q3', store: 'CN Quận 3', status: 'delivered', itemsCount: 8, total: 1850000, estimatedTime: 'Đã giao', progress: 100, orderTime: '07:00', destination: 'Cách Mạng Tháng 8, Q3', currentLoc: 'Đã hoàn thành' },
];

const initialLossLogs = [
  { id: 'LOSS-01', item: 'Giăm bông vai Vissan 200g', store: 'Kho Tổng', qty: 2, reason: 'Hư hỏng do sự cố tủ mát (Cảm biến nhiệt độ #04)', time: 'Hôm nay, 08:15', type: 'sensor_alert' },
  { id: 'LOSS-02', item: 'Sườn non heo sạch 500g', store: 'CN Quận 3', qty: 1, reason: 'Hết hạn sử dụng (Cảm biến RFID tự động loại bỏ)', time: 'Hôm qua, 22:30', type: 'expiry' },
];

const baseSalesData = [
  { name: 'T2', Xúc_xích: 4000, Đồ_hộp: 2400, Lạp_xưởng: 2400, Tổng_bán: 140 },
  { name: 'T3', Xúc_xích: 3000, Đồ_hộp: 1398, Lạp_xưởng: 2210, Tổng_bán: 110 },
  { name: 'T4', Xúc_xích: 2000, Đồ_hộp: 9800, Lạp_xưởng: 2290, Tổng_bán: 180 },
  { name: 'T5', Xúc_xích: 2780, Đồ_hộp: 3908, Lạp_xưởng: 2000, Tổng_bán: 130 },
  { name: 'T6', Xúc_xích: 1890, Đồ_hộp: 4800, Lạp_xưởng: 2181, Tổng_bán: 160 },
  { name: 'T7', Xúc_xích: 2390, Đồ_hộp: 3800, Lạp_xưởng: 2500, Tổng_bán: 210 },
  { name: 'CN', Xúc_xích: 3490, Đồ_hộp: 4300, Lạp_xưởng: 2100, Tổng_bán: 250 },
];

const STORE_LIST = ['Kho Tổng', 'CN Quận 1', 'CN Quận 3', 'CN Thủ Đức'];
const CATEGORY_COLORS = {
  'Xúc xích': '#ef4444',
  'Đồ hộp': '#3b82f6',
  'Lạp xưởng': '#f59e0b',
  'Thịt mát': '#10b981',
  'Đồ nguội': '#8b5cf6',
  'Chế biến sẵn': '#ec4899'
};

const PIE_COLORS = ['#ef4444', '#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899'];

export default function VissanDashboard() {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(true); 
  const [activeTab, setActiveTab] = useState('overview');
  const [overviewModule, setOverviewModule] = useState('all'); 
  const [inventory, setInventory] = useState([]);
  const [orders, setOrders] = useState([]);
  const [lossLogs, setLossLogs] = useState(initialLossLogs);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSensorNotifications, setShowSensorNotifications] = useState(false);

  const [toastMessage, setToastMessage] = useState('');
  const [selectedStoreFilter, setSelectedStoreFilter] = useState('All');
  const [selectedOrderForMap, setSelectedOrderForMap] = useState(null);
  const [timeframeFilter, setTimeframeFilter] = useState('7days');

  const [posCart, setPosCart] = useState([]);
  const [posStore, setPosStore] = useState('CN Quận 1');
  
  const [showLossModal, setShowLossModal] = useState(false);
  const [lossForm, setLossForm] = useState({ itemId: '', qty: 1, reason: 'Hư hỏng tủ mát', store: 'CN Quận 1' });

  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminProfile, setAdminProfile] = useState(() => {
    const saved = localStorage.getItem('vissan_admin_profile');
    return saved ? JSON.parse(saved) : {
      name: 'Quản trị viên',
      role: 'Giám đốc Vận hành chuỗi',
      branch: 'Hội sở chính TP.HCM',
      email: 'admin.hcm@vissan.com'
    };
  });

  const [formData, setFormData] = useState({
    id: '', name: '', category: 'Xúc xích', stock: '', price: '', minStock: 20, store: 'Kho Tổng'
  });
  const [isUpdatingMode, setIsUpdatingMode] = useState(false);

  useEffect(() => {
    if (!auth) return;
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {}
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user || !db) return;
    const inventoryRef = collection(db, 'artifacts', appId, 'users', user.uid, 'vissan_inventory');
    const unsubscribe = onSnapshot(query(inventoryRef), async (snapshot) => {
      if (snapshot.empty) {
        try {
          for (const item of initialData) await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'vissan_inventory', item.id), item);
        } catch (err) {}
      } else {
        const fetchedData = [];
        snapshot.forEach(doc => fetchedData.push(doc.data()));
        fetchedData.sort((a, b) => a.id.localeCompare(b.id));
        setInventory(fetchedData);
      }
    });

    const ordersRef = collection(db, 'artifacts', appId, 'users', user.uid, 'vissan_orders');
    const unsubscribeOrders = onSnapshot(query(ordersRef), async (snapshot) => {
      if (snapshot.empty) {
        try {
          for (const order of initialOrders) await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'vissan_orders', order.id), order);
        } catch (err) {}
      } else {
        const fetchedOrders = [];
        snapshot.forEach(doc => fetchedOrders.push(doc.data()));
        setOrders(fetchedOrders);
      }
    });

    return () => { unsubscribe(); unsubscribeOrders(); };
  }, [user]);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(''), 3500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const timeframeMultiplier = useMemo(() => {
    if (timeframeFilter === 'today') return 0.18;
    if (timeframeFilter === '7days') return 1.0;
    if (timeframeFilter === 'month') return 3.6;
    return 1.0;
  }, [timeframeFilter]);

  const metrics = useMemo(() => {
    let totalStock = 0, baseSold = 0, baseRevenue = 0, inventoryValue = 0, lowStockItems = [];
    let revenueByCategory = {};
    let stockByCategory = {};
    
    inventory.forEach(item => {
      const st = Number(item.stock) || 0;
      const sd = Number(item.sold) || 0;
      const pr = Number(item.price) || 0;
      totalStock += st;
      baseSold += sd;
      const itemRev = sd * pr;
      baseRevenue += itemRev;
      inventoryValue += st * pr;
      if (st < Number(item.minStock)) lowStockItems.push(item);
      
      const cat = item.category || 'Khác';
      revenueByCategory[cat] = (revenueByCategory[cat] || 0) + (itemRev * timeframeMultiplier);
      stockByCategory[cat] = (stockByCategory[cat] || 0) + st;
    });

    const totalRevenue = Math.round(baseRevenue * timeframeMultiplier);
    const totalSold = Math.round(baseSold * timeframeMultiplier);

    const revenueByCategoryArray = Object.keys(revenueByCategory).map(cat => ({
      name: cat,
      value: Math.round(revenueByCategory[cat]),
      color: CATEGORY_COLORS[cat] || '#ef4444'
    }));

    const stockByCategoryArray = Object.keys(stockByCategory).map(cat => ({
      name: cat,
      tồn_kho: stockByCategory[cat]
    }));

    return { totalStock, totalSold, totalRevenue, inventoryValue, lowStockItems, revenueByCategoryArray, stockByCategoryArray };
  }, [inventory, timeframeMultiplier]);

  const forecastData = useMemo(() => {
    return inventory.map(item => {
      const dailyVelocity = Math.max(0.5, (Number(item.sold) || 10) / 30);
      const daysLeft = Math.round((Number(item.stock) || 0) / dailyVelocity);
      const recommendedRestock = Math.max(0, (Number(item.minStock) || 20) * 2 - Number(item.stock));
      let riskLevel = 'Ổn định';
      if (daysLeft <= 3) riskLevel = 'Nguy cấp (Đứt gãy)';
      else if (daysLeft <= 7) riskLevel = 'Cảnh báo sớm';

      return {
        ...item,
        dailyVelocity: dailyVelocity.toFixed(1),
        daysLeft,
        recommendedRestock,
        riskLevel
      };
    }).filter(i => i.daysLeft <= 10).sort((a, b) => a.daysLeft - b.daysLeft);
  }, [inventory]);

  const dynamicSalesData = useMemo(() => {
    return baseSalesData.map(row => ({
      name: row.name,
      Xúc_xích: Math.round(row.Xúc_xích * timeframeMultiplier),
      Đồ_hộp: Math.round(row.Đồ_hộp * timeframeMultiplier),
      Lạp_xưởng: Math.round(row.Lạp_xưởng * timeframeMultiplier),
      Tổng_bán: Math.round(row.Tổng_bán * timeframeMultiplier),
    }));
  }, [timeframeMultiplier]);

  const storeMetrics = useMemo(() => {
    const stores = {};
    STORE_LIST.forEach(s => {
      stores[s] = { name: s, totalStock: 0, totalRevenue: 0, lowStockItems: [], itemsCount: 0, items: [] };
    });
    inventory.forEach(item => {
      const storeName = item.store || 'Kho Tổng';
      if (!stores[storeName]) {
        stores[storeName] = { name: storeName, totalStock: 0, totalRevenue: 0, lowStockItems: [], itemsCount: 0, items: [] };
      }
      stores[storeName].totalStock += Number(item.stock) || 0;
      stores[storeName].totalRevenue += Math.round(((Number(item.sold) || 0) * (Number(item.price) || 0)) * timeframeMultiplier);
      stores[storeName].itemsCount += 1;
      stores[storeName].items.push(item);
      if (Number(item.stock) < Number(item.minStock)) {
        stores[storeName].lowStockItems.push(item);
      }
    });
    return stores;
  }, [inventory, timeframeMultiplier]);

  const storeComparisonArray = useMemo(() => {
    return STORE_LIST.map(s => ({
      name: s,
      doanh_thu: storeMetrics[s].totalRevenue,
      tồn_kho: storeMetrics[s].totalStock,
      báo_động: storeMetrics[s].lowStockItems.length
    }));
  }, [storeMetrics]);

  const filteredInventory = useMemo(() => {
    return inventory.filter(i => {
      const matchesStore = selectedStoreFilter === 'All' || i.store === selectedStoreFilter;
      const matchesSearch = i.name.toLowerCase().includes(searchQuery.toLowerCase()) || i.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStore && matchesSearch;
    });
  }, [inventory, selectedStoreFilter, searchQuery]);

  const handleLogin = useCallback((e) => { e.preventDefault(); setIsLoggedIn(true); }, []);
  const handleFormChange = useCallback((e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value })), []);

  const handleRestockClick = useCallback((item) => {
    setFormData({ 
      id: item.id, 
      name: item.name, 
      category: item.category, 
      stock: item.stock, 
      price: item.price, 
      minStock: item.minStock, 
      store: item.store || 'Kho Tổng' 
    });
    setIsUpdatingMode(true);
    setActiveTab('dataEntry');
    setToastMessage(`Đã chọn sản phẩm: ${item.name} tại [${item.store}].`);
    setShowNotifications(false);
  }, []);

  const handleKPIClick = useCallback((filterType) => {
    setActiveTab('inventory');
    if (filterType === 'alert') {
      setSelectedStoreFilter('All');
      setSearchQuery('');
      setToastMessage("Đã lọc danh sách các mặt hàng cần nhập gấp!");
    } else {
      setSelectedStoreFilter('All');
      setSearchQuery('');
      setToastMessage(`Đã chuyển tới toàn bộ danh sách kho hàng.`);
    }
  }, []);

  const addToPosCart = (item) => {
    if (item.stock <= 0) {
      setToastMessage(`⚠️ Cảnh báo: Mặt hàng [${item.name}] đã hết hàng trong kho!`);
      return;
    }
    setPosCart(prev => {
      const exist = prev.find(p => p.id === item.id);
      if (exist) {
        if (exist.quantity >= item.stock) {
          setToastMessage(`⚠️ Số lượng trong giỏ vượt quá tồn kho thực tế (${item.stock})!`);
          return prev;
        }
        return prev.map(p => p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const handleCheckoutPOS = async () => {
    if (posCart.length === 0 || !user || !db) return;
    
    for (const cartItem of posCart) {
      const currentItem = inventory.find(i => i.id === cartItem.id);
      if (!currentItem || currentItem.stock < cartItem.quantity) {
        setToastMessage(`❌ Lỗi thanh toán: Sản phẩm [${cartItem.name}] không đủ tồn kho (Còn lại: ${currentItem ? currentItem.stock : 0})!`);
        return;
      }
    }

    try {
      for (const cartItem of posCart) {
        const itemRef = doc(db, 'artifacts', appId, 'users', user.uid, 'vissan_inventory', cartItem.id);
        const currentItem = inventory.find(i => i.id === cartItem.id);
        if (currentItem) {
          const newStock = Math.max(0, currentItem.stock - cartItem.quantity);
          const newSold = (currentItem.sold || 0) + cartItem.quantity;
          await setDoc(itemRef, { ...currentItem, stock: newStock, sold: newSold });
        }
      }
      setToastMessage(`✅ Thanh toán POS thành công! Đã trừ kho và cập nhật doanh thu.`);
      setPosCart([]);
    } catch (e) {
      setToastMessage("❌ Lỗi xử lý thanh toán POS!");
    }
  };

  const handleReportLoss = async (e) => {
    e.preventDefault();
    if (!user || !db) return;
    const targetItem = inventory.find(i => i.id === lossForm.itemId);
    if (!targetItem) {
      setToastMessage("Không tìm thấy mã sản phẩm phù hợp!");
      return;
    }
    const lossQty = Number(lossForm.qty);
    if (lossQty > targetItem.stock) {
      setToastMessage(`❌ Lỗi: Số lượng thất thoát (${lossQty}) lớn hơn tồn kho hiện tại (${targetItem.stock})!`);
      return;
    }

    try {
      const itemRef = doc(db, 'artifacts', appId, 'users', user.uid, 'vissan_inventory', targetItem.id);
      const newStock = Math.max(0, targetItem.stock - lossQty);
      await setDoc(itemRef, { ...targetItem, stock: newStock });

      const newLog = {
        id: `LOSS-${Date.now().toString().slice(-4)}`,
        item: targetItem.name,
        store: targetItem.store,
        qty: lossQty,
        reason: lossForm.reason,
        time: 'Vừa xong',
        type: 'sensor_alert'
      };
      setLossLogs([newLog, ...lossLogs]);
      setShowLossModal(false);
      setToastMessage(`⚠️ Cảm biến ghi nhận thất thoát: Trừ ${lossQty} SP [${targetItem.name}] khỏi kho!`);
    } catch (err) {
      setToastMessage("Lỗi ghi nhận cảm biến thất thoát!");
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!user || !db) return setToastMessage("Chưa kết nối được máy chủ!");
    const idFormatted = formData.id.trim().toUpperCase();
    const existingItem = inventory.find(i => i.id === idFormatted);
    const newItem = {
      id: idFormatted, 
      name: formData.name, 
      category: formData.category, 
      stock: Number(formData.stock), 
      price: Number(formData.price), 
      minStock: Number(formData.minStock), 
      store: formData.store, 
      sold: existingItem ? existingItem.sold : 0
    };
    try {
      await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'vissan_inventory', newItem.id), newItem);
      setToastMessage(`Thành công! Đã lưu mặt hàng [${newItem.name}]`);
      setFormData({ id: '', name: '', category: 'Xúc xích', stock: '', price: '', minStock: 20, store: 'Kho Tổng' });
      setIsUpdatingMode(false);
    } catch (error) { setToastMessage("Lỗi khi đồng bộ đám mây!"); }
  };

  const exportToCSV = useCallback(() => {
    const headers = ['Mã SP', 'Tên sản phẩm', 'Danh mục', 'Cửa hàng', 'Tồn kho', 'Đã bán', 'Đơn giá (VNĐ)', 'Tổng Doanh Thu (VNĐ)', 'Trạng thái'];
    const csvRows = [headers.join(',')];
    inventory.forEach(item => {
      const status = item.stock < item.minStock ? 'Cần nhập hàng' : 'Bình thường';
      csvRows.push([item.id, `"${item.name}"`, item.category, `"${item.store || ''}"`, item.stock, item.sold, item.price, item.sold * item.price, status].join(','));
    });
    const blob = new Blob(["\ufeff", csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Vissan_BaoCao_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    setToastMessage("Xuất báo cáo CSV thành công!");
  }, [inventory]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 bg-[url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80')] bg-cover bg-center relative">
        <div className="absolute inset-0 bg-gray-900/85 backdrop-blur-md"></div>
        <div className="relative z-10 w-full max-w-md p-8 bg-white/15 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-red-500 tracking-wider mb-2">VISSAN</h1>
            <p className="text-gray-300 text-sm">Hệ thống Điều hành Chuỗi Cung ứng & Kho thông minh</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div><label className="block text-sm font-medium text-gray-300 mb-1">Tài khoản doanh nghiệp</label><input type="text" defaultValue="admin@vissan.com" className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white text-sm" /></div>
            <div><label className="block text-sm font-medium text-gray-300 mb-1">Mật khẩu</label><input type="password" defaultValue="password" className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white text-sm" /></div>
            <button type="submit" className="w-full py-3.5 px-4 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white font-bold rounded-xl shadow-lg transition-all">TRUY CẬP HỆ THỐNG</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 font-sans overflow-hidden">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-gray-800 border border-green-500/50 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-[99999] animate-fade-in">
          <CheckCircle className="text-green-400" size={24} />
          <p className="font-medium text-sm">{toastMessage}</p>
        </div>
      )}

      {showLossModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-gray-900/90 backdrop-blur-md animate-fade-in">
          <div className="bg-gray-800 border border-gray-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden p-6 relative">
            <button onClick={() => setShowLossModal(false)} className="absolute top-4 right-4 p-2 bg-gray-900 hover:bg-gray-700 rounded-full text-gray-400 hover:text-white"><X size={20} /></button>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-700">
              <div className="p-3 bg-red-500/20 text-red-500 rounded-xl"><Cpu size={24} /></div>
              <div>
                <h3 className="text-lg font-bold text-white">Ghi nhận Thất thoát / Cảm biến IoT</h3>
                <p className="text-xs text-gray-400">Trừ trực tiếp lượng tồn kho khi có sự cố tủ mát hoặc quét tự động</p>
              </div>
            </div>

            <form onSubmit={handleReportLoss} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Chọn sản phẩm thất thoát</label>
                <select 
                  value={lossForm.itemId} 
                  onChange={(e) => setLossForm({...lossForm, itemId: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm focus:border-red-500 focus:outline-none"
                  required
                >
                  <option value="">-- Chọn mặt hàng Vissan --</option>
                  {inventory.map(i => <option key={i.id} value={i.id}>[{i.store}] {i.name} (Tồn: {i.stock})</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Số lượng thất thoát</label>
                  <input 
                    type="number" 
                    min="1" 
                    value={lossForm.qty} 
                    onChange={(e) => setLossForm({...lossForm, qty: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm focus:border-red-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Nguồn phát hiện</label>
                  <select 
                    value={lossForm.reason}
                    onChange={(e) => setLossForm({...lossForm, reason: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm"
                  >
                    <option value="Hư hỏng do sự cố tủ mát (Cảm biến nhiệt)">Cảm biến tủ mát (Hư hỏng)</option>
                    <option value="Hết hạn sử dụng (RFID Smart Shelf)">Cảm biến RFID (Hết hạn)</option>
                    <option value="Kiểm kê thực tế thất thoát / Mất mát">Kiểm kê thực tế (Mất mát)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-700">
                <button type="button" onClick={() => setShowLossModal(false)} className="px-4 py-2 bg-gray-700 rounded-xl text-sm font-medium">Hủy</button>
                <button type="submit" className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-bold shadow-lg">Xác nhận trừ kho</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAdminModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-gray-900/90 backdrop-blur-md animate-fade-in">
          <div className="bg-gray-800 border border-gray-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden p-6 relative">
            <button onClick={() => setShowAdminModal(false)} className="absolute top-4 right-4 p-2 bg-gray-900 hover:bg-gray-700 rounded-full text-gray-400 hover:text-white"><X size={20} /></button>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-700">
              <div className="p-3 bg-red-500/20 text-red-500 rounded-xl"><Shield size={24} /></div>
              <div>
                <h3 className="text-lg font-bold text-white">Hồ sơ Quản trị viên</h3>
                <p className="text-xs text-gray-400">Tùy chỉnh thông tin hiển thị xuyên suốt hệ thống</p>
              </div>
            </div>
            
            <form onSubmit={(e) => { 
              e.preventDefault(); 
              localStorage.setItem('vissan_admin_profile', JSON.stringify(adminProfile));
              setShowAdminModal(false); 
              setToastMessage("Đã lưu thông tin quản trị viên thành công!"); 
            }} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Tên hiển thị</label>
                <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input type="text" value={adminProfile.name} onChange={(e) => setAdminProfile({...adminProfile, name: e.target.value})} className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm" required /></div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Chức vụ / Vai trò</label>
                <div className="relative"><Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input type="text" value={adminProfile.role} onChange={(e) => setAdminProfile({...adminProfile, role: e.target.value})} className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm" required /></div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Chi nhánh quản lý</label>
                <select value={adminProfile.branch} onChange={(e) => setAdminProfile({...adminProfile, branch: e.target.value})} className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm">
                  <option value="Hội sở chính TP.HCM">Hội sở chính TP.HCM</option>
                  <option value="Chi nhánh Miền Bắc">Chi nhánh Miền Bắc</option>
                  <option value="Chi nhánh Miền Tây">Chi nhánh Miền Tây</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-gray-700">
                <button type="button" onClick={() => setShowAdminModal(false)} className="px-4 py-2 bg-gray-700 rounded-xl text-sm">Đóng</button>
                <button type="submit" className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-bold shadow-lg">Lưu thay đổi</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedOrderForMap && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-gray-900/90 backdrop-blur-md animate-fade-in">
          <div className="bg-gray-800 border border-gray-700 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col relative">
            <button onClick={() => setSelectedOrderForMap(null)} className="absolute top-4 right-4 p-2 bg-gray-900 rounded-full text-gray-400 hover:text-white z-20"><X size={24} /></button>
            <div className="p-6 border-b border-gray-700 bg-gray-900/50 flex justify-between items-center z-10">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2"><Map className="text-blue-500" /> Vệ tinh Định vị Vận chuyển</h2>
                <p className="text-gray-400 mt-1">Đơn hàng: <span className="text-white font-mono">{selectedOrderForMap.id}</span> - Khách: <span className="text-white">{selectedOrderForMap.customer}</span></p>
              </div>
              <div className="text-right pr-12"><p className="text-xs text-gray-500 uppercase font-bold">Vị trí chặng</p><p className="text-lg font-medium text-yellow-400">{selectedOrderForMap.currentLoc}</p></div>
            </div>
            <div className="h-[400px] bg-gray-900 relative overflow-hidden flex items-center justify-center radar-bg">
              <div className="absolute w-[800px] h-[800px] rounded-full border border-green-500/10 radar-circle opacity-50"></div>
              <div className="absolute w-[400px] h-[400px] rounded-full border border-green-500/30 radar-circle"></div>
              <div className="radar-sweep"></div>
              <div className="absolute w-[80%] h-[2px] border-b-2 border-dashed border-gray-500 z-10"></div>
              <div className="absolute left-[10%] flex flex-col items-center z-20">
                <div className="w-12 h-12 bg-gray-800 border-2 border-blue-500 rounded-full flex items-center justify-center shadow-lg"><Store className="text-blue-400" size={24}/></div>
                <div className="mt-2 bg-gray-800 px-3 py-1 rounded text-xs border border-gray-700">{selectedOrderForMap.store}</div>
              </div>
              <div className="absolute z-30 flex flex-col items-center transition-all duration-1000" style={{ left: `calc(10% + (80% * ${selectedOrderForMap.progress} / 100) - 24px)` }}>
                <div className="relative">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shadow-lg animate-bounce z-10 relative"><Truck className="text-white" size={24}/></div>
                  <div className="absolute inset-0 bg-orange-500 rounded-full animate-ping opacity-75"></div>
                </div>
                <div className="mt-2 text-[10px] font-bold text-orange-400 bg-orange-900/40 px-2 py-0.5 rounded-full">{selectedOrderForMap.progress}%</div>
              </div>
              <div className="absolute right-[10%] flex flex-col items-center z-20">
                <div className="w-12 h-12 bg-gray-800 border-2 border-green-500 rounded-full flex items-center justify-center shadow-lg"><MapPin className="text-green-400" size={24}/></div>
                <div className="mt-2 bg-gray-800 px-3 py-1 rounded text-xs border border-gray-700">{selectedOrderForMap.destination}</div>
              </div>
            </div>
            <div className="p-4 bg-gray-800 border-t border-gray-700 flex justify-between text-sm text-gray-400">
              <span className="flex items-center gap-2"><Clock size={16}/> Khởi hành: {selectedOrderForMap.orderTime}</span>
              <span className="text-green-400 font-medium">ETA: {selectedOrderForMap.estimatedTime}</span>
            </div>
          </div>
        </div>
      )}

      {}
      <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col z-10 shadow-xl">
        <div className="p-6 border-b border-gray-700/60 bg-gray-900/20">
          <h2 className="text-3xl font-black text-red-500 tracking-wider">VISSAN</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <p className="text-[11px] text-green-400 font-semibold uppercase">Cloud Operations Hub</p>
          </div>
        </div>
        
        <nav className="flex-1 px-3 space-y-2 mt-4 overflow-y-auto">
          <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-gray-500">Điều hành chính</div>
          <button onClick={() => { setActiveTab('overview'); setOverviewModule('all'); }} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm font-medium ${activeTab === 'overview' ? 'bg-gradient-to-r from-red-600/20 to-orange-500/10 text-red-400 border border-red-500/30 font-bold' : 'text-gray-300 hover:bg-gray-700/60 hover:text-white'}`}><LayoutDashboard size={18} /> Tổng quan hệ thống</button>
          <button onClick={() => setActiveTab('pos')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm font-medium ${activeTab === 'pos' ? 'bg-gradient-to-r from-red-600/20 to-orange-500/10 text-red-400 border border-red-500/30 font-bold' : 'text-gray-300 hover:bg-gray-700/60 hover:text-white'}`}><ShoppingCart size={18} /> Quầy POS (Trừ kho)</button>
          
          <div className="pt-3 px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-gray-500">Kho & Cung ứng</div>
          <button onClick={() => setActiveTab('inventory')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm font-medium ${activeTab === 'inventory' ? 'bg-gradient-to-r from-red-600/20 to-orange-500/10 text-red-400 border border-red-500/30 font-bold' : 'text-gray-300 hover:bg-gray-700/60 hover:text-white'}`}><Package size={18} /> Quản lý Kho hàng</button>
          <button onClick={() => setActiveTab('forecast')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm font-medium ${activeTab === 'forecast' ? 'bg-gradient-to-r from-red-600/20 to-orange-500/10 text-red-400 border border-red-500/30 font-bold' : 'text-gray-300 hover:bg-gray-700/60 hover:text-white'}`}><Zap size={18} /> AI Dự báo & Nhập gấp</button>
          <button onClick={() => { setActiveTab('dataEntry'); if(!isUpdatingMode) setFormData({ id: '', name: '', category: 'Xúc xích', stock: '', price: '', minStock: 20, store: 'Kho Tổng' }); }} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm font-medium ${activeTab === 'dataEntry' ? 'bg-gradient-to-r from-red-600/20 to-orange-500/10 text-red-400 border border-red-500/30 font-bold' : 'text-gray-300 hover:bg-gray-700/60 hover:text-white'}`}><Plus size={18} /> Nhập liệu sản phẩm</button>

          <div className="pt-3 px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-gray-500">Logistics & Cửa hàng</div>
          <button onClick={() => setActiveTab('stores')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm font-medium ${activeTab === 'stores' ? 'bg-gradient-to-r from-red-600/20 to-orange-500/10 text-red-400 border border-red-500/30 font-bold' : 'text-gray-300 hover:bg-gray-700/60 hover:text-white'}`}><Store size={18} /> Cửa hàng & Cảm biến</button>
          <button onClick={() => setActiveTab('tracking')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm font-medium ${activeTab === 'tracking' ? 'bg-gradient-to-r from-red-600/20 to-orange-500/10 text-red-400 border border-red-500/30 font-bold' : 'text-gray-300 hover:bg-gray-700/60 hover:text-white'}`}><Truck size={18} /> Vận chuyển & Radar Map</button>
        </nav>

        <div className="p-4 border-t border-gray-700"><button onClick={() => setIsLoggedIn(false)} className="w-full flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-red-400 text-sm font-medium"><LogOut size={18} /> Đăng xuất phiên</button></div>
      </div>

      <div className="flex-1 flex flex-col relative z-0">
        <header className="h-20 border-b border-gray-800 bg-gray-900/60 backdrop-blur-md flex items-center justify-between px-8 z-30 shadow-sm">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-black text-white tracking-wide">
              {activeTab === 'overview' && 'Bảng điều khiển Tổng quan & Doanh thu'}
              {activeTab === 'pos' && 'Quầy Thu ngân POS (Thanh toán tự động trừ kho)'}
              {activeTab === 'inventory' && 'Quản lý Kho hàng Toàn hệ thống'}
              {activeTab === 'forecast' && 'Trung tâm Dự báo & Đề xuất Nhập hàng Thông minh'}
              {activeTab === 'stores' && 'Hệ thống Chi nhánh & Giám sát Cảm biến IoT'}
              {activeTab === 'tracking' && 'Giám sát Vận chuyển & Radar Map'}
              {activeTab === 'dataEntry' && (isUpdatingMode ? 'Bổ sung số lượng tồn kho' : 'Thêm mới mặt hàng')}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            
            {}
            <div className="relative">
              <button 
                onClick={() => { setShowNotifications(!showNotifications); setShowSensorNotifications(false); }} 
                className="relative p-2.5 bg-gray-800/80 hover:bg-gray-700 text-gray-300 rounded-xl transition-colors flex items-center gap-1.5 shadow-md"
                title="Thông báo Tồn kho Sản phẩm"
              >
                <Bell size={20} />
                {metrics.lowStockItems.length > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-gray-900 animate-pulse"></span>
                )}
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden z-[99999] animate-fade-in">
                  <div className="px-4 py-3 bg-gray-800 border-b border-gray-700 flex justify-between items-center">
                    <span className="text-xs font-bold uppercase text-red-400 flex items-center gap-1.5"><Package size={14}/> Cảnh báo Tồn kho ({metrics.lowStockItems.length})</span>
                    <button onClick={() => setShowNotifications(false)} className="text-gray-400 hover:text-white"><X size={16}/></button>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-gray-800 bg-gray-900">
                    {metrics.lowStockItems.length === 0 ? (
                      <div className="px-5 py-8 text-sm text-gray-400 text-center">Không có cảnh báo sản phẩm nào.</div>
                    ) : (
                      metrics.lowStockItems.map(item => (
                        <div key={item.id} className="p-3.5 hover:bg-gray-800 flex flex-col gap-2">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-red-500/10 text-red-400 rounded-lg mt-0.5"><AlertCircle size={16} /></div>
                            <div className="flex-1">
                              <p className="text-xs font-semibold text-white">{item.name}</p>
                              <p className="text-[11px] text-gray-300">Tồn: <span className="text-red-400 font-bold">{item.stock}</span> (Min: {item.minStock})</p>
                              <p className="text-[10px] text-blue-400 font-medium">Chi nhánh: {item.store}</p>
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <button onClick={() => handleRestockClick(item)} className="text-[11px] bg-red-600 hover:bg-red-500 text-white px-2.5 py-1 rounded-lg font-medium flex items-center gap-1">
                              Nhập ngay <ArrowRight size={10}/>
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {}
            <div className="relative">
              <button 
                onClick={() => { setShowSensorNotifications(!showSensorNotifications); setShowNotifications(false); }} 
                className="relative p-2.5 bg-gray-800/80 hover:bg-gray-700 text-gray-300 rounded-xl transition-colors flex items-center gap-1.5 shadow-md"
                title="Nhật ký Cảm biến & Sự cố Cửa hàng"
              >
                <Radio size={20} className="text-orange-400" />
                {lossLogs.length > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-gray-900 animate-pulse"></span>
                )}
              </button>

              {showSensorNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden z-[99999] animate-fade-in">
                  <div className="px-4 py-3 bg-gray-800 border-b border-gray-700 flex justify-between items-center">
                    <span className="text-xs font-bold uppercase text-orange-400 flex items-center gap-1.5"><Cpu size={14}/> Sự cố Cảm biến ({lossLogs.length})</span>
                    <button onClick={() => setShowSensorNotifications(false)} className="text-gray-400 hover:text-white"><X size={16}/></button>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-gray-800 bg-gray-900">
                    {lossLogs.length === 0 ? (
                      <div className="px-5 py-8 text-sm text-gray-400 text-center">Không có sự cố cảm biến nào.</div>
                    ) : (
                      lossLogs.map(log => (
                        <div key={log.id} className="p-3.5 hover:bg-gray-800 flex items-start gap-3">
                          <div className="p-2 bg-orange-500/10 text-orange-400 rounded-lg mt-0.5"><Radio size={16} /></div>
                          <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-mono text-orange-400 font-bold">{log.store}</span>
                              <span className="text-[10px] text-gray-500">{log.time}</span>
                            </div>
                            <p className="text-xs font-semibold text-white mt-1">{log.item} (-{log.qty})</p>
                            <p className="text-[11px] text-gray-400 mt-0.5">{log.reason}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div onClick={() => setShowAdminModal(true)} className="flex items-center gap-3 pl-4 border-l border-gray-700 cursor-pointer hover:opacity-80 group">
              <img src="https://ui-avatars.com/api/?name=Admin+Vissan&background=ef4444&color=fff" alt="Avatar" className="w-10 h-10 rounded-full ring-2 ring-red-500/50 group-hover:ring-red-500 shadow-md" />
              <div>
                <p className="text-sm font-semibold text-white group-hover:text-red-400">{adminProfile.name}</p>
                <p className="text-xs text-gray-400">{adminProfile.branch}</p>
              </div>
            </div>

          </div>
        </header>

        {}
        <main className="flex-1 overflow-y-auto p-8 relative z-10 bg-gray-900/40">
          
          {activeTab === 'overview' && (
             <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-800/40 border border-gray-700/60 p-4 rounded-2xl shadow-xl">
                
                {}
                <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                  <button onClick={() => setOverviewModule('all')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${overviewModule === 'all' ? 'bg-red-600 text-white shadow-lg' : 'bg-gray-800/80 text-gray-400 hover:text-white'}`}>
                    <Layers size={14}/> Toàn cảnh
                  </button>
                  <button onClick={() => setOverviewModule('financial')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${overviewModule === 'financial' ? 'bg-red-600 text-white shadow-lg' : 'bg-gray-800/80 text-gray-400 hover:text-white'}`}>
                    <DollarSign size={14}/> Tài chính & Doanh thu
                  </button>
                  <button onClick={() => setOverviewModule('inventory')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${overviewModule === 'inventory' ? 'bg-red-600 text-white shadow-lg' : 'bg-gray-800/80 text-gray-400 hover:text-white'}`}>
                    <Package size={14}/> Kho hàng & Cảnh báo
                  </button>
                  <button onClick={() => setOverviewModule('sales')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${overviewModule === 'sales' ? 'bg-red-600 text-white shadow-lg' : 'bg-gray-800/80 text-gray-400 hover:text-white'}`}>
                    <TrendingUp size={14}/> Sản lượng Tiêu thụ
                  </button>
                  <button onClick={() => setOverviewModule('stores')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${overviewModule === 'stores' ? 'bg-red-600 text-white shadow-lg' : 'bg-gray-800/80 text-gray-400 hover:text-white'}`}>
                    <Store size={14}/> Chi nhánh Cửa hàng
                  </button>
                </div>

                {}
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => setTimeframeFilter('today')} className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${timeframeFilter === 'today' ? 'bg-orange-500 text-white shadow' : 'bg-gray-800/80 text-gray-400'}`}>Hôm nay</button>
                  <button onClick={() => setTimeframeFilter('7days')} className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${timeframeFilter === '7days' ? 'bg-orange-500 text-white shadow' : 'bg-gray-800/80 text-gray-400'}`}>7 Ngày</button>
                  <button onClick={() => setTimeframeFilter('month')} className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${timeframeFilter === 'month' ? 'bg-orange-500 text-white shadow' : 'bg-gray-800/80 text-gray-400'}`}>Tháng này</button>
                </div>
              </div>

              {}
              {(overviewModule === 'all' || overviewModule === 'financial') && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
                  <div 
                    onClick={() => handleKPIClick('revenue')} 
                    className="bg-gray-800/40 border border-gray-700/60 p-6 rounded-2xl cursor-pointer hover:border-green-500/50 shadow-xl transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Tổng Doanh Thu</p>
                        <span className="p-2 bg-green-500/10 rounded-xl text-green-400"><DollarSign size={18}/></span>
                      </div>
                      <h3 className="text-3xl font-black text-green-400 tracking-tight font-mono">{metrics.totalRevenue.toLocaleString()} <span className="text-sm font-normal text-green-500">đ</span></h3>
                      <p className="text-xs text-green-500 mt-2 flex items-center gap-1 font-semibold"><TrendingUp size={14}/> +12.4% so với kỳ trước</p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-700/60">
                      <p className="text-[11px] text-gray-400 uppercase font-semibold mb-2">Tỷ trọng nhóm đóng góp</p>
                      <div className="h-24 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <RePieChart>
                            <Tooltip formatter={(v) => `${v.toLocaleString()} đ`} contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
                            <Pie data={metrics.revenueByCategoryArray} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={30} innerRadius={15}>
                              {metrics.revenueByCategoryArray.map((entry, index) => (
                                <Cell key={`cell-pie-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                              ))}
                            </Pie>
                          </RePieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-2 bg-gray-800/40 border border-gray-700/60 p-6 rounded-2xl shadow-xl">
                    <h3 className="text-lg font-bold text-white mb-4">Biểu đồ Doanh thu & Dòng tiền ({timeframeFilter})</h3>
                    <div className="h-60 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={dynamicSalesData}>
                          <defs>
                            <linearGradient id="colorRevModal" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                          <XAxis dataKey="name" stroke="#9ca3af" />
                          <YAxis stroke="#9ca3af" />
                          <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                          <Area type="monotone" dataKey="Xúc_xích" stroke="#10b981" fillOpacity={1} fill="url(#colorRevModal)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}

              {}
              {(overviewModule === 'all' || overviewModule === 'inventory') && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
                  <div 
                    onClick={() => handleKPIClick('inventory')} 
                    className="bg-gray-800/40 border border-gray-700/60 p-6 rounded-2xl cursor-pointer hover:border-blue-500/50 shadow-xl flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Giá trị Tồn kho Toàn hệ thống</p>
                        <span className="p-2 bg-blue-500/10 rounded-xl text-blue-400"><Package size={18}/></span>
                      </div>
                      <h3 className="text-3xl font-black text-blue-400 tracking-tight font-mono">{metrics.inventoryValue.toLocaleString()} <span className="text-sm font-normal text-blue-500">đ</span></h3>
                      <p className="text-xs text-blue-300 mt-2 font-medium">Dòng tiền lưu trữ an toàn trong kho</p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-700/60">
                      <p className="text-[11px] text-gray-400 uppercase font-semibold mb-2">Phân bổ tồn kho theo nhóm</p>
                      <div className="h-28 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={metrics.stockByCategoryArray} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                            <XAxis dataKey="name" stroke="#9ca3af" tick={{ fontSize: 9 }} />
                            <YAxis stroke="#9ca3af" tick={{ fontSize: 9 }} />
                            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
                            <Bar dataKey="tồn_kho" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  <div 
                    onClick={() => handleKPIClick('alert')} 
                    className="bg-gray-800/40 border border-red-900/50 p-6 rounded-2xl cursor-pointer hover:border-red-500 shadow-xl flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-red-300 text-xs font-bold uppercase tracking-wider">Cảnh báo Cần nhập gấp</p>
                        <span className="p-2 bg-red-500/20 rounded-xl text-red-500 animate-bounce"><AlertCircle size={18}/></span>
                      </div>
                      <h3 className="text-3xl font-black text-red-500 tracking-tight font-mono">{metrics.lowStockItems.length} <span className="text-sm font-normal text-red-400">mặt hàng</span></h3>
                      <p className="text-xs text-red-400 mt-2 font-medium">Nhấp vào đây để xem danh sách cần bổ sung ngay</p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-red-900/40">
                      <div className="flex items-center justify-between text-xs text-red-300">
                        <span>Trạng thái kho thiếu hụt nguy cấp</span>
                        <span className="font-bold underline">Bấm để kiểm tra chi tiết</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {}
              {(overviewModule === 'all' || overviewModule === 'sales') && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
                  <div className="lg:col-span-2 bg-gray-800/40 border border-gray-700/60 p-6 rounded-2xl shadow-xl">
                    <h3 className="text-lg font-bold text-white mb-6">Biểu đồ Xu hướng Bán hàng theo dòng thời gian</h3>
                    <div className="h-72 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={dynamicSalesData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                          <XAxis dataKey="name" stroke="#9ca3af" tick={{ fontSize: 12 }} />
                          <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
                          <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                          <Line type="monotone" dataKey="Xúc_xích" stroke="#ef4444" strokeWidth={3} isAnimationActive={false} />
                          <Line type="monotone" dataKey="Đồ_hộp" stroke="#3b82f6" strokeWidth={3} isAnimationActive={false} />
                          <Line type="monotone" dataKey="Lạp_xưởng" stroke="#f59e0b" strokeWidth={3} isAnimationActive={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-gray-800/40 border border-gray-700/60 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-4">Cơ cấu Doanh thu Ngành hàng</h3>
                      <div className="h-60 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart 
                            layout="vertical" 
                            data={metrics.revenueByCategoryArray} 
                            margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
                            <XAxis type="number" stroke="#9ca3af" tick={{ fontSize: 10 }} tickFormatter={(val) => `${val >= 1000000 ? (val/1000000).toFixed(1) + 'M' : val}`} />
                            <YAxis dataKey="name" type="category" stroke="#9ca3af" tick={{ fontSize: 11 }} width={75} />
                            <Tooltip 
                              formatter={(value) => [`${value.toLocaleString()} đ`, 'Doanh thu']}
                              contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} 
                            />
                            <Bar dataKey="value" radius={[0, 4, 4, 0]} isAnimationActive={false}>
                              {metrics.revenueByCategoryArray.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {}
              {(overviewModule === 'all' || overviewModule === 'stores') && (
                <div className="bg-gray-800/40 border border-gray-700/60 rounded-2xl p-6 shadow-xl animate-fade-in space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white">Tổng quan Tình hình Chi nhánh Cửa hàng</h3>
                    <span className="text-xs text-gray-400">Biểu đồ so sánh doanh thu và tồn kho giữa các cơ sở</span>
                  </div>

                  <div className="h-72 w-full bg-gray-900/60 p-4 rounded-xl border border-gray-800">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={storeComparisonArray} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                        <XAxis dataKey="name" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
                        <Legend />
                        <Bar dataKey="tồn_kho" fill="#3b82f6" name="Tồn kho" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="báo_động" fill="#ef4444" name="Cần nhập gấp" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {STORE_LIST.map(storeName => {
                      const sData = storeMetrics[storeName];
                      return (
                        <div key={storeName} className="bg-gray-900/80 border border-gray-700/60 p-4 rounded-xl shadow">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-bold text-white">{storeName}</h4>
                            <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">{sData.itemsCount} SP</span>
                          </div>
                          <p className="text-xs text-gray-400">Doanh thu: <span className="text-green-400 font-bold">{sData.totalRevenue.toLocaleString()} đ</span></p>
                          <p className="text-xs text-gray-400 mt-1">Tồn kho: <span className="text-white font-bold">{sData.totalStock}</span></p>
                          <div className="mt-3 pt-2 border-t border-gray-800 flex justify-between items-center">
                            <span className="text-[11px] text-gray-500">Báo động:</span>
                            <span className={`text-xs font-bold ${sData.lowStockItems.length > 0 ? 'text-red-500' : 'text-green-400'}`}>{sData.lowStockItems.length} món</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          )}

          {activeTab === 'pos' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in max-w-7xl mx-auto">
              <div className="lg:col-span-2 bg-gray-800/40 border border-gray-700/60 rounded-2xl p-6 shadow-xl flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-bold">Quầy Thu ngân POS (Trừ kho tự động)</h3>
                    <p className="text-xs text-gray-400">Hệ thống khóa giao dịch nếu sản phẩm hết tồn kho.</p>
                  </div>
                  <select 
                    value={posStore} 
                    onChange={(e) => setPosStore(e.target.value)}
                    className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm font-medium shadow"
                  >
                    {STORE_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-2">
                  {inventory.filter(i => i.store === posStore).map(item => {
                    const isOutOfStock = item.stock <= 0;
                    return (
                      <div 
                        key={item.id} 
                        onClick={() => !isOutOfStock && addToPosCart(item)}
                        className={`bg-gray-800/80 border rounded-xl p-4 transition-all flex flex-col justify-between group shadow ${isOutOfStock ? 'opacity-50 border-red-900/50 cursor-not-allowed' : 'border-gray-700 hover:bg-gray-700 cursor-pointer'}`}
                      >
                        <div>
                          <div className="flex justify-between">
                            <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-md font-mono">{item.id}</span>
                            {isOutOfStock && <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded font-bold">HẾT HÀNG</span>}
                          </div>
                          <h4 className="font-semibold text-white mt-2 text-sm group-hover:text-red-400">{item.name}</h4>
                        </div>
                        <div className="mt-4 flex justify-between items-end">
                          <div>
                            <p className="text-xs text-gray-400">Tồn: <span className={`font-bold ${isOutOfStock ? 'text-red-500' : 'text-white'}`}>{item.stock}</span></p>
                            <p className="text-green-400 font-bold text-sm mt-0.5">{item.price.toLocaleString()} đ</p>
                          </div>
                          <button disabled={isOutOfStock} className="p-2 bg-red-600 hover:bg-red-500 disabled:bg-gray-700 text-white rounded-lg shadow"><Plus size={16}/></button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-gray-800/40 border border-gray-700/60 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center pb-4 border-b border-gray-700 mb-4">
                    <h3 className="font-bold text-lg flex items-center gap-2"><ShoppingCart size={20} className="text-red-500"/> Giỏ hàng POS</h3>
                    <span className="text-xs bg-blue-500/20 text-blue-400 px-2.5 py-1 rounded-full font-medium">{posStore}</span>
                  </div>

                  {posCart.length === 0 ? (
                    <div className="py-20 text-center text-gray-500 text-sm">Chưa có sản phẩm nào trong giỏ hàng. <br/>Hãy bấm chọn sản phẩm bên trái.</div>
                  ) : (
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                      {posCart.map(cartItem => (
                        <div key={cartItem.id} className="bg-gray-900/80 p-3 rounded-xl border border-gray-800 flex justify-between items-center shadow">
                          <div>
                            <p className="text-sm font-medium text-white">{cartItem.name}</p>
                            <p className="text-xs text-gray-400">{cartItem.price.toLocaleString()} đ x {cartItem.quantity}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-green-400 text-sm">{(cartItem.price * cartItem.quantity).toLocaleString()} đ</span>
                            <button 
                              onClick={() => setPosCart(posCart.filter(c => c.id !== cartItem.id))}
                              className="text-gray-500 hover:text-red-400 p-1"
                            >
                              <X size={16}/>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-700">
                  <div className="flex justify-between text-lg font-bold mb-4">
                    <span>Tổng thanh toán:</span>
                    <span className="text-green-400">
                      {posCart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()} đ
                    </span>
                  </div>
                  <button 
                    onClick={handleCheckoutPOS}
                    disabled={posCart.length === 0}
                    className="w-full py-3.5 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={20}/> Thanh toán & Trừ kho tự động
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'inventory' && (
             <div className="bg-gray-800/40 border border-gray-700/60 rounded-2xl p-6 shadow-xl animate-fade-in max-w-7xl mx-auto">
             <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-center">
               <div className="flex gap-4 w-full md:w-auto flex-1 items-center">
                 <input type="text" placeholder="Tìm kiếm tên hoặc mã sản phẩm..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-white shadow" />
                 <select value={selectedStoreFilter} onChange={(e) => setSelectedStoreFilter(e.target.value)} className="px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-white shadow">
                   <option value="All">Tất cả Cửa hàng / Kho</option>
                   {STORE_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                 </select>
               </div>
               <button onClick={exportToCSV} className="flex items-center gap-2 bg-green-600 hover:bg-green-500 px-5 py-2.5 rounded-xl text-white font-bold shadow-lg transition-colors">
                 <Download size={18} /> Xuất Báo Cáo CSV
               </button>
             </div>
             
             <div className="overflow-x-auto">
               <table className="w-full text-left text-sm">
                 <thead>
                   <tr className="border-b border-gray-700 text-gray-400">
                     <th className="pb-3">Mã SKU</th>
                     <th className="pb-3">Tên sản phẩm</th>
                     <th className="pb-3">Chi nhánh</th>
                     <th className="pb-3 text-right">Giá bán (đ)</th>
                     <th className="pb-3 text-center">Tồn kho</th>
                     <th className="pb-3 text-center">Đã bán</th>
                     <th className="pb-3 text-right">Doanh thu SP (đ)</th>
                     <th className="pb-3 text-center">Trạng thái</th>
                   </tr>
                 </thead>
                 <tbody>
                   {filteredInventory.map(item => (
                     <tr key={item.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                       <td className="py-3.5 font-mono text-gray-300">{item.id}</td>
                       <td className="py-3.5 font-medium">{item.name}</td>
                       <td className="py-3.5 text-blue-400 font-medium">{item.store}</td>
                       <td className="py-3.5 text-right">{item.price.toLocaleString()}</td>
                       <td className={`py-3.5 text-center font-bold ${item.stock < item.minStock ? 'text-red-400' : 'text-white'}`}>{item.stock}</td>
                       <td className="py-3.5 text-center text-green-400">{item.sold}</td>
                       <td className="py-3.5 text-right font-medium text-green-400">{(item.sold * item.price).toLocaleString()}</td>
                       <td className="py-3.5 text-center">
                         {item.stock < item.minStock ? (
                           <button onClick={()=>handleRestockClick(item)} className="bg-red-500/20 hover:bg-red-500/40 text-red-400 px-3 py-1 rounded-full text-xs font-semibold border border-red-500/30 flex items-center gap-1 mx-auto">
                             Cần nhập <ArrowRight size={12}/>
                           </button>
                         ) : (
                           <span className="bg-green-500/10 text-green-400 px-2.5 py-1 rounded-full text-xs font-medium">Ổn định</span>
                         )}
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           </div>
          )}

          {activeTab === 'forecast' && (
            <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
              <div className="bg-gradient-to-r from-red-900/40 via-gray-800 to-gray-900 border border-red-500/30 rounded-2xl p-6 shadow-xl flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2"><Zap className="text-yellow-400"/> AI Dự báo Vòng quay Tồn kho & Đề xuất Bổ sung</h3>
                  <p className="text-gray-300 text-sm mt-1">Hệ thống phân tích tốc độ bán ra thực tế để dự đoán chính xác thời điểm đứt gãy chuỗi cung ứng tại kho tổng và các cửa hàng.</p>
                </div>
                <div className="bg-red-500/20 border border-red-500/40 px-4 py-2 rounded-xl text-center shadow">
                  <p className="text-xs text-red-300 uppercase font-bold">Cần xử lý gấp</p>
                  <p className="text-2xl font-black text-red-400">{forecastData.length} SKU</p>
                </div>
              </div>

              <div className="bg-gray-800/40 border border-gray-700/60 rounded-2xl p-6 shadow-xl">
                <h3 className="text-lg font-bold mb-4 text-white">Danh sách Mặt hàng Cần Lập Kế hoạch Nhập Bổ sung</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-gray-700 text-gray-400">
                        <th className="pb-3">Mã SKU</th>
                        <th className="pb-3">Tên sản phẩm</th>
                        <th className="pb-3">Chi nhánh</th>
                        <th className="pb-3 text-center">Tồn kho hiện tại</th>
                        <th className="pb-3 text-center">Tốc độ tiêu thụ/ngày</th>
                        <th className="pb-3 text-center">Số ngày còn lại (ETA)</th>
                        <th className="pb-3 text-center">Mức độ rủi ro</th>
                        <th className="pb-3 text-right">Đề xuất số lượng nhập</th>
                        <th className="pb-3 text-center">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {forecastData.map(item => (
                        <tr key={item.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                          <td className="py-3.5 font-mono text-gray-300">{item.id}</td>
                          <td className="py-3.5 font-medium text-white">{item.name}</td>
                          <td className="py-3.5 text-blue-400 font-medium">{item.store}</td>
                          <td className="py-3.5 text-center font-bold text-white">{item.stock}</td>
                          <td className="py-3.5 text-center text-gray-300">~{item.dailyVelocity} SP/ngày</td>
                          <td className="py-3.5 text-center">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${item.daysLeft <= 3 ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-orange-500/20 text-orange-400'}`}>
                              Còn {item.daysLeft} ngày
                            </span>
                          </td>
                          <td className="py-3.5 text-center">
                            <span className={`text-xs font-bold ${item.riskLevel.includes('Nguy cấp') ? 'text-red-500 animate-pulse' : 'text-orange-400'}`}>
                              {item.riskLevel}
                            </span>
                          </td>
                          <td className="py-3.5 text-right font-mono font-bold text-green-400">+{item.recommendedRestock} SP</td>
                          <td className="py-3.5 text-center">
                            <button onClick={() => handleRestockClick(item)} className="bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow">
                              Nhập ngay
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'stores' && (
            <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold">Hệ thống Chi nhánh & Giám sát Cảm biến IoT</h3>
                  <p className="text-gray-400 text-sm">Theo dõi lượng hàng tồn, doanh thu và ghi nhận thất thoát tự động.</p>
                </div>
                <button 
                  onClick={() => setShowLossModal(true)}
                  className="bg-red-600 hover:bg-red-500 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg"
                >
                  <Cpu size={18}/> Báo cáo Thất thoát / Cảm biến
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {STORE_LIST.map(storeName => {
                  const sData = storeMetrics[storeName];
                  return (
                    <div key={storeName} className="bg-gray-800/40 border border-gray-700/60 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-700">
                          <div>
                            <h4 className="text-xl font-bold text-white flex items-center gap-2">
                              <Store className="text-red-500" /> {storeName}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="w-2 h-2 rounded-full bg-green-500"></span>
                              <p className="text-xs text-green-400">Cảm biến nhiệt tủ mát: Hoạt động chuẩn (4°C)</p>
                            </div>
                          </div>
                          <button onClick={() => { setSelectedStoreFilter(storeName); setActiveTab('inventory'); }} className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 px-3 py-1.5 rounded-lg font-medium shadow">
                            Xem kho
                          </button>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-6">
                          <div className="bg-gray-900/80 p-3 rounded-xl border border-gray-800 shadow">
                            <p className="text-xs text-gray-400">Tổng tồn kho</p>
                            <p className="text-lg font-bold text-blue-400 mt-1">{sData.totalStock}</p>
                          </div>
                          <div className="bg-gray-900/80 p-3 rounded-xl border border-gray-800 shadow">
                            <p className="text-xs text-gray-400">Doanh thu chi nhánh</p>
                            <p className="text-sm font-bold text-green-400 mt-1">{sData.totalRevenue.toLocaleString()} đ</p>
                          </div>
                          <div className="bg-gray-900/80 p-3 rounded-xl border border-gray-800 shadow">
                            <p className="text-xs text-gray-400">Cần nhập</p>
                            <p className={`text-lg font-bold mt-1 ${sData.lowStockItems.length > 0 ? 'text-red-500' : 'text-green-400'}`}>{sData.lowStockItems.length} món</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-gray-800/40 border border-gray-700/60 rounded-2xl p-6 shadow-xl">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Radio className="text-orange-500"/> Nhật ký Sự cố Cảm biến & Thất thoát gần đây</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-gray-700 text-gray-400">
                        <th className="pb-3">Mã sự cố</th>
                        <th className="pb-3">Sản phẩm</th>
                        <th className="pb-3">Cửa hàng</th>
                        <th className="pb-3 text-center">Số lượng trừ</th>
                        <th className="pb-3">Nguyên nhân / Cảm biến kích hoạt</th>
                        <th className="pb-3 text-right">Thời gian</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lossLogs.map(log => (
                        <tr key={log.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                          <td className="py-3.5 font-mono text-gray-400">{log.id}</td>
                          <td className="py-3.5 font-medium text-white">{log.item}</td>
                          <td className="py-3.5 text-blue-400">{log.store}</td>
                          <td className="py-3.5 text-center text-red-400 font-bold">-{log.qty}</td>
                          <td className="py-3.5 text-gray-300 flex items-center gap-2"><AlertTriangle size={14} className="text-orange-400"/> {log.reason}</td>
                          <td className="py-3.5 text-right text-gray-500 text-xs">{log.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tracking' && (
            <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2 flex items-center gap-3"><Truck className="text-blue-500" /> Quản lý Điều phối Vận chuyển</h3>
                <p className="text-gray-400">Nhấp vào đơn hàng để mở bản đồ Radar định vị vệ tinh thời gian thực.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {orders.map(order => {
                  let statusConfig = { label: 'Đang xử lý', color: 'text-orange-400', bg: 'bg-orange-500/20', bar: 'bg-orange-500' };
                  if (order.status === 'shipping') statusConfig = { label: 'Đang vận chuyển', color: 'text-blue-400', bg: 'bg-blue-500/20', bar: 'bg-blue-500' };
                  if (order.status === 'delivered') statusConfig = { label: 'Đã giao hàng', color: 'text-green-400', bg: 'bg-green-500/20', bar: 'bg-green-500' };

                  return (
                    <div key={order.id} onClick={() => order.status !== 'delivered' && setSelectedOrderForMap(order)} className={`bg-gray-800/40 border border-gray-700/60 rounded-2xl p-6 shadow-xl transition-all ${order.status !== 'delivered' ? 'cursor-pointer hover:border-blue-500/50 hover:bg-gray-800/80 hover:-translate-y-1' : 'opacity-75'}`}>
                      <div className="flex justify-between items-start mb-4">
                        <div><h4 className="text-lg font-bold text-white">{order.id}</h4><p className="text-sm text-gray-400 mt-1">{order.customer}</p></div>
                        <span className={`px-3 py-1.5 rounded-full text-xs font-medium border border-gray-600 ${statusConfig.bg} ${statusConfig.color}`}>{statusConfig.label}</span>
                      </div>
                      <div className="my-6"><div className="w-full bg-gray-700 rounded-full h-2.5"><div className={`h-2.5 rounded-full ${statusConfig.bar}`} style={{ width: `${order.progress}%` }}></div></div></div>
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700/50 text-sm">
                        <div className="flex flex-col"><span className="text-xs text-gray-500">Xuất phát</span><span className="font-medium">{order.store}</span></div>
                        <div className="flex flex-col"><span className="text-xs text-gray-500">Điểm giao</span><span className="font-medium truncate">{order.destination}</span></div>
                        <div className="flex flex-col mt-2"><span className="text-xs text-gray-500">ETA</span><span className={`text-base font-bold ${order.status === 'delivered'?'text-green-400':'text-yellow-400'}`}>{order.estimatedTime}</span></div>
                      </div>
                      {order.status !== 'delivered' && <div className="mt-4 text-center text-xs text-blue-400 bg-blue-500/10 py-2 rounded-lg font-medium flex items-center justify-center gap-1.5 shadow"><Map size={14}/> Mở bản đồ Radar giám sát</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'dataEntry' && (
             <div className="max-w-2xl mx-auto bg-gray-800/40 border border-gray-700/60 rounded-2xl p-8 shadow-2xl animate-fade-in">
               <div className="mb-6 pb-4 border-b border-gray-700 flex justify-between items-center">
                 <div>
                   <h3 className="text-2xl font-bold">{isUpdatingMode ? 'Cập nhật / Bổ sung kho hàng' : 'Nhập mới sản phẩm'}</h3>
                   <p className="text-gray-400 text-sm mt-1">Dữ liệu lưu trực tiếp vào đám mây phân bổ theo chi nhánh.</p>
                 </div>
                 {isUpdatingMode && (
                   <button onClick={() => { setIsUpdatingMode(false); setFormData({ id: '', name: '', category: 'Xúc xích', stock: '', price: '', minStock: 20, store: 'Kho Tổng' }); }} className="text-xs text-orange-400 bg-orange-500/20 px-3 py-1.5 rounded-lg">Chuyển sang Thêm mới</button>
                 )}
               </div>

               <form onSubmit={handleFormSubmit} className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                     <label className="block text-sm font-medium text-gray-300 mb-2">Mã SKU <span className="text-red-500">*</span></label>
                     <input name="id" value={formData.id} onChange={handleFormChange} placeholder="Ví dụ: V100" className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white font-mono shadow" required disabled={isUpdatingMode} />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-300 mb-2">Chi nhánh lưu kho <span className="text-red-500">*</span></label>
                     <select name="store" value={formData.store} onChange={handleFormChange} className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white shadow">
                       {STORE_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                     </select>
                   </div>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-300 mb-2">Tên sản phẩm <span className="text-red-500">*</span></label>
                   <input name="name" value={formData.name} onChange={handleFormChange} placeholder="Tên sản phẩm..." className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white shadow" required />
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div>
                     <label className="block text-sm font-medium text-gray-300 mb-2">Số lượng tồn <span className="text-red-500">*</span></label>
                     <input name="stock" type="number" min="0" value={formData.stock} onChange={handleFormChange} placeholder="0" className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white font-bold shadow" required />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-300 mb-2">Đơn giá (đ) <span className="text-red-500">*</span></label>
                     <input name="price" type="number" min="0" value={formData.price} onChange={handleFormChange} placeholder="0" className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white shadow" required />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-300 mb-2">Mức cảnh báo min</label>
                     <input name="minStock" type="number" min="1" value={formData.minStock} onChange={handleFormChange} placeholder="20" className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white shadow" />
                   </div>
                 </div>
                 <div className="pt-4 border-t border-gray-700 flex justify-end gap-4">
                   <button type="button" onClick={() => setActiveTab('inventory')} className="px-6 py-3 bg-gray-700 rounded-xl font-medium">Hủy</button>
                   <button type="submit" className="px-8 py-3 bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold rounded-xl shadow-lg">{isUpdatingMode ? 'Cập nhật kho ngay' : 'Thêm mới'}</button>
                 </div>
               </form>
             </div>
          )}

        </main>
      </div>

      <style>{`
        .animate-fade-in { animation: fadeIn 0.25s ease forwards; will-change: opacity, transform; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .radar-bg { background-color: #0f172a; background-image: radial-gradient(#1e293b 1px, transparent 1px), linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px); background-size: 20px 20px, 40px 40px, 40px 40px; background-position: center; }
        .radar-sweep { position: absolute; width: 400px; height: 400px; border-radius: 50%; background: conic-gradient(from 0deg, transparent 70%, rgba(34, 197, 94, 0.4) 100%); animation: radar-spin 4s linear infinite; transform-origin: center; border-right: 2px solid rgba(34, 197, 94, 0.8); will-change: transform; }
        @keyframes radar-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}