// Study page JavaScript functionality

// Application state
let currentCardIndex = 0;
let filteredCards = [];
let studySession = {
    startTime: Date.now(),
    studied: 0,
    correct: 0,
    streak: 0,
    maxStreak: 0,
    responses: [],
};

// DOM elements
let flashcard, flipBtn, flipBackBtn, prevBtn, nextBtn;
let currentCardEl, totalCardsEl, progressFill, progressText, timeElapsed;
let cardCategory, cardCategoryBack, cardDifficulty, cardDifficultyBack;
let cardQuestion, cardAnswer;
let easyBtn, mediumBtn, hardBtn;
let studiedCountEl, correctCountEl, streakCountEl, accuracyRateEl;
let categoryFilter, difficultyFilter, studyMode;
let settingsBtn, settingsModal, closeSettings;

// Initialize the study page
document.addEventListener("DOMContentLoaded", () => {
    // Initialize with all cards (default + user-created)
    initializeCards();

    initializeElements();
    loadCategories();
    setupEventListeners();
    loadSettings();
    parseURLParams();
    addFeedbackStyles();

    // Apply initial filters
    applyFilters();

    updateCard();
    updateProgress();
    updateStats();
    startTimer();
});

// Initialize all available cards
function initializeCards() {
    const defaultCards = window.flashcardsData || [];
    const userCards = window.flashcardManager ? window.flashcardManager.getUserCards() : [];

    // Combine default and user cards
    filteredCards = [...defaultCards, ...userCards];
    console.log("Initialized with cards:", {
        default: defaultCards.length,
        user: userCards.length,
        total: filteredCards.length,
    });
}

function initializeElements() {
    const requiredElements = ["flashcard", "flipBtn", "flipBackBtn", "prevBtn", "nextBtn", "cardQuestion", "cardAnswer", "easyBtn", "mediumBtn", "hardBtn"];

    const missingElements = requiredElements.filter((id) => !document.getElementById(id));

    if (missingElements.length > 0) {
        console.error("Missing required elements:", missingElements);
        alert("Error: Some required elements are missing. Please refresh the page.");
        return;
    }

    // Flashcard elements
    flashcard = document.getElementById("flashcard");
    flipBtn = document.getElementById("flipBtn");
    flipBackBtn = document.getElementById("flipBackBtn");
    prevBtn = document.getElementById("prevBtn");
    nextBtn = document.getElementById("nextBtn");

    // Progress elements
    currentCardEl = document.getElementById("sessionStats");
    progressFill = document.getElementById("progressFill");
    progressText = document.getElementById("progressText");
    timeElapsed = document.getElementById("timeElapsed");

    // Card content elements
    cardCategory = document.getElementById("cardCategory");
    cardCategoryBack = document.getElementById("cardCategoryBack");
    cardDifficulty = document.getElementById("cardDifficulty");
    cardDifficultyBack = document.getElementById("cardDifficultyBack");
    cardQuestion = document.getElementById("cardQuestion");
    cardAnswer = document.getElementById("cardAnswer");

    // Feedback buttons
    easyBtn = document.getElementById("easyBtn");
    mediumBtn = document.getElementById("mediumBtn");
    hardBtn = document.getElementById("hardBtn");

    // Debug log for button initialization
    console.log("Button elements initialized:", {
        easyBtn: easyBtn,
        mediumBtn: mediumBtn,
        hardBtn: hardBtn,
    });

    // Stats elements
    studiedCountEl = document.getElementById("studiedCount");
    correctCountEl = document.getElementById("correctCount");
    streakCountEl = document.getElementById("streakCount");
    accuracyRateEl = document.getElementById("accuracyRate");

    // Filter elements
    categoryFilter = document.getElementById("categoryFilter");
    difficultyFilter = document.getElementById("difficultyFilter");
    studyMode = document.getElementById("studyMode");

    // Settings modal
    settingsBtn = document.getElementById("settingsBtn");
    settingsModal = document.getElementById("settingsModal");
    closeSettings = document.getElementById("closeSettings");
}

function loadCategories() {
    if (!window.flashcardManager) {
        console.error("Flashcard manager not initialized");
        return;
    }

    const allCategories = window.flashcardManager.getAllCategories();

    if (categoryFilter) {
        const categoryOptions = ['<option value="all">All Topics</option>'];
        allCategories.forEach((category) => {
            const isCustom = category.userCreated ? " (Custom)" : "";
            categoryOptions.push(`<option value="${category.key}">${category.name}${isCustom}</option>`);
        });
        categoryFilter.innerHTML = categoryOptions.join("");
    }
}

function setupEventListeners() {
    console.log("Setting up event listeners..."); // Debug log

    // Flashcard interactions
    if (flipBtn) flipBtn.addEventListener("click", flipCard);
    if (flipBackBtn) flipBackBtn.addEventListener("click", flipCard);
    if (prevBtn) prevBtn.addEventListener("click", previousCard);
    if (nextBtn) nextBtn.addEventListener("click", nextCard);

    // Feedback buttons
    if (easyBtn) {
        console.log("Adding click listener to easy button");
        easyBtn.onclick = () => handleDifficulty("easy");
    }
    if (mediumBtn) {
        console.log("Adding click listener to medium button");
        mediumBtn.onclick = () => handleDifficulty("medium");
    }
    if (hardBtn) {
        console.log("Adding click listener to hard button");
        hardBtn.onclick = () => handleDifficulty("hard");
    }

    // Filters
    if (categoryFilter) categoryFilter.addEventListener("change", applyFilters);
    if (difficultyFilter) difficultyFilter.addEventListener("change", applyFilters);
    if (studyMode) studyMode.addEventListener("change", handleStudyModeChange);

    // Settings modal
    if (settingsBtn) settingsBtn.addEventListener("click", openSettings);
    if (closeSettings) closeSettings.addEventListener("click", closeSettingsModal);
    if (settingsModal) {
        settingsModal.addEventListener("click", (e) => {
            if (e.target === settingsModal) closeSettingsModal();
        });
    }

    // Keyboard navigation
    document.addEventListener("keydown", handleKeyPress);

    // Click on card to flip
    if (flashcard) {
        flashcard.addEventListener("click", (e) => {
            if (!e.target.closest("button")) {
                flipCard();
            }
        });
    }

    console.log("Event listeners setup complete"); // Debug log
}

function parseURLParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get("category");
    const difficulty = urlParams.get("difficulty");

    if (category && categoryFilter) {
        categoryFilter.value = category;
    }
    if (difficulty && difficultyFilter) {
        difficultyFilter.value = difficulty;
    }

    if (category || difficulty) {
        applyFilters();
    }
}

function applyFilters() {
    const categoryValue = categoryFilter?.value || "all";
    const difficultyValue = difficultyFilter?.value || "all";
    const studyModeValue = studyMode?.value || "sequential";

    console.log("Applying filters:", { categoryValue, difficultyValue, studyModeValue });

    // Get all cards (default + user-created)
    const allCards = window.flashcardManager ? window.flashcardManager.getAllCards() : window.flashcardsData || [];

    filteredCards = allCards.filter((card) => {
        const categoryMatch = categoryValue === "all" || card.category === categoryValue;
        const difficultyMatch = difficultyValue === "all" || card.difficulty === difficultyValue;
        return categoryMatch && difficultyMatch;
    });

    // Apply study mode
    if (studyModeValue === "random") {
        filteredCards = [...filteredCards].sort(() => Math.random() - 0.5);
    } else if (studyModeValue === "spaced") {
        // Get user's card history from localStorage
        const userStats = JSON.parse(localStorage.getItem("userStats") || "{}");
        const cardHistory = userStats.cardHistory || {};

        // Sort cards by last studied time (least recently studied first)
        filteredCards.sort((a, b) => {
            const timeA = cardHistory[a.id]?.lastStudied || 0;
            const timeB = cardHistory[b.id]?.lastStudied || 0;
            return timeA - timeB;
        });
    }

    console.log("Filtered cards:", filteredCards.length);

    // Reset to first card
    currentCardIndex = 0;
    updateCard();
    updateProgress();
    updateStats();
}

function handleStudyModeChange() {
    const mode = studyMode?.value || "sequential";

    switch (mode) {
        case "random":
            filteredCards = utils.shuffleArray(filteredCards);
            break;
        case "spaced":
            // Simple spaced repetition: prioritize cards that were marked as hard
            const userStats = utils.storage.get("userStats", {});
            filteredCards.sort((a, b) => {
                const aStats = userStats[a.id] || { difficulty: "medium", lastSeen: 0 };
                const bStats = userStats[b.id] || { difficulty: "medium", lastSeen: 0 };

                // Prioritize hard cards and cards not seen recently
                const aPriority = (aStats.difficulty === "hard" ? 2 : 1) + (Date.now() - aStats.lastSeen) / 86400000;
                const bPriority = (bStats.difficulty === "hard" ? 2 : 1) + (Date.now() - bStats.lastSeen) / 86400000;

                return bPriority - aPriority;
            });
            break;
        case "sequential":
        default:
            // Keep original order
            break;
    }

    currentCardIndex = 0;
    updateCard();
    updateProgress();
}

function updateCard() {
    if (filteredCards.length === 0) {
        console.log("No cards available after filtering");
        return;
    }

    const card = filteredCards[currentCardIndex];

    // Get category info from flashcard manager or fallback to default
    let categoryInfo = {
        name: card.category
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
        icon: "📚",
    };

    if (window.flashcardManager) {
        const allCategories = window.flashcardManager.getAllCategories();
        const categoryObj = allCategories.find((cat) => cat.key === card.category);
        if (categoryObj) {
            categoryInfo = {
                name: categoryObj.name,
                icon: categoryObj.icon || "📚",
            };
        }
    } else if (window.categoryData && window.categoryData[card.category]) {
        categoryInfo = window.categoryData[card.category];
    }

    // Update card content
    cardQuestion.textContent = card.question;
    cardAnswer.textContent = card.answer;

    // Update category and difficulty
    const categoryText = `${categoryInfo.icon} ${categoryInfo.name}`;
    const userCreatedBadge = card.userCreated ? " 👤" : "";
    cardCategory.textContent = categoryText + userCreatedBadge;
    cardCategoryBack.textContent = categoryText + userCreatedBadge;

    const difficultyText = card.difficulty.charAt(0).toUpperCase() + card.difficulty.slice(1);
    cardDifficulty.textContent = difficultyText;
    cardDifficultyBack.textContent = difficultyText;

    // Update navigation buttons
    prevBtn.disabled = currentCardIndex === 0;
    nextBtn.disabled = currentCardIndex === filteredCards.length - 1;

    // Reset card state
    flashcard.classList.remove("flipped");
    clearFeedbackSelection();

    // Update progress
    updateProgress();
}

function flipCard() {
    if (flashcard) {
        flashcard.classList.toggle("flipped");

        // Add bounce animation
        flashcard.classList.add("bounce");
        setTimeout(() => flashcard.classList.remove("bounce"), 600);
    }
}

function previousCard() {
    if (currentCardIndex > 0) {
        currentCardIndex--;
        updateCard();
        updateProgress();
    }
}

function nextCard() {
    if (currentCardIndex < filteredCards.length - 1) {
        currentCardIndex++;
        updateCard();
        updateProgress();
    } else {
        // End of session
        completeSession();
    }
}

function handleDifficulty(difficulty) {
    console.log("Handling difficulty:", difficulty);

    const card = filteredCards[currentCardIndex];
    if (!card) {
        console.error("No card available at current index:", currentCardIndex);
        return;
    }

    // Update button selection with visual feedback
    clearFeedbackSelection();
    const button = document.getElementById(`${difficulty}Btn`);
    if (button) {
        console.log("Updating button state for:", difficulty);
        button.classList.add("selected");
        button.classList.add("feedback-animation");
        setTimeout(() => button.classList.remove("feedback-animation"), 500);
    }

    // Record response
    studySession.responses.push({
        cardId: card.id,
        difficulty: difficulty,
        timestamp: Date.now(),
    });

    // Update session stats
    studySession.studied++;
    if (difficulty === "easy") {
        studySession.correct++;
        studySession.streak++;
        studySession.maxStreak = Math.max(studySession.maxStreak, studySession.streak);
    } else {
        studySession.streak = 0;
    }

    // Save card stats
    saveCardStats(card.id, difficulty);

    // Update display
    updateStats();

    // Check if we've reached the session limit
    const cardsPerSession = utils.storage.get("cardsPerSession", "20");
    if (cardsPerSession !== "all" && studySession.studied >= Number.parseInt(cardsPerSession)) {
        completeSession();
        return;
    }

    // Auto-advance if enabled
    const autoAdvance = utils.storage.get("autoAdvance", true);
    if (autoAdvance) {
        setTimeout(() => {
            nextCard();
        }, 1000);
    }
}

function saveCardStats(cardId, difficulty) {
    const userStats = utils.storage.get("userStats", {});

    if (!userStats[cardId]) {
        userStats[cardId] = {
            timesStudied: 0,
            lastDifficulty: "medium",
            lastSeen: 0,
        };
    }

    userStats[cardId].timesStudied++;
    userStats[cardId].lastDifficulty = difficulty;
    userStats[cardId].lastSeen = Date.now();

    utils.storage.set("userStats", userStats);
}

function clearFeedbackSelection() {
    const feedbackBtns = document.querySelectorAll(".feedback-btn");
    feedbackBtns.forEach((btn) => {
        btn.classList.remove("selected");
        btn.classList.remove("feedback-animation");
    });
}

function updateProgress() {
    const progress = filteredCards.length > 0 ? ((currentCardIndex + 1) / filteredCards.length) * 100 : 0;

    if (progressFill) progressFill.style.width = `${progress}%`;
    if (progressText) progressText.textContent = `${Math.round(progress)}% Complete`;

    // Update session stats display
    if (currentCardEl) {
        currentCardEl.textContent = `${currentCardIndex + 1} / ${filteredCards.length} cards`;
    }
}

function updateStats() {
    if (studiedCountEl) studiedCountEl.textContent = studySession.studied;
    if (correctCountEl) correctCountEl.textContent = studySession.correct;
    if (streakCountEl) streakCountEl.textContent = studySession.streak;

    if (accuracyRateEl) {
        const accuracy = studySession.studied > 0 ? Math.round((studySession.correct / studySession.studied) * 100) : 0;
        accuracyRateEl.textContent = `${accuracy}%`;
    }
}

function startTimer() {
    // Clear any existing timer
    if (window.studyTimer) {
        clearInterval(window.studyTimer);
    }

    window.studyTimer = setInterval(() => {
        const elapsed = Math.floor((Date.now() - studySession.startTime) / 1000);
        if (timeElapsed) {
            timeElapsed.textContent = utils.formatTime(elapsed);
        }
    }, 1000);
}

function handleKeyPress(e) {
    switch (e.key) {
        case "ArrowLeft":
            if (prevBtn && !prevBtn.disabled) previousCard();
            break;
        case "ArrowRight":
            nextCard();
            break;
        case " ":
        case "Enter":
            e.preventDefault();
            flipCard();
            break;
        case "1":
            handleDifficulty("easy");
            break;
        case "2":
            handleDifficulty("medium");
            break;
        case "3":
            handleDifficulty("hard");
            break;
    }
}

function openSettings() {
    if (settingsModal) {
        settingsModal.classList.add("active");
        settingsModal.style.display = "flex";
    }
}

function closeSettingsModal() {
    if (settingsModal) {
        settingsModal.classList.remove("active");
        settingsModal.style.display = "none";
    }
}

function loadSettings() {
    const autoAdvance = utils.storage.get("autoAdvance", true);
    const showHints = utils.storage.get("showHints", false);
    const cardsPerSession = utils.storage.get("cardsPerSession", "20");

    const autoAdvanceEl = document.getElementById("autoAdvance");
    const showHintsEl = document.getElementById("showHints");
    const cardsPerSessionEl = document.getElementById("cardsPerSession");

    if (autoAdvanceEl) autoAdvanceEl.checked = autoAdvance;
    if (showHintsEl) showHintsEl.checked = showHints;
    if (cardsPerSessionEl) cardsPerSessionEl.value = cardsPerSession;

    // Add event listeners for settings
    if (autoAdvanceEl) {
        autoAdvanceEl.addEventListener("change", function () {
            utils.storage.set("autoAdvance", this.checked);
        });
    }

    if (showHintsEl) {
        showHintsEl.addEventListener("change", function () {
            utils.storage.set("showHints", this.checked);
        });
    }

    if (cardsPerSessionEl) {
        cardsPerSessionEl.addEventListener("change", function () {
            utils.storage.set("cardsPerSession", this.value);
            applySessionLimit();
        });
    }

    applySessionLimit();
}

function applySessionLimit() {
    const cardsPerSession = utils.storage.get("cardsPerSession", "20");
    console.log("Applying session limit:", cardsPerSession);

    if (cardsPerSession !== "all") {
        const limit = Number.parseInt(cardsPerSession);
        if (filteredCards.length > limit) {
            filteredCards = filteredCards.slice(0, limit);
            console.log("Limited cards to:", limit);
            updateProgress(); // Update progress when cards are limited
        }
    }
}

function completeSession() {
    const sessionDuration = Math.floor((Date.now() - studySession.startTime) / 1000);
    const accuracy = studySession.studied > 0 ? Math.round((studySession.correct / studySession.studied) * 100) : 0;

    console.log("Completing session:", {
        duration: sessionDuration,
        studied: studySession.studied,
        correct: studySession.correct,
        accuracy: accuracy,
        maxStreak: studySession.maxStreak,
    });

    // Save session to history
    const sessionHistory = utils.storage.get("sessionHistory", []);
    sessionHistory.push({
        date: new Date().toISOString(),
        duration: sessionDuration,
        cardsStudied: studySession.studied,
        accuracy: accuracy,
        maxStreak: studySession.maxStreak,
        responses: studySession.responses,
    });
    utils.storage.set("sessionHistory", sessionHistory);

    // Update overall stats
    const overallStats = utils.storage.get("overallStats", {
        totalStudied: 0,
        totalCorrect: 0,
        totalSessions: 0,
        bestStreak: 0,
        totalTime: 0,
    });

    overallStats.totalStudied += studySession.studied;
    overallStats.totalCorrect += studySession.correct;
    overallStats.totalSessions++;
    overallStats.bestStreak = Math.max(overallStats.bestStreak, studySession.maxStreak);
    overallStats.totalTime += sessionDuration;

    utils.storage.set("overallStats", overallStats);

    // Show completion message
    showCompletionMessage(sessionDuration, accuracy);
}

function showCompletionMessage(duration, accuracy) {
    // Clear the timer when session ends
    if (window.studyTimer) {
        clearInterval(window.studyTimer);
        window.studyTimer = null;
    }

    const message = `
        🎉 Session Complete! 
        
        📊 Session Summary:
        • Cards Studied: ${studySession.studied}
        • Accuracy: ${accuracy}%
        • Best Streak: ${studySession.maxStreak}
        • Time: ${utils.formatTime(duration)}
        
        Keep up the great work! 🚀
    `;

    alert(message);

    // Reset for another session
    studySession = {
        startTime: Date.now(),
        studied: 0,
        correct: 0,
        streak: 0,
        maxStreak: 0,
        responses: [],
    };

    // Reapply filters to get fresh card set
    applyFilters();

    // Validate we have cards to study
    if (filteredCards.length === 0) {
        alert("No cards available for study with current filters. Please adjust your filters.");
        return;
    }

    currentCardIndex = 0;
    updateCard();
    updateProgress();
    updateStats();
    startTimer();
}

// Add CSS for feedback buttons
function addFeedbackStyles() {
    const style = document.createElement("style");
    style.textContent = `
    .feedback-btn {
      padding: 10px 20px;
      margin: 0 5px;
      border: 2px solid #ddd;
      border-radius: 5px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .feedback-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }

    .feedback-btn.selected {
      border-color: #4CAF50;
      background-color: #4CAF50;
      color: white;
    }

    .feedback-animation {
      animation: feedback-pulse 0.5s ease;
    }

    @keyframes feedback-pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }

    #easyBtn { background-color: #4CAF50; color: white; }
    #mediumBtn { background-color: #FFC107; color: black; }
    #hardBtn { background-color: #F44336; color: white; }
  `;
    document.head.appendChild(style);
}
