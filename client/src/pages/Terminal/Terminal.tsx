import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

// Types
interface TerminalLine {
  id: string;
  type: 'command' | 'output' | 'error' | 'system';
  content: string;
  timestamp: Date;
  directory?: string;
}

interface Command {
  name: string;
  description: string;
  usage: string;
  aliases?: string[];
  handler: (args: string[]) => string | Promise<string>;
}

// Styled Components
const TerminalContainer = styled(motion.div)`
  min-height: 100vh;
  background: ${props => props.theme.colors.terminal.background};
  padding: 2rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(0, 255, 65, 0.03) 2px,
        rgba(0, 255, 65, 0.03) 4px
      );
    pointer-events: none;
    z-index: 1;
  }
`;

const TerminalWindow = styled.div`
  background: ${props => props.theme.colors.terminal.background};
  border: 2px solid ${props => props.theme.colors.accent.cyan};
  border-radius: 8px;
  box-shadow: 
    0 0 30px rgba(120, 219, 226, 0.3),
    inset 0 0 20px rgba(0, 0, 0, 0.5);
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
`;

const TerminalHeader = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  padding: 0.75rem 1rem;
  border-bottom: 1px solid ${props => props.theme.colors.accent.cyan};
  border-radius: 6px 6px 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const WindowControls = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ControlButton = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.color};
  box-shadow: 0 0 5px ${props => props.color}80;
`;

const TerminalTitle = styled.h3`
  color: ${props => props.theme.colors.accent.cyan};
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: '🔒';
    font-size: 1rem;
  }
`;

const TerminalStats = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  color: ${props => props.theme.colors.text.secondary};
`;

const TerminalContent = styled.div`
  height: 70vh;
  overflow-y: auto;
  padding: 1rem;
  font-family: ${props => props.theme.fonts.terminal};
  font-size: 0.9rem;
  line-height: 1.4;
  position: relative;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.background.secondary};
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.accent.cyan};
    border-radius: 3px;
  }
`;

const OutputLine = styled(motion.div)<{ lineType: string }>`
  margin-bottom: 0.5rem;
  color: ${props => {
    switch (props.lineType) {
      case 'command': return props.theme.colors.text.primary;
      case 'output': return props.theme.colors.terminal.text;
      case 'error': return props.theme.colors.terminal.error;
      case 'system': return props.theme.colors.terminal.warning;
      default: return props.theme.colors.text.primary;
    }
  }};
  white-space: pre-wrap;
  word-break: break-word;
`;

const Prompt = styled.span`
  color: ${props => props.theme.colors.terminal.prompt};
  font-weight: 600;
`;

const InputLine = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1rem;
`;

const TerminalInput = styled.input`
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.terminal.text};
  font-family: ${props => props.theme.fonts.terminal};
  font-size: 0.9rem;
  outline: none;
  flex: 1;
  padding: 0;
  margin-left: 0.5rem;
  
  &::placeholder {
    color: ${props => props.theme.colors.text.tertiary};
  }
`;

const Cursor = styled.span<{ visible: boolean }>`
  background: ${props => props.theme.colors.terminal.text};
  width: 8px;
  height: 1rem;
  display: inline-block;
  margin-left: 2px;
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity 0.1s ease;
`;

const SuggestionsList = styled.ul`
  background: ${props => props.theme.colors.background.secondary};
  border: 1px solid ${props => props.theme.colors.accent.cyan};
  border-radius: 4px;
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const SuggestionItem = styled.li<{ highlighted: boolean }>`
  padding: 0.5rem 1rem;
  color: ${props => props.highlighted ? props.theme.colors.background.primary : props.theme.colors.text.primary};
  background: ${props => props.highlighted ? props.theme.colors.accent.cyan : 'transparent'};
  cursor: pointer;
  border-bottom: 1px solid ${props => props.theme.colors.border.primary};

  &:last-child {
    border-bottom: none;
  }
`;

const Terminal: React.FC = () => {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [suggestionIndex, setSuggestionIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentDirectory, setCurrentDirectory] = useState('~');
  const [isOnline, setIsOnline] = useState(true);
  const [cursorVisible, setCursorVisible] = useState(true);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Cursor blinking effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [lines]);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // System initialization
  useEffect(() => {
    const initMessages = [
      'Initializing secure connection...',
      'Loading security modules...',
      'Establishing encrypted tunnel...',
      'Connection established.',
      '',
      '╔══════════════════════════════════════════════╗',
      '║          CYBERSEC PORTFOLIO TERMINAL         ║',
      '║                                              ║',
      '║  Welcome to the interactive command line     ║',
      '║  Type "help" for available commands          ║',
      '║  Type "skills" to see technical expertise    ║',
      '║  Type "projects" to browse security projects ║',
      '╚══════════════════════════════════════════════╝',
      '',
      'System online. Ready for commands.',
      ''
    ];

    let delay = 0;
    initMessages.forEach((message, index) => {
      setTimeout(() => {
        addLine('system', message);
      }, delay);
      delay += 200;
    });
  }, []);

  const addLine = useCallback((type: TerminalLine['type'], content: string) => {
    const newLine: TerminalLine = {
      id: Date.now().toString() + Math.random(),
      type,
      content,
      timestamp: new Date(),
      directory: currentDirectory
    };
    
    setLines(prev => [...prev, newLine]);
  }, [currentDirectory]);

  // Commands definition
  const commands: Record<string, Command> = {
    help: {
      name: 'help',
      description: 'Show available commands',
      usage: 'help [command]',
      handler: (args) => {
        if (args.length > 0) {
          const cmd = commands[args[0]];
          if (cmd) {
            return `${cmd.name} - ${cmd.description}\nUsage: ${cmd.usage}`;
          }
          return `Command '${args[0]}' not found. Type 'help' for available commands.`;
        }
        
        const commandList = Object.values(commands).map(cmd => 
          `  ${cmd.name.padEnd(15)} - ${cmd.description}`
        ).join('\n');
        
        return `Available commands:\n\n${commandList}\n\nType 'help <command>' for detailed usage.`;
      }
    },

    clear: {
      name: 'clear',
      description: 'Clear the terminal screen',
      usage: 'clear',
      handler: () => {
        setLines([]);
        return '';
      }
    },

    whoami: {
      name: 'whoami',
      description: 'Display current user information',
      usage: 'whoami',
      handler: () => {
        return `cybersec_expert@secure-terminal
        
Role: Cybersecurity Professional
Specialization: Red Team Operations, Penetration Testing
Clearance: CONFIDENTIAL
Status: ACTIVE
        
"In cybersecurity, the only constant is change.
 Stay vigilant, stay ahead."`;
      }
    },

    skills: {
      name: 'skills',
      description: 'Display technical skills and expertise',
      usage: 'skills [category]',
      handler: (args) => {
        const skillCategories = {
          'red-team': [
            'Advanced Persistent Threat (APT) Simulation',
            'Social Engineering & Phishing Campaigns',
            'Physical Security Assessments',
            'Custom Payload Development',
            'Post-Exploitation Techniques'
          ],
          'blue-team': [
            'Security Operations Center (SOC) Management',
            'Incident Response & Forensics',
            'Threat Hunting & Intelligence',
            'SIEM Configuration & Tuning',
            'Malware Analysis & Reverse Engineering'
          ],
          'tools': [
            'Metasploit Framework',
            'Burp Suite Professional',
            'Wireshark & Tshark',
            'Nmap & Masscan',
            'Cobalt Strike',
            'BloodHound & SharpHound',
            'PowerShell Empire',
            'Ghidra & IDA Pro'
          ],
          'programming': [
            'Python (Advanced)',
            'PowerShell (Expert)',
            'Bash/Shell Scripting',
            'C/C++ (Intermediate)',
            'Assembly (x86/x64)',
            'JavaScript/Node.js',
            'Go (Intermediate)',
            'Rust (Learning)'
          ]
        };

        if (args.length > 0) {
          const category = args[0].toLowerCase();
          if (skillCategories[category]) {
            return `${category.toUpperCase()} SKILLS:\n\n${skillCategories[category].map(skill => `  ✓ ${skill}`).join('\n')}`;
          }
          return `Unknown category '${category}'. Available: ${Object.keys(skillCategories).join(', ')}`;
        }

        return `CYBERSECURITY EXPERTISE:

${Object.entries(skillCategories).map(([cat, skills]) => 
  `${cat.toUpperCase()}:\n${skills.map(skill => `  ✓ ${skill}`).join('\n')}`
).join('\n\n')}

Type 'skills <category>' for specific details.`;
      }
    },

    projects: {
      name: 'projects',
      description: 'List security projects and engagements',
      usage: 'projects [filter]',
      handler: (args) => {
        const projects = [
          {
            name: 'Corporate Red Team Assessment',
            type: 'red-team',
            status: 'completed',
            description: 'Full-scope penetration test with physical access'
          },
          {
            name: 'APT29 Simulation Exercise',
            type: 'simulation',
            status: 'completed',
            description: 'Advanced persistent threat emulation'
          },
          {
            name: 'Custom Malware Analysis Lab',
            type: 'blue-team',
            status: 'ongoing',
            description: 'Isolated environment for malware research'
          },
          {
            name: 'Zero-Day Research Project',
            type: 'research',
            status: 'classified',
            description: 'Vulnerability research in popular software'
          }
        ];

        const filter = args[0]?.toLowerCase();
        const filteredProjects = filter 
          ? projects.filter(p => p.type.includes(filter) || p.status.includes(filter))
          : projects;

        if (filteredProjects.length === 0) {
          return `No projects found matching filter '${filter}'`;
        }

        return `SECURITY PROJECTS:\n\n${filteredProjects.map(p => 
          `${p.name}
  Type: ${p.type}
  Status: ${p.status.toUpperCase()}
  Description: ${p.description}\n`
        ).join('\n')}`;
      }
    },

    showcerts: {
      name: 'showcerts',
      description: 'Display security certifications',
      usage: 'showcerts',
      handler: () => {
        return `SECURITY CERTIFICATIONS:

  ✓ OSCP - Offensive Security Certified Professional
    Issued: 2022 | Status: ACTIVE
    
  ✓ CISSP - Certified Information Systems Security Professional  
    Issued: 2021 | Status: ACTIVE
    
  ✓ CEH - Certified Ethical Hacker
    Issued: 2020 | Status: ACTIVE
    
  ✓ GCIH - GIAC Certified Incident Handler
    Issued: 2021 | Status: ACTIVE
    
  ✓ GPEN - GIAC Penetration Tester
    Issued: 2022 | Status: ACTIVE

Type 'verify <cert>' to check certification details.`;
      }
    },

    nmap: {
      name: 'nmap',
      description: 'Network discovery and security auditing',
      usage: 'nmap [options] [target]',
      handler: (args) => {
        if (args.length === 0) {
          return 'Usage: nmap [options] [target]\nExample: nmap -sV 192.168.1.1';
        }

        const target = args[args.length - 1];
        
        return `Starting Nmap scan on ${target}...

Nmap scan report for ${target}
Host is up (0.0012s latency).
Not shown: 996 closed ports
PORT     STATE SERVICE    VERSION
22/tcp   open  ssh        OpenSSH 8.2p1
80/tcp   open  http       nginx 1.18.0
443/tcp  open  https      nginx 1.18.0
3306/tcp open  mysql      MySQL 8.0.25

Nmap done: 1 IP address (1 host up) scanned in 2.34 seconds

⚠️  NOTE: This is a simulated scan for demonstration purposes.`;
      }
    },

    exploit: {
      name: 'exploit',
      description: 'Simulated exploit framework',
      usage: 'exploit [payload] [target]',
      handler: (args) => {
        if (args.length < 2) {
          return `EXPLOIT FRAMEWORK - SIMULATION MODE

Available payloads:
  - windows/meterpreter/reverse_tcp
  - linux/x86/shell_reverse_tcp
  - php/meterpreter/reverse_tcp

Usage: exploit <payload> <target>

⚠️  EDUCATIONAL PURPOSES ONLY`;
        }

        const [payload, target] = args;
        
        return `Initializing exploit...
Payload: ${payload}
Target: ${target}

[*] Started reverse TCP handler on 0.0.0.0:4444
[*] Sending stage (175174 bytes) to ${target}
[*] Meterpreter session 1 opened

meterpreter > 

⚠️  SIMULATION MODE - No actual exploitation performed.
This is for educational demonstration only.`;
      }
    },

    history: {
      name: 'history',
      description: 'Show command history',
      usage: 'history',
      handler: () => {
        return history.map((cmd, index) => `${index + 1}  ${cmd}`).join('\n');
      }
    },

    exit: {
      name: 'exit',
      description: 'Exit the terminal session',
      usage: 'exit',
      handler: () => {
        addLine('system', 'Terminating secure connection...');
        setTimeout(() => {
          addLine('system', 'Connection closed.');
        }, 1000);
        return '';
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    // Auto-complete suggestions
    if (value.trim()) {
      const matches = Object.keys(commands).filter(cmd => 
        cmd.toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestions(matches);
      setShowSuggestions(matches.length > 0);
      setSuggestionIndex(-1);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const command = input.trim();
      
      if (command) {
        // Add command to history
        setHistory(prev => [...prev, command]);
        setHistoryIndex(-1);

        // Add command line
        addLine('command', `${currentDirectory} $ ${command}`);

        // Parse and execute command
        const [cmd, ...args] = command.split(' ');
        const commandHandler = commands[cmd.toLowerCase()];

        if (commandHandler) {
          try {
            const output = await commandHandler.handler(args);
            if (output) {
              addLine('output', output);
            }
          } catch (error) {
            addLine('error', `Error executing command: ${error.message}`);
          }
        } else {
          addLine('error', `Command not found: ${cmd}. Type 'help' for available commands.`);
        }
      }

      setInput('');
      setShowSuggestions(false);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= history.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(newIndex);
          setInput(history[newIndex]);
        }
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (suggestions.length > 0) {
        setInput(suggestions[0]);
        setShowSuggestions(false);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (suggestion: string) => {
    setInput(suggestion);
    setShowSuggestions(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <TerminalContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <TerminalWindow>
        <TerminalHeader>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <WindowControls>
              <ControlButton color="#ff5f57" />
              <ControlButton color="#ffbd2e" />
              <ControlButton color="#28ca42" />
            </WindowControls>
            <TerminalTitle>Secure Terminal - cybersec_expert@portfolio</TerminalTitle>
          </div>
          <TerminalStats>
            <span>Status: {isOnline ? 'ONLINE' : 'OFFLINE'}</span>
            <span>Session: {Date.now().toString().slice(-6)}</span>
            <span>Encryption: AES-256</span>
          </TerminalStats>
        </TerminalHeader>

        <TerminalContent ref={contentRef}>
          <AnimatePresence>
            {lines.map((line) => (
              <OutputLine
                key={line.id}
                lineType={line.type}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {line.type === 'command' && (
                  <>
                    <Prompt>[{line.timestamp.toLocaleTimeString()}] </Prompt>
                    {line.content}
                  </>
                )}
                {line.type !== 'command' && line.content}
              </OutputLine>
            ))}
          </AnimatePresence>

          <InputLine style={{ position: 'relative' }}>
            <Prompt>
              [{new Date().toLocaleTimeString()}] {currentDirectory} $
            </Prompt>
            <TerminalInput
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type a command..."
              autoComplete="off"
              spellCheck={false}
            />
            <Cursor visible={cursorVisible} />

            {showSuggestions && (
              <SuggestionsList>
                {suggestions.map((suggestion, index) => (
                  <SuggestionItem
                    key={suggestion}
                    highlighted={index === suggestionIndex}
                    onClick={() => selectSuggestion(suggestion)}
                  >
                    {suggestion}
                  </SuggestionItem>
                ))}
              </SuggestionsList>
            )}
          </InputLine>
        </TerminalContent>
      </TerminalWindow>
    </TerminalContainer>
  );
};

export default Terminal;
