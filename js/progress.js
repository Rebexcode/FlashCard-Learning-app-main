// Progress page JavaScript functionality

let userStats = {};
let sessionHistory = [];
let overallStats = {};
//const flashcardsData = window.flashcardsData || [] // Get from global scop

document.addEventListener("DOMContentLoaded", () => {
    // Load data first
    loadUserData();

    // Debug log to check data
    console.log("Achievements Data:", achievementsData);
    console.log("User Stats:", userStats);
    console.log("Session History:", sessionHistory);
    console.log("Overall Stats:", overallStats);

    renderOverviewStats();
    renderCategoryProgress();
    renderActivityChart();
    renderAchievements();
    renderRecentActivity();

    // Add event listener for activity period dropdown
    const activityPeriodEl = document.getElementById("activityPeriod");
    if (activityPeriodEl) {
        activityPeriodEl.addEventListener("change", (e) => {
            renderActivityChart();

            // Update subtitle based on selected period
            const subtitle = document.getElementById("activitySubtitle");
            if (subtitle) {
                const periodText = {
                    "2weeks": "Last 2 weeks of study activity",
                    month: "Last month of study activity",
                    "3months": "Last 3 months of study activity",
                };
                subtitle.textContent = periodText[e.target.value] || "Track your daily learning habits";
            }
        });
    }
});

function loadUserData() {
    userStats = utils.storage.get("userStats", {});
    sessionHistory = utils.storage.get("sessionHistory", []);
    overallStats = utils.storage.get("overallStats", {
        totalStudied: 0,
        totalCorrect: 0,
        totalSessions: 0,
        bestStreak: 0,
        totalTime: 0,
    });
}

function calculateCurrentStreak() {
    if (sessionHistory.length === 0) return 0;

    // Get unique study dates (convert to date strings)
    const studyDates = [...new Set(sessionHistory.map((session) => session.date.split("T")[0]))].sort();

    if (studyDates.length === 0) return 0;

    // Check if user studied today
    const today = new Date().toISOString().split("T")[0];
    const mostRecentDate = studyDates[studyDates.length - 1];

    // If the most recent study date is not today or yesterday, streak is 0
    const todayTime = new Date(today).getTime();
    const mostRecentTime = new Date(mostRecentDate).getTime();
    const daysDiff = Math.floor((todayTime - mostRecentTime) / (1000 * 60 * 60 * 24));

    if (daysDiff > 1) {
        return 0; // Streak is broken if more than 1 day gap
    }

    // Count consecutive days backwards from the most recent date
    let streak = 0;
    const currentDate = new Date(mostRecentDate);

    for (let i = studyDates.length - 1; i >= 0; i--) {
        const studyDate = studyDates[i];
        const expectedDate = new Date(currentDate);
        expectedDate.setDate(currentDate.getDate() - streak);

        if (studyDate === expectedDate.toISOString().split("T")[0]) {
            streak++;
        } else {
            break;
        }
    }

    return streak;
}

function renderOverviewStats() {
    const totalStudiedEl = document.getElementById("totalStudied");
    const totalCorrectEl = document.getElementById("totalCorrect");
    const currentStreakEl = document.getElementById("currentStreak");
    const studyTimeEl = document.getElementById("studyTime");

    if (totalStudiedEl) {
        animateNumber(totalStudiedEl, 0, overallStats.totalStudied);
    }

    if (totalCorrectEl) {
        animateNumber(totalCorrectEl, 0, overallStats.totalCorrect);
    }

    if (currentStreakEl) {
        // Calculate and show the actual current streak, not best streak
        const currentStreak = calculateCurrentStreak();
        animateNumber(currentStreakEl, 0, currentStreak);
    }

    if (studyTimeEl) {
        const hours = Math.floor(overallStats.totalTime / 3600);
        const minutes = Math.floor((overallStats.totalTime % 3600) / 60);
        studyTimeEl.textContent = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    }
}

function animateNumber(element, start, end, duration = 2000) {
    const startTime = Date.now();

    function update() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (end - start) * easeOut);

        element.textContent = current.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

function renderCategoryProgress() {
    const categoryProgressEl = document.getElementById("categoryProgress");
    if (!categoryProgressEl) {
        console.error("Category progress element not found");
        return;
    }

    console.log("Category Data:", categoryData);
    console.log("Flashcards Data:", flashcardsData);
    console.log("User Stats:", userStats);

    const categoryStats = calculateCategoryProgress();
    console.log("Calculated Category Stats:", categoryStats);

    categoryProgressEl.innerHTML = categoryStats
        .map(
            (category) => `
        <div class="progress-item">
            <div class="progress-label">${category.name}</div>
            <div class="progress-bar-container">
                <div class="progress-bar-fill ${category.id}" style="width: ${category.progress}%"></div>
            </div>
            <div class="progress-percentage">${category.progress}%</div>
        </div>
    `
        )
        .join("");

    // Animate progress bars
    setTimeout(() => {
        const progressBars = categoryProgressEl.querySelectorAll(".progress-bar-fill");
        progressBars.forEach((bar, index) => {
            setTimeout(() => {
                bar.style.transition = "width 1s ease-out";
                bar.style.width = categoryStats[index].progress + "%";
            }, index * 200);
        });
    }, 100);
}

function calculateCategoryProgress() {
    return Object.keys(categoryData).map((categoryId) => {
        const category = categoryData[categoryId];
        const categoryCards = flashcardsData.filter((card) => card.category === categoryId);
        const studiedCards = categoryCards.filter((card) => userStats[card.id]);
        const progress = categoryCards.length > 0 ? Math.round((studiedCards.length / categoryCards.length) * 100) : 0;

        return {
            id: categoryId,
            name: category.name,
            progress: progress,
            studied: studiedCards.length,
            total: categoryCards.length,
        };
    });
}

function renderActivityChart() {
    const activityChartEl = document.getElementById("activityChart");
    if (!activityChartEl) return;

    const period = document.getElementById("activityPeriod")?.value || "month";
    const activityData = generateActivityData(period);

    // Create tooltip element if it doesn't exist
    let tooltip = document.getElementById("activityTooltip");
    if (!tooltip) {
        tooltip = document.createElement("div");
        tooltip.id = "activityTooltip";
        tooltip.className = "activity-tooltip";
        document.body.appendChild(tooltip);
    }

    // Make sure tooltip is hidden initially
    tooltip.classList.remove("show");

    activityChartEl.innerHTML = activityData
        .map((day, index) => {
            const isToday = day.date === new Date().toISOString().split("T")[0];
            const dayName = new Date(day.date + "T00:00:00").toLocaleDateString("en-US", { weekday: "short" });
            const dayNumber = new Date(day.date + "T00:00:00").getDate();

            return `
          <div class="activity-day level-${day.level} ${isToday ? "today" : ""}" 
               data-date="${day.date}"
               data-count="${day.count}"
               data-sessions="${day.sessions}"
               data-accuracy="${day.accuracy}"
               data-streak="${day.streak}"
               title="${dayName}, ${dayNumber}">
              ${day.count > 0 ? day.count : ""}
          </div>
        `;
        })
        .join("");

    // Add event listeners for tooltips
    const activityDays = activityChartEl.querySelectorAll(".activity-day");
    activityDays.forEach((day) => {
        day.addEventListener("mouseenter", showTooltip);
        day.addEventListener("mouseleave", hideTooltip);
        day.addEventListener("click", showDetailedView);
    });

    // Update activity stats
    updateActivityStats(activityData);

    // Update insights
    updateActivityInsights(activityData);
}

function generateActivityData(period = "month") {
    const days = [];
    const today = new Date();
    let daysToShow = 30;

    switch (period) {
        case "2weeks":
            daysToShow = 14;
            break;
        case "month":
            daysToShow = 30;
            break;
        case "3months":
            daysToShow = 90;
            break;
    }

    // Generate activity data for the specified period
    for (let i = daysToShow - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split("T")[0];

        const sessionsOnDate = sessionHistory.filter((session) => session.date.split("T")[0] === dateStr);

        const cardsStudied = sessionsOnDate.reduce((total, session) => total + session.cardsStudied, 0);
        const avgAccuracy = sessionsOnDate.length > 0 ? Math.round(sessionsOnDate.reduce((total, session) => total + session.accuracy, 0) / sessionsOnDate.length) : 0;

        days.push({
            date: dateStr,
            count: cardsStudied,
            sessions: sessionsOnDate.length,
            accuracy: avgAccuracy,
            level: getActivityLevel(cardsStudied),
            streak: 0, // Will be calculated after
        });
    }

    // Calculate streak information for each day
    // This calculates the streak up to each day (not the current global streak)
    let streakCounter = 0;
    for (let i = days.length - 1; i >= 0; i--) {
        if (days[i].count > 0) {
            streakCounter++;
            days[i].streak = streakCounter;
        } else {
            streakCounter = 0;
            days[i].streak = 0;
        }
    }

    // If the most recent day has no activity, check if there's a gap of only 1 day
    if (days.length > 0 && days[days.length - 1].count === 0) {
        const today = new Date().toISOString().split("T")[0];
        const mostRecentDay = days[days.length - 1];

        // If today has no activity, but we're looking at today, maintain streak logic
        if (mostRecentDay.date === today) {
            // Look at yesterday's activity to determine current streak
            const globalStreak = calculateCurrentStreak();
            if (globalStreak > 0) {
                // If we have a global streak, it means the streak is still active
                // even though today might not have activity yet
                days[days.length - 1].streak = globalStreak;
            }
        }
    }

    return days;
}

function getActivityLevel(count) {
    if (count === 0) return 0;
    if (count <= 3) return 1;
    if (count <= 8) return 2;
    if (count <= 15) return 3;
    if (count <= 25) return 4;
    return 5;
}

function updateActivityStats(activityData) {
    const weeklyAverageEl = document.getElementById("weeklyAverage");
    const dayStreakEl = document.getElementById("dayStreak");
    const weeklyGoalEl = document.getElementById("weeklyGoal");

    // Calculate daily average for the selected period
    const totalCards = activityData.reduce((sum, day) => sum + day.count, 0);
    const dailyAverage = Math.round(totalCards / activityData.length);

    // Calculate current streak using the global function (not just from activity data)
    const currentStreak = calculateCurrentStreak();

    // Calculate weekly goal progress (assuming goal is 5 cards per day)
    const goalPerDay = 5;
    const activeDays = activityData.filter((day) => day.count >= goalPerDay).length;
    const goalProgress = Math.round((activeDays / activityData.length) * 100);

    if (weeklyAverageEl) {
        animateNumber(weeklyAverageEl, 0, dailyAverage);
    }

    if (dayStreakEl) {
        animateNumber(dayStreakEl, 0, currentStreak);
    }

    if (weeklyGoalEl) {
        weeklyGoalEl.textContent = `${goalProgress}%`;
    }
}

function updateActivityInsights(activityData) {
    const insightsEl = document.getElementById("activityInsights");
    if (!insightsEl) return;

    const insights = generateInsights(activityData);

    insightsEl.innerHTML = insights
        .map(
            (insight) => `
      <div class="insight-item">
        <div class="insight-icon">${insight.icon}</div>
        <div class="insight-content">
          <div class="insight-title">${insight.title}</div>
          <p class="insight-description">${insight.description}</p>
        </div>
      </div>
    `
        )
        .join("");
}

function generateInsights(activityData) {
    const insights = [];
    const totalCards = activityData.reduce((sum, day) => sum + day.count, 0);
    const activeDays = activityData.filter((day) => day.count > 0).length;
    const currentStreak = calculateCurrentStreak(); // Use global streak calculation
    const bestDay = activityData.reduce((best, day) => (day.count > best.count ? day : best), { count: 0 });

    // Streak insights
    if (currentStreak >= 7) {
        insights.push({
            icon: "🔥",
            title: "Amazing Streak!",
            description: `You've been studying for ${currentStreak} days straight. Keep up the momentum!`,
        });
    } else if (currentStreak >= 3) {
        insights.push({
            icon: "💪",
            title: "Building Momentum",
            description: `${currentStreak} days in a row! You're developing a great habit.`,
        });
    } else if (currentStreak === 0 && activeDays > 0) {
        insights.push({
            icon: "⚡",
            title: "Get Back on Track",
            description: "You've studied before, let's start a new streak today!",
        });
    }

    // Performance insights
    if (totalCards >= 100) {
        insights.push({
            icon: "🎯",
            title: "High Achiever",
            description: `${totalCards} cards studied! You're making excellent progress.`,
        });
    } else if (totalCards >= 50) {
        insights.push({
            icon: "📈",
            title: "Good Progress",
            description: `${totalCards} cards studied. You're building great knowledge!`,
        });
    }

    // Best day insight
    if (bestDay.count >= 10) {
        const bestDate = new Date(bestDay.date + "T00:00:00").toLocaleDateString("en-US", {
            weekday: "long",
            month: "short",
            day: "numeric",
        });
        insights.push({
            icon: "🏆",
            title: "Personal Best",
            description: `Your best day was ${bestDate} with ${bestDay.count} cards studied!`,
        });
    }

    // Consistency insights
    const consistencyRate = (activeDays / activityData.length) * 100;
    if (consistencyRate >= 80) {
        insights.push({
            icon: "🎖️",
            title: "Super Consistent",
            description: `You've been active ${Math.round(consistencyRate)}% of the time. Excellent discipline!`,
        });
    } else if (consistencyRate >= 50) {
        insights.push({
            icon: "📊",
            title: "Good Consistency",
            description: `Active ${Math.round(consistencyRate)}% of the time. Try to study a bit more regularly.`,
        });
    }

    // Encouragement for new users
    if (totalCards === 0) {
        insights.push({
            icon: "🌟",
            title: "Ready to Start?",
            description: "Begin your learning journey today! Even 5 cards can make a difference.",
        });
    }

    return insights.slice(0, 3); // Limit to 3 insights
}

function showTooltip(event) {
    const tooltip = document.getElementById("activityTooltip");
    const day = event.target;
    const date = day.dataset.date;
    const count = parseInt(day.dataset.count);
    const sessions = parseInt(day.dataset.sessions);
    const accuracy = parseInt(day.dataset.accuracy);

    const formattedDate = new Date(date + "T00:00:00").toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
    });

    tooltip.innerHTML = `
    <div class="tooltip-date">${formattedDate}</div>
    <div>${count} cards studied</div>
    ${
        sessions > 0
            ? `
      <div class="tooltip-stats">
        <div class="tooltip-stat">
          <div class="tooltip-stat-value">${sessions}</div>
          <div class="tooltip-stat-label">Sessions</div>
        </div>
        <div class="tooltip-stat">
          <div class="tooltip-stat-value">${accuracy}%</div>
          <div class="tooltip-stat-label">Accuracy</div>
        </div>
      </div>
    `
            : ""
    }
  `;

    // Position tooltip relative to the day element (using fixed positioning)
    const rect = day.getBoundingClientRect();

    // Calculate initial position relative to viewport
    let left = rect.left + rect.width / 2;
    const top = rect.top;

    // Prevent tooltip from going off-screen horizontally
    const tooltipWidth = 200; // Max width from CSS
    if (left - tooltipWidth / 2 < 10) {
        left = tooltipWidth / 2 + 10;
    } else if (left + tooltipWidth / 2 > window.innerWidth - 10) {
        left = window.innerWidth - tooltipWidth / 2 - 10;
    }

    // Set position (fixed positioning uses viewport coordinates)
    tooltip.style.left = left + "px";
    tooltip.style.top = top + "px";

    // Show tooltip
    tooltip.classList.add("show");
}

function hideTooltip() {
    const tooltip = document.getElementById("activityTooltip");
    tooltip.classList.remove("show");
}

function showDetailedView(event) {
    const day = event.target;
    const date = day.dataset.date;
    const count = parseInt(day.dataset.count);

    if (count === 0) {
        if (window.showToast) {
            window.showToast("No study activity on this day. Start studying to build your streak!", "info");
        }
        return;
    }

    const formattedDate = new Date(date + "T00:00:00").toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
    });

    if (window.showToast) {
        window.showToast(`${formattedDate}: ${count} cards studied. Great work!`, "success");
    }
}

function renderAchievements() {
    const achievementsGridEl = document.getElementById("achievementsGrid");
    if (!achievementsGridEl) {
        console.error("Achievements grid element not found");
        return;
    }

    const achievements = checkAchievements();
    console.log("Rendering achievements:", achievements);

    achievementsGridEl.innerHTML = achievements
        .map(
            (achievement) => `
        <div class="achievement-card ${achievement.unlocked ? "unlocked" : ""}">
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-title">${achievement.title}</div>
            <p class="achievement-description">${achievement.description}</p>
        </div>
    `
        )
        .join("");
}

function checkAchievements() {
    // Calculate current stats
    const stats = {
        studied: overallStats.totalStudied || 0,
        maxStreak: overallStats.bestStreak || 0,
        perfectSessions: sessionHistory.filter((session) => session.accuracy === 100).length,
        fastSessions: sessionHistory.filter((session) => session.cardsStudied >= 20 && session.duration <= 300).length,
        categories: Object.keys(categoryData).filter((categoryId) => {
            const categoryCards = flashcardsData.filter((card) => card.category === categoryId);
            return categoryCards.some((card) => userStats[card.id]);
        }).length,
    };

    console.log("Current Stats for Achievements:", stats);

    // Check each achievement
    return achievementsData.map((achievement) => {
        const unlocked = achievement.condition(stats);
        console.log(`Achievement ${achievement.id}: ${unlocked ? "Unlocked" : "Locked"}`);
        return {
            ...achievement,
            unlocked,
        };
    });
}

function renderRecentActivity() {
    const activityListEl = document.getElementById("activityList");
    if (!activityListEl) return;

    const recentActivities = generateRecentActivities();

    if (recentActivities.length === 0) {
        activityListEl.innerHTML = `
            <div class="activity-item">
                <div class="activity-icon study">📚</div>
                <div class="activity-content">
                    <div class="activity-title">No recent activity</div>
                    <p class="activity-description">Start studying to see your activity here!</p>
                </div>
                <div class="activity-time">-</div>
            </div>
        `;
        return;
    }

    activityListEl.innerHTML = recentActivities
        .map(
            (activity) => `
        <div class="activity-item">
            <div class="activity-icon ${activity.type}">${activity.icon}</div>
            <div class="activity-content">
                <div class="activity-title">${activity.title}</div>
                <p class="activity-description">${activity.description}</p>
            </div>
            <div class="activity-time">${activity.timeAgo}</div>
        </div>
    `
        )
        .join("");
}

function generateRecentActivities() {
    const activities = [];

    // Add recent study sessions
    const recentSessions = sessionHistory
        .slice(-10)
        .reverse()
        .map((session) => ({
            type: "study",
            icon: "📚",
            title: "Study Session Completed",
            description: `Studied ${session.cardsStudied} cards with ${session.accuracy}% accuracy`,
            timestamp: new Date(session.date).getTime(),
            timeAgo: getTimeAgo(new Date(session.date)),
        }));

    activities.push(...recentSessions);

    // Add achievement unlocks
    const achievements = checkAchievements();
    const recentAchievements = achievements
        .filter((achievement) => achievement.unlocked)
        .slice(-5)
        .map((achievement) => ({
            type: "achievement",
            icon: "🏆",
            title: "Achievement Unlocked",
            description: achievement.title,
            timestamp: Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000, // Random recent time
            timeAgo: "Recently",
        }));

    activities.push(...recentAchievements);

    // Add milestones
    if (overallStats.totalStudied >= 100) {
        activities.push({
            type: "milestone",
            icon: "🎯",
            title: "Milestone Reached",
            description: "Studied 100+ flashcards",
            timestamp: Date.now() - 24 * 60 * 60 * 1000,
            timeAgo: getTimeAgo(new Date(Date.now() - 24 * 60 * 60 * 1000)),
        });
    }

    // Sort by timestamp and return recent activities
    return activities.sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);
}

function getTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return `${Math.floor(diffInSeconds / 604800)}w ago`;
}

// Add export functionality
function exportStudyData() {
    const exportData = {
        userStats,
        sessionHistory,
        overallStats,
        exportDate: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(dataBlob);
    link.download = `cs-flashcards-data-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
}

// Add reset functionality
function resetProgress() {
    if (confirm("Are you sure you want to reset all progress? This action cannot be undone.")) {
        utils.storage.remove("userStats");
        utils.storage.remove("sessionHistory");
        utils.storage.remove("overallStats");

        location.reload();
    }
}

// Make functions available globally for button clicks
window.exportStudyData = exportStudyData;
window.resetProgress = resetProgress;

// Add periodic data backup
setInterval(() => {
    const backupData = {
        userStats: utils.storage.get("userStats", {}),
        sessionHistory: utils.storage.get("sessionHistory", []),
        overallStats: utils.storage.get("overallStats", {}),
        lastBackup: Date.now(),
    };

    utils.storage.set("dataBackup", backupData);
}, 5 * 60 * 1000); // Backup every 5 minutes
