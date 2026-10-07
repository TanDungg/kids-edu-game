import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, Plus, Trash2, Sparkles, Volume2, PackagePlus, 
  RotateCcw, CheckCircle2, FileSpreadsheet, Download, Upload, Smile,
  LayoutDashboard, BookOpen, Calculator, Brain, Dog, ShoppingBag, 
  User, Database, RefreshCw, BarChart3, Copy, Check, Info, Coins, Star, Trophy, Search, Activity, PieChart, Users,
  Zap, Wand2, X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import * as XLSX from 'xlsx';
import EmojiPicker from 'emoji-picker-react';
import { dataManager, PRESET_PACKS } from '../services/dataManager';
import { sounds } from '../utils/sound';
import { autoDetectEmoji } from '../utils/emojiDetector';
import { supabaseService } from '../services/supabase';

function PaginationControl({ currentPage, totalPages, onPageChange, totalItems, pageSize }) {
  if (totalPages <= 1) return null;
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '8px',
      marginTop: '14px',
      paddingTop: '12px',
      borderTop: '1px solid #e2e8f0',
      fontSize: '12px',
      color: '#64748b'
    }}>
      <div style={{ fontWeight: 600 }}>
        Hiển thị <span style={{ color: '#1e293b', fontWeight: 800 }}>{startItem} - {endItem}</span> trên tổng số <span style={{ color: '#1e293b', fontWeight: 800 }}>{totalItems}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => { sounds.playClick(); onPageChange(currentPage - 1); }}
          className="btn-kid btn-blue"
          style={{
            padding: '4px 10px',
            fontSize: '11.5px',
            opacity: currentPage === 1 ? 0.4 : 1,
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
          }}
        >
          ◀ Trước
        </button>
        <span style={{ fontWeight: 800, color: '#1e293b', padding: '0 4px' }}>
          Trang {currentPage} / {totalPages}
        </span>
        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => { sounds.playClick(); onPageChange(currentPage + 1); }}
          className="btn-kid btn-blue"
          style={{
            padding: '4px 10px',
            fontSize: '11.5px',
            opacity: currentPage === totalPages ? 0.4 : 1,
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
          }}
        >
          Sau ▶
        </button>
      </div>
    </div>
  );
}

export default function AdminDashboard({ 
  onBack, 
  onDataChanged, 
  playerData = {}, 
  onUpdatePlayerData, 
  onResetAllData 
}) {
  // Navigation Tab State - Lưu tab hiện tại vào localStorage để khi F5 vẫn giữ nguyên tab
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('kids_admin_active_tab') || 'overview';
  });

  React.useEffect(() => {
    localStorage.setItem('kids_admin_active_tab', activeTab);
  }, [activeTab]);

  // Master Collections
  const [words, setWords] = useState(() => dataManager.getWords());
  const [mathLevels, setMathLevels] = useState(() => dataManager.getMathLevels());
  const [logicLevels, setLogicLevels] = useState(() => dataManager.getLogicLevels());
  const [pets, setPets] = useState(() => dataManager.getPets());
  const [shopItems, setShopItems] = useState(() => dataManager.getShopItems());

  // Form States - Language
  const [wordForm, setWordForm] = useState({ vn: '', en: '', emoji: '⭐', theme: 'Động vật', hintVN: '', hintEN: '' });
  const [isAutoEmoji, setIsAutoEmoji] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Form States - Math
  const [mathForm, setMathForm] = useState({
    type: 'count', // 'count' | 'addition' | 'compare'
    title: '',
    promptVN: '',
    promptEN: '',
    itemEmoji: '🍎',
    targetCount: 4,
    num1: 3,
    num2: 2,
    sideACount: 3,
    sideBCount: 5,
    options: '2, 3, 4, 5',
    answer: '4'
  });

  // Form States - Logic
  const [logicForm, setLogicForm] = useState({
    type: 'pattern', // 'pattern' | 'odd_one_out'
    title: '',
    promptVN: '',
    promptEN: '',
    sequence: '🍎, 🍏, 🍎, 🍏',
    options: '🍎, 🍌, 🍇, 🍉',
    answer: '🍎',
    hint: ''
  });

  // Form States - Pet & Shop
  const [petForm, setPetForm] = useState({ name: '', emoji: '🐰', sound: 'Khịt khịt!' });
  const [shopForm, setShopForm] = useState({ name: '', type: 'food', emoji: '🍎', price: 10, hungerBoost: 25 });

  // Player Adjust Form
  const [playerEdit, setPlayerEdit] = useState({
    stars: playerData.stars || 5,
    coins: playerData.coins || 30,
    level: playerData.level || 1,
    name: 'Bé Thám Hiểm',
    email: '',
    birthDate: '',
    address: '',
    phone: '',
    hobby: '',
    avatarUrl: ''
  });

  // Feedback & File Upload
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [isCopiedSQL, setIsCopiedSQL] = useState(false);
  const fileInputRef = useRef(null);
  const backupInputRef = useRef(null);

  // Cloud Database Players & Logs
  const [cloudUsers, setCloudUsers] = useState([]);
  const [learningLogs, setLearningLogs] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);
  const [selectedPlayerName, setSelectedPlayerName] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('student'); // 'student' | 'admin' | 'all'

  // Phân biệt chính xác giữa Tài khoản Quản trị viên (Admin) và Học sinh
  const isUserAnAdmin = (u) => {
    if (!u) return false;
    if (u.role === 'admin') return true;
    if (u.id === 'admin_master_01') return true;
    const email = (u.email || '').toLowerCase();
    if (email === 'admin@kidsedu.com' || email === 'tandung230698@gmail.com' || email.includes('admin')) return true;
    return false;
  };

  const studentUsers = React.useMemo(() => {
    return cloudUsers.filter(u => !isUserAnAdmin(u));
  }, [cloudUsers]);

  const adminUsers = React.useMemo(() => {
    return cloudUsers.filter(u => isUserAnAdmin(u));
  }, [cloudUsers]);

  const filteredUsers = React.useMemo(() => {
    return cloudUsers.filter(u => {
      const isAdm = isUserAnAdmin(u);
      if (userRoleFilter === 'student' && isAdm) return false;
      if (userRoleFilter === 'admin' && !isAdm) return false;
      if (!userSearchTerm) return true;
      const term = userSearchTerm.toLowerCase();
      return (
        u.id?.toLowerCase().includes(term) ||
        u.name?.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term) ||
        u.phone?.toLowerCase().includes(term) ||
        u.address?.toLowerCase().includes(term) ||
        u.hobby?.toLowerCase().includes(term)
      );
    });
  }, [cloudUsers, userRoleFilter, userSearchTerm]);

  // Table Filters, Search & Pagination
  const ITEMS_PER_PAGE = 10;
  const [vocabSearch, setVocabSearch] = useState('');
  const [vocabThemeFilter, setVocabThemeFilter] = useState('all');
  const [vocabPage, setVocabPage] = useState(1);

  const [mathSearch, setMathSearch] = useState('');
  const [mathTypeFilter, setMathTypeFilter] = useState('all');
  const [mathPage, setMathPage] = useState(1);

  const [logicSearch, setLogicSearch] = useState('');
  const [logicTypeFilter, setLogicTypeFilter] = useState('all');
  const [logicPage, setLogicPage] = useState(1);

  const [userPage, setUserPage] = useState(1);

  // Filtered and Paginated Vocab
  const filteredWords = React.useMemo(() => {
    return words.filter(w => {
      const matchS = !vocabSearch || w.vn.toLowerCase().includes(vocabSearch.toLowerCase()) || w.en.toLowerCase().includes(vocabSearch.toLowerCase());
      const matchT = vocabThemeFilter === 'all' || w.theme === vocabThemeFilter;
      return matchS && matchT;
    });
  }, [words, vocabSearch, vocabThemeFilter]);

  const totalVocabPages = Math.ceil(filteredWords.length / ITEMS_PER_PAGE) || 1;
  const pagedWords = React.useMemo(() => {
    const start = (vocabPage - 1) * ITEMS_PER_PAGE;
    return filteredWords.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredWords, vocabPage]);

  React.useEffect(() => {
    setVocabPage(1);
  }, [vocabSearch, vocabThemeFilter]);

  // Filtered and Paginated Math
  const filteredMath = React.useMemo(() => {
    return mathLevels.filter(m => {
      const matchS = !mathSearch || m.title?.toLowerCase().includes(mathSearch.toLowerCase()) || m.promptVN?.toLowerCase().includes(mathSearch.toLowerCase());
      const matchT = mathTypeFilter === 'all' || m.type === mathTypeFilter;
      return matchS && matchT;
    });
  }, [mathLevels, mathSearch, mathTypeFilter]);

  const totalMathPages = Math.ceil(filteredMath.length / ITEMS_PER_PAGE) || 1;
  const pagedMath = React.useMemo(() => {
    const start = (mathPage - 1) * ITEMS_PER_PAGE;
    return filteredMath.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredMath, mathPage]);

  React.useEffect(() => {
    setMathPage(1);
  }, [mathSearch, mathTypeFilter]);

  // Filtered and Paginated Logic
  const filteredLogic = React.useMemo(() => {
    return logicLevels.filter(l => {
      const matchS = !logicSearch || l.title?.toLowerCase().includes(logicSearch.toLowerCase()) || l.promptVN?.toLowerCase().includes(logicSearch.toLowerCase());
      const matchT = logicTypeFilter === 'all' || l.type === logicTypeFilter;
      return matchS && matchT;
    });
  }, [logicLevels, logicSearch, logicTypeFilter]);

  const totalLogicPages = Math.ceil(filteredLogic.length / ITEMS_PER_PAGE) || 1;
  const pagedLogic = React.useMemo(() => {
    const start = (logicPage - 1) * ITEMS_PER_PAGE;
    return filteredLogic.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredLogic, logicPage]);

  React.useEffect(() => {
    setLogicPage(1);
  }, [logicSearch, logicTypeFilter]);

  // Filtered and Paginated Users
  const totalUserPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE) || 1;
  const pagedUsers = React.useMemo(() => {
    const start = (userPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredUsers, userPage]);

  React.useEffect(() => {
    setUserPage(1);
  }, [userRoleFilter, userSearchTerm]);

  // Batch Generator Modal & Smart Creation States
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [genTab, setGenTab] = useState('quick_text'); // 'quick_text' | 'math' | 'logic'
  const [quickText, setQuickText] = useState('');
  const [quickTheme, setQuickTheme] = useState('auto');
  const [mathGenCount, setMathGenCount] = useState(10);
  const [mathGenCat, setMathGenCat] = useState('all');
  const [logicGenCount, setLogicGenCount] = useState(10);
  const [isBatchGenerating, setIsBatchGenerating] = useState(false);

  const fetchCloudUserData = async () => {
    setIsLoadingUsers(true);
    try {
      const data = await supabaseService.fetchAllPlayersWithProgress();
      setCloudUsers(data.players || []);
      setLearningLogs(data.logs || []);
    } catch (e) {
      console.warn('Lỗi tải người chơi:', e);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  React.useEffect(() => {
    fetchCloudUserData();
  }, []);

  // Helper trigger notification
  const notify = (msg) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(''), 5000);
  };

  // Đồng bộ trực tiếp từ Database
  const handleSyncDatabase = async () => {
    sounds.playClick();
    notify('Đang tải dữ liệu từ Supabase Database...');
    const refreshed = await dataManager.refreshFromDatabase();
    setWords([...refreshed.words]);
    setMathLevels([...refreshed.mathLevels]);
    setLogicLevels([...refreshed.logicLevels]);
    setPets([...refreshed.pets]);
    setShopItems([...refreshed.shopItems]);
    await fetchCloudUserData();
    sounds.playSuccess();
    notify(`Đồng bộ thành công từ Database: ${refreshed.words.length} từ vựng, ${refreshed.mathLevels.length} câu toán! 🚀`);
    if (onDataChanged) onDataChanged();
  };

  // ⚡ 1-Click Master Data Seeder (100+ items)
  const handleSeedDatabaseFull = async () => {
    sounds.playClick();
    setIsBatchGenerating(true);
    notify('⏳ Đang nạp kho 100+ dữ liệu mẫu vào hệ thống và Database...');
    try {
      const counts = await dataManager.seedFullDatabase();
      setWords([...dataManager.getWords()]);
      setMathLevels([...dataManager.getMathLevels()]);
      setLogicLevels([...dataManager.getLogicLevels()]);
      setPets([...dataManager.getPets()]);
      setShopItems([...dataManager.getShopItems()]);
      sounds.playSuccess();
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      notify(`🎉 Đã nạp thành công ${counts.wordsCount + counts.mathCount + counts.logicCount + counts.petsCount + counts.shopCount} dữ liệu mẫu: ${counts.wordsCount} từ vựng, ${counts.mathCount} toán, ${counts.logicCount} logic, ${counts.petsCount} thú cưng, ${counts.shopCount} vật phẩm! 🚀`);
      if (onDataChanged) onDataChanged();
    } catch (err) {
      sounds.playError();
      notify(`Lỗi khi nạp dữ liệu: ${err.message}`);
    } finally {
      setIsBatchGenerating(false);
    }
  };

  // 📝 Xử lý nạp văn bản nhanh (Quick text paste)
  const handleBatchAddQuickWords = async () => {
    if (!quickText.trim()) {
      sounds.playError();
      notify('Vui lòng nhập hoặc dán danh sách từ vào ô nhập liệu!');
      return;
    }
    setIsBatchGenerating(true);
    sounds.playClick();
    notify('Đang phân tích từ, dò emoji và dịch tự động...');
    try {
      const parsed = dataManager.parseQuickTextWords(quickText);
      if (parsed.length === 0) {
        sounds.playError();
        notify('Không tìm thấy từ hợp lệ để nạp!');
        setIsBatchGenerating(false);
        return;
      }

      // Ghi đè chủ đề nếu người dùng chọn cụ thể
      const finalItems = parsed.map(item => ({
        ...item,
        theme: quickTheme !== 'auto' ? quickTheme : item.theme
      }));

      const added = await dataManager.batchAddWords(finalItems);
      setWords([...dataManager.getWords()]);
      sounds.playSuccess();
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      notify(`🚀 Đã thêm cấp tốc ${added} từ vựng mới cùng Emoji & Tiếng Anh vào Database!`);
      setQuickText('');
      if (onDataChanged) onDataChanged();
    } catch (err) {
      sounds.playError();
      notify(`Lỗi nạp từ: ${err.message}`);
    } finally {
      setIsBatchGenerating(false);
    }
  };

  // 🧮 Xử lý tự động sinh câu hỏi Toán
  const handleBatchGenerateMath = async () => {
    setIsBatchGenerating(true);
    sounds.playClick();
    notify(`Đang tạo tự động ${mathGenCount} câu hỏi Toán sinh động...`);
    try {
      const count = dataManager.generateSmartMathLevels(Number(mathGenCount), mathGenCat);
      setMathLevels([...dataManager.getMathLevels()]);
      sounds.playSuccess();
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      notify(`➕ Đã tạo và nạp thành công ${count} bài tập toán vào Database!`);
      if (onDataChanged) onDataChanged();
    } catch (err) {
      sounds.playError();
      notify(`Lỗi sinh bài tập toán: ${err.message}`);
    } finally {
      setIsBatchGenerating(false);
    }
  };

  // 🧩 Xử lý tự động sinh câu đố Logic
  const handleBatchGenerateLogic = async () => {
    setIsBatchGenerating(true);
    sounds.playClick();
    notify(`Đang tạo tự động ${logicGenCount} câu đố Logic tư duy...`);
    try {
      const count = dataManager.generateSmartLogicLevels(Number(logicGenCount));
      setLogicLevels([...dataManager.getLogicLevels()]);
      sounds.playSuccess();
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      notify(`🧩 Đã tạo và nạp thành công ${count} câu đố logic vào Database!`);
      if (onDataChanged) onDataChanged();
    } catch (err) {
      sounds.playError();
      notify(`Lỗi sinh câu đố logic: ${err.message}`);
    } finally {
      setIsBatchGenerating(false);
    }
  };

  // ===================== 1. XỬ LÝ TỪ VỰNG =====================
  const handleVNChange = (e) => {
    const val = e.target.value;
    const detected = autoDetectEmoji(val, wordForm.en);
    const hasDetected = detected !== '⭐';
    setWordForm(prev => ({
      ...prev,
      vn: val,
      emoji: hasDetected ? detected : prev.emoji
    }));
    if (hasDetected) setIsAutoEmoji(true);
  };

  const handleENChange = (e) => {
    const val = e.target.value;
    const detected = autoDetectEmoji(wordForm.vn, val);
    const hasDetected = detected !== '⭐';
    setWordForm(prev => ({
      ...prev,
      en: val,
      emoji: hasDetected ? detected : prev.emoji
    }));
    if (hasDetected) setIsAutoEmoji(true);
  };

  const handleAddWord = async (e) => {
    e.preventDefault();
    if (!wordForm.vn.trim() || !wordForm.en.trim()) {
      sounds.playError();
      notify('Vui lòng nhập đầy đủ tên Tiếng Việt và Tiếng Anh!');
      return;
    }
    sounds.playSuccess();
    notify('Đang lưu vào Supabase Database...');
    const created = await dataManager.addWord(wordForm);
    setWords([...dataManager.getWords()]);
    setWordForm({ vn: '', en: '', emoji: '⭐', theme: 'Động vật', hintVN: '', hintEN: '' });
    setIsAutoEmoji(false);
    setShowEmojiPicker(false);
    notify(`Đã lưu thành công vào Database từ: "${created.vn} - ${created.en}" 🎉`);
    if (onDataChanged) onDataChanged();
  };

  const handleDeleteWord = async (id, name) => {
    sounds.playClick();
    if (window.confirm(`Xóa từ "${name}" khỏi database?`)) {
      const updated = await dataManager.deleteWord(id);
      setWords([...updated]);
      notify(`Đã xóa từ "${name}" khỏi database!`);
      if (onDataChanged) onDataChanged();
    }
  };

  const handleAddPack = async (packKey) => {
    sounds.playSuccess();
    sounds.playCoin();
    notify('Đang lưu bộ đề vào Supabase Database...');
    const pack = PRESET_PACKS[packKey];
    if (pack && Array.isArray(pack.items)) {
      await dataManager.importFromRows(pack.items);
      setWords([...dataManager.getWords()]);
      notify(`Đã nạp bộ đề "${pack.name}" vào Database thành công! 🚀`);
      if (onDataChanged) onDataChanged();
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsProcessingFile(true);
    sounds.playClick();
    notify('Đang đọc file và lưu vào Supabase Database...');

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        if (!data || data.length === 0) {
          sounds.playError();
          notify('File Excel không có dữ liệu hợp lệ!');
          setIsProcessingFile(false);
          return;
        }

        const addedCount = await dataManager.importFromRows(data);
        setWords([...dataManager.getWords()]);
        sounds.playSuccess();
        sounds.playCheer();
        notify(`Thành công! Đã nạp ${addedCount} từ vựng vào Supabase Database! 🎉`);
        if (onDataChanged) onDataChanged();
      } catch (err) {
        sounds.playError();
        notify(`Lỗi khi đọc file: ${err.message}`);
      } finally {
        setIsProcessingFile(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsBinaryString(file);
  };

  // ===================== 2. XỬ LÝ TOÁN HỌC =====================
  const handleAddMath = async (e) => {
    e.preventDefault();
    if (!mathForm.title || !mathForm.promptVN || !mathForm.answer) {
      sounds.playError();
      notify('Vui lòng nhập đầy đủ tiêu đề, câu hỏi và đáp án đúng!');
      return;
    }

    const opts = mathForm.options.split(',').map(s => s.trim()).filter(Boolean);
    const item = {
      type: mathForm.type,
      title: mathForm.title,
      promptVN: mathForm.promptVN,
      promptEN: mathForm.promptEN || mathForm.promptVN,
      itemEmoji: mathForm.itemEmoji || '🍎',
      options: opts.length > 0 ? opts : [1, 2, 3, 4],
      answer: isNaN(Number(mathForm.answer)) ? mathForm.answer : Number(mathForm.answer)
    };

    if (mathForm.type === 'count') {
      item.targetCount = Number(mathForm.targetCount) || 4;
    } else if (mathForm.type === 'addition') {
      item.num1 = Number(mathForm.num1) || 2;
      item.num2 = Number(mathForm.num2) || 3;
    }

    await dataManager.addMathLevel(item);
    setMathLevels([...dataManager.getMathLevels()]);
    sounds.playSuccess();
    notify(`Đã thêm câu hỏi Toán vào Database: "${item.title}"! ➕`);
    setMathForm({
      type: 'count',
      title: '',
      promptVN: '',
      promptEN: '',
      itemEmoji: '🍎',
      targetCount: 4,
      num1: 3,
      num2: 2,
      sideACount: 3,
      sideBCount: 5,
      options: '2, 3, 4, 5',
      answer: '4'
    });
  };

  const handleDeleteMath = async (id) => {
    sounds.playClick();
    if (window.confirm('Xóa câu hỏi Toán này khỏi Database?')) {
      const updated = await dataManager.deleteMathLevel(id);
      setMathLevels([...updated]);
      notify('Đã xóa câu hỏi toán khỏi Database!');
    }
  };

  // ===================== 3. XỬ LÝ LOGIC =====================
  const handleAddLogic = (e) => {
    e.preventDefault();
    if (!logicForm.title || !logicForm.promptVN || !logicForm.answer) {
      sounds.playError();
      notify('Vui lòng nhập đầy đủ tiêu đề, câu hỏi và đáp án đúng!');
      return;
    }

    const item = {
      type: logicForm.type,
      title: logicForm.title,
      promptVN: logicForm.promptVN,
      promptEN: logicForm.promptEN || logicForm.promptVN,
      sequence: logicForm.sequence.split(',').map(s => s.trim()).filter(Boolean),
      options: logicForm.options.split(',').map(s => s.trim()).filter(Boolean),
      answer: logicForm.answer.trim(),
      hint: logicForm.hint
    };

    dataManager.addLogicLevel(item);
    setLogicLevels(dataManager.getLogicLevels());
    sounds.playSuccess();
    notify(`Đã thêm câu đố tư duy: "${item.title}" thành công! 🧩`);
    setLogicForm({
      type: 'pattern',
      title: '',
      promptVN: '',
      promptEN: '',
      sequence: '🍎, 🍏, 🍎, 🍏',
      options: '🍎, 🍌, 🍇, 🍉',
      answer: '🍎',
      hint: ''
    });
  };

  const handleDeleteLogic = (id) => {
    sounds.playClick();
    if (window.confirm('Xóa câu đố Logic này?')) {
      const updated = dataManager.deleteLogicLevel(id);
      setLogicLevels(updated);
      notify('Đã xóa câu đố logic!');
    }
  };

  // ===================== 4. XỬ LÝ PET & SHOP =====================
  const handleAddPet = (e) => {
    e.preventDefault();
    if (!petForm.name.trim()) return;
    dataManager.addPet(petForm);
    setPets(dataManager.getPets());
    sounds.playSuccess();
    notify(`Đã thêm bạn thú cưng: "${petForm.name}"! 🐾`);
    setPetForm({ name: '', emoji: '🐰', sound: 'Khịt khịt!' });
  };

  const handleDeletePet = (id) => {
    sounds.playClick();
    if (pets.length <= 1) {
      sounds.playError();
      notify('Game cần ít nhất 1 thú cưng để hoạt động!');
      return;
    }
    const updated = dataManager.deletePet(id);
    setPets(updated);
    notify('Đã xóa thú cưng!');
  };

  const handleAddShop = (e) => {
    e.preventDefault();
    if (!shopForm.name.trim()) return;
    dataManager.addShopItem(shopForm);
    setShopItems(dataManager.getShopItems());
    sounds.playSuccess();
    notify(`Đã thêm vật phẩm: "${shopForm.name}" vào cửa hàng! 🛍️`);
    setShopForm({ name: '', type: 'food', emoji: '🍎', price: 10, hungerBoost: 25 });
  };

  const handleDeleteShop = (id) => {
    sounds.playClick();
    const updated = dataManager.deleteShopItem(id);
    setShopItems(updated);
    notify('Đã xóa vật phẩm khỏi cửa hàng!');
  };

  // ===================== 5. HỒ SƠ BÉ =====================
  const handleSavePlayer = async (e) => {
    e.preventDefault();
    sounds.playSuccess();

    if (selectedPlayerId) {
      await supabaseService.adminUpdatePlayer(selectedPlayerId, {
        name: playerEdit.name,
        email: playerEdit.email,
        birthDate: playerEdit.birthDate,
        address: playerEdit.address,
        phone: playerEdit.phone,
        hobby: playerEdit.hobby,
        avatarUrl: playerEdit.avatarUrl
      }, {
        stars: Number(playerEdit.stars),
        coins: Number(playerEdit.coins),
        level: Number(playerEdit.level)
      });
      await fetchCloudUserData();
      notify(`Đã cập nhật hồ sơ & chỉ số của "${playerEdit.name || selectedPlayerName}" vào Database (bảng public.players & game_progress) thành công! 🚀`);
    } else {
      if (onUpdatePlayerData) {
        onUpdatePlayerData({
          stars: Number(playerEdit.stars),
          coins: Number(playerEdit.coins),
          level: Number(playerEdit.level)
        });
      }
      notify('Đã cập nhật chỉ số của bé thành công! ⭐');
    }
  };

  const handleDeletePlayer = async (playerId, playerName) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa hồ sơ học sinh "${playerName || 'này'}" khỏi cơ sở dữ liệu Supabase không? Thao tác này sẽ xóa sạch dữ liệu tiến độ và không thể phục hồi!`)) {
      return;
    }
    sounds.playClick();
    await supabaseService.deletePlayer(playerId);
    if (selectedPlayerId === playerId) {
      setSelectedPlayerId(null);
      setSelectedPlayerName('');
    }
    await fetchCloudUserData();
    notify(`Đã xóa học sinh "${playerName || 'được chọn'}" khỏi Database! 🗑️`);
  };

  // ===================== 6. FULL BACKUP & RESTORE =====================
  const handleBackupExport = () => {
    sounds.playSuccess();
    dataManager.exportFullBackupJSON();
    notify('Đã xuất file sao lưu toàn bộ game thành công! 📦');
  };

  const handleBackupImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target?.result;
        const ok = dataManager.importFullBackupJSON(text);
        if (ok) {
          sounds.playSuccess();
          setWords(dataManager.getWords());
          setMathLevels(dataManager.getMathLevels());
          setLogicLevels(dataManager.getLogicLevels());
          setPets(dataManager.getPets());
          setShopItems(dataManager.getShopItems());
          notify('Khôi phục toàn bộ dữ liệu game thành công! 🎉');
          if (onDataChanged) onDataChanged();
        } else {
          sounds.playError();
          notify('File sao lưu JSON không đúng định dạng!');
        }
      } catch (err) {
        sounds.playError();
        notify(`Lỗi khôi phục: ${err.message}`);
      } finally {
        if (backupInputRef.current) backupInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  const handleResetAll = () => {
    sounds.playClick();
    if (window.confirm('CẢNH BÁO: Khôi phục tất cả dữ liệu (Từ vựng, Toán, Logic, Pet, Shop) về trạng thái mặc định ban đầu?')) {
      const res = dataManager.resetAllToDefaults();
      setWords(res.words);
      setMathLevels(res.mathLevels);
      setLogicLevels(res.logicLevels);
      setPets(res.pets);
      setShopItems(res.shopItems);
      if (onResetAllData) onResetAllData();
      sounds.playSuccess();
      notify('Toàn bộ hệ thống đã được khôi phục về cài đặt gốc!');
      if (onDataChanged) onDataChanged();
    }
  };

  const copySQL = () => {
    const sql = `-- ========================================================
-- SCHEMA HOÀN CHỈNH CHO GAME GIÁO DỤC TRẺ EM (KIDS EDU GAME)
-- Dán đoạn mã này vào SQL Editor trên Supabase và bấm RUN
-- ========================================================

-- 1. BẢNG TỪ VỰNG NGÔN NGỮ (Language Valley)
CREATE TABLE IF NOT EXISTS public.game_vocabulary (
  id BIGSERIAL PRIMARY KEY,
  vn TEXT NOT NULL,
  en TEXT NOT NULL,
  emoji TEXT NOT NULL DEFAULT '⭐',
  theme TEXT DEFAULT 'Tổng hợp',
  target_vn TEXT,
  target_en TEXT,
  hint_vn TEXT,
  hint_en TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. BẢNG TOÁN HỌC (Math Farm)
CREATE TABLE IF NOT EXISTS public.game_math (
  id BIGSERIAL PRIMARY KEY,
  type TEXT NOT NULL DEFAULT 'count',
  title TEXT NOT NULL,
  prompt_vn TEXT NOT NULL,
  prompt_en TEXT,
  item_emoji TEXT DEFAULT '🍎',
  target_count INTEGER,
  num1 INTEGER,
  num2 INTEGER,
  options JSONB DEFAULT '[]'::jsonb,
  answer TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. BẢNG TƯ DUY & LOGIC (Logic Tower)
CREATE TABLE IF NOT EXISTS public.game_logic (
  id BIGSERIAL PRIMARY KEY,
  type TEXT NOT NULL DEFAULT 'pattern',
  title TEXT NOT NULL,
  prompt_vn TEXT NOT NULL,
  prompt_en TEXT,
  sequence JSONB DEFAULT '[]'::jsonb,
  options JSONB DEFAULT '[]'::jsonb,
  answer TEXT NOT NULL,
  hint TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. BẢNG THÚ CƯNG (Pet Sanctuary)
CREATE TABLE IF NOT EXISTS public.game_pets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  emoji TEXT NOT NULL,
  sound TEXT NOT NULL,
  hunger INTEGER DEFAULT 80,
  happiness INTEGER DEFAULT 90,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. BẢNG CỬA HÀNG VẬT PHẨM (Shop Items)
CREATE TABLE IF NOT EXISTS public.game_shop (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'food',
  emoji TEXT NOT NULL,
  price INTEGER DEFAULT 10,
  hunger_boost INTEGER DEFAULT 25,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. BẢNG HỒ SƠ NGƯỜI CHƠI (Players) - Lưu trữ thông tin cá nhân và hồ sơ bé
CREATE TABLE IF NOT EXISTS public.players (
  id TEXT PRIMARY KEY,
  name TEXT DEFAULT 'Bé Thám Hiểm',
  email TEXT,
  avatar_url TEXT,
  birth_date DATE,
  address TEXT,
  phone TEXT,
  hobby TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Bổ sung cột nếu bảng public.players đã tồn tại trước đó
ALTER TABLE public.players ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.players ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.players ADD COLUMN IF NOT EXISTS birth_date DATE;
ALTER TABLE public.players ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.players ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.players ADD COLUMN IF NOT EXISTS hobby TEXT;
ALTER TABLE public.players ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';
ALTER TABLE public.players ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- 7. BẢNG TIẾN ĐỘ CHƠI (Game Progress)
CREATE TABLE IF NOT EXISTS public.game_progress (
  player_id TEXT PRIMARY KEY REFERENCES public.players(id) ON DELETE CASCADE,
  stars INTEGER DEFAULT 5,
  coins INTEGER DEFAULT 30,
  level INTEGER DEFAULT 1,
  pet_data JSONB DEFAULT '{"id": "cat", "name": "Bé Miu Miu", "hunger": 80, "happiness": 90}'::jsonb,
  stats_data JSONB DEFAULT '{"language": {"completed": 0, "correct": 0}, "math": {"completed": 0, "correct": 0}, "logic": {"completed": 0, "correct": 0}}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 8. BẢNG NHẬT KÝ HỌC TẬP (Learning Logs)
CREATE TABLE IF NOT EXISTS public.learning_logs (
  id BIGSERIAL PRIMARY KEY,
  player_id TEXT,
  subject TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT true,
  score_earned INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- BẬT RLS CHO CÁC BẢNG VÀ CẤP QUYỀN
ALTER TABLE public.game_vocabulary ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public vocabulary" ON public.game_vocabulary FOR ALL TO public USING (true) WITH CHECK (true);

ALTER TABLE public.game_math ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public math" ON public.game_math FOR ALL TO public USING (true) WITH CHECK (true);

ALTER TABLE public.game_logic ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public logic" ON public.game_logic FOR ALL TO public USING (true) WITH CHECK (true);

ALTER TABLE public.game_pets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public pets" ON public.game_pets FOR ALL TO public USING (true) WITH CHECK (true);

ALTER TABLE public.game_shop ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public shop" ON public.game_shop FOR ALL TO public USING (true) WITH CHECK (true);

ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public players" ON public.players FOR ALL TO public USING (true) WITH CHECK (true);

ALTER TABLE public.game_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public game_progress" ON public.game_progress FOR ALL TO public USING (true) WITH CHECK (true);

ALTER TABLE public.learning_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public learning_logs" ON public.learning_logs FOR ALL TO public USING (true) WITH CHECK (true);`;
    navigator.clipboard.writeText(sql);
    setIsCopiedSQL(true);
    sounds.playCoin();
    setTimeout(() => setIsCopiedSQL(false), 3000);
  };

  return (
    <div className="page-container" style={{ maxWidth: '1100px' }}>
      {/* Top Navbar */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        gap: '12px',
        marginBottom: '16px', 
        background: '#ffffff',
        padding: 'clamp(12px, 3vw, 16px)',
        borderRadius: '20px',
        border: '3px solid #e2e8f0',
        boxShadow: '0 4px 14px rgba(0,0,0,0.04)'
      }}>
        {/* Row 1: Back Button & Supabase Status Badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <button onClick={onBack} className="btn-kid btn-blue" style={{ padding: '6px 12px', fontSize: '12.5px' }}>
            <ArrowLeft size={15} />
            <span>Quay Lại Game</span>
          </button>
          <span style={{ 
            fontSize: '11px', 
            fontWeight: 800, 
            color: '#10b981', 
            background: '#ecfdf5', 
            padding: '3px 10px', 
            borderRadius: '999px', 
            border: '1.5px solid #a7f3d0',
            whiteSpace: 'nowrap'
          }}>
            🟢 Supabase Online
          </span>
        </div>

        {/* Row 2: Title & Subtitle */}
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(16px, 4vw, 22px)', fontWeight: 900, color: '#0f172a', margin: '0 0 2px', lineHeight: 1.2 }}>
            🛡️ Cổng Quản Trị Hệ Thống
          </h2>
          <div style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 600 }}>
            Quản trị nội dung học tập và đồng bộ dữ liệu đám mây
          </div>
        </div>

        {/* Global Action Toolbar - Horizontal Scrollbar on Mobile / Flex Wrap */}
        <div style={{
          display: 'flex',
          gap: '6px',
          width: '100%',
          overflowX: 'auto',
          paddingBottom: '4px',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none'
        }}>
          {/* NẠP 100+ DỮ LIỆU KHỦNG (1-CLICK MASTER SEED) */}
          <button 
            type="button"
            onClick={handleSeedDatabaseFull} 
            disabled={isBatchGenerating}
            style={{ 
              padding: '6px 12px', 
              fontSize: '11.5px',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              boxShadow: '0 2px 6px rgba(245, 158, 11, 0.3)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
              cursor: isBatchGenerating ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
            title="Nạp tức thì 100+ câu hỏi và bài học mẫu chất lượng cao vào database"
          >
            {isBatchGenerating ? (
              <>
                <RefreshCw size={13} className="animate-spin" />
                <span>Đang Nạp...</span>
              </>
            ) : (
              <>
                <Zap size={13} />
                <span>⚡ Nạp 100+ Dữ Liệu</span>
              </>
            )}
          </button>

          {/* SIÊU TRÌNH TẠO TỰ ĐỘNG (SMART BATCH GENERATOR) */}
          <button 
            type="button"
            onClick={() => { sounds.playClick(); setIsGeneratorOpen(true); }}
            style={{ 
              padding: '6px 12px', 
              fontSize: '11.5px',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              boxShadow: '0 2px 6px rgba(99, 102, 241, 0.3)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
            title="Dán chữ tự nhận dạng emoji & dịch tiếng Anh, hoặc tự sinh hàng loạt bài tập toán/logic"
          >
            <Wand2 size={13} />
            <span>🤖 Tạo Hàng Loạt</span>
          </button>

          <button 
            type="button"
            onClick={handleSyncDatabase} 
            className="btn-kid btn-green" 
            style={{ padding: '6px 12px', fontSize: '11.5px', whiteSpace: 'nowrap', flexShrink: 0, borderRadius: '10px' }}
            title="Đồng bộ kéo dữ liệu mới nhất từ Supabase Database về"
          >
            <RefreshCw size={13} />
            <span>Tải Database</span>
          </button>

          <input
            type="file"
            ref={backupInputRef}
            onChange={handleBackupImport}
            accept=".json"
            style={{ display: 'none' }}
          />

          <button 
            type="button"
            onClick={handleBackupExport} 
            className="btn-kid btn-purple" 
            style={{ padding: '6px 12px', fontSize: '11.5px', whiteSpace: 'nowrap', flexShrink: 0, borderRadius: '10px' }}
            title="Tải về file JSON sao lưu toàn bộ dữ liệu game"
          >
            <Download size={13} />
            <span>Sao Lưu</span>
          </button>

          <button 
            type="button"
            onClick={() => backupInputRef.current?.click()} 
            className="btn-kid btn-blue" 
            style={{ padding: '6px 12px', fontSize: '11.5px', whiteSpace: 'nowrap', flexShrink: 0, borderRadius: '10px' }}
            title="Khôi phục toàn bộ câu hỏi và dữ liệu từ file JSON"
          >
            <Upload size={13} />
            <span>Khôi Phục</span>
          </button>

          <button 
            type="button"
            onClick={handleResetAll} 
            className="btn-kid btn-yellow" 
            style={{ padding: '6px 12px', fontSize: '11.5px', whiteSpace: 'nowrap', flexShrink: 0, borderRadius: '10px' }}
            title="Khôi phục toàn bộ dữ liệu về mặc định"
          >
            <RotateCcw size={13} />
            <span>Reset Toàn Bộ</span>
          </button>
        </div>
      </div>

      {/* Feedback Message */}
      {feedbackMsg && (
        <div className="animate-pop-in" style={{
          background: '#f0fdf4',
          border: '2px solid #86efac',
          color: '#15803d',
          padding: '12px 20px',
          borderRadius: '16px',
          fontWeight: 700,
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle2 size={18} />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Navigation Tabs Bar - Smooth Horizontal Scroll On Mobile */}
      <div 
        style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '20px',
          overflowX: 'auto',
          paddingBottom: '4px',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none'
        }}
      >
        {[
          { id: 'overview', label: 'Tổng Quan & Biểu Đồ', icon: LayoutDashboard, badge: null, color: '#3b82f6' },
          { id: 'language', label: 'Bảng Từ Vựng', icon: BookOpen, badge: words.length, color: '#10b981' },
          { id: 'math', label: 'Bảng Toán Học', icon: Calculator, badge: mathLevels.length, color: '#f59e0b' },
          { id: 'logic', label: 'Bảng Tư Duy Logic', icon: Brain, badge: logicLevels.length, color: '#8b5cf6' },
          { id: 'pet', label: 'Thú Cưng & Cửa Hàng', icon: Dog, badge: pets.length + shopItems.length, color: '#ec4899' },
          { id: 'player', label: 'Bảng Học Sinh & Người Dùng', icon: Users, badge: `${studentUsers.length} bé`, color: '#06b6d4' },
          { id: 'cloud', label: 'Cloud Supabase & SQL', icon: Database, badge: 'Online', color: '#6366f1' }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                sounds.playClick();
                setActiveTab(tab.id);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '14px',
                border: isActive ? `2px solid ${tab.color}` : '2px solid #e2e8f0',
                background: isActive ? '#ffffff' : '#f8fafc',
                color: isActive ? tab.color : '#475569',
                fontWeight: 800,
                fontSize: '13px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                transition: 'all 0.2s ease',
                boxShadow: isActive ? '0 4px 10px rgba(0,0,0,0.06)' : 'none'
              }}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
              {tab.badge !== null && (
                <span style={{
                  fontSize: '11px',
                  background: isActive ? tab.color : '#e2e8f0',
                  color: isActive ? '#ffffff' : '#64748b',
                  padding: '1px 6px',
                  borderRadius: '999px',
                  fontWeight: 800
                }}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ===================== TAB 1: TỔNG QUAN & BIỂU ĐỒ PHÂN TÍCH ===================== */}
      {activeTab === 'overview' && (() => {
        const totalContent = words.length + mathLevels.length + logicLevels.length + pets.length + shopItems.length;
        const correctLogs = learningLogs.filter(l => l.is_correct).length;
        const accuracyRate = learningLogs.length > 0 ? Math.round((correctLogs / learningLogs.length) * 100) : 100;

        return (
          <div className="animate-pop-in">
            {/* 5 KPI Summary Cards (Clean 2x2 on mobile + Full Span 5th Card) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', marginBottom: '20px' }}>
              <div className="kid-card" style={{ padding: '14px', background: '#ecfdf5', border: '2px solid #a7f3d0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#047857' }}>Từ Vựng</span>
                  <BookOpen size={18} color="#059669" />
                </div>
                <div style={{ fontSize: '26px', fontWeight: 900, color: '#065f46' }}>{words.length}</div>
                <div style={{ fontSize: '10.5px', color: '#059669', marginTop: '2px', fontFamily: 'monospace' }}>game_vocabulary</div>
              </div>

              <div className="kid-card" style={{ padding: '14px', background: '#fffbeb', border: '2px solid #fde68a' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#b45309' }}>Toán Học</span>
                  <Calculator size={18} color="#d97706" />
                </div>
                <div style={{ fontSize: '26px', fontWeight: 900, color: '#92400e' }}>{mathLevels.length}</div>
                <div style={{ fontSize: '10.5px', color: '#b45309', marginTop: '2px', fontFamily: 'monospace' }}>game_math</div>
              </div>

              <div className="kid-card" style={{ padding: '14px', background: '#f5f3ff', border: '2px solid #ddd6fe' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#6d28d9' }}>Tư Duy Logic</span>
                  <Brain size={18} color="#7c3aed" />
                </div>
                <div style={{ fontSize: '26px', fontWeight: 900, color: '#5b21b6' }}>{logicLevels.length}</div>
                <div style={{ fontSize: '10.5px', color: '#6d28d9', marginTop: '2px', fontFamily: 'monospace' }}>game_logic</div>
              </div>

              <div className="kid-card" style={{ padding: '14px', background: '#fdf2f8', border: '2px solid #fbcfe8' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#be185d' }}>Thú Cưng & Shop</span>
                  <Dog size={18} color="#db2777" />
                </div>
                <div style={{ fontSize: '26px', fontWeight: 900, color: '#9d174d' }}>{pets.length + shopItems.length}</div>
                <div style={{ fontSize: '10.5px', color: '#be185d', marginTop: '2px', fontFamily: 'monospace' }}>pets & shop</div>
              </div>

              <div className="kid-card" style={{ 
                padding: '14px', 
                background: '#eff6ff', 
                border: '2px solid #bfdbfe',
                gridColumn: '1 / -1' 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Users size={18} color="#2563eb" />
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#1d4ed8' }}>Học Sinh Đăng Ký Hệ Thống</span>
                  </div>
                  {adminUsers.length > 0 && (
                    <span style={{ background: '#fee2e2', color: '#dc2626', padding: '1px 6px', borderRadius: '6px', fontWeight: 800, fontSize: '10.5px' }}>
                      +{adminUsers.length} admin
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <div style={{ fontSize: '26px', fontWeight: 900, color: '#1e40af' }}>{studentUsers.length}</div>
                  <div style={{ fontSize: '12px', color: '#2563eb', fontWeight: 700 }}>tài khoản học sinh tham gia học</div>
                </div>
              </div>
            </div>

            {/* BIỂU ĐỒ PHÂN TÍCH 1: BIỂU ĐỒ CỘT NỘI DUNG & PHÂN BỔ */}
            <div className="kid-card" style={{ padding: '24px', background: '#ffffff', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BarChart3 size={22} color="#0284c7" />
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 800, color: '#1e293b', margin: 0 }}>
                    Biểu Đồ Phân Tích Cơ Cấu Nội Dung Học Tập
                  </h3>
                </div>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#64748b' }}>
                  Tổng cộng: {totalContent} bài tập & vật phẩm
                </span>
              </div>

              {/* Progress Bars / Bar Chart Visualizer */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { label: 'Từ vựng Ngôn ngữ (Language Valley)', count: words.length, color: '#10b981', icon: '📚' },
                  { label: 'Bài tập Toán học (Math Farm)', count: mathLevels.length, color: '#f59e0b', icon: '🔢' },
                  { label: 'Câu đố Tư duy & Quy luật (Logic Tower)', count: logicLevels.length, color: '#8b5cf6', icon: '🧩' },
                  { label: 'Thú cưng tương tác (Pet Sanctuary)', count: pets.length, color: '#ec4899', icon: '🐾' },
                  { label: 'Vật phẩm & Phụ kiện (Gift Shop)', count: shopItems.length, color: '#06b6d4', icon: '🎁' }
                ].map((item, idx) => {
                  const maxCount = Math.max(words.length, mathLevels.length, logicLevels.length, pets.length, shopItems.length, 1);
                  const percent = Math.round((item.count / maxCount) * 100);
                  const totalShare = totalContent > 0 ? Math.round((item.count / totalContent) * 100) : 0;
                  return (
                    <div key={idx}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 800, marginBottom: '6px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#334155' }}>
                          <span style={{ fontSize: '16px' }}>{item.icon}</span>
                          <span>{item.label}</span>
                        </span>
                        <span style={{ color: item.color, fontWeight: 900 }}>
                          {item.count} câu ({totalShare}% tổng nội dung)
                        </span>
                      </div>
                      <div style={{ width: '100%', height: '14px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
                        <div 
                          style={{ 
                            width: `${Math.max(percent, 3)}%`, 
                            height: '100%', 
                            background: item.color, 
                            borderRadius: '999px',
                            transition: 'width 0.8s ease'
                          }} 
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* BIỂU ĐỒ PHÂN TÍCH 2 & 3: TỈ LỆ ĐÚNG/SAI & HOẠT ĐỘNG */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px', marginBottom: '24px' }}>
              {/* Donut Accuracy Chart */}
              <div className="kid-card" style={{ padding: '24px', background: '#ffffff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <Trophy size={20} color="#eab308" />
                  <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#1e293b', margin: 0 }}>
                    Hiệu Suất Trả Lời Của Học Sinh
                  </h4>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                  <div style={{
                    width: '94px',
                    height: '94px',
                    borderRadius: '50%',
                    background: `conic-gradient(#10b981 0% ${accuracyRate}%, #fecaca ${accuracyRate}% 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 6px 16px rgba(16, 185, 129, 0.25)',
                    flexShrink: 0
                  }}>
                    <div style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: '50%',
                      background: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 900,
                      fontSize: '18px',
                      color: '#065f46'
                    }}>
                      {accuracyRate}%
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#15803d', marginBottom: '4px' }}>
                      🟢 Trả lời đúng: {correctLogs} lượt
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#b91c1c', marginBottom: '6px' }}>
                      🔴 Cần luyện thêm: {learningLogs.length - correctLogs} lượt
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
                      Tổng số lượt thử thách: {learningLogs.length} lần
                    </div>
                  </div>
                </div>
              </div>

              {/* Realtime Database Users Sync Gauge */}
              <div className="kid-card" style={{ padding: '24px', background: '#ffffff' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Activity size={20} color="#6366f1" />
                    <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#1e293b', margin: 0 }}>
                      Người Dùng & Tiến Độ Đám Mây
                    </h4>
                  </div>
                  <button onClick={fetchCloudUserData} className="btn-kid btn-blue" style={{ padding: '4px 10px', fontSize: '11px' }}>
                    <RefreshCw size={12} className={isLoadingUsers ? 'animate-spin' : ''} />
                    <span>Làm mới</span>
                  </button>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
                  <div style={{ fontSize: '36px', fontWeight: 900, color: '#4338ca' }}>
                    {studentUsers.length} <span style={{ fontSize: '16px', color: '#6366f1', fontWeight: 700 }}>học sinh đăng ký</span>
                  </div>
                  {adminUsers.length > 0 && (
                    <div style={{
                      fontSize: '12px',
                      fontWeight: 800,
                      color: '#dc2626',
                      background: '#fef2f2',
                      border: '1.5px solid #fecaca',
                      padding: '4px 10px',
                      borderRadius: '999px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <span>🛡️</span>
                      <span>Đã lọc riêng {adminUsers.length} tài khoản Admin</span>
                    </div>
                  )}
                </div>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0, fontWeight: 600, lineHeight: 1.5 }}>
                  Dữ liệu tài khoản phân quyền độc lập, đã tách tài khoản Quản trị viên để thống kê học tập chính xác trên Supabase Cloud ☁️
                </p>
              </div>
            </div>

            {/* BẢNG TỔNG HỢP DỮ LIỆU TOÀN BỘ HỆ THỐNG (TABLE GRID & MOBILE CARDS) */}
            <div className="kid-card" style={{ padding: 'clamp(14px, 3.5vw, 24px)', background: '#ffffff', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Database size={20} color="#475569" />
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(15px, 3.5vw, 18px)', fontWeight: 800, color: '#1e293b', margin: 0 }}>
                    Bảng Quản Trị Dữ Liệu Hệ Thống
                  </h3>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#10b981', background: '#ecfdf5', padding: '3px 10px', borderRadius: '999px', border: '1.5px solid #a7f3d0', whiteSpace: 'nowrap' }}>
                  🟢 Supabase Online
                </span>
              </div>

              {/* Mobile View (< 641px): Sleek Card List (Fixes horizontal scroll & distorted vertical text pills) */}
              <div className="show-on-mobile" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { name: '📚 Thung Lũng Ngôn Ngữ', count: `${words.length} từ vựng`, table: 'game_vocabulary', tab: 'language', color: '#10b981' },
                  { name: '🔢 Nông Trại Toán Học', count: `${mathLevels.length} bài toán`, table: 'game_math', tab: 'math', color: '#f59e0b' },
                  { name: '🧩 Tháp Tư Duy Logic', count: `${logicLevels.length} câu đố`, table: 'game_logic', tab: 'logic', color: '#8b5cf6' },
                  { name: '🐾 Thú Cưng Nuôi Dưỡng', count: `${pets.length} thú cưng`, table: 'game_pets', tab: 'pet', color: '#ec4899' },
                  { name: '🎁 Cửa Hàng Quà Tặng', count: `${shopItems.length} vật phẩm`, table: 'game_shop', tab: 'pet', color: '#06b6d4' },
                  { name: '👥 Học Sinh & User', count: `${studentUsers.length} bé (+${adminUsers.length} admin)`, table: 'players & progress', tab: 'player', color: '#6366f1' }
                ].map((row, i) => (
                  <div key={i} style={{
                    background: '#f8fafc',
                    borderRadius: '14px',
                    padding: '10px 12px',
                    border: '1.5px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px'
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {row.name}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px', flexWrap: 'wrap' }}>
                        <span style={{ fontFamily: 'monospace', fontSize: '10.5px', color: '#64748b', background: '#ffffff', padding: '1px 5px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                          {row.table}
                        </span>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: row.color }}>
                          {row.count}
                        </span>
                      </div>
                    </div>

                    <button 
                      onClick={() => { sounds.playClick(); setActiveTab(row.tab); }} 
                      className="btn-kid btn-blue" 
                      style={{ padding: '6px 12px', fontSize: '11.5px', flexShrink: 0, whiteSpace: 'nowrap' }}
                    >
                      Mở Bảng ➔
                    </button>
                  </div>
                ))}
              </div>

              {/* Desktop View (>= 641px): Full Data Table */}
              <div className="hide-on-mobile" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                      <th style={{ padding: '10px 14px', fontWeight: 800, color: '#475569', whiteSpace: 'nowrap' }}>Bảng Dữ Liệu (Collection)</th>
                      <th style={{ padding: '10px 14px', fontWeight: 800, color: '#475569', whiteSpace: 'nowrap' }}>Số Lượng</th>
                      <th style={{ padding: '10px 14px', fontWeight: 800, color: '#475569', whiteSpace: 'nowrap' }}>Bảng Supabase</th>
                      <th style={{ padding: '10px 14px', fontWeight: 800, color: '#475569', whiteSpace: 'nowrap' }}>Trạng Thái</th>
                      <th style={{ padding: '10px 14px', fontWeight: 800, color: '#475569', textAlign: 'right', whiteSpace: 'nowrap' }}>Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: '📚 Thung Lũng Ngôn Ngữ', count: words.length, table: 'game_vocabulary', tab: 'language', color: '#10b981' },
                      { name: '🔢 Nông Trại Toán Học', count: mathLevels.length, table: 'game_math', tab: 'math', color: '#f59e0b' },
                      { name: '🧩 Tháp Tư Duy Logic', count: logicLevels.length, table: 'game_logic', tab: 'logic', color: '#8b5cf6' },
                      { name: '🐾 Thú Cưng Nuôi Dưỡng', count: pets.length, table: 'game_pets', tab: 'pet', color: '#ec4899' },
                      { name: '🎁 Cửa Hàng Quà Tặng', count: shopItems.length, table: 'game_shop', tab: 'pet', color: '#06b6d4' },
                      { name: '👥 Học Sinh & Người Dùng', count: `${studentUsers.length} bé (${adminUsers.length} admin)`, table: 'players & game_progress', tab: 'player', color: '#6366f1' }
                    ].map((row, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }} onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                        <td style={{ padding: '12px 14px', fontWeight: 800, color: '#1e293b', whiteSpace: 'nowrap' }}>{row.name}</td>
                        <td style={{ padding: '12px 14px', fontWeight: 800, color: row.color, fontSize: '15px', whiteSpace: 'nowrap' }}>{row.count}</td>
                        <td style={{ padding: '12px 14px', fontFamily: 'monospace', color: '#64748b', fontSize: '12.5px', whiteSpace: 'nowrap' }}>{row.table}</td>
                        <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                          <span style={{ background: '#ecfdf5', color: '#059669', padding: '3px 8px', borderRadius: '999px', fontSize: '11px', fontWeight: 800, border: '1px solid #a7f3d0', whiteSpace: 'nowrap' }}>
                            🟢 Đồng bộ
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                          <button onClick={() => { sounds.playClick(); setActiveTab(row.tab); }} className="btn-kid btn-blue" style={{ padding: '5px 12px', fontSize: '11.5px', whiteSpace: 'nowrap' }}>
                            Mở Bảng ➔
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="kid-card" style={{ padding: '24px', background: '#ffffff', marginBottom: '24px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 800, color: '#1e293b', marginBottom: '14px' }}>
                ⚡ Thao Tác Quản Trị Nhanh
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                <button 
                  onClick={() => setActiveTab('language')} 
                  className="btn-kid btn-green"
                  style={{ padding: '12px', fontSize: '13px', justifyContent: 'flex-start' }}
                >
                  <FileSpreadsheet size={16} />
                  <span>Nạp Excel Từ Vựng Hàng Loạt</span>
                </button>

                <button 
                  onClick={() => setActiveTab('math')} 
                  className="btn-kid btn-yellow"
                  style={{ padding: '12px', fontSize: '13px', justifyContent: 'flex-start' }}
                >
                  <Plus size={16} />
                  <span>Thêm Câu Hỏi Toán Mới</span>
                </button>

                <button 
                  onClick={() => setActiveTab('logic')} 
                  className="btn-kid btn-purple"
                  style={{ padding: '12px', fontSize: '13px', justifyContent: 'flex-start' }}
                >
                  <Brain size={16} />
                  <span>Thêm Câu Đố Dãy Quy Luật</span>
                </button>

                <button 
                  onClick={handleBackupExport} 
                  className="btn-kid btn-blue"
                  style={{ padding: '12px', fontSize: '13px', justifyContent: 'flex-start' }}
                >
                  <Download size={16} />
                  <span>Xuất File Backup Đầy Đủ</span>
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ===================== TAB 2: TỪ VỰNG & NGÔN NGỮ ===================== */}
      {activeTab === 'language' && (
        <div className="animate-pop-in">
          {/* SECTION 1: NẠP FILE EXCEL / CSV HÀNG LOẠT */}
          <div className="kid-card" style={{ padding: '24px', background: '#ffffff', marginBottom: '24px', border: '3px solid #6ee7b7' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileSpreadsheet size={24} color="#059669" />
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 800, color: '#065f46', margin: 0 }}>
                  Nạp Dữ Liệu Hàng Loạt Bằng File Excel / CSV
                </h3>
              </div>

              <button
                onClick={() => dataManager.downloadSampleExcel()}
                className="btn-kid btn-yellow"
                style={{ padding: '8px 16px', fontSize: '12px' }}
              >
                <Download size={14} />
                <span>Tải File Mẫu Excel (.xlsx)</span>
              </button>
            </div>

            <p style={{ color: '#475569', fontSize: '13px', marginBottom: '16px', lineHeight: 1.6 }}>
              Soạn sẵn từ vựng trong Excel với các cột: <strong>TiengViet, TiengAnh, Emoji, ChuDe, GoiY</strong> rồi tải lên.
              <br />
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#ecfdf5', color: '#047857', padding: '4px 10px', borderRadius: '8px', marginTop: '6px', fontWeight: 700, fontSize: '12px' }}>
                <Sparkles size={14} /> Mẹo: Cột "Emoji" trong file Excel có thể ĐỂ TRỐNG — hệ thống tự động tìm kiếm và gán biểu tượng cho bạn!
              </span>
            </p>

            <div style={{
              border: '2px dashed #10b981',
              borderRadius: '16px',
              padding: '20px',
              textAlign: 'center',
              background: '#f0fdf4'
            }}>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".xlsx, .xls, .csv"
                style={{ display: 'none' }}
              />
              <Upload size={32} color="#10b981" style={{ margin: '0 auto 8px' }} />
              <div style={{ fontWeight: 800, fontSize: '15px', color: '#065f46', marginBottom: '4px' }}>
                {isProcessingFile ? 'Đang đọc và xử lý file...' : 'Chọn file Excel từ máy tính để nạp'}
              </div>
              <button
                type="button"
                disabled={isProcessingFile}
                onClick={() => fileInputRef.current?.click()}
                className="btn-kid btn-green"
                style={{ padding: '8px 20px', fontSize: '14px', marginTop: '8px' }}
              >
                <Upload size={16} />
                <span>Tải Lên File Excel Ngay</span>
              </button>
            </div>
          </div>

          {/* SECTION 2: 1-Click Preset Packs */}
          <div className="kid-card" style={{ padding: '24px', background: '#ffffff', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <PackagePlus size={20} color="#7c3aed" />
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 800, color: '#1e293b', margin: 0 }}>
                Nạp Nhanh Theo Bộ Đề Có Sẵn (1-Click Packs)
              </h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
              {Object.entries(PRESET_PACKS).map(([key, pack]) => (
                <div key={key} style={{ background: '#faf5ff', border: '2px solid #e9d5ff', borderRadius: '16px', padding: '14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '15px', color: '#581c87', marginBottom: '4px' }}>{pack.name}</div>
                    <div style={{ fontSize: '12px', color: '#7e22ce', marginBottom: '10px' }}>
                      {pack.items.map(i => `${i.emoji} ${i.vn}`).join(', ')}
                    </div>
                  </div>
                  <button onClick={() => handleAddPack(key)} className="btn-kid btn-purple" style={{ padding: '6px 12px', fontSize: '12px', width: '100%' }}>
                    <Sparkles size={14} />
                    <span>+ Nạp bộ này vào Game</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 3: Thêm từ vựng thủ công với Tự Động Tìm Emoji */}
          <div className="kid-card" style={{ padding: '24px', background: '#ffffff', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Plus size={20} color="#0284c7" />
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 800, color: '#1e293b', margin: 0 }}>
                Thêm Từng Từ Vựng Tự Chọn (Tự Động Tìm Icon 🐯)
              </h3>
            </div>

            <form onSubmit={handleAddWord}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>Tiếng Việt:</label>
                  <input
                    type="text"
                    placeholder="Vd: Con Hổ, Quả Chuối, Xe Hơi..."
                    value={wordForm.vn}
                    onChange={handleVNChange}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '10px', border: '2px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>Tiếng Anh:</label>
                  <input
                    type="text"
                    placeholder="Vd: Tiger, Banana, Car..."
                    value={wordForm.en}
                    onChange={handleENChange}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '10px', border: '2px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>Chủ đề:</label>
                  <select
                    value={wordForm.theme}
                    onChange={(e) => setWordForm({ ...wordForm, theme: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '10px', border: '2px solid #cbd5e1', fontSize: '14px', outline: 'none', background: '#ffffff' }}
                  >
                    <option value="Động vật">🐾 Động vật</option>
                    <option value="Trái cây">🍎 Trái cây</option>
                    <option value="Phương tiện">🚗 Phương tiện</option>
                    <option value="Đồ dùng">🎒 Đồ dùng</option>
                    <option value="Thiên nhiên">☀️ Thiên nhiên</option>
                    <option value="Khác">✨ Khác</option>
                  </select>
                </div>

                {/* Emoji Auto Box */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <label style={{ fontSize: '13px', fontWeight: 800, color: '#334155' }}>Biểu tượng Icon:</label>
                    {isAutoEmoji && (
                      <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        <Sparkles size={12} /> Tự động khớp!
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <div style={{
                      fontSize: '26px',
                      width: '46px',
                      height: '42px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: isAutoEmoji ? '#ecfdf5' : '#f8fafc',
                      border: isAutoEmoji ? '2px solid #34d399' : '2px solid #cbd5e1',
                      borderRadius: '10px'
                    }}>
                      {wordForm.emoji}
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="btn-kid btn-yellow"
                      style={{ padding: '8px 12px', fontSize: '12px' }}
                    >
                      <Smile size={14} />
                      <span>{showEmojiPicker ? 'Đóng' : 'Tìm Thêm Icon'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {showEmojiPicker && (
                <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
                  <EmojiPicker
                    onEmojiClick={(data) => {
                      setWordForm({ ...wordForm, emoji: data.emoji });
                      setShowEmojiPicker(false);
                    }}
                    searchPlaceHolder="Tìm kiếm icon..."
                    width={360}
                    height={320}
                  />
                </div>
              )}

              <button type="submit" className="btn-kid btn-green" style={{ padding: '10px 24px', fontSize: '14px' }}>
                <Plus size={16} />
                <span>Thêm Từ Vựng Này</span>
              </button>
            </form>
          </div>

          {/* Active Word Table Grid */}
          <div className="kid-card" style={{ padding: '24px', background: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 800, color: '#1e293b', margin: 0 }}>
                  Bảng Dữ Liệu Từ Vựng & Ngôn Ngữ
                </h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  Hiển thị {filteredWords.length} / {words.length} từ vựng {totalVocabPages > 1 && `(Trang ${vocabPage}/${totalVocabPages})`}
                </span>
              </div>

              {/* Search & Theme Filter Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    placeholder="Tìm kiếm từ vựng..."
                    value={vocabSearch}
                    onChange={(e) => setVocabSearch(e.target.value)}
                    style={{
                      padding: '6px 12px 6px 30px',
                      borderRadius: '10px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '13px',
                      outline: 'none',
                      width: '180px'
                    }}
                  />
                </div>

                <select
                  value={vocabThemeFilter}
                  onChange={(e) => setVocabThemeFilter(e.target.value)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '13px',
                    background: '#ffffff',
                    outline: 'none'
                  }}
                >
                  <option value="all">Tất cả chủ đề</option>
                  <option value="Động vật">🐾 Động vật</option>
                  <option value="Trái cây">🍎 Trái cây</option>
                  <option value="Phương tiện">🚗 Phương tiện</option>
                  <option value="Đồ dùng">🎒 Đồ dùng</option>
                  <option value="Thiên nhiên">☀️ Thiên nhiên</option>
                  <option value="Khác">✨ Khác</option>
                </select>
              </div>
            </div>

            <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '14px', WebkitOverflowScrolling: 'touch' }}>
              <table style={{ width: '100%', minWidth: '720px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ padding: '12px 14px', fontWeight: 800, color: '#475569', width: '50px', whiteSpace: 'nowrap' }}>STT</th>
                    <th style={{ padding: '12px 14px', fontWeight: 800, color: '#475569', width: '70px', textAlign: 'center', whiteSpace: 'nowrap' }}>Icon</th>
                    <th style={{ padding: '12px 14px', fontWeight: 800, color: '#475569', minWidth: '140px', whiteSpace: 'nowrap' }}>Tiếng Việt</th>
                    <th style={{ padding: '12px 14px', fontWeight: 800, color: '#475569', minWidth: '140px', whiteSpace: 'nowrap' }}>Tiếng Anh</th>
                    <th style={{ padding: '12px 14px', fontWeight: 800, color: '#475569', width: '120px', whiteSpace: 'nowrap' }}>Chủ Đề</th>
                    <th style={{ padding: '12px 14px', fontWeight: 800, color: '#475569', textAlign: 'center', width: '100px', whiteSpace: 'nowrap' }}>Phát Âm</th>
                    <th style={{ padding: '12px 14px', fontWeight: 800, color: '#475569', textAlign: 'right', width: '90px', whiteSpace: 'nowrap' }}>Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedWords.map((item, index) => (
                      <tr 
                        key={item.id || index}
                        style={{ borderBottom: '1px solid #f1f5f9' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '10px 14px', color: '#94a3b8', fontWeight: 700, whiteSpace: 'nowrap' }}>
                          {(vocabPage - 1) * ITEMS_PER_PAGE + index + 1}
                        </td>
                        <td style={{ padding: '10px 14px', textAlign: 'center', fontSize: '24px', whiteSpace: 'nowrap' }}>
                          <span style={{ display: 'inline-block', width: '38px', height: '38px', lineHeight: '38px', background: '#f1f5f9', borderRadius: '10px' }}>
                            {item.emoji}
                          </span>
                        </td>
                        <td style={{ padding: '10px 14px', fontWeight: 800, color: '#1e293b', fontSize: '14px', whiteSpace: 'nowrap' }}>
                          {item.vn}
                        </td>
                        <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0284c7', fontSize: '14px', whiteSpace: 'nowrap' }}>
                          {item.en}
                        </td>
                        <td style={{ padding: '10px 14px', whiteSpace: 'nowrap' }}>
                          <span style={{ 
                            background: '#f1f5f9', 
                            color: '#475569', 
                            padding: '4px 10px', 
                            borderRadius: '8px', 
                            fontSize: '11.5px', 
                            fontWeight: 800,
                            whiteSpace: 'nowrap',
                            display: 'inline-block'
                          }}>
                            {item.theme}
                          </span>
                        </td>
                        <td style={{ padding: '10px 14px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                          <button
                            type="button"
                            onClick={() => sounds.speak(item.vn, 'vi-VN')}
                            title="Nghe phát âm"
                            style={{
                              background: '#fdf2f8',
                              border: '1px solid #fbcfe8',
                              borderRadius: '8px',
                              padding: '6px 10px',
                              cursor: 'pointer',
                              color: '#db2777',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            <Volume2 size={14} />
                            <span style={{ fontSize: '11px', fontWeight: 700 }}>Nghe</span>
                          </button>
                        </td>
                        <td style={{ padding: '10px 14px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                          <button
                            type="button"
                            onClick={() => handleDeleteWord(item.id, item.vn)}
                            title="Xóa từ này"
                            style={{
                              background: '#fee2e2',
                              border: '1px solid #fecaca',
                              borderRadius: '8px',
                              padding: '6px 10px',
                              cursor: 'pointer',
                              color: '#ef4444',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            <Trash2 size={14} />
                            <span style={{ fontSize: '11px', fontWeight: 700 }}>Xóa</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  {pagedWords.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{ padding: '30px', textAlign: 'center', color: '#94a3b8' }}>
                        Không tìm thấy từ vựng nào phù hợp với bộ lọc!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <PaginationControl
              currentPage={vocabPage}
              totalPages={totalVocabPages}
              onPageChange={setVocabPage}
              totalItems={filteredWords.length}
              pageSize={ITEMS_PER_PAGE}
            />
          </div>
        </div>
      )}

      {/* ===================== TAB 3: TOÁN HỌC (MATH FARM) ===================== */}
      {activeTab === 'math' && (
        <div className="animate-pop-in">
          {/* Add Math Question Form */}
          <div className="kid-card" style={{ padding: '24px', background: '#ffffff', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Calculator size={20} color="#d97706" />
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 800, color: '#1e293b', margin: 0 }}>
                Thêm Câu Hỏi Toán Mới Vào Game
              </h3>
            </div>

            <form onSubmit={handleAddMath}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>Loại bài toán:</label>
                  <select
                    value={mathForm.type}
                    onChange={(e) => setMathForm({ ...mathForm, type: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '10px', border: '2px solid #cbd5e1', fontSize: '14px', outline: 'none', background: '#ffffff' }}
                  >
                    <option value="count">🔢 Đếm số lượng đồ vật</option>
                    <option value="addition">➕ Phép cộng hình ảnh trực quan</option>
                    <option value="compare">⚖️ So sánh lớn hơn / bé hơn</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>Tiêu đề:</label>
                  <input
                    type="text"
                    placeholder="Vd: Đếm Số Quả Táo, Phép Cộng Kẹo..."
                    value={mathForm.title}
                    onChange={(e) => setMathForm({ ...mathForm, title: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '10px', border: '2px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>Icon Đồ Vật (Emoji):</label>
                  <input
                    type="text"
                    placeholder="Vd: 🍎, 🍓, 🍌, 🐝, 🍬..."
                    value={mathForm.itemEmoji}
                    onChange={(e) => setMathForm({ ...mathForm, itemEmoji: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '10px', border: '2px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>Câu hỏi (Tiếng Việt):</label>
                  <input
                    type="text"
                    placeholder="Vd: Bé hãy đếm xem có bao nhiêu quả táo?"
                    value={mathForm.promptVN}
                    onChange={(e) => setMathForm({ ...mathForm, promptVN: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '10px', border: '2px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                  />
                </div>

                {mathForm.type === 'count' && (
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>Số lượng mục tiêu:</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={mathForm.targetCount}
                      onChange={(e) => setMathForm({ ...mathForm, targetCount: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '10px', border: '2px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                    />
                  </div>
                )}

                {mathForm.type === 'addition' && (
                  <>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>Số thứ nhất:</label>
                      <input
                        type="number"
                        min="1"
                        max="9"
                        value={mathForm.num1}
                        onChange={(e) => setMathForm({ ...mathForm, num1: e.target.value })}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '10px', border: '2px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>Số thứ hai:</label>
                      <input
                        type="number"
                        min="1"
                        max="9"
                        value={mathForm.num2}
                        onChange={(e) => setMathForm({ ...mathForm, num2: e.target.value })}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '10px', border: '2px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                      />
                    </div>
                  </>
                )}

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>Các lựa chọn (cách nhau dấu phẩy):</label>
                  <input
                    type="text"
                    placeholder="Vd: 2, 3, 4, 5"
                    value={mathForm.options}
                    onChange={(e) => setMathForm({ ...mathForm, options: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '10px', border: '2px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>Đáp án đúng:</label>
                  <input
                    type="text"
                    placeholder="Vd: 4"
                    value={mathForm.answer}
                    onChange={(e) => setMathForm({ ...mathForm, answer: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '10px', border: '2px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                  />
                </div>
              </div>

              <button type="submit" className="btn-kid btn-yellow" style={{ padding: '10px 24px', fontSize: '14px' }}>
                <Plus size={16} />
                <span>Thêm Câu Hỏi Toán Học</span>
              </button>
            </form>
          </div>

          {/* Active Math Question Table Grid */}
          <div className="kid-card" style={{ padding: '24px', background: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 800, color: '#1e293b', margin: 0 }}>
                  Bảng Dữ Liệu Câu Hỏi Toán Học
                </h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  Hiển thị {filteredMath.length} / {mathLevels.length} câu hỏi {totalMathPages > 1 && `(Trang ${mathPage}/${totalMathPages})`}
                </span>
              </div>

              {/* Search & Type Filter Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    placeholder="Tìm kiếm bài toán..."
                    value={mathSearch}
                    onChange={(e) => setMathSearch(e.target.value)}
                    style={{
                      padding: '6px 12px 6px 30px',
                      borderRadius: '10px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '13px',
                      outline: 'none',
                      width: '180px'
                    }}
                  />
                </div>

                <select
                  value={mathTypeFilter}
                  onChange={(e) => setMathTypeFilter(e.target.value)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '13px',
                    background: '#ffffff',
                    outline: 'none'
                  }}
                >
                  <option value="all">Tất cả dạng toán</option>
                  <option value="count">🔢 Đếm số lượng đồ vật</option>
                  <option value="addition">➕ Phép cộng hình ảnh</option>
                  <option value="compare">⚖️ So sánh lớn / bé</option>
                </select>
              </div>
            </div>

            <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '14px', WebkitOverflowScrolling: 'touch' }}>
              <table style={{ width: '100%', minWidth: '760px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ padding: '12px 14px', fontWeight: 800, color: '#475569', width: '50px', whiteSpace: 'nowrap' }}>STT</th>
                    <th style={{ padding: '12px 14px', fontWeight: 800, color: '#475569', width: '130px', whiteSpace: 'nowrap' }}>Dạng Bài</th>
                    <th style={{ padding: '12px 14px', fontWeight: 800, color: '#475569', width: '60px', textAlign: 'center', whiteSpace: 'nowrap' }}>Icon</th>
                    <th style={{ padding: '12px 14px', fontWeight: 800, color: '#475569', minWidth: '130px', whiteSpace: 'nowrap' }}>Tiêu Đề</th>
                    <th style={{ padding: '12px 14px', fontWeight: 800, color: '#475569', minWidth: '200px' }}>Nội Dung Đề Bài</th>
                    <th style={{ padding: '12px 14px', fontWeight: 800, color: '#475569', textAlign: 'center', width: '120px', whiteSpace: 'nowrap' }}>Đáp Án Đúng</th>
                    <th style={{ padding: '12px 14px', fontWeight: 800, color: '#475569', textAlign: 'right', width: '90px', whiteSpace: 'nowrap' }}>Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedMath.map((item, index) => (
                      <tr 
                        key={item.id || index}
                        style={{ borderBottom: '1px solid #f1f5f9' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '10px 14px', color: '#94a3b8', fontWeight: 700, whiteSpace: 'nowrap' }}>
                          {(mathPage - 1) * ITEMS_PER_PAGE + index + 1}
                        </td>
                        <td style={{ padding: '10px 14px', whiteSpace: 'nowrap' }}>
                          <span style={{
                            background: item.type === 'count' ? '#fef3c7' : item.type === 'addition' ? '#ecfdf5' : '#ede9fe',
                            color: item.type === 'count' ? '#92400e' : item.type === 'addition' ? '#065f46' : '#5b21b6',
                            padding: '4px 10px',
                            borderRadius: '8px',
                            fontSize: '11.5px',
                            fontWeight: 800,
                            whiteSpace: 'nowrap',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            {item.type === 'count' ? '🔢 Đếm số' : item.type === 'addition' ? '➕ Phép cộng' : '⚖️ So sánh'}
                          </span>
                        </td>
                        <td style={{ padding: '10px 14px', textAlign: 'center', fontSize: '22px', whiteSpace: 'nowrap' }}>
                          {item.itemEmoji || '🍎'}
                        </td>
                        <td style={{ padding: '10px 14px', fontWeight: 800, color: '#1e293b' }}>
                          {item.title}
                        </td>
                        <td style={{ padding: '10px 14px', color: '#475569', fontSize: '13px', lineHeight: 1.4 }}>
                          {item.promptVN}
                        </td>
                        <td style={{ padding: '10px 14px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                          <span style={{ 
                            background: '#ecfdf5', 
                            color: '#047857', 
                            border: '1px solid #a7f3d0', 
                            padding: '4px 12px', 
                            borderRadius: '8px', 
                            fontWeight: 800, 
                            fontSize: '13px',
                            whiteSpace: 'nowrap',
                            display: 'inline-block'
                          }}>
                            {String(item.answer)}
                          </span>
                        </td>
                        <td style={{ padding: '10px 14px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                          <button
                            type="button"
                            onClick={() => handleDeleteMath(item.id)}
                            title="Xóa câu hỏi này"
                            style={{
                              background: '#fee2e2',
                              border: '1px solid #fecaca',
                              borderRadius: '8px',
                              padding: '6px 10px',
                              cursor: 'pointer',
                              color: '#ef4444',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            <Trash2 size={14} />
                            <span style={{ fontSize: '11px', fontWeight: 700 }}>Xóa</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  {pagedMath.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{ padding: '30px', textAlign: 'center', color: '#94a3b8' }}>
                        Không tìm thấy câu hỏi Toán nào phù hợp với bộ lọc!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <PaginationControl
              currentPage={mathPage}
              totalPages={totalMathPages}
              onPageChange={setMathPage}
              totalItems={filteredMath.length}
              pageSize={ITEMS_PER_PAGE}
            />
          </div>
        </div>
      )}

      {/* ===================== TAB 4: TƯ DUY & LOGIC ===================== */}
      {activeTab === 'logic' && (
        <div className="animate-pop-in">
          {/* Add Logic Form */}
          <div className="kid-card" style={{ padding: '24px', background: '#ffffff', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Brain size={20} color="#7c3aed" />
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 800, color: '#1e293b', margin: 0 }}>
                Thêm Câu Đố Tư Duy Logic Mới
              </h3>
            </div>

            <form onSubmit={handleAddLogic}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>Loại câu đố:</label>
                  <select
                    value={logicForm.type}
                    onChange={(e) => setLogicForm({ ...logicForm, type: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '10px', border: '2px solid #cbd5e1', fontSize: '14px', outline: 'none', background: '#ffffff' }}
                  >
                    <option value="pattern">🔄 Dãy quy luật hình ảnh</option>
                    <option value="odd_one_out">🔍 Tìm đồ vật khác biệt</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>Tiêu đề:</label>
                  <input
                    type="text"
                    placeholder="Vd: Quy Luật Màu Sắc, Quy Luật Trái Cây..."
                    value={logicForm.title}
                    onChange={(e) => setLogicForm({ ...logicForm, title: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '10px', border: '2px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>Câu hỏi:</label>
                  <input
                    type="text"
                    placeholder="Vd: Hình tiếp theo trong chuỗi là hình gì bé ơi?"
                    value={logicForm.promptVN}
                    onChange={(e) => setLogicForm({ ...logicForm, promptVN: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '10px', border: '2px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>Dãy chuỗi (cách nhau dấu phẩy):</label>
                  <input
                    type="text"
                    placeholder="Vd: 🔴, 🟡, 🔴, 🟡, 🔴"
                    value={logicForm.sequence}
                    onChange={(e) => setLogicForm({ ...logicForm, sequence: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '10px', border: '2px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>Các lựa chọn:</label>
                  <input
                    type="text"
                    placeholder="Vd: 🟡, 🔴, 🟢, 🔵"
                    value={logicForm.options}
                    onChange={(e) => setLogicForm({ ...logicForm, options: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '10px', border: '2px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>Đáp án đúng:</label>
                  <input
                    type="text"
                    placeholder="Vd: 🟡"
                    value={logicForm.answer}
                    onChange={(e) => setLogicForm({ ...logicForm, answer: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '10px', border: '2px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                  />
                </div>
              </div>

              <button type="submit" className="btn-kid btn-purple" style={{ padding: '10px 24px', fontSize: '14px' }}>
                <Plus size={16} />
                <span>Thêm Câu Đố Logic</span>
              </button>
            </form>
          </div>

          {/* Active Logic Question Table Grid */}
          <div className="kid-card" style={{ padding: '24px', background: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 800, color: '#1e293b', margin: 0 }}>
                  Bảng Dữ Liệu Câu Đố Tư Duy Logic
                </h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  Hiển thị {filteredLogic.length} / {logicLevels.length} câu đố {totalLogicPages > 1 && `(Trang ${logicPage}/${totalLogicPages})`}
                </span>
              </div>

              {/* Search & Type Filter Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    placeholder="Tìm câu đố logic..."
                    value={logicSearch}
                    onChange={(e) => setLogicSearch(e.target.value)}
                    style={{
                      padding: '6px 12px 6px 30px',
                      borderRadius: '10px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '13px',
                      outline: 'none',
                      width: '180px'
                    }}
                  />
                </div>

                <select
                  value={logicTypeFilter}
                  onChange={(e) => setLogicTypeFilter(e.target.value)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '13px',
                    background: '#ffffff',
                    outline: 'none'
                  }}
                >
                  <option value="all">Tất cả thể loại</option>
                  <option value="pattern">🔄 Dãy quy luật hình ảnh</option>
                  <option value="odd_one_out">🔍 Tìm đồ vật khác biệt</option>
                </select>
              </div>
            </div>

            <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '14px', WebkitOverflowScrolling: 'touch' }}>
              <table style={{ width: '100%', minWidth: '760px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ padding: '12px 14px', fontWeight: 800, color: '#475569', width: '50px', whiteSpace: 'nowrap' }}>STT</th>
                    <th style={{ padding: '12px 14px', fontWeight: 800, color: '#475569', width: '130px', whiteSpace: 'nowrap' }}>Dạng Câu Đố</th>
                    <th style={{ padding: '12px 14px', fontWeight: 800, color: '#475569', minWidth: '130px', whiteSpace: 'nowrap' }}>Tiêu Đề</th>
                    <th style={{ padding: '12px 14px', fontWeight: 800, color: '#475569', minWidth: '180px' }}>Dãy Chuỗi Biểu Tượng</th>
                    <th style={{ padding: '12px 14px', fontWeight: 800, color: '#475569', textAlign: 'center', width: '110px', whiteSpace: 'nowrap' }}>Đáp Án Đúng</th>
                    <th style={{ padding: '12px 14px', fontWeight: 800, color: '#475569', minWidth: '150px' }}>Gợi Ý</th>
                    <th style={{ padding: '12px 14px', fontWeight: 800, color: '#475569', textAlign: 'right', width: '90px', whiteSpace: 'nowrap' }}>Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedLogic.map((item, index) => (
                      <tr 
                        key={item.id || index}
                        style={{ borderBottom: '1px solid #f1f5f9' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '10px 14px', color: '#94a3b8', fontWeight: 700, whiteSpace: 'nowrap' }}>
                          {(logicPage - 1) * ITEMS_PER_PAGE + index + 1}
                        </td>
                        <td style={{ padding: '10px 14px', whiteSpace: 'nowrap' }}>
                          <span style={{
                            background: item.type === 'pattern' ? '#faf5ff' : '#f0fdfa',
                            color: item.type === 'pattern' ? '#6b21a8' : '#0f766e',
                            padding: '4px 10px',
                            borderRadius: '8px',
                            fontSize: '11.5px',
                            fontWeight: 800,
                            border: item.type === 'pattern' ? '1px solid #e9d5ff' : '1px solid #ccfbf1',
                            whiteSpace: 'nowrap',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            {item.type === 'pattern' ? '🔄 Quy luật' : '🔍 Khác biệt'}
                          </span>
                        </td>
                        <td style={{ padding: '10px 14px', fontWeight: 800, color: '#1e293b' }}>
                          {item.title}
                        </td>
                        <td style={{ padding: '10px 14px', whiteSpace: 'nowrap' }}>
                          {item.sequence && (
                            <span style={{ fontSize: '15px', background: '#f8fafc', padding: '4px 8px', borderRadius: '8px', border: '1px solid #e2e8f0', letterSpacing: '2px', display: 'inline-block' }}>
                              {Array.isArray(item.sequence) ? item.sequence.join(' ') : item.sequence} ❓
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '10px 14px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                          <span style={{ 
                            background: '#ecfdf5', 
                            color: '#047857', 
                            border: '1px solid #a7f3d0', 
                            padding: '4px 12px', 
                            borderRadius: '8px', 
                            fontWeight: 900, 
                            fontSize: '15px',
                            whiteSpace: 'nowrap',
                            display: 'inline-block'
                          }}>
                            {item.answer}
                          </span>
                        </td>
                        <td style={{ padding: '10px 14px', color: '#64748b', fontSize: '12.5px', lineHeight: 1.4 }}>
                          {item.hint || item.promptVN}
                        </td>
                        <td style={{ padding: '10px 14px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                          <button
                            type="button"
                            onClick={() => handleDeleteLogic(item.id)}
                            title="Xóa câu đố này"
                            style={{
                              background: '#fee2e2',
                              border: '1px solid #fecaca',
                              borderRadius: '8px',
                              padding: '6px 10px',
                              cursor: 'pointer',
                              color: '#ef4444',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            <Trash2 size={14} />
                            <span style={{ fontSize: '11px', fontWeight: 700 }}>Xóa</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  {pagedLogic.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{ padding: '30px', textAlign: 'center', color: '#94a3b8' }}>
                        Không tìm thấy câu đố Logic nào phù hợp với bộ lọc!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <PaginationControl
              currentPage={logicPage}
              totalPages={totalLogicPages}
              onPageChange={setLogicPage}
              totalItems={filteredLogic.length}
              pageSize={ITEMS_PER_PAGE}
            />
          </div>
        </div>
      )}

      {/* ===================== TAB 5: THÚ CƯNG & CỬA HÀNG ===================== */}
      {activeTab === 'pet' && (
        <div className="animate-pop-in">
          {/* Pets Management */}
          <div className="kid-card" style={{ padding: '24px', background: '#ffffff', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Dog size={20} color="#db2777" />
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 800, color: '#1e293b', margin: 0 }}>
                Quản Lý Thú Cưng Bé Nuôi ({pets.length})
              </h3>
            </div>

            <form onSubmit={handleAddPet} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>Tên thú cưng:</label>
                <input
                  type="text"
                  placeholder="Vd: Thỏ Ngọc"
                  value={petForm.name}
                  onChange={(e) => setPetForm({ ...petForm, name: e.target.value })}
                  style={{ padding: '8px 12px', borderRadius: '10px', border: '2px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>Biểu tượng Emoji:</label>
                <input
                  type="text"
                  placeholder="Vd: 🐰, 🐼, 🦁..."
                  value={petForm.emoji}
                  onChange={(e) => setPetForm({ ...petForm, emoji: e.target.value })}
                  style={{ width: '80px', padding: '8px 12px', borderRadius: '10px', border: '2px solid #cbd5e1', fontSize: '14px', outline: 'none', textAlign: 'center' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>Tiếng kêu:</label>
                <input
                  type="text"
                  placeholder="Vd: Khịt khịt!"
                  value={petForm.sound}
                  onChange={(e) => setPetForm({ ...petForm, sound: e.target.value })}
                  style={{ padding: '8px 12px', borderRadius: '10px', border: '2px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                />
              </div>

              <button type="submit" className="btn-kid btn-pink" style={{ padding: '9px 18px', fontSize: '13px' }}>
                <Plus size={15} />
                <span>Thêm Thú Cưng</span>
              </button>
            </form>

            <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '14px', WebkitOverflowScrolling: 'touch' }}>
              <table style={{ width: '100%', minWidth: '560px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ padding: '12px 14px', fontWeight: 800, color: '#475569', width: '50px', whiteSpace: 'nowrap' }}>STT</th>
                    <th style={{ padding: '12px 14px', fontWeight: 800, color: '#475569', width: '70px', textAlign: 'center', whiteSpace: 'nowrap' }}>Icon</th>
                    <th style={{ padding: '12px 14px', fontWeight: 800, color: '#475569', minWidth: '130px', whiteSpace: 'nowrap' }}>Tên Thú Cưng</th>
                    <th style={{ padding: '12px 14px', fontWeight: 800, color: '#475569', minWidth: '130px', whiteSpace: 'nowrap' }}>Tiếng Kêu</th>
                    <th style={{ padding: '12px 14px', fontWeight: 800, color: '#475569', textAlign: 'right', width: '90px', whiteSpace: 'nowrap' }}>Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  {pets.map((p, index) => (
                    <tr key={p.id || index} style={{ borderBottom: '1px solid #f1f5f9' }} onMouseEnter={(e) => e.currentTarget.style.background = '#fdf2f8'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '10px 14px', color: '#94a3b8', fontWeight: 700, whiteSpace: 'nowrap' }}>{index + 1}</td>
                      <td style={{ padding: '10px 14px', textAlign: 'center', fontSize: '26px', whiteSpace: 'nowrap' }}>{p.emoji}</td>
                      <td style={{ padding: '10px 14px', fontWeight: 800, color: '#9d174d', fontSize: '14px', whiteSpace: 'nowrap' }}>{p.name}</td>
                      <td style={{ padding: '10px 14px', color: '#db2777', fontWeight: 700, whiteSpace: 'nowrap' }}>"{p.sound}"</td>
                      <td style={{ padding: '10px 14px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <button type="button" onClick={() => handleDeletePet(p.id)} title="Xóa thú cưng" style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', color: '#ef4444', display: 'inline-flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
                          <Trash2 size={14} />
                          <span style={{ fontSize: '11px', fontWeight: 700 }}>Xóa</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Shop Items Management */}
          <div className="kid-card" style={{ padding: '24px', background: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <ShoppingBag size={20} color="#ca8a04" />
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 800, color: '#1e293b', margin: 0 }}>
                Quản Lý Quà Tặng & Cửa Hàng ({shopItems.length})
              </h3>
            </div>

            <form onSubmit={handleAddShop} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>Tên món quà:</label>
                <input
                  type="text"
                  placeholder="Vd: Bánh Donut"
                  value={shopForm.name}
                  onChange={(e) => setShopForm({ ...shopForm, name: e.target.value })}
                  style={{ padding: '8px 12px', borderRadius: '10px', border: '2px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>Loại:</label>
                <select
                  value={shopForm.type}
                  onChange={(e) => setShopForm({ ...shopForm, type: e.target.value })}
                  style={{ padding: '8px 12px', borderRadius: '10px', border: '2px solid #cbd5e1', fontSize: '14px', outline: 'none', background: '#ffffff' }}
                >
                  <option value="food">🍲 Thức ăn</option>
                  <option value="hat">👑 Mũ & Trang phục</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>Emoji:</label>
                <input
                  type="text"
                  placeholder="🍩"
                  value={shopForm.emoji}
                  onChange={(e) => setShopForm({ ...shopForm, emoji: e.target.value })}
                  style={{ width: '70px', padding: '8px 12px', borderRadius: '10px', border: '2px solid #cbd5e1', fontSize: '14px', outline: 'none', textAlign: 'center' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>Giá Xu:</label>
                <input
                  type="number"
                  min="1"
                  value={shopForm.price}
                  onChange={(e) => setShopForm({ ...shopForm, price: e.target.value })}
                  style={{ width: '80px', padding: '8px 12px', borderRadius: '10px', border: '2px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                />
              </div>

              <button type="submit" className="btn-kid btn-yellow" style={{ padding: '9px 18px', fontSize: '13px' }}>
                <Plus size={15} />
                <span>Thêm Món Quà</span>
              </button>
            </form>

            <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '14px', WebkitOverflowScrolling: 'touch' }}>
              <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ padding: '12px 14px', fontWeight: 800, color: '#475569', width: '50px', whiteSpace: 'nowrap' }}>STT</th>
                    <th style={{ padding: '12px 14px', fontWeight: 800, color: '#475569', width: '70px', textAlign: 'center', whiteSpace: 'nowrap' }}>Icon</th>
                    <th style={{ padding: '12px 14px', fontWeight: 800, color: '#475569', minWidth: '130px', whiteSpace: 'nowrap' }}>Tên Món Quà</th>
                    <th style={{ padding: '12px 14px', fontWeight: 800, color: '#475569', width: '130px', whiteSpace: 'nowrap' }}>Phân Loại</th>
                    <th style={{ padding: '12px 14px', fontWeight: 800, color: '#475569', textAlign: 'center', width: '120px', whiteSpace: 'nowrap' }}>Giá Bán (Xu 🪙)</th>
                    <th style={{ padding: '12px 14px', fontWeight: 800, color: '#475569', textAlign: 'right', width: '90px', whiteSpace: 'nowrap' }}>Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  {shopItems.map((item, index) => (
                    <tr key={item.id || index} style={{ borderBottom: '1px solid #f1f5f9' }} onMouseEnter={(e) => e.currentTarget.style.background = '#fefce8'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '10px 14px', color: '#94a3b8', fontWeight: 700, whiteSpace: 'nowrap' }}>{index + 1}</td>
                      <td style={{ padding: '10px 14px', textAlign: 'center', fontSize: '24px', whiteSpace: 'nowrap' }}>{item.emoji}</td>
                      <td style={{ padding: '10px 14px', fontWeight: 800, color: '#1e293b', fontSize: '14px', whiteSpace: 'nowrap' }}>{item.name}</td>
                      <td style={{ padding: '10px 14px', whiteSpace: 'nowrap' }}>
                        <span style={{ 
                          background: item.type === 'food' ? '#ffedd5' : '#f3e8ff', 
                          color: item.type === 'food' ? '#c2410c' : '#7e22ce', 
                          padding: '4px 10px', 
                          borderRadius: '8px', 
                          fontSize: '11.5px', 
                          fontWeight: 800,
                          whiteSpace: 'nowrap',
                          display: 'inline-block'
                        }}>
                          {item.type === 'food' ? '🍲 Thức ăn' : '👑 Mũ & Trang phục'}
                        </span>
                      </td>
                      <td style={{ padding: '10px 14px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                        <span style={{ background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', padding: '4px 12px', borderRadius: '8px', fontWeight: 800, fontSize: '13px', whiteSpace: 'nowrap', display: 'inline-block' }}>
                          {item.price} Xu 🪙
                        </span>
                      </td>
                      <td style={{ padding: '10px 14px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <button type="button" onClick={() => handleDeleteShop(item.id)} title="Xóa món quà" style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', color: '#ef4444', display: 'inline-flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
                          <Trash2 size={14} />
                          <span style={{ fontSize: '11px', fontWeight: 700 }}>Xóa</span>
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

      {/* ===================== TAB 6: HỒ SƠ BÉ & TIẾN ĐỘ ===================== */}
      {activeTab === 'player' && (
        <div className="animate-pop-in">
          {/* SECTION 1: BẢNG DỮ LIỆU NGƯỜI DÙNG & HỌC SINH (SUPABASE TABLE GRID) */}
          <div className="kid-card" style={{ padding: '24px', background: '#ffffff', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={22} color="#0284c7" />
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 800, color: '#1e293b', margin: 0 }}>
                    Bảng Dữ Liệu Học Sinh & Người Dùng (Bảng public.players)
                  </h3>
                </div>
                <p style={{ color: '#64748b', fontSize: '12px', margin: '4px 0 0' }}>
                  Hồ sơ cá nhân, ngày sinh, địa chỉ, số điện thoại, sở thích và tiến độ học tập đồng bộ trực tiếp từ Supabase Database.
                </p>
              </div>

              {/* Search & Refresh */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    placeholder="Tìm theo tên, email, SĐT, UID..."
                    value={userSearchTerm}
                    onChange={(e) => setUserSearchTerm(e.target.value)}
                    style={{
                      padding: '6px 12px 6px 30px',
                      borderRadius: '10px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '13px',
                      outline: 'none',
                      width: '230px'
                    }}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => { sounds.playClick(); fetchCloudUserData(); }}
                  disabled={isLoadingUsers}
                  className="btn-kid btn-blue"
                  style={{ padding: '6px 14px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <RefreshCw size={13} className={isLoadingUsers ? 'animate-spin' : ''} />
                  <span>{isLoadingUsers ? 'Đang nạp...' : 'Làm mới'}</span>
                </button>
              </div>
            </div>

            {/* Filter Tabs & Badges */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => { sounds.playClick(); setUserRoleFilter('student'); }}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '999px',
                    fontSize: '12px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    border: userRoleFilter === 'student' ? '2px solid #0284c7' : '1.5px solid #cbd5e1',
                    background: userRoleFilter === 'student' ? '#e0f2fe' : '#ffffff',
                    color: userRoleFilter === 'student' ? '#0369a1' : '#64748b',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.15s'
                  }}
                >
                  <span>👶 Chỉ Học Sinh</span>
                  <span style={{
                    background: userRoleFilter === 'student' ? '#0284c7' : '#e2e8f0',
                    color: userRoleFilter === 'student' ? '#ffffff' : '#64748b',
                    borderRadius: '999px',
                    padding: '1px 7px',
                    fontSize: '11px',
                    fontWeight: 800
                  }}>
                    {studentUsers.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => { sounds.playClick(); setUserRoleFilter('admin'); }}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '999px',
                    fontSize: '12px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    border: userRoleFilter === 'admin' ? '2px solid #ef4444' : '1.5px solid #cbd5e1',
                    background: userRoleFilter === 'admin' ? '#fef2f2' : '#ffffff',
                    color: userRoleFilter === 'admin' ? '#b91c1c' : '#64748b',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.15s'
                  }}
                >
                  <span>👑 Quản Trị Viên (Admin)</span>
                  <span style={{
                    background: userRoleFilter === 'admin' ? '#ef4444' : '#e2e8f0',
                    color: userRoleFilter === 'admin' ? '#ffffff' : '#64748b',
                    borderRadius: '999px',
                    padding: '1px 7px',
                    fontSize: '11px',
                    fontWeight: 800
                  }}>
                    {adminUsers.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => { sounds.playClick(); setUserRoleFilter('all'); }}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '999px',
                    fontSize: '12px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    border: userRoleFilter === 'all' ? '2px solid #8b5cf6' : '1.5px solid #cbd5e1',
                    background: userRoleFilter === 'all' ? '#f5f3ff' : '#ffffff',
                    color: userRoleFilter === 'all' ? '#6d28d9' : '#64748b',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.15s'
                  }}
                >
                  <span>🌐 Tất Cả Tài Khoản</span>
                  <span style={{
                    background: userRoleFilter === 'all' ? '#8b5cf6' : '#e2e8f0',
                    color: userRoleFilter === 'all' ? '#ffffff' : '#64748b',
                    borderRadius: '999px',
                    padding: '1px 7px',
                    fontSize: '11px',
                    fontWeight: 800
                  }}>
                    {cloudUsers.length}
                  </span>
                </button>
              </div>

              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
                {userRoleFilter === 'student' && `Đang hiển thị ${studentUsers.length} bé (đã lọc ${adminUsers.length} admin)`}
                {userRoleFilter === 'admin' && `Đang hiển thị ${adminUsers.length} tài khoản Quản trị viên`}
                {userRoleFilter === 'all' && `Hiển thị toàn bộ ${cloudUsers.length} tài khoản`}
              </div>
            </div>

            {/* Thông báo lọc Admin tự động */}
            {userRoleFilter === 'student' && adminUsers.length > 0 && (
              <div style={{
                background: '#f0fdf4',
                border: '1.5px solid #86efac',
                borderRadius: '10px',
                padding: '8px 14px',
                marginBottom: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '8px',
                fontSize: '12px',
                color: '#15803d',
                fontWeight: 600
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>🛡️</span>
                  <span>Hệ thống đã tự động lọc <strong>{adminUsers.length} tài khoản Quản trị viên (Admin)</strong> ra khỏi danh sách học sinh.</span>
                </div>
                <button
                  type="button"
                  onClick={() => { sounds.playClick(); setUserRoleFilter('admin'); }}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #86efac',
                    color: '#15803d',
                    borderRadius: '6px',
                    padding: '3px 10px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    fontSize: '11px'
                  }}
                >
                  Xem {adminUsers.length} Admin ➔
                </button>
              </div>
            )}

            {/* Table Grid */}
            <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '14px', WebkitOverflowScrolling: 'touch' }}>
              <table style={{ width: '100%', minWidth: '960px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ padding: '12px 14px', fontWeight: 800, color: '#475569', width: '45px', whiteSpace: 'nowrap' }}>STT</th>
                    <th style={{ padding: '12px 14px', fontWeight: 800, color: '#475569', minWidth: '150px', whiteSpace: 'nowrap' }}>Bé & Học Sinh</th>
                    <th style={{ padding: '12px 14px', fontWeight: 800, color: '#475569', minWidth: '150px', whiteSpace: 'nowrap' }}>Email / Tài Khoản</th>
                    <th style={{ padding: '12px 14px', fontWeight: 800, color: '#475569', width: '130px', whiteSpace: 'nowrap' }}>Ngày Sinh (Tuổi)</th>
                    <th style={{ padding: '12px 14px', fontWeight: 800, color: '#475569', minWidth: '140px', whiteSpace: 'nowrap' }}>Địa Chỉ & SĐT</th>
                    <th style={{ padding: '12px 14px', fontWeight: 800, color: '#475569', width: '120px', whiteSpace: 'nowrap' }}>Sở Thích</th>
                    <th style={{ padding: '12px 14px', fontWeight: 800, color: '#475569', textAlign: 'center', width: '90px', whiteSpace: 'nowrap' }}>Cấp Độ</th>
                    <th style={{ padding: '12px 14px', fontWeight: 800, color: '#475569', textAlign: 'center', width: '130px', whiteSpace: 'nowrap' }}>Sao / Xu</th>
                    <th style={{ padding: '12px 14px', fontWeight: 800, color: '#475569', width: '120px', whiteSpace: 'nowrap' }}>Thú Cưng</th>
                    <th style={{ padding: '12px 14px', fontWeight: 800, color: '#475569', width: '100px', whiteSpace: 'nowrap' }}>Cập Nhật</th>
                    <th style={{ padding: '12px 14px', fontWeight: 800, color: '#475569', textAlign: 'right', width: '130px', whiteSpace: 'nowrap' }}>Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedUsers.map((u, index) => {
                      const isSelected = selectedPlayerId === u.id;
                      const calculatedAge = u.birthDate
                        ? Math.abs(new Date(Date.now() - new Date(u.birthDate).getTime()).getUTCFullYear() - 1970)
                        : null;

                      return (
                        <tr
                          key={u.id || index}
                          style={{
                            borderBottom: '1px solid #f1f5f9',
                            background: isSelected ? '#eff6ff' : 'transparent',
                            transition: 'all 0.15s'
                          }}
                          onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = '#f8fafc'; }}
                          onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
                        >
                          <td style={{ padding: '12px 14px', color: '#94a3b8', fontWeight: 700, whiteSpace: 'nowrap' }}>
                            {(userPage - 1) * ITEMS_PER_PAGE + index + 1}
                          </td>
                          
                          {/* Bé & Học Sinh */}
                          <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              {u.avatarUrl ? (
                                <img
                                  src={u.avatarUrl}
                                  alt=""
                                  style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e0f2fe', border: '1.5px solid #38bdf8' }}
                                />
                              ) : (
                                <span style={{ fontSize: '22px' }}>🧒</span>
                              )}
                              <div>
                                <div style={{ fontWeight: 800, color: '#1e293b', fontSize: '13px' }}>
                                  {u.name || 'Bé Thám Hiểm'}
                                </div>
                                <div style={{ fontFamily: 'monospace', fontSize: '10px', color: '#94a3b8' }} title={u.id}>
                                  {u.id ? `${u.id.slice(0, 8)}...` : 'N/A'}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Email & Role */}
                          <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                            <div style={{ fontSize: '12px', color: '#334155', fontWeight: 600 }}>
                              {u.email || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Chưa có email</span>}
                            </div>
                            {isUserAnAdmin(u) ? (
                              <span style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                👑 Admin
                              </span>
                            ) : (
                              <span style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                👶 Học sinh
                              </span>
                            )}
                          </td>

                          {/* Ngày Sinh & Tuổi */}
                          <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                            {u.birthDate ? (
                              <div>
                                <div style={{ fontWeight: 700, color: '#1e293b' }}>
                                  {new Date(u.birthDate).toLocaleDateString('vi-VN')}
                                </div>
                                {!isNaN(calculatedAge) && calculatedAge > 0 && (
                                  <div style={{ fontSize: '11px', color: '#0284c7', fontWeight: 800 }}>
                                    ({calculatedAge} tuổi)
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '11px' }}>Chưa cập nhật</span>
                            )}
                          </td>

                          {/* Địa chỉ & SĐT */}
                          <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                            {u.phone && (
                              <div style={{ fontWeight: 700, color: '#0f766e', fontSize: '12px' }}>
                                📞 {u.phone}
                              </div>
                            )}
                            {u.address ? (
                              <div style={{ color: '#64748b', fontSize: '11px', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={u.address}>
                                📍 {u.address}
                              </div>
                            ) : (
                              !u.phone && <span style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '11px' }}>—</span>
                            )}
                          </td>

                          {/* Sở thích */}
                          <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                            {u.hobby ? (
                              <span style={{ background: '#fdf2f8', color: '#db2777', border: '1px solid #fbcfe8', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, display: 'inline-block' }}>
                                🎨 {u.hobby}
                              </span>
                            ) : (
                              <span style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '11px' }}>—</span>
                            )}
                          </td>

                          {/* Cấp độ */}
                          <td style={{ padding: '12px 14px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                            <span style={{ background: '#fef08a', color: '#854d0e', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, display: 'inline-block' }}>
                              Cấp {u.level || 1}
                            </span>
                          </td>

                          {/* Sao / Xu */}
                          <td style={{ padding: '12px 14px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                            <span style={{ fontWeight: 800, color: '#ca8a04', fontSize: '13px' }}>{u.stars || 0} ⭐</span>
                            <span style={{ color: '#cbd5e1', margin: '0 4px' }}>|</span>
                            <span style={{ fontWeight: 800, color: '#d97706', fontSize: '13px' }}>{u.coins || 0} 🪙</span>
                          </td>

                          {/* Thú cưng */}
                          <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                            {u.pet ? (
                              <span style={{ fontSize: '12px', color: '#78350f', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                <span>{u.pet.emoji || '🐱'}</span>
                                <span>{u.pet.name || 'Thú cưng'}</span>
                              </span>
                            ) : (
                              <span style={{ fontSize: '11px', color: '#94a3b8' }}>Chưa chọn</span>
                            )}
                          </td>

                          {/* Cập nhật */}
                          <td style={{ padding: '12px 14px', color: '#64748b', fontSize: '11px', whiteSpace: 'nowrap' }}>
                            {u.updatedAt ? new Date(u.updatedAt).toLocaleDateString('vi-VN') : 'Mới tạo'}
                          </td>

                          {/* Thao tác */}
                          <td style={{ padding: '12px 14px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                              <button
                                type="button"
                                onClick={() => {
                                  sounds.playClick();
                                  setSelectedPlayerId(u.id);
                                  setSelectedPlayerName(u.name || 'Bé Thám Hiểm');
                                  setPlayerEdit({
                                    stars: u.stars || 5,
                                    coins: u.coins || 30,
                                    level: u.level || 1,
                                    name: u.name || 'Bé Thám Hiểm',
                                    email: u.email || '',
                                    birthDate: u.birthDate || '',
                                    address: u.address || '',
                                    phone: u.phone || '',
                                    hobby: u.hobby || '',
                                    avatarUrl: u.avatarUrl || ''
                                  });
                                  notify(`Đã chọn hồ sơ "${u.name || 'Bé Thám Hiểm'}" để chỉnh sửa!`);
                                }}
                                className={`btn-kid ${isSelected ? 'btn-green' : 'btn-blue'}`}
                                style={{ padding: '5px 10px', fontSize: '11px', whiteSpace: 'nowrap' }}
                              >
                                {isSelected ? '✓ Đang chọn' : 'Sửa'}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeletePlayer(u.id, u.name)}
                                className="btn-kid btn-red"
                                style={{ padding: '5px 8px', fontSize: '11px' }}
                                title="Xóa học sinh này khỏi cơ sở dữ liệu"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={11} style={{ padding: '36px', textAlign: 'center', color: '#64748b' }}>
                        <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔍</div>
                        <div style={{ fontWeight: 800, fontSize: '14px', color: '#334155', marginBottom: '4px' }}>
                          Không có tài khoản nào phù hợp bộ lọc
                        </div>
                        <p style={{ fontSize: '12px', margin: 0 }}>
                          {userRoleFilter === 'student'
                            ? `Đã lọc ${adminUsers.length} tài khoản Admin. Không còn học sinh nào phù hợp từ khóa tìm kiếm.`
                            : userRoleFilter === 'admin'
                            ? 'Không tìm thấy tài khoản Quản trị viên nào phù hợp từ khóa.'
                            : 'Không tìm thấy tài khoản nào trên hệ thống.'}
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <PaginationControl
              currentPage={userPage}
              totalPages={totalUserPages}
              onPageChange={setUserPage}
              totalItems={filteredUsers.length}
              pageSize={ITEMS_PER_PAGE}
            />
          </div>

          {/* SECTION 2: ĐIỀU CHỈNH HỒ SƠ & CHỈ SỐ HỌC SINH ĐƯỢC CHỌN */}
          <div className="kid-card" style={{ padding: '24px', background: '#ffffff', marginBottom: '24px', border: selectedPlayerId ? '2.5px solid #38bdf8' : '2px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={22} color="#0284c7" />
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 800, color: '#1e293b', margin: 0 }}>
                    {selectedPlayerId ? (
                      <span>Chỉnh Sửa Hồ Sơ & Chỉ Số Cho: <strong style={{ color: '#0284c7' }}>{selectedPlayerName}</strong></span>
                    ) : (
                      <span>Điều Chỉnh Chỉ Số Tiến Độ Cục Bộ (Bé Thám Hiểm)</span>
                    )}
                  </h3>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    {selectedPlayerId 
                      ? 'Dữ liệu cá nhân và chỉ số sẽ được cập nhật trực tiếp vào bảng public.players & public.game_progress trên Supabase Database'
                      : 'Chọn một học sinh từ danh sách bên trên để cập nhật thông tin hồ sơ và chỉ số trên đám mây'}
                  </div>
                </div>
              </div>

              {selectedPlayerId && (
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setSelectedPlayerId(null);
                    setSelectedPlayerName('');
                    setPlayerEdit({
                      stars: playerData.stars || 5,
                      coins: playerData.coins || 30,
                      level: playerData.level || 1,
                      name: 'Bé Thám Hiểm',
                      email: '',
                      birthDate: '',
                      address: '',
                      phone: '',
                      hobby: '',
                      avatarUrl: ''
                    });
                  }}
                  className="btn-kid"
                  style={{ padding: '4px 10px', fontSize: '11px', background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' }}
                >
                  ✕ Bỏ chọn học sinh này
                </button>
              )}
            </div>

            <form onSubmit={handleSavePlayer}>
              {/* Nếu có học sinh được chọn từ Supabase: hiển thị thêm các trường thông tin cá nhân */}
              {selectedPlayerId && (
                <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '16px', padding: '16px', marginBottom: '20px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#334155', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>📝 Thông Tin Cá Nhân (Bảng public.players)</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                        Họ và tên bé:
                      </label>
                      <input
                        type="text"
                        value={playerEdit.name}
                        onChange={(e) => setPlayerEdit({ ...playerEdit, name: e.target.value })}
                        placeholder="VD: Bé Min Min"
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                        Email tài khoản:
                      </label>
                      <input
                        type="email"
                        value={playerEdit.email}
                        onChange={(e) => setPlayerEdit({ ...playerEdit, email: e.target.value })}
                        placeholder="email@example.com"
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                        Ngày sinh của bé:
                      </label>
                      <input
                        type="date"
                        value={playerEdit.birthDate}
                        onChange={(e) => setPlayerEdit({ ...playerEdit, birthDate: e.target.value })}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                        Số điện thoại phụ huynh:
                      </label>
                      <input
                        type="tel"
                        value={playerEdit.phone}
                        onChange={(e) => setPlayerEdit({ ...playerEdit, phone: e.target.value })}
                        placeholder="0987 654 321"
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                        Địa chỉ gia đình:
                      </label>
                      <input
                        type="text"
                        value={playerEdit.address}
                        onChange={(e) => setPlayerEdit({ ...playerEdit, address: e.target.value })}
                        placeholder="Quận 1, TP. Hồ Chí Minh"
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                        Sở thích của bé:
                      </label>
                      <input
                        type="text"
                        value={playerEdit.hobby}
                        onChange={(e) => setPlayerEdit({ ...playerEdit, hobby: e.target.value })}
                        placeholder="Vẽ tranh, xem hoạt hình, xếp hình..."
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Chỉ số Game */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                <div style={{ background: '#fef9c3', border: '2px solid #fde047', borderRadius: '16px', padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, color: '#a16207', marginBottom: '8px' }}>
                    <Star size={18} />
                    <span>Số Ngôi Sao (Stars):</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={playerEdit.stars}
                    onChange={(e) => setPlayerEdit({ ...playerEdit, stars: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '2px solid #facc15', fontSize: '16px', fontWeight: 800, boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ background: '#ecfdf5', border: '2px solid #a7f3d0', borderRadius: '16px', padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, color: '#047857', marginBottom: '8px' }}>
                    <Coins size={18} />
                    <span>Số Đồng Xu (Coins):</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={playerEdit.coins}
                    onChange={(e) => setPlayerEdit({ ...playerEdit, coins: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '2px solid #6ee7b7', fontSize: '16px', fontWeight: 800, boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ background: '#f5f3ff', border: '2px solid #ddd6fe', borderRadius: '16px', padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, color: '#6d28d9', marginBottom: '8px' }}>
                    <Trophy size={18} />
                    <span>Cấp Độ (Level):</span>
                  </div>
                  <input
                    type="number"
                    min="1"
                    value={playerEdit.level}
                    onChange={(e) => setPlayerEdit({ ...playerEdit, level: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '2px solid #c4b5fd', fontSize: '16px', fontWeight: 800, boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <button type="submit" className="btn-kid btn-green" style={{ padding: '10px 24px', fontSize: '14px' }}>
                  <Check size={16} />
                  <span>
                    {selectedPlayerId ? `Lưu Toàn Bộ Hồ Sơ & Chỉ Số Vào Database (public.players) ☁️` : 'Cập Nhật Chỉ Số Cho Bé'}
                  </span>
                </button>

                {selectedPlayerId && (
                  <button
                    type="button"
                    onClick={() => handleDeletePlayer(selectedPlayerId, selectedPlayerName)}
                    className="btn-kid btn-red"
                    style={{ padding: '10px 18px', fontSize: '13px' }}
                  >
                    <Trash2 size={15} />
                    <span>Xóa Tài Khoản Này Khỏi Database</span>
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== TAB 7: SUPABASE CLOUD & SQL ===================== */}
      {activeTab === 'cloud' && (
        <div className="animate-pop-in">
          <div className="kid-card" style={{ padding: '24px', background: '#ffffff', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Database size={24} color="#6366f1" />
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 800, color: '#1e293b', margin: 0 }}>
                  Trạng Thái Kết Nối Supabase Cloud
                </h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#ecfdf5', color: '#047857', padding: '6px 14px', borderRadius: '999px', fontWeight: 800, fontSize: '13px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                <span>BaaS Kết Nối Trực Tiếp Sẵn Sàng</span>
              </div>
            </div>

            <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.6, marginBottom: '20px' }}>
              Dự án sử dụng cơ chế <strong>Backend-as-a-Service (BaaS)</strong>: Trình duyệt kết nối trực tiếp với Supabase Database qua API Key công khai (<code>anon key</code>). Không cần máy chủ trung gian, phản hồi tức thì 0 giây và hoàn toàn miễn phí.
            </p>

            <div style={{ background: '#f8fafc', border: '2px solid #e2e8f0', borderRadius: '16px', padding: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#334155' }}>Đoạn Mã Tạo & Nâng Cấp Bảng SQL Supabase (Chạy trong SQL Editor):</span>
                <button onClick={copySQL} className="btn-kid btn-blue" style={{ padding: '6px 14px', fontSize: '12px' }}>
                  {isCopiedSQL ? <Check size={14} /> : <Copy size={14} />}
                  <span>{isCopiedSQL ? 'Đã Sao Chép SQL!' : 'Sao Chép Toàn Bộ SQL'}</span>
                </button>
              </div>

              <pre style={{
                background: '#0f172a',
                color: '#38bdf8',
                padding: '14px',
                borderRadius: '12px',
                fontSize: '12px',
                overflowX: 'auto',
                fontFamily: 'monospace',
                lineHeight: 1.5
              }}>
{`-- 1. Bảng Thông Tin Bé & Người Dùng (Đầy đủ cột hồ sơ)
CREATE TABLE IF NOT EXISTS public.players (
  id TEXT PRIMARY KEY,
  name TEXT DEFAULT 'Bé Thám Hiểm',
  email TEXT,
  avatar_url TEXT,
  birth_date DATE,
  address TEXT,
  phone TEXT,
  hobby TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Cập nhật cột nếu bảng players đã được tạo trước đó
ALTER TABLE public.players ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.players ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.players ADD COLUMN IF NOT EXISTS birth_date DATE;
ALTER TABLE public.players ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.players ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.players ADD COLUMN IF NOT EXISTS hobby TEXT;
ALTER TABLE public.players ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';
ALTER TABLE public.players ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- 2. Bảng Tiến Độ Game (Sao, Xu, Cấp Độ, Thú Cưng)
CREATE TABLE IF NOT EXISTS public.game_progress (
  player_id TEXT PRIMARY KEY REFERENCES public.players(id) ON DELETE CASCADE,
  stars INTEGER DEFAULT 5,
  coins INTEGER DEFAULT 30,
  level INTEGER DEFAULT 1,
  pet_data JSONB DEFAULT '{"id": "cat", "name": "Bé Miu Miu", "hunger": 80, "happiness": 90}'::jsonb,
  stats_data JSONB DEFAULT '{"language": {"completed": 0, "correct": 0}, "math": {"completed": 0, "correct": 0}, "logic": {"completed": 0, "correct": 0}}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Bảng Nhật Ký Học Tập (Phụ Huynh Theo Dõi)
CREATE TABLE IF NOT EXISTS public.learning_logs (
  id BIGSERIAL PRIMARY KEY,
  player_id TEXT,
  subject TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT true,
  score_earned INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Bật RLS và cấp quyền
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public players" ON public.players FOR ALL TO public USING (true) WITH CHECK (true);

ALTER TABLE public.game_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public game_progress" ON public.game_progress FOR ALL TO public USING (true) WITH CHECK (true);

ALTER TABLE public.learning_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public learning_logs" ON public.learning_logs FOR ALL TO public USING (true) WITH CHECK (true);`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* ===================== SIÊU CÔNG CỤ TẠO DỮ LIỆU TỰ ĐỘNG MODAL ===================== */}
      {isGeneratorOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '16px'
        }}>
          <div className="animate-pop-in" style={{
            background: '#ffffff',
            borderRadius: '28px',
            border: '4px solid #e0e7ff',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            width: '100%',
            maxWidth: '760px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {/* Header */}
            <div style={{
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              padding: '18px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#ffffff'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '16px',
                  width: '42px',
                  height: '42px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Wand2 size={24} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 900, fontFamily: 'var(--font-display)' }}>
                    🤖 Siêu Công Cụ Nạp Dữ Liệu Tự Động (Smart Batch Generator)
                  </h3>
                  <div style={{ fontSize: '12px', opacity: 0.9, marginTop: '2px' }}>
                    Thêm hàng chục câu hỏi chỉ trong 3 giây mà không cần nhập từng cái
                  </div>
                </div>
              </div>
              <button
                onClick={() => { sounds.playClick(); setIsGeneratorOpen(false); }}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  color: '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Sub-tabs inside modal */}
            <div style={{
              display: 'flex',
              borderBottom: '2px solid #e2e8f0',
              background: '#f8fafc',
              padding: '8px 16px 0 16px',
              gap: '8px'
            }}>
              <button
                onClick={() => { sounds.playClick(); setGenTab('quick_text'); }}
                style={{
                  padding: '10px 18px',
                  fontWeight: 800,
                  fontSize: '13px',
                  border: 'none',
                  borderBottom: genTab === 'quick_text' ? '3px solid #6366f1' : '3px solid transparent',
                  background: 'transparent',
                  color: genTab === 'quick_text' ? '#4f46e5' : '#64748b',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>📝 Dán Chữ Nhanh (Song Ngữ + Emoji)</span>
              </button>
              <button
                onClick={() => { sounds.playClick(); setGenTab('math'); }}
                style={{
                  padding: '10px 18px',
                  fontWeight: 800,
                  fontSize: '13px',
                  border: 'none',
                  borderBottom: genTab === 'math' ? '3px solid #6366f1' : '3px solid transparent',
                  background: 'transparent',
                  color: genTab === 'math' ? '#4f46e5' : '#64748b',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>🧮 Sinh Đề Toán Tự Động</span>
              </button>
              <button
                onClick={() => { sounds.playClick(); setGenTab('logic'); }}
                style={{
                  padding: '10px 18px',
                  fontWeight: 800,
                  fontSize: '13px',
                  border: 'none',
                  borderBottom: genTab === 'logic' ? '3px solid #6366f1' : '3px solid transparent',
                  background: 'transparent',
                  color: genTab === 'logic' ? '#4f46e5' : '#64748b',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>🧩 Sinh Câu Đố Logic</span>
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
              {genTab === 'quick_text' && (
                <div>
                  <div style={{
                    background: '#eff6ff',
                    border: '1.5px solid #bfdbfe',
                    borderRadius: '16px',
                    padding: '12px 16px',
                    marginBottom: '16px',
                    fontSize: '13px',
                    color: '#1e40af',
                    lineHeight: 1.5
                  }}>
                    💡 <strong>Cách dùng siêu tốc:</strong> Gõ hoặc dán danh sách từ vựng cách nhau bằng dấu phẩy (<code>,</code>) hoặc xuống dòng. Hệ thống sẽ <strong>tự động dịch sang Tiếng Anh, tự động gắn icon Emoji chuẩn và tạo câu đố</strong>!
                  </div>

                  {/* Preset chips */}
                  <div style={{ marginBottom: '14px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#475569', marginBottom: '8px' }}>
                      ⚡ Bấm nạp sẵn bộ từ gợi ý (Không cần gõ):
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {[
                        { label: '🐾 13 Thú Rừng', text: 'sư tử, hổ, báo, voi, khỉ, gấu bắc cực, hươu cao cổ, ngựa vằn, hà mã, tê giác, cá sấu, sóc, cáo', theme: 'Động vật' },
                        { label: '🐬 9 Thủy Cung', text: 'cá voi, cá mập, bạch tuộc, sao biển, con cua, tôm, mực, cá heo, chim bồ câu', theme: 'Động vật' },
                        { label: '🍓 10 Trái Cây', text: 'quả dâu, quả nho, dưa hấu, quả đào, quả lê, dứa, chanh, cherry, dưa lưới, quả chuối', theme: 'Trái cây' },
                        { label: '🥦 6 Rau Củ', text: 'súp lơ, hành tây, khoai tây, cà rốt, bắp ngô, nấm hương', theme: 'Rau củ' },
                        { label: '🚗 8 Phương Tiện', text: 'xe máy, trực thăng, thuyền buồm, xe cứu hỏa, xe cảnh sát, xe cấp cứu, tàu hỏa, khinh khí cầu', theme: 'Phương tiện' }
                      ].map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            sounds.playClick();
                            setQuickText(preset.text);
                            setQuickTheme(preset.theme);
                          }}
                          style={{
                            padding: '6px 12px',
                            background: '#f1f5f9',
                            border: '1px solid #cbd5e1',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: 700,
                            color: '#334155',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Textarea */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <label style={{ fontSize: '13px', fontWeight: 800, color: '#334155' }}>
                        Danh sách từ vựng (Tiếng Việt hoặc cú pháp "Từ VN: Từ EN"):
                      </label>
                      {quickText.trim() && (
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#16a34a' }}>
                          ✓ Phát hiện: {dataManager.parseQuickTextWords(quickText).length} từ vựng
                        </span>
                      )}
                    </div>
                    <textarea
                      rows={5}
                      value={quickText}
                      onChange={(e) => setQuickText(e.target.value)}
                      placeholder="Ví dụ: sư tử, hổ, cá sấu, hươu cao cổ, hà mã, ngựa vằn..."
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '14px',
                        border: '2px solid #cbd5e1',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box',
                        fontFamily: 'inherit',
                        lineHeight: 1.5
                      }}
                    />
                  </div>

                  {/* Preview detected words badges */}
                  {quickText.trim() && (
                    <div style={{
                      marginBottom: '16px',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '14px',
                      padding: '10px 14px',
                      maxHeight: '110px',
                      overflowY: 'auto'
                    }}>
                      <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', marginBottom: '6px', textTransform: 'uppercase' }}>
                        Xem trước nhận diện tự động ({dataManager.parseQuickTextWords(quickText).length} từ):
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {dataManager.parseQuickTextWords(quickText).map((item, idx) => (
                          <span
                            key={idx}
                            style={{
                              background: '#ffffff',
                              border: '1px solid #cbd5e1',
                              borderRadius: '8px',
                              padding: '3px 8px',
                              fontSize: '12px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontWeight: 600
                            }}
                          >
                            <span>{item.emoji}</span>
                            <span style={{ color: '#0f172a' }}>{item.vn}</span>
                            <span style={{ color: '#64748b', fontSize: '11px' }}>({item.en})</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Theme override */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
                    <label style={{ fontSize: '13px', fontWeight: 700, color: '#475569' }}>
                      Chủ đề gán cho bộ từ này:
                    </label>
                    <select
                      value={quickTheme}
                      onChange={(e) => setQuickTheme(e.target.value)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '12px',
                        border: '2px solid #cbd5e1',
                        fontSize: '13px',
                        fontWeight: 700,
                        color: '#1e293b'
                      }}
                    >
                      <option value="auto">✨ Tự động nhận diện theo từ</option>
                      <option value="Động vật">🐾 Động vật</option>
                      <option value="Trái cây">🍎 Trái cây</option>
                      <option value="Rau củ">🥦 Rau củ</option>
                      <option value="Phương tiện">🚗 Phương tiện</option>
                      <option value="Món ăn">🍕 Món ăn</option>
                      <option value="Thiên nhiên">☀️ Thiên nhiên</option>
                      <option value="Tổng hợp">🌈 Tổng hợp</option>
                    </select>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={handleBatchAddQuickWords}
                    disabled={isBatchGenerating || !quickText.trim()}
                    className="btn-kid btn-green"
                    style={{
                      width: '100%',
                      padding: '14px',
                      fontSize: '15px',
                      justifyContent: 'center',
                      opacity: (!quickText.trim() || isBatchGenerating) ? 0.6 : 1
                    }}
                  >
                    <Zap size={18} />
                    <span>⚡ Nạp Cấp Tốc Vào Game & Database Ngay</span>
                  </button>
                </div>
              )}

              {genTab === 'math' && (
                <div>
                  <div style={{
                    background: '#fef3c7',
                    border: '1.5px solid #fde68a',
                    borderRadius: '16px',
                    padding: '12px 16px',
                    marginBottom: '16px',
                    fontSize: '13px',
                    color: '#92400e',
                    lineHeight: 1.5
                  }}>
                    🧮 <strong>Thuật toán sinh đề toán học:</strong> Tự động phối hợp các dạng câu hỏi (Đếm số lượng quả/con vật, Phép cộng trực quan trong phạm vi 10, So sánh bên nhiều/ít hơn) với hình ảnh sinh động và các đáp án nhiễu logic.
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#334155', marginBottom: '8px' }}>
                        Số lượng câu muốn tạo:
                      </label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {[5, 10, 20].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => { sounds.playClick(); setMathGenCount(num); }}
                            style={{
                              flex: 1,
                              padding: '10px 0',
                              borderRadius: '12px',
                              fontWeight: 800,
                              fontSize: '14px',
                              border: mathGenCount === num ? '2px solid #f59e0b' : '2px solid #e2e8f0',
                              background: mathGenCount === num ? '#fffbeb' : '#ffffff',
                              color: mathGenCount === num ? '#b45309' : '#64748b',
                              cursor: 'pointer'
                            }}
                          >
                            {num} câu
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#334155', marginBottom: '8px' }}>
                        Thể loại bài toán:
                      </label>
                      <select
                        value={mathGenCat}
                        onChange={(e) => setMathGenCat(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: '12px',
                          border: '2px solid #cbd5e1',
                          fontSize: '14px',
                          fontWeight: 700,
                          color: '#1e293b'
                        }}
                      >
                        <option value="all">🎲 Phối hợp ngẫu nhiên (Đếm + Cộng + So sánh)</option>
                        <option value="count">🔢 Chỉ câu hỏi Đếm đồ vật</option>
                        <option value="addition">➕ Chỉ câu hỏi Phép cộng sinh động</option>
                        <option value="compare">⚖️ Chỉ câu hỏi So sánh số lượng</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={handleBatchGenerateMath}
                    disabled={isBatchGenerating}
                    className="btn-kid btn-yellow"
                    style={{
                      width: '100%',
                      padding: '14px',
                      fontSize: '15px',
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      color: '#ffffff'
                    }}
                  >
                    <Calculator size={18} />
                    <span>➕ Sinh Ngay {mathGenCount} Bài Tập Toán Vào Game</span>
                  </button>
                </div>
              )}

              {genTab === 'logic' && (
                <div>
                  <div style={{
                    background: '#f3e8ff',
                    border: '1.5px solid #e9d5ff',
                    borderRadius: '16px',
                    padding: '12px 16px',
                    marginBottom: '16px',
                    fontSize: '13px',
                    color: '#6b21a8',
                    lineHeight: 1.5
                  }}>
                    🧩 <strong>Thuật toán sinh câu đố Logic:</strong> Tự động tạo các câu hỏi quy luật chuỗi hình ảnh luân phiên (A - B - A - B - ?), màu sắc đối lập, động vật và hình khối để kích thích tư duy logic của bé.
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#334155', marginBottom: '8px' }}>
                      Số lượng câu đố logic muốn tạo:
                    </label>
                    <div style={{ display: 'flex', gap: '8px', maxWidth: '300px' }}>
                      {[5, 10, 15].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => { sounds.playClick(); setLogicGenCount(num); }}
                          style={{
                            flex: 1,
                            padding: '10px 0',
                            borderRadius: '12px',
                            fontWeight: 800,
                            fontSize: '14px',
                            border: logicGenCount === num ? '2px solid #8b5cf6' : '2px solid #e2e8f0',
                            background: logicGenCount === num ? '#faf5ff' : '#ffffff',
                            color: logicGenCount === num ? '#6b21a8' : '#64748b',
                            cursor: 'pointer'
                          }}
                        >
                          {num} câu
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleBatchGenerateLogic}
                    disabled={isBatchGenerating}
                    className="btn-kid btn-purple"
                    style={{
                      width: '100%',
                      padding: '14px',
                      fontSize: '15px',
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                      color: '#ffffff'
                    }}
                  >
                    <Brain size={18} />
                    <span>🧩 Sinh Ngay {logicGenCount} Câu Đố Tư Duy Logic</span>
                  </button>
                </div>
              )}
            </div>

            {/* Footer with summary note */}
            <div style={{
              background: '#f8fafc',
              borderTop: '2px solid #e2e8f0',
              padding: '12px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '12px',
              color: '#64748b'
            }}>
              <span>💾 Dữ liệu tạo ra được tự động lưu vào LocalStorage và đồng bộ Supabase Cloud.</span>
              <button
                onClick={() => { sounds.playClick(); setIsGeneratorOpen(false); }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#475569',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Đóng cửa sổ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
