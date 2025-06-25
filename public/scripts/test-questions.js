// Test Questions JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Check Question Coverage
    const checkCoverageBtn = document.getElementById('checkCoverageBtn');
    if (checkCoverageBtn) {
        checkCoverageBtn.addEventListener('click', async function() {
            try {
                console.log('🔍 Checking question coverage...');
                const response = await fetch('/api/questions/verify');
                const data = await response.json();

                console.log('📊 Question Coverage Response:', data);

                // Show in alert as well
                alert(`Question Coverage:\nTotal: ${data.totalQuestions || 'N/A'}\nCheck console for detailed breakdown`);

            } catch (error) {
                console.error('❌ Error checking coverage:', error);
                alert('Error checking coverage. Check console for details.');
            }
        });
    }

    // Get 8 Random Questions
    const get8QuestionsBtn = document.getElementById('get8QuestionsBtn');
    if (get8QuestionsBtn) {
        get8QuestionsBtn.addEventListener('click', async function() {
            try {
                console.log('🎲 Fetching 8 random questions...');
                const response = await fetch('/api/questions/random?count=8');
                const data = await response.json();

                console.log('📋 8 Random Questions Response:', data);

                // Show summary in alert
                alert(`Fetched 8 questions:\nCategories: ${Object.keys(data.categoryDistribution || {}).length}\nCheck console for full details`);

            } catch (error) {
                console.error('❌ Error fetching 8 questions:', error);
                alert('Error fetching questions. Check console for details.');
            }
        });
    }

    // Get 12 Random Questions
    const get12QuestionsBtn = document.getElementById('get12QuestionsBtn');
    if (get12QuestionsBtn) {
        get12QuestionsBtn.addEventListener('click', async function() {
            try {
                console.log('🎲 Fetching 12 random questions...');
                const response = await fetch('/api/questions/random?count=12');
                const data = await response.json();

                console.log('📋 12 Random Questions Response:', data);

                // Show summary in alert
                alert(`Fetched 12 questions:\nCategories: ${Object.keys(data.categoryDistribution || {}).length}\nCheck console for full details`);

            } catch (error) {
                console.error('❌ Error fetching 12 questions:', error);
                alert('Error fetching questions. Check console for details.');
            }
        });
    }

    // Test Session Deduplication
    const testDeduplicationBtn = document.getElementById('testDeduplicationBtn');
    if (testDeduplicationBtn) {
        testDeduplicationBtn.addEventListener('click', async function() {
            try {
                console.log('🧪 Testing session deduplication...');

                // Check if QuestionManager is available
                if (typeof QuestionManager === 'undefined') {
                    console.error('❌ QuestionManager class not found');
                    alert('QuestionManager class not available. Make sure questionManager.js is loaded.');
                    return;
                }

                // Create or use existing QuestionManager instance
                const qm = new QuestionManager();

                // Get current session stats
                const sessionStats = qm.getSessionStats();
                console.log('📊 Current Session Stats:', sessionStats);

                // Check sessionStorage directly
                const storedData = sessionStorage.getItem('usedQuestionIds');
                console.log('💾 SessionStorage Data:', storedData);

                // Test fetching questions to see deduplication in action
                console.log('🔄 Testing question fetch with deduplication...');
                const result = await qm.getRandomQuestions(5);

                console.log('✅ Deduplication Test Results:', {
                    sessionId: result.sessionInfo.sessionId,
                    totalUsed: result.sessionInfo.totalUsed,
                    excludedThisRequest: result.sessionInfo.excludedThisRequest,
                    questionsReturned: result.questions.length,
                    categoryDistribution: result.categoryDistribution
                });

                // Check for duplicates in returned questions
                const questionIds = result.questions.map(q => q._id);
                const uniqueIds = [...new Set(questionIds)];
                const hasDuplicates = questionIds.length !== uniqueIds.length;

                console.log('🔍 Duplicate Check:', {
                    totalQuestions: questionIds.length,
                    uniqueQuestions: uniqueIds.length,
                    hasDuplicates: hasDuplicates
                });

                alert(`Session Deduplication Test:\nSession ID: ${result.sessionInfo.sessionId}\nTotal Used: ${result.sessionInfo.totalUsed}\nExcluded: ${result.sessionInfo.excludedThisRequest}\nDuplicates: ${hasDuplicates ? 'YES ❌' : 'NO ✅'}\n\nCheck console for detailed results.`);

            } catch (error) {
                console.error('❌ Error testing deduplication:', error);
                alert('Error testing deduplication. Check console for details.');
            }
        });
    }

    // Category button functionality
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(button => {
        button.addEventListener('click', async function() {
            const category = this.getAttribute('data-category');
            
            // Update active button
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            await loadQuestionsByCategory(category);
        });
    });

    async function loadQuestionsByCategory(category) {
        const resultDiv = document.getElementById('categoryQuestionsResult');
        
        try {
            console.log(`🔍 Loading questions for category: ${category}`);
            
            let url;
            if (category === 'all') {
                url = '/api/questions/admin/all';
            } else {
                url = `/api/questions/category/${category}`;
            }
            
            const response = await fetch(url);
            const data = await response.json();
            
            let questions;
            if (category === 'all') {
                questions = data.questions || [];
                console.log(`📊 Loaded ${questions.length} total questions`, data.stats);
            } else {
                questions = data.questions || [];
                console.log(`📋 Loaded ${questions.length} questions for ${category}`);
            }
            
            // Display questions
            displayQuestions(questions, category, resultDiv);
            
        } catch (error) {
            console.error('❌ Error loading questions by category:', error);
            resultDiv.innerHTML = `<div style="color: #ff6b6b; padding: 20px; text-align: center;">Error loading questions for ${category}</div>`;
        }
    }

    function displayQuestions(questions, category, container) {
        if (questions.length === 0) {
            container.innerHTML = `<div style="color: #666; padding: 20px; text-align: center;">No questions found for ${category}</div>`;
            return;
        }

        const questionsHtml = questions.map((q, index) => {
            const answersHtml = q.answers.map((answer, answerIndex) => {
                const isCorrect = answerIndex === q.correct;
                const className = isCorrect ? 'answer-correct' : 'answer-incorrect';
                const prefix = isCorrect ? '✓' : ' ';
                return `<div class="answer-option ${className}">${prefix} ${answerIndex + 1}. ${answer}</div>`;
            }).join('');

            return `
                <div class="question-entry">
                    <div class="question-text">${index + 1}. ${q.question}</div>
                    <div class="answers-list">${answersHtml}</div>
                    <div class="question-meta">
                        Category: ${q.category} | Difficulty: ${q.difficulty || 'medium'} | 
                        ID: ${q._id}
                    </div>
                </div>
            `;
        }).join('');

        const headerText = category === 'all' ? 
            `All Questions (${questions.length} total)` : 
            `${category} Questions (${questions.length} found)`;

        container.innerHTML = `
            <div class="questions-display">
                <h3>${headerText}</h3>
                ${questionsHtml}
            </div>
        `;
    }

    console.log('✅ Test Questions script loaded and event listeners attached');
});