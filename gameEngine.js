
# Create gameEngine.js - Core game logic
game_engine_js = '''// NEURO HACK: Mind Invasion - Game Engine

class NeuroHackGame {
    constructor() {
        this.currentMind = null;
        this.currentScene = null;
        this.playerStats = { ...GameData.player };
        this.abilityCooldowns = {};
        this.gameState = 'title';
        this.history = [];
        this.combatState = null;
        this.puzzleState = null;
        this.memoryState = null;
        this.truthVisionActive = false;
        this.timeFrozen = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.startBackgroundEffects();
        console.log('NEURO HACK: Mind Invasion initialized');
    }

    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
        
        // Dialogue click
        document.getElementById('dialogueBox').addEventListener('click', () => {
            if (this.currentScene && this.currentScene.dialogue) {
                this.advanceDialogue();
            }
        });

        // Tooltip system
        document.querySelectorAll('[data-ability]').forEach(el => {
            el.addEventListener('mouseenter', (e) => this.showTooltip(e));
            el.addEventListener('mouseleave', () => this.hideTooltip());
        });
    }

    handleKeydown(e) {
        if (this.gameState !== 'playing') return;
        
        switch(e.key) {
            case '1': this.useAbility('focus'); break;
            case '2': this.useAbility('freeze'); break;
            case '3': this.useAbility('rewind'); break;
            case '4': this.useAbility('link'); break;
            case '5': this.useAbility('truth'); break;
            case 'Escape': this.showExit(); break;
        }
    }

    startGame() {
        this.playerStats.startTime = Date.now();
        this.showScreen('loadingScreen');
        this.simulateLoading();
    }

    simulateLoading() {
        let progress = 0;
        const progressBar = document.getElementById('loadingProgress');
        const loadingText = document.getElementById('loadingText');
        const loadingPercent = document.getElementById('loadingPercent');
        
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(() => this.showCortexHub(), 500);
            }
            
            progressBar.style.width = progress + '%';
            loadingPercent.textContent = Math.floor(progress) + '%';
            
            if (Math.random() > 0.7) {
                loadingText.textContent = GameData.loadingMessages[
                    Math.floor(Math.random() * GameData.loadingMessages.length)
                ];
            }
        }, 200);
    }

    showCortexHub() {
        this.gameState = 'hub';
        this.showScreen('cortexHub');
        this.renderMindsGrid();
        this.updateHUD();
    }

    renderMindsGrid() {
        const grid = document.getElementById('mindsGrid');
        grid.innerHTML = '';
        
        GameData.minds.forEach((mind, index) => {
            const card = document.createElement('div');
            card.className = 'mind-card';
            
            if (mind.status === 'locked') card.classList.add('locked');
            if (mind.status === 'completed') card.classList.add('completed');
            if (mind.status === 'available') card.classList.add('current');
            
            card.innerHTML = `
                <div class="mind-icon">${mind.icon}</div>
                <div class="mind-name">${mind.name}</div>
                <div class="mind-desc">${mind.desc}</div>
                <div class="mind-status">${mind.status.toUpperCase()}</div>
            `;
            
            card.addEventListener('click', () => this.selectMind(mind));
            grid.appendChild(card);
        });
    }

    selectMind(mind) {
        if (mind.status === 'locked') {
            this.showModal('lockedModal');
            return;
        }
        
        this.currentMind = mind;
        this.enterMind(mind);
    }

    enterMind(mind) {
        this.gameState = 'playing';
        this.showScreen('gameLevel');
        document.getElementById('gameHud').style.display = 'block';
        document.getElementById('emotionIndicator').style.display = 'flex';
        
        this.showNotification('DIVE INITIATED', `Entering ${mind.name}...`, 'info');
        this.loadScene(mind.scenes[0]);
    }

    loadScene(scene) {
        this.currentScene = scene;
        this.history.push(scene);
        
        // Update visual elements
        document.getElementById('sceneTitle').textContent = scene.title;
        document.getElementById('sceneCounter').textContent = `SCENE ${this.history.length}/${this.currentMind.scenes.length}`;
        document.getElementById('visualContent').textContent = scene.visual;
        
        // Typewriter effect for narrative
        this.typewriterEffect('narrativeText', scene.narrative);
        
        // Update emotion
        this.updateEmotion(scene.emotion);
        
        // Clear previous containers
        document.getElementById('choicesContainer').innerHTML = '';
        document.getElementById('combatInterface').classList.remove('active');
        document.getElementById('puzzleContainer').classList.remove('active');
        document.getElementById('memoryArea').classList.remove('active');
        document.getElementById('dialogueBox').classList.remove('active');
        
        // Handle scene type
        if (scene.choices) this.renderChoices(scene.choices);
        if (scene.dialogue) this.startDialogue(scene.dialogue);
        if (scene.combat) this.startCombat(scene.combat);
        if (scene.puzzle) this.startPuzzle(scene.puzzle);
        if (scene.memoryGame) this.startMemoryGame(scene.memoryGame);
        
        this.updateHUD();
    }

    typewriterEffect(elementId, text) {
        const element = document.getElementById(elementId);
        element.innerHTML = '';
        let i = 0;
        
        const type = () => {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, 20);
            }
        };
        
        type();
    }

    renderChoices(choices) {
        const container = document.getElementById('choicesContainer');
        container.innerHTML = '';
        
        choices.forEach(choice => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.textContent = choice.text;
            btn.addEventListener('click', () => this.makeChoice(choice));
            container.appendChild(btn);
        });
    }

    makeChoice(choice) {
        // Apply effects
        if (choice.effect) {
            if (choice.effect.stability) {
                this.playerStats.stability = Math.max(0, Math.min(100, 
                    this.playerStats.stability + choice.effect.stability));
            }
            if (choice.effect.corruption) {
                this.playerStats.corruption = Math.min(100, 
                    this.playerStats.corruption + choice.effect.corruption);
            }
        }
        
        // Track emotions
        if (choice.effect && (choice.effect.confidence || choice.effect.fear || 
            choice.effect.confusion || choice.effect.determination)) {
            const emotion = Object.keys(choice.effect).find(k => 
                ['confidence', 'fear', 'confusion', 'determination'].includes(k));
            if (emotion && !this.playerStats.emotionsExperienced.includes(emotion)) {
                this.playerStats.emotionsExperienced.push(emotion);
            }
        }
        
        this.updateHUD();
        
        // Check for corruption threshold
        if (this.playerStats.corruption > 50) {
            this.triggerGlitch();
        }
        
        // Find next scene
        const nextScene = this.currentMind.scenes.find(s => s.id === choice.next);
        if (nextScene) {
            this.loadScene(nextScene);
        } else {
            this.completeMind();
        }
    }

    startDialogue(dialogue) {
        const box = document.getElementById('dialogueBox');
        document.getElementById('dialogueSpeaker').textContent = dialogue.speaker;
        document.getElementById('dialogueText').textContent = dialogue.text;
        box.classList.add('active');
        
        if (dialogue.responses) {
            this.dialogueResponses = dialogue.responses;
        }
    }

    advanceDialogue() {
        if (this.dialogueResponses) {
            document.getElementById('dialogueBox').classList.remove('active');
            this.renderChoices(this.dialogueResponses);
            this.dialogueResponses = null;
        }
    }

    startCombat(combatData) {
        this.combatState = {
            enemy: combatData.enemy,
            enemyHealth: combatData.health,
            maxEnemyHealth: combatData.health,
            weakness: combatData.weakness,
            turn: 1
        };
        
        document.getElementById('enemyName').textContent = combatData.enemy;
        document.getElementById('enemyDesc').textContent = combatData.enemyDesc;
        document.getElementById('enemyPortrait').textContent = combatData.enemyIcon;
        document.getElementById('combatInterface').classList.add('active');
        
        this.updateCombatUI();
        this.logCombat(`COMBAT INITIATED: ${combatData.enemy} detected!`);
        
        this.playerStats.corruptionEncounters++;
    }

    combatAction(action) {
        if (!this.combatState) return;
        
        let damage = 20;
        let message = '';
        
        // Check for weakness
        if (action === this.combatState.weakness) {
            damage = 40;
            message = 'CRITICAL: Target weakness exploited!';
        }
        
        // Apply damage
        this.combatState.enemyHealth -= damage;
        
        if (message) this.logCombat(message);
        this.logCombat(`Used ${action.toUpperCase()}: ${damage} damage dealt.`);
        
        if (this.combatState.enemyHealth <= 0) {
            this.winCombat();
        } else {
            // Enemy counterattack
            const enemyDamage = 10 + Math.floor(Math.random() * 10);
            this.playerStats.integrity -= enemyDamage;
            this.logCombat(`${this.combatState.enemy} attacks: ${enemyDamage} damage received!`);
            
            if (this.playerStats.integrity <= 0) {
                this.gameOver();
                return;
            }
        }
        
        this.combatState.turn++;
        this.updateCombatUI();
        this.updateHUD();
    }

    updateCombatUI() {
        if (!this.combatState) return;
        
        const healthPercent = (this.combatState.enemyHealth / this.combatState.maxEnemyHealth) * 100;
        document.getElementById('enemyHealthFill').style.width = healthPercent + '%';
        document.getElementById('enemyHealthText').textContent = 
            `${this.combatState.enemyHealth}/${this.combatState.maxEnemyHealth}`;
    }

    logCombat(message) {
        const log = document.getElementById('combatLog');
        const entry = document.createElement('div');
        entry.className = 'combat-log-entry';
        entry.textContent = `> ${message}`;
        log.appendChild(entry);
        log.scrollTop = log.scrollHeight;
    }

    winCombat() {
        this.logCombat('TARGET NEUTRALIZED. Corruption purged.');
        setTimeout(() => {
            document.getElementById('combatInterface').classList.remove('active');
            this.combatState = null;
            this.completeScene();
        }, 1500);
    }

    startPuzzle(puzzleData) {
        this.puzzleState = {
            type: puzzleData.type,
            difficulty: puzzleData.difficulty,
            grid: [],
            solution: [],
            playerSolution: []
        };
        
        document.getElementById('puzzleContainer').classList.add('active');
        this.generatePuzzle();
    }

    generatePuzzle() {
        const grid = document.getElementById('circuitGrid');
        grid.innerHTML = '';
        
        // Create 5x5 grid
        for (let i = 0; i < 25; i++) {
            const node = document.createElement('div');
            node.className = 'circuit-node';
            node.dataset.index = i;
            node.addEventListener('click', () => this.toggleNode(i));
            grid.appendChild(node);
        }
        
        // Generate random solution
        this.puzzleState.solution = [];
        for (let i = 0; i < 5 + this.puzzleState.difficulty; i++) {
            this.puzzleState.solution.push(Math.floor(Math.random() * 25));
        }
    }

    toggleNode(index) {
        const nodes = document.querySelectorAll('.circuit-node');
        const node = nodes[index];
        
        if (this.puzzleState.playerSolution.includes(index)) {
            this.puzzleState.playerSolution = this.puzzleState.playerSolution.filter(i => i !== index);
            node.classList.remove('active');
        } else {
            this.puzzleState.playerSolution.push(index);
            node.classList.add('active');
        }
        
        // Check win condition
        if (this.checkPuzzleSolution()) {
            this.winPuzzle();
        }
    }

    checkPuzzleSolution() {
        const solution = this.puzzleState.solution.sort((a, b) => a - b);
        const player = this.puzzleState.playerSolution.sort((a, b) => a - b);
        return JSON.stringify(solution) === JSON.stringify(player);
    }

    winPuzzle() {
        this.showNotification('PUZZLE SOLVED', 'Neural pathways restored!', 'success');
        document.getElementById('puzzleContainer').classList.remove('active');
        this.puzzleState = null;
        this.completeScene();
    }

    resetPuzzle() {
        this.puzzleState.playerSolution = [];
        document.querySelectorAll('.circuit-node').forEach(n => n.classList.remove('active'));
    }

    hintPuzzle() {
        this.playerStats.stability -= 10;
        this.updateHUD();
        
        // Reveal one correct node
        const unrevealed = this.puzzleState.solution.filter(s => 
            !this.puzzleState.playerSolution.includes(s));
        if (unrevealed.length > 0) {
            const hint = unrevealed[0];
            const nodes = document.querySelectorAll('.circuit-node');
            nodes[hint].style.borderColor = 'var(--neon-green)';
        }
    }

    startMemoryGame(memoryData) {
        this.memoryState = {
            fragments: memoryData.fragments,
            correctOrder: memoryData.correctOrder,
            selectedOrder: []
        };
        
        const area = document.getElementById('memoryArea');
        area.innerHTML = '';
        area.classList.add('active');
        
        // Shuffle fragments
        const shuffled = [...memoryData.fragments].sort(() => Math.random() - 0.5);
        
        shuffled.forEach(fragment => {
            const el = document.createElement('div');
            el.className = 'memory-fragment';
            el.innerHTML = `
                <div class="fragment-icon">${fragment.icon}</div>
                <div class="fragment-label">${fragment.label}</div>
            `;
            el.addEventListener('click', () => this.selectFragment(fragment.id, el));
            area.appendChild(el);
        });
    }

    selectFragment(id, element) {
        if (element.classList.contains('selected')) return;
        
        element.classList.add('selected');
        this.memoryState.selectedOrder.push(id);
        
        // Check if complete
        if (this.memoryState.selectedOrder.length === this.memoryState.correctOrder.length) {
            this.checkMemoryOrder();
        }
    }

    checkMemoryOrder() {
        const correct = JSON.stringify(this.memoryState.selectedOrder) === 
                       JSON.stringify(this.memoryState.correctOrder);
        
        if (correct) {
            this.showNotification('MEMORIES INTEGRATED', 'Fragment reassembly complete!', 'success');
            document.getElementById('memoryArea').classList.remove('active');
            this.completeScene();
        } else {
            this.showNotification('SEQUENCE ERROR', 'Memory fragments rejecting order. Try again.', 'error');
            this.playerStats.stability -= 15;
            this.updateHUD();
            
            // Reset
            setTimeout(() => {
                this.memoryState.selectedOrder = [];
                document.querySelectorAll('.memory-fragment').forEach(el => {
                    el.classList.remove('selected');
                });
            }, 1000);
        }
    }

    completeScene() {
        // Check if more scenes
        const currentIndex = this.currentMind.scenes.findIndex(s => s.id === this.currentScene.id);
        if (currentIndex < this.currentMind.scenes.length - 1) {
            this.loadScene(this.currentMind.scenes[currentIndex + 1]);
        } else {
            this.completeMind();
        }
    }

    completeMind() {
        // Apply rewards
        const reward = this.currentMind.resolution.reward;
        this.playerStats.integrity = Math.min(100, this.playerStats.integrity + reward.integrity);
        this.playerStats.stability = Math.min(100, this.playerStats.stability + reward.stability);
        
        // Mark as completed
        this.currentMind.status = 'completed';
        this.playerStats.mindsCompleted.push(this.currentMind.id);
        this.playerStats.resolutions++;
        
        // Unlock next mind
        const nextMind = GameData.minds.find(m => m.status === 'locked');
        if (nextMind) nextMind.status = 'available';
        
        // Check achievements
        this.checkAchievements();
        
        // Show result
        this.showResult(true, this.currentMind.resolution.success);
    }

    showResult(success, message) {
        const screen = document.getElementById('resultScreen');
        document.getElementById('resultIcon').textContent = success ? '🏆' : '💀';
        document.getElementById('resultTitle').textContent = success ? 'MIND STABILIZED' : 'DIVE FAILED';
        document.getElementById('resultDesc').textContent = message;
        screen.classList.add('active');
    }

    returnToHub() {
        document.getElementById('resultScreen').classList.remove('active');
        document.getElementById('gameHud').style.display = 'none';
        document.getElementById('emotionIndicator').style.display = 'none';
        this.showCortexHub();
    }

    useAbility(abilityId) {
        if (this.abilityCooldowns[abilityId]) return;
        
        const ability = GameData.abilities[abilityId];
        
        // Apply ability effect
        switch(abilityId) {
            case 'focus':
                this.triggerFocusPulse();
                break;
            case 'freeze':
                this.triggerTimeFreeze();
                break;
            case 'rewind':
                this.triggerRewind();
                break;
            case 'link':
                this.triggerNeuralLink();
                break;
            case 'truth':
                this.triggerTruthVision();
                break;
        }
        
        // Start cooldown
        this.startCooldown(abilityId, ability.cooldown);
        
        // Track achievement
        if (abilityId === 'truth') {
            // Check truth seeker achievement
        }
    }

    startCooldown(abilityId, duration) {
        this.abilityCooldowns[abilityId] = true;
        const overlay = document.getElementById(`cooldown-${abilityId}`);
        const slot = document.querySelector(`[data-ability="${abilityId}"]`);
        
        if (slot) slot.classList.add('cooldown');
        
        let remaining = duration;
        const interval = setInterval(() => {
            remaining -= 100;
            const percent = (remaining / duration) * 100;
            if (overlay) overlay.style.height = percent + '%';
            
            if (remaining <= 0) {
                clearInterval(interval);
                this.abilityCooldowns[abilityId] = false;
                if (slot) slot.classList.remove('cooldown');
                if (overlay) overlay.style.height = '0%';
            }
        }, 100);
    }

    triggerFocusPulse() {
        document.body.style.filter = 'contrast(1.2) brightness(1.1)';
        setTimeout(() => {
            document.body.style.filter = '';
        }, 5000);
        
        this.showNotification('FOCUS PULSE', 'Illusions cleared. True paths revealed.', 'success');
    }

    triggerTimeFreeze() {
        this.timeFrozen = true;
        document.body.style.animation = 'none';
        
        setTimeout(() => {
            this.timeFrozen = false;
            document.body.style.animation = '';
        }, 8000);
        
        this.showNotification('TIME FREEZE', 'Temporal flow suspended.', 'info');
    }

    triggerRewind() {
        if (this.history.length > 1) {
            this.history.pop();
            const previous = this.history[this.history.length - 1];
            this.loadScene(previous);
            this.showNotification('MEMORY REWIND', 'Timeline restored to previous state.', 'success');
        }
    }

    triggerNeuralLink() {
        this.showNotification('NEURAL LINK', 'Environment control established.', 'info');
        // Highlight interactive elements
        document.querySelectorAll('.choice-btn, .circuit-node, .memory-fragment').forEach(el => {
            el.style.boxShadow = '0 0 20px var(--neon-cyan)';
            setTimeout(() => el.style.boxShadow = '', 3000);
        });
    }

    triggerTruthVision() {
        this.truthVisionActive = true;
        document.body.classList.add('truth-vision');
        
        setTimeout(() => {
            this.truthVisionActive = false;
            document.body.classList.remove('truth-vision');
        }, 6000);
        
        this.showNotification('TRUTH VISION', 'Hidden reality revealed.', 'success');
    }

    updateEmotion(emotion) {
        document.querySelectorAll('.emotion-node').forEach(node => {
            node.classList.remove('active');
        });
        
        const emotionMap = {
            'confidence': 'confidence',
            'fear': 'fear',
            'confusion': 'confusion',
            'determination': 'determination'
        };
        
        const node = document.querySelector(`[data-emotion="${emotionMap[emotion]}"]`);
        if (node) node.classList.add('active');
        
        // Apply emotion effects
        this.applyEmotionEffects(emotion);
    }

    applyEmotionEffects(emotion) {
        const fearOverlay = document.getElementById('fearOverlay');
        
        switch(emotion) {
            case 'fear':
                fearOverlay.style.opacity = '0.7';
                break;
            case 'confidence':
                fearOverlay.style.opacity = '0';
                this.playerStats.stability = Math.min(100, this.playerStats.stability + 5);
                break;
            case 'confusion':
                document.getElementById('glitchOverlay').style.opacity = '0.5';
                setTimeout(() => {
                    document.getElementById('glitchOverlay').style.opacity = '0';
                }, 3000);
                break;
            case 'determination':
                this.playerStats.integrity = Math.min(100, this.playerStats.integrity + 5);
                break;
        }
        
        this.updateHUD();
    }

    triggerGlitch() {
        const overlay = document.getElementById('glitchOverlay');
        overlay.style.opacity = '1';
        
        setTimeout(() => {
            overlay.style.opacity = '0';
        }, 2000);
    }

    updateHUD() {
        document.getElementById('integrityBar').style.width = this.playerStats.integrity + '%';
        document.getElementById('stabilityBar').style.width = this.playerStats.stability + '%';
        document.getElementById('corruptionBar').style.width = this.playerStats.corruption + '%';
        
        document.getElementById('currentMindName').textContent = this.currentMind ? this.currentMind.name : 'THE CORTEX';
        document.getElementById('currentMindStatus').textContent = this.currentMind ? 'DIVE ACTIVE' : 'HUB ONLINE';
        
        // Color coding based on values
        const integrityBar = document.getElementById('integrityBar');
        if (this.playerStats.integrity < 30) integrityBar.style.background = 'var(--neon-red)';
        
        const corruptionBar = document.getElementById('corruptionBar');
        if (this.playerStats.corruption > 50) corruptionBar.style.background = 'var(--neon-red)';
    }

    checkAchievements() {
        const achievements = GameData.achievements;
        
        // First dive
        if (this.playerStats.mindsCompleted.length === 1 && !achievements[0].unlocked) {
            achievements[0].unlocked = true;
            this.showNotification('ACHIEVEMENT UNLOCKED', 'First Dive: Complete your first mind', 'success');
        }
        
        // Mind master
        if (this.playerStats.mindsCompleted.length === 4 && !achievements[3].unlocked) {
            achievements[3].unlocked = true;
            this.showNotification('ACHIEVEMENT UNLOCKED', 'Mind Master: All minds stabilized!', 'success');
        }
        
        // Null hunter
        if (this.playerStats.corruptionEncounters >= 3 && !achievements[1].unlocked) {
            achievements[1].unlocked = true;
            this.showNotification('ACHIEVEMENT UNLOCKED', 'Null Hunter: 3 corruptions defeated', 'success');
        }
        
        // Emotional sync
        if (this.playerStats.emotionsExperienced.length >= 4 && !achievements[5].unlocked) {
            achievements[5].unlocked = true;
            this.showNotification('ACHIEVEMENT UNLOCKED', 'Emotional Sync: All emotions experienced', 'success');
        }
    }

    gameOver() {
        this.showResult(false, 'Neural integrity critical. Emergency extraction initiated.');
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(screenId).classList.add('active');
    }

    showModal(modalId) {
        document.getElementById('modalOverlay').classList.add('active');
        document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
        document.getElementById(modalId).style.display = 'block';
    }

    closeModal(modalId) {
        document.getElementById('modalOverlay').classList.remove('active');
        document.getElementById(modalId).style.display = 'none';
    }

    showTutorial() {
        this.showModal('tutorialModal');
    }

    showStats() {
        const stats = this.playerStats;
        document.getElementById('statsMinds').textContent = `${stats.mindsCompleted.length}/4`;
        document.getElementById('statsResolutions').textContent = stats.resolutions;
        document.getElementById('statsCorruption').textContent = stats.corruptionEncounters;
        
        if (stats.startTime) {
            const elapsed = Math.floor((Date.now() - stats.startTime) / 1000);
            const hours = Math.floor(elapsed / 3600);
            const minutes = Math.floor((elapsed % 3600) / 60);
            const seconds = elapsed % 60;
            document.getElementById('statsTime').textContent = 
                `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        
        // Render achievements
        const achList = document.getElementById('achievementsList');
        achList.innerHTML = '';
        GameData.achievements.forEach(ach => {
            const div = document.createElement('div');
            div.className = 'achievement-item' + (ach.unlocked ? ' unlocked' : '');
            div.innerHTML = `
                <div class="achievement-icon">${ach.icon}</div>
                <div class="achievement-info">
                    <div class="achievement-name">${ach.name}</div>
                    <div class="achievement-desc">${ach.desc}</div>
                </div>
            `;
            achList.appendChild(div);
        });
        
        this.showModal('statsModal');
    }

    showExit() {
        this.showModal('exitModal');
    }

    confirmExit() {
        location.reload();
    }

    showNotification(title, message, type = 'info') {
        const container = document.getElementById('notificationContainer');
        const notif = document.createElement('div');
        notif.className = 'notification ' + type;
        notif.innerHTML = `
            <div class="notification-title">${title}</div>
            <div class="notification-text">${message}</div>
        `;
        container.appendChild(notif);
        
        setTimeout(() => {
            notif.style.opacity = '0';
            setTimeout(() => notif.remove(), 300);
        }, 4000);
    }

    showTooltip(e) {
        const ability = e.currentTarget.dataset.ability;
        const data = GameData.abilities[ability];
        const tooltip = document.getElementById('tooltip');
        
        tooltip.innerHTML = `
            <strong>${data.name}</strong><br>
            <span style="color: var(--text-secondary);">${data.description}</span><br>
            <span style="color: var(--neon-cyan); font-size: 0.8em;">Cooldown: ${data.cooldown/1000}s</span>
        `;
        
        tooltip.style.left = e.clientX + 10 + 'px';
        tooltip.style.top = e.clientY + 10 + 'px';
        tooltip.classList.add('visible');
    }

    hideTooltip() {
        document.getElementById('tooltip').classList.remove('visible');
    }

    startBackgroundEffects() {
        // Create floating neural particles
        const bg = document.getElementById('neuralBg');
        
        setInterval(() => {
            if (Math.random() > 0.7) {
                const particle = document.createElement('div');
                particle.style.cssText = `
                    position: absolute;
                    width: 2px;
                    height: 2px;
                    background: var(--neon-cyan);
                    border-radius: 50%;
                    left: ${Math.random() * 100}%;
                    top: ${Math.random() * 100}%;
                    animation: float ${5 + Math.random() * 10}s linear forwards;
                    opacity: 0.6;
                `;
                bg.appendChild(particle);
                
                setTimeout(() => particle.remove(), 15000);
            }
        }, 500);
    }
}

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.game = new NeuroHackGame();
});
'''

with open(f"{project_dir}/js/gameEngine.js", "w") as f:
    f.write(game_engine_js)

print("✓ gameEngine.js created")
