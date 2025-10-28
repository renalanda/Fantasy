// Sample NFL player data with predictions
const playerData = [
    {
        id: 1,
        name: "Josh Allen",
        position: "QB",
        team: "BUF",
        predictions: {
            week1: { score: 24.5, confidence: 85 },
            week2: { score: 22.8, confidence: 78 },
            week3: { score: 26.2, confidence: 82 }
        },
        injuryRisk: "Low",
        matchup: "Favorable"
    },
    {
        id: 2,
        name: "Christian McCaffrey",
        position: "RB",
        team: "SF",
        predictions: {
            week1: { score: 18.7, confidence: 92 },
            week2: { score: 16.3, confidence: 88 },
            week3: { score: 19.1, confidence: 90 }
        },
        injuryRisk: "Medium",
        matchup: "Very Favorable"
    },
    {
        id: 3,
        name: "Cooper Kupp",
        position: "WR",
        team: "LAR",
        predictions: {
            week1: { score: 15.2, confidence: 75 },
            week2: { score: 17.8, confidence: 82 },
            week3: { score: 14.6, confidence: 70 }
        },
        injuryRisk: "Low",
        matchup: "Favorable"
    },
    {
        id: 4,
        name: "Travis Kelce",
        position: "TE",
        team: "KC",
        predictions: {
            week1: { score: 12.4, confidence: 88 },
            week2: { score: 14.1, confidence: 85 },
            week3: { score: 11.8, confidence: 82 }
        },
        injuryRisk: "Low",
        matchup: "Very Favorable"
    },
    {
        id: 5,
        name: "Lamar Jackson",
        position: "QB",
        team: "BAL",
        predictions: {
            week1: { score: 21.3, confidence: 80 },
            week2: { score: 23.7, confidence: 85 },
            week3: { score: 20.9, confidence: 78 }
        },
        injuryRisk: "Medium",
        matchup: "Favorable"
    },
    {
        id: 6,
        name: "Derrick Henry",
        position: "RB",
        team: "TEN",
        predictions: {
            week1: { score: 16.8, confidence: 85 },
            week2: { score: 15.2, confidence: 80 },
            week3: { score: 17.5, confidence: 87 }
        },
        injuryRisk: "Medium",
        matchup: "Favorable"
    },
    {
        id: 7,
        name: "Davante Adams",
        position: "WR",
        team: "LV",
        predictions: {
            week1: { score: 13.9, confidence: 78 },
            week2: { score: 16.2, confidence: 85 },
            week3: { score: 14.7, confidence: 80 }
        },
        injuryRisk: "Low",
        matchup: "Favorable"
    },
    {
        id: 8,
        name: "Justin Tucker",
        position: "K",
        team: "BAL",
        predictions: {
            week1: { score: 9.2, confidence: 70 },
            week2: { score: 8.7, confidence: 68 },
            week3: { score: 9.8, confidence: 72 }
        },
        injuryRisk: "Low",
        matchup: "Neutral"
    }
];

// Global variables
let selectedPlayers = [];
let currentWeek = 1;
let currentPosition = "all";

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    displayPlayers();
    updateDraftRecommendations();
    updateAnalytics();
});

// Display players based on current filters
function displayPlayers() {
    const playersGrid = document.getElementById('players-grid');
    const positionFilter = document.getElementById('position-filter').value;
    const weekSelector = document.getElementById('week-selector').value;
    
    currentPosition = positionFilter;
    currentWeek = parseInt(weekSelector);
    
    let filteredPlayers = playerData;
    
    if (positionFilter !== 'all') {
        filteredPlayers = playerData.filter(player => player.position === positionFilter);
    }
    
    // Sort by prediction score for current week
    filteredPlayers.sort((a, b) => {
        const scoreA = a.predictions[`week${currentWeek}`].score;
        const scoreB = b.predictions[`week${currentWeek}`].score;
        return scoreB - scoreA;
    });
    
    playersGrid.innerHTML = '';
    
    filteredPlayers.forEach(player => {
        const prediction = player.predictions[`week${currentWeek}`];
        const playerCard = createPlayerCard(player, prediction);
        playersGrid.appendChild(playerCard);
    });
}

// Create individual player card
function createPlayerCard(player, prediction) {
    const card = document.createElement('div');
    card.className = 'player-card';
    card.onclick = () => togglePlayerSelection(player);
    
    const isSelected = selectedPlayers.some(p => p.id === player.id);
    if (isSelected) {
        card.classList.add('selected');
    }
    
    card.innerHTML = `
        <div class="player-header">
            <div class="player-name">${player.name}</div>
            <div class="player-position">${player.position}</div>
        </div>
        <div class="player-team">${player.team}</div>
        <div class="prediction-score">${prediction.score}</div>
        <div class="prediction-label">Projected Points</div>
        <div class="confidence-bar">
            <div class="confidence-fill" style="width: ${prediction.confidence}%"></div>
        </div>
        <div style="margin-top: 0.5rem; font-size: 0.875rem; color: #6b7280;">
            Confidence: ${prediction.confidence}% | Risk: ${player.injuryRisk} | Matchup: ${player.matchup}
        </div>
    `;
    
    return card;
}

// Toggle player selection
function togglePlayerSelection(player) {
    const existingIndex = selectedPlayers.findIndex(p => p.id === player.id);
    
    if (existingIndex > -1) {
        selectedPlayers.splice(existingIndex, 1);
    } else {
        // Check position limits
        const positionCount = selectedPlayers.filter(p => p.position === player.position).length;
        const maxPerPosition = getMaxPerPosition(player.position);
        
        if (positionCount < maxPerPosition) {
            selectedPlayers.push(player);
        } else {
            alert(`You can only select ${maxPerPosition} ${player.position}${player.position === 'RB' || player.position === 'WR' ? 's' : ''}`);
            return;
        }
    }
    
    displayPlayers();
    updateAnalytics();
}

// Get maximum players per position
function getMaxPerPosition(position) {
    const limits = {
        'QB': 2,
        'RB': 4,
        'WR': 4,
        'TE': 2,
        'K': 1
    };
    return limits[position] || 1;
}

// Filter players by position
function filterPlayers() {
    displayPlayers();
}

// Update predictions when week changes
function updatePredictions() {
    displayPlayers();
}

// Update draft recommendations
function updateDraftRecommendations() {
    const draftPosition = parseInt(document.getElementById('draft-position').value);
    const leagueSize = parseInt(document.getElementById('league-size').value);
    
    // Simulate draft recommendations based on position and league size
    const recommendations = generateDraftRecommendations(draftPosition, leagueSize);
    
    const recommendationCards = document.getElementById('recommendation-cards');
    recommendationCards.innerHTML = '';
    
    recommendations.forEach((rec, index) => {
        const card = document.createElement('div');
        card.className = 'recommendation-card';
        card.innerHTML = `
            <div class="recommendation-rank">#${index + 1}</div>
            <div class="recommendation-name">${rec.name}</div>
            <div class="recommendation-position">${rec.position} - ${rec.team}</div>
            <div class="recommendation-score">${rec.score} pts</div>
        `;
        recommendationCards.appendChild(card);
    });
}

// Generate draft recommendations
function generateDraftRecommendations(draftPosition, leagueSize) {
    // Simple algorithm to generate recommendations
    const recommendations = [];
    const positions = ['QB', 'RB', 'WR', 'TE', 'K'];
    
    positions.forEach(pos => {
        const positionPlayers = playerData.filter(p => p.position === pos);
        const topPlayer = positionPlayers[0];
        if (topPlayer) {
            const week1Score = topPlayer.predictions.week1.score;
            recommendations.push({
                name: topPlayer.name,
                position: topPlayer.position,
                team: topPlayer.team,
                score: week1Score
            });
        }
    });
    
    // Sort by score and return top 4
    return recommendations.sort((a, b) => b.score - a.score).slice(0, 4);
}

// Update analytics dashboard
function updateAnalytics() {
    updateTeamStrength();
    updatePositionBreakdown();
}

// Update team strength meter
function updateTeamStrength() {
    const strengthBar = document.getElementById('strength-bar');
    const strengthScore = document.getElementById('strength-score');
    const strengthDescription = document.getElementById('strength-description');
    
    if (selectedPlayers.length === 0) {
        strengthBar.innerHTML = '<div class="strength-fill" style="width: 0%"></div>';
        strengthScore.textContent = '0/100';
        strengthDescription.textContent = 'Add players to see your team strength';
        return;
    }
    
    // Calculate team strength based on selected players
    const totalScore = selectedPlayers.reduce((sum, player) => {
        return sum + player.predictions[`week${currentWeek}`].score;
    }, 0);
    
    const maxPossibleScore = 100; // Arbitrary max for visualization
    const strengthPercentage = Math.min((totalScore / maxPossibleScore) * 100, 100);
    
    strengthBar.innerHTML = `<div class="strength-fill" style="width: ${strengthPercentage}%"></div>`;
    strengthScore.textContent = `${Math.round(strengthPercentage)}/100`;
    
    let description = '';
    if (strengthPercentage >= 80) {
        description = 'Excellent team! You\'re ready to dominate your league.';
    } else if (strengthPercentage >= 60) {
        description = 'Strong team with good potential for success.';
    } else if (strengthPercentage >= 40) {
        description = 'Decent team, consider adding more top-tier players.';
    } else {
        description = 'Team needs improvement. Focus on high-scoring players.';
    }
    
    strengthDescription.textContent = description;
}

// Update position breakdown
function updatePositionBreakdown() {
    const positionBreakdown = document.getElementById('position-breakdown');
    const positions = ['QB', 'RB', 'WR', 'TE'];
    
    positions.forEach(pos => {
        const count = selectedPlayers.filter(p => p.position === pos).length;
        const positionItem = positionBreakdown.querySelector(`.position-item:nth-child(${positions.indexOf(pos) + 1}) .position-count`);
        if (positionItem) {
            positionItem.textContent = count;
        }
    });
}

// Smooth scroll to section
function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({
        behavior: 'smooth'
    });
}

// Add some interactive features
document.addEventListener('DOMContentLoaded', function() {
    // Add click handlers for navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            selectedPlayers = [];
            displayPlayers();
            updateAnalytics();
        }
    });
});

// Console log for debugging (remove in production)
console.log('FantasyDraft Optimizer loaded successfully!');
console.log('Available functions: filterPlayers(), updatePredictions(), updateDraftRecommendations()');
