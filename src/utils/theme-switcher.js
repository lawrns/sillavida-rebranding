/**
 * SillaVida Theme Switcher
 * 
 * This utility provides functionality to switch between the enhanced and original
 * color schemes, with persistence via localStorage.
 */

const themeSwitcher = {
  // Theme state
  currentTheme: 'enhanced',
  
  // Initialize theme
  init() {
    // Check for saved preference
    const savedTheme = localStorage.getItem('sillavida-theme');
    if (savedTheme) {
      this.setTheme(savedTheme);
    } else {
      // Default to enhanced theme
      this.setTheme('enhanced');
    }
    
    // Add theme toggle button to admin panel or footer
    this.createToggleButton();
  },
  
  // Set theme
  setTheme(theme) {
    this.currentTheme = theme;
    
    if (theme === 'original') {
      document.documentElement.classList.remove('enhanced-theme');
      document.documentElement.classList.add('original-theme');
    } else {
      document.documentElement.classList.remove('original-theme');
      document.documentElement.classList.add('enhanced-theme');
    }
    
    // Save preference
    localStorage.setItem('sillavida-theme', theme);
    
    // Dispatch event for components that need to react to theme changes
    document.dispatchEvent(new CustomEvent('themeChanged', { 
      detail: { theme } 
    }));
  },
  
  // Toggle theme
  toggleTheme() {
    const newTheme = this.currentTheme === 'enhanced' ? 'original' : 'enhanced';
    this.setTheme(newTheme);
    return newTheme;
  },
  
  // Create toggle button
  createToggleButton() {
    // Look for admin panel first
    const adminPanel = document.querySelector('.admin-panel');
    const footer = document.querySelector('.site-footer');
    
    const container = adminPanel || footer;
    if (!container) return;
    
    // Create button container
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('theme-toggle-container');
    
    // Create button
    const button = document.createElement('button');
    button.classList.add('theme-toggle-btn');
    button.setAttribute('aria-label', 'Toggle color theme');
    button.innerHTML = this.getButtonContent();
    
    // Add click event
    button.addEventListener('click', () => {
      const newTheme = this.toggleTheme();
      button.innerHTML = this.getButtonContent(newTheme);
    });
    
    // Add to container
    buttonContainer.appendChild(button);
    
    // Add to page
    if (adminPanel) {
      adminPanel.appendChild(buttonContainer);
    } else if (footer) {
      // Create a specific position in the footer
      const footerContent = footer.querySelector('.footer-content') || footer;
      const themeToggleSection = document.createElement('div');
      themeToggleSection.classList.add('footer-theme-toggle');
      
      const label = document.createElement('p');
      label.textContent = 'Apariencia del sitio:';
      
      themeToggleSection.appendChild(label);
      themeToggleSection.appendChild(buttonContainer);
      footerContent.appendChild(themeToggleSection);
    }
  },
  
  // Get button content based on current theme
  getButtonContent(theme = this.currentTheme) {
    if (theme === 'original') {
      return '<span>Diseño Original</span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"></path></svg>';
    } else {
      return '<span>Diseño Mejorado</span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
    }
  }
};

// Export for use in other files
export default themeSwitcher;
