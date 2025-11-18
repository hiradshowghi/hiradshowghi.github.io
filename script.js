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
    <b>experience or ex</b>      - Show my experience<br>
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
                    <span class="green">       \\__|IIIIII|__/ </span>  LinkedIn: <a href="https://linkedin.com/in/hiradshowghis" target="_blank" class="custom-link">linkedin.com/in/hiradshowghis</a>
                    <span class="green">        | \\IIIIII/ |  </span>  Role: SOC Analyst
                    <span class="green">        \\          /  </span>  
                    <span class="green">         \`--------\`   </span>  
            </pre>`;
        },

        education: `
        <strong>Carleton University</strong><br>
        B.Sc. Computer Science (2022 - expected may 2026)
        `,

        experience: `
        <strong>SOC Analyst — Auxillium (May 2025 – Present)</strong><br>
        • Monitor AWS logs, analyze traffic patterns, and apply detection rules to protect user data.<br>
        • Work with SIEM ingestion, WordPress security tools, and endpoint telemetry to strengthen threat detection skills.<br>
        • Support incident response and document risks, findings, and remediation steps.<br><br>

        <strong>Security Consultant — DCS Consulting Services (Jan 2025 – Apr 2025)</strong><br>
        • Assisted with SOC 2 Type II compliance through IT risk assessments and control validation.<br>
        • Helped improve annual audit processes and strengthen security governance.<br><br>

        <strong>Cybersecurity Everyday — Personal Blog (Aug 2025 – Present)</strong><br>
        • Share simple, beginner-friendly cybersecurity explanations and practical defensive concepts.<br>
        • Document hands-on labs and personal builds to reinforce learning and help others follow along.<br>
        `,

        linkedin: () => {
            window.open("https://linkedin.com/in/hiradshowghis", "_blank");
            return `Opening <a href="https://linkedin.com/in/hiradshowghis" target="_blank" class="custom-link">LinkedIn/hiradshowghis</a>...`;
        },

        blog: () => {
            window.open("https://medium.com/@hiradshowghi", "_blank");
            return `Opening <a href="https://medium.com/@hiradshowghi" target="_blank" class="custom-link">Medium/@hiradshowghi</a>...`;
        },


        projects: `
        <strong>🛡️ SOC Home Lab – Detection & Monitoring</strong> | Splunk, Sysmon, Windows, Linux<br>
        • Built a full SOC environment with Splunk + Sysmon, simulating attacks and creating MITRE-mapped detections.<br><br>

        <strong>🤖 Security Automation Lab</strong> | Linux, AdGuard Home, Python<br>
        • Created a secure sandbox with a local offline AI agent and deployed network-wide DNS filtering via AdGuard Home.<br><br>

        <strong>☁️ AWS Cloud Infrastructure Deployment</strong> | AWS, Docker, VPC, IAM<br>
        • Deployed a containerized web app on ECS with VPC isolation, IAM roles, encrypted S3, CI/CD, and cloud monitoring.<br></br>
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
        [+] Role: Cybersecurity Professional <br>
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
        ex: "experience",
        ln: "linkedin",
        r: "resume",
        cls: "clear",
        ed: "education",
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
            "experience",
            "resume",
            "education",
            "linkedin",
            "skills",
            "blog",
            "certifications",
            "neofetch",
            "projects",
            "exit",
            "softskills",
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
