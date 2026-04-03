import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  History, 
  Sparkles, 
  X, 
  Send, 
  Clock, 
  CheckCircle2, 
  Trophy,
  ArrowLeft,
  GraduationCap,
  FileText,
  Play,
  RotateCcw,
  Eye,
  Check,
  MessageSquare,
  BookOpen,
  LayoutGrid,
  User,
  LogIn,
  Search,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { utils, writeFile } from 'xlsx';
import { SUBJECTS } from './data/questions';
import { Subject, Exam, Question } from './types';

const STUDENTS = [
  "Đặng Thị Hoàng Anh", "Phan Minh Đạt", "Nguyễn Hải Đăng", "Võ Nhựt Đăng",
  "Nguyễn Trường Đông", "Dương Quốc Hùng", "Nguyễn Đỗ Ngọc Hân", "Trần Thị Như Huỳnh",
  "Trần Thị Hoài Hương", "Nguyễn Minh Khang", "Phan Duy Khang", "Nguyễn Văn Khánh",
  "Nguyễn Phan Thư Kỳ", "Trần Hiếu Kỳ", "Cao Tấn Lộc", "Trần Hữu Lượng",
  "Đặng Thị Kim Muội", "Bùi Quốc Nam", "Phạm Thị Kim Ngân", "Phạm Thị Thanh Ngân",
  "Hồ Bảo Ngọc", "Trần Nguyễn Như Ngọc", "Bùi Ngọc Bảo Nhi", "Nguyễn Thị Thu Nhi",
  "Nguyễn Thị Yến Nhi", "Diếp Thị Quỳnh Như", "Trần Thị Huỳnh Như", "Lê Minh Nhựt",
  "Nguyễn Minh Nhựt", "Thái Thị Ngọc Phụng", "Bùi Thị Yến Phương", "Trần Ngọc Nhã Phương",
  "Phạm Nguyễn Phương Quỳnh", "Nguyễn Phan Duy Tân", "Nguyễn Ngọc Thảo", "Nguyễn Thị Thu Thảo",
  "Nguyễn A Thế", "Ngô Trí Thiện", "Trần Thị Minh Thiện", "Trần Huỳnh Đức Thịnh",
  "Cao Thanh Tiền", "Nguyễn Lê Thanh Trà", "Nguyễn Lê Bảo Trâm", "Nguyễn Nhật Trường"
];

export default function App() {
  const [view, setView] = useState<'login' | 'home' | 'exam-list' | 'quiz' | 'review' | 'results' | 'history'>('login'); 
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timer, setTimer] = useState(0);
  const [chatMessages, setChatMessages] = useState([
    { role: 'ai', text: 'Chào 10A7! Cô đã sẵn sàng hỗ trợ các em ôn tập. Có câu nào khó cứ hỏi nhé! 🌍📖' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [scoreHistory, setScoreHistory] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingEntry, setDeletingEntry] = useState<any | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('scoreHistory');
    if (saved) setScoreHistory(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (view === 'results' && selectedExam && currentUser) {
      const questions = selectedExam.questions;
      const correctCount = questions.reduce((acc, q, i) => answers[i] === q.correct ? acc + 1 : acc, 0);
      const score = ((correctCount / questions.length) * 10).toFixed(1);
      
      const newEntry = {
        "Học sinh": currentUser,
        "Môn học": selectedSubject?.name,
        "Đề thi": selectedExam.title,
        "Điểm số": score,
        "Số câu đúng": `${correctCount}/${questions.length}`,
        "Thời gian": new Date().toLocaleString('vi-VN')
      };

      const updatedHistory = [newEntry, ...scoreHistory];
      setScoreHistory(updatedHistory);
      localStorage.setItem('scoreHistory', JSON.stringify(updatedHistory));
    }
  }, [view]);

  const exportToExcel = () => {
    const userHistory = scoreHistory.filter(entry => entry["Học sinh"] === currentUser);
    if (userHistory.length === 0) {
      alert("Chưa có lịch sử điểm số của em để xuất!");
      return;
    }
    const ws = utils.json_to_sheet(userHistory);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Kết quả");
    writeFile(wb, `KetQua_${currentUser}_10A7.xlsx`);
  };

  const sendResult = async (score: string, correctCount: number, totalQuestions: number) => {
    if (!currentUser || !selectedSubject) return;
    
    setIsSubmitting(true);
    const scriptUrl = "https://script.google.com/macros/s/AKfycby9_cskE8GdiXbJBFq5XM2njwsZNbnbCEIV2nflVWREH1vzH1tGZ2HvqtOkOqoBF81d/exec";
    
    const data = {
      name: currentUser,
      class: "10A7",
      subject: selectedSubject.name,
      score: score,
      correct: correctCount,
      total: totalQuestions
    };

    try {
      // Sử dụng mode: 'no-cors' và Content-Type: 'text/plain' để tránh lỗi CORS
      // Google Apps Script vẫn sẽ nhận được nội dung JSON trong e.postData.contents
      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify(data),
      });
      
      alert("Đã nộp bài thành công");
    } catch (error) {
      console.error("Error submitting to Google Sheets:", error);
      alert("Có lỗi xảy ra khi nộp bài. Em hãy thử lại hoặc chụp màn hình kết quả nhé!");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    let interval: any;
    if (view === 'quiz') {
      interval = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [view]);

  const formatTime = (s: number) => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;

  const handleSubjectClick = (sub: Subject) => {
    setSelectedSubject(sub);
    setView('exam-list');
  };

  const deleteHistoryEntry = (entryToDelete: any) => {
    const updatedHistory = scoreHistory.filter(entry => entry !== entryToDelete);
    setScoreHistory(updatedHistory);
    localStorage.setItem('scoreHistory', JSON.stringify(updatedHistory));
    setDeletingEntry(null);
  };

  const startExam = (exam: Exam) => {
    setSelectedExam(exam);
    setAnswers({}); 
    setCurrentIdx(0); 
    setTimer(0); 
    setView('quiz');
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const newMsgs = [...chatMessages, { role: 'user', text: chatInput }];
    setChatMessages(newMsgs);
    setChatInput('');
    
    setTimeout(() => {
      setChatMessages(prev => [...prev, { role: 'ai', text: `Chào ${currentUser}! Cô đang ghi nhận câu hỏi của em. Hãy tiếp tục ôn luyện trong các bộ đề nhé!` }]);
    }, 1000);
  };

  const renderLogin = () => {
    const filteredStudents = STUDENTS.filter(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
      <div className="min-h-screen bg-[#f0f7ff] flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-400/5 blur-[150px] rounded-full" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[48px] p-10 md:p-16 max-w-4xl w-full shadow-2xl shadow-blue-900/10 relative z-10 border border-blue-50 flex flex-col items-center"
        >
          <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-blue-600/20 mb-8">
            <LogIn size={40} />
          </div>
          
          <h2 className="text-5xl font-black text-green-600 mb-2 tracking-tighter uppercase text-center">Đăng nhập</h2>
          <p className="text-xl text-slate-500 font-medium mb-10 text-center">Vui lòng chọn tên của em từ danh sách lớp 10A7 để bắt đầu.</p>

          <div className="w-full max-w-md relative">
            <div className="relative z-20">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Tìm kiếm tên học sinh..." 
                value={searchTerm}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-200 transition-all font-bold text-slate-700"
              />
            </div>

            <AnimatePresence>
              {(isSearchFocused || searchTerm) && (
                <motion.div 
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute top-full left-0 right-0 mt-3 bg-white border border-blue-100 rounded-[32px] shadow-2xl shadow-blue-900/10 overflow-hidden z-10 p-4"
                >
                  <div className="flex justify-between items-center mb-4 px-2">
                    <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Danh sách lớp 10A7</span>
                    <button onClick={() => setIsSearchFocused(false)} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-100 scrollbar-track-transparent">
                    {filteredStudents.map((student, idx) => (
                      <button 
                        key={idx}
                        onClick={() => {
                          setCurrentUser(student);
                          setView('home');
                        }}
                        className="p-4 bg-slate-50 border border-transparent rounded-xl text-left font-bold text-slate-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all flex items-center gap-3 group"
                      >
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                          <User size={16} />
                        </div>
                        {student}
                      </button>
                    ))}
                    {filteredStudents.length === 0 && (
                      <div className="py-10 text-center text-slate-400 font-medium">
                        Không tìm thấy học sinh nào khớp với từ khóa.
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-12 text-green-600 text-xs font-black uppercase tracking-widest opacity-80 flex items-center gap-2">
            <GraduationCap size={14} /> Ôn tập kiểm tra giữa kỳ 2
          </div>
        </motion.div>
      </div>
    );
  };

  const renderHome = () => (
    <div className="min-h-screen bg-[#f0f7ff] text-slate-900 flex flex-col items-center p-6 md:p-12 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/5 blur-[120px] rounded-full" />

      <header className="w-full max-w-6xl flex justify-between items-center mb-12 z-10">
        <div className="flex items-center gap-3">
          <div className="px-6 py-4 bg-blue-800 rounded-lg flex items-center justify-center font-black text-sm text-white shadow-lg shadow-blue-800/40">10A7</div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black leading-tight uppercase tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 py-1">NĂM HỌC: 2025 - 2026</h1>
            
          </div>
        </div>
        <div className="flex gap-4">
            <button onClick={() => setView('history')} className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full border border-green-100 text-green-600 shadow-sm hover:bg-green-100 transition-colors">
              <History size={16} />
              <span className="text-sm font-black uppercase tracking-widest">Lịch sử làm bài</span>
            </button>
            <div className="flex items-center gap-3 px-4 py-2 bg-blue-50 rounded-full border border-blue-100 text-blue-600 shadow-sm">
              <User size={16} />
              <span className="text-sm font-black uppercase tracking-widest">{currentUser}</span>
            </div>
            <button onClick={() => setView('login')} className="p-2 bg-white rounded-full border border-blue-100 hover:bg-red-50 hover:text-red-600 transition-colors text-blue-600 shadow-sm"><LogIn size={18} /></button>
        </div>
      </header>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 z-10"
      >
        <div className="w-16 h-16 bg-red-600/10 border border-red-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-red-500/10">
          <GraduationCap size={36} className="text-red-600" />
        </div>
        <h2 className="text-4xl md:text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 tracking-tight uppercase py-2 leading-tight">GIA SƯ LỚP HỌC</h2>
        <div className="inline-flex items-center gap-2 text-xs text-green-600 font-black bg-green-50 px-5 py-2 rounded-full border border-green-100 uppercase tracking-[0.1em] shadow-sm">
          <Sparkles size={14} /> Hệ thống học tập thông minh 10A7
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl z-10 pb-24">
        {SUBJECTS.map((sub, idx) => (
          <motion.button 
            key={sub.id} 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => handleSubjectClick(sub)} 
            className="group p-8 rounded-[32px] border border-blue-100 bg-white transition-all duration-300 hover:shadow-2xl hover:shadow-blue-200/50 hover:-translate-y-2 text-left relative overflow-hidden shadow-sm"
          >
            <div className="text-3xl mb-5 bg-blue-50 w-14 h-14 flex items-center justify-center rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-inner">{sub.icon}</div>
            <h3 className="text-3xl font-black mb-2 tracking-tight text-slate-800 group-hover:text-blue-600 transition-colors uppercase">{sub.name}</h3>
            <p className="text-slate-500 text-lg mb-8 leading-relaxed font-medium">{sub.desc}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-black text-slate-400 uppercase tracking-widest group-hover:text-blue-600 transition-colors">Vào phòng học</span>
              <div className="w-8 h-8 rounded-xl border border-blue-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white transition-all duration-300"><Play size={12} fill="currentColor"/></div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );

  const renderExamList = () => (
    <div className="min-h-screen bg-[#f0f7ff] text-slate-900 p-6 md:p-12 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[120px] rounded-full" />
      
      <header className="w-full max-w-6xl mx-auto flex justify-between items-center mb-12 z-10 relative">
        <div className="flex items-center gap-6">
          <button onClick={() => setView('home')} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-all group font-bold">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Trang chủ
          </button>
          <div className="h-8 w-px bg-slate-200 hidden md:block"></div>
          <div className="hidden md:flex items-center gap-3">
            <div className="px-4 py-3 bg-blue-800 rounded-lg flex items-center justify-center font-black text-[20px] text-white shadow-lg shadow-blue-800/40">10A7</div>
            <div>
              <h1 className="text-xl md:text-2xl font-black leading-tight uppercase tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 py-1">NĂM HỌC: 2025 - 2026</h1>
             
            </div>
          </div>
        </div>
        <div className="flex gap-4">
            <button onClick={() => setView('history')} className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full border border-green-100 text-green-600 shadow-sm hover:bg-green-100 transition-colors">
              <History size={16} />
              <span className="text-xs font-black uppercase tracking-widest">Lịch sử làm bài</span>
            </button>
            <div className="flex items-center gap-3 px-4 py-2 bg-blue-50 rounded-full border border-blue-100 text-blue-600 shadow-sm">
              <User size={16} />
              <span className="text-[13px] font-black uppercase tracking-widest">{currentUser}</span>
            </div>
            <button onClick={() => setView('login')} className="p-2 bg-white rounded-full border border-blue-100 hover:bg-red-50 hover:text-red-600 transition-colors text-blue-600 shadow-sm"><LogIn size={18} /></button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto z-10 relative">
        <div className="mb-12 flex items-center gap-8">
          <div className="w-20 h-20 bg-white rounded-3xl border border-blue-100 flex items-center justify-center text-4xl shadow-xl ring-1 ring-blue-50 rotate-3">
            {selectedSubject?.icon}
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-black mb-2 tracking-tighter uppercase text-red-600">Ôn tập {selectedSubject?.name}</h2>
            <p className="text-slate-500 text-xl font-medium">Chọn một đề thi để bắt đầu quá trình ôn luyện.</p>
          </div>
        </div>
        <div className="space-y-4">
          {selectedSubject?.exams.map((exam, idx) => (
            <motion.button 
              key={exam.id} 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => startExam(exam)} 
              className="w-full bg-white border border-blue-50 p-8 rounded-[28px] flex items-center justify-between hover:bg-blue-50 hover:border-blue-200 transition-all duration-300 text-left group shadow-sm hover:shadow-md"
            >
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm"><FileText size={24} /></div>
                <div>
                  <h4 className="text-2xl font-black mb-1 group-hover:text-blue-700 transition-colors tracking-tight uppercase">{exam.title}</h4>
                  <div className="flex gap-3 items-center">
                    <span className="text-slate-400 font-bold text-base bg-slate-50 px-2 py-1 rounded-md uppercase tracking-wider">{exam.questions.length} câu hỏi</span>
                    <span className="text-slate-300 font-bold text-base">•</span>
                    <span className="text-slate-400 font-bold text-base bg-slate-50 px-2 py-1 rounded-md uppercase tracking-wider">{exam.duration} phút</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 pr-4 opacity-40 group-hover:opacity-100 transition-opacity">
                <span className="text-xs font-black text-blue-600 uppercase tracking-widest">Bắt đầu</span>
                <Play size={16} className="text-blue-600" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderQuiz = (mode: 'quiz' | 'review' = 'quiz') => {
    if (!selectedExam) return null;
    const questions = selectedExam.questions;
    const q = questions[currentIdx];
    const userAns = answers[currentIdx];
    const isReview = mode === 'review';

    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans text-slate-900">
        <nav className="bg-white/80 backdrop-blur-xl border-b border-blue-100 px-8 py-4 flex justify-between items-center sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-6">
            <button onClick={() => setView(isReview ? 'results' : 'exam-list')} className="p-2 hover:bg-blue-50 rounded-xl transition-colors border border-blue-50 text-blue-600"><ArrowLeft size={20} /></button>
            <div className="flex flex-col">
              <span className="text-xs font-black text-blue-600 uppercase tracking-[0.2em] mb-0.5">{isReview ? 'PHÂN TÍCH KẾT QUẢ' : selectedExam.title}</span>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl text-slate-800 uppercase">Câu {currentIdx + 1}</span>
                <span className="text-slate-300">/</span>
                <span className="text-slate-400 font-bold text-lg">{questions.length}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            {!isReview && (
              <div className="flex items-center gap-2 font-mono font-black text-lg bg-blue-50 px-6 py-2 rounded-xl text-blue-700 border border-blue-100 shadow-inner">
                <Clock size={18} className="animate-pulse" /> {formatTime(timer)}
              </div>
            )}
            {isReview && (
              <div className="bg-blue-600 text-white px-5 py-2 rounded-xl text-xs font-black border border-blue-500 flex items-center gap-2 uppercase tracking-widest shadow-md">
                <Eye size={16} /> Chế độ xem lại
              </div>
            )}
            <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-full border border-slate-100 text-slate-600 shadow-sm">
              <User size={14} />
              <span className="text-xs font-black uppercase tracking-widest">{currentUser}</span>
            </div>
          </div>
        </nav>

        <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full grid lg:grid-cols-[1fr_300px] gap-8">
          <section className="space-y-6">
            <motion.div 
              key={currentIdx}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-[32px] p-8 md:p-12 shadow-xl shadow-blue-900/5 border border-blue-50 relative overflow-hidden"
            >
               {isReview && <div className="absolute top-4 right-8 opacity-[0.02] pointer-events-none -rotate-12 text-blue-600"><History size={160} /></div>}
               
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-600 text-xs font-black rounded-full mb-8 uppercase tracking-widest border border-blue-100 shadow-sm">
                <GraduationCap size={14} /> Trắc nghiệm khách quan
              </div>
              <h3 className="text-2xl md:text-3xl font-black mb-10 leading-snug text-slate-800 tracking-tight">{q.question}</h3>
              
              <div className="grid grid-cols-1 gap-4">
                {q.options.map((opt, idx) => {
                  const label = String.fromCharCode(65 + idx);
                  const isSelected = userAns === idx;
                  const isCorrect = q.correct === idx;
                  
                  let btnClass = "border-slate-100 bg-white hover:bg-blue-50 hover:border-blue-200";
                  let labelClass = "bg-slate-100 text-slate-400";

                  if (isReview) {
                    if (isCorrect) {
                      btnClass = "border-green-500 bg-green-50 text-green-800 ring-2 ring-green-100";
                      labelClass = "bg-green-600 text-white";
                    } else if (isSelected && !isCorrect) {
                      btnClass = "border-red-500 bg-red-50 text-red-800 ring-2 ring-red-100";
                      labelClass = "bg-red-600 text-white";
                    }
                  } else if (isSelected) {
                    btnClass = "border-blue-600 bg-blue-50 text-blue-700 ring-4 ring-blue-100 scale-[1.01]";
                    labelClass = "bg-blue-600 text-white shadow-lg shadow-blue-200";
                  }

                  return (
                    <button 
                      key={idx} 
                      disabled={isReview}
                      onClick={() => setAnswers({...answers, [currentIdx]: idx})} 
                      className={`group w-full p-5 rounded-2xl border-2 font-bold text-left transition-all duration-200 flex items-center gap-6 ${btnClass}`}
                    >
                      <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-base shrink-0 transition-all duration-200 ${labelClass}`}>{label}</span>
                      <span className="flex-1 text-base md:text-lg font-bold tracking-tight">{opt}</span>
                      {isReview && isCorrect && <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white shadow-md animate-in zoom-in-50"><Check size={16} /></div>}
                      {isReview && isSelected && !isCorrect && <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white shadow-md animate-in zoom-in-50"><X size={16} /></div>}
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {(userAns !== undefined || isReview) && q.explanation && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-900 text-white p-8 rounded-[32px] flex gap-6 shadow-lg border border-blue-800"
              >
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-blue-200 shadow-inner shrink-0 border border-white/10"><Sparkles size={24}/></div>
                <div className="space-y-2">
                  <h4 className="font-black text-blue-300 text-xs uppercase tracking-[0.2em]">Phân tích của giáo viên</h4>
                  <p className="text-lg md:text-xl leading-relaxed text-blue-50/90 font-medium">{q.explanation}</p>
                </div>
              </motion.div>
            )}

            <div className="flex justify-between items-center py-4">
              <button disabled={currentIdx === 0} onClick={() => setCurrentIdx(v => v - 1)} className="px-8 py-4 rounded-2xl font-black border-2 border-slate-200 text-slate-500 hover:bg-white hover:border-blue-300 hover:text-blue-600 disabled:opacity-20 transition-all uppercase tracking-widest text-xs">Quay lại</button>
              <button 
                onClick={() => currentIdx < questions.length - 1 ? setCurrentIdx(v => v + 1) : (isReview ? setView('results') : setView('results'))} 
                className={`px-10 py-4 rounded-2xl font-black shadow-xl transition-all duration-200 uppercase tracking-widest text-xs ${isReview ? 'bg-slate-800 text-white hover:bg-black' : 'bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5'}`}
              >
                {currentIdx === questions.length - 1 ? (isReview ? 'Kết thúc xem lại' : 'Gửi bài làm') : 'Câu tiếp theo'}
              </button>
            </div>
          </section>

          <aside className="hidden lg:block">
            <div className="bg-white rounded-[32px] p-8 border border-blue-50 sticky top-28 shadow-xl shadow-blue-900/5">
              <h4 className="font-black text-slate-800 mb-8 flex justify-between items-center text-xs uppercase tracking-[0.1em]">
                Bản đồ câu hỏi <span className="text-blue-600 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">{Object.keys(answers).length}/{questions.length}</span>
              </h4>
              <div className="grid grid-cols-5 gap-2">
                {questions.map((_, i) => {
                   let dotClass = "bg-white text-slate-400 border-slate-100 hover:border-blue-200";
                   if (isReview) {
                     dotClass = answers[i] === questions[i].correct ? "bg-green-600 text-white border-green-600 shadow-sm" : "bg-red-500 text-white border-red-500 shadow-sm";
                   } else if (answers[i] !== undefined) {
                     dotClass = "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100";
                   }
                   if (currentIdx === i) dotClass += " ring-4 ring-blue-100 scale-105 z-10 border-blue-300 font-black text-blue-600";
                   
                   return (
                    <button key={i} onClick={() => setCurrentIdx(i)} className={`aspect-square rounded-xl text-xs font-bold transition-all duration-200 border flex items-center justify-center ${dotClass}`}>
                      {i + 1}
                    </button>
                   );
                })}
              </div>
              
              <div className="mt-8 space-y-3 pt-6 border-t border-blue-50">
                <div className="flex items-center gap-3 text-xs font-black text-slate-500 uppercase tracking-widest"><div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div> Đã trả lời</div>
                {isReview && (
                  <>
                    <div className="flex items-center gap-3 text-xs font-black text-green-600 uppercase tracking-widest"><div className="w-2.5 h-2.5 bg-green-600 rounded-full"></div> Đáp án đúng</div>
                    <div className="flex items-center gap-3 text-xs font-black text-red-600 uppercase tracking-widest"><div className="w-2.5 h-2.5 bg-red-600 rounded-full"></div> Đáp án sai</div>
                  </>
                )}
              </div>
            </div>
          </aside>
        </main>
      </div>
    );
  };

  const renderResults = () => {
    if (!selectedExam) return null;
    const questions = selectedExam.questions;
    const correctCount = questions.reduce((acc, q, i) => answers[i] === q.correct ? acc + 1 : acc, 0);
    const score = ((correctCount / questions.length) * 10).toFixed(1);
    const percentage = Math.round((correctCount / questions.length) * 100);

    return (
      <div className="min-h-screen bg-[#f0f7ff] flex flex-col items-center p-6 md:p-12 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-600/5 blur-[150px] rounded-full" />
        
        <header className="w-full max-w-6xl flex justify-between items-center mb-12 z-10">
          <div className="flex items-center gap-3">
            <div className="px-3 py-2 bg-blue-600 rounded-lg flex items-center justify-center font-black text-sm text-white shadow-lg shadow-blue-600/20">10A7</div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black leading-tight uppercase tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 py-1">GIA SƯ LỚP HỌC - 10A7</h1>
              <p className="text-[10px] text-slate-500 font-mono">Build v2.6.0</p>
            </div>
          </div>
          <div className="flex gap-4">
              <div className="flex items-center gap-3 px-4 py-2 bg-blue-50 rounded-full border border-blue-100 text-blue-600 shadow-sm">
                <User size={16} />
                <span className="text-xs font-black uppercase tracking-widest">{currentUser}</span>
              </div>
              <button onClick={() => setView('login')} className="p-2 bg-white rounded-full border border-blue-100 hover:bg-red-50 hover:text-red-600 transition-colors text-blue-600 shadow-sm"><LogIn size={18} /></button>
          </div>
        </header>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[40px] p-8 md:p-10 max-w-xl w-full text-center shadow-2xl shadow-blue-900/10 space-y-6 relative z-10 border border-blue-50"
        >
          <div className="relative inline-block">
            <div className="w-24 h-24 bg-yellow-400 rounded-[24px] flex items-center justify-center mx-auto shadow-2xl shadow-yellow-500/20 text-white rotate-6 group hover:rotate-0 transition-all duration-500"><Trophy size={48} /></div>
            <div className="absolute -top-2 -right-2 w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-xl border-4 border-white animate-bounce">{score}</div>
          </div>
          
          <div>
            <h2 className="text-3xl font-black text-slate-800 mb-2 tracking-tighter uppercase">Bài thi hoàn tất!</h2>
            <div className="inline-block px-4 py-1.5 bg-blue-50 rounded-full text-blue-600 font-bold text-xs uppercase tracking-wider">Lớp 10A7 • {selectedExam.title}</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-[24px] p-6 border border-blue-100 group hover:bg-blue-600 transition-all duration-300">
               <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-1 group-hover:text-blue-100">Thang điểm 10</p>
               <p className="text-4xl font-black text-blue-800 group-hover:text-white transition-colors tracking-tighter">{score}</p>
            </div>
            <div className="bg-slate-50 rounded-[24px] p-6 border border-slate-100 transition-all">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Số câu đúng/20 câu</p>
               <p className="text-4xl font-black text-slate-800 tracking-tighter">{correctCount}/20</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => { setCurrentIdx(0); setView('review'); }} 
                className="flex items-center justify-center gap-2 py-4 bg-white border-2 border-slate-100 text-slate-700 rounded-2xl font-black hover:border-blue-600 hover:text-blue-600 transition-all shadow-sm active:scale-95 uppercase tracking-widest text-xs"
              >
                <Eye size={18} /> Xem lại bài
              </button>
              <button 
                onClick={() => startExam(selectedExam)} 
                className="flex items-center justify-center gap-2 py-4 bg-white border-2 border-slate-100 text-slate-700 rounded-2xl font-black hover:bg-blue-50 transition-all shadow-sm active:scale-95 uppercase tracking-widest text-xs"
              >
                <RotateCcw size={18} /> Thử lại lần nữa
              </button>
            </div>
            <button 
              onClick={() => setView('home')} 
              className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-1 transition-all active:scale-95 tracking-tight uppercase"
            >
              Quay về Trang Chủ
            </button>
          </div>

          <div className="flex flex-col items-center justify-center gap-3 text-slate-400 text-xs font-black uppercase tracking-widest opacity-80">
            <button onClick={exportToExcel} className="flex items-center gap-2 hover:text-blue-600 transition-colors">
              <CheckCircle2 size={12} /> Xuất Excel kết quả
            </button>
            <button 
              onClick={() => sendResult(score, correctCount, questions.length)} 
              disabled={isSubmitting}
              className={`flex items-center gap-2 transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:text-green-600'}`}
            >
              <CheckCircle2 size={12} className={isSubmitting ? 'animate-spin' : ''} /> 
              {isSubmitting ? "Đang nộp bài..." : "Nộp bài lên hệ thống"}
            </button>
          </div>
        </motion.div>
      </div>
    );
  };

  const renderHistory = () => (
    <div className="min-h-screen bg-[#f0f7ff] text-slate-900 p-6 md:p-12 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[120px] rounded-full" />
      
      <header className="w-full max-w-6xl mx-auto flex justify-between items-center mb-12 z-10 relative">
        <div className="flex items-center gap-6">
          <button onClick={() => setView('home')} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-all group font-bold">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Trang chủ
          </button>
          <div className="h-8 w-px bg-slate-200 hidden md:block"></div>
          <div className="hidden md:flex items-center gap-3">
            <div className="px-2 py-1.5 bg-blue-600 rounded-lg flex items-center justify-center font-black text-[10px] text-white shadow-lg shadow-blue-600/20">10A7</div>
            <div>
              <h1 className="text-xl md:text-2xl font-black leading-tight uppercase tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 py-1">GIA SƯ LỚP HỌC - 10A7</h1>
              <p className="text-[9px] text-slate-500 font-mono">Build v2.6.0</p>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
            <button onClick={exportToExcel} className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all active:scale-95 font-black uppercase tracking-widest text-xs">
              <FileText size={16} /> Xuất Excel kết quả
            </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto z-10 relative">
        <h2 className="text-4xl font-black mb-8 tracking-tighter uppercase text-red-600">Lịch sử làm bài</h2>
        
        <div className="bg-white rounded-[32px] border border-blue-100 overflow-hidden shadow-xl shadow-blue-900/5">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">Môn học</th>
                  <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">Đề thi</th>
                  <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">Điểm</th>
                  <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">Thời gian</th>
                  <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {scoreHistory
                  .filter(entry => entry["Học sinh"] === currentUser)
                  .map((entry, idx) => (
                    <tr key={idx} className="border-b border-slate-50 hover:bg-blue-50/30 transition-colors">
                      <td className="p-6 font-bold text-slate-700">{entry["Môn học"]}</td>
                      <td className="p-6 font-medium text-slate-600">{entry["Đề thi"]}</td>
                      <td className="p-6">
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg font-black text-sm border border-blue-100">
                          {entry["Điểm số"]}
                        </span>
                      </td>
                      <td className="p-6 text-slate-400 text-sm">{entry["Thời gian"]}</td>
                      <td className="p-6 text-center">
                        <button 
                          onClick={() => setDeletingEntry(entry)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Xoá kết quả"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                {scoreHistory.filter(entry => entry["Học sinh"] === currentUser).length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-slate-400 font-medium italic">Em chưa có dữ liệu điểm số nào.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {deletingEntry && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeletingEntry(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl relative z-10 border border-slate-100 text-center"
            >
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Trash2 size={32} />
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-2 tracking-tight uppercase">Xác nhận xoá?</h3>
              <p className="text-slate-500 mb-8 leading-relaxed">Em có chắc chắn muốn xoá kết quả bài thi này không? Hành động này không thể hoàn tác.</p>
              
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setDeletingEntry(null)}
                  className="py-4 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 transition-all active:scale-95 uppercase tracking-widest text-xs"
                >
                  Huỷ bỏ
                </button>
                <button 
                  onClick={() => deleteHistoryEntry(deletingEntry)}
                  className="py-4 bg-red-600 text-white rounded-2xl font-black shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all active:scale-95 uppercase tracking-widest text-xs"
                >
                  Đồng ý xoá
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="selection:bg-blue-100 selection:text-blue-900 font-sans antialiased text-slate-900">
      <AnimatePresence mode="wait">
        {view === 'login' && <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{renderLogin()}</motion.div>}
        {view === 'home' && <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{renderHome()}</motion.div>}
        {view === 'exam-list' && <motion.div key="exam-list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{renderExamList()}</motion.div>}
        {view === 'quiz' && <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{renderQuiz('quiz')}</motion.div>}
        {view === 'review' && <motion.div key="review" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{renderQuiz('review')}</motion.div>}
        {view === 'results' && <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{renderResults()}</motion.div>}
        {view === 'history' && <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{renderHistory()}</motion.div>}
      </AnimatePresence>

      {/* Floating Chat Button */}
      <button 
        onClick={() => setShowChat(true)} 
        className="fixed bottom-8 right-8 w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-blue-600/20 hover:scale-110 active:scale-95 transition-all z-50 group border-2 border-white/20"
      >
        <MessageSquare size={28} className="group-hover:rotate-12 transition-transform" />
      </button>

      {/* Modern Chat Modal */}
      {showChat && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl" 
            role="button"
            onClick={() => setShowChat(false)} 
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-[500px] h-[700px] bg-white rounded-[40px] shadow-2xl flex flex-col overflow-hidden border border-blue-50"
          >
            <header className="bg-blue-600 p-8 flex justify-between items-center text-white relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[60px] rounded-full pointer-events-none" />
              <div className="flex items-center gap-5 relative z-10">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner">
                  <Sparkles size={28} className="text-white" />
                </div>
                <div className="flex flex-col">
                  <h3 className="font-black text-xl tracking-tight uppercase">Cô AI 10A7</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-xs font-black uppercase tracking-widest opacity-70">Đang trực tuyến</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setShowChat(false)} className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-colors relative z-10">
                <X size={20} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-slate-50/50">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-5 rounded-[24px] text-lg font-medium shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-lg' 
                      : 'bg-white text-slate-800 border border-blue-50 rounded-tl-lg'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <footer className="p-6 bg-white border-t border-blue-50">
              <div className="flex gap-3 p-2 bg-slate-50 rounded-2xl border border-slate-100 focus-within:ring-4 focus-within:ring-blue-50 focus-within:border-blue-200 transition-all">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Hỏi cô điều gì đó..."
                  className="flex-1 bg-transparent px-4 py-2 outline-none font-bold text-slate-800 placeholder:text-slate-400 text-lg"
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={!chatInput.trim()}
                  className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 transition-all shadow-md active:scale-90 shrink-0 disabled:opacity-50"
                >
                  <Send size={18} fill="currentColor" />
                </button>
              </div>
              <div className="mt-4 flex justify-center gap-6">
                 <button className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline">Gợi ý câu hỏi</button>
                 <span className="text-slate-200">•</span>
                 <button className="text-xs font-black text-slate-400 uppercase tracking-widest hover:underline">Hướng dẫn sử dụng</button>
              </div>
            </footer>
          </motion.div>
        </div>
      )}
    </div>
  );
}
