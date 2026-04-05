
# Fix the remaining files
import os

project_dir = "/mnt/kimi/output/neuro_hack"

# Create preview.html
preview_html = '''<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>NEURO HACK - Quick Preview</title>
    <style>
        body {
            margin: 0;
            padding: 40px;
            background: #0a0a0f;
            color: #00f0ff;
            font-family: 'Courier New', monospace;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
        }
        h1 {
            font-size: 3rem;
            text-shadow: 0 0 20px #00f0ff;
            margin-bottom: 20px;
        }
        .info {
            max-width: 600px;
            text-align: center;
            line-height: 1.6;
            margin-bottom: 30px;
        }
        .file-list {
            background: rgba(0, 240, 255, 0.1);
            border: 1px solid #00f0ff;
            padding: 20px;
            border-radius: 5px;
            margin-bottom: 30px;
        }
        .file-list h3 {
            margin-top: 0;
            color: #ff00ff;
        }
        .file-list ul {
            list-style: none;
            padding: 0;
        }
        .file-list li {
            padding: 5px 0;
            color: #888;
        }
        .file-list li::before {
            content: "✓ ";
            color: #00ff88;
        }
        a.button {
            display: inline-block;
            padding: 15px 40px;
            background: transparent;
            border: 2px solid #00f0ff;
            color: #00f0ff;
            text-decoration: none;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 2px;
            transition: all 0.3s;
        }
        a.button:hover {
            background: rgba(0, 240, 255, 0.2);
            box-shadow: 0 0 30px rgba(0, 240, 255, 0.5);
        }
    </style>
</head>
<body>
    <h1>NEURO HACK</h1>
    <div class="info">
        <p><strong>Mind Invasion</strong> - A complete psychological cyber-adventure game.</p>
        <p>All game files have been generated successfully and are ready to play!</p>
    </div>
    
    <div class="file-list">
        <h3>Generated Files:</h3>
        <ul>
            <li>index.html - Main game interface</li>
            <li>css/style.css - Complete styling system</li>
            <li>js/gameData.js - All game data and content</li>
            <li>js/gameEngine.js - Core game logic</li>
            <li>js/main.js - Entry point</li>
            <li>README.md - Documentation</li>
        </ul>
    </div>
    
    <a href="index.html" class="button">Launch Game</a>
    
    <p style="margin-top: 30px; font-size: 0.9rem; color: #666;">
        Open index.html in your browser to start playing
    </p>
</body>
</html>'''

with open(f"{project_dir}/preview.html", "w") as f:
    f.write(preview_html)

print("✓ preview.html created")

# Create main.js
main_js = '''// NEURO HACK: Mind Invasion - Main Entry Point

// Add floating animation
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0% { transform: translateY(0) translateX(0); opacity: 0; }
        10% { opacity: 0.6; }
        90% { opacity: 0.6; }
        100% { transform: translateY(-100vh) translateX(50px); opacity: 0; }
    }
`;
document.head.appendChild(style);

console.log('%c NEURO HACK: Mind Invasion ', 'background: #00f0ff; color: #0a0a0f; font-size: 20px; font-weight: bold;');
console.log('%c v1.0.0 - PC Version ', 'color: #9d00ff;');

// Prevent accidental back button
window.addEventListener('beforeunload', (e) => {
    if (window.game && window.game.gameState === 'playing') {
        e.preventDefault();
        e.returnValue = 'Neural dive in progress. Extract?';
    }
});
'''

with open(f"{project_dir}/js/main.js", "w") as f:
    f.write(main_js)

print("✓ main.js created")

# Final summary
print("\n" + "="*50)
print("🎮 NEURO HACK: Mind Invasion - COMPLETE")
print("="*50)
print(f"\n📁 Location: {project_dir}/")
print("\n📂 Files created:")

for root, dirs, files in os.walk(project_dir):
    level = root.replace(project_dir, '').count(os.sep)
    indent = '  ' * level
    folder = os.path.basename(root)
    if folder != 'neuro_hack':
        print(f"{indent}{folder}/")
    for file in files:
        filepath = os.path.join(root, file)
        size = os.path.getsize(filepath)
        print(f"{indent}  {file} ({size:,} bytes)")

print("\n🚀 How to play:")
print("   1. Open index.html in your browser")
print("   2. Or open preview.html first")
print("   3. Or run: python -m http.server 8000")
print("\n✨ Features:")
print("   • 4 unique minds to explore")
print("   • 5 neural abilities with cooldowns")
print("   • Combat, puzzles, and dialogue systems")
print("   • Emotion engine affecting gameplay")
print("   • Achievement system")
print("   • Responsive cyberpunk UI")
print("="*50)
