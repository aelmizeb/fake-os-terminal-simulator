 💻 Fake OS Terminal Simulator

This project is a customizable fake OS terminal simulator built with HTML, CSS, and JavaScript. It simulates terminal commands, animations, and outputs; perfect for tech demonstrations, storytelling, film props, educational purposes, or just for fun. Whether you're recreating hacker scenes for a short film, building interactive tutorials, or adding flair to your portfolio, this simulator offers an immersive and flexible experience with draggable windows, typing effects, progress animations, and theming options.

![screenshot](/assets/img/preview.gif)

**[Live Demo](https://aelmizeb.github.io/fake-os-terminal-simulator/)**

## ✨ Features

- Multiple draggable terminal windows
- Typed command animation
- Progress bar animations
- Custom output colors (success, error, warning, etc.)
- Configurable terminal size (`minHeight`, `width`)
- Automatic command execution queue
- JSON-based configuration (`os.json` and `terminal.json`)

## ⚙️ Configuration

### `os.json`

Defines the OS layout and terminal windows:

```json
{
  "terminals": [
    {
      "title": "Terminal 1",
      "x": 100,
      "y": 80,
      "minHeight": 500,
      "width": 700,
      "config": "terminal1.json"
    }
  ]
}
```


### `terminal1.json`

Contains the command sequence and behaviors:

```json
{
  "title": "Terminal 1",
  "minHeight": 500,
  "width": 700,
  "commands": [
    {
      "command": "sudo apt update",
      "animation": "progress",
      "progress": { "duration": 3000, "color": "yellow" }
    },
    {
      "command": "npm install",
      "animation": "progress",
      "progress": { "duration": 5000, "color": "#4caf50" }
    },
    {
      "command": "./start.sh",
      "animation": "type",
      "output": "Server running at http://localhost:3000",
      "outputColor": "success"
    }
  ]
}
```

## 🧪 Customization
- Modify terminal.json to change commands or behavior
- Add more terminal configurations in os.json
- Use your own icons or wallpapers for background

## 🧩 To-Do
- Fullscreen toggle

## 📄 License
MIT License © 2025 Abdellatif EL MIZEB
