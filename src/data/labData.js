// Complete 26-Experiment Laboratory Manual for STM32 NUCLEO-H753ZI (eLearnTech@KLU)

export const labExperiments = [
  {
    id: "lab-1",
    number: 1,
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
  * @brief          : Experiment 1 - STM32 project initialization test
  */
/* USER CODE END Header */
#include "main.h"

void SystemClock_Config(void);
static void MX_GPIO_Init(void);

int main(void)
{
  /* MCU Configuration: Reset peripherals, Init Flash interface & SysTick */
  HAL_Init();

  /* Configure System Clock to 480 MHz */
  SystemClock_Config();

  /* Initialize all configured peripherals */
  MX_GPIO_Init();

  /* Infinite main loop */
  while (1)
  {
    /* Heartbeat test: Toggle LD1 Green LED */
    HAL_GPIO_TogglePin(GPIOB, GPIO_PIN_0);
    HAL_Delay(500);
  }
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
    codeSnippet: `#include "main.h"

int main(void)
{
  HAL_Init();
  SystemClock_Config();
  MX_GPIO_Init();

  while (1)
  {
    // Sequential Chasing Pattern
    HAL_GPIO_WritePin(GPIOB, GPIO_PIN_0, GPIO_PIN_SET);   // Green ON
    HAL_Delay(250);
    HAL_GPIO_WritePin(GPIOB, GPIO_PIN_7, GPIO_PIN_SET);   // Blue ON
    HAL_Delay(250);
    HAL_GPIO_WritePin(GPIOB, GPIO_PIN_14, GPIO_PIN_SET);  // Red ON
    HAL_Delay(250);

    HAL_GPIO_WritePin(GPIOB, GPIO_PIN_0 | GPIO_PIN_7 | GPIO_PIN_14, GPIO_PIN_RESET);
    HAL_Delay(500);
  }
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
    codeSnippet: `#include "main.h"

uint32_t t_green = 0;
uint32_t t_blue = 0;
uint32_t t_red = 0;

int main(void)
{
  HAL_Init();
  SystemClock_Config();
  MX_GPIO_Init();

  while (1)
  {
    uint32_t now = HAL_GetTick();

    /* Task 1: Green LED Toggles Every 100 ms */
    if (now - t_green >= 100) {
      t_green = now;
      HAL_GPIO_TogglePin(GPIOB, GPIO_PIN_0);
    }

    /* Task 2: Blue LED Toggles Every 500 ms */
    if (now - t_blue >= 500) {
      t_blue = now;
      HAL_GPIO_TogglePin(GPIOB, GPIO_PIN_7);
    }

    /* Task 3: Red LED Toggles Every 1000 ms */
    if (now - t_red >= 1000) {
      t_red = now;
      HAL_GPIO_TogglePin(GPIOB, GPIO_PIN_14);
    }
  }
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
    codeSnippet: `#include "main.h"

#define DEBOUNCE_TIME_MS 50
volatile uint32_t last_btn_tick = 0;

void HAL_GPIO_EXTI_Callback(uint16_t GPIO_Pin)
{
  if (GPIO_Pin == GPIO_PIN_13)
  {
    uint32_t current_tick = HAL_GetTick();
    if ((current_tick - last_btn_tick) > DEBOUNCE_TIME_MS)
    {
      HAL_GPIO_TogglePin(GPIOB, GPIO_PIN_7); // Toggle Blue LED
      last_btn_tick = current_tick;
    }
  }
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
    codeSnippet: `#include "main.h"

int main(void)
{
  HAL_Init();
  SystemClock_Config();
  MX_GPIO_Init();

  while (1)
  {
    /* Rapidly toggle pins to measure edge rise times on oscilloscope */
    HAL_GPIO_WritePin(GPIOE, GPIO_PIN_9 | GPIO_PIN_11, GPIO_PIN_SET);
    HAL_GPIO_WritePin(GPIOE, GPIO_PIN_9 | GPIO_PIN_11, GPIO_PIN_RESET);
  }
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
    codeSnippet: `#include "main.h"

#define RELAY_PIN GPIO_PIN_3
#define RELAY_PORT GPIOG

int main(void)
{
  HAL_Init();
  SystemClock_Config();
  MX_GPIO_Init();

  while (1)
  {
    /* Turn Relay ON for 3 seconds */
    HAL_GPIO_WritePin(RELAY_PORT, RELAY_PIN, GPIO_PIN_SET);
    HAL_Delay(3000);

    /* Turn Relay OFF for 3 seconds */
    HAL_GPIO_WritePin(RELAY_PORT, RELAY_PIN, GPIO_PIN_RESET);
    HAL_Delay(3000);
  }
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
    codeSnippet: `#include "main.h"
#include <stdio.h>

extern I2C_HandleTypeDef hi2c1;
#define LCD_ADDR 0x4E // 0x27 << 1

void LCD_SendCmd(uint8_t cmd) {
  uint8_t d_m = (cmd & 0xF0) | 0x0C; // EN=1, RS=0
  uint8_t d_l = (cmd & 0xF0) | 0x08; // EN=0, RS=0
  uint8_t data[4] = {d_m, d_l, ((cmd<<4)&0xF0)|0x0C, ((cmd<<4)&0xF0)|0x08};
  HAL_I2C_Master_Transmit(&hi2c1, LCD_ADDR, data, 4, 100);
}

void LCD_SendData(uint8_t data_char) {
  uint8_t d_m = (data_char & 0xF0) | 0x0D; // EN=1, RS=1
  uint8_t d_l = (data_char & 0xF0) | 0x09; // EN=0, RS=1
  uint8_t data[4] = {d_m, d_l, ((data_char<<4)&0xF0)|0x0D, ((data_char<<4)&0xF0)|0x09};
  HAL_I2C_Master_Transmit(&hi2c1, LCD_ADDR, data, 4, 100);
}

void LCD_Init(void) {
  HAL_Delay(50);
  LCD_SendCmd(0x30); HAL_Delay(5);
  LCD_SendCmd(0x30); HAL_Delay(1);
  LCD_SendCmd(0x32);
  LCD_SendCmd(0x28); // 4-bit mode, 2 lines
  LCD_SendCmd(0x0C); // Display ON, Cursor OFF
  LCD_SendCmd(0x01); // Clear Display
  HAL_Delay(2);
}

void LCD_Print(char* str) {
  while(*str) LCD_SendData(*str++);
}

int main(void) {
  HAL_Init(); SystemClock_Config(); MX_GPIO_Init(); MX_I2C1_Init();
  LCD_Init();

  while(1) {
    HAL_GPIO_WritePin(GPIOG, GPIO_PIN_3, GPIO_PIN_SET);
    LCD_SendCmd(0x80); LCD_Print("eLearnTech @ KLU");
    LCD_SendCmd(0xC0); LCD_Print("RELAY: [ACTIVE] ");
    HAL_Delay(2000);

    HAL_GPIO_WritePin(GPIOG, GPIO_PIN_3, GPIO_PIN_RESET);
    LCD_SendCmd(0xC0); LCD_Print("RELAY: [OFF]    ");
    HAL_Delay(2000);
  }
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
    codeSnippet: `#include "main.h"
#include <stdio.h>

extern UART_HandleTypeDef huart3;

int _write(int file, char *ptr, int len) {
  HAL_UART_Transmit(&huart3, (uint8_t *)ptr, len, HAL_MAX_DELAY);
  return len;
}

int main(void)
{
  HAL_Init(); SystemClock_Config(); MX_USART3_UART_Init();
  uint32_t counter = 0;

  printf("\\r\\n======================================\\r\\n");
  printf("  eLearnTech@KLU STM32 UART Telemetry\\r\\n");
  printf("======================================\\r\\n");

  while (1)
  {
    printf("Telemetry Packet #%lu | System Uptime: %lu ms\\r\\n", ++counter, HAL_GetTick());
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
    codeSnippet: `#include "main.h"
#include <stdio.h>

extern UART_HandleTypeDef huart3;
uint8_t rx_data;

void HAL_UART_RxCpltCallback(UART_HandleTypeDef *huart)
{
  if (huart->Instance == USART3)
  {
    /* Process received ASCII command character */
    if (rx_data == '1') {
      HAL_GPIO_WritePin(GPIOB, GPIO_PIN_0, GPIO_PIN_SET);   // Green ON
    } else if (rx_data == '0') {
      HAL_GPIO_WritePin(GPIOB, GPIO_PIN_0, GPIO_PIN_RESET); // Green OFF
    }

    /* Re-arm UART RX Interrupt for next byte */
    HAL_UART_Receive_IT(&huart3, &rx_data, 1);
  }
}

int main(void)
{
  HAL_Init(); SystemClock_Config(); MX_GPIO_Init(); MX_USART3_UART_Init();
  HAL_UART_Receive_IT(&huart3, &rx_data, 1);

  while (1) {}
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
    codeSnippet: `#include "main.h"
#include <stdio.h>

extern UART_HandleTypeDef huart3;
extern I2C_HandleTypeDef hi2c1;
uint8_t rx_byte;
char lcd_buf[17];
uint8_t buf_pos = 0;

int main(void)
{
  HAL_Init(); SystemClock_Config(); MX_GPIO_Init(); MX_I2C1_Init(); MX_USART3_UART_Init();
  HAL_UART_Receive_IT(&huart3, &rx_byte, 1);

  while (1) {}
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
    codeSnippet: `#include "main.h"

#define RING_BUF_SIZE 128
uint8_t ring_buffer[RING_BUF_SIZE];
volatile uint16_t head = 0;
volatile uint16_t tail = 0;
uint8_t rx_temp;

void HAL_UART_RxCpltCallback(UART_HandleTypeDef *huart) {
  if (huart->Instance == USART3) {
    uint16_t next = (head + 1) % RING_BUF_SIZE;
    if (next != tail) {
      ring_buffer[head] = rx_temp;
      head = next;
    }
    HAL_UART_Receive_IT(&huart3, &rx_temp, 1);
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
    codeSnippet: `#include "main.h"
#include <stdio.h>
#include <string.h>

// Bridges parsed UART strings to LCD screen
void ProcessStream(char* stream) {
  // Parse and route to I2C LCD
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
    codeSnippet: `#include "main.h"
#include <stdio.h>
#include <string.h>

void EvaluateCommand(char* cmd) {
  if (strcmp(cmd, "RELAY=1") == 0) {
    HAL_GPIO_WritePin(GPIOG, GPIO_PIN_3, GPIO_PIN_SET);
    printf("ACK: RELAY_ENABLED\\r\\n");
  } else if (strcmp(cmd, "RELAY=0") == 0) {
    HAL_GPIO_WritePin(GPIOG, GPIO_PIN_3, GPIO_PIN_RESET);
    printf("ACK: RELAY_DISABLED\\r\\n");
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
    codeSnippet: `#include "main.h"

extern TIM_HandleTypeDef htim3;

int main(void)
{
  HAL_Init(); SystemClock_Config(); MX_GPIO_Init(); MX_TIM3_Init();
  HAL_TIM_PWM_Start(&htim3, TIM_CHANNEL_3);

  uint16_t pwm_val = 0;
  int8_t step = 10;

  while (1)
  {
    __HAL_TIM_SET_COMPARE(&htim3, TIM_CHANNEL_3, pwm_val);
    pwm_val += step;
    if (pwm_val >= 1000 || pwm_val <= 0) step = -step;
    HAL_Delay(15);
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
    codeSnippet: `#include "main.h"

extern TIM_HandleTypeDef htim2;

void Set_Servo_Angle(uint8_t angle) {
  // Map 0-180 degrees to CCR values 100-200
  uint16_t ccr_val = 100 + ((angle * 100) / 180);
  __HAL_TIM_SET_COMPARE(&htim2, TIM_CHANNEL_1, ccr_val);
}

int main(void)
{
  HAL_Init(); SystemClock_Config(); MX_GPIO_Init(); MX_TIM2_Init();
  HAL_TIM_PWM_Start(&htim2, TIM_CHANNEL_1);

  while (1)
  {
    Set_Servo_Angle(0);   HAL_Delay(1000); // 0 degrees
    Set_Servo_Angle(90);  HAL_Delay(1000); // 90 degrees
    Set_Servo_Angle(180); HAL_Delay(1000); // 180 degrees
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
    codeSnippet: `#include "main.h"

extern TIM_HandleTypeDef htim4;

void Motor_SetSpeedDir(int16_t speed) {
  if (speed > 0) { // Forward
    HAL_GPIO_WritePin(GPIOD, GPIO_PIN_13, GPIO_PIN_SET);
    HAL_GPIO_WritePin(GPIOD, GPIO_PIN_14, GPIO_PIN_RESET);
    __HAL_TIM_SET_COMPARE(&htim4, TIM_CHANNEL_1, speed);
  } else if (speed < 0) { // Reverse
    HAL_GPIO_WritePin(GPIOD, GPIO_PIN_13, GPIO_PIN_RESET);
    HAL_GPIO_WritePin(GPIOD, GPIO_PIN_14, GPIO_PIN_SET);
    __HAL_TIM_SET_COMPARE(&htim4, TIM_CHANNEL_1, -speed);
  } else { // Stop
    HAL_GPIO_WritePin(GPIOD, GPIO_PIN_13 | GPIO_PIN_14, GPIO_PIN_RESET);
    __HAL_TIM_SET_COMPARE(&htim4, TIM_CHANNEL_1, 0);
  }
}

int main(void)
{
  HAL_Init(); SystemClock_Config(); MX_GPIO_Init(); MX_TIM4_Init();
  HAL_TIM_PWM_Start(&htim4, TIM_CHANNEL_1);

  while (1)
  {
    Motor_SetSpeedDir(750);  HAL_Delay(2000); // 75% Forward
    Motor_SetSpeedDir(0);    HAL_Delay(1000); // Stop
    Motor_SetSpeedDir(-750); HAL_Delay(2000); // 75% Reverse
    Motor_SetSpeedDir(0);    HAL_Delay(1000); // Stop
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
    codeSnippet: `#include "main.h"
#include <stdio.h>

extern TIM_HandleTypeDef htim2;
extern UART_HandleTypeDef huart3;

void Parse_Servo_Command(char* cmd) {
  int angle = 0;
  if (sscanf(cmd, "ANG:%d", &angle) == 1) {
    if (angle >= 0 && angle <= 180) {
      uint16_t ccr = 100 + ((angle * 100) / 180);
      __HAL_TIM_SET_COMPARE(&htim2, TIM_CHANNEL_1, ccr);
      printf("[ACK] Servo moved to %d deg (CCR=%u)\\r\\n", angle, ccr);
    }
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
    codeSnippet: `#include "main.h"
#include <stdio.h>

extern ADC_HandleTypeDef hadc1;

int main(void)
{
  HAL_Init(); SystemClock_Config(); MX_GPIO_Init(); MX_ADC1_Init(); MX_USART3_UART_Init();
  HAL_ADCEx_Calibration_Start(&hadc1, ADC_CALIB_OFFSET, ADC_SINGLE_ENDED);

  while (1)
  {
    HAL_ADC_Start(&hadc1);
    if (HAL_ADC_PollForConversion(&hadc1, 10) == HAL_OK)
    {
      uint32_t raw = HAL_ADC_GetValue(&hadc1);
      float volts = (raw * 3.3f) / 65535.0f;
      printf("Raw ADC: %lu | Voltage: %.3f V\\r\\n", raw, volts);
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
    codeSnippet: `#include "main.h"
#include <stdio.h>

extern ADC_HandleTypeDef hadc1;

float Read_LM35_Temperature(void) {
  HAL_ADC_Start(&hadc1);
  if (HAL_ADC_PollForConversion(&hadc1, 10) == HAL_OK) {
    uint32_t raw = HAL_ADC_GetValue(&hadc1);
    float volts = (raw * 3.3f) / 65535.0f;
    return volts * 100.0f; // 10mV / deg C
  }
  return 0.0f;
}

int main(void) {
  HAL_Init(); SystemClock_Config(); MX_GPIO_Init(); MX_ADC1_Init(); MX_USART3_UART_Init();
  while(1) {
    float temp_c = Read_LM35_Temperature();
    printf("LM35 Temperature: %.2f deg C | %.2f deg F\\r\\n", temp_c, (temp_c * 1.8f) + 32.0f);
    HAL_Delay(500);
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
    codeSnippet: `#include "main.h"
#include <stdio.h>

extern ADC_HandleTypeDef hadc1;

int main(void)
{
  HAL_Init(); SystemClock_Config(); MX_GPIO_Init(); MX_ADC1_Init(); MX_USART3_UART_Init();

  while (1)
  {
    HAL_ADC_Start(&hadc1);
    if (HAL_ADC_PollForConversion(&hadc1, 10) == HAL_OK)
    {
      uint32_t raw = HAL_ADC_GetValue(&hadc1);
      float v_ldr = (raw * 3.3f) / 65535.0f;
      char* light_lvl = (v_ldr < 0.8f) ? "DARK" : (v_ldr < 2.0f) ? "NORMAL" : "BRIGHT";
      printf("LDR Voltage: %.2f V | Ambient Condition: %s\\r\\n", v_ldr, light_lvl);
    }
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
    codeSnippet: `#include "main.h"
#include <stdio.h>

// Sampling routine updates LCD display lines 1 & 2
void Update_Sensor_LCD(float temp, float light_v) {
  // Renders formatted strings to I2C LCD
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
    codeSnippet: `#include "main.h"

extern TIM_HandleTypeDef htim4;
extern ADC_HandleTypeDef hadc1;

void Environmental_Control_Loop(float temp_c, float ldr_volts) {
  /* 1. Smart Lighting Control */
  if (ldr_volts < 1.0f) {
    HAL_GPIO_WritePin(GPIOG, GPIO_PIN_3, GPIO_PIN_SET); // Dark -> Relay ON
  } else {
    HAL_GPIO_WritePin(GPIOG, GPIO_PIN_3, GPIO_PIN_RESET); // Bright -> Relay OFF
  }

  /* 2. Smart Cooling Fan Control */
  if (temp_c > 30.0f) {
    uint16_t pwm = (uint16_t)((temp_c - 30.0f) * 100.0f);
    if (pwm > 1000) pwm = 1000;
    __HAL_TIM_SET_COMPARE(&htim4, TIM_CHANNEL_1, pwm);
  } else {
    __HAL_TIM_SET_COMPARE(&htim4, TIM_CHANNEL_1, 0); // Fan OFF
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
    codeSnippet: `#include "main.h"
#include <stdio.h>

void Broadcast_Telemetry(float temp, float light_v, uint8_t relay_st, uint16_t fan_pwm) {
  /* Transmit structured JSON telemetry over UART */
  printf("{\\\"temp\\\":%.2f,\\\"light_v\\\":%.2f,\\\"relay\\\":%u,\\\"fan_speed\\\":%u}\\r\\n",
          temp, light_v, relay_st, fan_pwm);
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
    codeSnippet: `#include "main.h"
#include <stdio.h>

extern FDCAN_HandleTypeDef hfdcan1;

FDCAN_TxHeaderTypeDef TxHeader;
FDCAN_RxHeaderTypeDef RxHeader;
uint8_t TxData[8] = {'K', 'L', 'U', '-', 'C', 'A', 'N', '1'};
uint8_t RxData[8];

int main(void)
{
  HAL_Init(); SystemClock_Config(); MX_GPIO_Init(); MX_FDCAN1_Init(); MX_USART3_UART_Init();

  /* Configure CAN Frame Header */
  TxHeader.Identifier = 0x123;
  TxHeader.IdType = FDCAN_STANDARD_ID;
  TxHeader.TxFrameType = FDCAN_DATA_FRAME;
  TxHeader.DataLength = FDCAN_DLC_BYTES_8;
  TxHeader.ErrorStateIndicator = FDCAN_ESI_ACTIVE;
  TxHeader.BitRateSwitch = FDCAN_BRS_OFF;
  TxHeader.FDFormat = FDCAN_CLASSIC_CAN;
  TxHeader.TxEventFifoControl = FDCAN_NO_TX_EVENTS;
  TxHeader.MessageMarker = 0;

  HAL_FDCAN_Start(&hfdcan1);

  /* Send CAN Message Frame */
  if (HAL_FDCAN_AddMessageToTxFifoQ(&hfdcan1, &TxHeader, TxData) == HAL_OK) {
    printf("FDCAN Loopback Tx Success! ID: 0x123\\r\\n");
  }

  HAL_Delay(50);

  /* Read from Rx FIFO 0 */
  if (HAL_FDCAN_GetRxMessage(&hfdcan1, FDCAN_RX_FIFO_0, &RxHeader, RxData) == HAL_OK) {
    printf("FDCAN Loopback Rx Received: %s\\r\\n", RxData);
  }

  while (1) {}
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
    codeSnippet: `#include "main.h"

extern FDCAN_HandleTypeDef hfdcan1;

void NodeA_SendButtonEvent(void) {
  FDCAN_TxHeaderTypeDef tx;
  tx.Identifier = 0x321;
  tx.IdType = FDCAN_STANDARD_ID;
  tx.TxFrameType = FDCAN_DATA_FRAME;
  tx.DataLength = FDCAN_DLC_BYTES_1;
  tx.FDFormat = FDCAN_CLASSIC_CAN;

  uint8_t msg = 0x01; // Button pressed flag
  HAL_FDCAN_AddMessageToTxFifoQ(&hfdcan1, &tx, &msg);
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
    codeSnippet: `#include "main.h"
#include <string.h>

extern FDCAN_HandleTypeDef hfdcan1;

void Transmit_Sensor_CAN_Packet(float temp, float light_v) {
  FDCAN_TxHeaderTypeDef tx;
  tx.Identifier = 0x400;
  tx.IdType = FDCAN_STANDARD_ID;
  tx.TxFrameType = FDCAN_DATA_FRAME;
  tx.DataLength = FDCAN_DLC_BYTES_8;
  tx.FDFormat = FDCAN_CLASSIC_CAN;

  uint8_t payload[8];
  memcpy(&payload[0], &temp, 4);    // Pack 4-byte float temp
  memcpy(&payload[4], &light_v, 4); // Pack 4-byte float light_v

  HAL_FDCAN_AddMessageToTxFifoQ(&hfdcan1, &tx, payload);
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
