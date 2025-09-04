document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById("commandInput");
    const output = document.getElementById("output");
    const terminal = document.getElementById("terminal-container");
    const hint = document.getElementById("autocompleteHint");
    const mirror = document.getElementById("inputMirror");

    let commandHistory = [];
    let historyIndex = -1;

    const helpMessage = `
    <b>💻 System Commands:</b><br>
    <b>help or h</b>        - Show available commands<br>
    <b>clear or cls</b>       - Clear the terminal<br>
    <b>neofetch or fetch</b>    - Display system info (Arch Linux style)<br>
    <br>
    <b>👤 Personal Information:</b><br>
    <b>whoami</b>      - Display my identity<br>
    <b>skills</b>      - Show my technical skills<br>
    <b>projects</b>    - List my featured projects<br>
    <b>certifications</b>      - Display my certifications<br>
    <b>soft skills</b>      - Show my management/soft skills<br>
    <br>
    <b>🌐 Online Profiles:</b><br>
    <b>linkedin or ln</b>    - Open my LinkedIn profile<br>
    <b>github or gh</b>      - Open my GitHub profile<br>
    <br>
    <b>📄 Documents:</b><br>
    <b>resume or r</b>      - Download my resume<br>
    `;

    const commands = {
        help: helpMessage,
        neofetch: () => {
            let currentTime = new Date().toLocaleTimeString();
            return `<pre>
                    <span class="green">        .-"      "-.   </span> User: hiradshowghi
                    <span class="green">      /,  .-.  .-. ,\\ </span>  OS: Windows 11
                    <span class="green">      \\ )(_o/  \\o_)( /</span>  Hostname: CYBERXODA
                    <span class="green">      |/     /\\     \\|</span>  Time: ${currentTime}
                    <span class="green">      (_     ^^     _)</span>  Email: <a href="mailto:hiradshowghi@gmail.com" class="custom-link">hiradshowghi@gmail.com</a>
                    <span class="green">       \\__|IIIIII|__/ </span>  GitHub: <a href="https://github.com/hiradshowghi" target="_blank" class="custom-link">https://github.com/hiradshowghi</a>
                    <span class="green">        | \\IIIIII/ |  </span>  LinkedIn: <a href="https://linkedin.com/in/hiradshowghis" target="_blank" class="custom-link">linkedin.com/in/hiradshowghis</a>
                    <span class="green">        \\          /  </span>  Role: Aspiring SOC Analyst
                    <span class="green">         \`--------\`   </span>  
            </pre>`;
        },

        github: () => {
            window.open("https://github.com/hiradshowghi", "_blank");
            return `Opening <a href="https://github.com/hiradshowghi" target="_blank" class="custom-link">GitHub/hiradshowghi</a>...`;
        },

        linkedin: () => {
            window.open("https://linkedin.com/in/hiradshowghis", "_blank");
            return `Opening <a href="https://linkedin.com/in/hiradshowghis" target="_blank" class="custom-link">LinkedIn/hiradshowghis</a>...`;
        },

        blog: () => {
            window.open("https://medium.com/@hiradshowghi", "_blank");
            return `Opening <a href="https://medium.com/@hiradshowghi" target="_blank" class="custom-link">Medium/@hiradshowghi</a>...`;
        },


        projects: `
        - 🛡️ Threat Hunting Dashboard: Developed a Python-based dashboard using Elastic Stack to collect, analyze, and visualize Windows Event Logs and Sysmon telemetry for threat detection and MITRE ATT&CK-based attack simulations.<br>
        - ☁️ Personal Cloud Infrastructure Deployment (AWS): Built a containerized web application on AWS ECS with secure networking, CI/CD pipelines, monitoring, and automated threat detection.<br>
        - 💱 Currency Exchange: Created a secure web application using JavaScript, HTML/CSS, Node.js, and SQLite, integrated with ExchangeRate API, supporting role-based access for users and admins.<br>
        - ♟️ AI Chess Engine: Built a Python chess engine with Minimax and Alpha-Beta Pruning algorithms, implementing strategic gameplay, endgame knowledge, and a graphical interface using Tkinter.<br>
        `,


        certifications: `
        - COMPTIA - Security+<br>
        - COMPTIA - Network+<br>
        - Coming Soon: Azure 900<br>
        `,

        skills: `
        - 💻 Languages: Python, Java, JavaScript, C/C++, SQL, HTML/CSS, Bash<br>
        - 🛠️ Frameworks & Libraries: Node.js, D3.js, SQLite, MongoDB, Pygame, NumPy, MITRE ATT&CK, NIST CSF, Cyber Kill Chain<br>
        - 📊 SIEM & Security Tools: Splunk, Elastic Stack, Wireshark, Sysmon<br>
        - 🕹️ Developer Tools: Git, VS Code, Visual Studio, PyCharm, IntelliJ, Eclipse, Docker<br>
        - 🌐 Networking: TCP/IP, DNS, HTTP/HTTPS, VPNs, Firewalls<br>
        - ☁️ Cloud Platforms & OS: AWS, Azure, Oracle Cloud, Linux, Windows
        `,
        softskills: `
        - Rapid learner with the ability to adapt to new technologies and challenges<br>
        - Strong written and verbal communication skills<br>
        - Positive attitude and collaborative mindset<br>
        - Fluent in English and Farsi<br>
        - Analytical problem-solver with attention to detail<br>
        - Fun facts: i'm left-handed, play basketball, and love the gym
        `,
        whoami: `
        [+] Identity: 
        <a href="https://www.linkedin.com/in/hiradshowghis/" class="custom-link" target="_blank">
            Hirad Showghi
        </a> <br>
        [+] Role: Aspiring Cybersecurity Professional <br>
        [+] Access: Granted ✅
        `,

        resume: () => {
            const link = document.createElement("a");
            link.href = "CBSResume - Hirad Showghi.pdf";
            link.download = "Hirad_Resume.pdf";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            return "Downloading resume...";
        },

        clear: () => resetTerminal(),
        exit: () => resetTerminal(),
    };

    const aliases = {
        gh: "github",
        ln: "linkedin",
        r: "resume",
        cls: "clear",
        h: "help",
        fetch: "neofetch"
    };

    const commandList = Object.keys(commands).concat(Object.keys(aliases));

    function processCommand(cmd) {
        cmd = cmd.toLowerCase();
        if (cmd === "") {
            output.scrollTop = output.scrollHeight;
            return;
        }

        commandHistory.push(cmd);
        historyIndex = commandHistory.length;

        if (aliases[cmd]) cmd = aliases[cmd];

        if (cmd === "clear" || cmd === "exit") {
            resetTerminal();
            return;
        }

        let response = typeof commands[cmd] === "function" ? commands[cmd]() : commands[cmd] || getClosestCommand(cmd);
        appendCommand(cmd, response);
    }

    function resetTerminal() {
        output.innerHTML = `<div class="help-message">Type 'help' to see available commands.</div>`;
        input.value = "";
        hint.textContent = "";
    }

    function appendCommand(command, result) {
        let commandLine = document.createElement("div");
        commandLine.classList.add("command-line");
        commandLine.innerHTML = `<span class="prompt">λ</span> ${command}`;
        output.appendChild(commandLine);

        let resultLine = document.createElement("div");
        resultLine.classList.add("command-result");
        resultLine.innerHTML = result;
        output.appendChild(resultLine);

        input.scrollIntoView({ behavior: "smooth" });
    }


    function getClosestCommand(inputCmd) {
        let closestMatch = commandList.find(cmd => cmd.startsWith(inputCmd));
        return closestMatch ? `Did you mean <b>${closestMatch}</b>?` : `Command not found: ${inputCmd}`;
    }

    function updateAutocompleteHint() {
        let currentInput = input.value;
        if (!currentInput) {
            hint.textContent = "";
            return;
        }
        let match = commandList.find(cmd => cmd.startsWith(currentInput));
        if (match) {
            hint.textContent = match.slice(currentInput.length);
            mirror.textContent = currentInput;
            hint.style.left = (mirror.offsetWidth + 10) + "px";
        } else {
            hint.textContent = "";
        }
    }

    function autocompleteCommand() {
        let currentInput = input.value;
        if (!currentInput) return;
        let match = commandList.find(cmd => cmd.startsWith(currentInput));
        if (match) input.value = match;
        hint.textContent = "";
    }

    function createCommandBar() {
        const bar = document.getElementById("command-bar");

        // 👇 Put commands in the exact order you want the buttons to appear
        const customOrder = [
            "skills",
            "softskills",
            "projects",
            "blog",
            "certifications",
            "neofetch",
            "resume",
            "help",
            "linkedin",
            "exit",
            "github",
            "whoami"
        ];

        customOrder.forEach(cmd => {
            if (commands[cmd]) {   // ✅ Only make buttons for defined commands
                const button = document.createElement("button");
                button.textContent = cmd;
                button.dataset.cmd = cmd;
                button.addEventListener("click", () => {
                    processCommand(cmd);
                });
                bar.appendChild(button);
            }
        });
    }


    input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            processCommand(input.value.trim());
            input.value = "";
            hint.textContent = "";
        } else if (event.key === "ArrowRight" || event.key === "Tab") {
            event.preventDefault();
            autocompleteCommand();
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                input.value = commandHistory[historyIndex];
            }
        } else if (event.key === "ArrowDown") {
            event.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                input.value = commandHistory[historyIndex];
            } else {
                historyIndex = commandHistory.length;
                input.value = "";
            }
        }
    });

    input.addEventListener("input", updateAutocompleteHint);

    terminal.addEventListener("click", function () {
        input.focus();
    });

    resetTerminal();
    createCommandBar();
});
