import { useEffect, useMemo, useRef, useState } from "react";

const VERSES = [
  "Colossians 3:23 — Whatever you do, work at it with all your heart, as working for the Lord, not for human masters.",
  "Philippians 4:13 — I can do all things through Christ who strengthens me.",
  "Galatians 6:9 — Let us not grow weary in doing good, for at the proper time we will reap a harvest if we do not give up.",
  "1 Timothy 4:8 — For physical training is of some value, but godliness has value for all things, holding promise for both the present life and the life to come.",
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
    label: "How active would you say you are right now?",
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
    label:
      "Any food preferences, dislikes, allergies, or eating habits I should know about?",
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
    ...profile,
    firstName: capitalizeName(profile.firstName),
    coachName: capitalizeName(profile.coachName),
    limitationType: capitalizeName(profile.limitationType),
    limitationName: capitalizeName(profile.limitationName),
    measurements: profile.measurements || {},
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

function getRoutineLength(profile) {
  const feedback = profile.coachMemory?.lastRoutineFeedback;
  const reason = (profile.coachMemory?.lastRoutineFeedbackReason || "").toLowerCase();

  if (feedback === "down" && reason.includes("long")) {
    return "15–20 min";
  }
  const goal = (profile.mainGoal || "").toLowerCase();
  const activity = profile.activityLevel || "";

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

function getRoutineData(profile) {
  const feedback = profile.coachMemory?.lastRoutineFeedback;
  const feedbackReason =
    (profile.coachMemory?.lastRoutineFeedbackReason || "").toLowerCase();

  let adjust = {
    easier: false,
    harder: false,
    shorter: false,
  };

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

  const goal = (profile.mainGoal || "").toLowerCase();
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
    profile.pregnancyStatus === "Pregnant" ||
    profile.pregnancyStatus === "Postpartum" ||
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

  let message = `Let’s keep today steady and intentional${greetingName}.`;
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

  if (whyStarted && whyStarted.length > 10) {
    action = `Remember why you started: ${whyStarted.slice(0, 55)}${whyStarted.length > 55 ? "..." : ""}`;
  }

  const lastUpdate = profile.coachMemory?.lastMeasurementUpdate;
  let measurementReminder = "";

  if (lastUpdate) {
    const daysSince =
      (Date.now() - new Date(lastUpdate).getTime()) / (1000 * 60 * 60 * 24);

    if (daysSince > 25) {
      measurementReminder =
        " It’s a good time to remeasure and update your progress so we can build your monthly report.";
    }
  } else {
    measurementReminder =
      " When you’re ready, adding your measurements will help us track your progress over time.";
  }

  message += measurementReminder;

  return { speaker: coachName, message, focus, action };
}

function getFoodGuidance(profile) {
  const goal = (profile.mainGoal || "").toLowerCase();
  const prefs = (profile.foodPreferences || "").toLowerCase();

  if (prefs.includes("allerg")) {
    return "Keep meals simple today and stay aware of the foods you already know work well for you.";
  }
  if (goal.includes("muscle") || goal.includes("strength")) {
    return "Center meals around protein, enough carbs for training energy, and good hydration.";
  }
  if (goal.includes("weight")) {
    return "Focus on protein, fiber, and meals that keep you full without overcomplicating things.";
  }
  if (goal.includes("mental")) {
    return "Choose steady meals today that help energy, mood, and focus stay stable.";
  }

  return "Keep meals simple, nourishing, and realistic for the day you actually have.";
}

function getLastAssistantMessage(chatMessages) {
  const aiMessages = chatMessages.filter((msg) => msg.role === "ai");
  return aiMessages.length ? aiMessages[aiMessages.length - 1].text : "";
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

function updateCoachMemoryFromMessage(profile, text) {
  const topic = detectChatTopic(text);
  const mood = detectMood(text);
  const preferredHelpStyle = detectPreferredHelpStyle(text);
  const struggle = detectCurrentStruggle(text);
  const win = detectWin(text);

  const previousTopics = profile.coachMemory?.recentTopics || [];
  const recentTopics = [...previousTopics, topic].slice(-6);

  const previousWins = profile.coachMemory?.userWins || [];
  const nextWins = win ? [...previousWins, win].slice(-6) : previousWins;

  return {
    ...profile,
    coachMemory: {
      ...profile.coachMemory,
      prefersShortWorkouts:
        preferredHelpStyle === "simple"
          ? true
          : profile.coachMemory?.prefersShortWorkouts || false,
      lastChatTopic: topic,
      recentTopics,
      lastMood: mood,
      currentStruggle: struggle || profile.coachMemory?.currentStruggle || "",
      preferredHelpStyle:
        preferredHelpStyle !== "balanced"
          ? preferredHelpStyle
          : profile.coachMemory?.preferredHelpStyle || "balanced",
      userWins: nextWins,
    },
  };
}

function getMemoryPrefix(profile) {
  const firstName = capitalizeName(profile.firstName) || "";
  const namePart = firstName ? `, ${firstName}` : "";
  const mood = profile.coachMemory?.lastMood || "neutral";
  const struggle = profile.coachMemory?.currentStruggle || "";
  const wins = profile.coachMemory?.userWins || [];

  if (mood === "discouraged") {
    return `I know this has felt discouraging${namePart}. `;
  }
  if (mood === "tired") {
    return `I know your energy has felt low${namePart}. `;
  }
  if (struggle === "time consistency") {
    return `I know consistency and time have been the big pressure point${namePart}. `;
  }
  if (struggle === "food consistency") {
    return `I know food consistency has been one of the harder parts${namePart}. `;
  }
  if (struggle === "routine difficulty") {
    return `I know the routine has felt a little tough lately${namePart}. `;
  }
  if (wins.length > 0) {
    return `You have already had some wins here${namePart}, so keep building on that. `;
  }
  return "";
}
function getAIResponse(input, profile) {
  const lower = input.toLowerCase().trim();
  const coachName = capitalizeName(profile.coachName) || "Coach";
  const firstName = capitalizeName(profile.firstName) || "";
  const namePart = firstName ? `, ${firstName}` : "";
  const goal = (profile.mainGoal || "").toLowerCase();
  const activity = (profile.activityLevel || "").toLowerCase();
  const foodPrefs = (profile.foodPreferences || "").toLowerCase();
  const pregnancyStatus = profile.pregnancyStatus || "";
  const routine = getRoutineData(profile);

  const memory = profile.coachMemory || {};
  const preferredFoods = memory.preferredFoods || [];
  const avoidedFoods = memory.avoidedFoods || [];
  const allergies = memory.allergies || [];
  const learnedInjuries = memory.learnedInjuries || [];
  const learnedLimits = memory.learnedLimits || [];
  const commonStruggles = memory.commonStruggles || [];
  const victories = memory.victories || [];
  const motivationStyle = memory.motivationStyle || "balanced";
  const faithFocus = memory.faithFocus || "growing";

  const limitationText = [
    profile.hasLimitations,
    profile.limitationType,
    profile.limitationName,
    profile.activityLimit,
    profile.pregnancyRestrictions,
    profile.pregnancySymptoms,
    profile.postpartumConcerns,
    ...learnedInjuries,
    ...learnedLimits,
  ]
    .join(" ")
    .toLowerCase();

  const isGentleMode =
    pregnancyStatus === "Pregnant" ||
    pregnancyStatus === "Postpartum" ||
    profile.hasLimitations === "Yes" ||
    activity.includes("beginner") ||
    limitationText.includes("pain") ||
    limitationText.includes("injury") ||
    limitationText.includes("dizziness") ||
    limitationText.includes("pelvic") ||
    limitationText.includes("bleeding") ||
    limitationText.includes("gentler");

  const shortWorkoutPreference =
    memory.prefersShortWorkouts ||
    learnedLimits.includes("prefers shorter workouts");

  const hasKneeIssue = learnedInjuries.includes("knee issue");
  const hasBackIssue = learnedInjuries.includes("back issue");
  const hasShoulderIssue = learnedInjuries.includes("shoulder issue");

  const wantsPrayer =
    lower.includes("pray") ||
    lower.includes("prayer") ||
    lower.includes("please pray");

  const wantsFoodHelp =
    lower.includes("food") ||
    lower.includes("meal") ||
    lower.includes("eat") ||
    lower.includes("eating") ||
    lower.includes("hungry") ||
    lower.includes("snack") ||
    lower.includes("breakfast") ||
    lower.includes("lunch") ||
    lower.includes("dinner");

  const wantsRoutineHelp =
    lower.includes("routine") ||
    lower.includes("workout") ||
    lower.includes("exercise") ||
    lower.includes("training") ||
    lower.includes("session");

  const wantsAdjustment =
    lower.includes("adjust") ||
    lower.includes("change it") ||
    lower.includes("make it easier") ||
    lower.includes("make it harder") ||
    lower.includes("shorter") ||
    lower.includes("longer") ||
    lower.includes("too hard") ||
    lower.includes("too easy") ||
    lower.includes("too long");

  const wantsMeasurementHelp =
    lower.includes("measurement") ||
    lower.includes("measurements") ||
    lower.includes("weight") ||
    lower.includes("waist") ||
    lower.includes("hip") ||
    lower.includes("chest") ||
    lower.includes("where do i put");

  const feelsDiscouraged =
    lower.includes("discouraged") ||
    lower.includes("unmotivated") ||
    lower.includes("demotivated") ||
    lower.includes("i feel bad") ||
    lower.includes("feel like giving up") ||
    lower.includes("fell off") ||
    lower.includes("behind") ||
    lower.includes("missed");

  const feelsTired =
    lower.includes("tired") ||
    lower.includes("exhausted") ||
    lower.includes("worn out") ||
    lower.includes("no energy");

  const asksWhy =
    lower === "why" ||
    lower.includes("what do you mean") ||
    lower.includes("clarify") ||
    lower.includes("explain");

  const asksPregnancy =
    lower.includes("pregnant") || lower.includes("postpartum");

  const gentlePrefix =
    motivationStyle === "gentle"
      ? `I’m with you${namePart}. `
      : motivationStyle === "direct"
      ? `Alright${namePart}. `
      : "";

  if (wantsPrayer) {
    if (faithFocus === "strong") {
      return `${coachName}: Of course. Lord, give ${firstName || "them"} peace, wisdom, endurance, and steady faith today. Help them take the next right step with strength and grace. Amen.`;
    }
    return `${coachName}: Of course. I’m praying for peace, strength, and steady courage over you today${namePart}.`;
  }

  if (wantsMeasurementHelp) {
    return `${coachName}: Put them in the Progress tab${namePart}, inside the measurement boxes. Tap the body diagram too — it helps match each measurement to the right place.`;
  }

  if (wantsFoodHelp) {
    let memoryFoodLine = "";

    if (allergies.length > 0) {
      memoryFoodLine = ` I remember you need to avoid ${allergies.join(", ")}.`;
    } else if (avoidedFoods.length > 0) {
      memoryFoodLine = ` I remember you do not enjoy ${avoidedFoods.join(", ")}.`;
    } else if (preferredFoods.length > 0) {
      memoryFoodLine = ` I remember foods like ${preferredFoods.join(", ")} work well for you.`;
    }

    if (foodPrefs.includes("allerg")) {
      return `${coachName}: Let’s keep food simple today${namePart}. Stay with foods you already know work well for your body, and focus on protein, steady energy, and water.${memoryFoodLine}`;
    }
    if (goal.includes("muscle") || goal.includes("strength")) {
      return `${coachName}: For today${namePart}, build meals around protein, enough carbs for energy, and water. Simple and repeatable is the goal.${memoryFoodLine}`;
    }
    if (goal.includes("weight")) {
      return `${coachName}: For today${namePart}, focus on protein, fiber, and meals that keep you full. Keep it simple, not extreme.${memoryFoodLine}`;
    }
    return `${coachName}: Keep food steady today${namePart} — protein, something filling, and enough water.${memoryFoodLine}`;
  }

  if (asksPregnancy) {
    if (pregnancyStatus === "Pregnant") {
      return `${coachName}: Since you’re pregnant${namePart}, we’ll keep things gentler, safer, and more controlled with walking, posture, breathing, and simple calisthenics.`;
    }
    if (pregnancyStatus === "Postpartum") {
      return `${coachName}: Since you’re postpartum${namePart}, we’ll rebuild patiently with controlled movement, walking, posture, and core awareness.`;
    }
    return `${coachName}: If pregnancy or postpartum ever becomes relevant${namePart}, I can adjust your routine to be much more gentle and supportive.`;
  }

  if (feelsDiscouraged) {
    const struggleLine = commonStruggles.includes("discouragement")
      ? " I remember this is one of the places you need the most support, so we’re going to answer it with consistency, not shame."
      : "";
    const victoryLine = victories.includes("followed through")
      ? " You have followed through before, and you can do it again."
      : "";
    return `${coachName}: ${gentlePrefix}A rough day does not erase your progress.${struggleLine}${victoryLine}`;
  }

  if (feelsTired) {
    return `${coachName}: ${gentlePrefix}Then today should be wiser, not harder${namePart}. A shorter and gentler day still counts.`;
  }

  if (wantsAdjustment) {
    if (lower.includes("hard")) {
      if (hasKneeIssue || hasBackIssue || hasShoulderIssue) {
        return `${coachName}: Then let’s scale it down${namePart}. I remember your ${hasKneeIssue ? "knee" : hasBackIssue ? "back" : "shoulder"} has been bothering you, so we’ll lower the reps, slow the pace, and protect that area.`;
      }
      return `${coachName}: Then let’s scale it down${namePart}. Reduce reps, slow the pace, and stop short of pain.`;
    }
    if (lower.includes("easy")) {
      return `${coachName}: Then we can raise the challenge a little${namePart} — more reps, slower tempo, or one extra round.`;
    }
    if (lower.includes("short") || lower.includes("long") || shortWorkoutPreference) {
      return `${coachName}: Yes${namePart}. I remember shorter workouts help you more, so we can keep today tight and manageable while still making it count.`;
    }
    if (isGentleMode) {
      return `${coachName}: Yes${namePart}. I’d keep today gentle, lower-pressure, and more recovery-focused.`;
    }
    return `${coachName}: Yes${namePart}. I can help make it easier, harder, shorter, or more focused.`;
  }

  if (wantsRoutineHelp) {
    if (lower.includes("video")) {
      return `${coachName}: Your workout videos${namePart} are in the Routine tab.`;
    }

    if (lower.includes("what is my routine") || lower.includes("today's routine")) {
      let routineNote = "";
      if (shortWorkoutPreference) {
        routineNote = " I’m also keeping it mindful of your preference for shorter workouts.";
      } else if (hasKneeIssue) {
        routineNote = " I’m also keeping your knee in mind.";
      } else if (hasBackIssue) {
        routineNote = " I’m also keeping your back in mind.";
      } else if (hasShoulderIssue) {
        routineNote = " I’m also keeping your shoulder in mind.";
      }

      return `${coachName}: Your routine today${namePart} is ${routine.title}. Main exercises: ${routine.main
        .map((e) => e.name)
        .join(", ")}.${routineNote}`;
    }

    if (lower.includes("simplify")) {
      if (shortWorkoutPreference) {
        return `${coachName}: Keep it simple${namePart}: warmup, first 2 exercises, done. That fits the shorter workout style you respond best to.`;
      }
      return `${coachName}: Keep it simple${namePart}: warmup, first 2 exercises, done.`;
    }

    if (isGentleMode) {
      let supportLine = "";
      if (hasKneeIssue) supportLine = " We’ll be mindful of your knee.";
      if (hasBackIssue) supportLine = " We’ll be mindful of your back.";
      if (hasShoulderIssue) supportLine = " We’ll be mindful of your shoulder.";
      return `${coachName}: For today${namePart}, stay with a gentler routine: simple warmup, 1 to 2 main movements, and a short walk if you feel good.${supportLine}`;
    }

    if (goal.includes("discipline")) {
      return `${coachName}: Since your goal is discipline${namePart}, the win today is finishing the plan — even if it is not perfect.`;
    }
    if (goal.includes("muscle") || goal.includes("strength")) {
      return `${coachName}: Since your goal is strength${namePart}, focus on controlled reps, good form, and not rushing.`;
    }
    if (goal.includes("weight")) {
      return `${coachName}: Since your goal is weight loss${namePart}, think consistency: movement, simple meals, and no all-or-nothing thinking.`;
    }
    return `${coachName}: Let’s keep today’s routine steady${namePart} — clean form, honest effort, and consistency over perfection.`;
  }

  if (asksWhy) {
    return `${coachName}: I’m here${namePart}. Ask me directly what you want help with — routine, food, progress, motivation, or prayer — and I’ll answer more clearly.`;
  }

  if (motivationStyle === "direct") {
    return `${coachName}: I’m with you${namePart}. Be specific — tell me whether you want help with routine, food, progress, motivation, or prayer.`;
  }

  if (motivationStyle === "gentle") {
    return `${coachName}: I’m with you${namePart}. Tell me what kind of support you need right now — routine, food, progress, motivation, or prayer.`;
  }

  return `${coachName}: I’m with you${namePart}. Tell me what you want help with right now — routine, food, progress, motivation, or prayer.`;
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

function TourMeasurementDiagram({ gender, onSelectPart, activePart }) {
  const accent = gender === "Woman" ? "#7caf45" : "#4f8edc";
  const labelFill = (key) => (activePart === key ? "#111111" : accent);
  const boxFill = (key) => (activePart === key ? `${accent}22` : "#ffffff");

  return (
    <div
      style={{
        background: "#f4f5f7",
        borderRadius: 26,
        padding: 16,
        border: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      <svg viewBox="0 0 360 520" style={{ width: "100%", height: "auto", display: "block" }}>
        <text
          x="180"
          y="28"
          textAnchor="middle"
          style={{
            fontSize: 18,
            fontWeight: 800,
            fill: "#111111",
            letterSpacing: "0.04em",
          }}
        >
          BODY MEASUREMENT TRACKER
        </text>

        <rect x="18" y="46" width="110" height="20" rx="0" fill={accent} />
        <rect x="232" y="46" width="110" height="20" rx="0" fill={accent} />
        <text x="73" y="61" textAnchor="middle" style={{ fill: "white", fontSize: 12, fontWeight: 800 }}>
          TRACK
        </text>
        <text x="287" y="61" textAnchor="middle" style={{ fill: "white", fontSize: 12, fontWeight: 800 }}>
          GUIDE
        </text>

        {[
          { key: "chest", label: "CHEST", y: 90 },
          { key: "waist", label: "WAIST", y: 128 },
          { key: "highHip", label: "HIGH HIP", y: 166 },
          { key: "hip", label: "HIPS", y: 204 },
          { key: "thigh", label: "THIGH", y: 242 },
          { key: "calf", label: "CALF", y: 280 },
        ].map((item) => (
          <g key={item.key} onClick={() => onSelectPart?.(item.key)} style={{ cursor: "pointer" }}>
            <rect
              x="18"
              y={item.y}
              width="92"
              height="26"
              rx="6"
              fill={boxFill(item.key)}
              stroke={accent}
              strokeWidth="2"
            />
            <text
              x="64"
              y={item.y + 17}
              textAnchor="middle"
              style={{ fill: labelFill(item.key), fontSize: 11, fontWeight: 800 }}
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

        <circle cx="180" cy="102" r="28" fill="none" stroke="#222" strokeWidth="2" />
        <path d="M180 130 L180 300" stroke="#222" strokeWidth="2" fill="none" />
        <path d="M138 170 L222 170" stroke="#222" strokeWidth="2" fill="none" />
        <path d="M145 170 L132 244 L140 314" stroke="#222" strokeWidth="2" fill="none" />
        <path d="M215 170 L228 244 L220 314" stroke="#222" strokeWidth="2" fill="none" />
        <path d="M160 300 L154 414 L166 458" stroke="#222" strokeWidth="2" fill="none" />
        <path d="M200 300 L206 414 L194 458" stroke="#222" strokeWidth="2" fill="none" />

        <line x1="135" y1="170" x2="225" y2="170" stroke="#777" strokeDasharray="5 4" />
        <line x1="142" y1="224" x2="218" y2="224" stroke="#777" strokeDasharray="5 4" />
        <line x1="138" y1="262" x2="222" y2="262" stroke="#777" strokeDasharray="5 4" />
        <line x1="148" y1="350" x2="212" y2="350" stroke="#777" strokeDasharray="5 4" />

        <text x="180" y="495" textAnchor="middle" style={{ fill: "#111111", fontSize: 13, fontWeight: 700 }}>
          Tap a label on the left to highlight its box below
        </text>
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

  let summary = "You kept showing up this week — and that consistency is what actually builds results.";
  let nextStep = "Stay steady and complete your next planned workout.";
  let wins = ["You stayed engaged.", "You kept moving forward."];

  if (feedback === "up") {
    summary =
      "You had a strong week — you followed through and handled your routine well.";
    nextStep = "Keep building on that momentum and stay consistent this week.";
    wins = ["You responded well to your routine.", "You gave clear feedback about what worked."];
  } else if (feedback === "down") {
    summary =
      "You stayed honest this week and learned what needs to change — that’s real progress.";
    nextStep =
      feedbackReason.includes("long")
        ? "Keep your next workout a little shorter and easier to finish."
        : feedbackReason.includes("hard") || feedbackReason.includes("pain")
        ? "Scale the next workout down and keep it gentler."
        : "Keep the next workout simple and manageable.";
    wins = ["You paid attention to what felt off.", "You kept learning instead of quitting."];
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
const appChatRef = useRef(null);

const [profile, setProfile] = useState(() => {
  const saved = localStorage.getItem("christian-fitness-profile");
  return saved
    ? normalizeProfile(JSON.parse(saved))
: {
    measurements: {},
    measurementHistory: [],
    createdAt: null,
    coachMemory: {
      lastMeasurementUpdate: null,
      lastWeeklyReport: null,
      weeklyCheckins: [],
      lastRoutineFeedback: "",
      lastRoutineFeedbackReason: "",
      prefersShortWorkouts: false,
      lastChatTopic: "general",
      recentTopics: [],
      lastMood: "neutral",
      currentStruggle: "",
      preferredHelpStyle: "balanced",
      spiritualTone: "encouraging",
      userWins: [],
    },
  };
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
    localStorage.setItem(
      "christian-fitness-profile",
      JSON.stringify(normalizeProfile(profile))
    );
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
  if (!profile.onboardingComplete) return;

  const now = new Date();
  const lastWeeklyReport = profile.coachMemory?.lastWeeklyReport;
  let shouldGenerate = false;

  if (!lastWeeklyReport) {
    const created = new Date(profile.createdAt || Date.now());
    const daysSinceStart =
      (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);

    if (daysSinceStart >= 3) {
      shouldGenerate = true;
    }
  } else {
    const daysSinceLast =
      (now.getTime() - new Date(lastWeeklyReport).getTime()) /
      (1000 * 60 * 60 * 24);

    if (daysSinceLast >= 7) {
      shouldGenerate = true;
    }
  }

  if (!shouldGenerate) return;

  setProfile((current) => {
    const existing = current.coachMemory?.weeklyCheckins || [];
    const newCheckin = buildWeeklyReport(current);

    return {
      ...current,
      coachMemory: {
        ...current.coachMemory,
        weeklyCheckins: [...existing, newCheckin].slice(-8),
        lastWeeklyReport: new Date().toISOString(),
      },
    };
  });

  setWeeklyReportDismissed(false);
}, [profile.onboardingComplete, profile.createdAt, profile.coachMemory?.lastWeeklyReport]);

  useEffect(() => {
    if (activeTab === "chat" && chatMessages.length === 0 && profile.onboardingComplete) {
      const coachName = capitalizeName(profile.coachName) || "Coach";
      const firstName = capitalizeName(profile.firstName)
        ? `, ${capitalizeName(profile.firstName)}`
        : "";

      setChatMessages([
        {
          role: "ai",
          speaker: coachName,
          text: `Welcome back${firstName}. Let’s stay steady today. What do you need?`,
        },
      ]);
    }
  }, [activeTab, chatMessages.length, profile]);

  useEffect(() => {
    const el = onboardingChatRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  }, [messages, questionIndex]);

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

  if (!currentQuestion) return;

  if (!answer) return;

  const lower = typeof answer === "string" ? answer.toLowerCase().trim() : "";

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

function resetApp() {
  localStorage.removeItem("christian-fitness-profile");
  localStorage.removeItem("christian-fitness-messages");
  localStorage.removeItem("christian-fitness-chat");
  localStorage.removeItem("christian-fitness-theme");
setProfile({
  measurements: {},
  measurementHistory: [],
  createdAt: null,
  coachMemory: {
    lastMeasurementUpdate: null,
    lastWeeklyReport: null,
    weeklyCheckins: [],
    lastRoutineFeedback: "",
    lastRoutineFeedbackReason: "",
    prefersShortWorkouts: false,
    lastChatTopic: "general",
    recentTopics: [],
    lastMood: "neutral",
    currentStruggle: "",
    preferredHelpStyle: "balanced",
    spiritualTone: "encouraging",
    userWins: [],
  },
});
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
  setQuestionIndex(0);
  setInputValue("");
  setChatInput("");
  setScreen("welcome");
  setActiveTab("home");
  setRoutineFeedback("");
  setFeedbackReason("");
  setShowTour(false);
  setTourStep(0);
  setEditingSetup(false);
  setWeeklyReportDismissed(false);
}

function sendChatMessage(text) {
  const cleanText = text.trim();
  if (!cleanText) return;

  const coachName = capitalizeName(profile.coachName) || "Coach";
  const lower = cleanText.toLowerCase();

  const addUnique = (arr = [], value) => {
    if (!value) return arr || [];
    return arr.includes(value) ? arr : [...arr, value];
  };

  let lastChatTopic =
    lower.includes("food") || lower.includes("meal") || lower.includes("eat")
      ? "food"
      : lower.includes("pray") || lower.includes("prayer")
      ? "prayer"
      : lower.includes("measurement") ||
        lower.includes("weight") ||
        lower.includes("waist")
      ? "progress"
      : lower.includes("routine") ||
        lower.includes("workout") ||
        lower.includes("exercise")
      ? "routine"
      : lower.includes("discouraged") ||
        lower.includes("tired") ||
        lower.includes("behind")
      ? "motivation"
      : "general";

  let recurringTopics = [...(profile.coachMemory?.recurringTopics || [])];
  let commonStruggles = [...(profile.coachMemory?.commonStruggles || [])];
  let victories = [...(profile.coachMemory?.victories || [])];
  let preferredFoods = [...(profile.coachMemory?.preferredFoods || [])];
  let avoidedFoods = [...(profile.coachMemory?.avoidedFoods || [])];
  let allergies = [...(profile.coachMemory?.allergies || [])];
  let learnedInjuries = [...(profile.coachMemory?.learnedInjuries || [])];
  let learnedLimits = [...(profile.coachMemory?.learnedLimits || [])];
  let motivationStyle = profile.coachMemory?.motivationStyle || "";
  let faithFocus = profile.coachMemory?.faithFocus || "";

  recurringTopics = addUnique(recurringTopics, lastChatTopic);

  if (
    lower.includes("discouraged") ||
    lower.includes("unmotivated") ||
    lower.includes("behind") ||
    lower.includes("fell off")
  ) {
    commonStruggles = addUnique(commonStruggles, "discouragement");
  }

  if (
    lower.includes("tired") ||
    lower.includes("exhausted") ||
    lower.includes("no energy")
  ) {
    commonStruggles = addUnique(commonStruggles, "low energy");
  }

  if (
    lower.includes("too hard") ||
    lower.includes("hard") ||
    lower.includes("pain")
  ) {
    commonStruggles = addUnique(commonStruggles, "routine difficulty");
  }

  if (
    lower.includes("too long") ||
    lower.includes("long workout") ||
    lower.includes("short workout")
  ) {
    learnedLimits = addUnique(learnedLimits, "prefers shorter workouts");
  }

  if (
    lower.includes("i did it") ||
    lower.includes("finished") ||
    lower.includes("completed") ||
    lower.includes("i worked out") ||
    lower.includes("i did my workout")
  ) {
    victories = addUnique(victories, "followed through");
  }

  if (
    lower.includes("protein") ||
    lower.includes("chicken") ||
    lower.includes("eggs") ||
    lower.includes("fruit") ||
    lower.includes("rice")
  ) {
    if (lower.includes("protein")) preferredFoods = addUnique(preferredFoods, "protein");
    if (lower.includes("chicken")) preferredFoods = addUnique(preferredFoods, "chicken");
    if (lower.includes("eggs")) preferredFoods = addUnique(preferredFoods, "eggs");
    if (lower.includes("fruit")) preferredFoods = addUnique(preferredFoods, "fruit");
    if (lower.includes("rice")) preferredFoods = addUnique(preferredFoods, "rice");
  }

  if (
    lower.includes("dont like") ||
    lower.includes("don't like") ||
    lower.includes("hate ")
  ) {
    if (lower.includes("broccoli")) avoidedFoods = addUnique(avoidedFoods, "broccoli");
    if (lower.includes("fish")) avoidedFoods = addUnique(avoidedFoods, "fish");
    if (lower.includes("eggs")) avoidedFoods = addUnique(avoidedFoods, "eggs");
  }

  if (lower.includes("allergic")) {
    if (lower.includes("dairy")) allergies = addUnique(allergies, "dairy");
    if (lower.includes("gluten")) allergies = addUnique(allergies, "gluten");
    if (lower.includes("peanut")) allergies = addUnique(allergies, "peanuts");
    if (lower.includes("nuts")) allergies = addUnique(allergies, "nuts");
    if (lower.includes("egg")) allergies = addUnique(allergies, "eggs");
  }

  if (
    lower.includes("injury") ||
    lower.includes("hurt") ||
    lower.includes("bad knee") ||
    lower.includes("knee pain") ||
    lower.includes("back pain") ||
    lower.includes("shoulder pain")
  ) {
    if (lower.includes("knee")) learnedInjuries = addUnique(learnedInjuries, "knee issue");
    if (lower.includes("back")) learnedInjuries = addUnique(learnedInjuries, "back issue");
    if (lower.includes("shoulder")) learnedInjuries = addUnique(learnedInjuries, "shoulder issue");
    if (
      !lower.includes("knee") &&
      !lower.includes("back") &&
      !lower.includes("shoulder")
    ) {
      learnedInjuries = addUnique(learnedInjuries, "general injury");
    }
  }

  if (
    lower.includes("gentle") ||
    lower.includes("easy on me") ||
    lower.includes("lower pressure")
  ) {
    learnedLimits = addUnique(learnedLimits, "needs gentler coaching sometimes");
  }

  if (
    lower.includes("be direct") ||
    lower.includes("push me") ||
    lower.includes("hold me accountable")
  ) {
    motivationStyle = "direct";
  } else if (
    lower.includes("be gentle") ||
    lower.includes("encourage me") ||
    lower.includes("be kind")
  ) {
    motivationStyle = "gentle";
  } else if (!motivationStyle) {
    motivationStyle = "balanced";
  }

  if (
    lower.includes("pray") ||
    lower.includes("god") ||
    lower.includes("jesus") ||
    lower.includes("bible") ||
    lower.includes("verse")
  ) {
    faithFocus = "strong";
  } else if (!faithFocus) {
    faithFocus = "growing";
  }

  const nextProfile = {
    ...profile,
    coachMemory: {
      ...profile.coachMemory,
      prefersShortWorkouts:
        lower.includes("short") ||
        lower.includes("simplify") ||
        lower.includes("too long")
          ? true
          : profile.coachMemory?.prefersShortWorkouts || false,
      lastChatTopic,
      recurringTopics,
      commonStruggles,
      victories,
      preferredFoods,
      avoidedFoods,
      allergies,
      learnedInjuries,
      learnedLimits,
      motivationStyle,
      faithFocus,
    },
  };

  setProfile(nextProfile);

  const userMsg = {
    role: "user",
    text: cleanText,
  };

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

  if (!completedOnboarding && screen === "welcome") {
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
      justifyContent:
        message.role === "ai" ? "flex-start" : "flex-end",
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

          <div style={tourCard}>
            <h3 style={{ marginTop: 0 }}>Quick tour</h3>
            <p style={tourLine}>Home shows what matters today.</p>
            <p style={tourLine}>Today’s Routine gives your movement plan.</p>
            <p style={tourLine}>Chat lets you talk to your Coach anytime.</p>
            <p style={tourLine}>Progress is where tracking will live.</p>
          </div>

          <button style={primaryButton} onClick={finishThemeAndTour}>
            Finish setup
          </button>
        </div>
      </div>
    </div>
  );
}

  const headerTextColor = "#ffffff";
  const homeBodyBackground = `linear-gradient(180deg, #f7f7f8 0%, ${selectedTheme.tint} 100%)`;

  return (
    <div style={appStyles}>
      <div style={phoneStyles}>
        <div
          style={{
            ...homeHeader,
            background: `linear-gradient(135deg, ${selectedTheme.primary}, ${selectedTheme.accent})`,
            color: headerTextColor,
          }}
        >
          <div style={headerTopRow}>
            <div>
              <h1 style={homeBrandTitle}>
                <span style={{ display: "block" }}>Christian</span>
                <span style={{ display: "block" }}>Fitness</span>
              </h1>
            </div>
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
                <p style={sectionLabelDark}>{coach.speaker}</p>
                <h2 style={cardTitle}>{coach.message}</h2>
                <p style={bodyText}>
                  <strong>Daily focus:</strong> {coach.focus}
                </p>
                <p style={bodyTextLast}>
                  <strong>Today’s action:</strong> {coach.action}
                </p>
              </div>
              {latestWeeklyReport && !weeklyReportDismissed && (
  <div style={weeklyReportCard}>
    <p style={sectionLabel}>Weekly Report</p>
    <h3 style={cardTitle}>Your weekly check-in</h3>
    <p style={bodyText}>{latestWeeklyReport.summary}</p>
    {latestWeeklyReport.wins?.map((win, index) => (
      <p key={index} style={bodyText}>
        • {win}
      </p>
    ))}
    <p style={bodyTextLast}>
      <strong>Next step:</strong> {latestWeeklyReport.nextStep}
    </p>
    <button
      style={secondaryButton}
      onClick={() => setWeeklyReportDismissed(true)}
    >
      Close weekly report
    </button>
  </div>
)}

              <div style={dailyCard}>
                <p style={sectionLabel}>Today’s Routine</p>
                <h3 style={cardTitle}>{routineData.title}</h3>
                <p style={bodyText}>{routineData.summary}</p>
                <p style={bodyTextLast}>
                  <strong>Estimated length:</strong> {routineLength}
                </p>
                <button
                  style={secondaryButton}
                  onClick={() => setActiveTab("routine")}
                >
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
              </div>

              <div style={dailyCard}>
                <p style={sectionLabel}>Food guidance</p>
                <p style={bodyTextLast}>{foodGuidance}</p>
              </div>

              <div style={coachMemoryCard}>
                <p style={sectionLabelWhite}>Coach memory note</p>
                <p style={bodyTextWhite}>
                  Neutral until the app learns more. Current preference:{" "}
                  <strong>
                    {profile.coachMemory?.detailLevel === "detailed"
                      ? "detailed progress"
                      : "balanced guidance"}
                  </strong>
                  . Main goal: <strong>{profile.mainGoal || "still learning"}</strong>.
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
                <button style={actionCard}>Food</button>
                <button style={actionCard}>Sick</button>
                <button style={actionCard}>Travel</button>
                <button style={actionCard}>Emergency</button>
                <button style={actionCard}>Budget</button>
              </div>

<button
  style={primaryDarkButton}
  onClick={() => {
    const nextProfile = {
      ...profile,
      coachMemory: {
        ...profile.coachMemory,
        prefersShortWorkouts: true,
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
            </>
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
      <div
        style={{
          ...bubbleBase,
          ...(msg.role === "ai" ? aiBubbleSolid : userBubbleLight),
        }}
      >
        {msg.role === "ai"
  ? cleanCoachBubbleText(msg.text, profile.coachName)
  : msg.text}
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

              <div style={inputAreaLight}>
                <input
                  style={textInputLight}
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
                <h2 style={cardTitle}>Tracking will grow here</h2>
                <p style={bodyText}>
                  This section is where measurements, reports, and progress views will go next.
                </p>
                <p style={bodyTextLast}>
                  Add or update your measurements in the boxes below.
                </p>
              </div>

              <div style={routineSectionCard}>
                <h3 style={routineSectionTitle}>Your Measurements</h3>

                <div style={unitToggleWrap}>
                  <button
                    style={
                      profile.measurementUnit === "Inches"
                        ? unitToggleActive
                        : unitToggleButton
                    }
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
                    style={
                      profile.measurementUnit === "Centimeters"
                        ? unitToggleActive
                        : unitToggleButton
                    }
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

                <p style={{ ...bodyText, marginTop: 12 }}>
                  These save on this device automatically.
                </p>
                <p style={bodyTextLast}>
  Saved measurement snapshots: <strong>{profile.measurementHistory?.length || 0}</strong>
</p>
                {profile.measurementHistory?.length > 0 && (
  <div style={routineSectionCard}>
    <h3 style={routineSectionTitle}>Measurement History</h3>
    {profile.measurementHistory
      .slice()
      .reverse()
      .map((snapshot) => (
        <div
          key={snapshot.id}
          style={{
            background: "#ffffff",
            border: "1px solid rgba(0,0,0,0.08)",
            borderRadius: 18,
            padding: 12,
            marginBottom: 10,
          }}
        >
{MEASUREMENT_FIELDS.map((field) => (
  <p key={field.key} style={{ ...bodyText, marginBottom: 6 }}>
    <strong>{field.label}:</strong>{" "}
    {snapshot.measurements?.[field.key] || "-"}
  </p>
))}
        </div>
      ))}
  </div>
)}
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
                  gender={profile.gender}
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

    {activeTab === "settings" && (
  <>
    <div style={dailyCard}>
      <p style={sectionLabel}>Settings</p>
      <h2 style={cardTitle}>App settings</h2>
      <p style={bodyText}>
        Update your saved setup answers anytime.
      </p>
      <p style={bodyText}>
        Coach name: <strong>{capitalizeName(profile.coachName) || "Coach"}</strong>
      </p>
      <p style={bodyTextLast}>
        User name: <strong>{capitalizeName(profile.firstName) || "Not set"}</strong>
      </p>
    </div>

    <div style={routineSectionCard}>
      <p style={sectionLabel}>Coach memory</p>
      <h3 style={cardTitle}>What the coach has learned</h3>
      <p style={bodyText}>
        <strong>Motivation style:</strong>{" "}
        {profile.coachMemory?.motivationStyle || "balanced"}
      </p>
      <p style={bodyText}>
        <strong>Faith focus:</strong>{" "}
        {profile.coachMemory?.faithFocus || "growing"}
      </p>
      <p style={bodyText}>
        <strong>Preferred foods:</strong>{" "}
        {profile.coachMemory?.preferredFoods?.length
          ? profile.coachMemory.preferredFoods.join(", ")
          : "None saved yet"}
      </p>
      <p style={bodyText}>
        <strong>Avoided foods:</strong>{" "}
        {profile.coachMemory?.avoidedFoods?.length
          ? profile.coachMemory.avoidedFoods.join(", ")
          : "None saved yet"}
      </p>
      <p style={bodyText}>
        <strong>Allergies:</strong>{" "}
        {profile.coachMemory?.allergies?.length
          ? profile.coachMemory.allergies.join(", ")
          : "None saved yet"}
      </p>
      <p style={bodyText}>
        <strong>Injuries or pain:</strong>{" "}
        {profile.coachMemory?.learnedInjuries?.length
          ? profile.coachMemory.learnedInjuries.join(", ")
          : "None saved yet"}
      </p>
      <p style={bodyText}>
        <strong>Limits or preferences:</strong>{" "}
        {profile.coachMemory?.learnedLimits?.length
          ? profile.coachMemory.learnedLimits.join(", ")
          : "None saved yet"}
      </p>
      <p style={bodyText}>
        <strong>Common struggles:</strong>{" "}
        {profile.coachMemory?.commonStruggles?.length
          ? profile.coachMemory.commonStruggles.join(", ")
          : "None saved yet"}
      </p>
      <p style={bodyTextLast}>
        <strong>Victories:</strong>{" "}
        {profile.coachMemory?.victories?.length
          ? profile.coachMemory.victories.join(", ")
          : "None saved yet"}
      </p>
    </div>

    <div style={memoryCard}>
      <p style={sectionLabel}>Coach Memory</p>
      <h3 style={cardTitle}>What the coach has learned</h3>
      <p style={bodyText}>
        <strong>Last chat topic:</strong>{" "}
        {profile.coachMemory?.lastChatTopic || "None yet"}
      </p>
      <p style={bodyText}>
        <strong>Recurring topics:</strong>{" "}
        {profile.coachMemory?.recurringTopics?.length
          ? profile.coachMemory.recurringTopics.join(", ")
          : "None yet"}
      </p>
      <p style={bodyText}>
        <strong>Common struggles:</strong>{" "}
        {profile.coachMemory?.commonStruggles?.length
          ? profile.coachMemory.commonStruggles.join(", ")
          : "None yet"}
      </p>
      <p style={bodyText}>
        <strong>Victories:</strong>{" "}
        {profile.coachMemory?.victories?.length
          ? profile.coachMemory.victories.join(", ")
          : "None yet"}
      </p>
      <p style={bodyText}>
        <strong>Preferred foods:</strong>{" "}
        {profile.coachMemory?.preferredFoods?.length
          ? profile.coachMemory.preferredFoods.join(", ")
          : "None yet"}
      </p>
      <p style={bodyText}>
        <strong>Avoided foods:</strong>{" "}
        {profile.coachMemory?.avoidedFoods?.length
          ? profile.coachMemory.avoidedFoods.join(", ")
          : "None yet"}
      </p>
      <p style={bodyText}>
        <strong>Allergies:</strong>{" "}
        {profile.coachMemory?.allergies?.length
          ? profile.coachMemory.allergies.join(", ")
          : "None yet"}
      </p>
      <p style={bodyText}>
        <strong>Learned injuries:</strong>{" "}
        {profile.coachMemory?.learnedInjuries?.length
          ? profile.coachMemory.learnedInjuries.join(", ")
          : "None yet"}
      </p>
      <p style={bodyText}>
        <strong>Learned limits:</strong>{" "}
        {profile.coachMemory?.learnedLimits?.length
          ? profile.coachMemory.learnedLimits.join(", ")
          : "None yet"}
      </p>
      <p style={bodyText}>
        <strong>Motivation style:</strong>{" "}
        {profile.coachMemory?.motivationStyle || "Not learned yet"}
      </p>
      <p style={bodyTextLast}>
        <strong>Faith focus:</strong>{" "}
        {profile.coachMemory?.faithFocus || "Not learned yet"}
      </p>
    </div>

    <div style={dailyCard}>
      <button
        style={secondaryButton}
        onClick={() => setEditingSetup((current) => !current)}
      >
        {editingSetup ? "Hide setup answers" : "Edit setup answers"}
      </button>

      {editingSetup && (
        <div style={editAnswersWrap}>
          {QUESTION_FLOW.filter(
            (question) =>
              question.key !== "measurementUnit" &&
              (!question.showIf || question.showIf(profile))
          ).map((question) => (
            <div key={question.key} style={editAnswerCard}>
              <div>
                <p style={editAnswerLabel}>{question.label}</p>
                <p style={editAnswerValue}>
                  {profile[question.key] ? String(profile[question.key]) : "Not answered"}
                </p>
              </div>
              <button
                style={editAnswerButton}
                onClick={() => {
                  setScreen("onboarding");
                  setQuestionIndex(
                    getVisibleQuestionFlow(profile).findIndex(
                      (item) => item.key === question.key
                    )
                  );
                  setInputValue(profile[question.key] || "");
                  setEditingSetup(false);
                  setMessages((current) => [
                    ...current,
                    {
                      role: "ai",
                      text: `${capitalizeName(profile.coachName) || "Coach"}: Alright — let’s update that answer.`,
                    },
                  ]);
                }}
              >
                Edit
              </button>
            </div>
          ))}
        </div>

      <button
        style={secondaryButton}
        onClick={() =>
          setProfile((current) => ({
            ...current,
            coachMemory: {
              ...current.coachMemory,
              recurringTopics: [],
              commonStruggles: [],
              victories: [],
              preferredFoods: [],
              avoidedFoods: [],
              allergies: [],
              learnedInjuries: [],
              learnedLimits: [],
              motivationStyle: "",
              faithFocus: "",
              lastChatTopic: "",
            },
          }))
        }
      >
        Clear coach memory
      </button>

      <button style={dangerButton} onClick={resetApp}>
        Reset App
      </button>
    </div>
  </>
)}

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
            style={activeTab === "settings" ? navButtonActive : navButton}
            onClick={() => setActiveTab("settings")}
          >
            Settings
          </button>
        </div>

        {showTour && (
          <div style={tourOverlay}>
            <div style={tourModal}>
              <p style={sectionLabel}>{tourSteps[tourStep].title}</p>
              <h3 style={{ marginTop: 8, marginBottom: 10 }}>Quick tour</h3>
              <p style={{ marginTop: 0, lineHeight: 1.5 }}>
                {tourSteps[tourStep].body}
              </p>

              {tourStep === 3 && (
                <div style={measurementMiniCard}>
                  <TourMeasurementDiagram
                    gender={profile.gender}
                    activePart={profile.activeMeasurementField}
                    onSelectPart={(part) =>
                      setProfile((current) => ({
                        ...current,
                        activeMeasurementField: part,
                      }))
                    }
                  />
                </div>
              )}

              <button style={primaryDarkButton} onClick={nextTourStep}>
                {tourStep === tourSteps.length - 1 ? "Finish tour" : "Next"}
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
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
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
  scrollBehavior: "smooth",
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

const themeWrap = {
  padding: 22,
  display: "flex",
  flexDirection: "column",
  gap: 18,
};

const themeCard = {
  display: "flex",
  alignItems: "center",
  gap: 14,
  width: "100%",
  padding: 14,
  borderRadius: 22,
  color: "white",
  cursor: "pointer",
};

const tourCard = {
  background: "rgba(255,255,255,0.08)",
  borderRadius: 24,
  padding: 18,
};

const tourLine = {
  margin: "0 0 10px",
  color: "rgba(255,255,255,0.85)",
};

const homeHeader = {
  padding: 22,
};

const headerTopRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 12,
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

const coachMemoryCard = {
  background: "#111",
  color: "white",
  borderRadius: 24,
  padding: 18,
};

const sectionLabel = {
  margin: 0,
  fontSize: 12,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  opacity: 0.7,
};

const sectionLabelDark = {
  margin: 0,
  fontSize: 12,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  opacity: 0.75,
  color: "rgba(255,255,255,0.72)",
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
  margin: 0,
  lineHeight: 1.5,
  color: "white",
};

const buttonGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 10,
};

const actionCard = {
  border: "none",
  background: "rgba(255,255,255,0.88)",
  backdropFilter: "blur(10px)",
  borderRadius: 20,
  padding: "16px 14px",
  textAlign: "left",
  fontWeight: 700,
  boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
  cursor: "pointer",
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

const exerciseCard = {
  border: "1px solid rgba(0,0,0,0.08)",
  borderRadius: 20,
  padding: 14,
  marginBottom: 14,
  background: "#fcfcfd",
};

const exerciseTitle = {
  margin: "0 0 8px",
  fontSize: 18,
};

const exerciseMeta = {
  margin: "0 0 6px",
  lineHeight: 1.4,
};

const exerciseNote = {
  margin: "8px 0 0",
  color: "#4b5563",
  lineHeight: 1.4,
  fontSize: 14,
};

const videoWrap = {
  marginTop: 12,
};

const videoFrame = {
  border: "none",
  borderRadius: 16,
};

const feedbackRow = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 10,
};

const feedbackButton = {
  border: "1px solid rgba(0,0,0,0.08)",
  borderRadius: 18,
  padding: "14px 12px",
  fontWeight: 700,
  cursor: "pointer",
};

const feedbackQuestion = {
  margin: "8px 0 6px",
  fontSize: 14,
  fontWeight: 700,
  color: "#111",
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
  appearance: "auto",
  WebkitAppearance: "menulist",
  MozAppearance: "menulist",
};

const measurementUnitText = {
  minWidth: 24,
  fontSize: 13,
  fontWeight: 700,
  color: "#6b7280",
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
  scrollBehavior: "smooth",
};

const chatSpeaker = {
  fontSize: 12,
  opacity: 0.7,
  marginBottom: 6,
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

const tourOverlay = {
  position: "absolute",
  inset: 0,
  background: "rgba(0,0,0,0.45)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 18,
};

const tourModal = {
  width: "100%",
  background: "white",
  color: "#111",
  borderRadius: 24,
  padding: 18,
  boxShadow: "0 24px 60px rgba(0,0,0,0.25)",
};

const measurementMiniCard = {
  background: "#f8fafc",
  borderRadius: 18,
  padding: 14,
  marginBottom: 14,
};

const diagramWrap = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
  background: "rgba(255,255,255,0.9)",
  borderRadius: 22,
  padding: 16,
  color: "#111",
};

const diagramSvg = {
  width: "100%",
  height: 220,
  background: "#fff",
  borderRadius: 16,
};

const diagramText = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

const diagramLine = {
  margin: 0,
  lineHeight: 1.45,
};
const secondaryOnboardingButton = {
  width: "100%",
  border: "1px solid rgba(255,255,255,0.18)",
  borderRadius: 18,
  padding: "14px 16px",
  background: "transparent",
  color: "white",
  fontWeight: 700,
  fontSize: 15,
  cursor: "pointer",
};

const editAnswersWrap = {
  display: "grid",
  gap: 10,
  marginTop: 14,
  marginBottom: 14,
};

const editAnswerCard = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  padding: 14,
  borderRadius: 18,
  background: "#f8fafc",
  border: "1px solid rgba(0,0,0,0.08)",
};

const memoryCard = {
  background: "#ffffff",
  borderRadius: 20,
  padding: 16,
  marginTop: 14,
  border: "1px solid rgba(0,0,0,0.08)",
};

const editAnswerLabel = {
  margin: "0 0 6px",
  fontSize: 13,
  fontWeight: 700,
  color: "#111",
};

const editAnswerValue = {
  margin: 0,
  fontSize: 14,
  lineHeight: 1.4,
  color: "#4b5563",
};

const editAnswerButton = {
  border: "1px solid rgba(0,0,0,0.08)",
  background: "#111111",
  color: "white",
  borderRadius: 14,
  padding: "10px 14px",
  fontWeight: 700,
  cursor: "pointer",
};
const weeklyReportCard = {
  background: "rgba(255,255,255,0.92)",
  backdropFilter: "blur(10px)",
  borderRadius: 24,
  padding: 18,
  boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
  border: "1px solid rgba(0,0,0,0.06)",
};
