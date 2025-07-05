// Categories page JavaScript functionality

let allCategories = [];
let filteredCategories = [];
let flashcardManager = null;

document.addEventListener("DOMContentLoaded", () => {
    initializeFlashcardManager();
    initializeCategories();
    setupEventListeners();
    renderCategories();
});

function initializeFlashcardManager() {
    flashcardManager = new FlashcardManager();
}

function initializeCategories() {
    // Get all categories (default + user-created) and compute metadata
    const allCategoryData = flashcardManager.getAllCategories();
    const allCards = flashcardManager.getAllCards();

    allCategories = allCategoryData.map((category) => {
        const cards = allCards.filter((card) => card.category === category.key);

        return {
            id: category.key,
            key: category.key,
            name: category.name,
            icon: category.icon,
            description: category.description,
            difficulty: category.difficulty,
            cardCount: cards.length,
            topics: category.topics || [],
            cards: cards,
            userCreated: category.userCreated || false,
            categoryId: category.id || null,
        };
    });

    filteredCategories = [...allCategories];
}

function setupEventListeners() {
    const searchInput = document.getElementById("searchInput");
    const difficultyFilter = document.getElementById("difficultyFilter");
    const sortBy = document.getElementById("sortBy");
    const createCategoryBtn = document.getElementById("createCategoryBtn");

    if (searchInput) {
        searchInput.addEventListener("input", utils.debounce(handleSearch, 300));
    }

    if (difficultyFilter) {
        difficultyFilter.addEventListener("change", applyFilters);
    }

    if (sortBy) {
        sortBy.addEventListener("change", applySorting);
    }

    if (createCategoryBtn) {
        createCategoryBtn.addEventListener("click", showCreateCategoryModal);
    }
}

function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase().trim();

    if (searchTerm === "") {
        filteredCategories = [...allCategories];
    } else {
        filteredCategories = allCategories.filter((category) => {
            return (
                category.name.toLowerCase().includes(searchTerm) || category.description.toLowerCase().includes(searchTerm) || category.topics.some((topic) => topic.toLowerCase().includes(searchTerm))
            );
        });
    }

    applyFilters();
}

function applyFilters() {
    const difficultyFilter = document.getElementById("difficultyFilter");
    const difficultyValue = difficultyFilter?.value || "all";

    if (difficultyValue !== "all") {
        filteredCategories = filteredCategories.filter((category) => category.difficulty === difficultyValue);
    }

    applySorting();
}

function applySorting() {
    const sortBy = document.getElementById("sortBy");
    const sortValue = sortBy?.value || "name";

    switch (sortValue) {
        case "name":
            filteredCategories.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case "cards":
            filteredCategories.sort((a, b) => b.cardCount - a.cardCount);
            break;
        case "difficulty":
            const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
            filteredCategories.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);
            break;
    }

    renderCategories();
}

function renderCategories() {
    const categoriesGrid = document.getElementById("categoriesGrid");
    if (!categoriesGrid) return;

    if (filteredCategories.length === 0) {
        categoriesGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🔍</div>
                <h3>No categories found</h3>
                <p>Try adjusting your search or filter criteria</p>
                <button class="btn btn-primary" onclick="clearFilters()">Clear Filters</button>
            </div>
        `;
        return;
    }

    categoriesGrid.innerHTML = filteredCategories
        .map(
            (category) => `
        <div class="category-card" data-category="${category.id}">
            <div class="category-header">
                <div class="category-icon">${category.icon}</div>
                <div class="category-info">
                    <h3>${category.name}</h3>
                    <span class="category-difficulty ${category.difficulty}">${category.difficulty}</span>
                    ${category.userCreated ? '<span class="user-created-badge">Custom</span>' : ""}
                </div>
                ${
                    category.userCreated
                        ? `
                <div class="category-actions">
                    <button class="action-btn edit-btn" onclick="editCategory(${category.categoryId})" title="Edit Category">
                        ✏️
                    </button>
                    <button class="action-btn delete-btn" onclick="deleteCategory(${category.categoryId})" title="Delete Category">
                        🗑️
                    </button>
                </div>
                `
                        : ""
                }
            </div>
            <p class="category-description">${category.description}</p>
            <div class="topics-list">
                <h4>Key Topics:</h4>
                <div class="topic-tags">
                    ${category.topics
                        .slice(0, 4)
                        .map((topic) => `<span class="topic-tag">${topic.replace("-", " ")}</span>`)
                        .join("")}
                    ${category.topics.length > 4 ? `<span class="topic-tag">+${category.topics.length - 4} more</span>` : ""}
                </div>
            </div>
            <div class="category-stats">
                <span class="card-count">${category.cardCount} cards</span>
                <a href="study.html?category=${category.id}" class="study-btn">Start Studying</a>
            </div>
        </div>
    `
        )
        .join("");

    // Add click handlers for category cards
    setupCategoryCardHandlers();

    // Add animation
    animateCategoryCards();
}

function setupCategoryCardHandlers() {
    const categoryCards = document.querySelectorAll(".category-card");

    categoryCards.forEach((card) => {
        // Click handler for the entire card (except buttons)
        card.addEventListener("click", function (e) {
            if (!e.target.closest(".study-btn")) {
                const category = this.dataset.category;
                showCategoryDetails(category);
            }
        });

        // Hover effects
        card.addEventListener("mouseenter", function () {
            this.style.transform = "translateY(-8px)";
        });

        card.addEventListener("mouseleave", function () {
            this.style.transform = "translateY(0)";
        });
    });
}

function showCategoryDetails(categoryId) {
    const category = allCategories.find((cat) => cat.id === categoryId);
    if (!category) return;

    // Create a modal or detailed view
    const modal = document.createElement("div");
    modal.className = "modal active";
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${category.icon} ${category.name}</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <p><strong>Description:</strong> ${category.description}</p>
                <p><strong>Difficulty:</strong> <span class="category-difficulty ${category.difficulty}">${category.difficulty}</span></p>
                <p><strong>Total Cards:</strong> ${category.cardCount}</p>
                
                <h4>Topics Covered:</h4>
                <div class="topic-tags">
                    ${category.topics.map((topic) => `<span class="topic-tag">${topic.replace("-", " ")}</span>`).join("")}
                </div>

                <h4>Sample Questions:</h4>
                <ul>
                    ${category.cards
                        .slice(0, 3)
                        .map((card) => `<li>${card.question}</li>`)
                        .join("")}
                </ul>

                <div style="margin-top: 2rem; text-align: center;">
                    <a href="study.html?category=${category.id}" class="btn btn-primary">Start Studying This Category</a>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Close modal handlers
    const closeBtn = modal.querySelector(".modal-close");
    closeBtn.addEventListener("click", () => {
        document.body.removeChild(modal);
    });

    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

function animateCategoryCards() {
    const cards = document.querySelectorAll(".category-card");

    cards.forEach((card, index) => {
        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";

        setTimeout(() => {
            card.style.transition = "all 0.5s ease";
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
        }, index * 100);
    });
}

function clearFilters() {
    const searchInput = document.getElementById("searchInput");
    const difficultyFilter = document.getElementById("difficultyFilter");
    const sortBy = document.getElementById("sortBy");

    if (searchInput) searchInput.value = "";
    if (difficultyFilter) difficultyFilter.value = "all";
    if (sortBy) sortBy.value = "name";

    filteredCategories = [...allCategories];
    renderCategories();
}

// Add category statistics
function getCategoryStats() {
    const userStats = utils.storage.get("userStats", {});

    return allCategories.map((category) => {
        const categoryCards = category.cards;
        const studiedCards = categoryCards.filter((card) => userStats[card.id]);
        const progress = categoryCards.length > 0 ? (studiedCards.length / categoryCards.length) * 100 : 0;

        return {
            ...category,
            studiedCount: studiedCards.length,
            progress: Math.round(progress),
        };
    });
}

// Update category cards with progress information
function renderCategoriesWithProgress() {
    const categoriesWithStats = getCategoryStats();
    const categoriesGrid = document.getElementById("categoriesGrid");
    if (!categoriesGrid) return;

    categoriesGrid.innerHTML = categoriesWithStats
        .map(
            (category) => `
        <div class="category-card" data-category="${category.id}">
            <div class="category-header">
                <div class="category-icon">${category.icon}</div>
                <div class="category-info">
                    <h3>${category.name}</h3>
                    <span class="category-difficulty ${category.difficulty}">${category.difficulty}</span>
                </div>
            </div>
            <p class="category-description">${category.description}</p>
            
            ${
                category.progress > 0
                    ? `
                <div class="progress-section">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${category.progress}%"></div>
                    </div>
                    <span class="progress-text">${category.progress}% Complete (${category.studiedCount}/${category.cardCount})</span>
                </div>
            `
                    : ""
            }
            
            <div class="topics-list">
                <h4>Key Topics:</h4>
                <div class="topic-tags">
                    ${category.topics
                        .slice(0, 4)
                        .map((topic) => `<span class="topic-tag">${topic.replace("-", " ")}</span>`)
                        .join("")}
                    ${category.topics.length > 4 ? `<span class="topic-tag">+${category.topics.length - 4} more</span>` : ""}
                </div>
            </div>
            <div class="category-stats">
                <span class="card-count">${category.cardCount} cards</span>
                <a href="study.html?category=${category.id}" class="study-btn">
                    ${category.progress > 0 ? "Continue" : "Start"} Studying
                </a>
            </div>
        </div>
    `
        )
        .join("");

    setupCategoryCardHandlers();
    animateCategoryCards();
}

// Initialize with progress if user has study history
document.addEventListener("DOMContentLoaded", () => {
    const userStats = utils.storage.get("userStats", {});
    if (Object.keys(userStats).length > 0) {
        // User has study history, show progress
        setTimeout(() => {
            renderCategoriesWithProgress();
        }, 500);
    }
});

// Category Creation and Management Functions

function showCreateCategoryModal() {
    const modal = createCategoryModal();
    document.body.appendChild(modal);
    setupCategoryModalHandlers(modal);
}

function editCategory(categoryId) {
    const category = flashcardManager.getUserCategories().find((cat) => cat.id === categoryId);
    if (!category) return;

    const modal = createCategoryModal(category);
    document.body.appendChild(modal);
    setupCategoryModalHandlers(modal, category);
}

function deleteCategory(categoryId) {
    const category = flashcardManager.getUserCategories().find((cat) => cat.id === categoryId);
    if (!category) return;

    const cardsUsingCategory = flashcardManager.getCardsByCategory(category.key);

    let confirmMessage = `Are you sure you want to delete the "${category.name}" category?`;
    if (cardsUsingCategory.length > 0) {
        confirmMessage += `\n\nThis will affect ${cardsUsingCategory.length} card(s) that use this category. You should reassign these cards to other categories first.`;
    }

    if (confirm(confirmMessage)) {
        const result = flashcardManager.deleteCategory(categoryId);
        if (result.success) {
            // Refresh the categories display
            initializeCategories();
            renderCategories();
        } else {
            alert(result.error);
        }
    }
}

function createCategoryModal(existingCategory = null) {
    const isEditing = existingCategory !== null;
    const modalTitle = isEditing ? "Edit Category" : "Create New Category";
    const submitText = isEditing ? "Update Category" : "Create Category";

    const modal = document.createElement("div");
    modal.className = "modal active";
    modal.innerHTML = `
        <div class="modal-content category-modal">
            <div class="modal-header">
                <h3>${modalTitle}</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <form id="categoryForm" class="category-form">
                    <div class="form-group">
                        <label for="categoryName">Category Name *</label>
                        <input 
                            type="text" 
                            id="categoryName" 
                            name="name" 
                            required 
                            maxlength="50"
                            value="${existingCategory ? existingCategory.name : ""}"
                            placeholder="e.g., Machine Learning"
                        >
                        <small class="form-help">2-50 characters</small>
                    </div>

                    <div class="form-group">
                        <label for="categoryIcon">Icon</label>
                        <div class="icon-input-container">
                            <input 
                                type="text" 
                                id="categoryIcon" 
                                name="icon" 
                                maxlength="4"
                                value="${existingCategory ? existingCategory.icon : "📁"}"
                                placeholder="📁"
                            >
                            <div class="icon-suggestions">
                                <span class="icon-option" onclick="selectIcon('🧠')">🧠</span>
                                <span class="icon-option" onclick="selectIcon('💻')">💻</span>
                                <span class="icon-option" onclick="selectIcon('⚡')">⚡</span>
                                <span class="icon-option" onclick="selectIcon('🔧')">🔧</span>
                                <span class="icon-option" onclick="selectIcon('📊')">📊</span>
                                <span class="icon-option" onclick="selectIcon('🎯')">🎯</span>
                                <span class="icon-option" onclick="selectIcon('🚀')">🚀</span>
                                <span class="icon-option" onclick="selectIcon('🔬')">🔬</span>
                            </div>
                        </div>
                        <small class="form-help">Choose an emoji icon for your category</small>
                    </div>

                    <div class="form-group">
                        <label for="categoryDescription">Description *</label>
                        <textarea 
                            id="categoryDescription" 
                            name="description" 
                            required 
                            maxlength="200"
                            rows="3"
                            placeholder="Describe what this category covers..."
                        >${existingCategory ? existingCategory.description : ""}</textarea>
                        <small class="form-help">10-200 characters</small>
                    </div>

                    <div class="form-group">
                        <label for="categoryDifficulty">Difficulty Level</label>
                        <select id="categoryDifficulty" name="difficulty">
                            <option value="easy" ${existingCategory && existingCategory.difficulty === "easy" ? "selected" : ""}>Easy</option>
                            <option value="medium" ${!existingCategory || existingCategory.difficulty === "medium" ? "selected" : ""}>Medium</option>
                            <option value="hard" ${existingCategory && existingCategory.difficulty === "hard" ? "selected" : ""}>Hard</option>
                        </select>
                        <small class="form-help">How challenging is this topic area?</small>
                    </div>

                    <div class="form-group">
                        <label for="categoryTopics">Topics (optional)</label>
                        <input 
                            type="text" 
                            id="categoryTopics" 
                            name="topics" 
                            value="${existingCategory ? existingCategory.topics.join(", ") : ""}"
                            placeholder="neural-networks, deep-learning, tensorflow"
                        >
                        <small class="form-help">Comma-separated list of key topics</small>
                    </div>

                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" id="cancelCategoryBtn">Cancel</button>
                        <button type="submit" class="btn btn-primary" id="submitCategoryBtn">${submitText}</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    return modal;
}

function setupCategoryModalHandlers(modal, existingCategory = null) {
    const form = modal.querySelector("#categoryForm");
    const closeBtn = modal.querySelector(".modal-close");
    const cancelBtn = modal.querySelector("#cancelCategoryBtn");

    // Close modal handlers
    const closeModal = () => {
        if (modal.parentNode) {
            document.body.removeChild(modal);
        }
    };

    closeBtn.addEventListener("click", closeModal);
    cancelBtn.addEventListener("click", closeModal);

    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Form submission
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const categoryData = {
            name: formData.get("name"),
            icon: formData.get("icon") || "📁",
            description: formData.get("description"),
            difficulty: formData.get("difficulty"),
            topics: formData.get("topics"),
        };

        let result;
        if (existingCategory) {
            result = flashcardManager.updateCategory(existingCategory.id, categoryData);
        } else {
            result = flashcardManager.addCategory(categoryData);
        }

        if (result.success) {
            closeModal();
            // Refresh the categories display
            initializeCategories();
            renderCategories();
        } else {
            alert(result.error);
        }
    });

    // Focus the name input
    setTimeout(() => {
        modal.querySelector("#categoryName").focus();
    }, 100);
}

function selectIcon(icon) {
    document.getElementById("categoryIcon").value = icon;
}
