export type Difficulty = "easy" | "medium" | "hard";
export type Category =
  | "calculation"
  | "bonds"
  | "patterns"
  | "word_problems"
  | "geometry"
  | "time"
  | "logic"
  | "mixed";

export interface Question {
  id: string;
  category: Category;
  text: string;
  options: (number | string)[];
  correctAnswer: number | string;
  visuals?: {
    type: "bond" | "sequence";
    data: any;
  };
}

// Giới hạn trong chương trình lớp 2 lên 3:
// +, - đến 1000.
// x, / cơ bản (bảng 2, 3, 4, 5).

const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const generateOptions = (correct: number, count: number = 4) => {
  const options = new Set<number>();
  options.add(correct);
  while (options.size < count) {
    const variance = randomInt(1, 10);
    const isOver = Math.random() > 0.5;
    const wrong = isOver ? correct + variance : correct - variance;
    if (wrong >= 0) options.add(wrong);
  }
  return Array.from(options).sort(() => Math.random() - 0.5);
};

export const generateCalculationQuestion = (
  difficulty: Difficulty = "medium",
): Question => {
  const operations = difficulty === "easy" ? ["+", "-"] : ["+", "-", "x", "/"];
  const op = operations[randomInt(0, operations.length - 1)];
  let a, b, correct;

  if (op === "+") {
    if (difficulty === "easy") {
      a = randomInt(1, 20);
      b = randomInt(1, 20);
    } else if (difficulty === "medium") {
      a = randomInt(10, 100);
      b = randomInt(10, 100);
    } else {
      a = randomInt(100, 500);
      b = randomInt(100, 500);
    }
    correct = a + b;
  } else if (op === "-") {
    if (difficulty === "easy") {
      a = randomInt(10, 30);
      b = randomInt(1, a);
    } else if (difficulty === "medium") {
      a = randomInt(20, 100);
      b = randomInt(10, a);
    } else {
      a = randomInt(100, 800);
      b = randomInt(10, a);
    }
    correct = a - b;
  } else if (op === "x") {
    if (difficulty === "medium") {
      a = randomInt(2, 5);
      b = randomInt(1, 10);
    } else {
      a = randomInt(2, 9);
      b = randomInt(2, 10);
    }
    correct = a * b;
    if (Math.random() > 0.5) [a, b] = [b, a];
  } else {
    // Division
    let divisor;
    if (difficulty === "medium") divisor = randomInt(2, 5);
    else divisor = randomInt(2, 9);
    correct = randomInt(1, 10);
    a = divisor * correct; // Dividend
    b = divisor;
  }

  const opSymbol = op === "/" ? "÷" : op;
  const text = `${a} ${opSymbol} ${b} = ?`;

  return {
    id: Math.random().toString(36).substr(2, 9),
    category: "calculation",
    text,
    correctAnswer: correct,
    options: generateOptions(correct),
  };
};

export const generatePatternQuestion = (
  difficulty: Difficulty = "medium",
): Question => {
  // Types: addition sequence (+2, +3, +5, +10) or subtraction sequence
  const isAscending = Math.random() > 0.4;
  let steps = [2, 3, 5, 10];
  if (difficulty === "easy") steps = [1, 2, 5];
  if (difficulty === "hard") steps = [3, 4, 6, 7, 8, 9];
  const step = steps[randomInt(0, steps.length - 1)];

  let start;
  let sequence = [];

  if (isAscending) {
    if (difficulty === "easy") start = randomInt(1, 20);
    else if (difficulty === "medium") start = randomInt(5, 50);
    else start = randomInt(50, 200);
    sequence = [
      start,
      start + step,
      start + step * 2,
      start + step * 3,
      start + step * 4,
    ];
  } else {
    // Descending
    if (difficulty === "easy") start = randomInt(20, 50);
    else if (difficulty === "medium") start = randomInt(40, 100);
    else start = randomInt(100, 300);
    sequence = [
      start,
      start - step,
      start - step * 2,
      start - step * 3,
      start - step * 4,
    ];
  }

  // Replace one with missing
  const missingIndex = randomInt(1, 4); // don't replace the first one
  const correct = sequence[missingIndex];
  // Using -999 as sentinel for missing
  sequence[missingIndex] = -999;

  return {
    id: Math.random().toString(36).substr(2, 9),
    category: "patterns",
    text: `Điền số thích hợp vào dấu ?`,
    correctAnswer: correct,
    options: generateOptions(correct),
    visuals: {
      type: "sequence",
      data: sequence,
    },
  };
};

export const generateBondQuestion = (
  difficulty: Difficulty = "medium",
): Question => {
  // Number bonds (Part-Part-Whole)
  let whole;
  if (difficulty === "easy") whole = randomInt(10, 20);
  else if (difficulty === "medium") whole = randomInt(20, 100);
  else whole = randomInt(100, 500);

  const part1 = randomInt(5, whole - 5);
  const part2 = whole - part1;
  const isFindingWhole = Math.random() > 0.6; // 60% chance to find part, 40% to find whole

  let correct;
  let visualData;

  if (isFindingWhole) {
    correct = whole;
    visualData = { whole: "?", p1: part1, p2: part2 };
  } else {
    const findingP1 = Math.random() > 0.5;
    if (findingP1) {
      correct = part1;
      visualData = { whole: whole, p1: "?", p2: part2 };
    } else {
      correct = part2;
      visualData = { whole: whole, p1: part1, p2: "?" };
    }
  }

  return {
    id: Math.random().toString(36).substr(2, 9),
    category: "bonds",
    text: `Tìm số còn thiếu trong sơ đồ tách gộp:`,
    correctAnswer: correct,
    options: generateOptions(correct),
    visuals: {
      type: "bond",
      data: visualData,
    },
  };
};

export const generateWordProblemQuestion = (
  difficulty: Difficulty = "medium",
): Question => {
  const n1 = "Thiên Minh";
  const friends = ["Gia Bảo", "Lan", "Mai", "Tuấn", "Hùng"];
  const n2 = friends[randomInt(0, friends.length - 1)];

  const types = [
    "queue",
    "age",
    "legs",
    "shopping",
    "distribution",
    "difference",
  ];
  const type = types[randomInt(0, types.length - 1)];

  let text = "";
  let correct = 0;

  if (type === "queue") {
    const front = randomInt(2, 9);
    const back = randomInt(2, 9);
    text = `${n1} đang xếp hàng mua kem. Phía trước có ${front} người, phía sau có ${back} người. Hỏi hàng xếp có tất cả bao nhiêu người?`;
    correct = front + back + 1;
  } else if (type === "age") {
    const sum = randomInt(15, 25);
    const years = randomInt(2, 5);
    text = `Tổng số tuổi của ${n1} và em gái hiện nay là ${sum} tuổi. Hỏi ${years} năm nữa tổng số tuổi của hai anh em là bao nhiêu?`;
    correct = sum + years * 2;
  } else if (type === "legs") {
    const chickens = randomInt(1, 6);
    const dogs = randomInt(1, 4);
    text = `Trong sân có ${chickens} con gà và ${dogs} con chó. Hỏi ${n1} đếm được tất cả bao nhiêu cái chân?`;
    correct = chickens * 2 + dogs * 4;
  } else if (type === "shopping") {
    const price1 = randomInt(2, 5) * 10;
    const price2 = randomInt(1, 3) * 10;
    const total = price1 + price2;
    const given = Math.ceil((total + randomInt(10, 30)) / 50) * 50;
    text = `${n1} mua vở giá ${price1}k và bút giá ${price2}k. ${n1} đưa cô bán hàng tờ ${given}k. Hỏi cô phải trả lại bao nhiêu tiền (k)?`;
    correct = given - total;
  } else if (type === "distribution") {
    const count = randomInt(3, 6);
    const candies_each = randomInt(4, 9);
    const left = randomInt(1, count - 1);
    const total = count * candies_each + left;
    text = `${n1} có ${total} viên kẹo, chia đều cho ${count} bạn thì mỗi bạn được nhiều nhất mấy viên?`;
    correct = candies_each;
  } else {
    // difference
    const a = randomInt(20, 50);
    const b = randomInt(10, 20);
    text = `${n1} sưu tầm được ${a} thẻ bài Pokemon, nhiều hơn ${n2} ${b} thẻ. Hỏi ${n2} có bao nhiêu thẻ bài?`;
    correct = a - b;
  }

  // Adjust for easy difficulty
  if (difficulty === "easy" && ["distribution", "age", "legs"].includes(type)) {
    const a = randomInt(5, 20);
    const b = randomInt(2, 10);
    text = `${n1} có ${a} quả bóng. ${n2} cho thêm ${b} quả nữa. Hỏi ${n1} có tất cả bao nhiêu quả bóng?`;
    correct = a + b;
  }

  return {
    id: Math.random().toString(36).substr(2, 9),
    category: "word_problems",
    text,
    correctAnswer: correct,
    options: generateOptions(correct),
  };
};

export const generateGeometryQuestion = (
  difficulty: Difficulty = "medium",
): Question => {
  const n1 = "Thiên Minh";

  const types = [
    "polygon_vertex",
    "polygon_side",
    "perimeter_square",
    "perimeter_rect",
    "cubes_building",
  ];
  const type = types[randomInt(0, types.length - 1)];

  let text = "";
  let correct = 0;

  if (type === "polygon_vertex") {
    const polygons = [
      { n: "viên gạch hình tam giác", s: 3 },
      { n: "khung tranh hình chữ nhật", s: 4 },
      { n: "ngôi sao biển 5 cánh (giống ngũ giác)", s: 5 },
      { n: "tổ ong hình lục giác", s: 6 },
    ];
    const p = polygons[randomInt(0, 3)];
    text = `Một ${p.n} có tất cả bao nhiêu góc (đỉnh)?`;
    correct = p.s;
  } else if (type === "polygon_side") {
    const polygons = [
      { n: "biển báo hình tam giác", s: 3 },
      { n: "cái bàn hình vuông", s: 4 },
    ];
    const p = polygons[randomInt(0, 1)];
    const count = randomInt(2, 5);
    text = `Mỗi ${p.n} có ${p.s} cạnh. Hỏi ${count} cái như vậy có tổng cộng bao nhiêu cạnh?`;
    correct = p.s * count;
  } else if (type === "perimeter_square") {
    const side = randomInt(3, 10);
    text = `Khu vườn hình vuông của ${n1} có cạnh dài ${side}m. Hỏi hàng rào bao quanh khu vườn dài bao nhiêu mét?`;
    correct = side * 4;
  } else if (type === "perimeter_rect") {
    const l = randomInt(5, 12);
    const w = randomInt(2, l - 1);
    text = `${n1} muốn làm khung cho một bức tranh hình chữ nhật. Tranh dài ${l}cm, rộng ${w}cm. Cần bao nhiêu cm gỗ để làm khung?`;
    correct = (l + w) * 2;
  } else {
    // cubes_building
    const layers = randomInt(2, 4);
    const perLayer = randomInt(2, 5);
    text = `${n1} xếp một toà tháp. Tháp có ${layers} tầng, mỗi tầng dùng ${perLayer} khối gỗ. Tháp dùng tất cả bao nhiêu khối gỗ?`;
    correct = layers * perLayer;
  }

  // Adjust for difficulty
  if (
    difficulty === "easy" &&
    ["perimeter_square", "perimeter_rect"].includes(type)
  ) {
    const p = [
      { n: "tam giác", s: 3 },
      { n: "hình vuông", s: 4 },
    ];
    const sel = p[randomInt(0, 1)];
    text = `Một ${sel.n} có bao nhiêu đỉnh?`;
    correct = sel.s;
  }

  return {
    id: Math.random().toString(36).substr(2, 9),
    category: "geometry",
    text,
    correctAnswer: correct,
    options: generateOptions(correct),
  };
};

export const generateTimeQuestion = (
  difficulty: Difficulty = "medium",
): Question => {
  const n1 = "Thiên Minh";
  const friends = ["Gia Bảo", "Lan", "Mai", "Tuấn", "Hùng"];
  const n2 = friends[randomInt(0, friends.length - 1)];

  const types = [
    "duration",
    "calendar",
    "clock_math",
    "days_diff",
    "speed_logic",
  ];
  const type = types[randomInt(0, types.length - 1)];

  let text = "";
  let correct = 0;

  if (type === "duration") {
    const hrs = randomInt(1, 3);
    const mins = randomInt(1, 5) * 10;
    text = `${n1} xem phim từ 14:00 đến ${14 + hrs}:${mins < 10 ? "0" + mins : mins}. Hỏi phim kéo dài bao nhiêu phút?`;
    correct = hrs * 60 + mins;
  } else if (type === "calendar") {
    const weeks = randomInt(2, 4);
    const days = randomInt(1, 6);
    text = `${n1} về quê nội ${weeks} tuần và ${days} ngày. Hỏi ${n1} về quê tất cả bao nhiêu ngày?`;
    correct = weeks * 7 + days;
  } else if (type === "clock_math") {
    const h = randomInt(7, 10);
    text = `Đồng hồ đang chỉ ${h} giờ. ${n1} hẹn ${n2} đi bắt Pokemon sau 3 tiếng rưỡi nữa. Hỏi lúc đó là mấy giờ phút? (Ví dụ: 10 giờ rưỡi -> nhập 1030)`;
    correct = (h + 3) * 100 + 30; // e.g. 1030, 1130

    // Custom options for time format
    const options = new Set<number>();
    options.add(correct);
    options.add(correct - 100);
    options.add(correct + 100);
    options.add(correct + 30);
    return {
      id: Math.random().toString(36).substr(2, 9),
      category: "time",
      text,
      correctAnswer: correct,
      options: Array.from(options).sort(() => Math.random() - 0.5),
    };
  } else if (type === "days_diff") {
    const today = randomInt(2, 6); // thứ 2 đến 6
    const passed = randomInt(2, 5);
    const th = [null, null, "Hai", "Ba", "Tư", "Năm", "Sáu", "Bảy"];
    text = `Hôm nay là thứ ${th[today]}. Hỏi ${passed} ngày nữa là thứ mấy? (Nhập số: ví dụ thứ Năm nhập 5, Chủ Nhật nhập 8)`;
    correct = today + passed;
    if (correct > 8) correct = correct - 7;
  } else {
    // speed_logic
    const speedPerMin = randomInt(2, 5);
    const mins = randomInt(3, 8);
    text = `Trong một trò chơi, mỗi vòng kéo dài 1 phút ${n1} ghi được ${speedPerMin} điểm. Hỏi sau ${mins} vòng ${n1} ghi được bao nhiêu điểm?`;
    correct = speedPerMin * mins;
  }

  // Adjust for easy difficulty
  if (difficulty === "easy" && ["clock_math", "days_diff"].includes(type)) {
    const hrs = randomInt(2, 5);
    text = `${hrs} giờ bằng bao nhiêu phút?`;
    correct = hrs * 60;
  }

  return {
    id: Math.random().toString(36).substr(2, 9),
    category: "time",
    text,
    correctAnswer: correct,
    options: generateOptions(correct),
  };
};

export const generateLogicQuestion = (
  difficulty: Difficulty = "medium",
): Question => {
  const n1 = "Thiên Minh";
  const types = [
    "tree_planting",
    "height_ranking",
    "cutting_wood",
    "weight_balance",
    "pages_torn",
    "legs_count",
    "pigeonhole_marbles",
    "pigeonhole_socks",
    "logic_ranking_names",
    "logic_ages",
    "fake_coin",
    "calendar_sunday",
    "logic_match_name_flower",
    "logic_books_cover",
    "logic_vase_flowers",
    "logic_train_cars",
    "logic_fruit_boxes",
    "logic_cats_mice",
    "logic_birthday_month",
    "logic_river_crossing",
    "logic_day_of_week",
    "logic_deer_line",
  ];
  const type = types[randomInt(0, types.length - 1)];

  let text = "";
  let correct: number | string = 0;
  let optionsSet = new Set<number | string>();
  let useOptionsSet = false;

  if (type === "tree_planting") {
    const length = randomInt(4, 10) * 2;
    const interval = 2;
    text = `IKMC Kangaroo: Đoạn đường dài ${length}m. Người ta trồng các cây cách đều nhau ${interval}m. Biết rằng cả 2 đầu đường đều có cây. Hỏi có tất cả bao nhiêu cây?`;
    correct = length / interval + 1;
  } else if (type === "pigeonhole_marbles") {
    const c1 = randomInt(8, 12);
    const c2 = randomInt(7, 10);
    const c3 = randomInt(8, 12);
    const c4 = randomInt(2, 5);
    const target = randomInt(5, 7);
    text = `Trong túi có ${c1} viên đỏ, ${c2} viên xanh, ${c3} viên vàng và ${c4} viên trắng. Không nhìn vào túi, cần lấy ít nhất bao nhiêu viên bi để HOÀN TOÀN CHẮC CHẮN chứa ${target} viên bi CÙNG MỘT MÀU?`;
    let worstCase = 0;
    [c1, c2, c3, c4].forEach((c) => {
      if (c >= target) worstCase += target - 1;
      else worstCase += c;
    });
    correct = worstCase + 1;
  } else if (type === "pigeonhole_socks") {
    const pairs = randomInt(3, 6);
    text = `Trong tủ đồ có ${pairs} đôi bít tất khác nhau (có phân biệt chiếc trái và phải). Không nhìn vào tủ, em cần lấy ngẫu nhiên ít nhất mấy chiếc để CHẮC CHẮN CÓ 1 đôi bít tất?`;
    correct = pairs + 1;
  } else if (type === "logic_ranking_names") {
    text = `Trí, Dũng, Minh chia nhau 3 giải Nhất, Nhì, Ba. Trí không đạt giải Nhất, Dũng không đạt giải Nhì, Minh không đạt giải Nhất và Ba. Hỏi ai đạt giải Nhất?`;
    correct = "Dũng";
    optionsSet = new Set(["Trí", "Dũng", "Minh"]);
    useOptionsSet = true;
  } else if (type === "logic_ages") {
    text = `Tí nhiều tuổi hơn Sửu. Dần ít tuổi hơn Mão. Sửu nhiều tuổi hơn Mão. Hỏi bạn nào ít tuổi nhất?`;
    correct = "Dần";
    optionsSet = new Set(["Tí", "Sửu", "Mão", "Dần"]);
    useOptionsSet = true;
  } else if (type === "fake_coin") {
    text = `Có 9 đồng tiền, 1 đồng Nhẹ Hơn. Chỉ dùng một chiếc cân đĩa thăng bằng (không quả cân), em cần cân ÍT NHẤT mấy lần để chắc chắn tìm ra đồng tiền nhẹ đó?`;
    correct = 2;
    optionsSet = new Set([2, 3, 4, 1]);
    useOptionsSet = true;
  } else if (type === "calendar_sunday") {
    text = `Trong một tháng Hai (năm nhuận) có 5 ngày Chủ Nhật. Hỏi ngày 14 của tháng đó là thứ mấy trong tuần?`;
    correct = "Thứ Bảy";
    optionsSet = new Set(["Thứ Hai", "Thứ Sáu", "Thứ Bảy", "Chủ Nhật"]);
    useOptionsSet = true;
  } else if (type === "logic_match_name_flower") {
    text = `Cúc, Đào, Hồng nhặt hoa cúc, đào, hồng. Ai nhặt màu đó thì KHÔNG trùng tên với mình. Bạn lấy hoa hồng nói với Cúc. Hỏi Cúc đã lấy chiếc hoa nào?`;
    correct = "Hoa Đào";
    optionsSet = new Set(["Hoa Đào", "Hoa Cúc", "Hoa Hồng"]);
    useOptionsSet = true;
  } else if (type === "logic_books_cover") {
    text = `Văn, Toán, Địa lí bọc 3 màu xanh, đỏ, vàng. Sách đỏ đặt giữa Văn và Địa. Sách Địa và xanh mua cùng ngày. Hỏi sách Toán bọc màu gì?`;
    correct = "Màu Đỏ";
    optionsSet = new Set(["Màu Xanh", "Màu Đỏ", "Màu Vàng"]);
    useOptionsSet = true;
  } else if (type === "logic_vase_flowers") {
    text = `Lan chọn 10 bông hoa (gồm hồng và cúc). Số hoa hồng NHIỀU HƠN số hoa cúc. Lan nhắm mắt rút đại 5 bông bất kỳ. Trong 5 bông đó chắc chắn có ÍT NHẤT mấy bông hoa hồng?`;
    correct = 1;
    optionsSet = new Set([1, 2, 3, 4, 5]);
    useOptionsSet = true;
  } else if (type === "logic_train_cars") {
    text = `Một đoàn tàu 4 toa Đỏ, Xanh, Trắng, Vàng. Xanh không đầu không cuối. Vàng không cạnh Trắng và không cạnh Đỏ. Toa đầu là Trắng. Toa cuối cùng màu gì?`;
    correct = "Vàng";
    optionsSet = new Set(["Đỏ", "Xanh", "Trắng", "Vàng"]);
    useOptionsSet = true;
  } else if (type === "logic_fruit_boxes") {
    text = `3 hộp đựng quả dán nhãn bị sai TOÀN BỘ: hộp “Táo”, hộp “Cam”, và hộp “Táo và Cam”. Bạn được BÍ MẬT lấy 1 quả từ 1 chiếc hộp tuỳ ý để có thể xác định tất cả. Chọn lấy từ hộp dán nhãn nào?`;
    correct = "Táo và Cam";
    optionsSet = new Set(["Táo", "Cam", "Táo và Cam"]);
    useOptionsSet = true;
  } else if (type === "height_ranking") {
    text = `Logic Tiêu Chuẩn: A cao hơn B. C thấp hơn B. D cao hơn A. Hỏi ai là người thấp nhất?`;
    correct = "Người C";
    optionsSet = new Set(["Người A", "Người B", "Người C", "Người D"]);
    useOptionsSet = true;
  } else if (type === "cutting_wood") {
    const pieces = randomInt(4, 8);
    const minsPerCut = randomInt(2, 5);
    text = `Đánh thức tài năng Toán (Terry Chew): Bác thợ mộc cần cưa khúc gỗ thành ${pieces} đoạn. Mỗi lần cưa mất ${minsPerCut} phút. Hỏi bác phải mất tổng cộng bao nhiêu phút mới cưa xong?`;
    correct = (pieces - 1) * minsPerCut;
  } else if (type === "weight_balance") {
    const ratio1 = randomInt(2, 4);
    const ratio2 = randomInt(2, 3);
    text = `SASMO Math: Trên bàn cân, 1 quả táo nặng bằng ${ratio1} quả dâu. 1 quả cam nặng bằng ${ratio2} quả táo. Hỏi 1 quả cam nặng bằng bao nhiêu quả dâu?`;
    correct = ratio1 * ratio2;
  } else if (type === "pages_torn") {
    const start = randomInt(11, 20);
    const end = start + randomInt(2, 5);
    text = `Toán Logic: Một quyển sách bị rách phần giữa, từ trang số ${start} đến trang số ${end}. Hỏi quyển sách bị mất đi bao nhiêu trang?`;
    correct = end - start + 1;
  } else if (type === "logic_cats_mice") {
    text = `3 con mèo bắt 3 con chuột trong 3 phút. Hỏi 100 con mèo bắt 100 con chuột trong bao nhiêu phút?`;
    correct = 3;
    optionsSet = new Set([3, 100, 1, 9]);
    useOptionsSet = true;
  } else if (type === "logic_birthday_month") {
    text = `Một lớp học có 40 học sinh. Chắc chắn có ÍT NHẤT bao nhiêu bạn có ngày sinh nhật CÙNG MỘT tháng?`;
    correct = 4;
    optionsSet = new Set([3, 4, 12, 1]);
    useOptionsSet = true;
  } else if (type === "logic_river_crossing") {
    text = `Đưa Sói, Cừu, Bắp Cải qua sông. Thuyền chở được người và 1 thứ. Vắng người Sói sẽ ăn Cừu, Cừu sẽ ăn Bắp Cải. Cần ÍT NHẤT mấy chuyến đò (1 lượt qua hoặc về tính là 1 chuyến) để đưa tất cả qua an toàn?`;
    correct = 7;
    optionsSet = new Set([5, 6, 7, 8]);
    useOptionsSet = true;
  } else if (type === "logic_day_of_week") {
    text = `Nếu 3 ngày trước hôm nay là Thứ Tư, thì 4 ngày sau hôm nay sẽ là Thứ mấy?`;
    correct = "Thứ Tư";
    optionsSet = new Set(["Thứ Hai", "Thứ Ba", "Thứ Bảy", "Thứ Tư"]);
    useOptionsSet = true;
  } else if (type === "logic_deer_line") {
    text = `Một đàn nai đi trong rừng. Con đi trước đứng trước 2 con, con đi giữa đứng giữa 2 con, con đi sau đứng sau 2 con. Hỏi đàn nai đó có ÍT NHẤT mấy con?`;
    correct = 3;
    optionsSet = new Set([3, 4, 5, 6]);
    useOptionsSet = true;
  } else {
    // chicken & rabbits logic mini
    const totalHeads = randomInt(3, 5); // 3-5 con
    const bunnies = randomInt(1, totalHeads - 1);
    const chickens = totalHeads - bunnies;
    const totalLegs = bunnies * 4 + chickens * 2;
    text = `Kangaroo Math: Trong chuồng có gà và thỏ. Bạn ${n1} đếm được ${totalHeads} con và ${totalLegs} chân. Hỏi có bao nhiêu con thỏ?`;
    correct = bunnies;
  }

  return {
    id: Math.random().toString(36).substring(2, 9),
    category: "logic",
    text,
    correctAnswer: correct,
    options: useOptionsSet
      ? Array.from(optionsSet).sort(() => Math.random() - 0.5)
      : generateOptions(correct),
  };
};

export const generateQuestion = (
  category: Category,
  difficulty: Difficulty = "medium",
): Question => {
  let selectedCategory = category;
  if (selectedCategory === "mixed") {
    const categories: Category[] = [
      "calculation",
      "patterns",
      "bonds",
      "word_problems",
      "geometry",
      "time",
      "logic",
    ];
    selectedCategory = categories[randomInt(0, categories.length - 1)];
  }

  switch (selectedCategory) {
    case "calculation":
      return generateCalculationQuestion(difficulty);
    case "patterns":
      return generatePatternQuestion(difficulty);
    case "bonds":
      return generateBondQuestion(difficulty);
    case "word_problems":
      return generateWordProblemQuestion(difficulty);
    case "geometry":
      return generateGeometryQuestion(difficulty);
    case "time":
      return generateTimeQuestion(difficulty);
    case "logic":
      return generateLogicQuestion(difficulty);
    default:
      return generateCalculationQuestion(difficulty);
  }
};
