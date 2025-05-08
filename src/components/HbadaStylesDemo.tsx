import React from 'react';

const HbadaStylesDemo: React.FC = () => {
  return (
    <div className="p-8 bg-background">
      <h1 className="text-4xl font-bold text-foreground mb-6">Hbada Design System</h1>
      
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Color Palette</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Primary Colors - Blacks */}
          <div className="p-4 rounded-md">
            <h3 className="text-lg font-medium mb-2">Primary (Black)</h3>
            <div className="flex flex-col space-y-2">
              <div className="h-20 bg-primary rounded-md flex items-end">
                <span className="p-2 text-primary-foreground font-medium">Primary (#222429)</span>
              </div>
              <div className="h-20 bg-primary-light rounded-md flex items-end">
                <span className="p-2 text-white font-medium">Primary Light (#4A4A4A)</span>
              </div>
              <div className="h-20 bg-neutral-black rounded-md flex items-end">
                <span className="p-2 text-white font-medium">Primary Dark (#000000)</span>
              </div>
            </div>
          </div>
          
          {/* Accent Colors - Reds */}
          <div className="p-4 rounded-md">
            <h3 className="text-lg font-medium mb-2">Accent (Red)</h3>
            <div className="flex flex-col space-y-2">
              <div className="h-20 bg-accent rounded-md flex items-end">
                <span className="p-2 text-accent-foreground font-medium">Accent (#d71920)</span>
              </div>
              <div className="h-20 bg-accent-light rounded-md flex items-end">
                <span className="p-2 text-white font-medium">Accent Light (#FF5A5F)</span>
              </div>
              <div className="h-20 bg-accent-dark rounded-md flex items-end">
                <span className="p-2 text-white font-medium">Accent Dark (#B71419)</span>
              </div>
            </div>
          </div>
          
          {/* Secondary - Whites/Grays */}
          <div className="p-4 rounded-md">
            <h3 className="text-lg font-medium mb-2">Secondary (White/Grays)</h3>
            <div className="flex flex-col space-y-2">
              <div className="h-20 bg-secondary border border-neutral-lightgray rounded-md flex items-end">
                <span className="p-2 text-secondary-foreground font-medium">Secondary (#FFFFFF)</span>
              </div>
              <div className="h-20 bg-neutral-offwhite border border-neutral-lightgray rounded-md flex items-end">
                <span className="p-2 text-black font-medium">Off-White (#F4F4F5)</span>
              </div>
              <div className="h-20 bg-neutral-lightgray rounded-md flex items-end">
                <span className="p-2 text-black font-medium">Light Gray (#E6E6E6)</span>
              </div>
            </div>
          </div>
          
          {/* Neutral Colors */}
          <div className="p-4 rounded-md">
            <h3 className="text-lg font-medium mb-2">Neutral Colors</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="h-14 bg-neutral-white border border-neutral-lightgray rounded-md flex items-center justify-center">
                <span className="text-sm font-medium">White</span>
              </div>
              <div className="h-14 bg-neutral-offwhite rounded-md flex items-center justify-center">
                <span className="text-sm font-medium">Off White</span>
              </div>
              <div className="h-14 bg-neutral-lightgray rounded-md flex items-center justify-center">
                <span className="text-sm font-medium">Light Gray</span>
              </div>
              <div className="h-14 bg-neutral-gray rounded-md flex items-center justify-center text-white">
                <span className="text-sm font-medium">Gray</span>
              </div>
              <div className="h-14 bg-neutral-darkgray rounded-md flex items-center justify-center text-white">
                <span className="text-sm font-medium">Dark Gray</span>
              </div>
              <div className="h-14 bg-neutral-darkergray rounded-md flex items-center justify-center text-white">
                <span className="text-sm font-medium">Darker Gray</span>
              </div>
              <div className="h-14 bg-neutral-black rounded-md flex items-center justify-center text-white">
                <span className="text-sm font-medium">Black</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Typography</h2>
        
        <div className="space-y-4 bg-white p-6 rounded-md shadow-sm">
          <div>
            <h1 className="font-heading text-4xl font-bold">Heading 1 (Inter)</h1>
            <div className="text-sm text-neutral-gray mt-1">
              font-size: 2.25rem (36px), font-weight: 700, line-height: 1.2
            </div>
          </div>
          
          <div>
            <h2 className="font-heading text-3xl font-semibold">Heading 2 (Inter)</h2>
            <div className="text-sm text-neutral-gray mt-1">
              font-size: 1.875rem (30px), font-weight: 600, line-height: 1.2
            </div>
          </div>
          
          <div>
            <h3 className="font-heading text-2xl font-semibold">Heading 3 (Inter)</h3>
            <div className="text-sm text-neutral-gray mt-1">
              font-size: 1.5rem (24px), font-weight: 600, line-height: 1.2
            </div>
          </div>
          
          <div>
            <h4 className="font-heading text-xl font-semibold">Heading 4 (Inter)</h4>
            <div className="text-sm text-neutral-gray mt-1">
              font-size: 1.25rem (20px), font-weight: 600, line-height: 1.2
            </div>
          </div>
          
          <div>
            <p className="font-body text-base">Body Text (Inter): The quick brown fox jumps over the lazy dog.</p>
            <div className="text-sm text-neutral-gray mt-1">
              font-size: 1rem (16px), font-weight: 400, line-height: 1.5
            </div>
          </div>
          
          <div>
            <p className="font-body text-sm">Small Text (Inter): The quick brown fox jumps over the lazy dog.</p>
            <div className="text-sm text-neutral-gray mt-1">
              font-size: 0.875rem (14px), font-weight: 400, line-height: 1.5
            </div>
          </div>
          
          <div>
            <a href="#" className="text-accent hover:text-accent-dark transition-colors duration-fast">Link Text</a>
            <div className="text-sm text-neutral-gray mt-1">
              color: accent (red), hover: accent-dark, transition: 150ms
            </div>
          </div>
        </div>
      </section>
      
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Buttons</h2>
        
        <div className="flex flex-wrap gap-4 bg-white p-6 rounded-md shadow-sm">
          <button className="btn-primary px-4 py-2 rounded-sm">Primary Button (Black)</button>
          <button className="btn-secondary px-4 py-2 rounded-sm">Secondary Button (White)</button>
          <button className="btn-tertiary px-4 py-2 rounded-sm">Tertiary Button (Red)</button>
          
          <button className="bg-primary text-white px-4 py-2 rounded-sm hover:bg-neutral-black transition-colors duration-fast">
            Tailwind Black Button
          </button>
          
          <button className="bg-white text-primary border border-neutral-lightgray px-4 py-2 rounded-sm hover:bg-neutral-lightgray transition-colors duration-fast">
            Tailwind White Button
          </button>
          
          <button className="bg-accent text-white px-4 py-2 rounded-sm hover:bg-accent-dark transition-colors duration-fast">
            Tailwind Red Button
          </button>
          
          <button disabled className="btn-primary px-4 py-2 rounded-sm opacity-50 cursor-not-allowed">
            Disabled
          </button>
        </div>
      </section>
      
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Shadows & Borders</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-md shadow-xs">
            <p className="font-medium">Shadow XS</p>
            <p className="text-sm text-neutral-gray">0 1px 2px rgba(0,0,0,0.05)</p>
          </div>
          
          <div className="bg-white p-4 rounded-md shadow-sm">
            <p className="font-medium">Shadow SM</p>
            <p className="text-sm text-neutral-gray">0 1px 3px rgba(0,0,0,0.1)</p>
          </div>
          
          <div className="bg-white p-4 rounded-md shadow-md">
            <p className="font-medium">Shadow MD</p>
            <p className="text-sm text-neutral-gray">0 4px 6px rgba(0,0,0,0.1)</p>
          </div>
          
          <div className="bg-white p-4 rounded-md shadow-lg">
            <p className="font-medium">Shadow LG</p>
            <p className="text-sm text-neutral-gray">0 10px 15px rgba(0,0,0,0.1)</p>
          </div>
          
          <div className="bg-white p-4 rounded-md shadow-xl">
            <p className="font-medium">Shadow XL</p>
            <p className="text-sm text-neutral-gray">0 20px 25px rgba(0,0,0,0.1)</p>
          </div>
          
          <div className="bg-white p-4 rounded-md shadow-2xl">
            <p className="font-medium">Shadow 2XL</p>
            <p className="text-sm text-neutral-gray">0 25px 50px rgba(0,0,0,0.25)</p>
          </div>
        </div>
      </section>
      
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Form Elements</h2>
        
        <div className="bg-white p-6 rounded-md shadow-sm space-y-4">
          <div>
            <label htmlFor="sample-input" className="block mb-2 font-medium">Text Input</label>
            <input 
              type="text" 
              id="sample-input" 
              placeholder="Enter text here" 
              className="w-full max-w-md"
            />
            <div className="text-sm text-neutral-gray mt-1">
              Focus state: red accent border/ring
            </div>
          </div>
          
          <div>
            <label htmlFor="sample-select" className="block mb-2 font-medium">Select</label>
            <select 
              id="sample-select" 
              className="w-full max-w-md"
            >
              <option>Option 1</option>
              <option>Option 2</option>
              <option>Option 3</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="sample-textarea" className="block mb-2 font-medium">Text Area</label>
            <textarea 
              id="sample-textarea" 
              placeholder="Enter text here" 
              className="w-full max-w-md h-24"
            ></textarea>
          </div>
          
          <div className="flex items-center space-x-2">
            <input type="checkbox" id="sample-checkbox" />
            <label htmlFor="sample-checkbox">Checkbox</label>
          </div>
          
          <div className="flex items-center space-x-2">
            <input type="radio" id="sample-radio" name="radio-group" />
            <label htmlFor="sample-radio">Radio Button</label>
          </div>
        </div>
      </section>
      
      <section>
        <h2 className="text-2xl font-semibold mb-4">Spacing</h2>
        
        <div className="bg-white p-6 rounded-md shadow-sm">
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col items-center">
              <div className="bg-accent w-4 h-4"></div>
              <span className="text-sm text-neutral-gray mt-1">3xs (4px)</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-accent w-8 h-8"></div>
              <span className="text-sm text-neutral-gray mt-1">2xs (8px)</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-accent w-12 h-12"></div>
              <span className="text-sm text-neutral-gray mt-1">xs (12px)</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-accent w-16 h-16"></div>
              <span className="text-sm text-neutral-gray mt-1">sm (16px)</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-accent w-24 h-24"></div>
              <span className="text-sm text-neutral-gray mt-1">md (24px)</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-accent w-32 h-32"></div>
              <span className="text-sm text-neutral-gray mt-1">lg (32px)</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-accent w-48 h-48"></div>
              <span className="text-sm text-neutral-gray mt-1">xl (48px)</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HbadaStylesDemo;
