import { Subject, Question, Exam } from '../types';

// Helper to create exams from a list of questions
const createExams = (subjectId: string, subjectName: string, allQuestions: Question[], count: number = 4): Exam[] => {
  const exams: Exam[] = [];
  const targetQuestionCount = 20;
  
  for (let i = 0; i < count; i++) {
    let questions: Question[] = [];
    
    if (allQuestions.length > 0) {
      // Try to take a unique slice first
      const start = (i * targetQuestionCount) % allQuestions.length;
      
      for (let j = 0; j < targetQuestionCount; j++) {
        const qIdx = (start + j) % allQuestions.length;
        const originalQ = allQuestions[qIdx];
        // Create a copy with a new ID to avoid duplicate keys in React if needed, 
        // but here we just need 20 questions.
        questions.push({
          ...originalQ,
          id: `${subjectId}-${i}-${j}` // Unique ID for this exam instance
        });
      }
    } else {
      // Placeholder if no questions at all
      for (let j = 0; j < targetQuestionCount; j++) {
        questions.push({
          id: `${subjectId}-${i}-${j}`,
          question: `Câu hỏi ${j + 1} đang được cập nhật cho môn ${subjectName}...`,
          options: ["Phương án A", "Phương án B", "Phương án C", "Phương án D"],
          correct: 0
        });
      }
    }

    exams.push({
      id: `${subjectId}-exam-${i + 1}`,
      title: `Đề ôn tập ${subjectName} số ${i + 1}`,
      questions: questions,
      duration: 20 // Increased duration for 20 questions
    });
  }
  return exams;
};

// --- ĐỊA LÝ ---
const GEO_QUESTIONS: Question[] = [
  { id: 1, question: "Nguồn lực trong nước là", options: ["nguồn vốn đầu tư.", "khoa học – công nghệ.", "thị trường nước ngoài.", "vốn đầu tư nước ngoài."], correct: 0, explanation: "Nguồn lực trong nước bao gồm vị trí, tài nguyên, vốn, lao động, chính sách..." },
  { id: 2, question: "Nguồn lực ngoài nước là", options: ["lịch sử - văn hóa.", "đường lối chính sách.", "nguồn vốn đầu tư.", "vốn đầu tư nước ngoài."], correct: 3, explanation: "Nguồn lực ngoài nước (ngoại lực) bao gồm vốn đầu tư, công nghệ, thị trường từ bên ngoài." },
  { id: 3, question: "Nguồn lực kinh tế - xã hội là", options: ["Vị trí địa lí.", "khí hậu, đất.", "nguồn vốn đầu tư.", "nước, sinh vật."], correct: 2, explanation: "Vốn, lao động, chính sách, khoa học công nghệ thuộc nhóm kinh tế - xã hội." },
  { id: 4, question: "Nguồn lực tự nhiên là", options: ["thương hiệu quốc gia.", "nước, sinh vật, đất.", "nguồn vốn đầu tư.", "đường lối chính sách."], correct: 1, explanation: "Các yếu tố như đất, nước, khí hậu, sinh vật, khoáng sản là nguồn lực tự nhiên." },
  { id: 5, question: "Nguồn lực nào sau đây tạo thuận lợi (hay khó khăn) trong việc tiếp cận giữa các vùng trong một nước?", options: ["Đất đai, biển.", "Vị trí địa lí.", "Khoa học.", "Lao động."], correct: 1, explanation: "Vị trí địa lí ảnh hưởng trực tiếp đến việc giao lưu, kết nối vùng miền." },
  { id: 6, question: "Cơ cấu kinh tế là tập hợp các bộ phận hợp thành", options: ["Vùng kinh tế", "Thành phần kinh tế", "Nền kinh tế", "Lãnh thổ kinh tế"], correct: 2, explanation: "Cơ cấu kinh tế là tập hợp các bộ phận hợp thành của một nền kinh tế." },
  { id: 7, question: "Cơ cấu GDP phân theo ngành phản ánh trình độ", options: ["Phát triển kinh tế", "Sản xuất nông nghiệp", "Sản xuất dịch vụ", "Sản xuất công nghiệp"], correct: 0, explanation: "Tỷ trọng các ngành trong GDP phản ánh trình độ phát triển và cơ cấu kinh tế của một nước." },
  { id: 8, question: "GDP là tổng sản phẩm", options: ["Quốc gia", "Quốc nội", "Nông nghiệp", "Dịch vụ"], correct: 1, explanation: "GDP (Gross Domestic Product) là tổng sản phẩm quốc nội." },
  { id: 9, question: "Nguồn lực nào sau đây đóng vai trò là cơ sở tự nhiên của quá trình sản xuất?", options: ["Vị trí địa lí", "Đường lối chính sách", "Tài nguyên thiên nhiên", "Thị trường"], correct: 2, explanation: "Tài nguyên là nguyên liệu đầu vào, cơ sở vật chất cho sản xuất." },
  { id: 10, question: "Nguồn lực nào sau đây có vai trò quyết định sự phát triển bền vững của một quốc gia?", options: ["Tài nguyên khoáng sản", "Vị trí địa lí", "Vốn đầu tư nước ngoài", "Con người"], correct: 3, explanation: "Con người là chủ thể, có tri thức và kỹ năng để vận hành và điều phối các nguồn lực khác." },
  { id: 11, question: "Chính sách phát triển và hệ thống pháp luật thuộc nhóm nguồn lực", options: ["Trong nước", "Ngoài nước", "Tự nhiên", "Vị trí địa lý"], correct: 0 },
  { id: 12, question: "Thị trường thế giới thuộc nhóm nguồn lực", options: ["Nội lực", "Ngoại lực", "Tự nhiên", "Kinh tế - xã hội"], correct: 1 },
  { id: 13, question: "Cơ cấu ngành kinh tế thường bao gồm các nhóm ngành", options: ["Nông-lâm-ngư; Công nghiệp-xây dựng; Dịch vụ", "Nhà nước; Ngoài nhà nước; Có vốn đầu tư nước ngoài", "Vùng kinh tế trọng điểm; Vùng sâu vùng xa", "Kinh tế tập thể; Kinh tế tư nhân"], correct: 0 },
  { id: 14, question: "Ở các nước đang phát triển, ngành nào thường chiếm tỷ trọng cao nhất trong GDP?", options: ["Công nghiệp", "Dịch vụ", "Nông nghiệp", "Xây dựng"], correct: 2 },
  { id: 15, question: "Sự dịch chuyển cơ cấu kinh tế theo hướng giảm tỷ trọng nông nghiệp, tăng tỷ trọng công nghiệp và dịch vụ gọi là", options: ["Hiện đại hóa", "Công nghiệp hóa", "Toàn cầu hóa", "Đô thị hóa"], correct: 1 },
  { id: 16, question: "Dựa vào bảng số liệu, ngành Dịch vụ của Ca-na-đa năm 2020 chiếm tỷ trọng là", options: ["1,7%", "24,6%", "66,9%", "6,8%"], correct: 2 },
  { id: 17, question: "Ngành Nông, lâm, thủy sản của Ê-ti-ô-pi-a chiếm bao nhiêu % GDP năm 2020?", options: ["1,7%", "35,5%", "23,1%", "36,8%"], correct: 1 },
  { id: 18, question: "So với Ca-na-đa, cơ cấu GDP của Ê-ti-ô-pi-a có đặc điểm là", options: ["Dịch vụ cao hơn", "Công nghiệp cao hơn", "Nông nghiệp cao hơn rất nhiều", "Thuế sản phẩm cao hơn"], correct: 2 },
  { id: 19, question: "Nguồn lực nào được coi là đòn bẩy cho sự phát triển kinh tế?", options: ["Khoa học và công nghệ", "Vị trí địa lý", "Đất đai", "Khí hậu"], correct: 0 },
  { id: 20, question: "Cơ cấu thành phần kinh tế bao gồm", options: ["Kinh tế nhà nước, kinh tế ngoài nhà nước, kinh tế có vốn đầu tư nước ngoài", "Vùng kinh tế trọng điểm, vùng kinh tế ngoại vi", "Nông nghiệp, Công nghiệp, Dịch vụ", "Thành thị, Nông thôn"], correct: 0 },
  { id: 21, question: "GNI là viết tắt của cụm từ", options: ["Gross National Index", "Gross National Income", "Global Network Income", "General National Interest"], correct: 1 },
  { id: 22, question: "Nguồn lực giúp mở rộng quan hệ kinh tế quốc tế là", options: ["Khoáng sản", "Vốn đầu tư nước ngoài", "Đất đai", "Khí hậu"], correct: 1 },
  { id: 23, question: "Bộ phận nào sau đây không thuộc cơ cấu kinh tế?", options: ["Cơ cấu ngành", "Cơ cấu lãnh thổ", "Cơ cấu thành phần", "Cơ cấu dân số theo tuổi"], correct: 3 },
  { id: 24, question: "Địa hình và khoáng sản thuộc nhóm nguồn lực", options: ["Kinh tế - xã hội", "Vị trí địa lý", "Tự nhiên", "Ngoài nước"], correct: 2 },
  { id: 25, question: "Để thể hiện cơ cấu, loại biểu đồ nào sau đây là thích hợp nhất?", options: ["Biểu đồ đường", "Biểu đồ cột đơn", "Biểu đồ tròn", "Biểu đồ miền"], correct: 2 },
  { id: 26, question: "Năm 2019, tỷ trọng ngành Dịch vụ thế giới là bao nhiêu %?", options: ["63,4%", "64,9%", "26,7%", "4,0%"], correct: 1 },
  { id: 27, question: "Sự phân chia các vùng kinh tế thuộc bộ phận cơ cấu nào?", options: ["Cơ cấu ngành", "Cơ cấu thành phần", "Cơ cấu lãnh thổ", "Cơ cấu sản phẩm"], correct: 2 },
  { id: 28, question: "Y yếu tố nào sau đây là nguồn lực ngoài nước?", options: ["Tài nguyên biển", "Khoa học công nghệ chuyển giao từ nước ngoài", "Lao động trong nước", "Di tích lịch sử quốc gia"], correct: 1 },
  { id: 29, question: "Ngành kinh tế nào chiếm tỷ trọng nhỏ nhất trong cơ cấu GDP thế giới hiện nay?", options: ["Công nghiệp", "Dịch vụ", "Xây dựng", "Nông nghiệp, lâm nghiệp, thủy sản"], correct: 3 },
  { id: 30, question: "Việc thu hút vốn FDI là tận dụng nguồn lực nào?", options: ["Nội lực", "Ngoại lực", "Tự nhiên", "Vị trí địa lý"], correct: 1 },
  { id: 31, question: "Nhân tố quyết định nhất đối với sự phát triển kinh tế là", options: ["Vị trí địa lý", "Tài nguyên thiên nhiên", "Con người", "Vốn đầu tư"], correct: 2 },
  { id: 32, question: "Toàn cầu hóa kinh tế là quá trình", options: ["Gia tăng các liên kết kinh tế thế giới", "Phát triển nông nghiệp bền vững", "Bảo vệ môi trường", "Gia tăng dân số"], correct: 0 },
  { id: 33, question: "Kinh tế nhà nước đóng vai trò gì trong cơ cấu thành phần kinh tế?", options: ["Hỗ trợ", "Chủ đạo", "Thứ yếu", "Không quan trọng"], correct: 1 },
  { id: 34, question: "Ngành công nghiệp xây dựng thế giới năm 2010 chiếm", options: ["27,7%", "26,7%", "3,8%", "5,1%"], correct: 0 },
  { id: 35, question: "Phát triển kinh tế tri thức dựa trên", options: ["Tài nguyên đất", "Vốn ODA", "Trí tuệ và công nghệ cao", "Sức mạnh cơ bắp"], correct: 2 },
  { id: 36, question: "Tại sao các nước phát triển có tỷ trọng nông nghiệp thấp?", options: ["Vì họ không có đất", "Vì năng suất cực cao và kinh tế chuyển sang dịch vụ", "Vì dân số quá đông", "Vì họ nhập khẩu hoàn toàn"], correct: 1 },
  { id: 37, question: "Cơ cấu kinh tế của một quốc gia thay đổi theo", options: ["Từng ngày", "Các giai đoạn phát triển", "Mùa trong năm", "Chu kỳ mặt trăng"], correct: 1 },
  { id: 38, question: "Nguồn lực tự nhiên nào quan trọng nhất cho sản xuất nông nghiệp?", options: ["Khoáng sản", "Đất", "Vị trí gần biển", "Vàng"], correct: 1 },
  { id: 39, question: "Môi trường chính trị ổn định là nguồn lực", options: ["Tự nhiên", "Ngoài nước", "Kinh tế - xã hội", "Vị trí địa lý"], correct: 2 },
  { id: 40, question: "Xu hướng chuyển dịch cơ cấu ngành kinh tế của thế giới hiện nay là", options: ["Tăng khu vực I, giảm khu vực III", "Tăng khu vực II, giảm khu vực III", "Tăng khu vực III, giảm khu vực I", "Giữ nguyên không đổi"], correct: 2 }
];

// --- TIẾNG ANH ---
const ENG_QUESTIONS: Question[] = [
  { id: 1, question: "Factory work can be very __________ because workers do the same tasks every day.", options: ["varied", "rewarding", "repetitive", "creative"], correct: 2 },
  { id: 2, question: "You look tired. Sit down, and I ____________ make you a cup of tea.", options: ["will", "am going to"], correct: 0 },
  { id: 3, question: "The __________ scaled and polished my teeth last week.", options: ["hairdresser", "dentist", "cleaner", "receptionist"], correct: 1 },
  { id: 4, question: "I’ve got two children so I’d really like a nine-to-______ job.", options: ["eight", "four", "five", "ten"], correct: 2 },
  { id: 5, question: "A: Why do you need to borrow my shoes? B: I ____________ attend a dinner party tonight.", options: ["will", "am going to"], correct: 1 },
  { id: 6, question: "He left the company last year, so now he is an ______ employee.", options: ["sub", "co", "ex", "post"], correct: 2 },
  { id: 7, question: "She is ______ independent and still needs some help at work.", options: ["over", "semi", "post", "micro"], correct: 1 },
  { id: 8, question: "She dreams of working for a ______ company with offices in many countries.", options: ["micronational", "multinational", "subnational", "postnational"], correct: 1 },
  { id: 9, question: "I get bored when I’m sitting down so I’m happier if I’m on my ________ all day.", options: ["knee", "feet", "fingers", "toe"], correct: 1 },
  { id: 10, question: "On Sunday at 8 o'clock I _______ my friend.", options: ["meet", "am going to meet", "will be meeting", "will meet"], correct: 1 },
  { id: 11, question: "Wait! I _______ you to the station.", options: ["am driving", "drive", "is going to drive", "will drive"], correct: 3 },
  { id: 12, question: "If I get a rode, I _______ go fishing.", options: ["will", "could", "would", "might"], correct: 0 },
  { id: 13, question: "You _______ out with your friends if you finish your homework before 7 o'clock.", options: ["can go", "went", "goes", "go"], correct: 0 },
  { id: 14, question: "The woman______ lives next door is doctor.", options: ["who", "whom", "which", "whose"], correct: 0 },
  { id: 15, question: "The boy ____ Mary likes is my son.", options: ["when", "whom", "which", "whose"], correct: 1 }
];

// --- TIN HỌC ---
const IT_QUESTIONS: Question[] = [
  { id: 1, question: "Câu lệnh while M != N: if M > N: M = M - N else: N = N - M giải bài toán nào?", options: ["Tìm UCLN của M và N.", "Tìm BCNN của M và N.", "Tìm hiệu nhỏ nhất.", "Tìm hiệu lớn nhất."], correct: 0 },
  { id: 2, question: "Vòng lặp while - do kết thúc với điều kiện nào sau đây?", options: ["Khi một số điều kiện cho trước thoả mãn.", "Khi đủ số vòng lặp.", "Khi tìm được output.", "Khi biến điều kiện được cập nhật sai."], correct: 0 },
  { id: 3, question: "Trong câu lệnh while khối lệnh sẽ thực hiện khi nào?", options: ["Điều kiện sai.", "Điều kiện đúng.", "Khi tìm được output.", "Khi đủ số vòng lặp."], correct: 1 },
  { id: 4, question: "Lệnh nào sau đây được dùng để tính độ dài của xâu s?", options: ["str(s).", "len(s).", "length(s).", "s.len()."], correct: 1 },
  { id: 5, question: "Xâu kí tự được đặt trong cặp dấu nào sau đây?", options: ["Nháy đơn ('') hoặc nháy kép (\"\").", "Ngoặc đơn ().", "Ngoặc vuông [].", "Ngoặc nhọn {}."], correct: 0 },
  { id: 6, question: "Để thêm phần tử vào list trong python ta dùng phương thức nào?", options: ["abs().", "link().", "append().", "add()."], correct: 2 },
  { id: 7, question: "Để xóa tất cả các phần tử trong danh sách ta dùng hàm nào?", options: ["append().", "pop().", "clear().", "remove()."], correct: 2 },
  { id: 8, question: "Kiểu dữ liệu nào sau đây là kiểu dữ liệu danh sách?", options: ["list.", "bool.", "str.", "int."], correct: 0 }
];

// --- CÔNG NGHỆ ---
const TECH_QUESTIONS: Question[] = [
  { id: 1, question: "Quy trình trồng trọt bao gồm mấy bước cơ bản?", options: ["1", "2", "3", "4"], correct: 3 },
  { id: 2, question: "Bước đầu tiên trong quy trình trồng trọt là:", options: ["Làm đất, bón lót", "Gieo hạt, trồng cây", "Chăm sóc", "Thu hoạch"], correct: 0 },
  { id: 3, question: "Có mấy phương pháp bón lót?", options: ["1", "2", "3", "4"], correct: 2 },
  { id: 4, question: "Bón vãi tức là:", options: ["Rải đều phân bón trên mặt luống", "Rạch hàng trên mặt luống", "Bổ hốc trên mặt luống", "Đào hố"], correct: 0 },
  { id: 5, question: "Theo công suất, người ta chia máy động lực làm mấy loại?", options: ["1", "2", "3", "4"], correct: 2 },
  { id: 6, question: "Máy động lực công suất lớn có công suất động cơ:", options: ["Trên 35 HP", "Trên 12 HP", "Dưới 12 HP", "Cả 3 đáp án trên"], correct: 0 }
];

// --- LỊCH SỬ ---
const HIST_QUESTIONS: Question[] = [
  { id: 1, question: "Hiện thực lịch sử là gì?", options: ["Là toàn bộ những gì diễn ra trong quá khứ, tồn tại khách quan.", "Là tất cả những gì diễn ra trong quá khứ của loài người", "Là tất cả những gì diễn ra trong quá khứ mà con người nhận thức được.", "Là khoa học tìm hiểu về quá khứ"], correct: 0 },
  { id: 2, question: "Truyền thuyết Thánh Gióng thuộc loại sử liệu nào?", options: ["Sử liệu truyền miệng (truyền khẩu).", "Sử liệu hình ảnh.", "Sử liệu hiện vật.", "Sử liệu chữ viết."], correct: 0 },
  { id: 3, question: "Đâu là sử liệu hiện vật?", options: ["Tuyên ngôn độc lập.", "Văn bia tiến sĩ.", "Truyền thuyết Sơn Tinh Thủy Tinh.", "Trống đồng Đông Sơn."], correct: 3 },
  { id: 4, question: "Văn hóa là gì?", options: ["Tổng thể những giá trị vật chất và tinh thần do con người sáng tạo ra trong lịch sử.", "Trạng thái tiến bộ về cả vật chất và tinh thần", "Toàn bộ những giá trị vật chất", "Toàn bộ những giá trị tinh thần"], correct: 0 },
  { id: 5, question: "Văn minh là gì?", options: ["Tổng thể những giá trị vật chất và tinh thần", "Toàn bộ những giá trị vật chất", "Toàn bộ những giá trị tinh thần", "Trạng thái tiến bộ về cả vật chất và tinh thần của xã hội loài người."], correct: 3 }
];

// --- GD KT & PL ---
const ECON_QUESTIONS: Question[] = [
  { id: 1, question: "Hệ thống các quy tắc xử sự chung do nhà nước ban hành và được bảo đảm thực hiện bằng quyền lực nhà nước là", options: ["pháp luật.", "thỏa thuận.", "hương ước.", "quyết định."], correct: 0 },
  { id: 2, question: "Trong hệ thống pháp luật Việt Nam, văn bản luật có hiệu lực pháp lý cao nhất là", options: ["Hiến pháp.", "nghị quyết.", "thông tư.", "luật."], correct: 0 },
  { id: 3, question: "Hiến pháp hiện hành của nước Cộng hòa xã hội chủ nghĩa Việt Nam là Hiến pháp năm", options: ["1980.", "1992.", "2013.", "2025."], correct: 2 },
  { id: 4, question: "Việc nhà nước ban hành các quy phạm pháp luật được áp dụng nhiều lần, ở nhiều nơi đối với tất cả mọi người là thể hiện đặc điểm nào?", options: ["Tính công khai, dân chủ.", "Tính quy phạm phổ biến.", "Tính chặt chẽ về nội dung", "Tính kỉ luật và nghiêm minh."], correct: 1 }
];

export const SUBJECTS: Subject[] = [
  { 
    id: 'history', 
    name: 'Lịch sử', 
    desc: 'Khám phá dòng chảy thời gian và các nền văn minh nhân loại.', 
    icon: '📜', 
    color: 'from-blue-500/20 to-blue-600/20', 
    borderColor: 'border-blue-500/50',
    exams: createExams('history', 'Lịch sử', HIST_QUESTIONS)
  },
  { 
    id: 'tech', 
    name: 'Công nghệ', 
    desc: 'Kỹ thuật trồng trọt và ứng dụng cơ giới hóa trong đời sống.', 
    icon: '🛠️', 
    color: 'from-green-500/20 to-green-600/20', 
    borderColor: 'border-green-500/50',
    exams: createExams('tech', 'Công nghệ', TECH_QUESTIONS)
  },
  { 
    id: 'economics', 
    name: 'GD KT & PL', 
    desc: 'Kiến thức về hệ thống pháp luật và kinh tế Việt Nam.', 
    icon: '⚖️', 
    color: 'from-purple-500/20 to-purple-600/20', 
    borderColor: 'border-purple-500/50',
    exams: createExams('economics', 'GD KT & PL', ECON_QUESTIONS)
  },
  { 
    id: 'it', 
    name: 'Tin học', 
    desc: 'Lập trình Python và tư duy thuật toán cơ bản.', 
    icon: '💻', 
    color: 'from-cyan-500/20 to-cyan-600/20', 
    borderColor: 'border-cyan-500/50',
    exams: createExams('it', 'Tin học', IT_QUESTIONS)
  },
  { 
    id: 'english', 
    name: 'Tiếng Anh', 
    desc: 'Ôn tập từ vựng và ngữ pháp Tiếng Anh lớp 10.', 
    icon: '🇬🇧', 
    color: 'from-red-500/20 to-red-600/20', 
    borderColor: 'border-red-500/50',
    exams: createExams('english', 'Tiếng Anh', ENG_QUESTIONS)
  },
  { 
    id: 'geography', 
    name: 'Địa lý', 
    desc: 'Tìm hiểu về nguồn lực phát triển kinh tế và cơ cấu ngành.', 
    icon: '🌍', 
    color: 'from-orange-500/20 to-orange-600/20', 
    borderColor: 'border-orange-500/50',
    exams: createExams('geography', 'Địa lý', GEO_QUESTIONS)
  },
];
