import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingCart, Heart, Check, AlertCircle } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import AnimatedButton from '../components/AnimatedButton';

const AnimationDemoPage: React.FC = () => {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleLoadingDemo = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <motion.h1 
        className="text-4xl font-heading font-bold text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Animation & Visual Enhancements Demo
      </motion.h1>

      {/* Page Transitions Section */}
      <ScrollReveal>
        <section className="mb-16">
          <h2 className="text-2xl font-heading font-bold mb-6 text-black">Page Transitions</h2>
          <p className="mb-4 text-gray-700">
            All pages now have smooth transitions when navigating between them. This creates a more fluid and polished user experience.
          </p>
          <div className="bg-gray-100 p-6 rounded-lg">
            <div className="text-center">
              <p className="text-gray-600 mb-4">Page transition demo:</p>
              <motion.div
                className="w-full h-40 bg-white rounded-lg shadow-md flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-xl text-black font-heading">Page Content</p>
              </motion.div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Animated Buttons Section */}
      <ScrollReveal delay={0.2}>
        <section className="mb-16">
          <h2 className="text-2xl font-heading font-bold mb-6 text-black">Enhanced Buttons</h2>
          <p className="mb-4 text-gray-700">
            Buttons now have subtle animations that provide visual feedback and make the interface feel more responsive.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-heading font-semibold mb-4 text-gray-800">Primary Buttons</h3>
              <div className="space-y-4">
                <AnimatedButton variant="primary" size="sm">Small Button</AnimatedButton>
                <AnimatedButton variant="primary">Medium Button</AnimatedButton>
                <AnimatedButton variant="primary" size="lg">Large Button</AnimatedButton>
                <AnimatedButton 
                  variant="primary" 
                  icon={<ShoppingCart className="h-5 w-5" />}
                >
                  With Icon
                </AnimatedButton>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-heading font-semibold mb-4 text-gray-800">Button Variants</h3>
              <div className="space-y-4">
                <AnimatedButton variant="primary">Primary</AnimatedButton>
                <AnimatedButton variant="secondary">Secondary</AnimatedButton>
                <AnimatedButton variant="accent">Accent</AnimatedButton>
                <AnimatedButton variant="outline">Outline</AnimatedButton>
                <AnimatedButton variant="ghost">Ghost</AnimatedButton>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-heading font-semibold mb-4 text-gray-800">Animation Levels</h3>
              <div className="space-y-4">
                <AnimatedButton variant="primary" animationLevel="subtle">Subtle Animation</AnimatedButton>
                <AnimatedButton variant="primary" animationLevel="medium">Medium Animation</AnimatedButton>
                <AnimatedButton variant="primary" animationLevel="playful">Playful Animation</AnimatedButton>
                <AnimatedButton 
                  variant="primary" 
                  loading={loading} 
                  onClick={handleLoadingDemo}
                >
                  {loading ? 'Loading...' : 'Loading State'}
                </AnimatedButton>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Micro-interactions Section */}
      <ScrollReveal delay={0.3} variant="fadeLeft">
        <section className="mb-16">
          <h2 className="text-2xl font-heading font-bold mb-6 text-black">Micro-interactions</h2>
          <p className="mb-4 text-gray-700">
            Small animations that provide feedback and delight users during their interactions with the interface.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-heading font-semibold mb-4 text-gray-800">Counter Animation</h3>
              <div className="flex items-center justify-center space-x-4">
                <motion.button
                  className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setCount(count - 1)}
                >
                  -
                </motion.button>
                <motion.div
                  key={count}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-2xl font-bold text-black"
                >
                  {count}
                </motion.div>
                <motion.button
                  className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setCount(count + 1)}
                >
                  +
                </motion.button>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-heading font-semibold mb-4 text-gray-800">Hover Effects</h3>
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  className="bg-gray-100 p-4 rounded-lg flex items-center justify-center cursor-pointer"
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: "#000000",
                    color: "white"
                  }}
                  transition={{ duration: 0.2 }}
                >
                  Hover Me
                </motion.div>
                <motion.div
                  className="bg-gray-100 p-4 rounded-lg flex items-center justify-center cursor-pointer"
                  whileHover={{
                    y: -5,
                    boxShadow: "0 10px 15px rgba(0, 0, 0, 0.1)"
                  }}
                  transition={{ duration: 0.2 }}
                >
                  Float Effect
                </motion.div>
                <motion.div
                  className="bg-gray-200 p-4 rounded-lg flex items-center justify-center cursor-pointer"
                  whileHover={{ rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  Rotate Effect
                </motion.div>
                <motion.div
                  className="border-2 border-black p-4 rounded-lg flex items-center justify-center cursor-pointer"
                  whileHover={{
                    scale: 1.05,
                    borderWidth: "4px",
                    margin: "-2px"
                  }}
                  transition={{ duration: 0.2 }}
                >
                  Border Effect
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Scroll Animations Section */}
      <ScrollReveal variant="stagger" staggerChildren={0.1}>
        <section className="mb-16">
          <h2 className="text-2xl font-heading font-bold mb-6 text-black">Scroll Animations</h2>
          <p className="mb-4 text-gray-700">
            Elements now animate as they enter the viewport, creating a dynamic and engaging scrolling experience.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Fade Up", variant: "fadeUp", icon: <ArrowRight className="h-6 w-6" /> },
              { title: "Fade In", variant: "fadeIn", icon: <ShoppingCart className="h-6 w-6" /> },
              { title: "Scale", variant: "scale", icon: <Heart className="h-6 w-6" /> },
              { title: "Fade Left", variant: "fadeLeft", icon: <Check className="h-6 w-6" /> },
              { title: "Fade Right", variant: "fadeRight", icon: <AlertCircle className="h-6 w-6" /> },
              { title: "Fade Down", variant: "fadeDown", icon: <ArrowRight className="h-6 w-6 transform rotate-90" /> }
            ].map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-center mb-4 text-black">
                  {item.icon}
                </div>
                <h3 className="font-heading font-semibold text-center mb-2 text-gray-800">{item.title}</h3>
                <p className="text-center text-gray-600 text-sm">
                  This card uses the {item.variant} animation when scrolled into view.
                </p>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* Conclusion Section */}
      <ScrollReveal variant="fadeUp">
        <section className="text-center">
          <h2 className="text-2xl font-heading font-bold mb-6 text-black">Enhanced User Experience</h2>
          <p className="mb-8 text-gray-700 max-w-2xl mx-auto">
            These animations and visual enhancements create a more engaging, responsive, and polished user experience
            throughout the SillaVida website.
          </p>
          <AnimatedButton 
            variant="primary" 
            size="lg" 
            icon={<ArrowRight className="h-5 w-5" />}
            iconPosition="right"
            onClick={() => window.history.back()}
          >
            Return to Previous Page
          </AnimatedButton>
        </section>
      </ScrollReveal>
    </div>
  );
};

export default AnimationDemoPage;
