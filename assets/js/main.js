async function loadJSON(file) {
  const res = await fetch(file);
  return res.json();
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runCommand(cmd, body, config) {
  const cmdLine = document.createElement('div');
  cmdLine.textContent = `> ${cmd.command}`;
  body.appendChild(cmdLine);

  if (cmd.animation === 'type') {
    const outputLine = document.createElement('div');
    outputLine.className = `output-line output-${cmd.outputColor || 'success'}`;
    body.appendChild(outputLine);

    let output = '';
    const cursorSpan = document.createElement('span');
    cursorSpan.className = 'blinking-cursor';
    cursorSpan.textContent = '|';

    for (let i = 0; i < cmd.output.length; i++) {
      await wait(40);
      output += cmd.output[i];

      // Update output with or without cursor
      outputLine.innerHTML = config.showCursor
        ? output + cursorSpan.outerHTML
        : output;
    }

    if (config.showCursor) {
      // Remove cursor after animation
      await wait(500);
      outputLine.innerHTML = output;
    }
  }

  else if (cmd.animation === 'progress') {
    const bar = document.createElement('div');
    bar.style.background = cmd.progress.color || '#61afef';
    bar.style.width = '0%';
    bar.style.height = '10px';
    bar.style.marginTop = '5px';
    bar.style.transition = `width ${cmd.progress.duration}ms linear`;

    body.appendChild(bar);
    await wait(100); // Allow DOM to render bar
    bar.style.width = '100%';

    await wait(cmd.progress.duration + 300); // Wait for animation to complete
  }
}

function enableDrag(element, handle) {
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  handle.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - element.offsetLeft;
    offsetY = e.clientY - element.offsetTop;
    document.body.style.userSelect = 'none';
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    element.style.left = `${e.clientX - offsetX}px`;
    element.style.top = `${e.clientY - offsetY}px`;
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    document.body.style.userSelect = '';
  });
}

async function createTerminalWindow(config, position) {
  const terminal = document.createElement('div');
  terminal.className = 'terminal';
  terminal.style.left = `${position.x}px`;
  terminal.style.top = `${position.y}px`;

  if (config.minHeight) {
    terminal.style.minHeight = `${config.minHeight}px`;
  }

  if (config.width) {
    terminal.style.width = typeof config.width === 'number' ? `${config.width}px` : config.width;
  }

  // Header
  const header = document.createElement('div');
  header.className = 'terminal-header';

  const title = document.createElement('div');
  title.className = 'terminal-title';
  title.textContent = config.title || 'Terminal';

  const buttons = document.createElement('div');
  buttons.className = 'terminal-buttons';
  ['close', 'minimize', 'maximize'].forEach(type => {
    const btn = document.createElement('div');
    btn.className = `terminal-button ${type}`;
    buttons.appendChild(btn);
  });

  header.appendChild(title);
  header.appendChild(buttons);

  // Body
  const body = document.createElement('div');
  body.className = 'terminal-body';

  terminal.appendChild(header);
  terminal.appendChild(body);
  document.getElementById('desktop').appendChild(terminal);

  enableDrag(terminal, header);

  // Run commands sequentially
  for (const cmd of config.commands) {
    await runCommand(cmd, body, config);
  }
}

window.onload = async () => {
  const os = await loadJSON('./config/os.json');
  document.getElementById('desktop').style.backgroundImage = `url(${os.background})`;

  for (const term of os.terminals) {
    const config = await loadJSON(term.file);
    createTerminalWindow(config, { x: term.x, y: term.y });
  }

  if (os.icons) {
    os.icons.forEach(icon => createDesktopIcon(icon));
  }
};

function createDesktopIcon(icon) {
  const iconEl = document.createElement('div');
  iconEl.className = 'desktop-icon';
  iconEl.style.left = `${icon.x}px`;
  iconEl.style.top = `${icon.y}px`;

  const img = document.createElement('img');
  img.src = icon.icon;

  const label = document.createElement('span');
  label.textContent = icon.name;

  iconEl.appendChild(img);
  iconEl.appendChild(label);

  iconEl.onclick = () => {
    fetch(icon.launch)
      .then(res => res.json())
      .then(data => {
        createTerminalWindow(data, { x: icon.x + 100, y: icon.y });
      });
  };

  document.getElementById('desktop').appendChild(iconEl);
}
