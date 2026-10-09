// Embedded Systems & Microcontroller Course Catalog

export const coursesData = [
  {
    id: "elge-301",
    code: "ELGE-301",
    title: "ARM Cortex-M7 Microcontroller Architecture & Interfacing",
    department: "Department of Electronics & Computer Engineering",
    level: "Undergraduate / Core",
    credits: "4 Credits (3 Lecture + 2 Lab)",
    mentor: "Dr. Aswinkumer S V",
    contributors: ["Sathvik", "Harshitha", "Deepthi"],
    description: "In-depth study of the ARM Cortex-M7 32-bit RISC core using the STM32H753ZI development platform. Covers memory mapping, NVIC interrupt controllers, GPIO ports, and hardware timer peripherals.",
    outcomes: [
      "Configure ARM Cortex-M7 hardware registers and NVIC interrupt system.",
      "Interface analog and digital sensors using ADC/DAC and DMA channels.",
      "Design reliable low-latency firmware for real-world industrial sensing."
    ],
    modules: [
      {
        number: "Module 1",
        name: "Cortex-M7 Core & Memory Mapping",
        topics: ["Cortex-M7 Architecture", "AXI/TCM Memory Bus", "Dual-Bank Flash", "Hardware FPU & L1 Cache"]
      },
      {
        number: "Module 2",
        name: "GPIO, EXTI & NVIC Interrupts",
        topics: ["Push-Pull & Open-Drain Modes", "EXTI Line Configuration", "Interrupt Priority & Preemption", "SysTick Timer"]
      },
      {
        number: "Module 3",
        name: "Analog Signal Acquisition (ADC & DAC)",
        topics: ["16-bit ADC Conversions", "Over-sampling & Voltage Reference", "Dual DAC Signal Generation", "DMA Circular Buffers"]
      },
      {
        number: "Module 4",
        name: "Timer Peripherals & PWM",
        topics: ["General Purpose & Advanced Timers", "Prescalers & Auto-Reload Registers", "PWM Motor Control", "Input Capture"]
      }
    ],
    relatedLabIds: ["exp-1", "exp-2", "exp-3", "exp-4", "exp-5", "exp-6", "exp-7", "exp-8"],
    syllabusDownload: "/docs/ELGE-301-Syllabus.pdf",
    badge: "Human Verified"
  },
  {
    id: "elge-302",
    code: "ELGE-302",
    title: "Real-Time Operating Systems (RTOS) with FreeRTOS",
    department: "Department of Electronics & Global Engineering (EL&GE)",
    level: "Undergraduate / Advanced",
    credits: "4 Credits (3 Lecture + 2 Lab)",
    mentor: "Dr. Aswinkumer S V",
    contributors: ["Sathvik", "Harshitha", "Deepthi"],
    description: "Principles of real-time embedded software design using FreeRTOS on STM32 microcontrollers. Focuses on task scheduling, synchronization primitives, inter-task communication, and memory management.",
    outcomes: [
      "Implement preemptive task scheduling and priority assignment in FreeRTOS.",
      "Eliminate race conditions using Mutexes, Counting Semaphores, and Task Notifications.",
      "Develop deterministic real-time embedded applications for robotics and IoT."
    ],
    modules: [
      {
        number: "Module 1",
        name: "RTOS Fundamentals & Kernel Concepts",
        topics: ["Super-Loop vs RTOS", "Preemptive Scheduling", "Task Control Blocks (TCB)", "Idle Task & Hook Functions"]
      },
      {
        number: "Module 2",
        name: "Inter-Task Synchronization",
        topics: ["Binary & Counting Semaphores", "Mutexes & Priority Inversion", "Priority Inheritance", "Event Groups"]
      },
      {
        number: "Module 3",
        name: "Message Queues & Memory Pools",
        topics: ["Queue Handles & Send/Receive", "Mailbox Messaging", "Heap Memory Allocators", "Stack Overflow Hook"]
      },
      {
        number: "Module 4",
        name: "Software Timers & Deferred Interrupt Processing",
        topics: ["One-Shot & Auto-Reload Timers", "ISR-to-Task Queueing", "Deferred Processing", "Low Power Tickless Mode"]
      }
    ],
    relatedLabIds: ["exp-11", "exp-12", "exp-13", "exp-14", "exp-15", "exp-16"],
    syllabusDownload: "/docs/ELGE-302-Syllabus.pdf",
    badge: "AI + Human Hybrid"
  },
  {
    id: "elge-401",
    code: "ELGE-401",
    title: "Embedded Communication Protocols & IoT Gateways",
    department: "Department of Electronics & Global Engineering (EL&GE)",
    level: "Undergraduate / Specialization",
    credits: "3 Credits (2 Lecture + 2 Lab)",
    mentor: "Dr. Aswinkumer S V",
    contributors: ["Sathvik", "Harshitha", "Deepthi"],
    description: "Hardware interfacing and protocol stack analysis for USART/UART, SPI, I2C, CAN Bus, and Ethernet MAC on STM32 NUCLEO-H753ZI.",
    outcomes: [
      "Configure multi-master I2C bus and high-speed SPI flash memories.",
      "Analyze CAN-FD frame structures and error handling in automotive networks.",
      "Build Ethernet LwIP sockets for cloud telemetry and remote monitoring."
    ],
    modules: [
      {
        number: "Module 1",
        name: "Serial Communication (USART / UART)",
        topics: ["Asynchronous Framing & Baud Generators", "DMA Transmit/Receive", "RS-485 Differential Signals", "Modbus Protocol"]
      },
      {
        number: "Module 2",
        name: "Synchronous Buses (SPI & I2C)",
        topics: ["SPI Modes (CPOL/CPHA)", "I2C Clock Stretching & Arbitration", "EEPROM Interfacing", "Sensor Telemetry"]
      },
      {
        number: "Module 3",
        name: "Controller Area Network (CAN / FDCAN)",
        topics: ["CAN Protocol Architecture", "Message Identifiers & Bit Stuffing", "Acceptance Filtering", "Automotive ECU Nodes"]
      },
      {
        number: "Module 4",
        name: "Ethernet LwIP & Embedded Web Servers",
        topics: ["LAN8742A PHY Interfacing", "LwIP TCP/IP Stack", "HTTP Server on STM32", "MQTT IoT Telemetry"]
      }
    ],
    relatedLabIds: ["exp-9", "exp-10", "exp-17", "exp-18", "exp-19", "exp-20"],
    syllabusDownload: "/docs/ELGE-401-Syllabus.pdf",
    badge: "Human Verified"
  },
  {
    id: "elge-402",
    code: "ELGE-402",
    title: "Hardware Cryptography & Embedded Security",
    department: "Department of Electronics & Global Engineering (EL&GE)",
    level: "Advanced / Elective",
    credits: "3 Credits (2 Lecture + 2 Lab)",
    mentor: "Dr. Aswinkumer S V",
    contributors: ["Sathvik", "Harshitha", "Deepthi"],
    description: "Hands-on implementation of hardware cryptographic acceleration engines on STM32H753ZI including AES-128/256, Hash SHA-256, True Random Number Generation (TRNG), and Secure Boot.",
    outcomes: [
      "Utilize hardware AES encryption peripherals for real-time memory encryption.",
      "Generate cryptographic keys using hardware TRNG entropy sources.",
      "Implement secure firmware updates with cryptographic signature verification."
    ],
    modules: [
      {
        number: "Module 1",
        name: "Hardware AES & DES Encryption Engines",
        topics: ["AES-GCM & CBC Modes", "DMA Hardware Acceleration", "Key Injection", "Throughput Benchmarking"]
      },
      {
        number: "Module 2",
        name: "Hash HASH Engine & Digital Signatures",
        topics: ["SHA-256 & MD5 Hashing", "HMAC Authentication", "Firmware Integrity Checks", "Secure Storage"]
      },
      {
        number: "Module 3",
        name: "True Random Number Generators (TRNG)",
        topics: ["Analog Ring Oscillator Entropy", "NIST SP 800-90B Compliance", "Cryptographic Seed Generation"]
      },
      {
        number: "Module 4",
        name: "Secure Boot & Flash Memory Protection",
        topics: ["Read Out Protection (RDP)", "Write Protection (WRP)", "Dual-Bank Bank Swapping", "Root of Trust"]
      }
    ],
    relatedLabIds: ["exp-21", "exp-22", "exp-23", "exp-24", "exp-25", "exp-26"],
    syllabusDownload: "/docs/ELGE-402-Syllabus.pdf",
    badge: "AI + Human Hybrid"
  }
];
