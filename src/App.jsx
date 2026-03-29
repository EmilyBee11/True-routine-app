import { useEffect, useMemo, useState } from "react";

const VERSES = [
  "Colossians 3:23 — Whatever you do, work at it with all your heart, as working for the Lord, not for human masters.",
  "Philippians 4:13 — I can do all things through Christ who strengthens me.",
  "Galatians 6:9 — Let us not grow weary in doing good, for at the proper time we will reap a harvest if we do not give up.",
  "1 Timothy 4:8 — For physical training is of some value, but godliness has value for all things, holding promise for both the present life and the life to come.",
];

const QUESTION_FLOW = [
  { key: "firstName", label: "What’s your first name?", type: "text" },
  { key: "age", label: "How old are you?", type: "number" },
  { key: "state", label: "What state do you live in?", type: "text" },
  {
    key: "gender",
    label: "Are you male or female?",
    type: "choice",
    options: ["Female", "Male"],
  },
  {
    key: "relationshipStatus",
    label: "Are you single or married?",
    type: "choice",
    options: ["Single", "Married"],
  },
  {
    key: "denomination",
    label: "What denomination are you, if any?",
    type: "text",
  },
  {
    key: "whyStarted",
    label: "Why did you decide to start this?",
    type: "text",
  },
  {
    key: "lifeChange",
    label: "What are you hoping changes in your life because of this?",
    type: "text",
  },
  {
    key: "activityLevel",
    label: "What’s your current activity level?",
    type: "choice",
    options: ["Beginner", "Somewhat active", "Active"],
  },
  {
    key: "mainGoal",
    label: "What is your main fitness goal right now?",
    type: "choice",
    options: [
      "Build discipline",
      "Lose weight",
      "Build muscle",
      "General fitness",
      "Mental + physical health",
    ],
  },
  {
    key: "progressStyle",
    label: "How detailed do you want progress tracking to be?",
    type: "choice",
    options: ["Simple progress only", "Detailed tracking"],
  },
  {
    key: "measurementUnit",
    label: "Which measurement unit do you want to use?",
    type: "choice",
    options: ["Inches", "Centimeters"],
  },
  {
    key: "bodyFocus",
    label: "What part of your body or fitness do you most want to improve first?",
    type: "text",
  },
  {
    key: "bodyMeasurements",
    label:
      "If you want body tracking, add any starting measurements you know now. You can list waist, hips, chest, thighs, arms, weight, or type skip.",
    type: "text",
  },
  {
    key: "foodPreferences",
    label: "Any food preferences, dislikes, allergies, or eating habits I should know about?",
    type: "text",
  },
  {
    key: "coachName",
    label: "Do you want to name your AI coach? Type a name or say skip.",
    type: "text",
  },
];

const COLOR_OPTIONS = [
  { name: "Obsidian", primary: "#0d0d0f", accent: "#ffffff" },
  { name: "Graphite", primary: "#17181c", accent: "#f3f4f6" },
  { name: "Stone", primary: "#1f1f22", accent: "#e5e7eb" },
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

export default function App() {
  const [verseIndex, setVerseIndex] = useState(0);
  const [screen, setScreen] = useState("welcome");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem("christian-fitness-profile");
    return saved ? JSON.parse(saved) : {};
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

    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("christian-fitness-profile", JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem("christian-fitness-messages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem("christian-fitness-theme", JSON.stringify(selectedTheme));
  }, [selectedTheme]);

  const currentQuestion = QUESTION_FLOW[questionIndex];
  const completedOnboarding = Boolean(profile.onboardingComplete);

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
      answer.toLowerCase() === "skip" && currentQuestion.type === "text" ? "" : answer;

    setMessages((current) => [...current, { role: "user", text: answer }]);

    const updatedProfile = {
      ...profile,
      [currentQuestion.key]: safeAnswer,
      coachMemory: {
        detailLevel:
          currentQuestion.key === "progressStyle" && answer === "Detailed tracking"
            ? "detailed"
            : profile.coachMemory?.detailLevel || "balanced",
        tone: "balanced",
      },
    };

    setProfile(updatedProfile);
    setInputValue("");

    const nextIndex = questionIndex + 1;

    if (nextIndex < QUESTION_FLOW.length) {
      setQuestionIndex(nextIndex);
      setTimeout(() => {
        setMessages((current) => [
          ...current,
          { role: "ai", text: QUESTION_FLOW[nextIndex].label },
        ]);
      }, 250);
      return;
    }

    setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          role: "ai",
          text: "Perfect. I’ve got your first setup saved. Next I’ll give you a quick tour.",
        },
      ]);
    }, 250);

    setProfile((current) => ({
      ...current,
      ...updatedProfile,
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
  }

  function resetApp() {
    localStorage.removeItem("christian-fitness-profile");
    localStorage.removeItem("christian-fitness-messages");
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
    setSelectedTheme(COLOR_OPTIONS[0]);
    setQuestionIndex(0);
    setInputValue("");
    setScreen("welcome");
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

<h2 style={welcomeHeading}>Christian Wellness Coach</h2>

<p style={welcomeCopy}>
  Build your body with purpose.
</p>

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
                Question {questionIndex + 1} of {QUESTION_FLOW.length}
              </p>
            </div>
            <button style={ghostButton} onClick={resetApp}>
              Reset
            </button>
          </div>

          <div style={chatArea}>
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
              Clean black and white base, with a theme feel that matches you.
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
                        ? "2px solid white"
                        : "1px solid rgba(255,255,255,0.18)",
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
              <p style={tourLine}>Progress tracks your consistency calmly.</p>
              <p style={tourLine}>Sick, Travel, and Emergency stay visible.</p>
            </div>

            <button style={primaryButton} onClick={finishThemeAndTour}>
              Finish setup
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={appStyles}>
      <div style={phoneStyles}>
        <div
          style={{
            ...homeHeader,
            background: `linear-gradient(135deg, ${selectedTheme.primary}, ${selectedTheme.accent})`,
            color: selectedTheme.accent === "#ffffff" ? "#111" : "#fff",
          }}
        >
          <h1 style={{ margin: 0, lineHeight: 1 }}>
            <span style={{ display: "block" }}>Christian</span>
            <span style={{ display: "block" }}>Fitness</span>
          </h1>

          <div style={tickerViewportHome}>
            <div key={verseIndex} style={tickerTextHome}>
              {VERSES[verseIndex]}
            </div>
          </div>
        </div>

        <div style={homeBody}>
          <div style={dailyCard}>
            <p style={sectionLabel}>Today’s focus</p>
            <h2 style={cardTitle}>
              {profile.firstName ? `Good morning, ${profile.firstName}` : "Good morning"}
            </h2>
            <p style={bodyText}>
              Show up with effort, keep it simple, and honor God in how you care
              for your body today.
            </p>
          </div>

          <div style={verseCard}>
            <p style={sectionLabel}>Daily verse</p>
            <h3 style={cardTitle}>{todayVerseCard.verse}</h3>
            <p style={bodyText}>
              <strong>What this means today:</strong> {todayVerseCard.meaning}
            </p>
            <p style={bodyText}>
              <strong>Today’s action:</strong> {todayVerseCard.action}
            </p>
          </div>

          <div style={coachMemoryCard}>
            <p style={sectionLabel}>Coach memory note</p>
            <p style={bodyText}>
              Prefers{" "}
              <strong>
                {profile.coachMemory?.detailLevel === "detailed"
                  ? "detailed progress"
                  : "balanced guidance"}
              </strong>
              , uses <strong>{profile.measurementUnit || "chosen units"}</strong>,
              and wants a <strong>faith-centered fitness plan</strong>.
            </p>
          </div>

          <div style={buttonGrid}>
            <button style={actionCard}>Today’s Routine</button>
            <button style={actionCard}>Chat</button>
            <button style={actionCard}>Progress</button>
            <button style={actionCard}>Food</button>
            <button style={actionCard}>Sick</button>
            <button style={actionCard}>Travel</button>
            <button style={actionCard}>Emergency</button>
            <button style={actionCard}>Budget</button>
          </div>

          <button style={primaryButton}>Simplify My Day</button>

          <button style={ghostButtonDark} onClick={resetApp}>
            Reset onboarding
          </button>
        </div>
      </div>
    </div>
  );
}

const welcomeWrap = {
paddingTop: 40,
paddingBottom: 40,
  minHeight: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  padding: 22,
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
};

const brandBlock = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
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
  background: "rgba(255,255,255,0.1)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 28,
  padding: 20,
  marginBottom: 18,
};

const welcomeEyebrow = {
  margin: 0,
  color: "rgba(255,255,255,0.72)",
  fontSize: 12,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
};

const welcomeHeading = {
  margin: "10px 0 8px",
  fontSize: 28,
  lineHeight: 1.1,
};

const welcomeCopy = {
  margin: "0 0 18px",
  color: "rgba(255,255,255,0.85)",
  lineHeight: 1.55,
};

const primaryButton = {
  width: "100%",
  border: "none",
  borderRadius: 18,
  padding: "15px 18px",
  background: "white",
  color: "#111",
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

const chatArea = {
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

const userBubble = {
  background: "white",
  color: "#111",
  borderBottomRightRadius: 8,
};

const inputArea = {
  padding: 16,
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
  background: "rgba(255,255,255,0.08)",
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
  background: "#f7f7f8",
  color: "#111",
  flex: 1,
  padding: 18,
  display: "flex",
  flexDirection: "column",
  gap: 14,
};

const dailyCard = {
  background: "white",
  borderRadius: 24,
  padding: 18,
  boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
};

const verseCard = {
  background: "white",
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

const cardTitle = {
  margin: "8px 0 10px",
  lineHeight: 1.3,
};

const bodyText = {
  margin: 0,
  lineHeight: 1.5,
};

const buttonGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 10,
};

const actionCard = {
  border: "none",
  background: "white",
  borderRadius: 20,
  padding: "16px 14px",
  textAlign: "left",
  fontWeight: 700,
  boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
  cursor: "pointer",
};

const ghostButtonDark = {
  border: "1px solid rgba(0,0,0,0.1)",
  background: "transparent",
  color: "#111",
  borderRadius: 18,
  padding: "14px 16px",
  cursor: "pointer",
};
