// Complete 26-Experiment Laboratory Manual for STM32 NUCLEO-H753ZI (eLearnTech)

export const labExperiments = [
  {
    id: "lab-1",
    number: 1,
    files: [
      {
            "name": "20261004_143511_0000.mp4",
            "path": "/lab_files/EXP1/20261004_143511_0000.mp4",
            "type": "video"
      }
],
    title: "Installation and Configuration of STM32CubeIDE and Creation of the First STM32 Project",
    subtitle: "Setting up the ARM GCC Toolchain, ST-LINK Drivers, and Initializing target NUCLEO-H753ZI MCU",
    difficulty: "Beginner",
    estimatedTime: "30 mins",
    objectives: [
      "Install and configure STM32CubeIDE development environment and ST-LINK/V3E drivers",
      "Initialize project targeted for STM32H753ZI MCU using integrated STM32CubeMX",
      "Configure System Core clocks, debug interface (SWD), and generate HAL initialization code",
      "Build, flash, and launch your first debug session on target hardware"
    ],
    hardwareReq: [
      "NUCLEO-H753ZI Development Board",
      "Micro-USB Cable for ST-LINK/V3E Debugger",
      "PC with STM32CubeIDE installed"
    ],
    theory: `STM32CubeIDE is an all-in-one multi-OS development platform provided by STMicroelectronics. It incorporates the STM32CubeMX graphical configuration tool, GNU C/C++ toolchain, GDB debugger, and HAL (Hardware Abstraction Layer) code generator.

The STM32H753ZI processor operates on a dual-issue ARM Cortex-M7 core running up to 480 MHz with L1 Cache and Double-Precision FPU.

Key Workspace Concepts:
- **SWD (Serial Wire Debug)**: 2-wire debugging protocol using PA13 (SWDIO) and PA14 (SWCLK).
- **HAL (Hardware Abstraction Layer)**: High-level peripheral API driver standardizing MCU initialization.
- **RCC (Reset and Clock Control)**: Configures Phase Locked Loops (PLL1, PLL2, PLL3) for CPU and peripheral buses.`,
    pinConnections: [
      { pin: "PA13", function: "SYS_JTMS-SWDIO", target: "ST-LINK/V3E SWD Data Line" },
      { pin: "PA14", function: "SYS_JTCK-SWCLK", target: "ST-LINK/V3E SWD Clock Line" },
      { pin: "PB0", function: "GPIO_Output", target: "LD1 Green LED (On-board)" }
    ],
    cubeIdeSetup: [
      "Open STM32CubeIDE -> File -> New -> STM32 Project.",
      "In Commercial Part Number search 'STM32H753ZIT6' or select Board 'NUCLEO-H753ZI'.",
      "Name project 'eLearnTech_Lab01' and choose C language, Executable Target.",
      "When prompted 'Initialize all peripherals with default mode?', select Yes.",
      "In System Core -> SYS -> Debug, select 'Serial Wire'.",
      "Save (Ctrl + S) to generate project initialization code."
    ],
    codeSnippet: `/* USER CODE BEGIN Header */
/**
  * @file           : main.c
  * @brief          : Experiment 1 - Installation & Project Setup Test
  * @target         : NUCLEO-H753ZI (STM32H753ZI ARM Cortex-M7)
  */
/* USER CODE END Header */
#include "main.h"

void SystemClock_Config(void);
static void MX_GPIO_Init(void);

int main(void)
{
  /* Reset peripherals, initialize Flash interface and SysTick */
  HAL_Init();

  /* Configure system clock to 480 MHz */
  SystemClock_Config();

  /* Initialize all configured GPIO pins */
  MX_GPIO_Init();

  /* Infinite main loop */
  while (1)
  {
    /* Heartbeat Test: Toggle On-board Green LED (PB0 / LD1) */
    HAL_GPIO_TogglePin(GPIOB, GPIO_PIN_0);
    HAL_Delay(500); // 500 ms delay
  }
}

static void MX_GPIO_Init(void)
{
  GPIO_InitTypeDef GPIO_InitStruct = {0};

  __HAL_RCC_GPIOB_CLK_ENABLE();

  /* Configure PB0 as Push-Pull Output */
  GPIO_InitStruct.Pin = GPIO_PIN_0;
  GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
  GPIO_InitStruct.Pull = GPIO_NOPULL;
  GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;
  HAL_GPIO_Init(GPIOB, &GPIO_InitStruct);
}`,
    quiz: [
      {
        question: "Which 2-wire debugging interface is default on the NUCLEO-H753ZI ST-LINK/V3E?",
        options: ["JTAG (5-wire)", "SWD (Serial Wire Debug)", "UART Simplex", "I2C Bus"],
        correct: 1,
        explanation: "SWD uses SWDIO (PA13) and SWCLK (PA14) for fast 2-pin debugging and flash downloading."
      },
      {
        question: "What is the primary function of STM32CubeMX embedded in STM32CubeIDE?",
        options: [
          "Graphical pinout, clock tree, and peripheral C code generator",
          "Digital logic oscilloscope simulator",
          "PCB layout router tool",
          "Analog voltage regulator calculator"
        ],
        correct: 0,
        explanation: "STM32CubeMX allows graphical peripheral pin assignment, RCC clock tree setup, and automatic C code generation."
      }
    ]
  },
  {
    id: "lab-2",
    number: 2,
    files: [
      {
            "name": "Implementing and Analyzing GPIO Programming IOT.docx",
            "path": "/lab_files/EXP2/Implementing and Analyzing GPIO Programming IOT.docx",
            "type": "document"
      },
      {
            "name": "WhatsApp Video 2026-10-02 at 23.53.24.mp4",
            "path": "/lab_files/EXP2/WhatsApp Video 2026-10-02 at 23.53.24.mp4",
            "type": "video"
      }
],
    title: "Implementing and Analyzing GPIO Programming: Blinking the Onboard LED Using STM32 HAL",
    subtitle: "Understanding AHB4 Bus Clock Enabling, Push-Pull Drivers, and SysTick Delays",
    difficulty: "Beginner",
    estimatedTime: "30 mins",
    objectives: [
      "Configure GPIO Port B pins in Push-Pull Output mode",
      "Enable AHB4 peripheral bus clock via RCC_AHB4ENR",
      "Drive User LEDs (PB0 Green, PB7 Blue, PB14 Red)",
      "Analyze LED state toggle timing with SysTick delay functions"
    ],
    hardwareReq: [
      "NUCLEO-H753ZI Board",
      "Onboard User LEDs (LD1, LD2, LD3)"
    ],
    theory: `GPIO ports on the STM32H7 are mapped to the AHB4 high-speed peripheral bus. Each GPIO port has 16 pins with configurable output modes:
- **Push-Pull (GPIO_MODE_OUTPUT_PP)**: Actively drives output pin to 3.3V (HIGH) or 0V (GND).
- **Open-Drain (GPIO_MODE_OUTPUT_OD)**: Drives pin to 0V when LOW, leaves pin high-impedance when HIGH (requires external pull-up).

HAL API Functions:
- \`HAL_GPIO_WritePin(GPIOx, GPIO_PIN_x, PinState)\`: Writes GPIO_PIN_SET or GPIO_PIN_RESET.
- \`HAL_GPIO_TogglePin(GPIOx, GPIO_PIN_x)\`: Inverts current pin state.
- \`HAL_Delay(uint32_t ms)\`: Suspends execution for specified milliseconds using SysTick interrupt.`,
    pinConnections: [
      { pin: "PB0", function: "GPIO_Output", target: "LD1 Green LED" },
      { pin: "PB7", function: "GPIO_Output", target: "LD2 Blue LED" },
      { pin: "PB14", function: "GPIO_Output", target: "LD3 Red LED" }
    ],
    cubeIdeSetup: [
      "In Pinout view, set PB0 to 'GPIO_Output' (LD1_GREEN).",
      "Set PB7 to 'GPIO_Output' (LD2_BLUE).",
      "Set PB14 to 'GPIO_Output' (LD3_RED).",
      "In GPIO Parameter Settings: Output Level = LOW, Mode = Push-Pull, Pull = No pull, Speed = Low.",
      "Generate Code."
    ],
    codeSnippet: `/* USER CODE BEGIN Header */
/**
  * @file           : main.c
  * @brief          : Experiment 2 - Implementing and Analyzing GPIO Programming
  * @description    : Blinking Onboard User LEDs using HAL GPIO APIs
  */
/* USER CODE END Header */
#include "main.h"

void SystemClock_Config(void);
static void MX_GPIO_Init(void);

int main(void)
{
  HAL_Init();
  SystemClock_Config();
  MX_GPIO_Init();

  while (1)
  {
    /* Turn ON Green LED (PB0), Turn OFF Red LED (PB14) */
    HAL_GPIO_WritePin(GPIOB, GPIO_PIN_0, GPIO_PIN_SET);
    HAL_GPIO_WritePin(GPIOB, GPIO_PIN_14, GPIO_PIN_RESET);
    HAL_Delay(250);

    /* Turn OFF Green LED (PB0), Turn ON Red LED (PB14) */
    HAL_GPIO_WritePin(GPIOB, GPIO_PIN_0, GPIO_PIN_RESET);
    HAL_GPIO_WritePin(GPIOB, GPIO_PIN_14, GPIO_PIN_SET);
    HAL_Delay(250);
  }
}

static void MX_GPIO_Init(void)
{
  GPIO_InitTypeDef GPIO_InitStruct = {0};
  __HAL_RCC_GPIOB_CLK_ENABLE();

  HAL_GPIO_WritePin(GPIOB, GPIO_PIN_0 | GPIO_PIN_14, GPIO_PIN_RESET);

  GPIO_InitStruct.Pin = GPIO_PIN_0 | GPIO_PIN_14;
  GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
  GPIO_InitStruct.Pull = GPIO_NOPULL;
  GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;
  HAL_GPIO_Init(GPIOB, &GPIO_InitStruct);
}`,
    quiz: [
      {
        question: "Which bus clock must be enabled before accessing GPIO Port B on STM32H7?",
        options: ["APB1 Clock", "AHB4 Clock", "APB2 Clock", "ITCM Bus"],
        correct: 1,
        explanation: "GPIO ports A through K on STM32H7 reside on the AHB4 bus domain."
      }
    ]
  },
  {
    id: "lab-3",
    number: 3,
    files: [
      {
            "name": "SysTick Timer-Based Periodic LED Task Scheduler IOT EXP 3.docx",
            "path": "/lab_files/EXP3/SysTick Timer-Based Periodic LED Task Scheduler IOT EXP 3.docx",
            "type": "document"
      },
      {
            "name": "WhatsApp Video 2026-10-02 at 23.56.48.mp4",
            "path": "/lab_files/EXP3/WhatsApp Video 2026-10-02 at 23.56.48.mp4",
            "type": "video"
      }
],
    title: "Development of a SysTick Timer-Based Periodic LED Task Scheduler Without Using Software Delays",
    subtitle: "Non-blocking Periodic Task Execution Using HAL_GetTick() Timestamp Polling",
    difficulty: "Intermediate",
    estimatedTime: "40 mins",
    objectives: [
      "Understand SysTick timer hardware interrupt running at 1 kHz (1 ms tick)",
      "Eliminate blocking HAL_Delay() loops in main embedded applications",
      "Implement multi-rate periodic task schedulers using elapsed time polling",
      "Execute independent LED tasks concurrently (e.g. 100ms, 500ms, 1000ms periods)"
    ],
    hardwareReq: [
      "NUCLEO-H753ZI Board",
      "3 Onboard LEDs (LD1 Green, LD2 Blue, LD3 Red)"
    ],
    theory: `Blocking delay functions like \`HAL_Delay()\` stall CPU execution inside a busy loop, preventing other sensor reads or communication handlers from executing.

The SysTick core timer increments a global 32-bit counter (\`uwTick\`) every 1 millisecond. By saving task timestamps:
$$\\text{Elapsed Time} = \\text{HAL\\_GetTick()} - \\text{last\\_timestamp}$$

When $\\text{Elapsed Time} \\ge \\text{Task Period}$, the task executes and updates its timestamp without blocking the main loop.`,
    pinConnections: [
      { pin: "PB0", function: "Task 1 Output (100ms)", target: "LD1 Green LED (10 Hz Blink)" },
      { pin: "PB7", function: "Task 2 Output (500ms)", target: "LD2 Blue LED (2 Hz Blink)" },
      { pin: "PB14", function: "Task 3 Output (1000ms)", target: "LD3 Red LED (1 Hz Blink)" }
    ],
    cubeIdeSetup: [
      "Configure PB0, PB7, and PB14 as GPIO_Output.",
      "Verify SysTick interrupt source is set to Timebase Source (1 ms).",
      "Generate Code."
    ],
    codeSnippet: `/* USER CODE BEGIN Header */
/**
  * @file           : main.c
  * @brief          : Experiment 3 - SysTick Non-Blocking Task Scheduler
  * @description    : Periodic LED blinking using HAL_GetTick() without HAL_Delay()
  */
/* USER CODE END Header */
#include "main.h"

void SystemClock_Config(void);
static void MX_GPIO_Init(void);

uint32_t last_led_time = 0;
const uint32_t LED_INTERVAL = 200; // 200 ms non-blocking interval

int main(void)
{
  HAL_Init();
  SystemClock_Config();
  MX_GPIO_Init();

  while (1)
  {
    uint32_t current_time = HAL_GetTick();

    /* Non-blocking periodic task execution */
    if (current_time - last_led_time >= LED_INTERVAL)
    {
      last_led_time = current_time;
      HAL_GPIO_TogglePin(GPIOB, GPIO_PIN_0); // Toggle LD1 LED
    }

    /* Other background CPU tasks can run here unhindered */
  }
}

static void MX_GPIO_Init(void)
{
  GPIO_InitTypeDef GPIO_InitStruct = {0};
  __HAL_RCC_GPIOB_CLK_ENABLE();

  GPIO_InitStruct.Pin = GPIO_PIN_0;
  GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
  GPIO_InitStruct.Pull = GPIO_NOPULL;
  GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;
  HAL_GPIO_Init(GPIOB, &GPIO_InitStruct);
}`,
    quiz: [
      {
        question: "Why are non-blocking SysTick schedulers preferred over HAL_Delay()?",
        options: [
          "They allow multiple tasks with different timing periods to execute concurrently without freezing the CPU",
          "They reduce supply current to 0 mA",
          "They disable all interrupt handlers",
          "They operate without RCC clock"
        ],
        correct: 0,
        explanation: "Non-blocking timestamp checks leave the main loop free to service other events continuously."
      }
    ]
  },
  {
    id: "lab-4",
    number: 4,
    files: [
      {
            "name": "SysTick Timer-Based Periodic LED Task Scheduler IOT EXP 3 - Copy.docx",
            "path": "/lab_files/EXP4/SysTick Timer-Based Periodic LED Task Scheduler IOT EXP 3 - Copy.docx",
            "type": "document"
      },
      {
            "name": "WhatsApp Video 2026-10-04 at 13.01.44.mp4",
            "path": "/lab_files/EXP4/WhatsApp Video 2026-10-04 at 13.01.44.mp4",
            "type": "video"
      }
],
    title: "Constructing a Debounced GPIO Input Interface: Push Button Controlled LED Operation",
    subtitle: "Mechanical Switch Contact Bounce Filtering and EXTI Interrupt Handling",
    difficulty: "Beginner",
    estimatedTime: "40 mins",
    objectives: [
      "Configure GPIO Input mode and EXTI (External Interrupt) lines",
      "Understand mechanical switch contact bounce dynamics",
      "Implement software debouncing algorithms using HAL_GetTick()",
      "Toggle LED state cleanly on push button press"
    ],
    hardwareReq: [
      "NUCLEO-H753ZI Board",
      "Blue User Button B1 (PC13)"
    ],
    theory: `When a mechanical push button is pressed, metallic contacts bounce against each other for 5 to 20 milliseconds, generating dozens of rapid HIGH/LOW transitions.

On NUCLEO-H753ZI:
- User Button B1 is connected to PC13 (Active HIGH with external pull-down resistor).
- PC13 connects to EXTI Line 13.

Software debouncing discards subsequent trigger edges occurring within a 50 ms debounce window following the initial detected edge.`,
    pinConnections: [
      { pin: "PC13", function: "GPIO_EXTI13", target: "Blue User Button B1" },
      { pin: "PB7", function: "GPIO_Output", target: "LD2 Blue LED" }
    ],
    cubeIdeSetup: [
      "In Pinout view, set PC13 to 'GPIO_EXTI13'.",
      "In GPIO settings: Mode = External Interrupt Mode with Rising edge trigger.",
      "In System Core -> NVIC: Enable 'EXTI line[15:10] interrupts'.",
      "Generate Code."
    ],
    codeSnippet: `/* USER CODE BEGIN Header */
/**
  * @file           : main.c
  * @brief          : Experiment 4 - Debounced Push Button Input Interface
  * @description    : Reading B1 User Push Button (PC13) with Software Debounce
  */
/* USER CODE END Header */
#include "main.h"

void SystemClock_Config(void);
static void MX_GPIO_Init(void);

uint8_t button_state = 0;
uint8_t last_button_state = 0;
uint32_t last_debounce_time = 0;
const uint32_t DEBOUNCE_DELAY = 50; // 50 ms debounce delay

int main(void)
{
  HAL_Init();
  SystemClock_Config();
  MX_GPIO_Init();

  while (1)
  {
    uint8_t reading = HAL_GPIO_ReadPin(GPIOC, GPIO_PIN_13);

    if (reading != last_button_state)
    {
      last_debounce_time = HAL_GetTick();
    }

    if ((HAL_GetTick() - last_debounce_time) > DEBOUNCE_DELAY)
    {
      if (reading != button_state)
      {
        button_state = reading;

        /* Active High button press detected on NUCLEO-H753ZI B1 */
        if (button_state == GPIO_PIN_SET)
        {
          HAL_GPIO_TogglePin(GPIOB, GPIO_PIN_0); // Toggle LED
        }
      }
    }

    last_button_state = reading;
  }
}

static void MX_GPIO_Init(void)
{
  GPIO_InitTypeDef GPIO_InitStruct = {0};

  __HAL_RCC_GPIOB_CLK_ENABLE();
  __HAL_RCC_GPIOC_CLK_ENABLE();

  /* LED PB0 Output */
  GPIO_InitStruct.Pin = GPIO_PIN_0;
  GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
  GPIO_InitStruct.Pull = GPIO_NOPULL;
  GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;
  HAL_GPIO_Init(GPIOB, &GPIO_InitStruct);

  /* Button PC13 Input */
  GPIO_InitStruct.Pin = GPIO_PIN_13;
  GPIO_InitStruct.Mode = GPIO_MODE_INPUT;
  GPIO_InitStruct.Pull = GPIO_PULLDOWN;
  HAL_GPIO_Init(GPIOC, &GPIO_InitStruct);
}`,
    quiz: [
      {
        question: "Which EXTI vector services PC13 pin interrupts on ARM Cortex-M STM32?",
        options: ["EXTI0_IRQHandler", "EXTI9_5_IRQHandler", "EXTI15_10_IRQHandler", "EXTI13_IRQHandler"],
        correct: 2,
        explanation: "EXTI lines 10 through 15 are grouped under EXTI15_10_IRQHandler."
      }
    ]
  },
  {
    id: "lab-5",
    number: 5,
    files: [
      {
            "name": "Experiment_5_GPIO_Drive_Strength_NUCLEO_H753ZI_REFERENCE_STYLE.docx",
            "path": "/lab_files/EXP5/Experiment_5_GPIO_Drive_Strength_NUCLEO_H753ZI_REFERENCE_STYLE.docx",
            "type": "document"
      }
],
    title: "Evaluating GPIO Drive Strengths: Performance Analysis of GPIO Speed and Pull-Up/Pull-Down Configurations",
    subtitle: "Analyzing Output Slew Rates, Noise Margins, and Drive Speeds (Low, Medium, High, Very High)",
    difficulty: "Intermediate",
    estimatedTime: "45 mins",
    objectives: [
      "Understand GPIO Output Speed settings (LOW = 12MHz, VERY HIGH = 100MHz)",
      "Evaluate internal Pull-Up (PU) and Pull-Down (PD) resistor configurations (40 kΩ)",
      "Analyze rise/fall time slew rates and signal integrity on high-speed buses",
      "Measure power consumption and EMI trade-offs across speed settings"
    ],
    hardwareReq: [
      "NUCLEO-H753ZI Board",
      "Oscilloscope or Logic Analyzer (for signal slew rate timing)"
    ],
    theory: `GPIO pins on STM32 feature configurable driver transistor slew rates:
- **Low Speed (GPIO_SPEED_FREQ_LOW)**: Slowest rise/fall time (~50 ns). Lowest EMI noise and lowest dynamic switching power.
- **Very High Speed (GPIO_SPEED_FREQ_VERY_HIGH)**: Ultra-fast rise/fall time (<2 ns). Required for high-speed QSPI, SDMMC, and FMC buses (up to 100 MHz).

Internal Pull-Up / Pull-Down Resistors (~40 kΩ):
- **NOPULL**: Line floats when un-driven.
- **PULLUP**: Weak internal connection to VDD (3.3V).
- **PULLDOWN**: Weak internal connection to GND (0V).`,
    pinConnections: [
      { pin: "PE9", function: "GPIO_Output (Very High Speed)", target: "High Speed Test Pin" },
      { pin: "PE11", function: "GPIO_Output (Low Speed)", target: "Low Speed Test Pin" }
    ],
    cubeIdeSetup: [
      "Configure PE9 as Output Push-Pull, Speed = VERY HIGH.",
      "Configure PE11 as Output Push-Pull, Speed = LOW.",
      "Generate Code."
    ],
    codeSnippet: `/* USER CODE BEGIN Header */
/**
  * @file           : main.c
  * @brief          : Experiment 5 - GPIO Drive Strength & Output Speed Analysis
  * @description    : Toggling PA6 at High Speed to measure rise/fall times on Oscilloscope
  */
/* USER CODE END Header */
#include "main.h"

void SystemClock_Config(void);
static void MX_GPIO_Init(void);

int main(void)
{
  HAL_Init();
  SystemClock_Config();
  MX_GPIO_Init();

  while (1)
  {
    /* Rapid Toggle PA6 for Signal Integrity & Slew Rate Analysis */
    HAL_GPIO_WritePin(GPIOA, GPIO_PIN_6, GPIO_PIN_SET);
    HAL_GPIO_WritePin(GPIOA, GPIO_PIN_6, GPIO_PIN_RESET);
  }
}

static void MX_GPIO_Init(void)
{
  GPIO_InitTypeDef GPIO_InitStruct = {0};
  __HAL_RCC_GPIOA_CLK_ENABLE();

  /* Configure PA6 as VERY HIGH Speed Output */
  GPIO_InitStruct.Pin = GPIO_PIN_6;
  GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
  GPIO_InitStruct.Pull = GPIO_NOPULL;
  GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_VERY_HIGH; // 85 MHz - 130 MHz Slew Rate
  HAL_GPIO_Init(GPIOA, &GPIO_InitStruct);
}`,
    quiz: [
      {
        question: "When should GPIO VERY_HIGH speed setting be selected?",
        options: [
          "For high frequency buses like SDMMC, QSPI, or FMC (>50 MHz)",
          "For driving simple status LEDs",
          "To reduce power consumption",
          "To disable internal pull-up resistors"
        ],
        correct: 0,
        explanation: "Very High speed minimizes edge transition times required for high-speed parallel and serial memory interfaces."
      }
    ]
  },
  {
    id: "lab-6",
    number: 6,
    youtubeUrl: "https://www.youtube.com/watch?v=ZNrrf7SJ_9Y",
    youtubeEmbedUrl: "https://www.youtube-nocookie.com/embed/ZNrrf7SJ_9Y",
    youtubeThumbnail: "/lab_files/EXP6/youtube_thumbnail.jpg",
    files: [
      {
            "name": "EXP6 procedure.txt",
            "path": "/lab_files/EXP6/EXP6 procedure.txt",
            "type": "document"
      },
      {
            "name": "exp6.txt",
            "path": "/lab_files/EXP6/exp6.txt",
            "type": "document"
      },
      {
            "name": "IMG20260927143558.jpg",
            "path": "/lab_files/EXP6/IMG20260927143558.jpg",
            "type": "image"
      },
      {
            "name": "Screenshot (16).png",
            "path": "/lab_files/EXP6/Screenshot (16).png",
            "type": "image"
      },
      {
            "name": "VID20260927143625.mp4",
            "path": "/lab_files/EXP6/VID20260927143625.mp4",
            "type": "video"
      },
      {
            "name": "youtube_thumbnail.jpg",
            "path": "/lab_files/EXP6/youtube_thumbnail.jpg",
            "type": "image"
      },
      {
            "name": "YouTube Video Demonstration (ID: ZNrrf7SJ_9Y)",
            "path": "https://www.youtube.com/watch?v=ZNrrf7SJ_9Y",
            "embedUrl": "https://www.youtube-nocookie.com/embed/ZNrrf7SJ_9Y",
            "thumbnail": "/lab_files/EXP6/youtube_thumbnail.jpg",
            "type": "youtube",
            "youtubeId": "ZNrrf7SJ_9Y"
      }
],
    title: "Implementing Logic-Level Control for High-Power Relay Interfacing and Digital Output Control Using STM32",
    subtitle: "Optocoupler Isolation, Transistor Drivers, and High Voltage Load Switching",
    difficulty: "Intermediate",
    estimatedTime: "45 mins",
    objectives: [
      "Interface 5V/12V electromechanical relays safely to 3.3V STM32 GPIO pins",
      "Understand optocoupler isolation (PC817) and NPN/MOSFET switching circuits",
      "Prevent inductive flyback voltage spikes using freewheeling diodes (1N4007)",
      "Control AC/DC high-power loads via digital output commands"
    ],
    hardwareReq: [
      "NUCLEO-H753ZI Board",
      "5V Relay Module with Optocoupler & Driver Transistor",
      "External Power Supply or USB 5V rail"
    ],
    theory: `Microcontroller GPIO pins can only source/sink up to 20 mA at 3.3V. Electromechanical relay coils require 70-100 mA at 5V/12V.

Direct pin connection will destroy the MCU!

**Interface Circuit Components**:
1. **Optocoupler (PC817)**: Provides galvanic isolation between low-voltage MCU and high-voltage load.
2. **NPN Transistor / N-Channel MOSFET**: Amplifies current to energize the relay coil.
3. **Freewheeling Diode (1N4007)**: Clamps inductive reverse-EMF voltage spikes generated when coil de-energizes ($V = -L \\frac{di}{dt}$).`,
    pinConnections: [
      { pin: "PG3", function: "GPIO_Output (Relay Control)", target: "Relay IN Pin (Optocoupler Input)" },
      { pin: "5V", function: "Power Rail", target: "Relay Module VCC" },
      { pin: "GND", function: "Ground Rail", target: "Relay Module GND" }
    ],
    cubeIdeSetup: [
      "Configure PG3 (CN8 Pin 16) as GPIO_Output.",
      "Label pin 'RELAY_CONTROL'. Set Initial State = LOW.",
      "Generate Code."
    ],
    codeSnippet: `/* USER CODE BEGIN Header */
/**
  * @file           : main.c
  * @brief          : Experiment 6 - Relay Interfacing with NUCLEO-H753ZI
  * @description    : Driving an external Relay Module via PB0 (RELAY_IN)
  */
/* USER CODE END Header */
#include "main.h"

void SystemClock_Config(void);
static void MX_GPIO_Init(void);

int main(void)
{
  HAL_Init();
  SystemClock_Config();
  MX_GPIO_Init();

  /* Relay initially OFF (Active Low Relay: SET = OFF, RESET = ON) */
  HAL_GPIO_WritePin(GPIOB, GPIO_PIN_0, GPIO_PIN_SET);

  while (1)
  {
    /* Relay ON (Energize Coil) */
    HAL_GPIO_WritePin(GPIOB, GPIO_PIN_0, GPIO_PIN_RESET);
    HAL_Delay(2000); // Wait 2 seconds

    /* Relay OFF (De-energize Coil) */
    HAL_GPIO_WritePin(GPIOB, GPIO_PIN_0, GPIO_PIN_SET);
    HAL_Delay(2000); // Wait 2 seconds
  }
}

static void MX_GPIO_Init(void)
{
  GPIO_InitTypeDef GPIO_InitStruct = {0};
  __HAL_RCC_GPIOB_CLK_ENABLE();

  GPIO_InitStruct.Pin = GPIO_PIN_0; // RELAY_IN
  GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
  GPIO_InitStruct.Pull = GPIO_NOPULL;
  GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;
  HAL_GPIO_Init(GPIOB, &GPIO_InitStruct);
}`,
    quiz: [
      {
        question: "Why is a freewheeling diode placed in parallel across a relay coil?",
        options: [
          "To clamp high-voltage inductive flyback spikes generated during coil turn-off",
          "To increase current flow to the coil",
          "To step down 5V to 3.3V",
          "To invert the digital control logic"
        ],
        correct: 0,
        explanation: "Inductors resist abrupt current changes, producing large destructive reverse voltage spikes when turned off."
      }
    ]
  },
  {
    id: "lab-7",
    number: 7,
    youtubeUrl: "https://www.youtube.com/watch?v=tl_Q18riI1o",
    youtubeEmbedUrl: "https://www.youtube-nocookie.com/embed/tl_Q18riI1o",
    youtubeThumbnail: "/lab_files/EXP7/youtube_thumbnail.jpg",
    files: [
      {
            "name": "EXP7 Procedure.txt",
            "path": "/lab_files/EXP7/EXP7 Procedure.txt",
            "type": "document"
      },
      {
            "name": "Exp7.txt",
            "path": "/lab_files/EXP7/Exp7.txt",
            "type": "document"
      },
      {
            "name": "IMG20260927152334.jpg",
            "path": "/lab_files/EXP7/IMG20260927152334.jpg",
            "type": "image"
      },
      {
            "name": "Screenshot (17).png",
            "path": "/lab_files/EXP7/Screenshot (17).png",
            "type": "image"
      },
      {
            "name": "VID20260927152500.mp4",
            "path": "/lab_files/EXP7/VID20260927152500.mp4",
            "type": "video"
      },
      {
            "name": "youtube_thumbnail.jpg",
            "path": "/lab_files/EXP7/youtube_thumbnail.jpg",
            "type": "image"
      },
      {
            "name": "YouTube Video Demonstration (ID: tl_Q18riI1o)",
            "path": "https://www.youtube.com/watch?v=tl_Q18riI1o",
            "embedUrl": "https://www.youtube-nocookie.com/embed/tl_Q18riI1o",
            "thumbnail": "/lab_files/EXP7/youtube_thumbnail.jpg",
            "type": "youtube",
            "youtubeId": "tl_Q18riI1o"
      }
],
    title: "Interfacing an I²C 16×2 LCD and Displaying User Information with Relay Status",
    subtitle: "PCF8574 I2C Backpack Driver, HD44780 4-bit Commands, and Real-time Status Display",
    difficulty: "Intermediate",
    estimatedTime: "50 mins",
    objectives: [
      "Interface 16x2 Character LCD using I2C PCF8574 I/O expander backpack",
      "Understand I2C Master transmission protocol (I2C1 SCL/SDA at 100 kHz)",
      "Implement HD44780 LCD control functions (cursor position, string print, clear)",
      "Display dynamic system information and relay ON/OFF state"
    ],
    hardwareReq: [
      "NUCLEO-H753ZI Board",
      "16x2 Character LCD with PCF8574 I2C Adapter (Address 0x27 or 0x3F)",
      "Relay Module on PG3"
    ],
    theory: `Standard 16x2 LCDs require 8 to 11 GPIO data/control lines. A PCF8574 I2C expander chip reduces this to just 2 lines: SCL (Clock) and SDA (Data).

I2C Protocol Fundamentals:
- **7-bit Address**: Typically \`0x27\` (shifted left to \`0x4E\` for HAL read/write).
- **Control Bits**: RS (Register Select), RW (Read/Write), EN (Enable), Backlight.

Data is sent as 4-bit nibbles packed into I2C bytes.`,
    pinConnections: [
      { pin: "PB8", function: "I2C1_SCL", target: "LCD SCL (CN7 Pin 2)" },
      { pin: "PB9", function: "I2C1_SDA", target: "LCD SDA (CN7 Pin 4)" },
      { pin: "5V", function: "Power Rail", target: "LCD VCC" },
      { pin: "GND", function: "Ground", target: "LCD GND" },
      { pin: "PG3", function: "GPIO_Output", target: "Relay Control Signal" }
    ],
    cubeIdeSetup: [
      "In Pinout view, enable Connectivity -> I2C1.",
      "Select I2C Mode = I2C. Standard Mode (100 kHz).",
      "Confirm PB8 = I2C1_SCL, PB9 = I2C1_SDA.",
      "Generate Code."
    ],
    codeSnippet: `/* USER CODE BEGIN Header */
/**
  * @file           : main.c
  * @brief          : Experiment 7 - I2C 16x2 LCD Interfacing with Relay Status
  * @description    : Driving PCF8574 I2C LCD over I2C1 (PB8/PB9) with Relay State Display
  */
/* USER CODE END Header */
#include "main.h"
#include <stdio.h>

#define LCD_ADDR (0x27 << 1) // PCF8574 I2C Address shifted left 1 bit

extern I2C_HandleTypeDef hi2c1;
void SystemClock_Config(void);
static void MX_GPIO_Init(void);
static void MX_I2C1_Init(void);

void LCD_SendCommand(uint8_t cmd);
void LCD_SendData(uint8_t data);
void LCD_Init(void);
void LCD_SendString(char *str);
void LCD_SetCursor(uint8_t row, uint8_t col);

int main(void)
{
  HAL_Init();
  SystemClock_Config();
  MX_GPIO_Init();
  MX_I2C1_Init();

  LCD_Init();
  LCD_SetCursor(0, 0);
  LCD_SendString("eLearnTech");
  LCD_SetCursor(1, 0);
  LCD_SendString("Relay: INITIALIZING");
  HAL_Delay(1500);

  while (1)
  {
    /* Relay ON */
    HAL_GPIO_WritePin(GPIOB, GPIO_PIN_0, GPIO_PIN_RESET);
    LCD_SetCursor(1, 0);
    LCD_SendString("Relay: ACTIVE [ON] ");
    HAL_Delay(2000);

    /* Relay OFF */
    HAL_GPIO_WritePin(GPIOB, GPIO_PIN_0, GPIO_PIN_SET);
    LCD_SetCursor(1, 0);
    LCD_SendString("Relay: IDLE  [OFF]");
    HAL_Delay(2000);
  }
}

void LCD_SendCommand(uint8_t cmd)
{
  uint8_t data_u, data_l;
  uint8_t data_t[4];
  data_u = (cmd & 0xf0);
  data_l = ((cmd << 4) & 0xf0);
  data_t[0] = data_u | 0x0C;  // en=1, rs=0
  data_t[1] = data_u | 0x08;  // en=0, rs=0
  data_t[2] = data_l | 0x0C;  // en=1, rs=0
  data_t[3] = data_l | 0x08;  // en=0, rs=0
  HAL_I2C_Master_Transmit(&hi2c1, LCD_ADDR, (uint8_t *)data_t, 4, 100);
}

void LCD_SendData(uint8_t data)
{
  uint8_t data_u, data_l;
  uint8_t data_t[4];
  data_u = (data & 0xf0);
  data_l = ((data << 4) & 0xf0);
  data_t[0] = data_u | 0x0D;  // en=1, rs=1
  data_t[1] = data_u | 0x09;  // en=0, rs=1
  data_t[2] = data_l | 0x0D;  // en=1, rs=1
  data_t[3] = data_l | 0x09;  // en=0, rs=1
  HAL_I2C_Master_Transmit(&hi2c1, LCD_ADDR, (uint8_t *)data_t, 4, 100);
}

void LCD_Init(void)
{
  HAL_Delay(50);
  LCD_SendCommand(0x30);
  HAL_Delay(5);
  LCD_SendCommand(0x30);
  HAL_Delay(1);
  LCD_SendCommand(0x32);
  HAL_Delay(10);
  LCD_SendCommand(0x28); // 4-bit mode, 2 lines, 5x8 font
  LCD_SendCommand(0x0C); // Display ON, cursor OFF
  LCD_SendCommand(0x06); // Entry mode set
  LCD_SendCommand(0x01); // Clear display
  HAL_Delay(2);
}

void LCD_SendString(char *str)
{
  while (*str) LCD_SendData(*str++);
}

void LCD_SetCursor(uint8_t row, uint8_t col)
{
  uint8_t pos = (row == 0) ? (0x80 + col) : (0xC0 + col);
  LCD_SendCommand(pos);
}`,
    quiz: [
      {
        question: "How many lines are required to communicate with a 16x2 LCD using a PCF8574 I2C adapter?",
        options: ["2 signal lines (SCL, SDA)", "8 parallel data lines", "16 lines", "4 SPI lines"],
        correct: 0,
        explanation: "I2C uses only 2 signal lines (Clock SCL and Data SDA) plus power and ground."
      }
    ]
  },
  {
    id: "lab-8",
    number: 8,
    youtubeUrl: "https://www.youtube.com/watch?v=1GtxrjrPLpc",
    youtubeEmbedUrl: "https://www.youtube-nocookie.com/embed/1GtxrjrPLpc",
    youtubeThumbnail: "/lab_files/EXP8/youtube_thumbnail.jpg",
    files: [
      {
            "name": "EXP8  Procedure.txt",
            "path": "/lab_files/EXP8/EXP8  Procedure.txt",
            "type": "document"
      },
      {
            "name": "Screenshot (18).png",
            "path": "/lab_files/EXP8/Screenshot (18).png",
            "type": "image"
      },
      {
            "name": "VID20260927163249.mp4",
            "path": "/lab_files/EXP8/VID20260927163249.mp4",
            "type": "video"
      },
      {
            "name": "youtube_thumbnail.jpg",
            "path": "/lab_files/EXP8/youtube_thumbnail.jpg",
            "type": "image"
      },
      {
            "name": "YouTube Video Demonstration (ID: 1GtxrjrPLpc)",
            "path": "https://www.youtube.com/watch?v=1GtxrjrPLpc",
            "embedUrl": "https://www.youtube-nocookie.com/embed/1GtxrjrPLpc",
            "thumbnail": "/lab_files/EXP8/youtube_thumbnail.jpg",
            "type": "youtube",
            "youtubeId": "1GtxrjrPLpc"
      }
],
    title: "Developing and Analyzing UART Serial Communication: Data Transmission from STM32 to PC",
    subtitle: "Asynchronous Serial Transmit via ST-LINK Virtual COM Port (VCP) & printf Retargeting",
    difficulty: "Beginner",
    estimatedTime: "35 mins",
    objectives: [
      "Configure USART3 peripheral on PD8 (TX) and PD9 (RX) at 115200 Baud",
      "Retarget standard C library \`printf()\` to UART transmit",
      "Transmit telemetry data streams from STM32 to PC host terminal",
      "Analyze Baud Rate errors, frame structure (start bit, 8 data bits, stop bit)"
    ],
    hardwareReq: [
      "NUCLEO-H753ZI Board",
      "PC with Serial Terminal (PuTTY / TeraTerm / STM32CubeIDE Terminal)"
    ],
    theory: `UART (Universal Asynchronous Receiver-Transmitter) transmits data bit-by-bit without a shared clock line. Both sender and receiver must agree on identical parameters:
- **Baud Rate**: Transmission speed in bits per second (e.g. 115200 bps).
- **Frame Format**: 1 Start Bit (LOW), 8 Data Bits (LSB first), 1 Stop Bit (HIGH), No Parity (8N1).

On NUCLEO-H753ZI, USART3 pins PD8 (TX) and PD9 (RX) route to the ST-LINK debugger USB chip.`,
    pinConnections: [
      { pin: "PD8", function: "USART3_TX", target: "ST-LINK VCP RX (PC Serial In)" },
      { pin: "PD9", function: "USART3_RX", target: "ST-LINK VCP TX (PC Serial Out)" }
    ],
    cubeIdeSetup: [
      "In Pinout view, select Connectivity -> USART3.",
      "Set Mode = Asynchronous. Baud Rate = 115200.",
      "Confirm PD8 = USART3_TX, PD9 = USART3_RX.",
      "Generate Code."
    ],
    codeSnippet: `/* USER CODE BEGIN Header */
/**
  * @file           : main.c
  * @brief          : Experiment 8 - UART Serial Communication Transmit
  * @description    : Transmitting telemetry string over USART3 (PD8/PD9) @ 115200 Baud
  */
/* USER CODE END Header */
#include "main.h"
#include <string.h>

extern UART_HandleTypeDef huart3;
void SystemClock_Config(void);
static void MX_GPIO_Init(void);
static void MX_USART3_UART_Init(void);

int main(void)
{
  HAL_Init();
  SystemClock_Config();
  MX_GPIO_Init();
  MX_USART3_UART_Init();

  char msg[] = "eLearnTech — STM32H753ZI UART Test OK!\r\n";

  while (1)
  {
    /* Transmit telemetry string over ST-LINK Virtual COM Port */
    HAL_UART_Transmit(&huart3, (uint8_t*)msg, strlen(msg), 500);
    HAL_GPIO_TogglePin(GPIOB, GPIO_PIN_0); // Toggle LED
    HAL_Delay(1000);
  }
}`,
    quiz: [
      {
        question: "Which C library function is overridden to redirect printf() output to STM32 UART?",
        options: ["_write()", "_read()", "fputc()", "uart_print()"],
        correct: 0,
        explanation: "The low-level POSIX _write() system call receives stdout buffer data and sends it over UART."
      }
    ]
  },
  {
    id: "lab-9",
    number: 9,
    youtubeUrl: "https://www.youtube.com/watch?v=mFNlG3sXp00",
    youtubeEmbedUrl: "https://www.youtube-nocookie.com/embed/mFNlG3sXp00",
    youtubeThumbnail: "/lab_files/EXP9/youtube_thumbnail.jpg",
    files: [
      {
            "name": "EXP 9 Procedure.txt",
            "path": "/lab_files/EXP9/EXP 9 Procedure.txt",
            "type": "document"
      },
      {
            "name": "VID_20260927_173938.mp4",
            "path": "/lab_files/EXP9/VID_20260927_173938.mp4",
            "type": "video"
      },
      {
            "name": "youtube_thumbnail.jpg",
            "path": "/lab_files/EXP9/youtube_thumbnail.jpg",
            "type": "image"
      },
      {
            "name": "YouTube Video Demonstration (ID: mFNlG3sXp00)",
            "path": "https://www.youtube.com/watch?v=mFNlG3sXp00",
            "embedUrl": "https://www.youtube-nocookie.com/embed/mFNlG3sXp00",
            "thumbnail": "/lab_files/EXP9/youtube_thumbnail.jpg",
            "type": "youtube",
            "youtubeId": "mFNlG3sXp00"
      }
],
    title: "Developing and Analyzing UART Serial Communication: Data Reception from PC to STM32",
    subtitle: "Polled & Non-Blocking Data Reception with Command Character Parsing",
    difficulty: "Intermediate",
    estimatedTime: "40 mins",
    objectives: [
      "Receive ASCII characters sent from PC keyboard over UART3",
      "Compare Polled RX (\`HAL_UART_Receive\`) vs Interrupt RX (\`HAL_UART_Receive_IT\`)",
      "Parse incoming character commands to control board actuators",
      "Implement RX ring buffer to prevent overrun errors"
    ],
    hardwareReq: [
      "NUCLEO-H753ZI Board",
      "PC Serial Terminal"
    ],
    theory: `Receiving data via UART requires continuous monitoring of the RX line:
1. **Polling Mode**: CPU blocks inside \`HAL_UART_Receive()\` waiting for a byte. If no byte arrives, the system freezes until timeout.
2. **Interrupt Mode**: CPU continues executing main code. When a byte arrives, the USART peripheral hardware triggers an interrupt to immediately service the received character.`,
    pinConnections: [
      { pin: "PD8", function: "USART3_TX", target: "ST-LINK VCP RX" },
      { pin: "PD9", function: "USART3_RX", target: "ST-LINK VCP TX" },
      { pin: "PB0", function: "GPIO_Output", target: "LD1 Green LED" }
    ],
    cubeIdeSetup: [
      "Enable USART3 in Asynchronous Mode at 115200 Baud.",
      "In NVIC Settings, check 'USART3 global interrupt'.",
      "Generate Code."
    ],
    codeSnippet: `/* USER CODE BEGIN Header */
/**
  * @file           : main.c
  * @brief          : Experiment 9 - UART Transmit and Receive Echo
  * @description    : Echoing received PC characters over USART3 (PD8/PD9)
  */
/* USER CODE END Header */
#include "main.h"

extern UART_HandleTypeDef huart3;
void SystemClock_Config(void);
static void MX_GPIO_Init(void);
static void MX_USART3_UART_Init(void);

uint8_t rx_buffer[1];

int main(void)
{
  HAL_Init();
  SystemClock_Config();
  MX_GPIO_Init();
  MX_USART3_UART_Init();

  char welcome[] = "UART Echo Terminal Ready. Type any key:\r\n";
  HAL_UART_Transmit(&huart3, (uint8_t*)welcome, sizeof(welcome)-1, 500);

  while (1)
  {
    /* Receive 1 byte from PC serial monitor */
    if (HAL_UART_Receive(&huart3, rx_buffer, 1, HAL_MAX_DELAY) == HAL_OK)
    {
      /* Echo byte back to PC */
      HAL_UART_Transmit(&huart3, rx_buffer, 1, 100);
      HAL_GPIO_TogglePin(GPIOB, GPIO_PIN_0);
    }
  }
}`,
    quiz: [
      {
        question: "Why must HAL_UART_Receive_IT() be called inside HAL_UART_RxCpltCallback()?",
        options: [
          "To re-arm the single-shot interrupt driver for the next character",
          "To change the Baud rate to 9600",
          "To turn off the MCU clock",
          "To reset the SysTick timer"
        ],
        correct: 0,
        explanation: "HAL UART IT reception is single-shot by default and must be re-armed after each byte completion."
      }
    ]
  },
  {
    id: "lab-10",
    number: 10,
    files: [
      {
            "name": "EXP10 Procedure.txt",
            "path": "/lab_files/EXP10/EXP10 Procedure.txt",
            "type": "document"
      }
],
    title: "Development of a UART Echo Application Using STM32 Displaying on LCD",
    subtitle: "Real-time Serial Terminal Mirroring and Character Rendering on I2C LCD",
    difficulty: "Intermediate",
    estimatedTime: "45 mins",
    objectives: [
      "Receive ASCII characters from PC via UART3 RX interrupt",
      "Echo received characters back to terminal for local user feedback",
      "Format and print received messages live on 16x2 I2C LCD screen",
      "Implement automatic line wrap and display buffer clear commands"
    ],
    hardwareReq: [
      "NUCLEO-H753ZI Board",
      "16x2 I2C LCD Display (PB8/PB9)",
      "PC Serial Terminal"
    ],
    theory: `This application bridges PC serial input to an embedded visual display:
1. User types characters in PC terminal.
2. STM32 receives character via UART3 RX Interrupt.
3. Character is echoed back over UART3 TX so it appears on terminal screen.
4. Character is appended to LCD line buffer and rendered live on HD44780 screen.`,
    pinConnections: [
      { pin: "PD8/PD9", function: "USART3 TX/RX", target: "PC Serial Port" },
      { pin: "PB8/PB9", function: "I2C1 SCL/SDA", target: "16x2 LCD Display" }
    ],
    cubeIdeSetup: [
      "Enable USART3 with NVIC Interrupt enabled.",
      "Enable I2C1 in Standard Mode (100 kHz).",
      "Generate Code."
    ],
    codeSnippet: `/* USER CODE BEGIN Header */
/**
  * @file           : main.c
  * @brief          : Experiment 10 - USART3 UART to I2C 16x2 LCD Interface
  * @description    : Displaying received UART Serial text on 16x2 LCD Row 2
  */
/* USER CODE END Header */
#include "main.h"
#include <string.h>

extern UART_HandleTypeDef huart3;
extern I2C_HandleTypeDef hi2c1;

void SystemClock_Config(void);
static void MX_GPIO_Init(void);
static void MX_USART3_UART_Init(void);
static void MX_I2C1_Init(void);

void LCD_Init(void);
void LCD_SetCursor(uint8_t row, uint8_t col);
void LCD_SendString(char *str);

uint8_t rx_byte;
char rx_line[17];
uint8_t rx_index = 0;

int main(void)
{
  HAL_Init();
  SystemClock_Config();
  MX_GPIO_Init();
  MX_USART3_UART_Init();
  MX_I2C1_Init();

  LCD_Init();
  LCD_SetCursor(0, 0);
  LCD_SendString("UART -> LCD Echo");

  while (1)
  {
    if (HAL_UART_Receive(&huart3, &rx_byte, 1, HAL_MAX_DELAY) == HAL_OK)
    {
      /* Echo byte to PC */
      HAL_UART_Transmit(&huart3, &rx_byte, 1, 100);

      if (rx_byte == '\r' || rx_byte == '\n' || rx_index >= 16)
      {
        rx_line[rx_index] = '\0';
        LCD_SetCursor(1, 0);
        LCD_SendString("                "); // Clear line
        LCD_SetCursor(1, 0);
        LCD_SendString(rx_line);
        rx_index = 0;
      }
      else
      {
        rx_line[rx_index++] = rx_byte;
      }
    }
  }
}`,
    quiz: [
      {
        question: "What is the primary benefit of an Echo application in serial communications?",
        options: [
          "It provides visual verification to the user that transmitted bytes were correctly received by MCU",
          "It doubles the transmission Baud rate",
          "It compresses ASCII text into binary",
          "It converts I2C into SPI signals"
        ],
        correct: 0,
        explanation: "Echoing confirms full duplex physical link integrity between terminal and microcontroller."
      }
    ]
  },
  {
    id: "lab-11",
    number: 11,
    files: [
      {
            "name": "exp11.mp4",
            "path": "/lab_files/EXP11/exp11.mp4",
            "type": "video"
      },
      {
            "name": "WhatsApp Image 2026-09-30 at 10.40.02.jpeg",
            "path": "/lab_files/EXP11/WhatsApp Image 2026-09-30 at 10.40.02.jpeg",
            "type": "image"
      },
      {
            "name": "WhatsApp Image 2026-09-30 at 10.42.26.jpeg",
            "path": "/lab_files/EXP11/WhatsApp Image 2026-09-30 at 10.42.26.jpeg",
            "type": "image"
      },
      {
            "name": "WhatsApp Image 2026-09-30 at 10.49.34.jpeg",
            "path": "/lab_files/EXP11/WhatsApp Image 2026-09-30 at 10.49.34.jpeg",
            "type": "image"
      },
      {
            "name": "WhatsApp Image 2026-09-30 at 10.49.56.jpeg",
            "path": "/lab_files/EXP11/WhatsApp Image 2026-09-30 at 10.49.56.jpeg",
            "type": "image"
      },
      {
            "name": "WhatsApp Image 2026-09-30 at 10.50.21.jpeg",
            "path": "/lab_files/EXP11/WhatsApp Image 2026-09-30 at 10.50.21.jpeg",
            "type": "image"
      },
      {
            "name": "WhatsApp Image 2026-09-30 at 10.50.46.jpeg",
            "path": "/lab_files/EXP11/WhatsApp Image 2026-09-30 at 10.50.46.jpeg",
            "type": "image"
      }
],
    title: "Designing Asynchronous Data Interrupt-Driven UART Communication Using HAL Library",
    subtitle: "Non-blocking RX/TX Circular Ring Buffers for High-Throughput Packet Processing",
    difficulty: "Advanced",
    estimatedTime: "50 mins",
    objectives: [
      "Implement non-blocking asynchronous UART communication using HAL interrupts",
      "Design circular ring buffer data structure to eliminate byte loss",
      "Handle UART overrun (ORE), noise (NE), and framing (FE) error flags",
      "Process background data packets without blocking main loop execution"
    ],
    hardwareReq: [
      "NUCLEO-H753ZI Board",
      "PC Serial Terminal"
    ],
    theory: `At high baud rates (e.g. 115200 or 921600 bps), processing data character-by-character inside ISR can cause buffer overruns.

A **Circular Ring Buffer** uses head and tail pointers:
- **Write Pointer (Head)**: Incremented by UART RX Interrupt Handler.
- **Read Pointer (Tail)**: Incremented by main application loop during packet processing.

$$\\text{Buffer Full} \\iff (\\text{Head} + 1) \\bmod N == \\text{Tail}$$`,
    pinConnections: [
      { pin: "PD8", function: "USART3_TX", target: "VCP TX" },
      { pin: "PD9", function: "USART3_RX", target: "VCP RX" }
    ],
    cubeIdeSetup: [
      "Enable USART3 in Asynchronous Mode.",
      "In NVIC, enable USART3 global interrupt with Priority = 5.",
      "Generate Code."
    ],
    codeSnippet: `/* USER CODE BEGIN Header */
/**
  * @file           : main.c
  * @brief          : Experiment 11 - Timer-Based Time Delay Generation
  * @description    : Precise hardware millisecond delays using TIM2 Timer
  */
/* USER CODE END Header */
#include "main.h"

extern TIM_HandleTypeDef htim2;
void SystemClock_Config(void);
static void MX_GPIO_Init(void);
static void MX_TIM2_Init(void);

void TIM2_Delay_ms(uint16_t ms)
{
  __HAL_TIM_SET_COUNTER(&htim2, 0);
  HAL_TIM_Base_Start(&htim2);
  while (__HAL_TIM_GET_COUNTER(&htim2) < ms);
  HAL_TIM_Base_Stop(&htim2);
}

int main(void)
{
  HAL_Init();
  SystemClock_Config();
  MX_GPIO_Init();
  MX_TIM2_Init();

  while (1)
  {
    HAL_GPIO_TogglePin(GPIOB, GPIO_PIN_0);
    TIM2_Delay_ms(500); // 500 ms hardware timer delay
  }
}`,
    quiz: [
      {
        question: "What hardware condition causes a UART Overrun Error (ORE)?",
        options: [
          "A new byte arrives in the receive shift register before the previous byte was read from data register",
          "Baud rate is too low",
          "Voltage exceeds 3.3V",
          "Stop bit is missing"
        ],
        correct: 0,
        explanation: "Overrun occurs when incoming data overwrites unread data in the UART hardware buffer."
      }
    ]
  },
  {
    id: "lab-12",
    number: 12,
    youtubeUrl: "https://www.youtube.com/watch?v=U7mN4lz8gOM",
    youtubeEmbedUrl: "https://www.youtube-nocookie.com/embed/U7mN4lz8gOM",
    youtubeThumbnail: "/lab_files/EXP12/youtube_thumbnail.jpg",
    files: [
      {
            "name": "WhatsApp Image 2026-10-03 at 00.30.51.jpeg",
            "path": "/lab_files/EXP12/WhatsApp Image 2026-10-03 at 00.30.51.jpeg",
            "type": "image"
      },
      {
            "name": "WhatsApp Video 2026-10-04 at 15.21.11.mp4",
            "path": "/lab_files/EXP12/WhatsApp Video 2026-10-04 at 15.21.11.mp4",
            "type": "video"
      },
      {
            "name": "youtube_thumbnail.jpg",
            "path": "/lab_files/EXP12/youtube_thumbnail.jpg",
            "type": "image"
      },
      {
            "name": "YouTube Video Demonstration (ID: U7mN4lz8gOM)",
            "path": "https://www.youtube.com/watch?v=U7mN4lz8gOM",
            "embedUrl": "https://www.youtube-nocookie.com/embed/U7mN4lz8gOM",
            "thumbnail": "/lab_files/EXP12/youtube_thumbnail.jpg",
            "type": "youtube",
            "youtubeId": "U7mN4lz8gOM"
      }
],
    title: "Synthesizing Data Streams from UART to I2C Peripheral Displays",
    subtitle: "Data Protocol Conversion, String Parsing, and Multi-Peripheral Synchronization",
    difficulty: "Intermediate",
    estimatedTime: "50 mins",
    objectives: [
      "Receive formatted sensor data strings over UART from PC or external modules",
      "Parse key-value pairs from incoming UART text buffer (e.g. 'TEMP:24.5')",
      "Bridge UART protocol data streams onto I2C bus 16x2 LCD display",
      "Synchronize multi-peripheral timing between asynchronous UART and synchronous I2C"
    ],
    hardwareReq: [
      "NUCLEO-H753ZI Board",
      "I2C 16x2 LCD Display (PB8/PB9)",
      "PC Serial Port"
    ],
    theory: `Embedded gateways frequently convert asynchronous serial data streams (UART) into synchronous bus display commands (I2C).

Data Pipeline:
\`\`\`
[PC Serial TX] ---> (UART3 RX IT) ---> [Ring Buffer] ---> [Parser Routine] ---> (I2C Master Transmit) ---> [16x2 LCD]
\`\`\``,
    pinConnections: [
      { pin: "PD8/PD9", function: "USART3 TX/RX", target: "PC Data Stream Source" },
      { pin: "PB8/PB9", function: "I2C1 SCL/SDA", target: "LCD Display Bus" }
    ],
    cubeIdeSetup: [
      "Configure USART3 Asynchronous (115200 Baud) with NVIC Interrupt.",
      "Configure I2C1 Standard Mode (100 kHz).",
      "Generate Code."
    ],
    codeSnippet: `/* USER CODE BEGIN Header */
/**
  * @file           : main.c
  * @brief          : Experiment 12 - Pulse Width Modulation (PWM) LED Dimmer
  * @description    : Generating PWM Signal on TIM2 Channel 1 (PA0) to vary LED brightness
  */
/* USER CODE END Header */
#include "main.h"

extern TIM_HandleTypeDef htim2;
void SystemClock_Config(void);
static void MX_GPIO_Init(void);
static void MX_TIM2_Init(void);

int main(void)
{
  HAL_Init();
  SystemClock_Config();
  MX_GPIO_Init();
  MX_TIM2_Init();

  /* Start TIM2 PWM Channel 1 */
  HAL_TIM_PWM_Start(&htim2, TIM_CHANNEL_1);

  uint16_t duty_cycle = 0;
  int8_t step = 10;

  while (1)
  {
    /* Update PWM Duty Cycle (CCR1) */
    __HAL_TIM_SET_COMPARE(&htim2, TIM_CHANNEL_1, duty_cycle);

    duty_cycle += step;
    if (duty_cycle >= 1000 || duty_cycle <= 0)
    {
      step = -step; // Reverse breathing direction
    }
    HAL_Delay(15);
  }
}`,
    quiz: [
      {
        question: "What is the primary function of a protocol bridge in embedded systems?",
        options: [
          "To translate data packets between different bus standards (e.g. UART to I2C)",
          "To convert DC voltage to AC",
          "To increase MCU clock speed",
          "To ground unused pins"
        ],
        correct: 0,
        explanation: "Protocol bridges map data from one communication standard into another."
      }
    ]
  },
  {
    id: "lab-13",
    number: 13,
    youtubeUrl: "https://www.youtube.com/watch?v=chwIShPhbuk",
    youtubeEmbedUrl: "https://www.youtube-nocookie.com/embed/chwIShPhbuk",
    youtubeThumbnail: "/lab_files/EXP13/youtube_thumbnail.jpg",
    files: [
      {
            "name": "youtube_thumbnail.jpg",
            "path": "/lab_files/EXP13/youtube_thumbnail.jpg",
            "type": "image"
      },
      {
            "name": "YouTube Video Demonstration (ID: chwIShPhbuk)",
            "path": "https://www.youtube.com/watch?v=chwIShPhbuk",
            "embedUrl": "https://www.youtube-nocookie.com/embed/chwIShPhbuk",
            "thumbnail": "/lab_files/EXP13/youtube_thumbnail.jpg",
            "type": "youtube",
            "youtubeId": "chwIShPhbuk"
      }
],
    title: "Developing a Rule-Based Automated Control System Using UART Communication",
    subtitle: "State Machine Logic, Threshold Parsing, and Remote Actuator Control",
    difficulty: "Intermediate",
    estimatedTime: "50 mins",
    objectives: [
      "Design Finite State Machine (FSM) driven by UART text commands",
      "Implement rule-based control logic for automated industrial switching",
      "Parse multi-parameter command strings (e.g. 'SET:RELAY=1', 'SET:FAN=50')",
      "Return status response packets to host PC"
    ],
    hardwareReq: [
      "NUCLEO-H753ZI Board",
      "Relay Module (PG3)",
      "User LEDs (PB0, PB7, PB14)"
    ],
    theory: `Rule-based control systems evaluate incoming command packets against pre-defined state rules:

Rules:
- Command \`AUTO_ON\`: Automated threshold checking enabled.
- Command \`RELAY=1\`: Override relay output HIGH.
- Command \`STATUS?\`: Output current system state dictionary.`,
    pinConnections: [
      { pin: "PG3", function: "Relay Control", target: "Relay Module Driver" },
      { pin: "PD8/PD9", function: "USART3 TX/RX", target: "Host Control Interface" }
    ],
    cubeIdeSetup: [
      "Configure USART3 with RX Interrupt enabled.",
      "Configure PG3 as GPIO_Output for Relay.",
      "Generate Code."
    ],
    codeSnippet: `/* USER CODE BEGIN Header */
/**
  * @file           : main.c
  * @brief          : Experiment 13 - Timer Input Capture Mode Frequency Measurement
  * @description    : Measuring signal frequency using TIM3 Channel 1 Input Capture
  */
/* USER CODE END Header */
#include "main.h"

extern TIM_HandleTypeDef htim3;
void SystemClock_Config(void);
static void MX_GPIO_Init(void);
static void MX_TIM3_Init(void);

uint32_t val1 = 0, val2 = 0, difference = 0;
uint8_t is_first_captured = 0;
uint32_t signal_frequency = 0;

void HAL_TIM_IC_CaptureCallback(TIM_HandleTypeDef *htim)
{
  if (htim->Channel == HAL_TIM_ACTIVE_CHANNEL_1)
  {
    if (is_first_captured == 0)
    {
      val1 = HAL_TIM_ReadCapturedValue(htim, TIM_CHANNEL_1);
      is_first_captured = 1;
    }
    else
    {
      val2 = HAL_TIM_ReadCapturedValue(htim, TIM_CHANNEL_1);

      if (val2 > val1) difference = val2 - val1;
      else difference = (0xFFFF - val1) + val2;

      signal_frequency = HAL_RCC_GetPCLK1Freq() / difference;
      is_first_captured = 0;
    }
  }
}

int main(void)
{
  HAL_Init();
  SystemClock_Config();
  MX_GPIO_Init();
  MX_TIM3_Init();

  HAL_TIM_IC_Start_IT(&htim3, TIM_CHANNEL_1);

  while (1)
  {
    HAL_Delay(250);
  }
}`,
    quiz: [
      {
        question: "What is the advantage of using a Finite State Machine (FSM) for command parsing?",
        options: [
          "Ensures predictable, deterministic state transitions without race conditions",
          "Doubles RAM memory size",
          "Eliminates need for timers",
          "Increases supply voltage"
        ],
        correct: 0,
        explanation: "FSMs structure code into explicit states and valid transitions, preventing illegal control states."
      }
    ]
  },
  {
    id: "lab-14",
    number: 14,
    files: [],
    title: "Designing a PWM Signal Generation Using STM32 Timers",
    subtitle: "Timer Prescaler, Auto-Reload Register (ARR), and Compare Register (CCR) Calculations",
    difficulty: "Intermediate",
    estimatedTime: "45 mins",
    objectives: [
      "Configure General Purpose Timer TIM3 in PWM Generation mode",
      "Calculate exact Prescaler (PSC) and Auto-Reload (ARR) register values for 1 kHz PWM",
      "Dynamically alter pulse duty cycle using \`__HAL_TIM_SET_COMPARE()\`",
      "Implement smooth LED brightness dimming (breathing effect)"
    ],
    hardwareReq: [
      "NUCLEO-H753ZI Board",
      "LD1 Green LED (PB0 attached to TIM3_CH3)"
    ],
    theory: `Timer PWM frequency formula:
$$f_{PWM} = \\frac{f_{TIM\\_CLK}}{(PSC + 1) \\times (ARR + 1)}$$

Duty Cycle formula:
$$\\text{Duty Cycle }(\\%) = \\frac{CCR}{ARR + 1} \\times 100$$

For 1 kHz output with 240 MHz clock:
- $PSC = 239 \\implies f_{cnt} = 1\\text{ MHz}$.
- $ARR = 999 \\implies f_{PWM} = 1\\text{ kHz}$.
- $CCR = 500 \\implies 50\\% \\text{ Duty Cycle}$.`,
    pinConnections: [
      { pin: "PB0", function: "TIM3_CH3 (PWM)", target: "LD1 Green LED" }
    ],
    cubeIdeSetup: [
      "Enable TIM3, Clock Source = Internal Clock.",
      "Channel 3 = PWM Generation CH3.",
      "PSC = 239, ARR = 999, Pulse = 0.",
      "Generate Code."
    ],
    codeSnippet: `/* USER CODE BEGIN Header */
/**
  * @file           : main.c
  * @brief          : Experiment 14 - Analog-to-Digital Converter (ADC) Interface
  * @description    : Reading Potentiometer Analog Voltage using ADC1 Channel 16 (PA0)
  */
/* USER CODE END Header */
#include "main.h"

extern ADC_HandleTypeDef hadc1;
void SystemClock_Config(void);
static void MX_GPIO_Init(void);
static void MX_ADC1_Init(void);

uint32_t adc_raw_val = 0;
float voltage = 0.0f;

int main(void)
{
  HAL_Init();
  SystemClock_Config();
  MX_GPIO_Init();
  MX_ADC1_Init();

  while (1)
  {
    /* Start ADC Conversion */
    HAL_ADC_Start(&hadc1);

    /* Poll for conversion completion */
    if (HAL_ADC_PollForConversion(&hadc1, 10) == HAL_OK)
    {
      adc_raw_val = HAL_ADC_GetValue(&hadc1); // 16-bit resolution (0 to 65535)
      voltage = ((float)adc_raw_val / 65535.0f) * 3.3f; // Convert to Voltage (0 to 3.3V)
    }

    HAL_ADC_Stop(&hadc1);
    HAL_Delay(100);
  }
}`,
    quiz: [
      {
        question: "Which register controls the HIGH duration (Duty Cycle) of a timer PWM output?",
        options: ["CCR (Capture Compare Register)", "PSC (Prescaler)", "ARR (Auto-Reload Register)", "CNT (Counter Register)"],
        correct: 0,
        explanation: "The CCR register sets the compare threshold value for high pulse time."
      }
    ]
  },
  {
    id: "lab-15",
    number: 15,
    files: [],
    title: "Designing a Servo Motor Position Control Using PWM",
    subtitle: "50 Hz RC Servo Control with Precise 1 ms to 2 ms Pulse Width Synthesis",
    difficulty: "Intermediate",
    estimatedTime: "45 mins",
    objectives: [
      "Configure Timer TIM2 for 50 Hz (20 ms period) standard RC Servo PWM generation",
      "Map 0° to 180° angular position to pulse widths between 1.0 ms (5% duty) and 2.0 ms (10% duty)",
      "Control SG90 / MG996R servo motor sweeps using HAL timer functions",
      "Analyze precise pulse width timing requirements"
    ],
    hardwareReq: [
      "NUCLEO-H753ZI Board",
      "SG90 Micro Servo Motor",
      "External 5V Power Supply"
    ],
    theory: `Standard RC Servos operate on a **50 Hz PWM frequency** (Period $T = 20\\text{ ms}$):
- **0° Position**: 1.0 ms HIGH pulse (5% Duty Cycle).
- **90° Position**: 1.5 ms HIGH pulse (7.5% Duty Cycle).
- **180° Position**: 2.0 ms HIGH pulse (10% Duty Cycle).

Timer Configuration ($f_{CLK} = 240\\text{ MHz}$):
- $PSC = 2399 \\implies f_{cnt} = 100\\text{ kHz}$ (10 µs tick).
- $ARR = 1999 \\implies T = 2000 \\times 10\\mu s = 20\\text{ ms}$ ($50\\text{ Hz}$).
- $CCR = 100 \\implies 1.0\\text{ ms} (0^\\circ)$.
- $CCR = 200 \\implies 2.0\\text{ ms} (180^\\circ)$.`,
    pinConnections: [
      { pin: "PA0", function: "TIM2_CH1 (PWM)", target: "Servo Signal Wire (Orange/Yellow)" },
      { pin: "5V", function: "Power Rail", target: "Servo Red VCC Wire" },
      { pin: "GND", function: "Ground", target: "Servo Brown/Black GND Wire" }
    ],
    cubeIdeSetup: [
      "Enable TIM2, Channel 1 = PWM Generation CH1.",
      "PSC = 2399, ARR = 1999, Pulse = 150 (90° Center).",
      "Confirm PA0 = TIM2_CH1.",
      "Generate Code."
    ],
    codeSnippet: `/* USER CODE BEGIN Header */
/**
  * @file           : main.c
  * @brief          : Experiment 15 - Multi-Channel ADC Conversion Using DMA
  * @description    : Circular DMA transfer of multi-channel ADC readings to memory buffer
  */
/* USER CODE END Header */
#include "main.h"

#define ADC_CHANNELS 2
uint32_t adc_dma_buffer[ADC_CHANNELS];

extern ADC_HandleTypeDef hadc1;
extern DMA_HandleTypeDef hdma_adc1;

void SystemClock_Config(void);
static void MX_GPIO_Init(void);
static void MX_DMA_Init(void);
static void MX_ADC1_Init(void);

int main(void)
{
  HAL_Init();
  SystemClock_Config();
  MX_GPIO_Init();
  MX_DMA_Init();
  MX_ADC1_Init();

  /* Start ADC1 Multi-Channel Conversion with Circular DMA */
  HAL_ADC_Start_DMA(&hadc1, (uint32_t*)adc_dma_buffer, ADC_CHANNELS);

  while (1)
  {
    uint32_t ch0_pot = adc_dma_buffer[0];
    uint32_t ch1_sensor = adc_dma_buffer[1];

    HAL_GPIO_TogglePin(GPIOB, GPIO_PIN_0);
    HAL_Delay(200);
  }
}`,
    quiz: [
      {
        question: "What PWM frequency is required to drive standard RC servo motors?",
        options: ["50 Hz (20 ms period)", "1 kHz", "10 kHz", "100 Hz"],
        correct: 0,
        explanation: "Standard RC servos require a 50 Hz PWM control frame rate."
      }
    ]
  },
  {
    id: "lab-16",
    number: 16,
    files: [],
    title: "Design and Implementation of a Bidirectional PWM-Controlled DC Motor Drive Using an H-Bridge Driver",
    subtitle: "L298N / L293D Dual H-Bridge Motor Driver Control with Direction Logic and PWM Speed Regulation",
    difficulty: "Intermediate",
    estimatedTime: "50 mins",
    objectives: [
      "Interface L298N dual H-bridge motor driver module to STM32",
      "Control DC motor rotation direction using GPIO directional control pins (IN1, IN2)",
      "Regulate DC motor speed using TIM4 PWM signal applied to Enable pin (ENA)",
      "Implement smooth acceleration and soft braking routines"
    ],
    hardwareReq: [
      "NUCLEO-H753ZI Board",
      "L298N H-Bridge Dual Motor Driver Module",
      "12V DC Motor",
      "External Power Supply (12V DC)"
    ],
    theory: `An **H-Bridge** circuit allows full bidirectional control of DC motors by switching 4 internal transistors:

Direction Logic:
- **Forward**: \`IN1 = HIGH\`, \`IN2 = LOW\`
- **Reverse**: \`IN1 = LOW\`, \`IN2 = HIGH\`
- **Brake**: \`IN1 = HIGH\`, \`IN2 = HIGH\` (or LOW/LOW)

Speed Control:
PWM signal applied to \`ENA\` pin scales effective armature voltage:
$$V_{eff} = V_{supply} \\times \\text{Duty Cycle}$$`,
    pinConnections: [
      { pin: "PD12", function: "TIM4_CH1 (PWM)", target: "L298N ENA (Speed Control)" },
      { pin: "PD13", function: "GPIO_Output", target: "L298N IN1 (Direction 1)" },
      { pin: "PD14", function: "GPIO_Output", target: "L298N IN2 (Direction 2)" }
    ],
    cubeIdeSetup: [
      "Configure TIM4 CH1 as PWM Generation CH1 (PD12).",
      "Configure PD13 and PD14 as GPIO_Output.",
      "PSC = 239, ARR = 999 (1 kHz PWM).",
      "Generate Code."
    ],
    codeSnippet: `/* USER CODE BEGIN Header */
/**
  * @file           : main.c
  * @brief          : Experiment 16 - Digital-to-Analog Converter (DAC) Waveform Generation
  * @description    : Generating Sine and Triangular Analog Waveforms on DAC1 Channel 1 (PA4)
  */
/* USER CODE END Header */
#include "main.h"
#include <math.h>

#define SINE_SAMPLES 32
uint32_t sine_table[SINE_SAMPLES];

extern DAC_HandleTypeDef hdac1;
void SystemClock_Config(void);
static void MX_GPIO_Init(void);
static void MX_DAC1_Init(void);

void Generate_Sine_Table(void)
{
  for (int i = 0; i < SINE_SAMPLES; i++)
  {
    sine_table[i] = (uint32_t)((sin(i * 2.0 * 3.14159 / SINE_SAMPLES) + 1.0) * (4095.0 / 2.0));
  }
}

int main(void)
{
  HAL_Init();
  SystemClock_Config();
  MX_GPIO_Init();
  MX_DAC1_Init();

  Generate_Sine_Table();
  HAL_DAC_Start(&hdac1, DAC_CHANNEL_1);

  while (1)
  {
    for (int i = 0; i < SINE_SAMPLES; i++)
    {
      HAL_DAC_SetValue(&hdac1, DAC_CHANNEL_1, DAC_ALIGN_12B_R, sine_table[i]);
      HAL_Delay(1);
    }
  }
}`,
    quiz: [
      {
        question: "How is motor rotation direction inverted using an H-Bridge driver?",
        options: [
          "By swapping logic levels on directional inputs IN1 and IN2",
          "By increasing PWM frequency to 100 kHz",
          "By grounding the enable pin",
          "By reducing supply voltage below 3V"
        ],
        correct: 0,
        explanation: "Swapping IN1 and IN2 reverses current polarity across motor terminals."
      }
    ]
  },
  {
    id: "lab-17",
    number: 17,
    files: [],
    title: "Designing a UART-Based Command-Controlled Servo Motor Positioning",
    subtitle: "Parsing Serial Angle Commands from PC Terminal to Drive PWM Servo Actuator",
    difficulty: "Intermediate",
    estimatedTime: "50 mins",
    objectives: [
      "Receive serial commands over UART3 from host PC (e.g., 'ANG:45', 'ANG:120')",
      "Extract integer target angle using string parsing (\`sscanf\`)",
      "Translate angle value (0° to 180°) into TIM2 PWM pulse duration",
      "Send positional telemetry confirmation back to PC serial console"
    ],
    hardwareReq: [
      "NUCLEO-H753ZI Board",
      "SG90 Micro Servo (PA0)",
      "PC Serial Terminal"
    ],
    theory: `Combines UART Interrupt RX and Timer PWM generation:
1. User types \`ANG:135\` into PC terminal.
2. UART RX Interrupt captures string and passes to command parser.
3. \`sscanf(buffer, "ANG:%d", &target_angle)\` extracts \`135\`.
4. Servo CCR updated to \`100 + (135 * 100 / 180) = 175\` (1.75 ms pulse).
5. Telemetry output \`[SERVO] Position set to 135 deg\` sent over UART TX.`,
    pinConnections: [
      { pin: "PA0", function: "TIM2_CH1 (PWM)", target: "Servo Signal Pin" },
      { pin: "PD8/PD9", function: "USART3 TX/RX", target: "PC Serial Console" }
    ],
    cubeIdeSetup: [
      "Enable TIM2 CH1 PWM Generation.",
      "Enable USART3 Asynchronous with NVIC RX Interrupt.",
      "Generate Code."
    ],
    codeSnippet: `/* USER CODE BEGIN Header */
/**
  * @file           : main.c
  * @brief          : Experiment 17 - SPI Interface Flash Memory & OLED Display Driver
  * @description    : Full-Duplex SPI SPI1 Transmit and Receive Protocol
  */
/* USER CODE END Header */
#include "main.h"

extern SPI_HandleTypeDef hspi1;
void SystemClock_Config(void);
static void MX_GPIO_Init(void);
static void MX_SPI1_Init(void);

uint8_t spi_tx_data[4] = {0x9F, 0x00, 0x00, 0x00}; // Read JEDEC ID Command
uint8_t spi_rx_data[4];

int main(void)
{
  HAL_Init();
  SystemClock_Config();
  MX_GPIO_Init();
  MX_SPI1_Init();

  /* Pull Chip Select LOW */
  HAL_GPIO_WritePin(GPIOD, GPIO_PIN_14, GPIO_PIN_RESET);

  /* SPI Full-Duplex Transfer */
  HAL_SPI_TransmitReceive(&hspi1, spi_tx_data, spi_rx_data, 4, 500);

  /* Pull Chip Select HIGH */
  HAL_GPIO_WritePin(GPIOD, GPIO_PIN_14, GPIO_PIN_SET);

  while (1)
  {
    HAL_Delay(500);
  }
}`,
    quiz: [
      {
        question: "Which C standard library function parses formatted integers from strings?",
        options: ["sscanf()", "itoa()", "strcmp()", "strcat()"],
        correct: 0,
        explanation: "sscanf reads formatted data from string buffers into numeric variables."
      }
    ]
  },
  {
    id: "lab-18",
    number: 18,
    files: [],
    title: "Designing a Single-Channel ADC Interfacing for Potentiometer Voltage Measurement",
    subtitle: "16-Bit Resolution ADC Sampling, LSB Calculations, and Analog Voltage Mapping",
    difficulty: "Beginner",
    estimatedTime: "40 mins",
    objectives: [
      "Configure 16-bit ADC1 on channel INP15 (PA3 / Arduino A0)",
      "Perform software-triggered single conversion using \`HAL_ADC_Start()\`",
      "Convert raw 16-bit digital value (0-65535) to measured voltage (0.0V - 3.3V)",
      "Analyze quantization error and ADC offset calibration"
    ],
    hardwareReq: [
      "NUCLEO-H753ZI Board",
      "10k Ohm Rotary Potentiometer",
      "Breadboard & Jumpers"
    ],
    theory: `The STM32H7 features up to 16-bit ADC resolution ($2^{16} = 65,536$ discrete digital levels).

Quantization Step Size (LSB):
$$1\\text{ LSB} = \\frac{V_{REF+}}{65535} = \\frac{3.3\\text{ V}}{65535} = 50.35\\;\\mu\\text{V}$$

Voltage Conversion Equation:
$$V_{IN} = \\text{RawADC} \\times \\left(\\frac{3.3\\text{ V}}{65535}\\right)$$`,
    pinConnections: [
      { pin: "PA3", function: "ADC1_INP15", target: "Potentiometer Wiper (A0)" },
      { pin: "3V3", function: "Power Rail", target: "Potentiometer Leg 1" },
      { pin: "GND", function: "Ground", target: "Potentiometer Leg 3" }
    ],
    cubeIdeSetup: [
      "In Pinout view, enable ADC1 -> Channel 15 Single-ended (PA3).",
      "Resolution = 16 bits, Data Alignment = Right.",
      "Generate Code."
    ],
    codeSnippet: `/* USER CODE BEGIN Header */
/**
  * @file           : main.c
  * @brief          : Experiment 18 - Interfacing External I2C EEPROM Memory
  * @description    : Reading and Writing Byte data to AT24C256 over I2C1
  */
/* USER CODE END Header */
#include "main.h"

#define EEPROM_ADDR 0xA0 // I2C Address of 24C256 EEPROM
extern I2C_HandleTypeDef hi2c1;
void SystemClock_Config(void);
static void MX_GPIO_Init(void);
static void MX_I2C1_Init(void);

uint8_t write_val = 0x42;
uint8_t read_val = 0;

int main(void)
{
  HAL_Init();
  SystemClock_Config();
  MX_GPIO_Init();
  MX_I2C1_Init();

  /* Write byte 0x42 to EEPROM Memory Address 0x0010 */
  HAL_I2C_Mem_Write(&hi2c1, EEPROM_ADDR, 0x0010, I2C_MEMADD_SIZE_16BIT, &write_val, 1, 500);
  HAL_Delay(10); // Wait for EEPROM internal write cycle completion

  /* Read byte back from EEPROM Memory Address 0x0010 */
  HAL_I2C_Mem_Read(&hi2c1, EEPROM_ADDR, 0x0010, I2C_MEMADD_SIZE_16BIT, &read_val, 1, 500);

  while (1)
  {
    if (read_val == 0x42)
    {
      HAL_GPIO_WritePin(GPIOB, GPIO_PIN_0, GPIO_PIN_SET); // Green LED ON if verification succeeds
    }
    HAL_Delay(250);
  }
}`,
    quiz: [
      {
        question: "What voltage change corresponds to 1 LSB in a 16-bit ADC with VREF = 3.3V?",
        options: ["50.35 µV", "3.3 mV", "0.80 mV", "1.22 mV"],
        correct: 0,
        explanation: "3.3V / 65535 = 50.35 µV per LSB."
      }
    ]
  },
  {
    id: "lab-19",
    number: 19,
    files: [
      {
            "name": "Experiment 19 Interfacing LM35 Temp.txt",
            "path": "/lab_files/EXP19/Experiment 19 Interfacing LM35 Temp.txt",
            "type": "document"
      },
      {
            "name": "VID20260928003339.mp4",
            "path": "/lab_files/EXP19/VID20260928003339.mp4",
            "type": "video"
      }
],
    title: "Designing a Multi-Channel ADC Interfacing for LM35 Temperature Sensor Measurement",
    subtitle: "Precision Analog Signal Processing, Linear Transfer Function, and Calibration",
    difficulty: "Intermediate",
    estimatedTime: "45 mins",
    objectives: [
      "Interface LM35 precision analog temperature sensor to ADC1 channel INP10 (PC0 / A1)",
      "Understand LM35 scale factor ($10\\text{ mV}/^\\circ\\text{C}$ with $0\\text{V} = 0^\\circ\\text{C}$)",
      "Implement moving average noise filter to stabilize sensor readings",
      "Convert analog millivolts into Celsius and Fahrenheit temperature values"
    ],
    hardwareReq: [
      "NUCLEO-H753ZI Board",
      "LM35 Precision Analog Temperature Sensor",
      "Breadboard & Jumpers"
    ],
    theory: `The LM35 is an analog temperature sensor producing an output voltage directly proportional to Celsius temperature:
$$V_{OUT} = 10\\text{ mV}/^\\circ\\text{C} = 0.010\\text{ V}/^\\circ\\text{C}$$

Temperature Formula:
$$\\text{Temp } (^\\circ\\text{C}) = \\frac{V_{IN} \\text{ (in Volts)}}{0.010} = V_{IN} \\times 100$$

Example: If ADC measures $0.250\\text{ V}$ ($250\\text{ mV}$), $\\text{Temp} = 0.250 \\times 100 = 25.0^\\circ\\text{C}$.`,
    pinConnections: [
      { pin: "PC0", function: "ADC1_INP10", target: "LM35 VOUT Pin (A1)" },
      { pin: "5V / 3V3", function: "Power Rail", target: "LM35 VCC Pin" },
      { pin: "GND", function: "Ground", target: "LM35 GND Pin" }
    ],
    cubeIdeSetup: [
      "Enable ADC1 Channel 10 (PC0).",
      "Resolution = 16 bits.",
      "Generate Code."
    ],
    codeSnippet: `/* USER CODE BEGIN Header */
/**
  * @file           : main.c
  * @brief          : Experiment 19 - Interfacing LM35 Temperature Sensor with NUCLEO-H753ZI Using ADC
  * @description    : Reading LM35 Analog Output on PA0 (ADC1_INP16) & Outputting Temperature over USART3
  */
/* USER CODE END Header */
#include "main.h"
#include <stdio.h>
#include <string.h>

extern ADC_HandleTypeDef hadc1;
extern UART_HandleTypeDef huart3;

void SystemClock_Config(void);
static void MX_GPIO_Init(void);
static void MX_ADC1_Init(void);
static void MX_USART3_UART_Init(void);

uint32_t adc_val = 0;
float voltage = 0.0f;
float temperature_c = 0.0f;
char uart_buf[64];

int main(void)
{
  HAL_Init();
  SystemClock_Config();
  MX_GPIO_Init();
  MX_ADC1_Init();
  MX_USART3_UART_Init();

  while (1)
  {
    HAL_ADC_Start(&hadc1);

    if (HAL_ADC_PollForConversion(&hadc1, 100) == HAL_OK)
    {
      adc_val = HAL_ADC_GetValue(&hadc1); // 16-bit ADC value (0-65535)
      voltage = ((float)adc_val / 65535.0f) * 3.3f; // Convert ADC raw value to Voltage
      temperature_c = voltage * 100.0f; // LM35 Scale factor: 10 mV / °C (1 V = 100 °C)

      sprintf(uart_buf, "LM35 Temp: %.2f C (ADC: %lu, Volt: %.3f V)\r\n", temperature_c, adc_val, voltage);
      HAL_UART_Transmit(&huart3, (uint8_t*)uart_buf, strlen(uart_buf), 200);
    }

    HAL_ADC_Stop(&hadc1);
    HAL_Delay(1000); // 1 Second Measurement Rate
  }
}`,
    quiz: [
      {
        question: "What is the voltage output scale factor of an LM35 temperature sensor?",
        options: ["10 mV per °C", "100 mV per °C", "1 mV per °C", "50 mV per °C"],
        correct: 0,
        explanation: "LM35 outputs 10 mV for every 1°C ambient temperature."
      }
    ]
  },
  {
    id: "lab-20",
    number: 20,
    files: [
      {
            "name": "Experiment 20.txt",
            "path": "/lab_files/EXP20/Experiment 20.txt",
            "type": "document"
      },
      {
            "name": "VID20260928124154.mp4",
            "path": "/lab_files/EXP20/VID20260928124154.mp4",
            "type": "video"
      }
],
    title: "Multi-Channel ADC Interfacing for LDR-Based Ambient Light Measurement",
    subtitle: "Light Dependent Resistor (LDR) Voltage Divider Circuit & Lux Estimation",
    difficulty: "Intermediate",
    estimatedTime: "45 mins",
    objectives: [
      "Build voltage divider circuit using Light Dependent Resistor (LDR) and 10k resistor",
      "Interface LDR voltage node to ADC1 channel INP13 (PC3 / A2)",
      "Analyze Cadmium-Sulfide (CdS) photoconductive resistance decrease under illumination",
      "Classify ambient light levels (DARK, DIM, NORMAL, BRIGHT)"
    ],
    hardwareReq: [
      "NUCLEO-H753ZI Board",
      "LDR (Light Dependent Resistor)",
      "10k Ohm Fixed Resistor",
      "Breadboard & Jumpers"
    ],
    theory: `An LDR changes resistance based on light intensity:
- **Darkness**: High resistance ($R_{LDR} \\approx 100\\text{ k}\\Omega - 1\\text{ M}\\Omega$).
- **Bright Light**: Low resistance ($R_{LDR} \\approx 100\\Omega - 1\\text{ k}\\Omega$).

Voltage Divider Equation:
$$V_{ADC} = V_{CC} \\times \\left( \\frac{R_{fixed}}{R_{LDR} + R_{fixed}} \\right)$$

As light intensity increases, $R_{LDR}$ drops, causing $V_{ADC}$ to rise towards 3.3V.`,
    pinConnections: [
      { pin: "PC3", function: "ADC1_INP13", target: "LDR & 10k Divider Junction (A2)" },
      { pin: "3V3", function: "Power Rail", target: "LDR Leg 1" },
      { pin: "GND", function: "Ground", target: "10k Resistor Leg 2" }
    ],
    cubeIdeSetup: [
      "Enable ADC1 Channel 13 (PC3).",
      "Resolution = 16 bits.",
      "Generate Code."
    ],
    codeSnippet: `/* USER CODE BEGIN Header */
/**
  * @file           : main.c
  * @brief          : Experiment 20 - Interfacing LDR Sensor Module with NUCLEO-H753ZI Using ADC
  * @description    : Measuring Light Intensity on PA4 (ADC1_INP18) & Outputting Percentages to Serial Monitor
  */
/* USER CODE END Header */
#include "main.h"
#include <stdio.h>
#include <string.h>

extern ADC_HandleTypeDef hadc1;
extern UART_HandleTypeDef huart3;

void SystemClock_Config(void);
static void MX_GPIO_Init(void);
static void MX_ADC1_Init(void);
static void MX_USART3_UART_Init(void);

uint32_t ldr_adc = 0;
float ldr_voltage = 0.0f;
float light_percent = 0.0f;
char tx_buf[64];

int main(void)
{
  HAL_Init();
  SystemClock_Config();
  MX_GPIO_Init();
  MX_ADC1_Init();
  MX_USART3_UART_Init();

  while (1)
  {
    HAL_ADC_Start(&hadc1);

    if (HAL_ADC_PollForConversion(&hadc1, 100) == HAL_OK)
    {
      ldr_adc = HAL_ADC_GetValue(&hadc1);
      ldr_voltage = ((float)ldr_adc / 65535.0f) * 3.3f;
      light_percent = (1.0f - (ldr_voltage / 3.3f)) * 100.0f; // Calculate Light Intensity %

      sprintf(tx_buf, "LDR Light: %.1f%% (ADC: %lu, Volt: %.2fV)\r\n", light_percent, ldr_adc, ldr_voltage);
      HAL_UART_Transmit(&huart3, (uint8_t*)tx_buf, strlen(tx_buf), 200);
    }

    HAL_ADC_Stop(&hadc1);
    HAL_Delay(500);
  }
}`,
    quiz: [
      {
        question: "How does the resistance of an LDR change as ambient light intensity increases?",
        options: ["Resistance decreases", "Resistance increases", "Resistance remains constant", "Resistance drops to zero negative ohms"],
        correct: 0,
        explanation: "Photons release charge carriers in CdS material, lowering electrical resistance."
      }
    ]
  },
  {
    id: "lab-21",
    number: 21,
    files: [
      {
            "name": "# Experiment 21. Interfacing LM35 a.txt",
            "path": "/lab_files/EXP21/# Experiment 21. Interfacing LM35 a.txt",
            "type": "document"
      },
      {
            "name": "VID20260928141703.mp4",
            "path": "/lab_files/EXP21/VID20260928141703.mp4",
            "type": "video"
      }
],
    title: "Displaying LM35 Temperature and LDR Light Intensity on an I²C LCD",
    subtitle: "Multi-Sensor ADC Acquisition & Real-Time Dual Line LCD Telemetry Rendering",
    difficulty: "Intermediate",
    estimatedTime: "50 mins",
    objectives: [
      "Sample LM35 (PC0 / A1) and LDR (PC3 / A2) concurrently using ADC Scan Mode",
      "Process multi-channel analog conversion data streams",
      "Format temperature (°C) and light status onto 16x2 I2C character LCD",
      "Implement automatic screen refresh timer"
    ],
    hardwareReq: [
      "NUCLEO-H753ZI Board",
      "LM35 Temperature Sensor (PC0)",
      "LDR Sensor Circuit (PC3)",
      "16x2 I2C LCD Display (PB8/PB9)"
    ],
    theory: `Combines multi-channel ADC sampling with I2C display output:
- **LCD Line 1**: \`TEMP: 26.4 C\`
- **LCD Line 2**: \`LIGHT: BRIGHT\`

ADC Scan Mode automatically sequences through Channel 10 (LM35) and Channel 13 (LDR) in a single conversion pass.`,
    pinConnections: [
      { pin: "PC0", function: "ADC1_INP10", target: "LM35 VOUT" },
      { pin: "PC3", function: "ADC1_INP13", target: "LDR Divider Node" },
      { pin: "PB8/PB9", function: "I2C1 SCL/SDA", target: "16x2 LCD Display" }
    ],
    cubeIdeSetup: [
      "Enable ADC1 Channels 10 & 13 in Scan Conversion Mode.",
      "Enable I2C1 in Standard Mode (100 kHz).",
      "Generate Code."
    ],
    codeSnippet: `/* USER CODE BEGIN Header */
/**
  * @file           : main.c
  * @brief          : Experiment 21 - Interfacing LM35 and LDR Displaying on I2C 16x2 LCD
  * @description    : Dual-Channel ADC Sampling (LM35 PA0 & LDR PA4) rendered on 16x2 I2C LCD
  */
/* USER CODE END Header */
#include "main.h"
#include <stdio.h>

extern ADC_HandleTypeDef hadc1;
extern I2C_HandleTypeDef hi2c1;

void SystemClock_Config(void);
static void MX_GPIO_Init(void);
static void MX_ADC1_Init(void);
static void MX_I2C1_Init(void);

void LCD_Init(void);
void LCD_SetCursor(uint8_t row, uint8_t col);
void LCD_SendString(char *str);
uint32_t Read_ADC_Channel(uint32_t channel);

int main(void)
{
  HAL_Init();
  SystemClock_Config();
  MX_GPIO_Init();
  MX_ADC1_Init();
  MX_I2C1_Init();

  LCD_Init();
  LCD_SetCursor(0, 0);
  LCD_SendString("LM35 & LDR Monitor");

  char line1[17];
  char line2[17];

  while (1)
  {
    /* Sample LM35 on ADC1 Channel 16 */
    uint32_t temp_raw = Read_ADC_Channel(ADC_CHANNEL_16);
    float temp_c = (((float)temp_raw / 65535.0f) * 3.3f) * 100.0f;

    /* Sample LDR on ADC1 Channel 18 */
    uint32_t ldr_raw = Read_ADC_Channel(ADC_CHANNEL_18);
    float light_pct = (1.0f - (((float)ldr_raw / 65535.0f))) * 100.0f;

    sprintf(line1, "Temp : %.1f C   ", temp_c);
    sprintf(line2, "Light: %.1f%%   ", light_pct);

    LCD_SetCursor(0, 0);
    LCD_SendString(line1);
    LCD_SetCursor(1, 0);
    LCD_SendString(line2);

    HAL_Delay(1000);
  }
}

uint32_t Read_ADC_Channel(uint32_t channel)
{
  ADC_ChannelConfTypeDef sConfig = {0};
  sConfig.Channel = channel;
  sConfig.Rank = ADC_REGULAR_RANK_1;
  sConfig.SamplingTime = ADC_SAMPLETIME_64CYCLES_5;
  HAL_ADC_ConfigChannel(&hadc1, &sConfig);

  HAL_ADC_Start(&hadc1);
  HAL_ADC_PollForConversion(&hadc1, 100);
  uint32_t val = HAL_ADC_GetValue(&hadc1);
  HAL_ADC_Stop(&hadc1);
  return val;
}`,
    quiz: [
      {
        question: "What ADC feature allows multiple channels to be sampled sequentially in a single pass?",
        options: ["Scan Conversion Mode", "Single Conversion Mode", "Injected Mode Offset", "Discontinuous Mode"],
        correct: 0,
        explanation: "Scan mode sequences through a defined list of analog input channels automatically."
      }
    ]
  },
  {
    id: "lab-22",
    number: 22,
    files: [],
    title: "Intelligent Environmental Control: Relay Switching Based on LDR and DC Motor Speed Control Based on LM35",
    subtitle: "Closed-Loop Closed Feedback Actuator Automation (Smart HVAC & Lighting Control)",
    difficulty: "Advanced",
    estimatedTime: "60 mins",
    objectives: [
      "Implement closed-loop environmental control algorithm",
      "Automate Relay switching based on LDR light threshold (Night light activation)",
      "Proportionally scale DC Motor speed (PWM) based on LM35 temperature threshold (Smart Fan)",
      "Construct multi-actuator autonomous system logic"
    ],
    hardwareReq: [
      "NUCLEO-H753ZI Board",
      "LM35 Sensor (PC0), LDR Circuit (PC3)",
      "Relay Module (PG3)",
      "L298N Driver & DC Fan Motor (PD12 PWM)"
    ],
    theory: `Autonomous Environmental Control Logic:

1. **Smart Lighting Rule**:
   $$\\text{If } V_{LDR} < 1.0\\text{ V (Dark)} \\implies \\text{Relay = ON (Night Light)}$$
   $$\\text{Else } \\implies \\text{Relay = OFF}$$

2. **Smart Cooling Fan Rule**:
   $$\\text{If } \\text{Temp} > 30.0^\\circ\\text{C} \\implies \\text{PWM Duty} = \\text{Proportional to } (\\text{Temp} - 30)^\\circ\\text{C}$$
   $$\\text{Else } \\implies \\text{Fan Speed = 0 (OFF)}$$`,
    pinConnections: [
      { pin: "PC0", function: "ADC1_INP10", target: "LM35 Temp Sensor" },
      { pin: "PC3", function: "ADC1_INP13", target: "LDR Light Sensor" },
      { pin: "PG3", function: "GPIO_Output", target: "Relay Module (Lighting)" },
      { pin: "PD12", function: "TIM4_CH1 (PWM)", target: "DC Fan Motor Driver ENA" }
    ],
    cubeIdeSetup: [
      "Configure ADC1 Channels 10 & 13.",
      "Configure TIM4 CH1 PWM (PD12) for Fan Speed.",
      "Configure PG3 as GPIO_Output for Relay.",
      "Generate Code."
    ],
    codeSnippet: `/* USER CODE BEGIN Header */
/**
  * @file           : main.c
  * @brief          : Experiment 22 - Real-Time Operating System (FreeRTOS) Task Creation
  * @description    : Multitasking with 2 FreeRTOS Tasks: Task1 (Blink LED), Task2 (Telemetry)
  */
/* USER CODE END Header */
#include "main.h"
#include "cmsis_os.h"

osThreadId_t TaskLEDHandle;
osThreadId_t TaskTelemetryHandle;

const osThreadAttr_t TaskLED_attributes = {
  .name = "TaskLED",
  .stack_size = 128 * 4,
  .priority = (osPriority_t) osPriorityNormal,
};

const osThreadAttr_t TaskTelemetry_attributes = {
  .name = "TaskTelemetry",
  .stack_size = 256 * 4,
  .priority = (osPriority_t) osPriorityBelowNormal,
};

void StartTaskLED(void *argument);
void StartTaskTelemetry(void *argument);

int main(void)
{
  HAL_Init();
  SystemClock_Config();
  MX_GPIO_Init();

  /* Initialize FreeRTOS Kernel */
  osKernelInitialize();

  /* Create Tasks */
  TaskLEDHandle = osThreadNew(StartTaskLED, NULL, &TaskLED_attributes);
  TaskTelemetryHandle = osThreadNew(StartTaskTelemetry, NULL, &TaskTelemetry_attributes);

  /* Start Scheduler */
  osKernelStart();

  while (1) {}
}

void StartTaskLED(void *argument)
{
  for(;;)
  {
    HAL_GPIO_TogglePin(GPIOB, GPIO_PIN_0);
    osDelay(500); // FreeRTOS Tick Delay
  }
}

void StartTaskTelemetry(void *argument)
{
  for(;;)
  {
    /* Background Telemetry Processing */
    osDelay(1000);
  }
}`,
    quiz: [
      {
        question: "What defines a closed-loop control system?",
        options: [
          "A system that measures feedback from sensors and adjusts actuators automatically to achieve target conditions",
          "A system without any sensors",
          "A system that requires constant manual button presses",
          "A circuit without ground"
        ],
        correct: 0,
        explanation: "Closed-loop systems continuously sample sensors and adjust outputs dynamically to maintain desired state."
      }
    ]
  },
  {
    id: "lab-23",
    number: 23,
    files: [],
    title: "Monitoring and Transmission of Sensor Data (LM35 & LDR) to PC with Actuator Status Display",
    subtitle: "Complete IoT Gateway Node: Multi-Sensor Sampling, Local LCD Telemetry & PC UART Console",
    difficulty: "Advanced",
    estimatedTime: "60 mins",
    objectives: [
      "Integrate ADC multi-channel sensor sampling (LM35 + LDR)",
      "Format JSON telemetry packets: \`{\"temp\":26.5,\"light\":1.8,\"relay\":1,\"fan\":750}\`",
      "Transmit telemetry stream over USART3 to host PC Dashboard",
      "Render real-time status summary on local I2C LCD display"
    ],
    hardwareReq: [
      "NUCLEO-H753ZI Board",
      "LM35 (PC0), LDR (PC3)",
      "I2C LCD (PB8/PB9)",
      "Relay & Fan Actuators",
      "PC USB Cable"
    ],
    theory: `Represents a complete industrial IoT edge node:
1. **Acquisition**: ADC samples ambient temperature and light intensity.
2. **Control Logic**: Decision engine updates Relay and Fan PWM outputs.
3. **Local HMI**: Displays status on 16x2 LCD.
4. **Cloud / PC Gateway**: Sends JSON formatted telemetry packets over UART VCP for database logging.`,
    pinConnections: [
      { pin: "PC0/PC3", function: "ADC Inputs", target: "LM35 & LDR Sensors" },
      { pin: "PB8/PB9", function: "I2C Bus", target: "16x2 LCD Screen" },
      { pin: "PD8/PD9", function: "UART Serial", target: "PC USB Gateway" }
    ],
    cubeIdeSetup: [
      "Configure ADC1 Scan Mode, TIM4 PWM, I2C1, and USART3.",
      "Generate Code."
    ],
    codeSnippet: `/* USER CODE BEGIN Header */
/**
  * @file           : main.c
  * @brief          : Experiment 23 - Inter-Task Communication in FreeRTOS Using Queues
  * @description    : Queue Passing Sensor Data between Producer Task and Consumer Task
  */
/* USER CODE END Header */
#include "main.h"
#include "cmsis_os.h"

osMessageQueueId_t QueueSensorDataHandle;
const osMessageQueueAttr_t QueueSensorData_attributes = {
  .name = "QueueSensorData"
};

typedef struct {
  uint32_t sensor_val;
  uint32_t timestamp;
} SensorMsg_t;

void StartProducerTask(void *argument);
void StartConsumerTask(void *argument);

int main(void)
{
  HAL_Init();
  SystemClock_Config();
  MX_GPIO_Init();

  osKernelInitialize();

  /* Create FreeRTOS Queue for 10 SensorMsg_t items */
  QueueSensorDataHandle = osMessageQueueNew(10, sizeof(SensorMsg_t), &QueueSensorData_attributes);

  osThreadNew(StartProducerTask, NULL, NULL);
  osThreadNew(StartConsumerTask, NULL, NULL);

  osKernelStart();
  while (1) {}
}

void StartProducerTask(void *argument)
{
  SensorMsg_t msg;
  uint32_t counter = 0;
  for(;;)
  {
    msg.sensor_val = counter++;
    msg.timestamp = osKernelGetTickCount();
    osMessageQueuePut(QueueSensorDataHandle, &msg, 0U, osWaitForever);
    osDelay(500);
  }
}

void StartConsumerTask(void *argument)
{
  SensorMsg_t received_msg;
  for(;;)
  {
    if (osMessageQueueGet(QueueSensorDataHandle, &received_msg, NULL, osWaitForever) == osOK)
    {
      HAL_GPIO_TogglePin(GPIOB, GPIO_PIN_0); // Toggle LED on msg receive
    }
  }
}`,
    quiz: [
      {
        question: "Why is JSON format widely used for telemetry logging in IoT edge nodes?",
        options: [
          "It is human-readable, self-describing, and easily parsed by web and database backend services",
          "It uses binary machine code",
          "It requires no serial baud rate",
          "It eliminates ADC conversion steps"
        ],
        correct: 0,
        explanation: "JSON key-value formatting standardizes data exchanges between embedded nodes and cloud platforms."
      }
    ]
  },
  {
    id: "lab-24",
    number: 24,
    files: [],
    title: "Developing a CAN Peripheral Initialization and Loopback Communication Test",
    subtitle: "FDCAN Bus Controller Initialization, Bit Timing (500 kbps), and Self-Test Diagnostics",
    difficulty: "Advanced",
    estimatedTime: "50 mins",
    objectives: [
      "Configure FDCAN1 (Flexible Data-Rate CAN) peripheral on STM32H753ZI",
      "Calculate nominal CAN bit timing for 500 kbps bus speed",
      "Configure FDCAN internal Loopback Mode for standalone hardware diagnostics",
      "Transmit and receive CAN message frames with 11-bit standard identifiers"
    ],
    hardwareReq: [
      "NUCLEO-H753ZI Board (STM32H7 FDCAN peripheral)"
    ],
    theory: `Controller Area Network (CAN) is a robust differential serial bus used extensively in automotive and industrial automation.

On STM32H753ZI, the peripheral is **FDCAN** (supports classic CAN 2.0B up to 1 Mbps and CAN-FD up to 8 Mbps).

**Internal Loopback Mode**:
Disconnects physical TX/RX pins internally. Transmitted messages are fed directly into the internal receiver buffer. Allows verification of FDCAN bit timing, filters, and interrupts without external transceiver hardware!`,
    pinConnections: [
      { pin: "PD0", function: "FDCAN1_RX", target: "Internal Loopback / CAN RX" },
      { pin: "PD1", function: "FDCAN1_TX", target: "Internal Loopback / CAN TX" }
    ],
    cubeIdeSetup: [
      "In Pinout view, select Connectivity -> FDCAN1.",
      "Set Mode = External/Internal Loopback.",
      "Frame Format = Classic CAN 2.0B.",
      "Nominal Prescaler = 10, Nominal Sync Jump Width = 1, TimeSeg1 = 13, TimeSeg2 = 2 (500 kbps).",
      "Confirm PD0 = FDCAN1_RX, PD1 = FDCAN1_TX.",
      "Generate Code."
    ],
    codeSnippet: `/* USER CODE BEGIN Header */
/**
  * @file           : main.c
  * @brief          : Experiment 24 - Hardware Cryptography Engine (AES-128 / SHA-256)
  * @description    : Accelerated Hardware SHA-256 Hash Computation on STM32H753ZI
  */
/* USER CODE END Header */
#include "main.h"
#include <string.h>

extern HASH_HandleTypeDef hhash;
void SystemClock_Config(void);
static void MX_GPIO_Init(void);
static void MX_HASH_Init(void);

uint8_t input_msg[] = "eLearnTech STM32H753ZI Hardware Cryptography Test";
uint8_t sha256_output[32]; // 256 bits = 32 bytes

int main(void)
{
  HAL_Init();
  SystemClock_Config();
  MX_GPIO_Init();
  MX_HASH_Init();

  /* Execute Hardware SHA-256 Hash Calculation */
  HAL_HASH_SHA256_Start(&hhash, input_msg, strlen((char*)input_msg), sha256_output, 1000);

  while (1)
  {
    /* Indicate HASH Calculation Successful */
    HAL_GPIO_WritePin(GPIOB, GPIO_PIN_0, GPIO_PIN_SET);
    HAL_Delay(1000);
  }
}`,
    quiz: [
      {
        question: "What is the main purpose of CAN Internal Loopback Mode during development?",
        options: [
          "To test CAN controller configuration and code without needing external physical transceivers or second nodes",
          "To double the CAN bus baud rate",
          "To step down 12V to 3.3V",
          "To turn off the MCU clock"
        ],
        correct: 0,
        explanation: "Loopback mode internally connects TX back to RX for self-diagnostics."
      }
    ]
  },
  {
    id: "lab-25",
    number: 25,
    files: [],
    title: "Developing a CAN Communication Between Two STM32 Nucleo Boards",
    subtitle: "Physical Differential CAN Bus Interfacing (CAN_H / CAN_L), SN65HVD230 Transceivers, and Hardware Filtering",
    difficulty: "Advanced",
    estimatedTime: "60 mins",
    objectives: [
      "Connect two STM32 Nucleo boards via physical CAN bus using SN65HVD230 transceivers",
      "Understand differential signaling ($V_{CAN\\_H} - V_{CAN\\_L}$) and 120 Ω bus termination",
      "Configure FDCAN hardware acceptance filters (Mask & ID List modes)",
      "Transmit button press events from Node A to toggle LED on Node B"
    ],
    hardwareReq: [
      "2x NUCLEO-H753ZI Boards (Node A & Node B)",
      "2x SN65HVD230 3.3V CAN Transceiver Modules",
      "Twisted-pair cable with 120 Ohm termination resistors at both ends"
    ],
    theory: `Physical CAN uses **differential voltage** signaling across a twisted-pair cable:
- **Recessive State (Logic 1)**: $CAN\\_H = 2.5\\text{ V}$, $CAN\\_L = 2.5\\text{ V}$ ($V_{diff} = 0\\text{ V}$).
- **Dominant State (Logic 0)**: $CAN\\_H = 3.5\\text{ V}$, $CAN\\_L = 1.5\\text{ V}$ ($V_{diff} = 2.0\\text{ V}$).

Bus termination ($120\\>\\Omega$ resistors at each extreme end) prevents signal reflections on high-speed transmission lines.`,
    pinConnections: [
      { pin: "PD0", function: "FDCAN1_RX", target: "SN65HVD230 RXD Pin" },
      { pin: "PD1", function: "FDCAN1_TX", target: "SN65HVD230 TXD Pin" },
      { pin: "CAN_H Wire", function: "Differential High", target: "Node B CAN_H" },
      { pin: "CAN_L Wire", function: "Differential Low", target: "Node B CAN_L" }
    ],
    cubeIdeSetup: [
      "Configure FDCAN1 in Normal Operating Mode at 500 kbps.",
      "Configure Filter 0 to match Standard ID 0x321.",
      "Enable FDCAN RX FIFO 0 interrupt.",
      "Generate Code."
    ],
    codeSnippet: `/* USER CODE BEGIN Header */
/**
  * @file           : main.c
  * @brief          : Experiment 25 - Low-Power Operating Modes (Sleep, Stop, Standby)
  * @description    : Entering Low-Power Sleep Mode and Wakeup via EXTI Line 13 Interrupt
  */
/* USER CODE END Header */
#include "main.h"

void SystemClock_Config(void);
static void MX_GPIO_Init(void);

int main(void)
{
  HAL_Init();
  SystemClock_Config();
  MX_GPIO_Init();

  while (1)
  {
    /* Turn ON Green LED for 2 seconds */
    HAL_GPIO_WritePin(GPIOB, GPIO_PIN_0, GPIO_PIN_SET);
    HAL_Delay(2000);

    /* Turn OFF LED before entering Sleep */
    HAL_GPIO_WritePin(GPIOB, GPIO_PIN_0, GPIO_PIN_RESET);

    /* Suspend SysTick before entering low power mode */
    HAL_SuspendTick();

    /* Enter Sleep Mode (CPU clock stopped, peripherals remain active) */
    HAL_PWR_EnterSLEEPMode(PWR_MAINREGULATOR_ON, PWR_SLEEPENTRY_WFI);

    /* CPU Wakes Up Here after EXTI Push-Button Interrupt */
    HAL_ResumeTick();
  }
}

void HAL_GPIO_EXTI_Callback(uint16_t GPIO_Pin)
{
  if (GPIO_Pin == GPIO_PIN_13)
  {
    /* EXTI Button Wakeup Callback */
  }
}`,
    quiz: [
      {
        question: "Why are 120 Ohm termination resistors required at both ends of a physical CAN bus?",
        options: [
          "To match transmission line characteristic impedance and prevent signal wave reflections",
          "To power the CAN transceivers",
          "To limit maximum current to 1 mA",
          "To convert CAN to Ethernet"
        ],
        correct: 0,
        explanation: "120-ohm termination matches twisted pair characteristic impedance, absorbing reflections."
      }
    ]
  },
  {
    id: "lab-26",
    number: 26,
    files: [],
    title: "Designing a Sensor Data Acquisition and Transmission Over CAN Bus",
    subtitle: "Distributed Automotive Sensor Node: Multi-Channel ADC Acquisition, Payload Packing, and CAN Transmission",
    difficulty: "Advanced",
    estimatedTime: "60 mins",
    objectives: [
      "Sample LM35 temperature and LDR light sensors on Node A",
      "Pack multi-sensor float values into 8-byte CAN data payload",
      "Transmit telemetry frames over CAN bus to Central Display Master Node B",
      "Unpack CAN payload and render temperature and light telemetry on Node B I2C LCD"
    ],
    hardwareReq: [
      "2x NUCLEO-H753ZI Boards (Node A Sensor Transmitter & Node B Master Display)",
      "SN65HVD230 CAN Transceivers",
      "LM35 & LDR Sensors (Node A)",
      "16x2 I2C LCD (Node B)"
    ],
    theory: `Demonstrates a distributed automotive body electronics network:

**Payload Packing Architecture (8-Byte CAN Data Frame)**:
- **Bytes 0-3**: 32-bit IEEE 754 Floating-point Temperature Value ($^\\circ\\text{C}$).
- **Bytes 4-7**: 32-bit IEEE 754 Floating-point Light Voltage Value (V).

Node A packages sensor data into binary bytes and broadcasts CAN Frame \`ID: 0x400\`. Node B receives the frame, extracts float values, and updates local display.`,
    pinConnections: [
      { pin: "Node A: PC0/PC3", function: "ADC Inputs", target: "LM35 & LDR Sensors" },
      { pin: "Node A: PD0/PD1", function: "FDCAN1", target: "CAN Transceiver Module" },
      { pin: "Node B: PB8/PB9", function: "I2C1", target: "16x2 Character LCD" }
    ],
    cubeIdeSetup: [
      "Node A: Configure ADC1 Channels 10 & 13 and FDCAN1 (500 kbps).",
      "Node B: Configure FDCAN1 with Filter ID 0x400 and I2C1 LCD.",
      "Generate Code."
    ],
    codeSnippet: `/* USER CODE BEGIN Header */
/**
  * @file           : main.c
  * @brief          : Experiment 26 - Ethernet MAC / LwIP Network Communication
  * @description    : Initializing LwIP TCP/IP Stack & Transmitting UDP Telemetry Packets over RJ45
  */
/* USER CODE END Header */
#include "main.h"
#include "lwip.h"
#include "udp.h"
#include <string.h>

void SystemClock_Config(void);
static void MX_GPIO_Init(void);

void Send_UDP_Telemetry(void)
{
  struct udp_pcb *upcb = udp_new();
  ip_addr_t DestIPaddr;
  IP_ADDR4(&DestIPaddr, 192, 168, 1, 100); // Target PC IP Address

  if (upcb != NULL)
  {
    udp_connect(upcb, &DestIPaddr, 5000); // Target UDP Port 5000
    char data[] = "Hello from STM32H753ZI Ethernet LwIP!";
    struct pbuf *p = pbuf_alloc(PBUF_TRANSPORT, strlen(data), PBUF_RAM);
    if (p != NULL)
    {
      memcpy(p->payload, data, strlen(data));
      udp_send(upcb, p);
      pbuf_free(p);
    }
    udp_remove(upcb);
  }
}

int main(void)
{
  HAL_Init();
  SystemClock_Config();
  MX_GPIO_Init();
  MX_LWIP_Init();

  while (1)
  {
    /* Handle LwIP Network Packets */
    MX_LWIP_Process();

    /* Periodically Transmit UDP Telemetry Packet */
    static uint32_t last_tx = 0;
    if (HAL_GetTick() - last_tx >= 2000)
    {
      last_tx = HAL_GetTick();
      Send_UDP_Telemetry();
      HAL_GPIO_TogglePin(GPIOB, GPIO_PIN_0);
    }
  }
}`,
    quiz: [
      {
        question: "What is the maximum payload data length (DLC) for classic CAN 2.0B frames?",
        options: ["8 Bytes", "64 Bytes", "32 Bytes", "128 Bytes"],
        correct: 0,
        explanation: "Classic CAN 2.0B supports up to 8 bytes of data payload per frame (CAN-FD supports up to 64 bytes)."
      }
    ]
  }
];
