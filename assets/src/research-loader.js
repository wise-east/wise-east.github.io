// Research data loader and renderer
class ResearchLoader {
    constructor() {
        this.researchData = null;
        this.init();
    }

    async init() {
        try {
            await this.loadResearchData();
            this.renderResearchSections();
            this.setupScrollIndicators();
        } catch (error) {
            console.error('Error loading research data:', error);
        }
    }

    async loadResearchData() {
        const response = await fetch('/assets/src/research-data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        this.researchData = await response.json();
    }

    renderResearchSections() {
        if (!this.researchData) return;

        const researchItems = this.researchData.research;
        const researchSection = document.getElementById('research-items');

        if (!researchSection) {
            console.error('Research sections not found');
            return;
        }

        // Clear existing content
        researchSection.innerHTML = '';

        // Render items in appropriate sections
        researchItems.forEach(item => {
            const itemHTML = this.createResearchItemHTML(item);
            researchSection.appendChild(itemHTML);
        });
    }

    setupScrollIndicators() {
        const researchSection = document.getElementById('research-items');
        const newsSection = document.getElementById('news-items');
        
        // Setup research section indicators
        if (researchSection) {
            this.setupSectionIndicators(researchSection);
        }
        
        // Setup news section indicators
        if (newsSection) {
            this.setupSectionIndicators(newsSection);
        }
    }

    setupSectionIndicators(section) {
        // Create scroll indicators
        const scrollContainer = section;
        
        // For news section, position indicators relative to the parent container
        const indicatorContainer = section.id === 'news-items' ? section.parentElement : section;
        
        // Add scroll indicator elements
        const topIndicator = document.createElement('div');
        topIndicator.className = 'scroll-indicator scroll-indicator-top';
        topIndicator.innerHTML = '↑';
        
        const bottomIndicator = document.createElement('div');
        bottomIndicator.className = 'scroll-indicator scroll-indicator-bottom';
        bottomIndicator.innerHTML = '↓';
        
        indicatorContainer.appendChild(topIndicator);
        indicatorContainer.appendChild(bottomIndicator);

        // Update indicators on scroll
        const updateIndicators = () => {
            const scrollTop = section.scrollTop;
            const scrollHeight = section.scrollHeight;
            const clientHeight = section.clientHeight;
            
            // Show top indicator if not at top
            topIndicator.style.opacity = scrollTop > 0 ? '1' : '0';
            
            // Show bottom indicator if not at bottom
            bottomIndicator.style.opacity = scrollTop < (scrollHeight - clientHeight - 1) ? '1' : '0';
        };

        // Initial update
        updateIndicators();
        
        // Update on scroll
        section.addEventListener('scroll', updateIndicators);
        
        // Update on resize
        window.addEventListener('resize', updateIndicators);
    }

    extractYear(venue) {
        const yearMatch = venue.match(/\b(20\d{2})\b/);
        return yearMatch ? parseInt(yearMatch[1]) : 0;
    }

    createResearchItemHTML(item) {
        const div = document.createElement('div');
        div.className = 'research-item';
        div.id = `research-${item.id}`;

        // Highlight the author's name
        const highlightedAuthors = item.authors.replace(
            /Hyundong J\. Cho/g, 
            '<u><strong>Hyundong J. Cho</strong></u>'
        );

        let projectLink = '';
        if (item.project_url) {
            projectLink = ` <a href="${item.project_url}" target="_blank">[project page]</a>`;
        }

        let demoLink = '';
        if (item.demo_url) {
            demoLink = ` <a href="${item.demo_url}" target="_blank">[demo]</a>`;
        }

        let pressSection = '';
        if (item.press && item.press.length > 0) {
            const pressLinks = item.press.map(p => 
                `<a href="${p.url}" target="_blank">${p.name}</a>`
            ).join(', ');
            pressSection = `
                <div class="press">
                    Press: ${pressLinks}
                </div>
            `;
        }

        div.innerHTML = `
            <div class="pull-left thumbnail-wrapper">
                <img src="${item.thumbnail}" alt="${item.id}-thumbnail" class="thumbnail">
            </div>
            <div class="description">
                <div class="paper-title"> 
                    <a href="${item.paper_url}" target="_blank">
                        ${item.title}
                    </a>
                </div>
                <div class="authors">
                    ${highlightedAuthors}. <em style="color: #006400;">${item.venue}</em>${projectLink}${demoLink}
                </div>
                ${pressSection}
                <div class="excerpt">
                    ${item.excerpt}
                </div>
            </div>
        `;

        return div;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ResearchLoader();
}); 