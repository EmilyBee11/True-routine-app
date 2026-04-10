import { useEffect, useMemo, useRef, useState } from "react";

const VERSES = [
  "Colossians 3:23 — Whatever you do, work at it with all your heart, as working for the Lord, not for human masters.",
  "Colossians 3:23 — Whatever you do, work at it with all your heart, as working for the Lord.",
  "Philippians 4:13 — I can do all things through Christ who strengthens me.",
  "Galatians 6:9 — Let us not grow weary in doing good, for at the proper time we will reap a harvest if we do not give up.",
  "1 Timothy 4:8 — For physical training is of some value, but godliness has value for all things, holding promise for both the present life and the life to come.",
  "Galatians 6:9 — Let us not grow weary in doing good.",
  "1 Timothy 4:8 — Physical training is of some value, but godliness has value for all things.",
];

const ALL_STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

const QUESTION_FLOW = [
  {
    key: "coachName",
    label: "Before we start, what do you want to call your Coach?",
    type: "text",
  },
  {
    key: "firstName",
    label: "And what’s your first name?",
    type: "text",
  },
  {
    key: "age",
    label: "How old are you?",
    type: "number",
  },
{
  key: "state",
  label: "What state do you live in?",
  type: "select",
  options: ALL_STATES,
},
  {
    key: "gender",
    label: "Are you a man or a woman?",
    type: "choice",
    options: ["Woman", "Man"],
  },

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
  {
    key: "relationshipStatus",
    label: "What’s your current relationship status?",
    type: "text",
  },
  {
    key: "denomination",
    label: "What denomination are you, if any?",
    type: "text",
  },
  {
    key: "whyStarted",
    label: "What made you want to start this right now?",
    type: "text",
  },
  {
    key: "lifeChange",
    label: "What are you hoping changes in your life because of this?",
    type: "text",
  },

  {
    key: "activityLevel",
    label: "How active are you right now?",
    type: "choice",
    options: ["Beginner", "Somewhat active", "Active"],
  },
  {
    key: "hasLimitations",
    label:
      "Do you have any injuries, disabilities, pain, or physical limitations I should know about?",
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
  {
    key: "mainGoal",
    label: "What are you trying to improve right now with your body or health?",
    type: "text",
  },
  {
    key: "bodyFocus",
    label: "What part of your body, routine, or fitness do you want to improve first?",
    type: "text",
  },
  {
    key: "foodPreferences",
    label: "Any food preferences, dislikes, or allergies?",
    type: "text",
  },
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
  {
    name: "Granite Blue",
    primary: "#20242d",
    accent: "#4f8edc",
    tint: "#dbeafe",
  },
  {
    name: "Granite Purple",
    primary: "#241f29",
    accent: "#8b5cf6",
    tint: "#ede9fe",
  },
  {
    name: "Granite Teal",
    primary: "#1e2628",
    accent: "#14b8a6",
    tint: "#ccfbf1",
  },
  {
    name: "Granite Rose",
    primary: "#2a2124",
    accent: "#e11d48",
    tint: "#ffe4e6",
  },

];

const MEASUREMENT_FIELDS = [
  { key: "weight", label: "Weight", tip: "body weight" },
  { key: "chest", label: "Chest", tip: "around the fullest part" },
  { key: "waist", label: "Waist", tip: "around the narrowest part" },
  { key: "highHip", label: "High Hip", tip: "just above the fullest hip area" },
  { key: "hip", label: "Hip", tip: "around the fullest part" },
  { key: "thigh", label: "Thigh", tip: "around one upper thigh" },
  { key: "arm", label: "Arm", tip: "around the fullest upper arm" },
  { key: "calf", label: "Calf", tip: "around the fullest part of the calf" },
];

const fadeStyle = `
  @keyframes verseFade {
    0% {
      opacity: 0;
      transform: translateY(8px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

function capitalizeName(value) {
  if (!value) return "";
  return String(value)
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function normalizeProfile(profile) {
  return {
    ...profile,
    firstName: capitalizeName(profile.firstName),
    coachName: capitalizeName(profile.coachName),
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
      ...profile.coachMemory,
    },
  };
}

function getVisibleQuestionFlow(profile) {
  return QUESTION_FLOW.filter((question) => {
    if (typeof question.showIf === "function") {
      return question.showIf(profile);
    }
    return true;
  });
}

function isClarifyMessage(value) {
  const lower = value.toLowerCase().trim();
  return (
    lower.includes("what do you mean") ||
    lower.includes("clarify") ||
    lower.includes("explain") ||
    lower === "what?" ||
    lower === "huh" ||
    lower === "idk" ||
    lower === "i dont understand" ||
    lower === "i don't understand"
  );
}

function getClarificationForQuestion(question) {
  const map = {
    coachName: "This is just what you want your Coach to be called inside the app.",
    firstName: "Just type the name you want your Coach to call you.",
    age: "Type your age as a number. This helps guide your routine safely.",
    state: "Choose the state you live in from the list.",
    gender: "Choose the option that fits you.",
    pregnancyStatus:
      "This helps the Coach guide you safely if needed. Choose what applies to you.",
    pregnancyTrimester:
      "Pick which trimester you are currently in.",
    pregnancyRestrictions:
      "Anything your doctor told you to avoid. You can type skip if none.",
    pregnancySymptoms:
      "Any discomfort like pain, dizziness, or pressure you’ve noticed.",
    postpartumTime:
      "You can say something like 2 weeks, 3 months, etc.",
    deliveryType:
      "You can say vaginal, C-section, or skip.",
    postpartumConcerns:
      "Anything related to recovery like core, pelvic floor, pain, or bleeding.",
    relationshipStatus:
      "You can answer however you want here. It is open-ended.",
    denomination:
      "You can be specific, broad, or just say none.",
    whyStarted:
      "I mean what made you decide this is the right time to begin.",
    lifeChange:
      "I mean what you hope improves in your life because of this journey.",
    activityLevel:
      "Beginner means not very active. Somewhat active means occasional movement. Active means consistent movement.",
    hasLimitations:
      "This includes injuries, disabilities, chronic pain, or anything affecting movement.",
    limitationType:
      "You can describe if it’s injury, disability, pain, or something else.",
    limitationName:
      "Just describe what it is called or feels like.",
    limitationDuration:
      "How long you’ve had it (days, months, years).",
    activityLimit:
      "Describe what you can comfortably do right now.",
    mainGoal:
      "Example: lose weight, build strength, discipline, energy, or feel better.",
    bodyFocus:
      "This can be a body part, habit, or type of fitness.",
    foodPreferences:
      "Include allergies, dislikes, or how you usually eat.",
  };

  return (
    map[question.key] ||
    "Answer in the way that feels most true for you. It does not have to be perfect."
  );
}

function getSupportMessage(profile) {
  const coachName = capitalizeName(profile.coachName) || "Coach";
  if (profile.gender === "Woman" && profile.pregnancyStatus === "Pregnant") {
    return `${coachName}: You’re in the right place. We’ll keep this safe, steady, faith-centered, and calisthenics-focused with gentle movement, walking, posture, breathing, and wise progress.`;
  }
  if (profile.gender === "Woman" && profile.pregnancyStatus === "Postpartum") {
    return `${coachName}: You’re in the right place. We’ll rebuild gently and safely with simple movement, walking, breathing, posture, and steady calisthenics-based recovery.`;
  }
  return "";
}

function detectSlang(text = "") {
  const lower = text.toLowerCase();
  const candidates = [
    "fr", "lowkey", "highkey", "bet", "nah", "yall", "omg", "ngl", "tbh",
    "idk", "rn", "bc", "tho", "yep", "nope", "kinda", "lemme", "gonna", "wanna",
  ];
  return candidates.filter((word) => lower.includes(word));
}

function getStateFunFact(state) {
  const facts = {
    Alabama: "Fun fact: Alabama is home to the U.S. Space & Rocket Center.",
    Alaska: "Fun fact: Alaska has more coastline than all the other U.S. states combined.",
    Arizona: "Fun fact: Arizona is home to the Grand Canyon.",
    Arkansas: "Fun fact: Arkansas is known as The Natural State.",
    California: "Fun fact: California is home to both the highest and lowest points in the contiguous U.S.",
    Colorado: "Fun fact: Colorado is known for the Rocky Mountains and high elevation.",
    Connecticut: "Fun fact: Connecticut is one of the original 13 colonies.",
    Delaware: "Fun fact: Delaware was the first state to ratify the Constitution.",
    Florida: "Fun fact: Florida is home to the Everglades and the southernmost point in the continental U.S.",
    Georgia: "Fun fact: Georgia is known as the Peach State.",
    Hawaii: "Fun fact: Hawaii is the only U.S. state made entirely of islands.",
    Idaho: "Fun fact: Idaho is famous for its potatoes and mountain landscapes.",
    Illinois: "Fun fact: Illinois is home to Chicago and the Willis Tower.",
    Indiana: "Fun fact: Indiana is famous for the Indianapolis 500.",
    Iowa: "Fun fact: Iowa is known for its farmland and rolling plains.",
    Kansas: "Fun fact: Kansas is near the geographic center of the contiguous United States.",
    Kentucky: "Fun fact: Kentucky is known for horse racing and Mammoth Cave.",
    Louisiana: "Fun fact: Louisiana is known for its unique Cajun and Creole culture.",
    Maine: "Fun fact: Maine is famous for its rocky coastline and lobster.",
    Maryland: "Fun fact: Maryland is known for blue crabs and Chesapeake Bay.",
    Massachusetts: "Fun fact: Massachusetts played a huge role in early American history.",
    Michigan: "Fun fact: Michigan touches four of the five Great Lakes.",
    Minnesota: "Fun fact: Minnesota is known as the Land of 10,000 Lakes.",
    Mississippi: "Fun fact: The Mississippi River helped shape much of the state’s identity.",
    Missouri: "Fun fact: Missouri is known as the Show-Me State.",
    Montana: "Fun fact: Montana is known for wide-open spaces and Glacier National Park.",
    Nebraska: "Fun fact: Nebraska is the only state with a unicameral legislature.",
    Nevada: "Fun fact: Nevada is home to Las Vegas and vast desert landscapes.",
    "New Hampshire": "Fun fact: New Hampshire’s state motto is 'Live Free or Die.'",
    "New Jersey": "Fun fact: New Jersey has more diners than any other state.",
    "New Mexico": "Fun fact: New Mexico is known for its desert beauty and rich Native and Hispanic heritage.",
    "New York": "Fun fact: New York is home to the Statue of Liberty and Niagara Falls.",
    "North Carolina": "Fun fact: North Carolina is where the Wright brothers made their first powered flight.",
    "North Dakota": "Fun fact: North Dakota is known for its plains and strong farming roots.",
    Ohio: "Fun fact: Ohio has produced many U.S. presidents and astronauts.",
    Oklahoma: "Fun fact: Oklahoma has a deep Native American history and heritage.",
    Oregon: "Fun fact: Oregon is known for its forests, coastline, and Crater Lake.",
    Pennsylvania: "Fun fact: Pennsylvania is home to Independence Hall and the Liberty Bell.",
    "Rhode Island": "Fun fact: Rhode Island is the smallest U.S. state.",
    "South Carolina": "Fun fact: South Carolina is known for its coastal cities and historic charm.",
    "South Dakota": "Fun fact: South Dakota is home to Mount Rushmore.",
    Tennessee: "Fun fact: Tennessee is known for Nashville, Memphis, and a rich music history.",
    Texas: "Fun fact: Texas is the second-largest U.S. state by both area and population.",
    Utah: "Fun fact: Utah is known for its red rock landscapes and five national parks.",
    Vermont: "Fun fact: Vermont is famous for maple syrup and beautiful fall color.",
    Virginia: "Fun fact: Virginia is home to many important early American landmarks.",
    Washington: "Fun fact: Washington is known for coffee, mountains, and evergreen forests.",
    "West Virginia": "Fun fact: West Virginia is known for its mountains and outdoor beauty.",
    Wisconsin: "Fun fact: Wisconsin is famous for cheese and dairy farming.",
    Wyoming: "Fun fact: Wyoming is home to Yellowstone National Park.",
  };
  return facts[state] || `Fun fact: ${state} has its own unique history, people, and beauty.`;
}

function detectToneStyle(text = "", age) {
  const lower = text.toLowerCase();
  if (lower.includes("be direct") || lower.includes("just tell me")) return "direct";
  if (lower.includes("be gentle") || lower.includes("encourage me")) return "gentle";
  if (age && Number(age) <= 18) return "younger";
  return "balanced";
}

function getBibleLinkForName(firstName) {
  const clean = capitalizeName(firstName);
  const directMatches = {
    Aaron: "Aaron was chosen for spiritual leadership and service. That name can remind you that God can use your life to encourage and guide others.",
    Abigail: "Abigail is remembered for wisdom, discernment, and peace-making. That name can remind you that wisdom is powerful.",
    Anna: "Anna was known for faithfulness and devotion. That name can remind you that steady faith matters.",
    Benjamin: "Benjamin can remind you that you are deeply loved and remembered by God.",
    Caleb: "Caleb is remembered for courage and wholehearted faith. That name can remind you to stay strong and trust God fully.",
    Daniel: "Daniel is remembered for courage, discipline, and faithfulness under pressure.",
    David: "David reminds us that God looks at the heart and can grow someone into a leader over time.",
    Deborah: "Deborah is remembered for courage, wisdom, and leadership.",
    Elizabeth: "Elizabeth reminds us that God is faithful and sees His people at the right time.",
    Elijah: "Elijah is linked to bold faith and trusting God in hard seasons.",
    Esther: "Esther reminds us of courage, purpose, and being placed where you are for a reason.",
    Ethan: "Ethan is connected with wisdom and praise.",
    Eve: "Eve can point to life, beginnings, and the importance of walking closely with God.",
    Ezra: "Ezra is remembered for love of God’s Word and spiritual rebuilding.",
    Gabriel: "Gabriel reminds us of carrying important messages with purpose.",
    Grace: "Grace points directly to one of the most beautiful truths in Scripture — God’s unearned favor and kindness.",
    Hannah: "Hannah reminds us of prayer, surrender, and trusting God deeply.",
    Isaiah: "Isaiah is linked with calling, vision, and speaking truth.",
    Jacob: "Jacob reminds us that God can transform a life over time.",
    James: "James is strongly linked to spiritual maturity, wisdom, and living out faith.",
    Jeremiah: "Jeremiah reminds us that God knows and calls people with purpose.",
    Joanna: "Joanna is remembered as someone who supported God’s work faithfully.",
    John: "John strongly connects to love, truth, and staying close to Jesus.",
    Jonah: "Jonah can remind you that God is patient and still works through imperfect people.",
    Jonathan: "Jonathan is remembered for loyalty, friendship, and courage.",
    Jordan: "Jordan can remind you of crossing into new ground with God’s help.",
    Joseph: "Joseph is remembered for integrity, endurance, and trusting God through delay.",
    Joshua: "Joshua is remembered for courage and obedience. 'Be strong and courageous' fits beautifully here.",
    Leah: "Leah can remind you that God sees the overlooked and gives real worth.",
    Luke: "Luke is linked with carefulness, compassion, and sharing truth clearly.",
    Lydia: "Lydia is remembered for hospitality, faith, and open-hearted response to God.",
    Martha: "Martha can remind you to serve faithfully while also staying close to Jesus.",
    Mary: "Mary is tied to humility, surrender, and trusting God’s calling.",
    Matthew: "Matthew reminds us that Jesus calls people into a new story.",
    Michael: "Michael is linked with strength and spiritual courage.",
    Miriam: "Miriam is remembered for worship, leadership, and boldness.",
    Naomi: "Naomi reminds us that God is still present even through grief and change.",
    Nathan: "Nathan is linked to truth, wisdom, and speaking faithfully.",
    Noah: "Noah is remembered for obedience and steady faith over a long season.",
    Paul: "Paul reminds us of transformation, endurance, and bold purpose.",
    Peter: "Peter reminds us that even imperfect people can become strong and faithful over time.",
    Rachel: "Rachel can remind you of love, hope, and God’s care through long seasons.",
    Rebecca: "Rebecca can remind you of willingness and stepping forward in faith.",
    Rebekah: "Rebekah can remind you of willingness and stepping forward in faith.",
    Ruth: "Ruth is remembered for loyalty, humility, and faithful love.",
    Samuel: "Samuel reminds us of listening for God’s voice and responding faithfully.",
    Sarah: "Sarah reminds us that God keeps His promises, even when the wait feels long.",
    Solomon: "Solomon is strongly connected to wisdom.",
    Stephen: "Stephen is remembered for courage and unwavering faith.",
    Susanna: "Susanna is remembered as faithful and supportive in God’s work.",
    Thomas: "Thomas reminds us that honest questions can still lead to strong faith.",
    Timothy: "Timothy is linked with spiritual growth, courage, and faithful leadership.",
  };

  if (directMatches[clean]) {
    return directMatches[clean];
  }

  return `${clean || "Your name"} can still be a reminder that God gave you purpose, dignity, and gifts that can grow with faithfulness. Scripture shows again and again that your identity is not random — you were made on purpose and for a purpose.`;
}

function getConversationalReply(profile, justAnsweredKey) {
  const name = capitalizeName(profile.firstName) || "";
  const state = profile.state || "";

  const map = {
    coachName: `Got it — ${capitalizeName(profile.coachName) || "Coach"} it is. I like that.`,
    firstName: `Nice to meet you, ${name}. ${getBibleLinkForName(name)}`,
    age: `Got it, ${name}.`,
    state: `Okay, that helps. ${getStateFunFact(state)}`,
    gender: "Alright.",
    pregnancyStatus:
      profile.pregnancyStatus === "Pregnant" || profile.pregnancyStatus === "Postpartum"
        ? cleanCoachBubbleText(getSupportMessage(profile), profile.coachName)
        : "Okay, thank you for telling me that.",
    pregnancyTrimester: "Got it. That helps me guide you more carefully.",
    pregnancyRestrictions: "Good to know. I’ll keep that in mind.",
    pregnancySymptoms: "Thank you. We’ll keep things supportive and gentle where needed.",
    postpartumTime: "Got it.",
    deliveryType: "Okay, thank you for sharing that.",
    postpartumConcerns: "That helps. We’ll build carefully around that.",
    relationshipStatus: "Okay.",
    denomination: "Got it.",
    whyStarted: "That makes sense.",
    lifeChange: "I can see why that matters to you.",
    activityLevel: "Got it. That gives me a better feel for your starting point.",
    hasLimitations: "Okay.",
    limitationType: "Got it.",
    limitationName: "Thank you. That helps.",
    limitationDuration: "Okay.",
    activityLimit: "That gives me a clearer picture.",
    mainGoal: "That makes sense.",
    bodyFocus: "Got it.",
    foodPreferences: "Good to know.",
  };

  return map[justAnsweredKey] || "Got it.";
}
function cleanCoachBubbleText(text, coachName = "Coach") {
  if (!text || typeof text !== "string") return "";
  const cleanName = capitalizeName(coachName) || "Coach";
  return text
    .replace(new RegExp(`^Coach ${cleanName}:\\s*`, "i"), "")
    .replace(new RegExp(`^${cleanName}:\\s*`, "i"), "")
    .replace(/^Coach:\s*/i, "");
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

function getRoutineLength(profile) {
  const feedback = profile.coachMemory?.lastRoutineFeedback;
  const reason = (profile.coachMemory?.lastRoutineFeedbackReason || "").toLowerCase();
  const goal = (profile.mainGoal || "").toLowerCase();
  const activity = profile.activityLevel || "";

  if (feedback === "down" && reason.includes("long")) {
    return "15–20 min";
  }
  if (activity === "Beginner") return "18–24 min";
  if (activity === "Active") {
    if (goal.includes("muscle") || goal.includes("strength")) return "35–45 min";
    if (goal.includes("discipline")) return "25–35 min";
    return "30–40 min";
  }
  if (goal.includes("weight")) return "28–36 min";
  if (goal.includes("mental")) return "22–30 min";
  return "24–32 min";
}

function getGoalType(profile) {
  const goal = (profile.mainGoal || "").toLowerCase();
  if (goal.includes("weight")) return "weight-loss";
  if (goal.includes("muscle") || goal.includes("strength")) return "strength";
  if (goal.includes("discipline")) return "discipline";
  return "general";
}

function getRoutineData(profile) {
  const feedback = profile.coachMemory?.lastRoutineFeedback;
  const feedbackReason =
    (profile.coachMemory?.lastRoutineFeedbackReason || "").toLowerCase();

  let adjust = {
    easier: false,
    harder: false,
    shorter: false,
  };

  const goalType = getGoalType(profile);
  const goal = (profile.mainGoal || "").toLowerCase();
  const beginner = profile.activityLevel === "Beginner";
  const pregnant = profile.pregnancyStatus === "Pregnant";
  const postpartum = profile.pregnancyStatus === "Postpartum";

  if (feedback === "down") {
    if (feedbackReason.includes("hard") || feedbackReason.includes("pain")) {
      adjust.easier = true;
    }
    if (feedbackReason.includes("long")) {
      adjust.shorter = true;
    }
  }

  if (feedback === "up") {
    if (feedbackReason.includes("easy")) {
      adjust.harder = true;
    }
  }

  const activity = profile.activityLevel || "Somewhat active";
  const limitationText = [
    profile.hasLimitations,
    profile.limitationType,
    profile.limitationName,
    profile.activityLimit,
  ]
    .join(" ")
    .toLowerCase();

  const shouldGoGentle =
    activity === "Beginner" ||
    profile.hasLimitations === "Yes" ||
    pregnant ||
    postpartum ||
    limitationText.includes("injury") ||
    limitationText.includes("disability") ||
    limitationText.includes("pain") ||
    limitationText.includes("limited");

  const beginnerRoutine = {
    title: "Foundation Calisthenics Day",
    summary: "A lighter full-body session built for consistency and clean form.",
    warmup: [
      {
        name: "Arm Circles",
        reps: "30 sec each way",
        time: "1 min",
        video: "https://www.youtube-nocookie.com/embed/140RTNMciH8",
      },
      {
        name: "Bodyweight Good Mornings",
        reps: "12 reps",
        time: "1 min",
        video: "https://www.youtube-nocookie.com/embed/vKPGe8zb2S4",
      },
      {
        name: "March in Place",
        reps: "60 sec",
        time: "1 min",
        video: "https://www.youtube-nocookie.com/embed/czYx1UcuQ4Y",
      },
    ],
    main: [
      {
        name: "Incline Push-Ups",
        reps: "3 x 8",
        time: "5 min",
        video: "https://www.youtube-nocookie.com/embed/zkU6Ok44_CI",
        note: "Use a sturdy surface and keep your body in one line.",
      },
      {
        name: "Bodyweight Squats",
        reps: "3 x 12",
        time: "5 min",
        video: "https://www.youtube-nocookie.com/embed/YaXPRqUwItQ",
        note: "Sit back and keep your chest lifted.",
      },
      {
        name: "Glute Bridges",
        reps: "3 x 12",
        time: "4 min",
        video: "https://www.youtube-nocookie.com/embed/wPM8icPu6H8",
        note: "Pause at the top and squeeze with control.",
      },
      {
        name: "Dead Bug",
        reps: "3 x 8 each side",
        time: "4 min",
        video: "https://www.youtube-nocookie.com/embed/g_BYB0R-4Ws",
        note: "Keep your lower back steady on the floor.",
      },
    ],
    cooldown: [
      {
        name: "Child’s Pose",
        reps: "45 sec",
        time: "1 min",
        video: "https://www.youtube-nocookie.com/embed/eqVMAPM00DM",
      },
      {
        name: "Standing Quad Stretch",
        reps: "30 sec each side",
        time: "1 min",
        video: "https://www.youtube-nocookie.com/embed/8caF1Keg2XU",
      },
    ],
    walking: "Easy 10–15 minute walk if your energy feels good.",
  };

  const disciplineRoutine = {
    title: "Consistency Builder Routine",
    summary: "A balanced calisthenics session built to reinforce daily discipline.",
    warmup: [
      {
        name: "Jumping Jacks",
        reps: "45 sec",
        time: "1 min",
        video: "https://www.youtube-nocookie.com/embed/c4DAnQ6DtF8",
      },
      {
        name: "Hip Openers",
        reps: "10 each side",
        time: "1 min",
        video: "https://www.youtube-nocookie.com/embed/jj2AAH6jbHk",
      },
      {
        name: "World’s Greatest Stretch",
        reps: "5 each side",
        time: "2 min",
        video: "https://www.youtube-nocookie.com/embed/-CiWQ2IvY34",
      },
    ],
    main: [
      {
        name: "Push-Ups",
        reps: "4 x 8–12",
        time: "6 min",
        video: "https://www.youtube-nocookie.com/embed/IODxDxX7oi4",
        note: "Drop to knees if needed, but keep the reps honest.",
      },
      {
        name: "Bodyweight Squats",
        reps: "4 x 15",
        time: "6 min",
        video: "https://www.youtube-nocookie.com/embed/YaXPRqUwItQ",
        note: "Move smoothly and control the lowering phase.",
      },
      {
        name: "Reverse Lunges",
        reps: "3 x 10 each leg",
        time: "5 min",
        video: "https://www.youtube-nocookie.com/embed/7pw6gM0s4V8",
        note: "Step back softly and stay stable.",
      },
      {
        name: "Plank",
        reps: "3 rounds",
        time: "4 min",
        video: "https://www.youtube-nocookie.com/embed/pSHjTRCQxIw",
        note: "Brace your core and keep hips level.",
      },
    ],
    cooldown: [
      {
        name: "Seated Hamstring Stretch",
        reps: "45 sec each side",
        time: "2 min",
        video: "https://www.youtube-nocookie.com/embed/0hTllAb4XGg",
      },
      {
        name: "Chest Opener Stretch",
        reps: "45 sec",
        time: "1 min",
        video: "https://www.youtube-nocookie.com/embed/SV7l1sfEmO0",
      },
    ],
    walking: "Optional 15–20 minute walk to reinforce consistency.",
  };

  const muscleRoutine = {
    title: "Strength-Focused Calisthenics Day",
    summary: "More volume and slower reps to build strength without equipment.",
    warmup: [
      {
        name: "High Knees",
        reps: "40 sec",
        time: "1 min",
        video: "https://www.youtube-nocookie.com/embed/oDdkytliOqE",
      },
      {
        name: "Shoulder Taps",
        reps: "20 taps",
        time: "1 min",
        video: "https://www.youtube-nocookie.com/embed/gWHQpMUd51A",
      },
      {
        name: "Deep Squat Hold",
        reps: "40 sec",
        time: "1 min",
        video: "https://www.youtube-nocookie.com/embed/ZvFe8xIYw4Q",
      },
    ],
    main: [
      {
        name: "Tempo Push-Ups",
        reps: "4 x 8",
        time: "6 min",
        video: "https://www.youtube-nocookie.com/embed/IODxDxX7oi4",
        note: "Lower for 3 seconds, then press up strong.",
      },
      {
        name: "Bulgarian Split Squat",
        reps: "3 x 10 each leg",
        time: "6 min",
        video: "https://www.youtube-nocookie.com/embed/2C-uNgKwPLE",
        note: "Use a chair or couch edge for the back foot.",
      },
      {
        name: "Pike Push-Ups",
        reps: "3 x 8–10",
        time: "5 min",
        video: "https://www.youtube-nocookie.com/embed/xoU6NwB5Nf0",
        note: "Focus on shoulder control and clean range.",
      },
      {
        name: "Hollow Body Hold",
        reps: "3 x 25 sec",
        time: "4 min",
        video: "https://www.youtube-nocookie.com/embed/4xRpGgttca8",
        note: "Keep your lower back pressed down.",
      },
    ],
    cooldown: [
      {
        name: "Hip Flexor Stretch",
        reps: "40 sec each side",
        time: "2 min",
        video: "https://www.youtube-nocookie.com/embed/lPKRiU9u_Hc",
      },
      {
        name: "Thread the Needle",
        reps: "30 sec each side",
        time: "2 min",
        video: "https://www.youtube-nocookie.com/embed/M7R6xM4z6-k",
      },
    ],
    walking: "Light 10-minute walk after training if your legs feel good.",
  };

  const weightLossRoutine = {
    title: "Cardio Calisthenics Circuit",
    summary: "A higher-movement session built to keep energy up and the workout simple.",
    warmup: [
      {
        name: "Jump Rope Without Rope",
        reps: "60 sec",
        time: "1 min",
        video: "https://www.youtube-nocookie.com/embed/1BZM8TORnJU",
      },
      {
        name: "Leg Swings",
        reps: "10 each side",
        time: "1 min",
        video: "https://www.youtube-nocookie.com/embed/fajfA1vT0lA",
      },
      {
        name: "Walkouts",
        reps: "8 reps",
        time: "2 min",
        video: "https://www.youtube-nocookie.com/embed/LzQ2cKk3S7Q",
      },
    ],
    main: [
      {
        name: "Squat to Knee Drive",
        reps: "3 x 12 each side",
        time: "5 min",
        video: "https://www.youtube-nocookie.com/embed/tjJdXQ6LC0g",
        note: "Keep your core engaged and drive the knee with control.",
      },
      {
        name: "Mountain Climbers",
        reps: "3 x 30 sec",
        time: "4 min",
        video: "https://www.youtube-nocookie.com/embed/nmwgirgXLYM",
        note: "Move steadily instead of rushing.",
      },
      {
        name: "Alternating Reverse Lunges",
        reps: "3 x 12 each side",
        time: "5 min",
        video: "https://www.youtube-nocookie.com/embed/7pw6gM0s4V8",
        note: "Stay tall through the whole set.",
      },
      {
        name: "Forearm Plank",
        reps: "3 x 30 sec",
        time: "4 min",
        video: "https://www.youtube-nocookie.com/embed/pSHjTRCQxIw",
        note: "Strong core, steady breathing.",
      },
    ],
    cooldown: [
      {
        name: "Standing Forward Fold",
        reps: "45 sec",
        time: "1 min",
        video: "https://www.youtube-nocookie.com/embed/g7Uhp5tphAs",
      },
      {
        name: "Figure Four Stretch",
        reps: "40 sec each side",
        time: "2 min",
        video: "https://www.youtube-nocookie.com/embed/OTEXv5n_aKU",
      },
    ],
    walking: "Aim for an easy 20-minute walk sometime today.",
  };

  const balancedRoutine = {
    title: "Balanced Full-Body Day",
    summary: "A moderate calisthenics session built to support strength, energy, and consistency.",
    warmup: [
      {
        name: "Jumping Jacks",
        reps: "45 sec",
        time: "1 min",
        video: "https://www.youtube-nocookie.com/embed/c4DAnQ6DtF8",
      },
      {
        name: "Hip Circles",
        reps: "30 sec each way",
        time: "1 min",
        video: "https://www.youtube-nocookie.com/embed/J4v8V2q5-OU",
      },
    ],
    main: [
      {
        name: "Push-Ups",
        reps: "3 x 10",
        time: "5 min",
        video: "https://www.youtube-nocookie.com/embed/IODxDxX7oi4",
        note: "Use a knee version if needed and keep your form strong.",
      },
      {
        name: "Bodyweight Squats",
        reps: "3 x 15",
        time: "5 min",
        video: "https://www.youtube-nocookie.com/embed/YaXPRqUwItQ",
        note: "Drive through your whole foot.",
      },
      {
        name: "Walking Lunges",
        reps: "3 x 10 each leg",
        time: "5 min",
        video: "https://www.youtube-nocookie.com/embed/L8fvypPrzzs",
        note: "Stay stable and avoid rushing.",
      },
      {
        name: "Dead Bug",
        reps: "3 x 10 each side",
        time: "4 min",
        video: "https://www.youtube-nocookie.com/embed/g_BYB0R-4Ws",
        note: "Move with control and brace your core.",
      },
    ],
    cooldown: [
      {
        name: "Hamstring Stretch",
        reps: "40 sec each side",
        time: "2 min",
        video: "https://www.youtube-nocookie.com/embed/0hTllAb4XGg",
      },
      {
        name: "Chest Stretch",
        reps: "40 sec",
        time: "1 min",
        video: "https://www.youtube-nocookie.com/embed/SV7l1sfEmO0",
      },
    ],
    walking: "Optional 15-minute walk for recovery and energy.",
  };

  if (shouldGoGentle || adjust.easier) return beginnerRoutine;
  if (adjust.harder) return muscleRoutine;
  if (goal.includes("discipline")) return disciplineRoutine;
  if (goal.includes("muscle") || goal.includes("strength")) return muscleRoutine;
  if (goal.includes("weight")) return weightLossRoutine;

  if (adjust.shorter) {
    return {
      ...balancedRoutine,
      title: "Balanced Full-Body Day — Simplified",
      summary: "A shorter full-body session based on your last workout feedback.",
      main: balancedRoutine.main.slice(0, 2),
      cooldown: balancedRoutine.cooldown.slice(0, 1),
      walking: "Optional 5–10 minute walk for recovery and energy.",
    };
  }

  return balancedRoutine;
}

function getCoachMessage(profile) {
  const firstName = capitalizeName(profile.firstName) || "";
  const coachName = capitalizeName(profile.coachName) || "Coach";
  const greetingName = Math.random() > 0.5 && firstName ? ` ${firstName}` : "";
  const goal = (profile.mainGoal || "").toLowerCase();
  const activity = profile.activityLevel || "";
  const whyStarted = profile.whyStarted || "";
  const name = capitalizeName(profile.firstName);
  const goalType = getGoalType(profile);
  const prefix = getUserVoicePrefix(profile);

  let message = `${prefix}${name ? `, ${name}` : ""} — let’s keep today steady.`;
  let focus = "Consistency over perfection.";
  let action = "Finish today’s core routine and keep your meals simple.";

  if (goal.includes("discipline")) {
    message = `Let’s build trust with yourself${greetingName} by following through today.`;
    focus = "Discipline grows through repeatable action.";
    action = "Complete the routine even if you need to scale parts of it down.";
  } else if (goal.includes("muscle") || goal.includes("strength")) {
    message = `Today is a strength day${greetingName} — control your reps and move with intention.`;
    focus = "Effort and tension matter more than rushing.";
    action = "Give your main sets full focus and recover well after.";
  } else if (goal.includes("weight")) {
    message = `Let’s keep today active and clean${greetingName}.`;
    focus = "Simple movement plus simple food choices add up.";
    action = "Finish the workout and add a walk if your energy is there.";
  } else if (goal.includes("mental")) {
    message = `We’re aiming for strength and steadiness today${greetingName}.`;
    focus = "Movement should support your mind, not just your body.";
    action = "Finish the session, breathe slowly, and do not chase perfection.";
  }

  if (activity === "Beginner") {
    message = `We’re keeping this approachable${greetingName} and building from where you are now.`;
  }

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

  if (whyStarted && whyStarted.length > 10) {
    action = `Remember why you started: ${whyStarted.slice(0, 55)}${whyStarted.length > 55 ? "..." : ""}`;
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

  if (
    lower.includes("don't like") ||
    lower.includes("dont like") ||
    lower.includes("hate")
  ) {
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

function detectChatTopic(text) {
  const lower = text.toLowerCase();

  if (
    lower.includes("food") ||
    lower.includes("meal") ||
    lower.includes("eat") ||
    lower.includes("eating") ||
    lower.includes("snack") ||
    lower.includes("breakfast") ||
    lower.includes("lunch") ||
    lower.includes("dinner")
  ) {
    return "food";
  }

  if (
    lower.includes("pray") ||
    lower.includes("prayer") ||
    lower.includes("god") ||
    lower.includes("bible") ||
    lower.includes("verse")
  ) {
    return "faith";
  }

  if (
    lower.includes("measurement") ||
    lower.includes("measurements") ||
    lower.includes("weight") ||
    lower.includes("waist") ||
    lower.includes("hip") ||
    lower.includes("progress")
  ) {
    return "progress";
  }

  if (
    lower.includes("routine") ||
    lower.includes("workout") ||
    lower.includes("exercise") ||
    lower.includes("training") ||
    lower.includes("session")
  ) {
    return "routine";
  }

  if (
    lower.includes("discouraged") ||
    lower.includes("sad") ||
    lower.includes("tired") ||
    lower.includes("exhausted") ||
    lower.includes("unmotivated") ||
    lower.includes("behind") ||
    lower.includes("fell off") ||
    lower.includes("missed")
  ) {
    return "emotion";
  }

  return "general";
}

function detectMood(text) {
  const lower = text.toLowerCase();

  if (
    lower.includes("discouraged") ||
    lower.includes("sad") ||
    lower.includes("unmotivated") ||
    lower.includes("feel bad") ||
    lower.includes("behind") ||
    lower.includes("fell off")
  ) {
    return "discouraged";
  }

  if (
    lower.includes("tired") ||
    lower.includes("exhausted") ||
    lower.includes("worn out") ||
    lower.includes("no energy")
  ) {
    return "tired";
  }

  if (
    lower.includes("good") ||
    lower.includes("great") ||
    lower.includes("strong") ||
    lower.includes("better") ||
    lower.includes("proud")
  ) {
    return "positive";
  }

  return "neutral";
}

function detectPreferredHelpStyle(text) {
  const lower = text.toLowerCase();

  if (
    lower.includes("simple") ||
    lower.includes("simplify") ||
    lower.includes("short") ||
    lower.includes("quick")
  ) {
    return "simple";
  }

  if (
    lower.includes("detailed") ||
    lower.includes("explain more") ||
    lower.includes("more detail")
  ) {
    return "detailed";
  }

  return "balanced";
}

function detectCurrentStruggle(text) {
  const lower = text.toLowerCase();

  if (
    lower.includes("too hard") ||
    lower.includes("hard") ||
    lower.includes("pain")
  ) {
    return "routine difficulty";
  }

  if (
    lower.includes("too long") ||
    lower.includes("long") ||
    lower.includes("no time")
  ) {
    return "time consistency";
  }

  if (
    lower.includes("food") ||
    lower.includes("meal") ||
    lower.includes("snack") ||
    lower.includes("hungry")
  ) {
    return "food consistency";
  }

  if (
    lower.includes("discouraged") ||
    lower.includes("unmotivated") ||
    lower.includes("fell off") ||
    lower.includes("behind")
  ) {
    return "motivation";
  }

  if (
    lower.includes("tired") ||
    lower.includes("exhausted") ||
    lower.includes("no energy")
  ) {
    return "low energy";
  }

  return "";
}

function detectWin(text) {
  const lower = text.toLowerCase();

  if (
    lower.includes("i did it") ||
    lower.includes("finished") ||
    lower.includes("completed") ||
    lower.includes("got it done") ||
    lower.includes("i worked out") ||
    lower.includes("i trained") ||
    lower.includes("i walked")
  ) {
    return "followed through";
  }

  if (
    lower.includes("ate well") ||
    lower.includes("good meal") ||
    lower.includes("hit my protein") ||
    lower.includes("drank water")
  ) {
    return "made a strong food choice";
  }

  return "";
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
      items: avoidDairy
        ? ["fruit", "turkey slices", "nuts if tolerated"]
        : ["greek yogurt", "fruit", "granola"],
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
    return `${coachName}: ${prefix}${name ? `, ${name}` : ""} — your routine today is ${routine.title}. Start with: ${routine.main.slice(0, 3).map((item) => item.name).join(", ")}.`;
  }

  if (
    lower.includes("discouraged") ||
    lower.includes("behind") ||
    lower.includes("tired")
  ) {
    return `${coachName}: ${prefix}${name ? `, ${name}` : ""} — a rough day does not erase your progress. Smaller still counts.`;
  }

  if (lower.includes("pray")) {
    return `${coachName}: Lord, give ${name || "them"} peace, strength, wisdom, and steady faith today. Amen.`;
  }

  return `${coachName}: ${prefix}${name ? `, ${name}` : ""} — tell me if you want help with routine, food, progress, or prayer.`;
}

function getMeasurementGuide(unit) {
  const u = unit === "Centimeters" ? "cm" : "in";

  return [
    `Chest: wrap the tape around the fullest part of your chest. Write it down in ${u}.`,
    `Waist: wrap the tape around the narrowest part of your waist and keep it level.`,
    "High Hip: measure just above the fullest part of your hips.",
    "Hip: measure around the fullest part of your hips and glutes.",
    "Thigh: measure around the widest part of one upper thigh.",
    "Arm: measure around the fullest part of your upper arm while relaxed.",
    "Calf: measure around the fullest part of your calf.",
  ];
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
        <path d="M180 96 L180 250" stroke="#222" strokeWidth="2" fill="none" />
        <path d="M130 135 L230 135" stroke="#222" strokeWidth="2" fill="none" />
        <path d="M145 135 L130 210 L142 270" stroke="#222" strokeWidth="2" fill="none" />
        <path d="M215 135 L230 210 L218 270" stroke="#222" strokeWidth="2" fill="none" />
        <path d="M160 250 L152 345 L163 385" stroke="#222" strokeWidth="2" fill="none" />
        <path d="M200 250 L208 345 L197 385" stroke="#222" strokeWidth="2" fill="none" />

        {[
          { key: "chest", label: "CHEST", y: 90 },
          { key: "waist", label: "WAIST", y: 128 },
          { key: "highHip", label: "HIGH HIP", y: 166 },
          { key: "hip", label: "HIPS", y: 204 },
          { key: "thigh", label: "THIGH", y: 242 },
          { key: "calf", label: "CALF", y: 280 },
        ].map((item) => (
          <g
            key={item.key}
            onClick={() => onSelectPart?.(item.key)}
            style={{ cursor: "pointer" }}
          >
            <rect
              x="18"
              y={item.y}
              width="92"
              height="26"
              rx="6"
              fill={activePart === item.key ? `${accent}22` : "#ffffff"}
              stroke={accent}
              strokeWidth="2"
            />
            <text
              x="64"
              y={item.y + 17}
              textAnchor="middle"
              style={{
                fill: activePart === item.key ? "#111111" : accent,
                fontSize: 11,
                fontWeight: 800,
              }}
            >
              {item.label}
            </text>
          </g>
        ))}

        {[
          { label: "HEAD", y: 90 },
          { label: "CHEST", y: 128 },
          { label: "WAIST", y: 166 },
          { label: "HIPS", y: 204 },
          { label: "THIGH", y: 242 },
          { label: "CALF", y: 280 },
        ].map((item) => (
          <g key={item.label}>
            <rect
              x="250"
              y={item.y}
              width="92"
              height="26"
              rx="6"
              fill="#ffffff"
              stroke={accent}
              strokeWidth="2"
            />
            <text
              x="296"
              y={item.y + 17}
              textAnchor="middle"
              style={{ fill: "#111111", fontSize: 11, fontWeight: 800 }}
            >
              {item.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function ExerciseCard({ exercise }) {
  return (
    <div style={exerciseCard}>
      <div>
        <h4 style={exerciseTitle}>{exercise.name}</h4>
        <p style={exerciseMeta}>
          <strong>Reps:</strong> {exercise.reps}
        </p>
        <p style={exerciseMeta}>
          <strong>Time:</strong> {exercise.time}
        </p>
        {exercise.note ? <p style={exerciseNote}>{exercise.note}</p> : null}
      </div>

      <div style={videoWrap}>
        <iframe
          width="100%"
          height="190"
          src={exercise.video}
          title={exercise.name}
          style={videoFrame}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
function buildWeeklyReport(profile) {
  const feedback = profile.coachMemory?.lastRoutineFeedback;
  const feedbackReason = (
    profile.coachMemory?.lastRoutineFeedbackReason || ""
  ).toLowerCase();

  let summary =
    "You kept showing up this week — and that consistency is what actually builds results.";
  let nextStep = "Stay steady and complete your next planned workout.";
  let wins = ["You stayed engaged.", "You kept moving forward."];

  if (feedback === "up") {
    summary =
      "You had a strong week — you followed through and handled your routine well.";
    nextStep =
      "Keep building on that momentum and stay consistent this week.";
    wins = [
      "You responded well to your routine.",
      "You gave clear feedback about what worked.",
    ];
  } else if (feedback === "down") {
    summary =
      "You stayed honest this week and learned what needs to change — that’s real progress.";
    nextStep =
      feedbackReason.includes("long")
        ? "Keep your next workout a little shorter and easier to finish."
        : feedbackReason.includes("hard") || feedbackReason.includes("pain")
        ? "Scale the next workout down and keep it gentler."
        : "Keep the next workout simple and manageable.";
    wins = [
      "You paid attention to what felt off.",
      "You kept learning instead of quitting.",
    ];
  }

  return {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    summary,
    nextStep,
    wins,
  };
}

function buildMeasurementSnapshot(profile) {
  return {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    measurements: {
      ...(profile.measurements || {}),
    },
  };
}
export default function App() {
  const [verseIndex, setVerseIndex] = useState(0);
  const [screen, setScreen] = useState("welcome");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [activeTab, setActiveTab] = useState("home");
  const [routineFeedback, setRoutineFeedback] = useState("");
  const [feedbackReason, setFeedbackReason] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [tourStep, setTourStep] = useState(0);
const [showTour, setShowTour] = useState(false);
const [weeklyReportDismissed, setWeeklyReportDismissed] = useState(false);
const [editingSetup, setEditingSetup] = useState(false);
  const onboardingChatRef = useRef(null);

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
          mainGoal: "",
          activityLevel: "",
          foodPreferences: "",
          measurements: {},
          measurementHistory: [],
          measurementUnit: "Inches",
          onboardingComplete: false,
          activeMeasurementField: "",
          coachMemory: {},
        });
  });

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("christian-fitness-messages");
    return saved
      ? JSON.parse(saved)
      : [
          {
            role: "ai",
            text: "Hey — I’m here to help you build a routine that cares for your body and honors God too.",
          },
          {
            role: "ai",
            text: "We’ll keep this simple and take it one step at a time.",
          },
        ];
  });

  const [chatMessages, setChatMessages] = useState(() => {
    const saved = localStorage.getItem("christian-fitness-chat");
    return saved
      ? JSON.parse(saved).map((msg) => ({
          ...msg,
          speaker: capitalizeName(msg.speaker),
        }))
      : [];
  });

  const [selectedTheme, setSelectedTheme] = useState(() => {
    const saved = localStorage.getItem("christian-fitness-theme");
    return saved ? JSON.parse(saved) : COLOR_OPTIONS[0];
  });

  useEffect(() => {
    localStorage.setItem(
      "christian-fitness-profile",
      JSON.stringify(normalizeProfile(profile))
    );
  }, [profile]);

  useEffect(() => {
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
  const canEditPreviousQuestion = questionIndex > 0;
  const completedOnboarding = Boolean(profile.onboardingComplete);
  const routineData = useMemo(() => getRoutineData(profile), [profile]);
  const coach = useMemo(() => getCoachMessage(profile), [profile]);
  const foodGuidance = useMemo(() => getFoodGuidance(profile), [profile]);
  const routineLength = useMemo(() => getRoutineLength(profile), [profile]);
  const latestWeeklyReport = useMemo(() => {
    const reports = profile.coachMemory?.weeklyCheckins || [];
    return reports.length ? reports[reports.length - 1] : null;
  }, [profile]);

  const todayVerseCard = useMemo(() => {
    const verse = VERSES[verseIndex];

    if (verse.includes("Colossians 3:23")) {
      return {
        verse,
        meaning: "Show up with discipline and effort, even in the small things.",
        action: "Give today’s plan your full effort, even if it’s simple.",
      };
    }

    if (verse.includes("Philippians 4:13")) {
      return {
        verse,
        meaning: "You do not have to rely only on your own strength.",
        action: "Take the next healthy step today instead of waiting to feel ready.",
      };
    }

    if (verse.includes("Galatians 6:9")) {
      return {
        verse,
        meaning: "Consistency matters, even when progress feels slow.",
        action: "Stay steady today and do not quit just because it feels imperfect.",
      };
    }

    return {
      verse,
      meaning: "Fitness matters, but your deeper growth matters too.",
      action: "Choose one action today that strengthens both body and spirit.",
    };
  }, [verseIndex]);

  const tourSteps = [
    {
      title: "Home",
      body: "This is your daily main screen. It shows what matters most today.",
    },
    {
      title: "Today’s Routine",
      body: "This is where your workout lives, with warmup, main work, cooldown, and videos.",
    },
    {
      title: "Chat",
      body: "You can talk to your Coach here anytime. It can answer questions and adapt over time.",
    },
    {
      title: "Progress",
      body: "This is where your measurement boxes live. Tap the body diagram to match each box more easily.",
    },
  ];
  const nutrition = useMemo(() => getNutritionTargets(profile), [profile]);
  const mealIdeas = useMemo(() => getMealIdeas(profile), [profile]);

  function startOnboarding() {
    setScreen("onboarding");
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

    const lower =
      typeof answer === "string" ? answer.toLowerCase().trim() : "";

    if (isClarifyMessage(lower)) {
      setMessages((current) => [
        ...current,
        { role: "user", text: answer },
        {
          role: "ai",
          text: getClarificationForQuestion(currentQuestion),
        },
      ]);
      setInputValue("");
      return;
    }

    if (
      typeof answer === "string" &&
      (
        lower === "why" ||
        lower === "what" ||
        lower === "how" ||
        lower.includes("why are you asking") ||
        lower.includes("why do you need that") ||
        lower.includes("what do you mean") ||
        lower.includes("explain")
      )
    ) {
      setMessages((current) => [
        ...current,
        { role: "user", text: answer },
        {
          role: "ai",
          text: "Good question. I’m asking this so I can guide your plan in a way that actually fits your life.",
        },
        {
          role: "ai",
          text: currentQuestion.label,
        },
      ]);
      setInputValue("");
      return;
    }

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
      coachMemory: {
        ...profile.coachMemory,
        detailLevel: profile.coachMemory?.detailLevel || "balanced",
        tone: "balanced",
        neutralUntilLearned: true,
      },
    });

    setMessages((current) => [...current, { role: "user", text: safeAnswer }]);
    setProfile(nextProfile);
    setInputValue("");

    const nextVisibleFlow = getVisibleQuestionFlow(nextProfile);
    const nextIndex = questionIndex + 1;

    if (nextIndex < nextVisibleFlow.length) {
      setQuestionIndex(nextIndex);
      const reply = getConversationalReply(nextProfile, currentQuestion.key);

      setTimeout(() => {
        setMessages((current) => [
          ...current,
          {
            role: "ai",
            text: `${reply} ${nextVisibleFlow[nextIndex].label}`,
          },
        ]);
      }, 250);

      return;
    }

    setTimeout(() => {
      const firstName = capitalizeName(nextProfile.firstName);
      setMessages((current) => [
        ...current,
        {
          role: "ai",
          text: `Perfect${firstName ? `, ${firstName}` : ""}. That gives me a strong starting picture of you. Before we move on, if you want to change any answer, tap Edit last answer. If everything looks good, I’ll walk you through your style and tour next.`,
        },
        {
          role: "ai",
          text: `As we go, we’ll keep things simple with a weekly check-in, and build a fuller progress report each month. To make that accurate, try to remeasure about once a month — it helps us see what’s actually changing.`,
        },
      ]);
    }, 250);

    setProfile((current) => ({
      ...current,
      ...nextProfile,
      onboardingStage: "tour",
    }));

    setScreen("theme");
  }
function finishThemeAndTour() {
  setProfile((current) => ({
    ...current,
    onboardingComplete: true,
    onboardingStage: "done",
    createdAt: current.createdAt || new Date().toISOString(),
  }));
  setScreen("home");
  setActiveTab("home");
  setShowTour(true);
  setTourStep(0);
}

function nextTourStep() {
  if (tourStep >= tourSteps.length - 1) {
    setShowTour(false);
    setActiveTab("home");
    return;
  }

  const next = tourStep + 1;
  setTourStep(next);
  if (next === 0) setActiveTab("home");
  if (next === 1) setActiveTab("routine");
  if (next === 2) setActiveTab("chat");
  if (next === 3) setActiveTab("progress");
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
      preferredFoods: [
        ...new Set([
          ...(nextProfile.coachMemory.preferredFoods || []),
          ...foodSignals.preferred,
        ]),
      ].slice(-12),
      avoidedFoods: [
        ...new Set([
          ...(nextProfile.coachMemory.avoidedFoods || []),
          ...foodSignals.avoided,
        ]),
      ].slice(-12),
      allergies: [
        ...new Set([
          ...(nextProfile.coachMemory.allergies || []),
          ...foodSignals.allergies,
        ]),
      ].slice(-12),
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

const appStyles = {
  minHeight: "100vh",
  background: "linear-gradient(180deg, #050506 0%, #121317 40%, #ededee 100%)",
  position: "relative",
};

  if (!completedOnboarding && screen === "onboarding") {
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

          <div ref={onboardingChatRef} style={onboardingChatArea}>
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

                  <div
                    style={{
                      ...bubbleBase,
                      ...(message.role === "ai" ? aiBubble : userBubble),
                    }}
                  >
                    {message.role === "ai"
                      ? cleanCoachBubbleText(message.text, profile.coachName)
                      : message.text}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={inputArea}>
            {currentQuestion?.type === "choice" ? (
              <div style={choiceWrap}>
                {currentQuestion.options.map((option) => (
                  <button
                    key={option}
                    style={choiceButton}
                    onClick={() => submitAnswer(option)}
                  >
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

                <button
                  style={primaryButton}
                  onClick={() => submitAnswer()}
                  disabled={!inputValue}
                >
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

            {canEditPreviousQuestion && (
              <button
                style={secondaryOnboardingButton}
                onClick={() => {
                  const previousIndex = questionIndex - 1;
                  const previousQuestion = visibleQuestionFlow[previousIndex];
                  if (!previousQuestion) return;
                  setQuestionIndex(previousIndex);
                  setInputValue(profile[previousQuestion.key] || "");
                  setMessages((current) => [
                    ...current,
                    {
                      role: "ai",
                      text: `${capitalizeName(profile.coachName) || "Coach"}: No problem — let’s change that answer.`,
                    },
                  ]);
                }}
              >
                Edit last answer
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
  if (!completedOnboarding && screen === "theme") {
  return (
    <div style={appStyles}>
      <div style={phoneStyles}>
        <div style={themeWrap}>
          <h2 style={{ marginBottom: 6 }}>Choose your style</h2>
          <p style={subtleText}>
            Pick a granite-style base and compare the color differences below.
          </p>

          <div style={{ display: "grid", gap: 14, width: "100%" }}>
            {COLOR_OPTIONS.map((option) => {
              const selected = selectedTheme.name === option.name;

              return (
                <button
                  key={option.name}
                  onClick={() => setSelectedTheme(option)}
                  style={{
                    width: "100%",
                    borderRadius: 24,
                    border: selected
                      ? `3px solid ${option.accent}`
                      : "1px solid rgba(255,255,255,0.16)",
                    background: "#16181d",
                    padding: 16,
                    color: "white",
                    cursor: "pointer",
                    boxShadow: selected
                      ? `0 0 0 2px rgba(255,255,255,0.08), 0 10px 30px ${option.accent}33`
                      : "0 10px 24px rgba(0,0,0,0.18)",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "72px 1fr",
                      gap: 14,
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        width: 72,
                        height: 72,
                        borderRadius: 22,
                        background: `linear-gradient(135deg, ${option.primary}, ${option.accent})`,
                        border: "1px solid rgba(255,255,255,0.12)",
                      }}
                    />

                    <div style={{ textAlign: "left" }}>
                      <div style={{ fontSize: 18, fontWeight: 800 }}>
                        {option.name}
                      </div>

                      <div
                        style={{
                          marginTop: 6,
                          display: "flex",
                          gap: 8,
                          flexWrap: "wrap",
                        }}
                      >
                        <div
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 999,
                            background: option.primary,
                            border: "1px solid rgba(255,255,255,0.18)",
                          }}
                        />
                        <div
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 999,
                            background: option.accent,
                            border: "1px solid rgba(255,255,255,0.18)",
                          }}
                        />
                        <div
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 999,
                            background: option.tint,
                            border: "1px solid rgba(255,255,255,0.18)",
                          }}
                        />
                      </div>

                      <div
                        style={{
                          marginTop: 10,
                          borderRadius: 16,
                          overflow: "hidden",
                          border: "1px solid rgba(255,255,255,0.1)",
                        }}
                      >
                        <div
                          style={{
                            background: `linear-gradient(135deg, ${option.primary}, ${option.accent})`,
                            padding: "8px 12px",
                            fontWeight: 700,
                            fontSize: 13,
                          }}
                        >
                          Preview header
                        </div>

                        <div
                          style={{
                            background: `linear-gradient(180deg, #f7f7f8 0%, ${option.tint} 100%)`,
                            padding: 12,
                            display: "grid",
                            gap: 8,
                          }}
                        >
                          <div
                            style={{
                              background: "#ffffff",
                              color: "#111",
                              borderRadius: 14,
                              padding: "10px 12px",
                              fontSize: 13,
                              fontWeight: 700,
                            }}
                          >
                            Card preview
                          </div>

                          <div
                            style={{
                              background: "#111111",
                              color: "white",
                              borderRadius: 14,
                              padding: "10px 12px",
                              fontSize: 13,
                              fontWeight: 700,
                            }}
                          >
                            Coach preview
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <button style={primaryButton} onClick={finishThemeAndTour}>
            Finish setup
          </button>
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
                <p style={bodyTextLast}>
                  <strong>Estimated length:</strong> {routineLength}
                </p>
                <button style={secondaryButton} onClick={() => setActiveTab("routine")}>
                  Open full routine
                </button>
              </div>

              <div style={verseCard}>
                <p style={sectionLabel}>Daily verse</p>
                <h3 style={cardTitle}>{todayVerseCard.verse}</h3>
                <p style={bodyText}>
                  <strong>What this means today:</strong> {todayVerseCard.meaning}
                </p>
                <p style={bodyTextLast}>
                  <strong>Today’s action:</strong> {todayVerseCard.action}
                </p>
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

              <div style={buttonGrid}>
                <button style={actionCard} onClick={() => setActiveTab("routine")}>
                  Today’s Routine
                </button>
                <button style={actionCard} onClick={() => setActiveTab("chat")}>
                  Chat
                </button>
                <button style={actionCard} onClick={() => setActiveTab("progress")}>
                  Progress
                </button>
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

              <div style={dailyCard}>
                <p style={sectionLabel}>Generated routine</p>
                <h2 style={cardTitle}>{routineData.title}</h2>
                <p style={bodyText}>{routineData.summary}</p>
                <p style={bodyText}>
                  <strong>Estimated length:</strong> {routineLength}
                </p>
                <p style={bodyTextLast}>
                  This plan stays neutral when something is unknown. If it feels off,
                  tap thumbs up or down and say why.
                </p>
              </div>

              <div style={routineSectionCard}>
                <h3 style={routineSectionTitle}>Warmup</h3>
                {routineData.warmup.map((exercise, index) => (
                  <ExerciseCard key={`warmup-${index}`} exercise={exercise} />
                ))}
              </div>

              <div style={routineSectionCard}>
                <h3 style={routineSectionTitle}>Main workout</h3>
                {routineData.main.map((exercise, index) => (
                  <ExerciseCard key={`main-${index}`} exercise={exercise} />
                ))}
              </div>

              <div style={routineSectionCard}>
                <h3 style={routineSectionTitle}>Cooldown</h3>
                {routineData.cooldown.map((exercise, index) => (
                  <ExerciseCard key={`cooldown-${index}`} exercise={exercise} />
                ))}
              </div>

              <div style={dailyCard}>
                <p style={sectionLabel}>Walking suggestion</p>
                <p style={bodyTextLast}>{routineData.walking}</p>
              </div>

              <div style={feedbackRow}>
                <button
                  style={{
                    ...feedbackButton,
                    background: routineFeedback === "up" ? "#22c55e" : "#ffffff",
                    color: routineFeedback === "up" ? "white" : "#111",
                  }}
                  onClick={() => {
                    setRoutineFeedback("up");
                    setFeedbackReason("");
                    setProfile((current) => ({
                      ...current,
                      coachMemory: {
                        ...current.coachMemory,
                        lastRoutineFeedback: "up",
                      },
                    }));
                  }}
                >
                  👍
                </button>

                <button
                  style={{
                    ...feedbackButton,
                    background: routineFeedback === "down" ? "#ef4444" : "#ffffff",
                    color: routineFeedback === "down" ? "white" : "#111",
                  }}
                  onClick={() => {
                    setRoutineFeedback("down");
                    setFeedbackReason("");
                    setProfile((current) => ({
                      ...current,
                      coachMemory: {
                        ...current.coachMemory,
                        lastRoutineFeedback: "down",
                      },
                    }));
                  }}
                >
                  👎
                </button>
              </div>

              {routineFeedback && (
                <>
                  <p style={feedbackQuestion}>
                    {routineFeedback === "up"
                      ? "What did you like?"
                      : "What did you dislike?"}
                  </p>
                  <input
                    style={textInputLight}
                    placeholder={
                      routineFeedback === "up"
                        ? "Example: good pace, liked the structure, felt strong"
                        : "Example: too hard, too long, painful, confusing"
                    }
                    value={feedbackReason}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFeedbackReason(value);
                      setProfile((current) => ({
                        ...current,
                        coachMemory: {
                          ...current.coachMemory,
                          lastRoutineFeedback: routineFeedback,
                          lastRoutineFeedbackReason: value,
                        },
                      }));
                    }}
                  />
                </>
              )}
                <button style={secondaryButton} onClick={() => setActiveTab("home")}>
                  Back to Home
                </button>
            )}
            {activeTab === "chat" && (
            <>
              <div style={coachCard}>
                <p style={sectionLabelWhite}>
                  {capitalizeName(profile.coachName) || "Coach"}
                </p>
                <h2 style={cardTitle}>
                  {profile.firstName
                    ? `Welcome back, ${capitalizeName(profile.firstName)}.`
                    : "Welcome back."}
                </h2>
                <p style={bodyTextWhite}>Let’s stay steady today.</p>
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
                  <button
                    key={item}
                    style={quickReplyButton}
                    onClick={() => sendChatMessage(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div style={chatInputRow}>
                <input
                  style={textInput}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type a message..."
                />
                <button
                  style={primaryDarkButton}
                  onClick={() => sendChatMessage(chatInput)}
                >
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
                    onClick={() =>
                      setProfile((current) => ({
                        ...current,
                        measurementUnit: "Inches",
                      }))
                    }
                  >
                    Inches
                  </button>
                  <button
                    style={profile.measurementUnit === "Centimeters" ? unitToggleActive : unitToggleButton}
                    onClick={() =>
                      setProfile((current) => ({
                        ...current,
                        measurementUnit: "Centimeters",
                      }))
                    }
                  >
                    Centimeters
                  </button>
                </div>
                <div style={measurementGrid}>
                  {MEASUREMENT_FIELDS.map((field) => (
                    <div key={field.key} style={measurementCard}>
                      <div style={measurementLabelRow}>
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
                <p style={{ ...bodyText, marginTop: 12 }}>
                  These save on this device automatically.
                </p>
                <p style={bodyTextLast}>
                  Saved measurement snapshots: <strong>{profile.measurementHistory?.length || 0}</strong>
                </p>
              </div>
              <div style={routineSectionCard}>
                <h3 style={routineSectionTitle}>Measurement guide</h3>
                {getMeasurementGuide(profile.measurementUnit).map((item) => (
                  <p key={item} style={bodyText}>
                    {item}
                  </p>
                ))}
                <p style={bodyTextLast}>
                  Tip: measure at about the same time of day each time for cleaner tracking.
                </p>
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
          <button
            style={activeTab === "home" ? navButtonActive : navButton}
            onClick={() => setActiveTab("home")}
          >
            Home
          </button>
          <button
            style={activeTab === "routine" ? navButtonActive : navButton}
            onClick={() => setActiveTab("routine")}
          >
            Routine
          </button>
          <button
            style={activeTab === "chat" ? navButtonActive : navButton}
            onClick={() => setActiveTab("chat")}
          >
            Chat
          </button>
          <button
            style={activeTab === "progress" ? navButtonActive : navButton}
            onClick={() => setActiveTab("progress")}
          >
            Progress
          </button>
          <button
            style={activeTab === "food" ? navButtonActive : navButton}
            onClick={() => setActiveTab("food")}
          >
            Food
          </button>
        </div>

        {showSettings && (
          <div style={tourOverlay} onClick={() => setShowSettings(false)}>
            <div style={settingsModal} onClick={(e) => e.stopPropagation()}>
              <p style={sectionLabel}>Settings</p>
              <h3 style={{ marginTop: 8, marginBottom: 12 }}>App settings</h3>

              <div style={routineSectionCard}>
                <p style={bodyText}>
                  <strong>Coach name:</strong> {capitalizeName(profile.coachName) || "Coach"}
                </p>
                <p style={bodyText}>
                  <strong>User name:</strong> {capitalizeName(profile.firstName) || "Not set"}
                </p>
                <p style={bodyText}>
                  <strong>Goal:</strong> {profile.mainGoal || "Not set"}
                </p>
                <p style={bodyTextLast}>
                  <strong>Activity:</strong> {profile.activityLevel || "Not set"}
                </p>
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

              <button
                style={primaryDarkButton}
                onClick={() => setShowSettings(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

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
  fontWeight: 600,
  boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
  cursor: "pointer",
};

const diagramCard = {
  background: "#f8fafc",
  borderRadius: 18,
  padding: 14,
  textAlign: "left",
};

const tourOverlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.45)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 18,
  zIndex: 50,
};

const settingsModal = {
  width: "100%",
  maxWidth: 420,
  maxHeight: "80vh",
  overflowY: "auto",
  background: "white",
  color: "#111",
  borderRadius: 24,
  padding: 18,
  boxShadow: "0 24px 60px rgba(0,0,0,0.25)",
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
};
