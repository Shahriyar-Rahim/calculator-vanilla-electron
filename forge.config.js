module.exports = {
  packagerConfig: {
    name: "Scientific Calculator",
    executableName: "scientific_calculator",
    icon: "./assets/icon", // Forge automatically appends .ico, .icns, or .png depending on platform
    asar: true,
  },
  makers: [
    // --- Linux Makers ---
    {
      name: "@electron-forge/maker-deb",
      config: {
        options: {
          maintainer: "Md. Shahriyar Rahim",
          homepage: "https://github.com/Shahriyar-Rahim",
          icon: "./assets/icon.png",
          categories: ["Utility", "Education", "Science"],
          section: "utils",
          priority: "optional",
        },
      },
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: ["linux"],
    },

    // --- Windows Makers ---
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        name: "ScientificCalculator",
        setupIcon: "./assets/icon.ico",
      },
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: ["win32"],
    },

    // --- macOS Makers ---
    {
      name: "@electron-forge/maker-dmg",
      config: {
        name: "ScientificCalculator",
        format: "ULFO",
        // Omit icon key if icon.icns is missing to prevent ENOENT errors
      },
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin"],
    },
  ],
};
