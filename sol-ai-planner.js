// Sol AI Planner - Core functionality for sustainable Earth solutions
class SolAIPlanner {
    constructor() {
        this.init();
    }

    init() {
        // Get DOM elements
        this.planningInput = document.getElementById('planning-input');
        this.generateBtn = document.getElementById('generate-plan');
        this.planOutput = document.getElementById('plan-output');

        // Bind event listeners
        this.bindEvents();

        // Display welcome message
        this.showWelcomeMessage();
    }

    bindEvents() {
        this.generateBtn.addEventListener('click', () => this.generatePlan());
        this.planningInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                this.generatePlan();
            }
        });
    }

    showWelcomeMessage() {
        this.planOutput.innerHTML = `
            <div class="placeholder">
                <p>🌍 Welcome to Sol AI Planner!</p>
                <p>Enter your sustainability goal above and click "Generate Plan" to get AI-powered recommendations for your environmental project.</p>
                <p><small>Tip: Press Ctrl+Enter to quickly generate a plan</small></p>
            </div>
        `;
    }

    async generatePlan() {
        const input = this.planningInput.value.trim();
        
        if (!input) {
            this.showError('Please enter a sustainability goal first.');
            return;
        }

        // Show loading state
        this.showLoading();
        this.generateBtn.disabled = true;

        try {
            // Simulate AI processing with a delay
            await this.delay(2000);
            
            // Generate plan based on input
            const plan = this.createPlan(input);
            this.displayPlan(plan);
        } catch (error) {
            this.showError('Failed to generate plan. Please try again.');
        } finally {
            this.generateBtn.disabled = false;
        }
    }

    createPlan(input) {
        // Basic AI-like plan generation (simulation)
        const sustainabilityAreas = [
            'renewable energy', 'waste reduction', 'carbon footprint', 'water conservation',
            'sustainable agriculture', 'green transportation', 'ecosystem restoration',
            'energy efficiency', 'circular economy', 'biodiversity'
        ];

        const actionTemplates = [
            'Conduct research and analysis',
            'Engage stakeholders and community',
            'Develop implementation strategy',
            'Create monitoring and evaluation framework',
            'Secure funding and resources',
            'Execute pilot program',
            'Scale and optimize solution',
            'Measure and report impact'
        ];

        // Extract key themes from input
        const detectedThemes = sustainabilityAreas.filter(area => 
            input.toLowerCase().includes(area.toLowerCase()) || 
            input.toLowerCase().includes(area.split(' ')[0])
        );

        const primaryTheme = detectedThemes[0] || 'sustainability';

        return {
            title: `${input.charAt(0).toUpperCase() + input.slice(1)} - Action Plan`,
            overview: `Comprehensive plan for implementing ${primaryTheme}-focused initiatives to address: "${input}"`,
            steps: this.generateSteps(input, primaryTheme, actionTemplates),
            timeline: '6-12 months',
            impact: this.generateImpactMetrics(primaryTheme)
        };
    }

    generateSteps(input, theme, templates) {
        const steps = [];
        const customActions = this.getCustomActions(theme);
        
        templates.slice(0, 5).forEach((template, index) => {
            const customAction = customActions[index] || `Focus on ${theme} optimization`;
            steps.push({
                phase: `Phase ${index + 1}`,
                title: template,
                description: `${customAction}. Ensure alignment with overall goal: "${input.substring(0, 100)}${input.length > 100 ? '...' : ''}"`
            });
        });

        return steps;
    }

    getCustomActions(theme) {
        const actionMap = {
            'renewable energy': [
                'Assess current energy consumption and identify renewable alternatives',
                'Partner with local renewable energy providers and experts',
                'Design renewable energy integration strategy',
                'Install monitoring systems for energy efficiency tracking',
                'Create community education program on renewable benefits'
            ],
            'waste reduction': [
                'Conduct waste audit to identify key reduction opportunities',
                'Engage suppliers and partners in waste reduction initiatives',
                'Implement zero-waste strategies and circular economy principles',
                'Track waste diversion rates and environmental impact',
                'Launch community awareness campaign on waste reduction'
            ],
            'water conservation': [
                'Analyze current water usage patterns and inefficiencies',
                'Collaborate with water management authorities and experts',
                'Deploy water-saving technologies and conservation methods',
                'Monitor water quality and conservation effectiveness',
                'Educate community on water conservation best practices'
            ],
            default: [
                'Research best practices and successful case studies',
                'Build partnerships with relevant organizations and experts',
                'Design and test sustainable solution approaches',
                'Implement monitoring and measurement systems',
                'Create awareness and education initiatives'
            ]
        };

        return actionMap[theme] || actionMap.default;
    }

    generateImpactMetrics(theme) {
        const impactMap = {
            'renewable energy': 'Reduce carbon emissions by 40-60%, decrease energy costs by 20-30%',
            'waste reduction': 'Divert 70-90% of waste from landfills, reduce disposal costs by 25-40%',
            'water conservation': 'Reduce water consumption by 30-50%, improve water quality metrics',
            default: 'Achieve 30-50% improvement in sustainability metrics, positive environmental impact'
        };

        return impactMap[theme] || impactMap.default;
    }

    displayPlan(plan) {
        const stepsHtml = plan.steps.map(step => `
            <div class="plan-step">
                <h3>${step.phase}: ${step.title}</h3>
                <p>${step.description}</p>
            </div>
        `).join('');

        this.planOutput.innerHTML = `
            <div class="plan-header">
                <h3 style="color: var(--accent-primary); margin-bottom: 0.5rem;">${plan.title}</h3>
                <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">${plan.overview}</p>
            </div>
            
            <div class="plan-steps">
                ${stepsHtml}
            </div>
            
            <div class="plan-footer" style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--border-secondary);">
                <p style="color: var(--text-muted); font-size: 0.9rem;">
                    <strong>Timeline:</strong> ${plan.timeline}<br>
                    <strong>Expected Impact:</strong> ${plan.impact}
                </p>
            </div>
        `;
    }

    showLoading() {
        this.planOutput.innerHTML = `
            <div class="loading">
                Generating AI-powered sustainability plan...
            </div>
        `;
    }

    showError(message) {
        this.planOutput.innerHTML = `
            <div style="color: var(--error); text-align: center; padding: 2rem;">
                <p>⚠️ ${message}</p>
            </div>
        `;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SolAIPlanner();
});

// Add some helper functions for enhanced interactivity
document.addEventListener('DOMContentLoaded', () => {
    // Add sample prompts for demonstration
    const samplePrompts = [
        "Reduce plastic waste in our university campus",
        "Implement solar energy for a small community",
        "Create a water conservation program for urban gardens",
        "Develop a carbon-neutral transportation system for a neighborhood"
    ];

    // Add quick action buttons (optional enhancement)
    const inputSection = document.querySelector('.input-section');
    const samplesContainer = document.createElement('div');
    samplesContainer.style.marginTop = '1rem';
    samplesContainer.innerHTML = `
        <p style="color: var(--text-muted); font-size: 0.8rem; margin-bottom: 0.5rem;">Quick examples:</p>
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
            ${samplePrompts.map(prompt => `
                <button class="sample-btn" style="
                    background: var(--bg-tertiary);
                    border: 1px solid var(--border-secondary);
                    color: var(--text-secondary);
                    padding: 0.3rem 0.6rem;
                    border-radius: 4px;
                    font-size: 0.75rem;
                    cursor: pointer;
                    transition: all 0.2s ease;
                " onclick="document.getElementById('planning-input').value = '${prompt}'">${prompt}</button>
            `).join('')}
        </div>
    `;
    
    inputSection.appendChild(samplesContainer);

    // Add hover effects to sample buttons
    const style = document.createElement('style');
    style.textContent = `
        .sample-btn:hover {
            background: var(--bg-hover) !important;
            border-color: var(--accent-primary) !important;
            color: var(--accent-primary) !important;
        }
    `;
    document.head.appendChild(style);
});