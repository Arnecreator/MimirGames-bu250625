
// Question Manager for Session-based Deduplication
class QuestionManager {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.usedQuestionIds = new Set();
    this.loadUsedQuestions();
  }

  generateSessionId() {
    return 'quiz-session-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }

  loadUsedQuestions() {
    try {
      const stored = sessionStorage.getItem('usedQuestionIds');
      if (stored) {
        const ids = JSON.parse(stored);
        this.usedQuestionIds = new Set(ids);
      }
    } catch (error) {
      console.warn('Could not load used questions from session storage:', error);
      this.usedQuestionIds = new Set();
    }
  }

  saveUsedQuestions() {
    try {
      const ids = Array.from(this.usedQuestionIds);
      sessionStorage.setItem('usedQuestionIds', JSON.stringify(ids));
    } catch (error) {
      console.warn('Could not save used questions to session storage:', error);
    }
  }

  async getRandomQuestions(count = 8) {
    try {
      const excludeIds = Array.from(this.usedQuestionIds);
      const excludeParam = excludeIds.length > 0 ? `&exclude=${excludeIds.join(',')}` : '';
      
      const response = await fetch(`/api/questions/random/${count}?sessionId=${this.sessionId}${excludeParam}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Mark these questions as used
      data.questions.forEach(q => {
        this.usedQuestionIds.add(q._id);
      });
      
      this.saveUsedQuestions();
      
      return {
        questions: data.questions,
        categoryDistribution: data.categoryDistribution,
        sessionInfo: {
          sessionId: this.sessionId,
          totalUsed: this.usedQuestionIds.size,
          excludedThisRequest: excludeIds.length
        }
      };
      
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }
  }

  resetSession() {
    this.usedQuestionIds.clear();
    this.sessionId = this.generateSessionId();
    try {
      sessionStorage.removeItem('usedQuestionIds');
    } catch (error) {
      console.warn('Could not clear session storage:', error);
    }
  }

  getSessionStats() {
    return {
      sessionId: this.sessionId,
      questionsUsed: this.usedQuestionIds.size,
      usedIds: Array.from(this.usedQuestionIds)
    };
  }

  // Check if we're running low on questions (optional feature)
  async checkAvailableQuestions() {
    try {
      const response = await fetch('/api/questions/distribution');
      const data = await response.json();
      
      const usedCount = this.usedQuestionIds.size;
      const totalAvailable = data.totalQuestions;
      const remainingQuestions = totalAvailable - usedCount;
      
      return {
        total: totalAvailable,
        used: usedCount,
        remaining: remainingQuestions,
        percentageUsed: Math.round((usedCount / totalAvailable) * 100),
        shouldReset: remainingQuestions < 10 // Suggest reset when <10 questions left
      };
      
    } catch (error) {
      console.error('Error checking available questions:', error);
      return null;
    }
  }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = QuestionManager;
} else {
  window.QuestionManager = QuestionManager;
}
