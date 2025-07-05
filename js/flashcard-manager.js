/**
 * Flashcard Manager - Handles all flashcard data operations
 */

class FlashcardManager {
    constructor() {
        this.storageKey = "userFlashcards";
        this.categoriesStorageKey = "userCategories";
        this.maxId = this.getMaxId();
        this.maxCategoryId = this.getMaxCategoryId();
        this.init();
    }

    init() {
        // Ensure we have valid arrays in localStorage
        if (!this.getUserCards()) {
            this.saveUserCards([]);
        }

        if (!this.getUserCategories()) {
            this.saveUserCategories([]);
        }

        // Load default cards if needed
        this.loadDefaultCards();
    }

    /**
     * Get user-created flashcards from localStorage
     */
    getUserCards() {
        try {
            const cards = localStorage.getItem(this.storageKey);
            return cards ? JSON.parse(cards) : [];
        } catch (error) {
            console.error("Error loading user cards:", error);
            return [];
        }
    }

    /**
     * Save user-created flashcards to localStorage
     */
    saveUserCards(cards) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(cards));
            return true;
        } catch (error) {
            console.error("Error saving user cards:", error);
            this.showToast("Failed to save cards. Storage may be full.", "error");
            return false;
        }
    }

    /**
     * Get user-created categories from localStorage
     */
    getUserCategories() {
        try {
            const categories = localStorage.getItem(this.categoriesStorageKey);
            return categories ? JSON.parse(categories) : [];
        } catch (error) {
            console.error("Error loading user categories:", error);
            return [];
        }
    }

    /**
     * Save user-created categories to localStorage
     */
    saveUserCategories(categories) {
        try {
            localStorage.setItem(this.categoriesStorageKey, JSON.stringify(categories));
            return true;
        } catch (error) {
            console.error("Error saving user categories:", error);
            this.showToast("Failed to save categories. Storage may be full.", "error");
            return false;
        }
    }

    /**
     * Get the highest ID from existing cards
     */
    getMaxId() {
        const userCards = this.getUserCards();
        const defaultCards = window.flashcardsData || [];

        let maxId = 0;

        [...userCards, ...defaultCards].forEach((card) => {
            if (card.id > maxId) {
                maxId = card.id;
            }
        });

        return maxId;
    }

    /**
     * Get the highest category ID from existing categories
     */
    getMaxCategoryId() {
        const userCategories = this.getUserCategories();
        let maxId = 0;

        userCategories.forEach((category) => {
            if (category.id > maxId) {
                maxId = category.id;
            }
        });

        return maxId;
    }

    /**
     * Generate a new unique ID
     */
    generateId() {
        return ++this.maxId;
    }

    /**
     * Generate a new unique category ID
     */
    generateCategoryId() {
        return ++this.maxCategoryId;
    }

    /**
     * Add a new flashcard
     */
    addCard(cardData) {
        try {
            const newCard = {
                id: this.generateId(),
                category: cardData.category,
                difficulty: cardData.difficulty,
                question: cardData.question.trim(),
                answer: cardData.answer.trim(),
                topics: this.parseTopics(cardData.topics),
                created: new Date().toISOString(),
                modified: new Date().toISOString(),
                userCreated: true,
            };

            // Validation
            if (!this.validateCard(newCard)) {
                return { success: false, error: "Invalid card data" };
            }

            const userCards = this.getUserCards();
            userCards.push(newCard);

            if (this.saveUserCards(userCards)) {
                this.showToast("Flashcard created successfully!", "success");
                return { success: true, card: newCard };
            } else {
                return { success: false, error: "Failed to save card" };
            }
        } catch (error) {
            console.error("Error adding card:", error);
            return { success: false, error: "Failed to create card" };
        }
    }

    /**
     * Update an existing flashcard
     */
    updateCard(cardId, cardData) {
        try {
            const userCards = this.getUserCards();
            const cardIndex = userCards.findIndex((card) => card.id === cardId);

            if (cardIndex === -1) {
                return { success: false, error: "Card not found" };
            }

            const updatedCard = {
                ...userCards[cardIndex],
                category: cardData.category,
                difficulty: cardData.difficulty,
                question: cardData.question.trim(),
                answer: cardData.answer.trim(),
                topics: this.parseTopics(cardData.topics),
                modified: new Date().toISOString(),
            };

            // Validation
            if (!this.validateCard(updatedCard)) {
                return { success: false, error: "Invalid card data" };
            }

            userCards[cardIndex] = updatedCard;

            if (this.saveUserCards(userCards)) {
                this.showToast("Flashcard updated successfully!", "success");
                return { success: true, card: updatedCard };
            } else {
                return { success: false, error: "Failed to save changes" };
            }
        } catch (error) {
            console.error("Error updating card:", error);
            return { success: false, error: "Failed to update card" };
        }
    }

    /**
     * Delete a flashcard
     */
    deleteCard(cardId) {
        try {
            const userCards = this.getUserCards();
            const cardIndex = userCards.findIndex((card) => card.id === cardId);

            if (cardIndex === -1) {
                return { success: false, error: "Card not found" };
            }

            userCards.splice(cardIndex, 1);

            if (this.saveUserCards(userCards)) {
                this.showToast("Flashcard deleted successfully!", "success");
                return { success: true };
            } else {
                return { success: false, error: "Failed to delete card" };
            }
        } catch (error) {
            console.error("Error deleting card:", error);
            return { success: false, error: "Failed to delete card" };
        }
    }

    /**
     * Get a specific card by ID
     */
    getCard(cardId) {
        const userCards = this.getUserCards();
        return userCards.find((card) => card.id === cardId) || null;
    }

    /**
     * Get all flashcards (user + default)
     */
    getAllCards() {
        const userCards = this.getUserCards();
        const defaultCards = window.flashcardsData || [];
        return [...userCards, ...defaultCards];
    }

    /**
     * Filter cards by criteria
     */
    filterCards(filters) {
        let cards = this.getAllCards();

        if (filters.category && filters.category !== "all") {
            cards = cards.filter((card) => card.category === filters.category);
        }

        if (filters.difficulty && filters.difficulty !== "all") {
            cards = cards.filter((card) => card.difficulty === filters.difficulty);
        }

        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            cards = cards.filter(
                (card) => card.question.toLowerCase().includes(searchTerm) || card.answer.toLowerCase().includes(searchTerm) || card.topics.some((topic) => topic.toLowerCase().includes(searchTerm))
            );
        }

        if (filters.userOnly) {
            cards = cards.filter((card) => card.userCreated);
        }

        return cards;
    }

    /**
     * Get cards by category
     */
    getCardsByCategory(category) {
        return this.getAllCards().filter((card) => card.category === category);
    }

    /**
     * Get random cards for study
     */
    getRandomCards(count = 10, filters = {}) {
        const cards = this.filterCards(filters);
        const shuffled = [...cards].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
    }

    /**
     * Parse topics string into array
     */
    parseTopics(topicsString) {
        if (!topicsString || typeof topicsString !== "string") {
            return [];
        }

        return topicsString
            .split(",")
            .map((topic) => topic.trim().toLowerCase())
            .filter((topic) => topic.length > 0);
    }

    /**
     * Validate card data
     */
    validateCard(card) {
        if (!card.question || card.question.length < 5) {
            this.showToast("Question must be at least 5 characters long", "error");
            return false;
        }

        if (!card.answer || card.answer.length < 5) {
            this.showToast("Answer must be at least 5 characters long", "error");
            return false;
        }

        if (!card.category) {
            this.showToast("Please select a category", "error");
            return false;
        }

        if (!card.difficulty) {
            this.showToast("Please select a difficulty level", "error");
            return false;
        }

        if (card.question.length > 500) {
            this.showToast("Question is too long (max 500 characters)", "error");
            return false;
        }

        if (card.answer.length > 1000) {
            this.showToast("Answer is too long (max 1000 characters)", "error");
            return false;
        }

        return true;
    }

    /**
     * Export user cards to JSON
     */
    exportToJSON() {
        const userCards = this.getUserCards();
        const exportData = {
            cards: userCards,
            exportDate: new Date().toISOString(),
            version: "1.0",
        };

        return JSON.stringify(exportData, null, 2);
    }

    /**
     * Import cards from JSON
     */
    importFromJSON(jsonString) {
        try {
            const importData = JSON.parse(jsonString);

            if (!importData.cards || !Array.isArray(importData.cards)) {
                return { success: false, error: "Invalid file format" };
            }

            const validCards = [];
            const errors = [];

            importData.cards.forEach((card, index) => {
                // Assign new IDs to prevent conflicts
                const newCard = {
                    ...card,
                    id: this.generateId(),
                    userCreated: true,
                    created: new Date().toISOString(),
                    modified: new Date().toISOString(),
                };

                if (this.validateCard(newCard)) {
                    validCards.push(newCard);
                } else {
                    errors.push(`Card ${index + 1}: Invalid data`);
                }
            });

            if (validCards.length === 0) {
                return { success: false, error: "No valid cards found in file" };
            }

            const userCards = this.getUserCards();
            const updatedCards = [...userCards, ...validCards];

            if (this.saveUserCards(updatedCards)) {
                this.showToast(`Imported ${validCards.length} cards successfully!`, "success");
                if (errors.length > 0) {
                    console.warn("Import errors:", errors);
                }
                return { success: true, imported: validCards.length, errors };
            } else {
                return { success: false, error: "Failed to save imported cards" };
            }
        } catch (error) {
            console.error("Import error:", error);
            return { success: false, error: "Invalid JSON file" };
        }
    }

    /**
     * Clear all user cards
     */
    clearUserCards() {
        try {
            this.saveUserCards([]);
            this.maxId = this.getMaxId();
            this.showToast("All user cards cleared", "success");
            return true;
        } catch (error) {
            console.error("Error clearing cards:", error);
            this.showToast("Failed to clear cards", "error");
            return false;
        }
    }

    /**
     * Get statistics about user cards
     */
    getStatistics() {
        const userCards = this.getUserCards();
        const stats = {
            total: userCards.length,
            byCategory: {},
            byDifficulty: { easy: 0, medium: 0, hard: 0 },
        };

        userCards.forEach((card) => {
            // Category stats
            if (!stats.byCategory[card.category]) {
                stats.byCategory[card.category] = 0;
            }
            stats.byCategory[card.category]++;

            // Difficulty stats
            if (stats.byDifficulty[card.difficulty] !== undefined) {
                stats.byDifficulty[card.difficulty]++;
            }
        });

        return stats;
    }

    /**
     * Load default flashcards data
     */
    loadDefaultCards() {
        // This ensures window.flashcardsData is available
        if (typeof window.flashcardsData === "undefined") {
            // Fallback in case the data file isn't loaded
            window.flashcardsData = [];
        }
    }

    /**
     * Show toast notification
     */
    showToast(message, type = "info") {
        // Use the toast system from main.js if available
        if (window.showToast) {
            window.showToast(message, type);
        } else {
            // Fallback to console
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }

    /**
     * Add a new category
     */
    addCategory(categoryData) {
        try {
            // Generate a unique key from the name
            const categoryKey = categoryData.name
                .toLowerCase()
                .replace(/[^a-z0-9]/g, "-")
                .replace(/-+/g, "-")
                .replace(/^-|-$/g, "");

            // Check if category key already exists
            if (this.categoryExists(categoryKey)) {
                return { success: false, error: "A category with this name already exists" };
            }

            const newCategory = {
                id: this.generateCategoryId(),
                key: categoryKey,
                name: categoryData.name.trim(),
                icon: categoryData.icon || "📁",
                description: categoryData.description.trim(),
                difficulty: categoryData.difficulty || "medium",
                topics: this.parseTopics(categoryData.topics || ""),
                created: new Date().toISOString(),
                modified: new Date().toISOString(),
                userCreated: true,
            };

            // Validation
            if (!this.validateCategory(newCategory)) {
                return { success: false, error: "Invalid category data" };
            }

            const userCategories = this.getUserCategories();
            userCategories.push(newCategory);

            if (this.saveUserCategories(userCategories)) {
                this.showToast("Category created successfully!", "success");
                return { success: true, category: newCategory };
            } else {
                return { success: false, error: "Failed to save category" };
            }
        } catch (error) {
            console.error("Error adding category:", error);
            return { success: false, error: "Failed to create category" };
        }
    }

    /**
     * Update an existing category
     */
    updateCategory(categoryId, categoryData) {
        try {
            const userCategories = this.getUserCategories();
            const categoryIndex = userCategories.findIndex((cat) => cat.id === categoryId);

            if (categoryIndex === -1) {
                return { success: false, error: "Category not found" };
            }

            const oldCategory = userCategories[categoryIndex];
            const newCategoryKey = categoryData.name
                .toLowerCase()
                .replace(/[^a-z0-9]/g, "-")
                .replace(/-+/g, "-")
                .replace(/^-|-$/g, "");

            // Check if new category key conflicts with existing ones (excluding current)
            if (newCategoryKey !== oldCategory.key && this.categoryExists(newCategoryKey)) {
                return { success: false, error: "A category with this name already exists" };
            }

            const updatedCategory = {
                ...oldCategory,
                key: newCategoryKey,
                name: categoryData.name.trim(),
                icon: categoryData.icon || "📁",
                description: categoryData.description.trim(),
                difficulty: categoryData.difficulty || "medium",
                topics: this.parseTopics(categoryData.topics || ""),
                modified: new Date().toISOString(),
            };

            // Validation
            if (!this.validateCategory(updatedCategory)) {
                return { success: false, error: "Invalid category data" };
            }

            userCategories[categoryIndex] = updatedCategory;

            // Update cards that use this category
            if (oldCategory.key !== newCategoryKey) {
                this.updateCardsCategoryKey(oldCategory.key, newCategoryKey);
            }

            if (this.saveUserCategories(userCategories)) {
                this.showToast("Category updated successfully!", "success");
                return { success: true, category: updatedCategory };
            } else {
                return { success: false, error: "Failed to save changes" };
            }
        } catch (error) {
            console.error("Error updating category:", error);
            return { success: false, error: "Failed to update category" };
        }
    }

    /**
     * Delete a category
     */
    deleteCategory(categoryId) {
        try {
            const userCategories = this.getUserCategories();
            const categoryIndex = userCategories.findIndex((cat) => cat.id === categoryId);

            if (categoryIndex === -1) {
                return { success: false, error: "Category not found" };
            }

            const category = userCategories[categoryIndex];

            // Check if any cards use this category
            const cardsWithCategory = this.getCardsByCategory(category.key);
            if (cardsWithCategory.length > 0) {
                return {
                    success: false,
                    error: `Cannot delete category. ${cardsWithCategory.length} card(s) are using this category.`,
                };
            }

            userCategories.splice(categoryIndex, 1);

            if (this.saveUserCategories(userCategories)) {
                this.showToast("Category deleted successfully!", "success");
                return { success: true };
            } else {
                return { success: false, error: "Failed to delete category" };
            }
        } catch (error) {
            console.error("Error deleting category:", error);
            return { success: false, error: "Failed to delete category" };
        }
    }

    /**
     * Get all categories (user + default)
     */
    getAllCategories() {
        const userCategories = this.getUserCategories();
        const defaultCategories = Object.keys(window.categoryData || {}).map((key) => ({
            key,
            ...window.categoryData[key],
            userCreated: false,
        }));

        return [...defaultCategories, ...userCategories];
    }

    /**
     * Check if a category key exists
     */
    categoryExists(categoryKey) {
        // Check default categories
        if (window.categoryData && window.categoryData[categoryKey]) {
            return true;
        }

        // Check user categories
        const userCategories = this.getUserCategories();
        return userCategories.some((cat) => cat.key === categoryKey);
    }

    /**
     * Update cards that use an old category key
     */
    updateCardsCategoryKey(oldKey, newKey) {
        const userCards = this.getUserCards();
        let updated = false;

        userCards.forEach((card) => {
            if (card.category === oldKey) {
                card.category = newKey;
                card.modified = new Date().toISOString();
                updated = true;
            }
        });

        if (updated) {
            this.saveUserCards(userCards);
        }
    }

    /**
     * Validate category data
     */
    validateCategory(category) {
        if (!category.name || category.name.length < 2 || category.name.length > 50) {
            this.showToast("Category name must be between 2 and 50 characters", "error");
            return false;
        }

        if (!category.description || category.description.length < 10 || category.description.length > 200) {
            this.showToast("Category description must be between 10 and 200 characters", "error");
            return false;
        }

        if (!["easy", "medium", "hard"].includes(category.difficulty)) {
            this.showToast("Category difficulty must be easy, medium, or hard", "error");
            return false;
        }

        return true;
    }
}

// Initialize the flashcard manager
window.flashcardManager = new FlashcardManager();

// Export for module systems
if (typeof module !== "undefined" && module.exports) {
    module.exports = FlashcardManager;
}
