// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeSkills();
    initializeSearch();
    initializeCopyButtons();
    initializeSystemStatus();
    animateSections();
});

// Navigation functionality
function initializeNavigation() {
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            link.classList.add('active');
            
            // Scroll to section
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Highlight nav on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}

// Interactive skill selection and filtering
function initializeSkills() {
    const skillBadges = document.querySelectorAll('.skill-badge');
    
    skillBadges.forEach(badge => {
        badge.addEventListener('click', () => {
            badge.classList.toggle('selected');
            updateSkillMetrics();
        });
    });
}

function updateSkillMetrics() {
    const selectedSkills = document.querySelectorAll('.skill-badge.selected');
    const totalSkills = document.querySelectorAll('.skill-badge').length;
    
    const metrics = {
        selected: selectedSkills.length,
        total: totalSkills,
        percentage: Math.round((selectedSkills.length / totalSkills) * 100)
    };
    
    console.log(`Skills Analyzed: ${metrics.selected}/${metrics.total} (${metrics.percentage}%)`);
    
    return metrics;
}

// Search functionality
function initializeSearch() {
    const searchContainer = document.querySelector('#skills');
    if (!searchContainer) return;

    const searchHtml = `
        <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #00ff00;">
            <h3 style="margin-bottom: 15px;">>>> SEARCH_SKILLS</h3>
            <input 
                type="text" 
                class="terminal-input" 
                id="skillSearch" 
                placeholder=">> Search for a skill..."
            />
            <div class="search-results" id="searchResults"></div>
        </div>
    `;
    
    searchContainer.insertAdjacentHTML('beforeend', searchHtml);
    
    const searchInput = document.getElementById('skillSearch');
    const searchResults = document.getElementById('searchResults');
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        
        if (query.length === 0) {
            searchResults.innerHTML = '';
            return;
        }
        
        const allSkills = Array.from(document.querySelectorAll('.skill-badge'))
            .map(badge => badge.textContent.trim());
        
        const filtered = allSkills.filter(skill => 
            skill.toLowerCase().includes(query)
        );
        
        searchResults.innerHTML = '';
        filtered.forEach(skill => {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            resultItem.innerHTML = `>> Found: <strong>${skill}</strong>`;
            resultItem.addEventListener('click', () => {
                searchInput.value = skill;
                searchResults.innerHTML = '';
            });
            searchResults.appendChild(resultItem);
        });
    });
}

// Copy to clipboard functionality
function initializeCopyButtons() {
    const contactItems = document.querySelectorAll('.contact-item a');
    
    contactItems.forEach(link => {
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-btn';
        copyBtn.textContent = '[COPY]';
        copyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const text = link.textContent;
            navigator.clipboard.writeText(text).then(() => {
                copyBtn.classList.add('copied');
                copyBtn.textContent = '[COPIED!]';
                setTimeout(() => {
                    copyBtn.classList.remove('copied');
                    copyBtn.textContent = '[COPY]';
                }, 2000);
            });
        });
        link.parentNode.insertBefore(copyBtn, link.nextSibling);
    });
}

// System status indicator
function initializeSystemStatus() {
    const statusHtml = `
        <div class="system-status">
            <span class="status-indicator"></span>
            <span id="systemTime">00:00:00</span>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', statusHtml);
    
    function updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour12: false 
        });
        const timeElement = document.getElementById('systemTime');
        if (timeElement) {
            timeElement.textContent = timeString;
        }
    }
    
    updateTime();
    setInterval(updateTime, 1000);
}

// Animate sections on scroll
function animateSections() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Press 'S' to focus on search
    if (e.key === 's' && e.altKey) {
        e.preventDefault();
        const searchInput = document.getElementById('skillSearch');
        if (searchInput) searchInput.focus();
    }
    
    // Press 'H' to scroll to header
    if (e.key === 'h' && e.altKey) {
        e.preventDefault();
        document.querySelector('header').scrollIntoView({ behavior: 'smooth' });
    }
});

// Export functions for external use
window.getSelectedSkills = function() {
    return updateSkillMetrics();
};

window.clearSelectedSkills = function() {
    document.querySelectorAll('.skill-badge.selected').forEach(badge => {
        badge.classList.remove('selected');
    });
    updateSkillMetrics();
};

window.getExperience = function() {
    const items = document.querySelectorAll('.experience-item h3');
    return Array.from(items).map(item => item.textContent);
};