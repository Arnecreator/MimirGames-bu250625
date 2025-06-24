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

    console.log('✅ Test Questions script loaded and event listeners attached');
});