# 🧮 Scientific Calculator Desktop App

[![Version](https://img.shields.io/badge/version-1.0.2-blue.svg)](https://github.com/ShahriyarRahim/scientific_calculator/releases)
[![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)](https://opensource.org/licenses/ISC)
[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20Linux-lightgrey.svg)](#)

A native, lightweight, and feature-rich scientific calculator built with **Electron**. Designed for efficiency with a modern UI, keyboard support, and advanced mathematical functions.

---

## 📸 Screenshots

| Light Mode | Dark Mode |
| :---: | :---: |
| ![Light Mode](/assets//light.png) | ![Dark Mode](/assets/dark.png) |

> *Replace these placeholders with your actual screenshots located in `assets/` or hosted online.*

---

## ✨ Features

-   **Advanced Math Functions**: Trigonometry (sin, cos, tan), Inverse Trigonometry (asin, acos, atan), Logarithms, Square Roots, and Powers.
-   **Calculus & Tools**: Basic integration (∫dx), differentiation (d/dx), absolute values (|x|), and summation (∑).
-   **Dual Modes**: Switch between **Degree (DEG)** and **Radian (RAD)** modes.
-   **Shift Mode**: Access secondary functions easily.
-   **History Management**: Keep track of your previous calculations.
-   **Themes**: Toggle between beautiful **Light** and **Dark** modes.
-   **Audio Feedback**: Optional sound effects for button presses (can be muted).
-   **Clipboard Integration**: Copy results or paste values directly.
-   **Keyboard Support**: Fully navigable via keyboard for power users.

---

## 🚀 Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (LTS recommended)
-   npm (comes with Node.js)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/ShahriyarRahim/scientific_calculator.git
    cd scientific_calculator
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Run the application:
    ```bash
    npm start
    ```

---

## 🛠️ Production & Building

To package the application for production, use the following commands:

### For Windows
```bash
npm run package-win
```

### For Linux
```bash
npm run package-linux
```

### Create Installers (via Electron Forge)
```bash
npm run make
```
Installers will be generated in the `out/make` directory.

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
| :--- | :--- |
| `0-9` / `.` | Input Numbers / Decimal |
| `+`, `-`, `*`, `/` | Basic Operators |
| `^` | Power (x^y) |
| `Enter` / `=` | Calculate Result |
| `Backspace` | Delete Last Digit |
| `Esc` | Clear All |
| `(` / `)` | Parentheses |
| `S`, `C`, `T` | Sin, Cos, Tan |
| `R` | Square Root |
| `L` | Logarithm |
| `P` | Pi (π) |
| `H` | Toggle History |
| `Ctrl + C` | Copy Result |
| `Ctrl + V` | Paste Value |

---

## 📦 Project Structure

-   `main.js`: Main process configuration and window management.
-   `preload.js`: Secure bridge between the main process and renderer.
-   `renderer/`: Contains the UI logic, styles, and HTML.
-   `assets/`: Icons and application images.
-   `forge.config.js`: Configuration for Electron Forge packaging.

---

## 📄 License

This project is licensed under the **ISC License**.

---

## 👨‍💻 Author

**Md. Shahriyar Rahim**
-   GitHub: [@ShahriyarRahim](https://github.com/ShahriyarRahim)
