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
    label: "Before we start, what do you want to call your coach?",
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
    label: "Do you have any injuries, disabilities, pain, or physical limitations I should know about?",
    type: "choice",
    options: ["Yes", "No"],
  },
  {
    key: "limitationType",
    label: "Is it more of an injury, a disability, chronic pain, or something else?",
    type: "text",
  },
  {
    key: "limitationName",
    label: "What is it called, or how would you describe it?",
    type: "text",
  },
  {
    key: "limitationDuration",
    label: "How long have you been dealing with it?",
    type: "text",
  },
  {
    key: "activityLimit",
    label: "How active can you comfortably be right now?",
    type: "text",
  },
  {
    key: "mainGoal",
    label: "What are you trying to improve right now with your body or health?",
    type: "text",
  },
  {
    key: "progressStyle",
    label: "Do you want to keep progress pretty simple, or pay closer attention to it over time?",
    type: "choice",
    options: ["Keep it simple", "Track it closely"],
  },
  {
    key: "measurementUnit",
    label: "Which measurement unit do you want to use?",
    type: "choice",
    options: ["Inches", "Centimeters"],
  },
  {
    key: "bodyFocus",
    label: "What part of your body, routine, or fitness do you want to improve first?",
    type: "text",
  },
  {
    key: "bodyMeasurements",
    label:
      "Do you want to add your starting measurements now, or skip and do them later?",
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
  };
}

function getVisibleQuestionFlow(profile) {
  const hasLimits = profile.hasLimitations === "Yes";

  return QUESTION_FLOW.filter((question) => {
    if (
      ["limitationType", "limitationName", "limitationDuration", "activityLimit"].includes(
        question.key
      )
    ) {
      return hasLimits;
    }
    return true;
  });
}

function getRoutineLength(profile) {
  const goal = (profile.mainGoal || "").toLowerCase();
  const activity = profile.activityLevel || "";
  const detailed = profile.progressStyle === "Track it closely";

  if (activity === "Beginner") return detailed ? "25–30 min" : "18–24 min";
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

  if (shouldGoGentle) return beginnerRoutine;
  if (goal.includes("discipline")) return disciplineRoutine;
  if (goal.includes("muscle") || goal.includes("strength")) return muscleRoutine;
  if (goal.includes("weight")) return weightLossRoutine;

  return {
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
}

function getCoachMessage(profile) {
  const firstName = capitalizeName(profile.firstName) || "";
  const coachName = capitalizeName(profile.coachName) || "Coach";
  const greetingName = Math.random() > 0.5 && firstName ? ` ${firstName}` : "";
  const goal = (profile.mainGoal || "").toLowerCase();
  const detail = profile.progressStyle || "";
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

  if (detail === "Track it closely") {
    focus = `${focus} We’ll pay closer attention to progress over time.`;
  }

  if (activity === "Beginner") {
    message = `We’re keeping this approachable${greetingName} and building from where you are now.`;
  }

  if (whyStarted && whyStarted.length > 10) {
    action = `Remember why you started: ${whyStarted.slice(0, 55)}${whyStarted.length > 55 ? "..." : ""}`;
  }

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
  const lower = input.toLowerCase();

  if (
    lower.includes("measurement") ||
    lower.includes("measurements") ||
    lower.includes("where do i put")
  ) {
    return "Put your measurements in the Progress tab, inside the Your Measurements box. That is where your body tracking goes.";
  }

  if (lower.includes("simplify")) {
    return "Alright — let’s make today lighter. Focus on the warmup, your first two main movements, and one simple nourishing meal choice. That still counts.";
  }
  if (lower.includes("discouraged")) {
    return "That feeling is real, but it does not erase your progress. Let’s focus on one faithful next step instead of trying to fix everything at once.";
  }
  if (lower.includes("food")) {
    return getFoodGuidance(profile);
  }
  if (lower.includes("adjust")) {
    return "We can adjust your plan. Tell me whether you want it shorter, easier, or just different today, and I’ll keep it simple.";
  }
  if (lower.includes("pray")) {
    return "God, please give strength, peace, and steady discipline today. Bring clarity, courage, and grace for the next right step. Amen.";
  }

  return "Got it. Tell me a little more and I’ll guide you based on what you’re dealing with.";
}

function getFriendlyLead(profile, justAnsweredKey) {
  const name = capitalizeName(profile.firstName) || "";
  const coachName = capitalizeName(profile.coachName) || "Coach";

  if (!name && justAnsweredKey === "coachName") {
    return `Perfect. ${coachName} is a great name. `;
  }

  const map = {
    coachName: `${coachName} it is. `,
    firstName: `Nice to meet you, ${name}. `,
    age: `Got it, ${name}. `,
    state: `Perfect, ${name}. `,
    gender: `Thanks, ${name}. `,
    relationshipStatus: `Okay, ${name}. `,
    denomination: `Thanks for sharing that, ${name}. `,
    whyStarted: `I’m glad you told me that, ${name}. `,
    lifeChange: `That helps a lot, ${name}. `,
    activityLevel: `Got it, ${name}. `,
    hasLimitations: `Thanks, ${name}. `,
    limitationType: `Okay, ${name}. `,
    limitationName: `Thanks for telling me that, ${name}. `,
    limitationDuration: `Got it, ${name}. `,
    activityLimit: `That helps, ${name}. `,
    mainGoal: `That makes sense, ${name}. `,
    progressStyle: `Perfect, ${name}. `,
    measurementUnit: `Good choice, ${name}. `,
    bodyFocus: `Got it, ${name}. `,
    bodyMeasurements: `That helps, ${name}. `,
    foodPreferences: `Good to know, ${name}. `,
  };

  return map[justAnsweredKey] || `Got it, ${name}. `;
}

function getMeasurementGuide(unit) {
  const u = unit === "Centimeters" ? "cm" : "in";
  return [
    `Waist: wrap the tape around the narrowest part of your waist and keep it level. Write it down in ${u}.`,
    "Hips: measure around the fullest part of your hips and glutes.",
    "Chest: wrap around the fullest part of your chest while standing naturally.",
    "Thigh: measure around the widest part of one upper thigh.",
    "Arm: measure around the fullest part of your upper arm while relaxed.",
  ];
}

function TourMeasurementDiagram() {
  return (
    <div style={diagramWrap}>
      <svg viewBox="0 0 220 260" style={diagramSvg}>
        <circle cx="110" cy="35" r="20" fill="none" stroke="#111" strokeWidth="3" />
        <path d="M110 55 L110 120" stroke="#111" strokeWidth="3" fill="none" />
        <path d="M80 85 L140 85" stroke="#111" strokeWidth="3" fill="none" />
        <path d="M110 120 L85 180" stroke="#111" strokeWidth="3" fill="none" />
        <path d="M110 120 L135 180" stroke="#111" strokeWidth="3" fill="none" />

        <ellipse cx="110" cy="92" rx="34" ry="18" fill="none" stroke="#2563eb" strokeWidth="3" />
        <ellipse cx="110" cy="122" rx="42" ry="18" fill="none" stroke="#14b8a6" strokeWidth="3" />
        <ellipse cx="90" cy="155" rx="16" ry="26" fill="none" stroke="#f97316" strokeWidth="3" />

        <text x="150" y="94" fontSize="12" fill="#2563eb">Chest</text>
        <text x="150" y="124" fontSize="12" fill="#14b8a6">Waist / Hips</text>
        <text x="144" y="156" fontSize="12" fill="#f97316">Thigh</text>
      </svg>

      <div style={diagramText}>
        <p style={diagramLine}><strong>Chest:</strong> tape around the fullest part.</p>
        <p style={diagramLine}><strong>Waist:</strong> tape around the narrowest part.</p>
        <p style={diagramLine}><strong>Hips:</strong> tape around the fullest part.</p>
        <p style={diagramLine}><strong>Thigh:</strong> tape around the upper thigh.</p>
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

  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem("christian-fitness-profile");
    return saved ? normalizeProfile(JSON.parse(saved)) : {};
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
  const completedOnboarding = Boolean(profile.onboardingComplete);
  const routineData = useMemo(() => getRoutineData(profile), [profile]);
  const coach = useMemo(() => getCoachMessage(profile), [profile]);
  const foodGuidance = useMemo(() => getFoodGuidance(profile), [profile]);
  const routineLength = useMemo(() => getRoutineLength(profile), [profile]);

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
      body: "This is your daily main screen. It should answer what matters today without feeling cluttered.",
    },
    {
      title: "Today’s Routine",
      body: "This is where your full calisthenics workout lives, with warmup, main work, cooldown, and videos.",
    },
    {
      title: "Chat",
      body: "You can talk to your coach anytime here. It starts balanced and friendly, then learns what works best for you.",
    },
    {
      title: "Progress",
      body: "This is where body tracking goes. You can save your measurements here and use the diagram to learn how to measure.",
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

    if (!answer) return;

    const safeAnswer =
      answer.toLowerCase() === "skip" && currentQuestion.type === "text"
        ? ""
        : answer;

    const nextProfile = normalizeProfile({
      ...profile,
      [currentQuestion.key]:
        currentQuestion.key === "coachName" || currentQuestion.key === "firstName"
          ? capitalizeName(safeAnswer)
          : safeAnswer,
      coachMemory: {
        detailLevel:
          currentQuestion.key === "progressStyle" && answer === "Track it closely"
            ? "detailed"
            : profile.coachMemory?.detailLevel || "balanced",
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
      const lead = getFriendlyLead(nextProfile, currentQuestion.key);

      setTimeout(() => {
        setMessages((current) => [
          ...current,
          {
            role: "ai",
            text: lead + nextVisibleFlow[nextIndex].label,
          },
        ]);
      }, 250);
      return;
    }

    setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          role: "ai",
          text: `Perfect${nextProfile.firstName ? `, ${nextProfile.firstName}` : ""}. I’ve got your first setup saved. Next I’ll walk you through a quick tour.`,
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

    setProfile({});
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
  }

  function sendChatMessage(text) {
    const cleanText = text.trim();
    if (!cleanText) return;

    const coachName = capitalizeName(profile.coachName) || "Coach";

    const userMsg = { role: "user", text: cleanText };
    const aiMsg = {
      role: "ai",
      speaker: coachName,
      text: getAIResponse(cleanText, profile),
    };

    setChatMessages((prev) => [...prev, userMsg, aiMsg]);
    setChatInput("");
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
            <button style={ghostButton} onClick={resetApp}>
              Reset
            </button>
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
              Pick a granite-style base with one accent color.
            </p>

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
              <p style={tourLine}>Chat lets you talk to your coach anytime.</p>
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
            <button style={headerResetButton} onClick={resetApp}>
              Reset
            </button>
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

              <button style={primaryDarkButton}>Simplify My Day</button>
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
                    background: routineFeedback === "up" ? "#dcfce7" : "#ffffff",
                  }}
                  onClick={() => setRoutineFeedback("up")}
                >
                  👍
                </button>
                <button
                  style={{
                    ...feedbackButton,
                    background: routineFeedback === "down" ? "#fee2e2" : "#ffffff",
                  }}
                  onClick={() => setRoutineFeedback("down")}
                >
                  👎
                </button>
              </div>

              {routineFeedback && (
                <input
                  style={textInputLight}
                  placeholder="What felt off?"
                  value={feedbackReason}
                  onChange={(e) => setFeedbackReason(e.target.value)}
                />
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
                  Add or update your measurements below whenever you want.
                </p>
              </div>

              <div style={routineSectionCard}>
                <h3 style={routineSectionTitle}>Your measurements</h3>

                <textarea
                  style={measurementInput}
                  value={profile.savedMeasurements || ""}
                  onChange={(e) =>
                    setProfile((current) =>
                      normalizeProfile({
                        ...current,
                        savedMeasurements: e.target.value,
                      })
                    )
                  }
                  placeholder="Example: Waist 30, Hips 40, Chest 36, Thigh 22, Arm 12"
                />

                <p style={bodyTextLast}>
                  These save on this device automatically.
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
                <TourMeasurementDiagram />
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
                  <TourMeasurementDiagram />
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

const ghostButton = {
  border: "1px solid rgba(255,255,255,0.2)",
  background: "transparent",
  color: "white",
  borderRadius: 14,
  padding: "10px 14px",
  cursor: "pointer",
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

const measurementInput = {
  width: "100%",
  minHeight: 120,
  boxSizing: "border-box",
  border: "1px solid rgba(0,0,0,0.08)",
  background: "#ffffff",
  color: "#111",
  borderRadius: 18,
  padding: "14px 16px",
  outline: "none",
  fontSize: 15,
  resize: "vertical",
  marginBottom: 12,
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

const headerResetButton = {
  border: "1px solid rgba(255,255,255,0.2)",
  background: "rgba(255,255,255,0.16)",
  color: "white",
  borderRadius: 14,
  padding: "10px 12px",
  cursor: "pointer",
  fontWeight: 600,
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
  gridTemplateColumns: "1fr 1fr 1fr 1fr",
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
