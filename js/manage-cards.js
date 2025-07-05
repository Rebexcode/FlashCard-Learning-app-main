/**
 * Manage Cards Page JavaScript
 */

class ManageCardsPage {
    constructor() {
        this.currentEditingCard = null;
        this.currentView = "grid";
        this.filters = {
            category: "all",
            difficulty: "all",
            search: "",
        };

        this.init();
    }

    init() {
        this.initializeElements();
        this.bindEvents();
        this.loadCategories();
        this.loadCards();
        this.updateStats();
    }

    initializeElements() {
        // Modal elements
        this.cardModal = document.getElementById("cardModal");
        this.deleteModal = document.getElementById("deleteModal");
        this.importExportModal = document.getElementById("importExportModal");

        // Form elements
        this.cardForm = document.getElementById("cardForm");
        this.modalTitle = document.getElementById("modalTitle");

        // Filter elements
        this.categoryFilter = document.getElementById("categoryFilter");
        this.difficultyFilter = document.getElementById("difficultyFilter");
        this.searchInput = document.getElementById("searchInput");

        // Display elements
        this.cardsGrid = document.getElementById("cardsGrid");
        this.emptyState = document.getElementById("emptyState");
        this.totalUserCards = document.getElementById("totalUserCards");

        // Character counters
        this.questionCharCount = document.getElementById("questionCharCount");
        this.answerCharCount = document.getElementById("answerCharCount");

        // Buttons
        this.addCardBtn = document.getElementById("addCardBtn");
        this.importBtn = document.getElementById("importBtn");
        this.exportBtn = document.getElementById("exportBtn");
    }

    bindEvents() {
        // Add card button
        this.addCardBtn?.addEventListener("click", () => this.openAddCardModal());

        // Form submission
        this.cardForm?.addEventListener("submit", (e) => this.handleFormSubmit(e));

        // Modal close events
        document.getElementById("closeModal")?.addEventListener("click", () => this.closeModal());
        document.getElementById("cancelBtn")?.addEventListener("click", () => this.closeModal());

        // Delete modal events
        document.getElementById("closeDeleteModal")?.addEventListener("click", () => this.closeDeleteModal());
        document.getElementById("cancelDeleteBtn")?.addEventListener("click", () => this.closeDeleteModal());
        document.getElementById("confirmDeleteBtn")?.addEventListener("click", () => this.confirmDelete());

        // Filter events
        this.categoryFilter?.addEventListener("change", () => this.onFilterChange());
        this.difficultyFilter?.addEventListener("change", () => this.onFilterChange());
        this.searchInput?.addEventListener(
            "input",
            this.debounce(() => this.onFilterChange(), 300)
        );

        // View toggle
        document.querySelectorAll(".view-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => this.toggleView(e.target.dataset.view));
        });

        // Character counters
        document.getElementById("cardQuestion")?.addEventListener("input", (e) => {
            this.updateCharCount(e.target, this.questionCharCount, 500);
        });

        document.getElementById("cardAnswer")?.addEventListener("input", (e) => {
            this.updateCharCount(e.target, this.answerCharCount, 1000);
        });

        // Import/Export events
        this.importBtn?.addEventListener("click", () => this.openImportModal());
        this.exportBtn?.addEventListener("click", () => this.openExportModal());

        // Modal backdrop clicks
        this.cardModal?.addEventListener("click", (e) => {
            if (e.target === this.cardModal) this.closeModal();
        });

        this.deleteModal?.addEventListener("click", (e) => {
            if (e.target === this.deleteModal) this.closeDeleteModal();
        });

        // Keyboard shortcuts
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                this.closeModal();
                this.closeDeleteModal();
                this.closeImportExportModal();
            }

            if (e.ctrlKey || e.metaKey) {
                if (e.key === "n") {
                    e.preventDefault();
                    this.openAddCardModal();
                }
            }
        });
    }

    openAddCardModal() {
        this.currentEditingCard = null;
        this.modalTitle.textContent = "Add New Flashcard";
        this.loadCategories(); // Refresh categories in case new ones were created
        this.resetForm();
        this.showModal();
    }

    openEditCardModal(card) {
        this.currentEditingCard = card;
        this.modalTitle.textContent = "Edit Flashcard";
        this.loadCategories(); // Refresh categories in case new ones were created
        this.populateForm(card);
        this.showModal();
    }

    showModal() {
        this.cardModal.style.display = "flex";
        document.body.style.overflow = "hidden";

        // Focus first input
        setTimeout(() => {
            document.getElementById("cardCategory")?.focus();
        }, 100);
    }

    closeModal() {
        this.cardModal.style.display = "none";
        document.body.style.overflow = "";
        this.resetForm();
    }

    resetForm() {
        this.cardForm?.reset();
        this.updateCharCount(document.getElementById("cardQuestion"), this.questionCharCount, 500);
        this.updateCharCount(document.getElementById("cardAnswer"), this.answerCharCount, 1000);

        // Reset button state
        const saveBtn = document.getElementById("saveBtn");
        const btnText = saveBtn?.querySelector(".btn-text");
        const btnLoading = saveBtn?.querySelector(".btn-loading");

        if (btnText) btnText.style.display = "";
        if (btnLoading) btnLoading.style.display = "none";
        if (saveBtn) saveBtn.disabled = false;
    }

    populateForm(card) {
        document.getElementById("cardCategory").value = card.category;
        document.getElementById("cardDifficulty").value = card.difficulty;
        document.getElementById("cardQuestion").value = card.question;
        document.getElementById("cardAnswer").value = card.answer;
        document.getElementById("cardTopics").value = card.topics.join(", ");

        // Update character counts
        this.updateCharCount(document.getElementById("cardQuestion"), this.questionCharCount, 500);
        this.updateCharCount(document.getElementById("cardAnswer"), this.answerCharCount, 1000);
    }

    async handleFormSubmit(e) {
        e.preventDefault();

        const saveBtn = document.getElementById("saveBtn");
        const btnText = saveBtn?.querySelector(".btn-text");
        const btnLoading = saveBtn?.querySelector(".btn-loading");

        // Show loading state
        if (btnText) btnText.style.display = "none";
        if (btnLoading) btnLoading.style.display = "flex";
        if (saveBtn) saveBtn.disabled = true;

        try {
            const formData = new FormData(this.cardForm);
            const cardData = {
                category: formData.get("cardCategory") || document.getElementById("cardCategory").value,
                difficulty: formData.get("cardDifficulty") || document.getElementById("cardDifficulty").value,
                question: formData.get("cardQuestion") || document.getElementById("cardQuestion").value,
                answer: formData.get("cardAnswer") || document.getElementById("cardAnswer").value,
                topics: formData.get("cardTopics") || document.getElementById("cardTopics").value,
            };

            let result;
            if (this.currentEditingCard) {
                result = window.flashcardManager.updateCard(this.currentEditingCard.id, cardData);
            } else {
                result = window.flashcardManager.addCard(cardData);
            }

            if (result.success) {
                this.closeModal();
                this.loadCards();
                this.updateStats();
            } else {
                this.showToast(result.error || "Failed to save card", "error");
            }
        } catch (error) {
            console.error("Form submission error:", error);
            this.showToast("An error occurred while saving the card", "error");
        } finally {
            // Reset button state
            if (btnText) btnText.style.display = "";
            if (btnLoading) btnLoading.style.display = "none";
            if (saveBtn) saveBtn.disabled = false;
        }
    }

    updateCharCount(textarea, countElement, maxLength) {
        if (!textarea || !countElement) return;

        const currentLength = textarea.value.length;
        countElement.textContent = currentLength;

        // Update styling based on length
        const percentage = (currentLength / maxLength) * 100;

        countElement.parentElement.className = "char-count";
        if (percentage > 90) {
            countElement.parentElement.classList.add("error");
        } else if (percentage > 75) {
            countElement.parentElement.classList.add("warning");
        }
    }

    loadCategories() {
        if (!window.flashcardManager) {
            console.error("Flashcard manager not initialized");
            return;
        }

        const allCategories = window.flashcardManager.getAllCategories();

        // Update filter dropdown
        if (this.categoryFilter) {
            const filterOptions = ['<option value="all">All Categories</option>'];
            allCategories.forEach((category) => {
                const isCustom = category.userCreated ? " (Custom)" : "";
                filterOptions.push(`<option value="${category.key}">${category.name}${isCustom}</option>`);
            });
            this.categoryFilter.innerHTML = filterOptions.join("");
        }

        // Update form dropdown
        const cardCategorySelect = document.getElementById("cardCategory");
        if (cardCategorySelect) {
            const formOptions = ['<option value="">Select a category</option>'];
            allCategories.forEach((category) => {
                const isCustom = category.userCreated ? " (Custom)" : "";
                formOptions.push(`<option value="${category.key}">${category.name}${isCustom}</option>`);
            });
            cardCategorySelect.innerHTML = formOptions.join("");
        }
    }

    onFilterChange() {
        this.filters = {
            category: this.categoryFilter?.value || "all",
            difficulty: this.difficultyFilter?.value || "all",
            search: this.searchInput?.value || "",
        };

        this.loadCards();
    }

    loadCards() {
        if (!window.flashcardManager) {
            console.error("Flashcard manager not initialized");
            return;
        }

        const userCards = window.flashcardManager.filterCards({
            ...this.filters,
            userOnly: true,
        });

        this.displayCards(userCards);
    }

    displayCards(cards) {
        if (!this.cardsGrid) return;

        if (cards.length === 0) {
            this.cardsGrid.innerHTML = this.emptyState ? this.emptyState.outerHTML : this.getEmptyStateHTML();
            return;
        }

        const cardsHTML = cards.map((card) => this.createCardHTML(card)).join("");
        this.cardsGrid.innerHTML = cardsHTML;

        // Bind card events
        this.bindCardEvents();
    }

    createCardHTML(card) {
        const categoryName = this.getCategoryDisplayName(card.category);
        const topicsHTML = card.topics
            .slice(0, 3)
            .map((topic) => `<span class="topic-tag">${topic}</span>`)
            .join("");

        const moreTopics = card.topics.length > 3 ? `<span class="topic-tag">+${card.topics.length - 3}</span>` : "";

        return `
            <div class="user-card" data-card-id="${card.id}">
                <div class="card-header">
                    <div class="card-meta">
                        <span class="card-category">${categoryName}</span>
                        <span class="card-difficulty ${card.difficulty}">${card.difficulty}</span>
                    </div>
                    <div class="card-actions">
                        <button class="card-action-btn edit" onclick="manageCardsPage.openEditCardModal(window.flashcardManager.getCard(${card.id}))" title="Edit">
                            ✏️
                        </button>
                        <button class="card-action-btn delete" onclick="manageCardsPage.openDeleteModal(${card.id})" title="Delete">
                            🗑️
                        </button>
                    </div>
                </div>
                <div class="card-content">
                    <h3 class="card-question">${this.escapeHtml(card.question)}</h3>
                    <p class="card-answer">${this.escapeHtml(card.answer)}</p>
                </div>
                <div class="card-footer">
                    <div class="card-topics">
                        ${topicsHTML}${moreTopics}
                    </div>
                </div>
            </div>
        `;
    }

    bindCardEvents() {
        // Events are bound via onclick in the HTML for simplicity
        // This method can be used for additional event binding if needed
    }

    getCategoryDisplayName(category) {
        if (!window.flashcardManager) {
            const categoryMap = {
                algorithms: "Algorithms",
                "data-structures": "Data Structures",
                programming: "Programming",
                systems: "Systems",
                "web-development": "Web Development",
                "database-systems": "Database Systems",
                "security-crypto": "Security & Crypto",
            };
            return categoryMap[category] || category;
        }

        const allCategories = window.flashcardManager.getAllCategories();
        const categoryObj = allCategories.find((cat) => cat.key === category);
        return categoryObj ? categoryObj.name : category;
    }

    openDeleteModal(cardId) {
        const card = window.flashcardManager.getCard(cardId);
        if (!card) return;

        this.currentDeletingCard = card;

        // Update delete preview
        const deletePreview = document.getElementById("deletePreview");
        if (deletePreview) {
            deletePreview.innerHTML = `
                <div class="preview-question">${this.escapeHtml(card.question)}</div>
                <div class="preview-answer">${this.escapeHtml(card.answer)}</div>
            `;
        }

        this.deleteModal.style.display = "flex";
        document.body.style.overflow = "hidden";
    }

    closeDeleteModal() {
        this.deleteModal.style.display = "none";
        document.body.style.overflow = "";
        this.currentDeletingCard = null;
    }

    confirmDelete() {
        if (!this.currentDeletingCard) return;

        const result = window.flashcardManager.deleteCard(this.currentDeletingCard.id);

        if (result.success) {
            this.closeDeleteModal();
            this.loadCards();
            this.updateStats();
        } else {
            this.showToast(result.error || "Failed to delete card", "error");
        }
    }

    toggleView(view) {
        this.currentView = view;

        // Update button states
        document.querySelectorAll(".view-btn").forEach((btn) => {
            btn.classList.remove("active");
        });
        document.querySelector(`[data-view="${view}"]`)?.classList.add("active");

        // Update grid class
        if (view === "list") {
            this.cardsGrid?.classList.add("list-view");
        } else {
            this.cardsGrid?.classList.remove("list-view");
        }
    }

    updateStats() {
        const stats = window.flashcardManager.getStatistics();
        if (this.totalUserCards) {
            this.totalUserCards.textContent = stats.total;
        }
    }

    openImportModal() {
        const content = document.getElementById("importExportContent");
        const title = document.getElementById("importExportTitle");

        if (title) title.textContent = "Import Flashcards";

        if (content) {
            content.innerHTML = `
                <div class="file-drop-zone" id="dropZone">
                    <div style="font-size: 2rem; margin-bottom: 1rem;">📁</div>
                    <h3>Drop JSON file here or click to browse</h3>
                    <p>Upload a JSON file exported from this app</p>
                    <input type="file" id="fileInput" accept=".json" style="display: none;">
                    <button class="btn btn-primary" onclick="document.getElementById('fileInput').click()">
                        Choose File
                    </button>
                </div>
                <div id="importResults" style="margin-top: 2rem; display: none;">
                    <div class="form-actions">
                        <button class="btn btn-secondary" onclick="manageCardsPage.closeImportExportModal()">Close</button>
                    </div>
                </div>
            `;
        }

        this.importExportModal.style.display = "flex";
        document.body.style.overflow = "hidden";

        // Bind file input
        setTimeout(() => {
            this.bindImportEvents();
        }, 100);
    }

    openExportModal() {
        const content = document.getElementById("importExportContent");
        const title = document.getElementById("importExportTitle");

        if (title) title.textContent = "Export Flashcards";

        const userCards = window.flashcardManager.getUserCards();

        if (content) {
            content.innerHTML = `
                <div class="export-options">
                    <p>Export your ${userCards.length} flashcards to a JSON file that can be imported later or shared.</p>
                    
                    <div class="export-format">
                        <input type="radio" id="jsonFormat" name="exportFormat" value="json" checked>
                        <label for="jsonFormat">
                            <strong>JSON Format</strong><br>
                            <small>Compatible with this app for re-importing</small>
                        </label>
                    </div>
                    
                    <div class="form-actions">
                        <button class="btn btn-secondary" onclick="manageCardsPage.closeImportExportModal()">Cancel</button>
                        <button class="btn btn-primary" onclick="manageCardsPage.downloadExport()">
                            Download Export
                        </button>
                    </div>
                </div>
            `;
        }

        this.importExportModal.style.display = "flex";
        document.body.style.overflow = "hidden";
    }

    bindImportEvents() {
        const fileInput = document.getElementById("fileInput");
        const dropZone = document.getElementById("dropZone");

        if (fileInput) {
            fileInput.addEventListener("change", (e) => this.handleFileSelect(e));
        }

        if (dropZone) {
            dropZone.addEventListener("dragover", (e) => {
                e.preventDefault();
                dropZone.classList.add("dragover");
            });

            dropZone.addEventListener("dragleave", () => {
                dropZone.classList.remove("dragover");
            });

            dropZone.addEventListener("drop", (e) => {
                e.preventDefault();
                dropZone.classList.remove("dragover");
                this.handleFileDrop(e);
            });
        }
    }

    handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            this.processImportFile(file);
        }
    }

    handleFileDrop(e) {
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.processImportFile(files[0]);
        }
    }

    processImportFile(file) {
        if (!file.name.endsWith(".json")) {
            this.showToast("Please select a JSON file", "error");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const result = window.flashcardManager.importFromJSON(e.target.result);
                this.displayImportResults(result);
            } catch (error) {
                this.showToast("Failed to read file", "error");
            }
        };
        reader.readAsText(file);
    }

    displayImportResults(result) {
        const resultsDiv = document.getElementById("importResults");
        if (!resultsDiv) return;

        if (result.success) {
            resultsDiv.innerHTML = `
                <div style="text-align: center; color: var(--success-600);">
                    <div style="font-size: 3rem;">✅</div>
                    <h3>Import Successful!</h3>
                    <p>Imported ${result.imported} flashcards successfully.</p>
                    ${
                        result.errors && result.errors.length > 0
                            ? `<div style="margin-top: 1rem; padding: 1rem; background: var(--warning-50); border-radius: var(--radius-lg);">
                            <strong>Note:</strong> Some cards had issues and were skipped.
                        </div>`
                            : ""
                    }
                </div>
                <div class="form-actions">
                    <button class="btn btn-primary" onclick="manageCardsPage.closeImportExportModal(); manageCardsPage.loadCards(); manageCardsPage.updateStats();">
                        Close
                    </button>
                </div>
            `;
        } else {
            resultsDiv.innerHTML = `
                <div style="text-align: center; color: var(--danger-600);">
                    <div style="font-size: 3rem;">❌</div>
                    <h3>Import Failed</h3>
                    <p>${result.error}</p>
                </div>
                <div class="form-actions">
                    <button class="btn btn-secondary" onclick="manageCardsPage.closeImportExportModal()">Close</button>
                </div>
            `;
        }

        resultsDiv.style.display = "block";
    }

    downloadExport() {
        try {
            const exportData = window.flashcardManager.exportToJSON();
            const blob = new Blob([exportData], { type: "application/json" });
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `flashcards-export-${new Date().toISOString().split("T")[0]}.json`;
            a.style.display = "none"; // Hide the element

            document.body.appendChild(a);

            // Trigger download
            a.click();

            // Clean up after a short delay to ensure download started
            setTimeout(() => {
                try {
                    if (a.parentNode) {
                        document.body.removeChild(a);
                    }
                    URL.revokeObjectURL(url);
                } catch (cleanupError) {
                    console.warn("Cleanup error (safe to ignore):", cleanupError);
                }
            }, 100);

            this.closeImportExportModal();
            this.showToast("Export downloaded successfully!", "success");
        } catch (error) {
            console.error("Export error:", error);
            this.showToast("Failed to export cards", "error");
        }
    }

    closeImportExportModal() {
        this.importExportModal.style.display = "none";
        document.body.style.overflow = "";
    }

    showToast(message, type = "info") {
        // Try to use the global showToast function
        if (typeof window.showToast === "function") {
            window.showToast(message, type);
        } else if (typeof keyboardShortcuts !== "undefined" && keyboardShortcuts.showToast) {
            keyboardShortcuts.showToast(message);
        } else {
            // Fallback to console if no toast function is available
            console.log(`${type.toUpperCase()}: ${message}`);
            // Also try alert for important messages
            if (type === "error") {
                alert(`Error: ${message}`);
            }
        }
    }

    getEmptyStateHTML() {
        return `
            <div class="empty-state">
                <div class="empty-icon">📚</div>
                <h3>No flashcards yet</h3>
                <p>Start building your personal study collection by creating your first flashcard!</p>
                <button class="btn btn-primary" onclick="manageCardsPage.openAddCardModal()">
                    Create Your First Card
                </button>
            </div>
        `;
    }

    escapeHtml(text) {
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize the page when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    window.manageCardsPage = new ManageCardsPage();
});
