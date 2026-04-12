import { useEffect, useMemo, useRef, useState } from "react";

const VERSES = [
  "Colossians 3:23 — Whatever you do, work at it with all your heart, as working for the Lord.",
  "Philippians 4:13 — I can do all things through Christ who strengthens me.",
  "Galatians 6:9 — Let us not grow weary in doing good.",
  "1 Timothy 4:8 — Physical training is of some value, but godliness has value for all things.",
];

const ALL_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware",
  "Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky",
  "Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi",
  "Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico",
  "New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania",
  "Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont",
  "Virginia","Washington","West Virginia","Wisconsin","Wyoming",
];

const QUESTION_FLOW = [
  { key: "coachName", label: "Before we start, what do you want to call your Coach?", type: "text" },
  { key: "firstName", label: "And what’s your first name?", type: "text" },
  { key: "age", label: "How old are you?", type: "number" },
  { key: "state", label: "What state do you live in?", type: "select", options: ALL_STATES },
  { key: "gender", label: "Are you a man or a woman?", type: "choice", options: ["Woman", "Man"] },
  {
    key: "pregnancyStatus",
    label: "Are you currently pregnant, postpartum, or neither?",
    type: "choice",
    options: ["Pregnant", "Postpartum", "No"],
    showIf: (profile) => profile.gender === "Woman",
  },
  {
    key: "pregnancyTrimester",
    label: "Which trimester are you in?",
    type: "choice",
    options: ["First", "Second", "Third"],
    showIf: (profile) =>
      profile.gender === "Woman" && profile.pregnancyStatus === "Pregnant",
  },
  {
    key: "pregnancyRestrictions",
    label: "Has your doctor told you to avoid any movements or activities?",
    type: "text",
    showIf: (profile) =>
      profile.gender === "Woman" && profile.pregnancyStatus === "Pregnant",
  },
  {
    key: "pregnancySymptoms",
    label: "Any pain, pressure, dizziness, or discomfort I should know about?",
    type: "text",
    showIf: (profile) =>
      profile.gender === "Woman" && profile.pregnancyStatus === "Pregnant",
  },
  {
    key: "postpartumTime",
    label: "How far postpartum are you right now?",
    type: "text",
    showIf: (profile) =>
      profile.gender === "Woman" && profile.pregnancyStatus === "Postpartum",
  },
  {
    key: "deliveryType",
    label: "Was delivery vaginal or C-section? You can also say skip.",
    type: "text",
    showIf: (profile) =>
      profile.gender === "Woman" && profile.pregnancyStatus === "Postpartum",
  },
  {
    key: "postpartumConcerns",
    label: "Any core, pelvic floor, back, bleeding, or recovery issues I should know about?",
    type: "text",
    showIf: (profile) =>
      profile.gender === "Woman" && profile.pregnancyStatus === "Postpartum",
  },
  { key: "relationshipStatus", label: "What’s your current relationship status?", type: "text" },
  { key: "denomination", label: "What denomination are you, if any?", type: "text" },
  { key: "whyStarted", label: "What made you want to start this right now?", type: "text" },
  { key: "lifeChange", label: "What are you hoping changes in your life because of this?", type: "text" },
  {
    key: "activityLevel",
    label: "How active are you right now?",
    type: "choice",
    options: ["Beginner", "Somewhat active", "Active"],
  },
  {
    key: "hasLimitations",
    label: "Do you have any injuries, disabilities, pain, or physical limitations I should know about?",
    type: "choice",
    options: ["Yes", "No"],
  },
  {
    key: "limitationType",
    label: "Is it more of an injury, a disability, chronic pain, or something else?",
    type: "text",
    showIf: (profile) => profile.hasLimitations === "Yes",
  },
  {
    key: "limitationName",
    label: "What is it called, or how would you describe it?",
    type: "text",
    showIf: (profile) => profile.hasLimitations === "Yes",
  },
  {
    key: "limitationDuration",
    label: "How long have you been dealing with it?",
    type: "text",
    showIf: (profile) => profile.hasLimitations === "Yes",
  },
  {
    key: "activityLimit",
    label: "How active can you comfortably be right now?",
    type: "text",
    showIf: (profile) => profile.hasLimitations === "Yes",
  },
  { key: "mainGoal", label: "What are you trying to improve right now with your body or health?", type: "text" },
  { key: "bodyFocus", label: "What part of your body, routine, or fitness do you want to improve first?", type: "text" },
  { key: "foodPreferences", label: "Any food preferences, dislikes, or allergies?", type: "text" },
];

const QUICK_REPLIES = [
  "Simplify my day",
  "Adjust my routine",
  "Help with food today",
  "I feel discouraged",
  "Pray for me",
  "Where do I put my measurements?",
  "What’s my routine?",
];

const COLOR_OPTIONS = [
  { name: "Granite Blue", primary: "#20242d", accent: "#4f8edc", tint: "#dbeafe" },
  { name: "Granite Purple", primary: "#241f29", accent: "#8b5cf6", tint: "#ede9fe" },
  { name: "Granite Teal", primary: "#1e2628", accent: "#14b8a6", tint: "#ccfbf1" },
  { name: "Granite Rose", primary: "#2a2124", accent: "#e11d48", tint: "#ffe4e6" },
];

const MEASUREMENT_FIELDS = [
  { key: "weight", label: "Weight", tip: "body weight" },
  { key: "chest", label: "Chest", tip: "fullest part" },
  { key: "waist", label: "Waist", tip: "narrowest part" },
  { key: "highHip", label: "High Hip", tip: "upper hip" },
  { key: "hip", label: "Hip", tip: "fullest part" },
  { key: "thigh", label: "Thigh", tip: "upper thigh" },
  { key: "arm", label: "Arm", tip: "upper arm" },
  { key: "calf", label: "Calf", tip: "fullest part" },
];

const fadeStyle = `
  @keyframes verseFade {
    0% { opacity: 0; transform: translateY(8px); }
    100% { opacity: 1; transform: translateY(0); }
  }
`;

function capitalizeName(value) {
  if (!value || typeof value !== "string") return "";
  return value
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function normalizeProfile(profile) {
  return {
    coachName: "",
    firstName: "",
    age: "",
    state: "",
    gender: "",
    pregnancyStatus: "",
    pregnancyTrimester: "",
    pregnancyRestrictions: "",
    pregnancySymptoms: "",
    postpartumTime: "",
    deliveryType: "",
    postpartumConcerns: "",
    relationshipStatus: "",
    denomination: "",
    whyStarted: "",
    lifeChange: "",
    activityLevel: "",
    hasLimitations: "",
    limitationType: "",
    limitationName: "",
    limitationDuration: "",
    activityLimit: "",
    mainGoal: "",
    bodyFocus: "",
    foodPreferences: "",
    measurements: {},
    measurementHistory: [],
    measurementUnit: "Inches",
    onboardingComplete: false,
    onboardingStage: "",
    activeMeasurementField: "",
    createdAt: "",
    coachMemory: {
      recurringTopics: [],
      preferredFoods: [],
      avoidedFoods: [],
      allergies: [],
      slangWords: [],
      phrasePatterns: [],
      toneStyle: "balanced",
      ageStyle: "neutral",
      lastMeasurementUpdate: "",
      lastRoutineFeedback: "",
      lastRoutineFeedbackReason: "",
      weeklyCheckins: [],
    },
    ...profile,
    coachName: capitalizeName(profile.coachName),
    firstName: capitalizeName(profile.firstName),
    limitationType: capitalizeName(profile.limitationType),
    limitationName: capitalizeName(profile.limitationName),
    measurements: profile.measurements || {},
    measurementHistory: profile.measurementHistory || [],
    measurementUnit: profile.measurementUnit || "Inches",
    coachMemory: {
      recurringTopics: [],
      preferredFoods: [],
      avoidedFoods: [],
      allergies: [],
      slangWords: [],
      phrasePatterns: [],
      toneStyle: "balanced",
      ageStyle: "neutral",
      lastMeasurementUpdate: "",
      lastRoutineFeedback: "",
      lastRoutineFeedbackReason: "",
      weeklyCheckins: [],
      ...(profile.coachMemory || {}),
    },
  };
}

function getVisibleQuestionFlow(profile) {
  return QUESTION_FLOW.filter((q) => !q.showIf || q.showIf(profile));
}

function cleanCoachBubbleText(text, coachName = "Coach") {
  if (!text) return "";
  const cleanName = capitalizeName(coachName) || "Coach";
  return text
    .replace(new RegExp(`^${cleanName}:\\s*`, "i"), "")
    .replace(/^Coach:\s*/i, "");
}

function buildMeasurementSnapshot(profile) {
  return {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    measurements: { ...(profile.measurements || {}) },
  };
}

function detectSlang(text = "") {
  const lower = text.toLowerCase();
  const candidates = [
    "fr", "lowkey", "highkey", "bet", "nah", "yall", "omg", "ngl", "tbh",
    "idk", "rn", "bc", "tho", "yep", "nope", "kinda", "lemme", "gonna", "wanna",
  ];
  return candidates.filter((word) => lower.includes(word));
}

function detectToneStyle(text = "", age) {
  const lower = text.toLowerCase();
  if (lower.includes("be direct") || lower.includes("just tell me")) return "direct";
  if (lower.includes("be gentle") || lower.includes("encourage me")) return "gentle";
  if (age && Number(age) <= 18) return "younger";
  return "balanced";
}

function updateLanguageMemory(profile, text) {
  const slang = detectSlang(text);
  const toneStyle = detectToneStyle(text, profile.age);

  const phrasePatterns = [];
  if (text.includes("...")) phrasePatterns.push("ellipsis");
  if (/[!?]{2,}/.test(text)) phrasePatterns.push("extraPunctuation");
  if (text === text.toLowerCase() && /[a-z]/.test(text)) phrasePatterns.push("lowercase");

  const existingSlang = profile.coachMemory?.slangWords || [];
  const existingPatterns = profile.coachMemory?.phrasePatterns || [];

  return {
    ...profile,
    coachMemory: {
      ...profile.coachMemory,
      slangWords: [...new Set([...existingSlang, ...slang])].slice(-12),
      phrasePatterns: [...new Set([...existingPatterns, ...phrasePatterns])].slice(-8),
      toneStyle,
      ageStyle: profile.age && Number(profile.age) <= 18 ? "teen" : "adult",
    },
  };
}

function getUserVoicePrefix(profile) {
  const slang = profile.coachMemory?.slangWords || [];
  const tone = profile.coachMemory?.toneStyle || "balanced";

  if (tone === "direct") return "Alright";
  if (tone === "gentle") return "I’m with you";
  if (slang.includes("lowkey")) return "Lowkey";
  if (slang.includes("fr")) return "For real";
  if (slang.includes("ngl")) return "Ngl";
  return "Okay";
}

function getGoalType(profile) {
  const goal = (profile.mainGoal || "").toLowerCase();
  if (goal.includes("weight")) return "weight-loss";
  if (goal.includes("muscle") || goal.includes("strength")) return "strength";
  if (goal.includes("discipline")) return "discipline";
  return "general";
}

function getRoutineData(profile) {
  const goalType = getGoalType(profile);
  const beginner = profile.activityLevel === "Beginner";
  const pregnant = profile.pregnancyStatus === "Pregnant";
  const postpartum = profile.pregnancyStatus === "Postpartum";

  if (pregnant || postpartum || beginner) {
    return {
      title: "Foundation Day",
      summary: "A gentle full-body day focused on consistency and good form.",
      blocks: [
        "5 min easy warmup walk",
        "2 x 10 bodyweight squats",
        "2 x 8 incline push-ups",
        "2 x 10 glute bridges",
        "2 x 20 sec plank or dead bug",
        "5–10 min recovery walk",
      ],
    };
  }

  if (goalType === "strength") {
    return {
      title: "Strength Day",
      summary: "Controlled reps, steady tension, and simple bodyweight strength work.",
      blocks: [
        "3 x 10 push-ups",
        "3 x 15 squats",
        "3 x 10 reverse lunges each leg",
        "3 x 20 sec hollow hold",
        "Short cooldown stretch",
      ],
    };
  }

  if (goalType === "weight-loss") {
    return {
      title: "Cardio Calisthenics Day",
      summary: "Simple movement with a little more pace.",
      blocks: [
        "3 rounds jumping jacks",
        "3 x 12 squat to knee drive",
        "3 x 20 sec mountain climbers",
        "3 x 10 reverse lunges each leg",
        "10–20 min walk",
      ],
    };
  }

  return {
    title: "Balanced Full-Body Day",
    summary: "A steady full-body session built for consistency.",
    blocks: [
      "3 x 8 push-ups",
      "3 x 12 squats",
      "3 x 8 lunges each leg",
      "3 x 20 sec plank",
      "5–10 min walk",
    ],
  };
}

function getCoachMessage(profile) {
  const name = capitalizeName(profile.firstName);
  const goalType = getGoalType(profile);
  const prefix = getUserVoicePrefix(profile);

  let message = `${prefix}${name ? `, ${name}` : ""} — let’s keep today steady.`;
  let focus = "Consistency over perfection.";
  let action = "Do your routine and keep your meals simple.";

  if (goalType === "strength") {
    focus = "Controlled reps and honest effort.";
    action = "Hit your main sets and make protein a priority.";
  } else if (goalType === "weight-loss") {
    focus = "Simple movement plus simple food choices.";
    action = "Get the workout done and add a walk if you can.";
  } else if (goalType === "discipline") {
    focus = "Follow-through matters more than perfect feelings.";
    action = "Finish the plan even if you scale it down.";
  }

  return {
    speaker: capitalizeName(profile.coachName) || "Coach",
    message,
    focus,
    action,
  };
}

function parseFoodSignals(text = "") {
  const lower = text.toLowerCase();
  const preferred = [];
  const avoided = [];
  const allergies = [];

  ["chicken", "eggs", "fruit", "rice", "yogurt", "oats", "beef", "salmon"].forEach((food) => {
    if (lower.includes(food)) preferred.push(food);
  });

  if (lower.includes("don't like") || lower.includes("dont like") || lower.includes("hate")) {
    ["fish", "broccoli", "eggs", "oatmeal"].forEach((food) => {
      if (lower.includes(food)) avoided.push(food);
    });
  }

  if (lower.includes("allergic")) {
    ["dairy", "gluten", "peanut", "peanuts", "nuts", "eggs"].forEach((item) => {
      if (lower.includes(item)) allergies.push(item);
    });
  }

  return { preferred, avoided, allergies };
}

function getNutritionTargets(profile) {
  const age = Number(profile.age) || 18;
  const goalType = getGoalType(profile);
  const activity = profile.activityLevel || "Somewhat active";
  const weight = Number(profile.measurements?.weight) || 140;
  const pregnant = profile.pregnancyStatus === "Pregnant";
  const postpartum = profile.pregnancyStatus === "Postpartum";

  let protein = Math.round(weight * 0.7);
  let water = Math.max(64, Math.round(weight * 0.5));
  let calories = 1800;

  if (activity === "Active") calories += 300;
  if (activity === "Beginner") calories -= 100;

  if (goalType === "strength") {
    protein = Math.round(weight * 0.85);
    calories += 200;
  }

  if (goalType === "weight-loss") {
    protein = Math.round(weight * 0.8);
    calories -= 200;
  }

  if (pregnant) {
    calories += 250;
    protein += 20;
    water += 16;
  }

  if (postpartum) {
    protein += 15;
    water += 16;
  }

  if (age < 18) {
    calories += 100;
  }

  return {
    calories,
    protein,
    water,
    carbsFocus: goalType === "strength" ? "moderate to higher" : "moderate",
    fatsFocus: "steady healthy fats",
  };
}

function getFoodGuidance(profile) {
  const targets = getNutritionTargets(profile);
  return `Aim for about ${targets.protein}g protein, around ${targets.water} oz water, and meals built around protein, carbs for energy, and steady healthy fats.`;
}

function getMealIdeas(profile) {
  const goalType = getGoalType(profile);
  const allergiesText = (profile.foodPreferences || "").toLowerCase();
  const avoidDairy = allergiesText.includes("dairy");
  const avoidEggs = allergiesText.includes("egg");
  const avoidGluten = allergiesText.includes("gluten");

  const recipes = [
    {
      title: "Protein Oat Bowl",
      fit: "breakfast",
      why: "Easy protein and carbs to start the day.",
      items: [
        avoidGluten ? "gluten-free oats" : "oats",
        avoidDairy ? "almond milk" : "milk or yogurt",
        "berries",
        avoidEggs ? "protein powder or nut butter" : "eggs on the side",
      ],
    },
    {
      title: "Chicken Rice Plate",
      fit: "lunch",
      why: "Simple, high-protein, and easy to repeat.",
      items: ["grilled chicken", "rice", "vegetables", "olive oil or avocado"],
    },
    {
      title: "Greek Yogurt Snack",
      fit: "snack",
      why: "Quick protein option.",
      items: avoidDairy ? ["fruit", "turkey slices", "nuts if tolerated"] : ["greek yogurt", "fruit", "granola"],
    },
    {
      title: "Salmon or Beef Dinner",
      fit: "dinner",
      why: "Protein plus filling carbs and micronutrients.",
      items: ["salmon or lean beef", "potatoes or rice", "vegetables"],
    },
  ];

  if (goalType === "weight-loss") {
    recipes.push({
      title: "High-Protein Wrap Bowl",
      fit: "easy meal",
      why: "Keeps you full without overcomplicating things.",
      items: ["lean protein", "lettuce or rice", "beans", "salsa", "veggies"],
    });
  }

  if (goalType === "strength") {
    recipes.push({
      title: "Post-Workout Plate",
      fit: "recovery",
      why: "Protein plus carbs for recovery.",
      items: ["chicken or beef", "rice or potatoes", "fruit", "water"],
    });
  }

  return recipes;
}

function getAIResponse(input, profile) {
  const lower = input.toLowerCase();
  const coachName = capitalizeName(profile.coachName) || "Coach";
  const prefix = getUserVoicePrefix(profile);
  const name = capitalizeName(profile.firstName);

  if (lower.includes("pray")) {
    return `${coachName}: Lord, give ${name || "them"} peace, strength, wisdom, and steady faith today. Amen.`;
  }

  if (
    lower.includes("food") ||
    lower.includes("meal") ||
    lower.includes("protein") ||
    lower.includes("recipe")
  ) {
    const targets = getNutritionTargets(profile);
    return `${coachName}: ${prefix}${name ? `, ${name}` : ""} — for today, aim for about ${targets.protein}g protein and ${targets.water} oz water. Keep meals simple and built around protein first.`;
  }

  if (
    lower.includes("routine") ||
    lower.includes("workout") ||
    lower.includes("today")
  ) {
    const routine = getRoutineData(profile);
    return `${coachName}: ${prefix}${name ? `, ${name}` : ""} — your routine today is ${routine.title}. Start with: ${routine.blocks.slice(0, 3).join(", ")}.`;
  }

  if (
    lower.includes("discouraged") ||
    lower.includes("behind") ||
    lower.includes("tired")
  ) {
    return `${coachName}: ${prefix}${name ? `, ${name}` : ""} — a rough day does not erase your progress. Smaller still counts.`;
  }

  return `${coachName}: ${prefix}${name ? `, ${name}` : ""} — tell me if you want help with routine, food, progress, or prayer.`;
}

function GearIcon({ size = 18 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
      <defs>
        <linearGradient id="gearGrad" x1="0" x2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>
      </defs>
      <path
        d="M12 8.6a3.4 3.4 0 1 0 0 6.8 3.4 3.4 0 0 0 0-6.8Zm8 3.4-.98-.3a7.71 7.71 0 0 0-.38-.92l.52-.89a1 1 0 0 0-.15-1.22l-1.58-1.58a1 1 0 0 0-1.22-.15l-.89.52c-.3-.14-.6-.27-.92-.38L14 4a1 1 0 0 0-.98-.75h-2.04A1 1 0 0 0 10 4l-.3.98c-.32.1-.62.24-.92.38l-.89-.52a1 1 0 0 0-1.22.15L5.1 6.57a1 1 0 0 0-.15 1.22l.52.89c-.14.3-.27.6-.38.92L4 10a1 1 0 0 0-.75.98v2.04A1 1 0 0 0 4 14l.98.3c.1.32.24.62.38.92l-.52.89a1 1 0 0 0 .15 1.22l1.58 1.58a1 1 0 0 0 1.22.15l.89-.52c.3.14.6.27.92.38l.3.98a1 1 0 0 0 .98.75h2.04A1 1 0 0 0 14 20l.3-.98c.32-.1.62-.24.92-.38l.89.52a1 1 0 0 0 1.22-.15l1.58-1.58a1 1 0 0 0 .15-1.22l-.52-.89c.14-.3.27-.6.38-.92l.98-.3a1 1 0 0 0 .75-.98v-2.04A1 1 0 0 0 20 12Z"
        fill="url(#gearGrad)"
        stroke="#64748b"
        strokeWidth="1.2"
      />
    </svg>
  );
}

function TourMeasurementDiagram({ activePart, onSelectPart }) {
  const accent = "#4f8edc";
  return (
    <div style={diagramCard}>
      <svg viewBox="0 0 360 420" style={{ width: "100%", display: "block" }}>
        <circle cx="180" cy="70" r="26" fill="none" stroke="#222" strokeWidth="2" />
        <path d="M180 96 L180 250" stroke="#222" strokeWidth="2" />
        <path d="M130 135 L230 135" stroke="#222" strokeWidth="2" />
        <path d="M145 135 L130 210 L142 270" stroke="#222" strokeWidth="2" fill="none" />
        <path d="M215 135 L230 210 L218 270" stroke="#222" strokeWidth="2" fill="none" />
        <path d="M160 250 L152 345 L163 385" stroke="#222" strokeWidth="2" fill="none" />
        <path d="M200 250 L208 345 L197 385" stroke="#222" strokeWidth="2" fill="none" />

{[
  { key: "chest", y: 135, label: "CHEST" },
  { key: "waist", y: 185, label: "WAIST" },
  { key: "highHip", y: 210, label: "HIGH HIP" },
  { key: "hip", y: 230, label: "HIP" },
  { key: "thigh", y: 300, label: "THIGH" },
  { key: "calf", y: 350, label: "CALF" },
].map((item) => (
          <g key={item.key} onClick={() => onSelectPart(item.key)} style={{ cursor: "pointer" }}>
            <rect
              x="18"
              y={item.y - 12}
              width="90"
              height="24"
              rx="8"
              fill={activePart === item.key ? `${accent}22` : "#fff"}
              stroke={accent}
              strokeWidth="2"
            />
            <text x="63" y={item.y + 4} textAnchor="middle" fontSize="11" fontWeight="800" fill="#111">
              {item.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export default function App() {
  const [verseIndex, setVerseIndex] = useState(0);
  const [screen, setScreen] = useState("welcome");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [activeTab, setActiveTab] = useState("home");
  const [chatInput, setChatInput] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const appChatRef = useRef(null);

  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem("christian-fitness-profile");
return saved
  ? normalizeProfile(JSON.parse(saved))
  : normalizeProfile({
      coachName: "",
      firstName: "",
      age: "",
      state: "",
      gender: "",
      pregnancyStatus: "",
      pregnancyTrimester: "",
      pregnancyRestrictions: "",
      pregnancySymptoms: "",
      postpartumTime: "",
      deliveryType: "",
      postpartumConcerns: "",
      relationshipStatus: "",
      denomination: "",
      whyStarted: "",
      lifeChange: "",
      activityLevel: "",
      hasLimitations: "",
      limitationType: "",
      limitationName: "",
      limitationDuration: "",
      activityLimit: "",
      mainGoal: "",
      bodyFocus: "",
      foodPreferences: "",
      measurements: {},
      measurementHistory: [],
      measurementUnit: "Inches",
      onboardingComplete: false,
      onboardingStage: "",
      activeMeasurementField: "",
      createdAt: "",
      coachMemory: {
        recurringTopics: [],
        preferredFoods: [],
        avoidedFoods: [],
        allergies: [],
        slangWords: [],
        phrasePatterns: [],
        toneStyle: "balanced",
        ageStyle: "neutral",
        lastMeasurementUpdate: "",
        lastRoutineFeedback: "",
        lastRoutineFeedbackReason: "",
        weeklyCheckins: [],
      },
    });
  });

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("christian-fitness-messages");
    return saved
      ? JSON.parse(saved)
      : [
          { role: "ai", text: "Hey — I’m here to help you build a routine that cares for your body and honors God too." },
          { role: "ai", text: "We’ll keep this simple and take it one step at a time." },
        ];
  });

  const [chatMessages, setChatMessages] = useState(() => {
    const saved = localStorage.getItem("christian-fitness-chat");
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedTheme, setSelectedTheme] = useState(() => {
    const saved = localStorage.getItem("christian-fitness-theme");
    return saved ? JSON.parse(saved) : COLOR_OPTIONS[0];
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setVerseIndex((current) => (current + 1) % VERSES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = fadeStyle;
    document.head.appendChild(styleTag);
    return () => document.head.removeChild(styleTag);
  }, []);

  useEffect(() => {
    localStorage.setItem("christian-fitness-profile", JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem("christian-fitness-messages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem("christian-fitness-chat", JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    localStorage.setItem("christian-fitness-theme", JSON.stringify(selectedTheme));
  }, [selectedTheme]);

  useEffect(() => {
    const el = appChatRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  }, [chatMessages]);

  const visibleQuestionFlow = getVisibleQuestionFlow(profile);
  const currentQuestion = visibleQuestionFlow[questionIndex];
const routineData = useMemo(() => getRoutineData(profile), [profile]);
const coach = useMemo(() => getCoachMessage(profile), [profile]);
const nutrition = useMemo(() => getNutritionTargets(profile), [profile]);
const mealIdeas = useMemo(() => getMealIdeas(profile), [profile]);
const foodGuidance = useMemo(() => getFoodGuidance(profile), [profile]);

function startOnboarding() {
  setScreen("onboarding");
  setQuestionIndex(0);
  if (messages.length <= 2) {
    setMessages((current) => [
      ...current,
      { role: "ai", text: QUESTION_FLOW[0].label },
    ]);
  }
}

function submitAnswer(answerOverride) {
  const answer =
    typeof answerOverride === "string" ? answerOverride : inputValue.trim();
  if (!currentQuestion || !answer) return;

  const safeAnswer =
    typeof answer === "string" &&
    answer.toLowerCase() === "skip" &&
    currentQuestion.type === "text"
      ? ""
      : answer;

  const normalizedAnswer =
    currentQuestion.key === "coachName" || currentQuestion.key === "firstName"
      ? capitalizeName(safeAnswer)
      : safeAnswer;

  const nextProfile = normalizeProfile({
    ...profile,
    [currentQuestion.key]: normalizedAnswer,
  });

  setMessages((current) => [...current, { role: "user", text: safeAnswer }]);
  setProfile(nextProfile);
  setInputValue("");

  const nextFlow = getVisibleQuestionFlow(nextProfile);
  const nextIndex = questionIndex + 1;

  if (nextIndex < nextFlow.length) {
    setQuestionIndex(nextIndex);
    setMessages((current) => [
      ...current,
      { role: "ai", text: nextFlow[nextIndex].label },
    ]);
    return;
  }

  setProfile({
    ...nextProfile,
    onboardingComplete: true,
    onboardingStage: "done",
    createdAt: nextProfile.createdAt || new Date().toISOString(),
  });
  setScreen("home");
  setActiveTab("home");
}

  function sendChatMessage(text) {
    const cleanText = text.trim();
    if (!cleanText) return;

    let nextProfile = updateLanguageMemory(profile, cleanText);
    const foodSignals = parseFoodSignals(cleanText);

    nextProfile = {
      ...nextProfile,
      coachMemory: {
        ...nextProfile.coachMemory,
        preferredFoods: [...new Set([...(nextProfile.coachMemory.preferredFoods || []), ...foodSignals.preferred])].slice(-12),
        avoidedFoods: [...new Set([...(nextProfile.coachMemory.avoidedFoods || []), ...foodSignals.avoided])].slice(-12),
        allergies: [...new Set([...(nextProfile.coachMemory.allergies || []), ...foodSignals.allergies])].slice(-12),
      },
    };

    setProfile(nextProfile);

    const coachName = capitalizeName(nextProfile.coachName) || "Coach";
    const userMsg = { role: "user", text: cleanText };
    const aiMsg = {
      role: "ai",
      speaker: coachName,
      text: getAIResponse(cleanText, nextProfile),
    };

    setChatMessages((prev) => [...prev, userMsg, aiMsg]);
    setChatInput("");
  }

function saveMeasurementValue(fieldKey, value) {
  setProfile((current) => {
    const nextMeasurements = {
      ...current.measurements,
      [fieldKey]: value,
    };

    const now = new Date().toISOString();
    const lastUpdate = current.coachMemory?.lastMeasurementUpdate;

    const shouldCreateSnapshot =
      !lastUpdate ||
      new Date(now).getTime() - new Date(lastUpdate).getTime() >
        1000 * 60 * 60 * 24;

    return {
      ...current,
      measurements: nextMeasurements,
      measurementHistory: shouldCreateSnapshot
        ? [
            ...(current.measurementHistory || []),
            buildMeasurementSnapshot({
              ...current,
              measurements: nextMeasurements,
            }),
          ].slice(-24)
        : current.measurementHistory || [],
      coachMemory: {
        ...current.coachMemory,
        lastMeasurementUpdate: now,
      },
    };
  });
}

function resetApp() {
  localStorage.removeItem("christian-fitness-profile");
  localStorage.removeItem("christian-fitness-messages");
  localStorage.removeItem("christian-fitness-chat");
  localStorage.removeItem("christian-fitness-theme");

  setProfile(normalizeProfile({}));
  setMessages([
    {
      role: "ai",
      text: "Hey — I’m here to help you build a routine that cares for your body and honors God too.",
    },
    {
      role: "ai",
      text: "We’ll keep this simple and take it one step at a time.",
    },
  ]);
  setChatMessages([]);
  setSelectedTheme(COLOR_OPTIONS[0]);
  setScreen("welcome");
  setQuestionIndex(0);
  setInputValue("");
  setActiveTab("home");
  setChatInput("");
  setShowSettings(false);
}
  const appStyles = {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #050506 0%, #121317 40%, #ededee 100%)",
    color: "white",
    fontFamily: "Inter, Arial, sans-serif",
    display: "flex",
    justifyContent: "center",
    padding: 16,
  };

  const phoneStyles = {
    width: "100%",
    maxWidth: 390,
    minHeight: "95vh",
    borderRadius: 34,
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(18px)",
    boxShadow: "0 24px 60px rgba(0,0,0,0.28)",
    border: "1px solid rgba(255,255,255,0.12)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    position: "relative",
  };

  if (!profile.onboardingComplete && screen === "welcome") {
    return (
      <div style={appStyles}>
        <div style={phoneStyles}>
          <div style={welcomeWrap}>
            <div style={brandBlock}>
              <h1 style={brandTitle}>
                <span>Christian</span>
                <span>Fitness</span>
              </h1>
              <div style={tickerViewport}>
                <div key={verseIndex} style={tickerText}>
                  {VERSES[verseIndex]}
                </div>
              </div>
            </div>
            <div style={welcomeCard}>
              <h2 style={welcomeHeading}>Christian Wellness Coach</h2>
              <p style={welcomeCopy}>Build your body with purpose.</p>
              <button style={primaryButton} onClick={startOnboarding}>
                Start
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile.onboardingComplete && screen === "onboarding") {
    return (
      <div style={appStyles}>
        <div style={phoneStyles}>
          <div style={topBar}>
            <div>
              <h2 style={{ margin: 0 }}>Christian Fitness</h2>
              <p style={subtleText}>
                Question {questionIndex + 1} of {visibleQuestionFlow.length}
              </p>
            </div>
          </div>

          <div style={onboardingChatArea}>
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                style={{
                  display: "flex",
                  justifyContent: message.role === "ai" ? "flex-start" : "flex-end",
                }}
              >
                <div style={{ maxWidth: "82%" }}>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      opacity: 0.75,
                      marginBottom: 6,
                      color: "white",
                      textAlign: message.role === "ai" ? "left" : "right",
                    }}
                  >
                    {message.role === "ai"
                      ? `Coach ${capitalizeName(profile.coachName) || "Coach"}`
                      : capitalizeName(profile.firstName) || "You"}
                  </div>
                  <div style={{ ...bubbleBase, ...(message.role === "ai" ? aiBubble : userBubble) }}>
                    {message.text}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={inputArea}>
            {currentQuestion?.type === "choice" ? (
              <div style={choiceWrap}>
                {currentQuestion.options.map((option) => (
                  <button key={option} style={choiceButton} onClick={() => submitAnswer(option)}>
                    {option}
                  </button>
                ))}
              </div>
            ) : currentQuestion?.type === "select" ? (
              <>
                <select
                  style={selectInput}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                >
                  <option value="">Select your state...</option>
                  {currentQuestion.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <button style={primaryButton} onClick={() => submitAnswer()} disabled={!inputValue}>
                  Send
                </button>
              </>
            ) : (
              <>
                <input
                  style={textInput}
                  value={inputValue}
                  type={currentQuestion?.type === "number" ? "number" : "text"}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your answer..."
                />
                <button style={primaryButton} onClick={() => submitAnswer()}>
                  Send
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  const homeBodyBackground = `linear-gradient(180deg, #f7f7f8 0%, ${selectedTheme.tint} 100%)`;

  return (
    <div style={appStyles}>
      <div style={phoneStyles}>
        <div
          style={{
            ...homeHeader,
            background: `linear-gradient(135deg, ${selectedTheme.primary}, ${selectedTheme.accent})`,
            color: "#fff",
          }}
        >
          <div style={headerTopRow}>
            <button
              onClick={() => setShowSettings(true)}
              style={settingsIconButton}
              aria-label="Open settings"
              title="Settings"
            >
              <GearIcon size={18} />
            </button>

            <div style={{ flex: 1, textAlign: "center" }}>
              <h1 style={homeBrandTitle}>
                <span style={{ display: "block" }}>Christian</span>
                <span style={{ display: "block" }}>Fitness</span>
              </h1>
            </div>

            <div style={{ width: 42 }} />
          </div>

          <div style={tickerViewportHome}>
            <div key={verseIndex} style={tickerTextHome}>
              {VERSES[verseIndex]}
            </div>
          </div>
        </div>

        <div style={{ ...homeBody, background: homeBodyBackground }}>
          {activeTab === "home" && (
            <>
              <div style={coachCard}>
                <p style={sectionLabelWhite}>{coach.speaker}</p>
                <h2 style={cardTitle}>{coach.message}</h2>
                <p style={bodyTextWhite}>
                  <strong>Daily focus:</strong> {coach.focus}
                </p>
                <p style={bodyTextWhite}>
                  <strong>Today’s action:</strong> {coach.action}
                </p>
              </div>

              <div style={dailyCard}>
                <p style={sectionLabel}>Today’s Routine</p>
                <h3 style={cardTitle}>{routineData.title}</h3>
                <p style={bodyText}>{routineData.summary}</p>
                <button style={secondaryButton} onClick={() => setActiveTab("routine")}>
                  Open full routine
                </button>
              </div>

              <div style={verseCard}>
                <p style={sectionLabel}>Daily verse</p>
                <h3 style={cardTitle}>{VERSES[verseIndex]}</h3>
              </div>

              <div style={dailyCard}>
                <p style={sectionLabel}>Food guidance</p>
<p style={bodyTextLast}>{foodGuidance}</p>
              </div>

              <div style={dailyCard}>
                <p style={sectionLabel}>Coach language memory</p>
                <p style={bodyText}>
                  <strong>Tone style:</strong> {profile.coachMemory?.toneStyle || "balanced"}
                </p>
                <p style={bodyText}>
                  <strong>Detected slang:</strong>{" "}
                  {profile.coachMemory?.slangWords?.length
                    ? profile.coachMemory.slangWords.join(", ")
                    : "none yet"}
                </p>
                <p style={bodyTextLast}>
                  Coach mirrors language lightly, clearly, and without cursing.
                </p>
              </div>

              <button
                style={primaryDarkButton}
                onClick={() => {
                  const nextProfile = {
                    ...profile,
                    coachMemory: {
                      ...profile.coachMemory,
                      toneStyle: "direct",
                    },
                  };
                  setProfile(nextProfile);
                  setChatMessages((prev) => [
                    ...prev,
                    {
                      role: "ai",
                      speaker: capitalizeName(profile.coachName) || "Coach",
                      text: getAIResponse("simplify my day", nextProfile),
                    },
                  ]);
                  setActiveTab("routine");
                }}
              >
                Simplify My Day
              </button>
            </>
          )}

          {activeTab === "routine" && (
            <>
              <div style={dailyCard}>
                <p style={sectionLabel}>Generated routine</p>
                <h2 style={cardTitle}>{routineData.title}</h2>
                <p style={bodyText}>{routineData.summary}</p>
              </div>

              <div style={routineSectionCard}>
                <h3 style={routineSectionTitle}>Today’s blocks</h3>
                {routineData.blocks.map((block) => (
                  <p key={block} style={bodyText}>
                    • {block}
                  </p>
                ))}
              </div>

              <button style={secondaryButton} onClick={() => setActiveTab("home")}>
                Back to Home
              </button>
            </>
          )}

          {activeTab === "chat" && (
            <>
              <div style={coachCard}>
                <p style={sectionLabelWhite}>{capitalizeName(profile.coachName) || "Coach"}</p>
                <h2 style={cardTitle}>
                  {profile.firstName ? `Welcome back, ${capitalizeName(profile.firstName)}.` : "Welcome back."}
                </h2>
                <p style={bodyTextWhite}>Tell me what you need.</p>
              </div>

              <div ref={appChatRef} style={appChatHistory}>
                {chatMessages.map((msg, index) => (
                  <div
                    key={`${msg.role}-${index}`}
                    style={{
                      display: "flex",
                      justifyContent: msg.role === "ai" ? "flex-start" : "flex-end",
                    }}
                  >
                    <div style={{ maxWidth: "82%" }}>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          opacity: 0.78,
                          marginBottom: 6,
                          color: "#111",
                          textAlign: msg.role === "ai" ? "left" : "right",
                        }}
                      >
                        {msg.role === "ai"
                          ? `Coach ${capitalizeName(profile.coachName) || "Coach"}`
                          : capitalizeName(profile.firstName) || "You"}
                      </div>
                      <div style={{ ...bubbleBase, ...(msg.role === "ai" ? aiBubbleSolid : userBubbleLight) }}>
                        {msg.role === "ai" ? cleanCoachBubbleText(msg.text, profile.coachName) : msg.text}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={quickReplyWrap}>
                {QUICK_REPLIES.map((item) => (
                  <button key={item} style={quickReplyButton} onClick={() => sendChatMessage(item)}>
                    {item}
                  </button>
                ))}
              </div>

              <div style={inputAreaLight}>
                <input
                  style={textInputLight}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type a message..."
                />
                <button style={primaryDarkButton} onClick={() => sendChatMessage(chatInput)}>
                  Send
                </button>
              </div>
            </>
          )}

          {activeTab === "progress" && (
            <>
              <div style={dailyCard}>
                <p style={sectionLabel}>Progress</p>
                <h2 style={cardTitle}>Measurements</h2>
                <p style={bodyTextLast}>Add or update your measurements below.</p>
              </div>

              <div style={routineSectionCard}>
                <h3 style={routineSectionTitle}>Your Measurements</h3>

                <div style={unitToggleWrap}>
                  <button
                    style={profile.measurementUnit === "Inches" ? unitToggleActive : unitToggleButton}
                    onClick={() => setProfile((current) => ({ ...current, measurementUnit: "Inches" }))}
                  >
                    Inches
                  </button>
                  <button
                    style={profile.measurementUnit === "Centimeters" ? unitToggleActive : unitToggleButton}
                    onClick={() => setProfile((current) => ({ ...current, measurementUnit: "Centimeters" }))}
                  >
                    Centimeters
                  </button>
                </div>

                <div style={measurementGrid}>
                  {MEASUREMENT_FIELDS.map((field) => (
                    <div
                      key={field.key}
                      style={{
                        ...measurementCard,
                        border:
                          profile.activeMeasurementField === field.key
                            ? "2px solid #111111"
                            : "1px solid rgba(0,0,0,0.08)",
                      }}
                    >
                      <div style={measurementCardTop}>
                        <span style={measurementLabel}>{field.label}</span>
                        <span style={measurementTip}>? {field.tip}</span>
                      </div>

                      <div style={measurementInputRow}>
                        <input
                          style={measurementSmallInput}
                          value={profile.measurements?.[field.key] || ""}
                          onFocus={() =>
                            setProfile((current) => ({
                              ...current,
                              activeMeasurementField: field.key,
                            }))
                          }
                          onChange={(e) => saveMeasurementValue(field.key, e.target.value)}
                          placeholder="0"
                        />
                        <span style={measurementUnitText}>
                          {profile.measurementUnit === "Centimeters"
                            ? "cm"
                            : field.key === "weight"
                            ? "lb"
                            : "in"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={routineSectionCard}>
                <h3 style={routineSectionTitle}>How to measure</h3>
                <TourMeasurementDiagram
                  activePart={profile.activeMeasurementField}
                  onSelectPart={(part) =>
                    setProfile((current) => ({
                      ...current,
                      activeMeasurementField: part,
                    }))
                  }
                />
              </div>
            </>
          )}

          {activeTab === "food" && (
            <>
              <div style={dailyCard}>
                <p style={sectionLabel}>Food</p>
                <h2 style={cardTitle}>Nutrition built for you</h2>
                <p style={bodyText}>
                  This page uses your age, goal, activity level, food preferences, and any pregnancy/postpartum info.
                </p>
                <p style={bodyTextLast}>
                  <strong>Main goal:</strong> {profile.mainGoal || "Not set yet"}
                </p>
              </div>

              <div style={routineSectionCard}>
                <h3 style={routineSectionTitle}>Daily targets</h3>
                <p style={bodyText}><strong>Calories:</strong> about {nutrition.calories} daily</p>
                <p style={bodyText}><strong>Protein:</strong> about {nutrition.protein}g daily</p>
                <p style={bodyText}><strong>Water:</strong> about {nutrition.water} oz daily</p>
                <p style={bodyText}><strong>Carb focus:</strong> {nutrition.carbsFocus}</p>
                <p style={bodyTextLast}><strong>Fat focus:</strong> {nutrition.fatsFocus}</p>
              </div>

              <div style={routineSectionCard}>
                <h3 style={routineSectionTitle}>Why this matters</h3>
                <p style={bodyText}>
                  <strong>Protein:</strong> helps recovery, muscle support, fullness, and steady progress.
                </p>
                <p style={bodyText}>
                  <strong>Carbs:</strong> help with energy for workouts and daily life.
                </p>
                <p style={bodyTextLast}>
                  <strong>Water:</strong> supports energy, recovery, and how you feel through the day.
                </p>
              </div>

              <div style={routineSectionCard}>
                <h3 style={routineSectionTitle}>Meal ideas</h3>
                {mealIdeas.map((meal) => (
                  <div key={meal.title} style={mealCard}>
                    <p style={mealTitle}>{meal.title}</p>
                    <p style={bodyText}><strong>Best for:</strong> {meal.fit}</p>
                    <p style={bodyText}><strong>Why:</strong> {meal.why}</p>
                    <p style={bodyTextLast}>
                      <strong>Build it with:</strong> {meal.items.join(", ")}
                    </p>
                  </div>
                ))}
              </div>

              <div style={routineSectionCard}>
                <h3 style={routineSectionTitle}>Saved food memory</h3>
                <p style={bodyText}>
                  <strong>Preferred foods:</strong>{" "}
                  {profile.coachMemory?.preferredFoods?.length
                    ? profile.coachMemory.preferredFoods.join(", ")
                    : "none yet"}
                </p>
                <p style={bodyText}>
                  <strong>Avoided foods:</strong>{" "}
                  {profile.coachMemory?.avoidedFoods?.length
                    ? profile.coachMemory.avoidedFoods.join(", ")
                    : "none yet"}
                </p>
                <p style={bodyTextLast}>
                  <strong>Allergies:</strong>{" "}
                  {profile.coachMemory?.allergies?.length
                    ? profile.coachMemory.allergies.join(", ")
                    : "none yet"}
                </p>
              </div>
            </>
          )}
        </div>

        <div style={bottomNav}>
          <button style={activeTab === "home" ? navButtonActive : navButton} onClick={() => setActiveTab("home")}>
            Home
          </button>
          <button style={activeTab === "routine" ? navButtonActive : navButton} onClick={() => setActiveTab("routine")}>
            Routine
          </button>
          <button style={activeTab === "chat" ? navButtonActive : navButton} onClick={() => setActiveTab("chat")}>
            Chat
          </button>
          <button style={activeTab === "progress" ? navButtonActive : navButton} onClick={() => setActiveTab("progress")}>
            Progress
          </button>
          <button style={activeTab === "food" ? navButtonActive : navButton} onClick={() => setActiveTab("food")}>
            Food
          </button>
        </div>

        {showSettings && (
          <div style={tourOverlay} onClick={() => setShowSettings(false)}>
            <div style={settingsModal} onClick={(e) => e.stopPropagation()}>
              <p style={sectionLabel}>Settings</p>
              <h3 style={{ marginTop: 8, marginBottom: 12 }}>App settings</h3>

              <div style={routineSectionCard}>
                <p style={bodyText}><strong>Coach name:</strong> {capitalizeName(profile.coachName) || "Coach"}</p>
                <p style={bodyText}><strong>User name:</strong> {capitalizeName(profile.firstName) || "Not set"}</p>
                <p style={bodyText}><strong>Goal:</strong> {profile.mainGoal || "Not set"}</p>
                <p style={bodyTextLast}><strong>Activity:</strong> {profile.activityLevel || "Not set"}</p>
              </div>

              <div style={routineSectionCard}>
                <h3 style={routineSectionTitle}>Theme</h3>
                <div style={{ display: "grid", gap: 8 }}>
                  {COLOR_OPTIONS.map((option) => (
                    <button
                      key={option.name}
                      onClick={() => setSelectedTheme(option)}
                      style={{
                        ...themeOptionButton,
                        border:
                          selectedTheme.name === option.name
                            ? `2px solid ${option.accent}`
                            : "1px solid rgba(0,0,0,0.08)",
                      }}
                    >
                      <span
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 999,
                          background: `linear-gradient(135deg, ${option.primary}, ${option.accent})`,
                          display: "inline-block",
                        }}
                      />
                      {option.name}
                    </button>
                  ))}
                </div>
              </div>

              <button
                style={secondaryButton}
                onClick={() =>
                  setProfile((current) => ({
                    ...current,
                    coachMemory: {
                      ...current.coachMemory,
                      recurringTopics: [],
                      preferredFoods: [],
                      avoidedFoods: [],
                      allergies: [],
                      slangWords: [],
                      phrasePatterns: [],
                      toneStyle: "balanced",
                    },
                  }))
                }
              >
                Clear coach memory
              </button>

              <button style={dangerButton} onClick={resetApp}>
                Reset App
              </button>

              <button style={primaryDarkButton} onClick={() => setShowSettings(false)}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const welcomeWrap = {
  minHeight: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  padding: 22,
  paddingTop: 10,
  paddingBottom: 70,
  background: "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
};

const brandBlock = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  textAlign: "center",
  paddingTop: 90,
};

const brandTitle = {
  margin: 0,
  fontSize: 56,
  fontWeight: 800,
  letterSpacing: "-0.05em",
  lineHeight: 0.9,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 2,
};

const tickerViewport = {
  marginTop: 24,
  minHeight: 110,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  width: "100%",
  padding: "0 12px",
};

const tickerText = {
  color: "rgba(255,255,255,0.92)",
  fontSize: 19,
  lineHeight: 1.5,
  maxWidth: 720,
  animation: "verseFade 0.45s ease",
};

const welcomeCard = {
  background: "rgba(255,255,255,0.14)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 28,
  padding: 18,
  marginBottom: 18,
};

const welcomeHeading = {
  margin: "0 0 4px",
  fontSize: 24,
  fontWeight: 700,
  lineHeight: 1.15,
};

const welcomeCopy = {
  margin: "0 0 16px",
  color: "rgba(255,255,255,0.78)",
  fontSize: 14,
  lineHeight: 1.35,
};

const primaryButton = {
  width: "100%",
  border: "none",
  borderRadius: 18,
  padding: "15px 18px",
  background: "rgba(255,255,255,0.9)",
  color: "#111",
  fontWeight: 700,
  fontSize: 16,
  cursor: "pointer",
};

const secondaryButton = {
  width: "100%",
  border: "1px solid rgba(0,0,0,0.1)",
  borderRadius: 18,
  padding: "14px 16px",
  background: "#ffffff",
  color: "#111",
  fontWeight: 700,
  fontSize: 15,
  cursor: "pointer",
  marginTop: 12,
};

const primaryDarkButton = {
  width: "100%",
  border: "none",
  borderRadius: 18,
  padding: "15px 18px",
  background: "#111111",
  color: "white",
  fontWeight: 700,
  fontSize: 16,
  cursor: "pointer",
};

const topBar = {
  padding: "20px 18px 10px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const subtleText = {
  margin: "6px 0 0",
  color: "rgba(255,255,255,0.7)",
  fontSize: 13,
};

const onboardingChatArea = {
  flex: 1,
  overflowY: "auto",
  padding: "12px 16px 0",
  display: "flex",
  flexDirection: "column",
  gap: 12,
  minHeight: 0,
};

const bubbleBase = {
  maxWidth: "82%",
  padding: "13px 15px",
  borderRadius: 20,
  lineHeight: 1.45,
  fontSize: 15,
};

const aiBubble = {
  background: "rgba(255,255,255,0.12)",
  color: "white",
  borderBottomLeftRadius: 8,
};

const aiBubbleSolid = {
  background: "#111111",
  color: "white",
  borderBottomLeftRadius: 8,
};

const userBubble = {
  background: "white",
  color: "#111",
  borderBottomRightRadius: 8,
};

const userBubbleLight = {
  background: "rgba(255,255,255,0.88)",
  color: "#111",
  borderBottomRightRadius: 8,
};

const inputArea = {
  padding: 16,
  display: "flex",
  flexDirection: "column",
  gap: 10,
};

const inputAreaLight = {
  display: "flex",
  flexDirection: "column",
  gap: 10,
};

const textInput = {
  width: "100%",
  boxSizing: "border-box",
  border: "1px solid rgba(255,255,255,0.15)",
  background: "rgba(255,255,255,0.08)",
  color: "white",
  borderRadius: 18,
  padding: "14px 16px",
  outline: "none",
  fontSize: 15,
};

const textInputLight = {
  width: "100%",
  boxSizing: "border-box",
  border: "1px solid rgba(0,0,0,0.08)",
  background: "rgba(255,255,255,0.9)",
  color: "#111",
  borderRadius: 18,
  padding: "14px 16px",
  outline: "none",
  fontSize: 15,
};

const choiceWrap = {
  display: "grid",
  gap: 10,
};

const choiceButton = {
  border: "1px solid rgba(255,255,255,0.15)",
  background: "rgba(255,255,255,0.08)",
  color: "white",
  borderRadius: 18,
  padding: "14px 16px",
  textAlign: "left",
  cursor: "pointer",
};

const selectInput = {
  width: "100%",
  boxSizing: "border-box",
  border: "1px solid rgba(255,255,255,0.15)",
  background: "#ffffff",
  color: "#111111",
  borderRadius: 18,
  padding: "14px 16px",
  outline: "none",
  fontSize: 15,
};

const homeHeader = {
  padding: 22,
};

const headerTopRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
};

const settingsIconButton = {
  width: 42,
  height: 42,
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.25)",
  background: "linear-gradient(145deg, rgba(255,255,255,0.32), rgba(255,255,255,0.12))",
  boxShadow: "inset 0 1px 1px rgba(255,255,255,0.35), 0 8px 18px rgba(0,0,0,0.28)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};

const homeBrandTitle = {
  margin: 0,
  lineHeight: 1,
};

const tickerViewportHome = {
  marginTop: 14,
  minHeight: 70,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
};

const tickerTextHome = {
  fontSize: 14,
  lineHeight: 1.5,
  opacity: 0.92,
  animation: "verseFade 0.45s ease",
};

const homeBody = {
  color: "#111",
  flex: 1,
  padding: 18,
  display: "flex",
  flexDirection: "column",
  gap: 14,
  overflowY: "auto",
};

const coachCard = {
  background: "#111111",
  color: "white",
  borderRadius: 24,
  padding: 18,
};

const dailyCard = {
  background: "rgba(255,255,255,0.86)",
  backdropFilter: "blur(10px)",
  borderRadius: 24,
  padding: 18,
  boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
};

const verseCard = {
  background: "rgba(255,255,255,0.86)",
  backdropFilter: "blur(10px)",
  borderRadius: 24,
  padding: 18,
  boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
};

const sectionLabel = {
  margin: 0,
  fontSize: 12,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  opacity: 0.7,
};

const sectionLabelWhite = {
  margin: 0,
  fontSize: 12,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  opacity: 0.9,
  color: "rgba(255,255,255,0.72)",
};

const cardTitle = {
  margin: "8px 0 10px",
  lineHeight: 1.3,
};

const bodyText = {
  margin: "0 0 10px",
  lineHeight: 1.5,
};

const bodyTextLast = {
  margin: 0,
  lineHeight: 1.5,
};

const bodyTextWhite = {
  margin: "0 0 10px",
  lineHeight: 1.5,
  color: "white",
};

const routineSectionCard = {
  background: "rgba(255,255,255,0.86)",
  backdropFilter: "blur(10px)",
  borderRadius: 24,
  padding: 18,
  boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
};

const routineSectionTitle = {
  marginTop: 0,
  marginBottom: 12,
};

const appChatHistory = {
  background: "rgba(255,255,255,0.86)",
  backdropFilter: "blur(10px)",
  borderRadius: 24,
  padding: 14,
  boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
  display: "flex",
  flexDirection: "column",
  gap: 12,
  maxHeight: 340,
  overflowY: "auto",
  minHeight: 0,
};

const quickReplyWrap = {
  display: "grid",
  gap: 8,
};

const quickReplyButton = {
  border: "1px solid rgba(0,0,0,0.08)",
  background: "rgba(255,255,255,0.9)",
  color: "#111",
  borderRadius: 18,
  padding: "14px 16px",
  textAlign: "left",
  cursor: "pointer",
  fontWeight: 600,
};

const bottomNav = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
  gap: 10,
  padding: 14,
  background: "#ffffff",
  borderTop: "1px solid rgba(0,0,0,0.06)",
};

const navButton = {
  border: "1px solid rgba(0,0,0,0.08)",
  background: "#f4f4f5",
  color: "#111",
  borderRadius: 16,
  padding: "14px 12px",
  fontWeight: 700,
  cursor: "pointer",
};

const navButtonActive = {
  border: "1px solid #111",
  background: "#111",
  color: "white",
  borderRadius: 16,
  padding: "14px 12px",
  fontWeight: 700,
  cursor: "pointer",
};

const unitToggleWrap = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 10,
  marginBottom: 14,
};

const unitToggleButton = {
  border: "1px solid rgba(0,0,0,0.08)",
  background: "#f4f4f5",
  color: "#111",
  borderRadius: 16,
  padding: "12px 14px",
  fontWeight: 700,
  cursor: "pointer",
};

const unitToggleActive = {
  border: "1px solid #111111",
  background: "#111111",
  color: "white",
  borderRadius: 16,
  padding: "12px 14px",
  fontWeight: 700,
  cursor: "pointer",
};

const measurementGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 12,
};

const measurementCard = {
  background: "#ffffff",
  borderRadius: 18,
  padding: 12,
};

const measurementCardTop = {
  display: "flex",
  flexDirection: "column",
  gap: 4,
  marginBottom: 10,
};

const measurementLabel = {
  fontWeight: 700,
  fontSize: 14,
  color: "#111",
};

const measurementTip = {
  fontSize: 12,
  color: "#6b7280",
};

const measurementInputRow = {
  display: "flex",
  alignItems: "center",
  gap: 8,
};

const measurementSmallInput = {
  width: "100%",
  boxSizing: "border-box",
  border: "1px solid rgba(0,0,0,0.08)",
  background: "#ffffff",
  color: "#111",
  borderRadius: 14,
  padding: "12px 12px",
  outline: "none",
  fontSize: 15,
};

const measurementUnitText = {
  minWidth: 24,
  fontSize: 13,
  fontWeight: 700,
  color: "#6b7280",
};

const diagramCard = {
  background: "#f8fafc",
  borderRadius: 18,
  padding: 14,
};

const tourOverlay = {
  position: "absolute",
  inset: 0,
  background: "rgba(0,0,0,0.45)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 18,
};

const settingsModal = {
  width: "100%",
  maxHeight: "80vh",
  overflowY: "auto",
  background: "white",
  color: "#111",
  borderRadius: 24,
  padding: 18,
  boxShadow: "0 24px 60px rgba(0,0,0,0.25)",
};

const themeOptionButton = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  gap: 10,
  borderRadius: 16,
  background: "#fff",
  padding: "12px 14px",
  cursor: "pointer",
};

const mealCard = {
  background: "#fff",
  border: "1px solid rgba(0,0,0,0.08)",
  borderRadius: 18,
  padding: 14,
  marginBottom: 10,
};

const mealTitle = {
  margin: "0 0 8px",
  fontWeight: 800,
  fontSize: 16,
};

const dangerButton = {
  width: "100%",
  border: "none",
  borderRadius: 18,
  padding: "15px 18px",
  background: "#111111",
  color: "white",
  fontWeight: 700,
  fontSize: 16,
  cursor: "pointer",
  marginTop: 8,
};
