# 🌐 Cyberpunk Developer Portfolio

A highly interactive, immersive, and visually stunning developer portfolio built with React, Vite, TailwindCSS, and GSAP. Designed with a sleek "Cyberpunk OS / Terminal" aesthetic to stand out and showcase projects dynamically.

![Portfolio Preview](./public/avatar.png) <!-- Update this with an actual screenshot of the portfolio later -->

## 🚀 Features

- **Immersive Boot Sequence**: A high-tech "Biometric Retina Scanner" animation using GSAP that transitions smoothly into the main site.
- **Cyberpunk UI System**: Custom-built UI components including glowing terminal borders, scanning scanlines, glitch effects, and CRT flicker.
- **Dynamic Project Showcase**: A detailed projects section with interactive hover cards that expand into full-screen "holographic" modals for deep dives into tech stacks and architectures.
- **Holographic Resume Viewer**: An integrated modal that mimics a secure clearance check before displaying the user's PDF resume via an iframe, complete with a direct download link.
- **Functional Contact Terminal**: A fully operational contact form connected to EmailJS, featuring realistic "encryption" loading animations and simulated keystroke interception.

## 🛠️ Technology Stack

- **Framework**: React 18 + Vite
- **Styling**: TailwindCSS + Vanilla CSS (for custom keyframe animations and variables)
- **Animations**: GSAP (GreenSock Animation Platform) + ScrollTrigger
- **Icons**: Lucide React
- **Email Delivery**: EmailJS
- **Typography**: React Type Animation

## ⚙️ Local Development Setup

To run this project locally, follow these steps:

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/portfolio.git
   cd portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment Variables**
   The Contact section requires an EmailJS account to function. 
   - Rename `.env.example` to `.env` or `.env.local`.
   - Create a free account at [EmailJS](https://www.emailjs.com/) and fill in your keys:
   ```env
   VITE_EMAILJS_SERVICE_ID=your_service_id
   VITE_EMAILJS_TEMPLATE_ID=your_template_id
   VITE_EMAILJS_PUBLIC_KEY=your_public_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 📁 Project Structure

- `src/components/`: Reusable UI elements (e.g., BootSequence).
- `src/sections/`: Major page sections (Hero, About, Work, Skills, Contact).
- `src/index.css`: Global CSS containing the core cyberpunk design system, custom properties, and keyframe animations.

## 📄 License

This project is open-source and available under the MIT License. Feel free to use it as inspiration for your own portfolio!
