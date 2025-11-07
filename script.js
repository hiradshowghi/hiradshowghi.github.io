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
                    <span class="green">      /,  .-.  .-. ,\\ </span>  OS: Linux
                    <span class="green">      \\ )(_o/  \\o_)( /</span>  Hostname: CYBERX
                    <span class="green">      |/     /\\     \\|</span>  Time: ${currentTime}
                    <span class="green">      (_     ^^     _)</span>  Email: <a href="mailto:hiradshowghi@gmail.com" class="custom-link">hiradshowghi@gmail.com</a>
                    <span class="green">       \\__|IIIIII|__/ </span>  GitHub: <a href="https://github.com/hiradshowghi" target="_blank" class="custom-link">https://github.com/hiradshowghi</a>
                    <span class="green">        | \\IIIIII/ |  </span>  LinkedIn: <a href="https://linkedin.com/in/hiradshowghis" target="_blank" class="custom-link">linkedin.com/in/hiradshowghis</a>
                    <span class="green">        \\          /  </span>  Role: Aspiring SOC Analyst
                    <span class="green">         \`--------\`   </span>  
            </pre>`;
        },

        github: () => {
            window.open("https://github.com/hiradshowgh", "_blank");
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
        - 🛡️ Threat Hunting Dashboard: Built a detection environment using Python, Elastic Stack, and Sysmon telemetry to identify privilege escalation and lateral movement. Visualized attack patterns through MITRE ATT&CK–aligned Kibana dashboards.<br>
        - ☁️ Personal Cloud Infrastructure Deployment (AWS): Designed and deployed a containerized web app on AWS ECS with secure VPC architecture, IAM-based access control, CI/CD pipelines, and threat monitoring using GuardDuty and CloudWatch.<br>
        - 🧩 Network-Wide Ad Blocking Server (Ubuntu + AdGuard Home): Developed a home lab DNS filtering system that blocks ads and malicious domains across all devices, improving network privacy and security.<br>
        - 🤖 Local Offline AI Security Assistant: Integrated a locally hosted GPT model to manage system tasks, analyze logs, and demonstrate privacy-first AI deployment without external data exposure.<br>
        `,


        certifications: `
        - COMPTIA - Security+<br>
        - COMPTIA - Network+<br>
        - Next step: Azure 900<br>
        `,

        skills: `
        - 💻 Languages: Python, Bash, Java, JavaScript, C/C++, SQL, HTML/CSS<br>
        - 🧠 Frameworks & Methodologies: MITRE ATT&CK, NIST CSF, Cyber Kill Chain, Incident Response Lifecycle<br>
        - 📊 SIEM & Security Tools: Elastic Stack, Splunk, Wireshark, Sysmon, Nmap, Nessus, AdGuard Home<br>
        - 🛠️ Developer & Automation Tools: Git, GitHub, Docker, PowerShell, VirtualBox, VMware<br>
        - 🌐 Networking & Protocols: TCP/IP, DNS, DHCP, HTTP/HTTPS, VPNs, Firewalls, Proxy, SSH<br>
        - ☁️ Cloud & Operating Systems: AWS, Azure, Ubuntu, Windows, macOS<br>
        `,

        softskills: `
        - Rapid learner with the ability to adapt to new technologies and challenges<br>
        - Strong written and verbal communication skills<br>
        - Positive attitude and collaborative mindset<br>
        - Fluent in English and Farsi<br>
        - Analytical problem-solver with attention to detail<br>
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
            link.href = "HiradResume.pdf";
            link.download = "HiradResume.pdf";
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
