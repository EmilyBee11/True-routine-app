import { useEffect, useMemo, useState } from "react";

const VERSES = [
  "Colossians 3:23 — Whatever you do, work at it with all your heart, as working for the Lord, not for human masters.",
  "Philippians 4:13 — I can do all things through Christ who strengthens me.",
  "Galatians 6:9 — Let us not grow weary in doing good, for at the proper time we will reap a harvest if we do not give up.",
  "1 Timothy 4:8 — For physical training is of some value, but godliness has value for all things, holding promise for both the present life and the life to come.",
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
    type: "text",
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
    state: "Just type the state you live in.",
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

function getConversationalReply(profile, justAnsweredKey) {
  const name = capitalizeName(profile.firstName) || "";
  const coachName = capitalizeName(profile.coachName) || "Coach";

  const map = {
    coachName: `${coachName}: ${coachName} it is. I like that.`,
    firstName: `${coachName}: Nice to meet you, ${name}.`,
    age: `${coachName}: Got it, ${name}.`,
    state: `${coachName}: Okay, that helps.`,
    gender: `${coachName}: Alright.`,
    pregnancyStatus:
      profile.pregnancyStatus === "Pregnant" || profile.pregnancyStatus === "Postpartum"
        ? getSupportMessage(profile)
        : `${coachName}: Okay, thank you for telling me that.`,
    pregnancyTrimester: `${coachName}: Got it. That helps me guide you more carefully.`,
    pregnancyRestrictions: `${coachName}: Good to know. I’ll keep that in mind.`,
    pregnancySymptoms: `${coachName}: Thank you. We’ll keep things supportive and gentle where needed.`,
    postpartumTime: `${coachName}: Got it.`,
    deliveryType: `${coachName}: Okay, thank you for sharing that.`,
    postpartumConcerns: `${coachName}: That helps. We’ll build carefully around that.`,
    relationshipStatus: `${coachName}: Okay.`,
    denomination: `${coachName}: Got it.`,
    whyStarted: `${coachName}: That makes sense.`,
    lifeChange: `${coachName}: I can see why that matters to you.`,
    activityLevel: `${coachName}: Got it. That gives me a better feel for your starting point.`,
    hasLimitations: `${coachName}: Okay.`,
    limitationType: `${coachName}: Got it.`,
    limitationName: `${coachName}: Thank you. That helps.`,
    limitationDuration: `${coachName}: Okay.`,
    activityLimit: `${coachName}: That gives me a clearer picture.`,
    mainGoal: `${coachName}: That makes sense.`,
    bodyFocus: `${coachName}: Got it.`,
    foodPreferences: `${coachName}: Good to know.`,
  };

  return map[justAnsweredKey] || `${coachName}: Got it.`;
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
const feedbackReason = (profile.coachMemory?.lastRoutineFeedbackReason || "").toLowerCase();

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

  if (shouldGoGentle || adjust.easier) return beginnerRoutine;
  if (adjust.harder) return muscleRoutine;
  if (goal.includes("discipline")) return disciplineRoutine;
  if (goal.includes("muscle") || goal.includes("strength")) return muscleRoutine;
  if (goal.includes("weight")) return weightLossRoutine;

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

  if (adjust.shorter) {
    return {
      ...balancedRoutine,
      summary: "A shorter full-body session based on your last workout feedback.",
      main: balancedRoutine.main.slice(0, 3),
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

function getAIResponse(input, profile) {
  const lower = input.toLowerCase().trim();
  const coachName = capitalizeName(profile.coachName) || "Coach";
  const firstName = capitalizeName(profile.firstName) || "";
  const namePart = firstName ? `, ${firstName}` : "";

  const goal = (profile.mainGoal || "").toLowerCase();
  const activity = (profile.activityLevel || "").toLowerCase();
  const pregnancyStatus = profile.pregnancyStatus || "";
  const foodPrefs = (profile.foodPreferences || "").toLowerCase();
  const limitationText = [
    profile.hasLimitations,
    profile.limitationType,
    profile.limitationName,
    profile.activityLimit,
    profile.pregnancyRestrictions,
    profile.pregnancySymptoms,
    profile.postpartumConcerns,
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
    limitationText.includes("bleeding");

  if (
    lower.includes("measurement") ||
    lower.includes("measurements") ||
    lower.includes("where do i put")
  ) {
    return `${coachName}: Put them in the Progress tab${namePart}, inside the measurement boxes. You can also tap the body diagram to match each box more easily.`;
  }

  if (lower.includes("what do you mean") || lower.includes("clarify")) {
    return `${coachName}: Absolutely${namePart}. Tell me which part you want me to explain, and I’ll make it simple.`;
  }

  if (lower.includes("simplify my day") || lower === "simplify") {
    if (isGentleMode) {
      return `${coachName}: Absolutely${namePart}. Today we keep it simple: warmup, 1 to 2 main movements, a short walk, and steady breathing. That is enough for today.`;
    }
    return `${coachName}: Absolutely${namePart}. Strip today down to the essentials: warmup, first 2 main exercises, one simple healthy meal choice, and done.`;
  }

  if (lower.includes("adjust my routine") || lower.includes("adjust")) {
    if (isGentleMode) {
      return `${coachName}: Yes${namePart}. I’d keep today lower-pressure and more controlled. We can make it shorter, gentler, or more recovery-focused. Tell me which one you want.`;
    }
    return `${coachName}: Yes${namePart}. I can make it shorter, easier, harder, or more focused. Tell me which direction you want and I’ll guide it.`;
  }

  if (lower.includes("help with food") || lower.includes("food")) {
    if (foodPrefs.includes("allerg")) {
      return `${coachName}: Let’s keep food simple today${namePart}. Stay with meals you already know work well for your body, and focus on enough protein, steady energy, and hydration.`;
    }
    if (goal.includes("muscle") || goal.includes("strength")) {
      return `${coachName}: For today${namePart}, build meals around protein, carbs for energy, and water. Keep it simple and repeatable.`;
    }
    if (goal.includes("weight")) {
      return `${coachName}: For today${namePart}, focus on protein, fiber, and meals that actually keep you full. Simple beats perfect.`;
    }
    return `${coachName}: Let’s keep food steady today${namePart} — protein, something filling, and enough water. Nothing extreme.`;
  }

  if (lower.includes("discouraged") || lower.includes("i feel discouraged")) {
    return `${coachName}: I hear you${namePart}. Feeling discouraged does not erase your progress. We are not chasing perfect — we are practicing faithfulness. Let’s choose one good next step and do that well.`;
  }

  if (lower.includes("pray for me") || lower.includes("pray")) {
    return `${coachName}: Of course. Lord, give ${firstName || "them"} peace, strength, wisdom, and steady courage today. Help them care for their body with humility, discipline, and grace. Amen.`;
  }

  if (lower.includes("pregnant")) {
    return `${coachName}: You are in the right place${namePart}. We’ll keep this safe, calm, and strength-building with gentle calisthenics, walking, posture, breathing, and wise pacing.`;
  }

  if (lower.includes("postpartum")) {
    return `${coachName}: You are in the right place${namePart}. We’ll rebuild gradually with gentle core awareness, posture, walking, controlled movement, and patience.`;
  }

  if (lower.includes("tired") || lower.includes("exhausted")) {
    return `${coachName}: Then today needs wisdom, not guilt${namePart}. A shorter and gentler day still counts. Low-pressure consistency is still obedience.`;
  }

  if (
    lower.includes("i missed") ||
    lower.includes("fell off") ||
    lower.includes("behind")
  ) {
    return `${coachName}: Then we restart simply${namePart}. No shame, no dramatic reset. Just the next right step today.`;
  }

  if (lower.includes("hard") || lower.includes("too hard")) {
    return `${coachName}: Thank you for telling me${namePart}. That means we should scale the plan, not quit it. We can lower reps, shorten the session, or choose easier movements.`;
  }

  if (lower.includes("easy") || lower.includes("too easy")) {
    return `${coachName}: That is helpful${namePart}. We can increase challenge gradually with more reps, slower tempo, or one more round.`;
  }

  if (goal.includes("discipline")) {
    return `${coachName}: I’m with you${namePart}. Since your focus is discipline, I want you to keep today simple and follow through fully. Completion matters more than intensity right now.`;
  }

  if (goal.includes("muscle") || goal.includes("strength")) {
    return `${coachName}: Since your goal is strength${namePart}, focus on controlled reps, good form, and not rushing. Strong and steady.`;
  }

  if (goal.includes("weight")) {
    return `${coachName}: Since your goal is weight loss${namePart}, think consistency: movement, simple meals, and no all-or-nothing thinking.`;
  }

  return `${coachName}: I’m with you${namePart}. Tell me what kind of help you need right now — routine, food, motivation, recovery, or prayer.`;
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
  const isWoman = gender === "Woman";

  const labelStyle = (key, baseColor) => ({
    fontSize: "14",
    fill: activePart === key ? "#111111" : baseColor,
    fontWeight: "700",
    cursor: "pointer",
  });

  return (
    <div style={diagramWrap}>
      <svg viewBox="0 0 320 300" style={diagramSvg}>
        {isWoman ? (
          <>
            <circle cx="160" cy="42" r="20" fill="#f59e8b" opacity="0.9" />
            <path
              d="M160 64
                 C145 78, 138 98, 140 120
                 L132 185
                 C130 202, 138 220, 150 236
                 L155 278
                 L165 278
                 L170 236
                 C182 220, 190 202, 188 185
                 L180 120
                 C182 98, 175 78, 160 64 Z"
              fill="#f59e8b"
              opacity="0.9"
            />
            <path d="M140 108 L108 168" stroke="#f59e8b" strokeWidth="12" strokeLinecap="round" />
            <path d="M180 108 L212 168" stroke="#f59e8b" strokeWidth="12" strokeLinecap="round" />
            <path d="M148 236 L142 292" stroke="#f59e8b" strokeWidth="12" strokeLinecap="round" />
            <path d="M172 236 L178 292" stroke="#f59e8b" strokeWidth="12" strokeLinecap="round" />

            <text x="10" y="122" style={labelStyle("chest", "#f59e8b")} onClick={() => onSelectPart?.("chest")}>Chest</text>
            <text x="10" y="154" style={labelStyle("waist", "#f59e8b")} onClick={() => onSelectPart?.("waist")}>Waist</text>
            <text x="10" y="180" style={labelStyle("highHip", "#f59e8b")} onClick={() => onSelectPart?.("highHip")}>High Hip</text>
            <text x="10" y="204" style={labelStyle("hip", "#f59e8b")} onClick={() => onSelectPart?.("hip")}>Hip</text>
            <text x="10" y="252" style={labelStyle("thigh", "#f59e8b")} onClick={() => onSelectPart?.("thigh")}>Thigh</text>
            <text x="10" y="290" style={labelStyle("calf", "#f59e8b")} onClick={() => onSelectPart?.("calf")}>Calf</text>
          </>
        ) : (
          <>
            <circle cx="160" cy="42" r="20" fill="#7dd3fc" opacity="0.95" />
            <path
              d="M160 64
                 C142 74, 132 92, 132 118
                 L128 188
                 C127 208, 138 224, 148 236
                 L152 292
                 L162 292
                 L166 236
                 C176 224, 188 208, 187 188
                 L183 118
                 C183 92, 178 74, 160 64 Z"
              fill="#7dd3fc"
              opacity="0.95"
            />
            <path d="M132 104 L96 174" stroke="#7dd3fc" strokeWidth="14" strokeLinecap="round" />
            <path d="M188 104 L224 174" stroke="#7dd3fc" strokeWidth="14" strokeLinecap="round" />
            <path d="M148 236 L144 296" stroke="#7dd3fc" strokeWidth="14" strokeLinecap="round" />
            <path d="M172 236 L176 296" stroke="#7dd3fc" strokeWidth="14" strokeLinecap="round" />

            <text x="10" y="126" style={labelStyle("chest", "#67c7dd")} onClick={() => onSelectPart?.("chest")}>Chest</text>
            <text x="10" y="160" style={labelStyle("waist", "#67c7dd")} onClick={() => onSelectPart?.("waist")}>Waist</text>
            <text x="10" y="188" style={labelStyle("highHip", "#67c7dd")} onClick={() => onSelectPart?.("highHip")}>High Hip</text>
            <text x="10" y="212" style={labelStyle("hip", "#67c7dd")} onClick={() => onSelectPart?.("hip")}>Hip</text>
            <text x="10" y="252" style={labelStyle("thigh", "#67c7dd")} onClick={() => onSelectPart?.("thigh")}>Thigh</text>
            <text x="10" y="290" style={labelStyle("calf", "#67c7dd")} onClick={() => onSelectPart?.("calf")}>Calf</text>
          </>
        )}
      </svg>

      <div style={diagramText}>
        <p style={diagramLine}>
          <strong>Tap a body part</strong> to highlight its measurement box below.
        </p>
      </div>
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

  if (typeof answer === "string" && isClarifyMessage(answer)) {
    const coachName = capitalizeName(profile.coachName) || "Coach";
    setMessages((current) => [
      ...current,
      { role: "user", text: answer },
      {
        role: "ai",
        text: `${coachName}: ${getClarificationForQuestion(currentQuestion)}`,
      },
    ]);
    setInputValue("");
    return;
  }

  if (!answer) return;

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
  const coachName = capitalizeName(nextProfile.coachName) || "Coach";
  const firstName = capitalizeName(nextProfile.firstName);
  setMessages((current) => [
    ...current,
    {
      role: "ai",
      text: `${coachName}: Perfect${firstName ? `, ${firstName}` : ""}. That gives me a strong starting picture of you. Before we move on, if you want to change any answer, tap Edit last answer. If everything looks good, I’ll walk you through your style and tour next.`,
    },
    {
      role: "ai",
      text: `${coachName}: As we go, we’ll keep things simple with a weekly check-in, and build a fuller progress report each month.

To make that accurate, try to remeasure about once a month — it helps us see what’s actually changing.`,
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

  setProfile((current) => ({
    ...current,
    coachMemory: {
      ...current.coachMemory,
      lastUserMessage: cleanText,
      prefersShortWorkouts:
        cleanText.toLowerCase().includes("short") ||
        cleanText.toLowerCase().includes("too long")
          ? true
          : current.coachMemory?.prefersShortWorkouts || false,
    },
  }));

  const userMsg = {
    role: "user",
    text: cleanText,
  };

  const aiMsg = {
    role: "ai",
    speaker: coachName,
    text: getAIResponse(cleanText, profile),
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

          <div style={onboardingChatArea}>
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                style={{
                  display: "flex",
                  justifyContent:
                    message.role === "ai" ? "flex-start" : "flex-end",
                }}
              >
                <div
                  style={{
                    ...bubbleBase,
                    ...(message.role === "ai" ? aiBubble : userBubble),
                  }}
                >
                  {message.text}
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
            <p style={subtleText}>Pick a granite-style base with one accent color.</p>

            <div style={{ display: "grid", gap: 12, width: "100%" }}>
              {COLOR_OPTIONS.map((option) => (
                <button
                  key={option.name}
                  onClick={() => setSelectedTheme(option)}
                  style={{
                    ...themeCard,
                    border:
                      selectedTheme.name === option.name
                        ? `2px solid ${option.accent}`
                        : "1px solid rgba(255,255,255,0.18)",
                    background: `linear-gradient(135deg, ${option.primary}, ${option.tint})`,
                  }}
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 16,
                      background: `linear-gradient(135deg, ${option.primary}, ${option.accent})`,
                    }}
                  />
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontWeight: 700 }}>{option.name}</div>
                    <div style={subtleText}>Use this as your base style</div>
                  </div>
                </button>
              ))}
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
    setActiveTab("chat");
    sendChatMessage("Simplify my day");
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

              <div style={appChatHistory}>
                {chatMessages.map((msg, index) => (
                  <div
                    key={`${msg.role}-${index}`}
                    style={{
                      display: "flex",
                      justifyContent: msg.role === "ai" ? "flex-start" : "flex-end",
                    }}
                  >
                    <div
                      style={{
                        ...bubbleBase,
                        ...(msg.role === "ai" ? aiBubbleSolid : userBubbleLight),
                      }}
                    >
                      {msg.role === "ai" && (
                        <div style={chatSpeaker}>
                          {capitalizeName(msg.speaker) || "Coach"}
                        </div>
                      )}
                      {msg.text}
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
  <p style={bodyText}>
    User name: <strong>{capitalizeName(profile.firstName) || "Not set"}</strong>
  </p>

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
              setQuestionIndex(getVisibleQuestionFlow(profile).findIndex(
                (item) => item.key === question.key
              ));
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
  )}

  <button style={dangerButton} onClick={resetApp}>
    Reset App
  </button>
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
