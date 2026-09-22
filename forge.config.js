module.exports = {
  packagerConfig: {
    name: "Scientific Calculator",
    executableName: "scientific_calculator",
    icon: "./assets/icon",
    asar: true,
  },
  makers: [
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

    // --- Windows Makers (.exe Installer & Portable Zip) ---
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

    // --- macOS Makers (.dmg Installer & Zip) ---
    {
      name: "@electron-forge/maker-dmg",
      config: {
        name: "ScientificCalculator",
        icon: "./assets/icon.icns",
        format: "ULFO",
      },
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin"],
    },
  ],
};
