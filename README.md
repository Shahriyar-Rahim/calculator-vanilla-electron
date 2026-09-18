# 🧮 Scientific Calculator Desktop App

[![Latest Release](https://img.shields.io/github/v/release/ShahriyarRahim/scientific_calculator?label=version&color=blue)](https://github.com/Shahriyar-Rahim/calculator-vanilla-electron/releases)
[![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)](https://opensource.org/licenses/ISC)
[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20Linux-lightgrey.svg)](#)

A native, lightweight, and feature-rich scientific calculator built with **Electron**. Designed for efficiency with a modern UI, keyboard support, and advanced mathematical functions.

---

## 📸 Screenshots

|            Light Mode             |           Dark Mode            |
| :-------------------------------: | :----------------------------: |
| ![Light Mode](/assets//light.png) | ![Dark Mode](/assets/dark.png) |

> _Sample picture after a successfull trial_

---

## ✨ Features

- **Advanced Math Functions**: Trigonometry (sin, cos, tan), Inverse Trigonometry (asin, acos, atan), Logarithms, Square Roots, and Powers.
- **Calculus & Tools**: Basic integration (∫dx), differentiation (d/dx), absolute values (|x|), and summation (∑).
- **Dual Modes**: Switch between **Degree (DEG)** and **Radian (RAD)** modes.
- **Shift Mode**: Access secondary functions easily.
- **History Management**: Keep track of your previous calculations.
- **Themes**: Toggle between beautiful **Light** and **Dark** modes.
- **Audio Feedback**: Optional sound effects for button presses (can be muted).
- **Clipboard Integration**: Copy results or paste values directly.
- **Keyboard Support**: Fully navigable via keyboard for power users.

---

## 📥 Download & Installation

### Standard Installation

1.  Go to the [Releases](https://github.com/ShahriyarRahim/scientific_calculator/releases) page.
2.  Download the latest version for your OS:
    - **Windows**: `.exe` installer or `.zip` portable.
    - **Linux**: `.deb` package or `.AppImage`.

### Snap Store (Linux)

The application is available on the Snap Store. You can install it using:

```bash
sudo snap install scientific-calculator
```

---

## 📖 How to Use

- **Basic Calculations**: Click the numbers and operators or use your keyboard.
- **Scientific Functions**: Use the buttons for `sin`, `cos`, `log`, etc.
- **Shift Mode**: Click the **Shift** button to access secondary functions like `sin⁻¹`, `abs`, and calculus tools (`∫dx`, `d/dx`).
- **History**: Click the clock icon (top right) or press `H` to view your calculation history. Click any history item to bring it back to the display.
- **Theme**: Click the ☀️/🌙 icon to switch between light and dark modes.

---

## 🤝 Contributing & Development

We welcome contributions! To help improve this project:

### 1. Fork and Clone

1.  **Fork** the repository by clicking the "Fork" button at the top right.
2.  Clone your fork locally:
    ```bash
    git clone https://github.com/YOUR_USERNAME/scientific_calculator.git
    cd scientific_calculator
    ```

### 2. Setup Environment

Ensure you have [Node.js](https://nodejs.org/) installed.

```bash
# Install dependencies
npm install

# Run the app in development mode
npm start
```

### 3. Make Changes and Submit

1.  Create a new branch: `git checkout -b feature-name`.
2.  Commit changes: `git commit -m "Add some feature"`.
3.  Push: `git push origin feature-name`.
4.  Open a **Pull Request**.

---

## 🛠️ Production & Building

To package the application for production:

### Windows

```bash
npm run package-win
```

### Linux

```bash
npm run package-linux
```

### Snap Package (Linux)

To build the snap package, ensure you have `snapcraft` installed:

1.  Package the app for Linux first: `npm run package-linux`.
2.  Build the snap:
    ```bash
    snapcraft
    ```

This will generate a `.snap` file in the root directory.

### Create Installers (via Electron Forge)

```bash
npm run make
```

Installers will be generated in the `out/make` directory.

---

## ⌨️ Keyboard Shortcuts

| Key                | Action                  |
| :----------------- | :---------------------- |
| `0-9` / `.`        | Input Numbers / Decimal |
| `+`, `-`, `*`, `/` | Basic Operators         |
| `^`                | Power (x^y)             |
| `Enter` / `=`      | Calculate Result        |
| `Backspace`        | Delete Last Digit       |
| `Esc`              | Clear All               |
| `(` / `)`          | Parentheses             |
| `S`, `C`, `T`      | Sin, Cos, Tan           |
| `R`                | Square Root             |
| `L`                | Logarithm               |
| `P`                | Pi (π)                  |
| `H`                | Toggle History          |
| `Ctrl + C`         | Copy Result             |
| `Ctrl + V`         | Paste Value             |

---

## 📦 Project Structure

- `main.js`: Main process configuration and window management.
- `preload.js`: Secure bridge between the main process and renderer.
- `renderer/`: Contains the UI logic, styles, and HTML.
- `assets/`: Icons and application images.
- `forge.config.js`: Configuration for Electron Forge packaging.

---

## 📄 License

This project is licensed under the **ISC License**.

---

## 👨‍💻 Author

**Md. Shahriyar Rahim**

- GitHub: [@ShahriyarRahim](https://github.com/ShahriyarRahim)
