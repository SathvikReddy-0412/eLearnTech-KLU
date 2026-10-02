// Comprehensive Lab Manual Data for STM32 H753ZI

export const labExperiments = [
  {
    id: "lab-1",
    number: 1,
    title: "GPIO Output & User LED Animation Control",
    subtitle: "Mastering STM32 General Purpose I/O Port Configuration and SysTick Delays",
    difficulty: "Beginner",
    estimatedTime: "30 mins",
    objectives: [
      "Understand GPIO peripheral bus clock enabling (RCC_AHB4ENR)",
      "Configure GPIO pins in Output Push-Pull mode with STM32 HAL",
      "Control on-board User LEDs (LD1 Green, LD2 Blue, LD3 Red)",
      "Implement non-blocking and SysTick based delay loops"
    ],
    hardwareReq: [
      "NUCLEO-H753ZI Development Board",
      "Micro-USB Cable for ST-LINK/V3E",
      "PC running STM32CubeIDE (v1.12+)"
    ],
    theory: `The STM32H753ZI microcontroller features up to 168 GPIO pins split into 11 ports (GPIOA to GPIOK). Each pin can be independently configured as input, output, alternate function (AF), or analog.

On the NUCLEO-H753ZI board, three user LEDs are pre-routed:
- Green LED (LD1): Port PB0
- Blue LED (LD2): Port PB7
- Red LED (LD3): Port PB14

Before any GPIO port can be accessed, its clock must be enabled in the Reset and Clock Control (RCC) peripheral. For Port B on H753ZI, bit 1 of \`RCC->AHB4ENR\` must be set. The HAL function \`__HAL_RCC_GPIOB_CLK_ENABLE()\` handles this automatically.

Key HAL Functions:
- \`HAL_GPIO_WritePin(GPIOx, GPIO_PIN_x, PinState)\`: Sets pin state (GPIO_PIN_SET or GPIO_PIN_RESET).
- \`HAL_GPIO_TogglePin(GPIOx, GPIO_PIN_x)\`: Inverts current state of output pin.
- \`HAL_Delay(uint32_t Delay)\`: Suspends execution for specified milliseconds using SysTick interrupt.`,
    pinConnections: [
      { pin: "PB0", function: "GPIO_Output", target: "LD1 Green LED (On-board)" },
      { pin: "PB7", function: "GPIO_Output", target: "LD2 Blue LED (On-board)" },
      { pin: "PB14", function: "GPIO_Output", target: "LD3 Red LED (On-board)" }
    ],
    cubeIdeSetup: [
      "Open STM32CubeIDE and create a new STM32 Project targeting 'NUCLEO-H753ZI'.",
      "In the Pinout & Configuration view, navigate to System Core -> GPIO.",
      "Click on PB0, set mode to 'GPIO_Output', label as 'LD1_GREEN'.",
      "Click on PB7, set mode to 'GPIO_Output', label as 'LD2_BLUE'.",
      "Click on PB14, set mode to 'GPIO_Output', label as 'LD3_RED'.",
      "In GPIO Parameter Settings, set Output Level = LOW, Mode = Output Push-Pull, Pull = No pull-up/pull-down, Speed = Low.",
      "Generate Code (Ctrl + S)."
    ],
    codeSnippet: `/* USER CODE BEGIN Header */
/**
  * @file           : main.c
  * @brief          : Lab 1 - User LED Animation on STM32 H753ZI
  */
/* USER CODE END Header */

#include "main.h"

void SystemClock_Config(void);
static void MX_GPIO_Init(void);

int main(void)
{
  /* MCU Configuration: Reset peripherals, Init Flash interface & SysTick */
  HAL_Init();
  SystemClock_Config();
  MX_GPIO_Init();

  /* Infinite loop */
  while (1)
  {
    /* Sequential Chasing LED Pattern */
    
    // Step 1: Green ON
    HAL_GPIO_WritePin(GPIOB, GPIO_PIN_0, GPIO_PIN_SET);
    HAL_Delay(200);
    
    // Step 2: Blue ON
    HAL_GPIO_WritePin(GPIOB, GPIO_PIN_7, GPIO_PIN_SET);
    HAL_Delay(200);
    
    // Step 3: Red ON
    HAL_GPIO_WritePin(GPIOB, GPIO_PIN_14, GPIO_PIN_SET);
    HAL_Delay(200);
    
    // Step 4: Turn All OFF
    HAL_GPIO_WritePin(GPIOB, GPIO_PIN_0 | GPIO_PIN_7 | GPIO_PIN_14, GPIO_PIN_RESET);
    HAL_Delay(400);

    /* Toggle all simultaneously */
    HAL_GPIO_TogglePin(GPIOB, GPIO_PIN_0 | GPIO_PIN_7 | GPIO_PIN_14);
    HAL_Delay(300);
    HAL_GPIO_TogglePin(GPIOB, GPIO_PIN_0 | GPIO_PIN_7 | GPIO_PIN_14);
    HAL_Delay(300);
  }
}

static void MX_GPIO_Init(void)
{
  GPIO_InitTypeDef GPIO_InitStruct = {0};

  /* Enable Port B Clock */
  __HAL_RCC_GPIOB_CLK_ENABLE();

  /* Configure Pins PB0, PB7, PB14 */
  GPIO_InitStruct.Pin = GPIO_PIN_0 | GPIO_PIN_7 | GPIO_PIN_14;
  GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
  GPIO_InitStruct.Pull = GPIO_NOPULL;
  GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;
  HAL_GPIO_Init(GPIOB, &GPIO_InitStruct);

  /* Set initial states LOW */
  HAL_GPIO_WritePin(GPIOB, GPIO_PIN_0 | GPIO_PIN_7 | GPIO_PIN_14, GPIO_PIN_RESET);
}`,
    quiz: [
      {
        question: "Which bus clock must be enabled before accessing GPIO Port B on the STM32H753ZI?",
        options: ["APB1 Clock", "AHB4 Clock", "APB2 Clock", "ITCM Bus Clock"],
        correct: 1,
        explanation: "In the STM32H7 architecture, GPIO ports (GPIOA to GPIOK) are attached to the AHB4 peripheral bus. Clock is enabled via RCC_AHB4ENR."
      },
      {
        question: "What is the function of GPIO Output Push-Pull mode?",
        options: [
          "It actively drives the output pin both HIGH (VDD) and LOW (GND).",
          "It leaves HIGH floating requiring an external pull-up resistor.",
          "It disconnects internal transistors and operates as pure analog.",
          "It limits the pin voltage to 1.2V core logic level."
        ],
        correct: 0,
        explanation: "Push-Pull mode uses two complementary transistors to actively drive the line high to VDD (3.3V) or low to GND (0V)."
      },
      {
        question: "On the NUCLEO-H753ZI, which pin is connected to the User Red LED (LD3)?",
        options: ["PA5", "PB0", "PB14", "PC13"],
        correct: 2,
        explanation: "LD1 is PB0 (Green), LD2 is PB7 (Blue), and LD3 is PB14 (Red)."
      }
    ]
  },
  {
    id: "lab-2",
    number: 2,
    title: "GPIO Input, Push Button & EXTI Interrupts",
    subtitle: "Hardware Interrupt Handling and Switch Debouncing using SysTick",
    difficulty: "Beginner",
    estimatedTime: "40 mins",
    objectives: [
      "Differentiate Polling vs Interrupt-driven GPIO input modes",
      "Configure External Interrupt lines (EXTI13) on PC13",
      "Understand the NVIC (Nested Vectored Interrupt Controller) priorities",
      "Implement software switch debouncing to eliminate false triggers"
    ],
    hardwareReq: [
      "NUCLEO-H753ZI Board",
      "On-board Blue User Push Button (B1)"
    ],
    theory: `In embedded systems, polling a digital pin inside an infinite main loop consumes CPU cycles and risks missing brief state changes. External Interrupts (EXTI) allow the CPU to sleep or process background tasks until a falling or rising edge detected on a pin immediately pauses the main execution thread to run an Interrupt Service Routine (ISR).

On NUCLEO-H753ZI:
- Blue Button B1 is connected to PC13.
- When pressed, B1 pulls PC13 to HIGH (Active High with external pull-down).
- PC13 maps to EXTI Line 13 through SYSCFG peripheral.
- EXTI15_10_IRQn handles interrupts for pins 10 to 15.

Debouncing Problem: Mechanical switches produce high-frequency electrical noise (bounce) for 5-20 ms upon contact. Without debouncing, a single button press triggers dozens of interrupt fires. Software debouncing tracks the timestamp using \`HAL_GetTick()\` to ignore edges occurring within 50ms of the initial trigger.`,
    pinConnections: [
      { pin: "PC13", function: "GPIO_EXTI13", target: "Blue Push Button B1 (Active HIGH)" },
      { pin: "PB7", function: "GPIO_Output", target: "LD2 Blue LED (Toggled on Interrupt)" }
    ],
    cubeIdeSetup: [
      "In STM32CubeIDE pinout view, set PC13 to 'GPIO_EXTI13'.",
      "Go to System Core -> GPIO -> PC13 tab.",
      "Set GPIO Mode to 'External Interrupt Mode with Rising edge trigger detection'.",
      "Set GPIO Pull-up/Pull-down to 'No pull-up and no pull-down'.",
      "Navigate to System Core -> NVIC.",
      "Enable checkbox for 'EXTI line[15:10] interrupts'. Set Preemption Priority = 5.",
      "Generate Code."
    ],
    codeSnippet: `/* USER CODE BEGIN 0 */
#define DEBOUNCE_DELAY_MS 50
volatile uint32_t last_interrupt_time = 0;

/**
  * @brief  EXTI line detection callback.
  * @param  GPIO_Pin Specifies the pins connected to the EXTI line.
  */
void HAL_GPIO_EXTI_Callback(uint16_t GPIO_Pin)
{
  if (GPIO_Pin == GPIO_PIN_13)
  {
    uint32_t current_time = HAL_GetTick();
    
    /* Debounce check: ignore triggers within 50ms */
    if ((current_time - last_interrupt_time) > DEBOUNCE_DELAY_MS)
    {
      // Toggle Blue LED (LD2) on valid button press
      HAL_GPIO_TogglePin(GPIOB, GPIO_PIN_7);
      
      last_interrupt_time = current_time;
    }
  }
}
/* USER CODE END 0 */

int main(void)
{
  HAL_Init();
  SystemClock_Config();
  MX_GPIO_Init();

  while (1)
  {
    /* CPU can sleep or run background low-priority tasks */
    HAL_PWR_EnterSLEEPMode(PWR_MAINREGULATOR_ON, PWR_SLEEPENTRY_WFI);
  }
}`,
    quiz: [
      {
        question: "Why are interrupts preferred over polling for push button detection in real-time embedded systems?",
        options: [
          "Interrupts require higher clock speed than polling.",
          "Polling wastes CPU clock cycles and may miss brief pin state transitions.",
          "Interrupts automatically eliminate mechanical contact bounce.",
          "GPIO pins cannot read digital inputs without EXTI configured."
        ],
        correct: 1,
        explanation: "Polling continuously queries the pin state in a loop, consuming 100% CPU. Interrupts allow the CPU to process other tasks or sleep until an event occurs."
      },
      {
        question: "Which interrupt vector handles EXTI Line 13 on the STM32H7?",
        options: ["EXTI0_IRQHandler", "EXTI9_5_IRQHandler", "EXTI15_10_IRQHandler", "EXTI13_IRQHandler"],
        correct: 2,
        explanation: "On ARM Cortex-M STM32 architecture, EXTI lines 10 through 15 share a single interrupt vector named EXTI15_10_IRQHandler."
      },
      {
        question: "How does software debouncing prevent false interrupt counts?",
        options: [
          "By increasing the clock frequency to 480 MHz.",
          "By setting the pin mode to Open-Drain.",
          "By ignoring subsequent edge triggers occurring within a short time window (e.g. 50ms).",
          "By disabling the NVIC controller entirely."
        ],
        correct: 2,
        explanation: "Software debouncing checks the elapsed time since the previous interrupt (e.g., via HAL_GetTick) and discards noise glitches within the debounce window."
      }
    ]
  },
  {
    id: "lab-3",
    number: 3,
    title: "16-Bit High-Speed ADC & Internal Temperature Sensor",
    subtitle: "Analog Sampling, DMA Data Streaming, and Voltage Signal Analysis",
    difficulty: "Intermediate",
    estimatedTime: "50 mins",
    objectives: [
      "Configure STM32H7 16-bit ADC (ADC1) in continuous sampling mode",
      "Setup Direct Memory Access (DMA1) for zero-CPU data transfers",
      "Read internal MCU junction temperature channel",
      "Convert raw 16-bit ADC digital values (0-65535) into Volts and Celsius"
    ],
    hardwareReq: [
      "NUCLEO-H753ZI Board",
      "Potentiometer (10k Ohm) connected to PA3 (Arduino A0)",
      "Breadboard & Jumper wires"
    ],
    theory: `The STM32H753ZI features three ultra-fast 16-bit ADCs capable of sampling up to 3.6 MSPS. 
Resolution = 16 bits (2^16 = 65,536 quantization levels).

1. **Quantization Step (LSB)**:
   $$LSB = \\frac{V_{REF+}}{2^{16} - 1} = \\frac{3.3\\text{ V}}{65535} \\approx 50.35\\;\\mu\\text{V}$$

2. **Voltage Conversion Formula**:
   $$V_{IN} = \\text{RawADC} \\times \\left(\\frac{3.3}{65535}\\right)$$

3. **Internal Temperature Sensor**:
   The internal temperature sensor is connected to ADC1 Channel 18 (or 15 depending on multiplexer). ST provides factory calibration values stored in system memory:
   - \`TS_CAL1\`: ADC raw value at 30 °C (VREF = 3.3V)
   - \`TS_CAL2\`: ADC raw value at 110 °C (VREF = 3.3V)

   $$\\text{Temp } (°\\text{C}) = \\frac{110 - 30}{\\text{TS\\_CAL2} - \\text{TS\\_CAL1}} \\times (\\text{RawADC} - \\text{TS\\_CAL1}) + 30$$`,
    pinConnections: [
      { pin: "PA3", function: "ADC1_INP15", target: "Potentiometer Wiper (Analog A0)" },
      { pin: "3V3", function: "Power", target: "Potentiometer Pin 1" },
      { pin: "GND", function: "Ground", target: "Potentiometer Pin 3" }
    ],
    cubeIdeSetup: [
      "In STM32CubeIDE Pinout, enable Analog -> ADC1.",
      "Select Channel 15 (PA3) as 'INP15 Single-ended'.",
      "Select Internal Channel 'Temperature Sensor'.",
      "Set Resolution to '16 bits', Data Alignment = Right.",
      "Set Scan Conversion Mode = Enabled, Continuous Conversion = Enabled.",
      "Under DMA Settings, add ADC1 stream. Mode = Circular, Increment Address = Peripheral NO, Memory YES.",
      "Data Width = Half Word (16-bit). Generate code."
    ],
    codeSnippet: `/* USER CODE BEGIN PV */
uint16_t adc_buffer[2]; // [0] = Potentiometer PA3, [1] = Internal Temp Sensor
float voltage = 0.0f;
float temperature_c = 0.0f;

/* Factory Calibration Pointers in H7 Flash Memory */
#define TS_CAL1 *((uint16_t*)(0x1FF1E820))
#define TS_CAL2 *((uint16_t*)(0x1FF1E840))
/* USER CODE END PV */

int main(void)
{
  HAL_Init();
  SystemClock_Config();
  MX_DMA_Init();
  MX_ADC1_Init();

  /* Calibrate ADC offset before starting */
  HAL_ADCEx_Calibration_Start(&hadc1, ADC_CALIB_OFFSET, ADC_SINGLE_ENDED);

  /* Start ADC DMA transferring 2 channels continuously */
  HAL_ADC_Start_DMA(&hadc1, (uint32_t*)adc_buffer, 2);

  while (1)
  {
    /* Calculate voltage from Channel 0 (PA3) */
    voltage = ((float)adc_buffer[0] * 3.3f) / 65535.0f;

    /* Calculate MCU Temperature from Channel 1 */
    uint16_t raw_temp = adc_buffer[1];
    temperature_c = ((110.0f - 30.0f) / ((float)TS_CAL2 - (float)TS_CAL1)) 
                    * ((float)raw_temp - (float)TS_CAL1) + 30.0f;

    HAL_Delay(100);
  }
}`,
    quiz: [
      {
        question: "What is the maximum resolution of the ADCs on the STM32H753ZI?",
        options: ["8-bit", "12-bit", "14-bit", "16-bit"],
        correct: 3,
        explanation: "Unlike older STM32F4/F7 series (12-bit), the high-performance STM32H7 features up to 16-bit resolution ADCs."
      },
      {
        question: "Why is DMA (Direct Memory Access) used with ADC continuous conversion?",
        options: [
          "It increases the VREF voltage to 5V.",
          "It automatically transfers ADC conversion results into RAM without interrupting the CPU.",
          "It converts digital data back into analog signals.",
          "It eliminates the need for RCC clock configuration."
        ],
        correct: 1,
        explanation: "DMA offloads data transfer from ADC data registers to RAM memory buffers without consuming CPU execution cycles."
      },
      {
        question: "For a 16-bit ADC operating with VREF = 3.3V, what is the voltage resolution per LSB step?",
        options: ["0.80 mV", "50.35 µV", "3.3 mV", "1.22 mV"],
        correct: 1,
        explanation: "3.3V / (65535) = 0.00005035 V = 50.35 µV per LSB count."
      }
    ]
  },
  {
    id: "lab-4",
    number: 4,
    title: "PWM Output & Hardware Timer Control",
    subtitle: "Precise Frequency & Duty Cycle Synthesis using TIM3 Prescaler and ARR Registers",
    difficulty: "Intermediate",
    estimatedTime: "45 mins",
    objectives: [
      "Master STM32 General Purpose Timers (TIM2/TIM3/TIM4)",
      "Calculate Prescaler (PSC) and Auto-Reload Register (ARR) values",
      "Generate Pulse Width Modulation (PWM) signals",
      "Implement LED dimming / breathing effects using Capture Compare Register (CCR)"
    ],
    hardwareReq: [
      "NUCLEO-H753ZI Board",
      "Oscilloscope or Logic Analyzer (Optional for waveform measurement)",
      "On-board LD1 Green LED (PB0 attached to TIM3_CH3)"
    ],
    theory: `Timers in the STM32H7 are hardware counters driven by internal clock buses (APB1/APB2 up to 240 MHz).

The output PWM Frequency ($f_{PWM}$) is calculated as:
$$f_{PWM} = \\frac{f_{TIM\\_CLK}}{(PSC + 1) \\times (ARR + 1)}$$

Where:
- $f_{TIM\\_CLK}$ = Timer clock frequency (e.g., 240 MHz on APB1 timer clock domain).
- $PSC$ = Prescaler 16-bit register value.
- $ARR$ = Auto-Reload Register value (defines counting period).
- $CCR$ = Capture Compare Register value (defines pulse width high time).

**Duty Cycle Formula**:
$$\\text{Duty Cycle }(\\%) = \\left( \\frac{CCR}{ARR + 1} \\right) \\times 100\\%$$

Example: For a 1 kHz PWM signal with 240 MHz clock:
1. Set $PSC = 239$ $\\rightarrow$ Timer counter clock = $240\\text{ MHz} / 240 = 1\\text{ MHz}$.
2. Set $ARR = 999$ $\\rightarrow$ $f_{PWM} = 1\\text{ MHz} / 1000 = 1000\\text{ Hz} = 1\\text{ kHz}$.
3. Set $CCR = 500$ $\\rightarrow$ Duty cycle = $500 / 1000 = 50\\%$.`,
    pinConnections: [
      { pin: "PB0", function: "TIM3_CH3 (PWM)", target: "LD1 Green LED (Dimming Control)" }
    ],
    cubeIdeSetup: [
      "In STM32CubeIDE Pinout, select Timers -> TIM3.",
      "Set Clock Source = Internal Clock.",
      "Set Channel 3 = 'PWM Generation CH3'.",
      "In Configuration Parameter Settings:",
      " - Prescaler (PSC) = 239",
      " - Counter Period (ARR) = 999",
      " - Pulse (CCR) = 0",
      " - PWM Mode = PWM mode 1",
      "Generate Code."
    ],
    codeSnippet: `/* USER CODE BEGIN 0 */
int main(void)
{
  HAL_Init();
  SystemClock_Config();
  MX_GPIO_Init();
  MX_TIM3_Init();

  /* Start PWM on TIM3 Channel 3 */
  HAL_TIM_PWM_Start(&htim3, TIM_CHANNEL_3);

  uint16_t duty_cycle = 0;
  int8_t step = 5;

  while (1)
  {
    /* Breathing LED Effect: Smoothly ramp duty cycle up and down */
    __HAL_TIM_SET_COMPARE(&htim3, TIM_CHANNEL_3, duty_cycle);

    duty_cycle += step;

    if (duty_cycle >= 1000 || duty_cycle <= 0)
    {
      step = -step; // Reverse direction
    }

    HAL_Delay(10); // Smooth transition timing
  }
}`,
    quiz: [
      {
        question: "If a timer clock is 240 MHz, Prescaler (PSC) = 239, and ARR = 999, what is the generated PWM frequency?",
        options: ["100 Hz", "1 kHz", "10 kHz", "240 kHz"],
        correct: 1,
        explanation: "f_timer = 240MHz / (239+1) = 1 MHz. f_PWM = 1MHz / (999+1) = 1,000 Hz = 1 kHz."
      },
      {
        question: "Which register controls the HIGH pulse duration (Duty Cycle) of a PWM signal?",
        options: ["PSC (Prescaler)", "ARR (Auto-Reload Register)", "CCR (Capture Compare Register)", "CNT (Counter Register)"],
        correct: 2,
        explanation: "CCR (Capture Compare Register) specifies the threshold value where output toggles between HIGH and LOW state."
      },
      {
        question: "What macro is used in STM32 HAL to update the PWM duty cycle dynamically in code?",
        options: [
          "__HAL_TIM_SET_COMPARE(&htim, channel, val)",
          "HAL_GPIO_WritePin(GPIOB, PIN, val)",
          "HAL_ADC_SetValue(&hadc, val)",
          "__HAL_RCC_TIM3_CLK_ENABLE()"
        ],
        correct: 0,
        explanation: "__HAL_TIM_SET_COMPARE writes directly into the CCR register of the specified timer channel."
      }
    ]
  },
  {
    id: "lab-5",
    number: 5,
    title: "UART Serial Communication & Command Line Interface",
    subtitle: "ST-LINK Virtual COM Port (VCP), printf Retargeting, and Asynchronous RX Interrupts",
    difficulty: "Intermediate",
    estimatedTime: "45 mins",
    objectives: [
      "Configure USART3 peripheral connected to ST-LINK VCP",
      "Retarget C standard library \`printf()\` function to UART",
      "Implement non-blocking UART byte reception using RX Interrupts (\`HAL_UART_Receive_IT\`)",
      "Build a lightweight Interactive Command Line Interface (CLI)"
    ],
    hardwareReq: [
      "NUCLEO-H753ZI Board connected to PC via ST-LINK USB",
      "Serial Terminal Software (PuTTY, TeraTerm, or STM32CubeIDE Terminal)"
    ],
    theory: `Universal Synchronous Asynchronous Receiver Transmitter (USART) is the backbone of serial communications in microcontrollers. On NUCLEO-H753ZI:
- USART3 TX is connected to PD8.
- USART3 RX is connected to PD9.
- These pins route directly into the ST-LINK/V3E chip, creating a USB Virtual COM Port (VCP) enumerated on your computer.

Standard Configuration:
- Baud Rate: 115200 bps
- Data Bits: 8, Parity: None, Stop Bits: 1 (8N1)

**printf Retargeting in GCC/ARM Toolchain**:
The C \`printf()\` function calls low-level system call \`_write()\`. By overriding \`_write()\`, we redirect all standard stdout output to \`HAL_UART_Transmit()\`.`,
    pinConnections: [
      { pin: "PD8", function: "USART3_TX", target: "ST-LINK VCP RX" },
      { pin: "PD9", function: "USART3_RX", target: "ST-LINK VCP TX" }
    ],
    cubeIdeSetup: [
      "In STM32CubeIDE Pinout, enable Connectivity -> USART3.",
      "Set Mode = Asynchronous.",
      "Check Pinout: PD8 = USART3_TX, PD9 = USART3_RX.",
      "In Parameter Settings: Baud Rate = 115200, Word Length = 8 Bits, Stop Bits = 1, Parity = None.",
      "Under NVIC Settings, check 'USART3 global interrupt'. Enable priority = 6.",
      "Generate Code."
    ],
    codeSnippet: `/* USER CODE BEGIN 0 */
#include <stdio.h>
#include <string.h>

extern UART_HandleTypeDef huart3;

/* Retarget printf output to USART3 ST-LINK VCP */
int _write(int file, char *ptr, int len)
{
  HAL_UART_Transmit(&huart3, (uint8_t *)ptr, len, HAL_MAX_DELAY);
  return len;
}

uint8_t rx_byte;
char command_buffer[64];
uint8_t buf_index = 0;

/* UART Interrupt Callback */
void HAL_UART_RxCpltCallback(UART_HandleTypeDef *huart)
{
  if (huart->Instance == USART3)
  {
    /* Echo back received character */
    HAL_UART_Transmit(&huart3, &rx_byte, 1, 10);

    if (rx_byte == '\\r' || rx_byte == '\\n')
    {
      command_buffer[buf_index] = '\\0';
      printf("\\r\\n[CLI] Processing Command: '%s'\\r\\n", command_buffer);

      if (strcmp(command_buffer, "LED ON") == 0) {
        HAL_GPIO_WritePin(GPIOB, GPIO_PIN_0, GPIO_PIN_SET);
        printf("[CLI] LD1 Green LED Turned ON\\r\\n");
      } else if (strcmp(command_buffer, "LED OFF") == 0) {
        HAL_GPIO_WritePin(GPIOB, GPIO_PIN_0, GPIO_PIN_RESET);
        printf("[CLI] LD1 Green LED Turned OFF\\r\\n");
      } else {
        printf("[CLI] Unknown command! Type 'LED ON' or 'LED OFF'\\r\\n");
      }

      buf_index = 0; // Reset buffer index
      printf("> ");
    }
    else if (buf_index < sizeof(command_buffer) - 1)
    {
      command_buffer[buf_index++] = rx_byte;
    }

    /* Re-enable UART RX interrupt for next character */
    HAL_UART_Receive_IT(&huart3, &rx_byte, 1);
  }
}
/* USER CODE END 0 */

int main(void)
{
  HAL_Init();
  SystemClock_Config();
  MX_GPIO_Init();
  MX_USART3_UART_Init();

  printf("\\r\\n=== STM32 H753ZI Lab CLI Terminal Started ===\\r\\n");
  printf("> ");

  /* Enable RX Interrupt for 1 byte */
  HAL_UART_Receive_IT(&huart3, &rx_byte, 1);

  while (1)
  {
    // Main loop free for background processing
  }
}`,
    quiz: [
      {
        question: "Which low-level C library system function must be overridden to retarget printf() to UART on STM32CubeIDE?",
        options: ["_read()", "_write()", "syscall_uart()", "fputc_stm32()"],
        correct: 1,
        explanation: "GCC ARM toolchain routes standard stdout formatted text through _write(int file, char *ptr, int len)."
      },
      {
        question: "Which USART peripheral and pins are routed to the ST-LINK Virtual COM Port on NUCLEO-H753ZI?",
        options: ["USART1 (PA9/PA10)", "USART2 (PA2/PA3)", "USART3 (PD8/PD9)", "UART4 (PC10/PC11)"],
        correct: 2,
        explanation: "On Nucleo-144 H7 boards, USART3 pins PD8 (TX) and PD9 (RX) are wired directly to the ST-LINK/V3 USB debugger interface."
      },
      {
        question: "Why must HAL_UART_Receive_IT() be called inside HAL_UART_RxCpltCallback()?",
        options: [
          "To reset the System Clock.",
          "Because HAL UART interrupt reception is single-shot and must be re-armed for subsequent characters.",
          "To clear the GPIO output buffer.",
          "To force the Baud Rate back to 115200."
        ],
        correct: 1,
        explanation: "HAL_UART_Receive_IT arms the interrupt for the requested length (1 byte). Once fired, the interrupt is disabled until re-armed in the callback."
      }
    ]
  },
  {
    id: "lab-6",
    number: 6,
    title: "Hardware Cryptographic Acceleration (AES & SHA-256)",
    subtitle: "High-Speed Hardware AES Encryption and Cryptographic Hashing on STM32 H753ZI",
    difficulty: "Advanced",
    estimatedTime: "60 mins",
    objectives: [
      "Understand the HW Cryptographic Peripheral (CRYP & HASH) exclusive to STM32 H753ZI",
      "Configure AES-256 Encryption in ECB/CBC/GCM modes",
      "Compute SHA-256 digests in hardware at >100 MB/s",
      "Benchmark execution time of Hardware Crypto vs Software Crypto implementations"
    ],
    hardwareReq: [
      "NUCLEO-H753ZI Development Board (STM32H753ZI with Cryptographic Acceleration)"
    ],
    theory: `The **STM32H753ZI** is distinguished from H743ZI by its integrated **Hardware Cryptographic Processor (CRYP)** and **HASH Processor**.

Key Hardware Capabilities:
- **Symmetric Encryption (CRYP)**: AES 128/192/256-bit (ECB, CBC, CTR, GCM, CCM) and DES/TDES.
- **Hash Accelerator (HASH)**: SHA-1, SHA-224, SHA-256, MD5, and HMAC authentication.

**Performance Advantage**:
Software AES-256 encryption running on Cortex-M7 at 480 MHz takes ~150-200 cycles per byte. Hardware CRYP engine consumes only 1-2 cycles per byte!
For a 1 MB payload, SW execution requires ~180 ms, whereas HW CRYP finishes in ~3.2 ms — a **55x performance gain** while leaving CPU free for real-time tasks.`,
    pinConnections: [
      { pin: "Internal", function: "CRYP Engine", target: "AES-256 Accelerator Bus" },
      { pin: "Internal", function: "HASH Engine", target: "SHA-256 Digest Bus" }
    ],
    cubeIdeSetup: [
      "In STM32CubeIDE Pinout, enable Security -> CRYP and Security -> HASH.",
      "For CRYP: Set Algorithm = AES ECB, Key Size = 256 bits, Data Type = 32-bit word.",
      "For HASH: Set Algorithm = SHA-256, DataType = 8-bit byte.",
      "Enable DMA controller streams for CRYP_IN and CRYP_OUT for high throughput.",
      "Generate Code."
    ],
    codeSnippet: `/* USER CODE BEGIN Header */
/**
  * @file           : main.c
  * @brief          : Lab 6 - Hardware AES-256 & SHA-256 Acceleration
  */
/* USER CODE END Header */

#include "main.h"
#include <stdio.h>
#include <string.h>

extern CRYP_HandleTypeDef hcryp;
extern HASH_HandleTypeDef chash;

/* 256-bit Key (32 bytes) */
uint8_t aes_key[32] = {
  0x60, 0x3d, 0xeb, 0x10, 0x15, 0xca, 0x71, 0xbe,
  0x2b, 0x73, 0xae, 0xf0, 0x85, 0x7d, 0x77, 0x81,
  0x1f, 0x35, 0x2c, 0x07, 0x3b, 0x61, 0x08, 0xf7,
  0x2d, 0x98, 0x10, 0xa3, 0x09, 0x14, 0xdf, 0xf4
};

/* 64-byte Input Plaintext */
uint8_t plaintext[64] = "STM32H753ZI High-Performance ARM Cortex-M7 Crypto Lab Manual!";
uint8_t ciphertext[64];
uint8_t sha256_digest[32];

int main(void)
{
  HAL_Init();
  SystemClock_Config();
  MX_CRYP_Init();
  MX_HASH_Init();

  uint32_t start_tick = HAL_GetTick();

  /* Execute Hardware AES-256 Encryption */
  if (HAL_CRYP_AESECB_Encrypt(&hcryp, plaintext, 64, ciphertext, 100) == HAL_OK)
  {
    printf("AES-256 Hardware Encryption SUCCESS!\\r\\n");
  }

  /* Compute SHA-256 Hash Digest in Hardware */
  if (HAL_HASH_SHA256_Start(&chash, plaintext, 64, sha256_digest, 100) == HAL_OK)
  {
    printf("SHA-256 Hardware Hash Digest Generated!\\r\\n");
  }

  uint32_t elapsed_ms = HAL_GetTick() - start_tick;
  printf("Crypto Operations Completed in: %lu ms\\r\\n", elapsed_ms);

  while (1) {}
}`,
    quiz: [
      {
        question: "What hardware feature distinguishes the STM32H753ZI from the STM32H743ZI?",
        options: [
          "Higher maximum CPU clock frequency",
          "Integrated Hardware Cryptographic & Hash Engines (CRYP / HASH)",
          "Support for 16-bit ADCs",
          "On-board ST-LINK debugger interface"
        ],
        correct: 1,
        explanation: "The '5' in H753 indicates security features: hardware CRYP (AES, DES) and HASH engines, absent on H743."
      },
      {
        question: "Roughly how much speedup does the hardware CRYP engine offer over software AES execution on Cortex-M7?",
        options: ["2x", "5x", "10x", ">50x"],
        correct: 3,
        explanation: "HW CRYP requires only 1-2 clock cycles per byte compared to ~180 cycles/byte in software, delivering over 50x speedup."
      },
      {
        question: "What output digest length (in bits) is produced by the SHA-256 hash algorithm?",
        options: ["128 bits", "192 bits", "256 bits (32 bytes)", "512 bits"],
        correct: 2,
        explanation: "SHA-256 outputs a fixed 256-bit (32-byte) cryptographic checksum regardless of input length."
      }
    ]
  },
  {
    id: "lab-7",
    number: 7,
    title: "FreeRTOS Real-Time Operating System Multitasking",
    subtitle: "Task Creation, Preemptive Priority Scheduling, Mutexes, and Queue IPC",
    difficulty: "Advanced",
    estimatedTime: "60 mins",
    objectives: [
      "Understand Real-Time OS fundamentals vs bare-metal super-loop architecture",
      "Create tasks using CMSIS-RTOS v2 API in STM32CubeIDE",
      "Configure Task Priorities, Stack allocations, and Tick rate (1000 Hz)",
      "Pass data safely between tasks using Inter-Process Communication (IPC) Queues"
    ],
    hardwareReq: [
      "NUCLEO-H753ZI Board",
      "All 3 On-board User LEDs (LD1 Green, LD2 Blue, LD3 Red)"
    ],
    theory: `In complex embedded applications (e.g. Ethernet networking, sensor polling, GUI rendering), a sequential \`while(1)\` loop becomes difficult to maintain. FreeRTOS provides deterministic preemptive scheduling where tasks execute concurrently based on strict priority.

**CMSIS-RTOS v2 Core Concepts**:
1. **Tasks**: Independent execution threads with dedicated stack memory.
2. **Preemption**: A higher-priority task instantly preempts a lower-priority task when ready.
3. **Queues**: Thread-safe FIFO message buffers for passing structs/values without race conditions.
4. **Semaphores / Mutexes**: Synchronization flags and mutual exclusion locks for shared hardware resources (e.g. UART).`,
    pinConnections: [
      { pin: "PB0", function: "LED_Green_Task", target: "Controlled by High Priority Task" },
      { pin: "PB7", function: "LED_Blue_Task", target: "Controlled by Medium Priority Task" },
      { pin: "PB14", function: "LED_Red_Task", target: "Controlled by Low Priority Task" }
    ],
    cubeIdeSetup: [
      "In STM32CubeIDE Pinout, enable Middleware -> FREERTOS.",
      "Select Interface = CMSIS_V2.",
      "Under Tasks and Queues tab, add Task 1:",
      " - Name: GreenLedTask, Priority: osPriorityNormal, Stack: 512 words.",
      "Add Task 2:",
      " - Name: SensorQueueTask, Priority: osPriorityAboveNormal, Stack: 512 words.",
      "Under Queues tab, add Queue:",
      " - Name: sensorDataQueue, Item Size: 4 bytes, Queue Size: 10.",
      "Generate Code."
    ],
    codeSnippet: `/* USER CODE BEGIN Header */
/**
  * @file           : main.c
  * @brief          : Lab 7 - FreeRTOS Multitasking on STM32 H753ZI
  */
/* USER CODE END Header */

#include "main.h"
#include "cmsis_os2.h"

osThreadId_t greenLedTaskHandle;
osThreadId_t sensorTaskHandle;
osMessageQueueId_t sensorQueueHandle;

/* Task 1: Flashes Green LED at 2 Hz (Normal Priority) */
void StartGreenLedTask(void *argument)
{
  for(;;)
  {
    HAL_GPIO_TogglePin(GPIOB, GPIO_PIN_0); // LD1 Green
    osDelay(250); // FreeRTOS tick delay (250 ms)
  }
}

/* Task 2: Simulates Sensor Reading & Posts to Queue (Above Normal Priority) */
void StartSensorTask(void *argument)
{
  uint32_t dummy_sensor_val = 100;
  for(;;)
  {
    dummy_sensor_val += 5;
    
    /* Post value to queue without blocking */
    osMessageQueuePut(sensorQueueHandle, &dummy_sensor_val, 0U, 0U);
    
    HAL_GPIO_TogglePin(GPIOB, GPIO_PIN_7); // LD2 Blue
    osDelay(500);
  }
}

int main(void)
{
  HAL_Init();
  SystemClock_Config();
  MX_GPIO_Init();

  /* Initialize RTOS Scheduler Kernel */
  osKernelInitialize();

  /* Create Message Queue */
  sensorQueueHandle = osMessageQueueNew(10, sizeof(uint32_t), NULL);

  /* Create Threads */
  const osThreadAttr_t green_attr = { .name = "GreenLed", .priority = osPriorityNormal, .stack_size = 512 * 4 };
  greenLedTaskHandle = osThreadNew(StartGreenLedTask, NULL, &green_attr);

  const osThreadAttr_t sensor_attr = { .name = "SensorTask", .priority = osPriorityAboveNormal, .stack_size = 512 * 4 };
  sensorTaskHandle = osThreadNew(StartSensorTask, NULL, &sensor_attr);

  /* Start Scheduler - control transfers to FreeRTOS kernel */
  osKernelStart();

  while (1) {}
}`,
    quiz: [
      {
        question: "In FreeRTOS, what happens when a task with Priority 'High' becomes READY while a 'Low' priority task is running?",
        options: [
          "The High priority task waits until the Low priority task finishes its current while loop.",
          "The RTOS kernel immediately preempts the Low priority task and context-switches to the High priority task.",
          "Both tasks execute simultaneously on different CPU cores.",
          "An Error_Handler interrupt is triggered."
        ],
        correct: 1,
        explanation: "FreeRTOS is a preemptive RTOS. Higher priority ready tasks immediately pre-empt lower priority running tasks."
      },
      {
        question: "Why should osDelay() be used inside FreeRTOS tasks instead of HAL_Delay()?",
        options: [
          "HAL_Delay() causes the microcontroller to reset.",
          "osDelay() puts the calling task into BLOCKED state, allowing lower priority tasks to execute while waiting.",
          "HAL_Delay() cannot delay less than 1 second.",
          "osDelay() is written in ARM Assembly while HAL_Delay is C."
        ],
        correct: 1,
        explanation: "HAL_Delay busy-waits blocking the CPU, whereas osDelay yield control so other ready tasks can run."
      },
      {
        question: "Which FreeRTOS mechanism is best suited for thread-safe data transfer between two tasks?",
        options: ["Global C variables without locks", "SysTick registers", "Message Queue", "EXTI line triggers"],
        correct: 2,
        explanation: "Message Queues provide thread-safe FIFO buffering with built-in synchronization and lock management."
      }
    ]
  },
  {
    id: "lab-8",
    number: 8,
    title: "12-Bit DAC Analog Waveform Generator",
    subtitle: "Digital-to-Analog Conversion, Direct Memory Access, and Signal Synthesis",
    difficulty: "Advanced",
    estimatedTime: "50 mins",
    objectives: [
      "Configure STM32 12-bit DAC (DAC1 Channel 1 on PA4)",
      "Generate continuous Sine, Triangular, and Sawtooth analog signals",
      "Use Timer 6 (TIM6) as hardware trigger for constant sample rates",
      "Stream lookup table values to DAC via DMA circular buffer"
    ],
    hardwareReq: [
      "NUCLEO-H753ZI Board",
      "Oscilloscope connected to PA4 (Arduino A1 / DAC Output)",
      "100 Ohm resistor & LED or Speaker (Optional)"
    ],
    theory: `The STM32H753ZI features two 12-bit Digital-to-Analog Converters (DAC1 and DAC2).
Resolution = 12 bits ($2^{12} = 4096$ values, 0 to 4095).

$$V_{OUT} = V_{REF+} \\times \\left( \\frac{\\text{DOR}}{4095} \\right)$$

For continuous waveform generation without CPU overhead:
1. Pre-calculate a lookup table (LUT) of 32 or 64 samples for a sine wave.
2. Configure **TIM6** to issue periodic TRGO (Trigger Output) pulses at sample frequency $f_s$.
3. Configure **DMA** to automatically transfer the next LUT value to DAC Data Output Register (\`DAC_DHR12R1\`) on every TIM6 TRGO tick.`,
    pinConnections: [
      { pin: "PA4", function: "DAC1_OUT1", target: "Analog Oscilloscope Channel 1 / Probe" },
      { pin: "GND", function: "Ground", target: "Oscilloscope Ground Reference" }
    ],
    cubeIdeSetup: [
      "In STM32CubeIDE Pinout, enable Analog -> DAC1.",
      "Select Channel 1 (PA4) = 'Connected to external pin only'.",
      "Set Trigger = 'Timer 6 Trigger Out Event', Output Buffer = Enable.",
      "Under Timers -> TIM6: Enable Internal Clock. Set PSC = 479, ARR = 49 (Yields 10 kHz sample rate).",
      "Set Trigger Event Selection TRGO = 'Update Event'.",
      "Under DAC1 DMA Settings: Add DAC1 CH1, Mode = Circular, Increment Address = Memory YES, Data Width = Half Word (16-bit).",
      "Generate Code."
    ],
    codeSnippet: `/* USER CODE BEGIN PV */
#include <math.h>

#define SINE_SAMPLES 64
uint16_t sine_lut[SINE_SAMPLES];

extern DAC_HandleTypeDef hdac1;
extern TIM_HandleTypeDef htim6;

/* Pre-compute 12-bit Sine Wave Lookup Table */
void Generate_Sine_LUT(void)
{
  for (int i = 0; i < SINE_SAMPLES; i++)
  {
    // Sine value mapped between 0 and 4095 (Center 2047, Amp 2047)
    float angle = (2.0f * 3.14159265f * i) / SINE_SAMPLES;
    sine_lut[i] = (uint16_t)((sinf(angle) + 1.0f) * 2047.5f);
  }
}
/* USER CODE END PV */

int main(void)
{
  HAL_Init();
  SystemClock_Config();
  MX_GPIO_Init();
  MX_DMA_Init();
  MX_DAC1_Init();
  MX_TIM6_Init();

  /* Calculate Sine Table */
  Generate_Sine_LUT();

  /* Start TIM6 Base Counter */
  HAL_TIM_Base_Start(&htim6);

  /* Start DAC DMA Streaming in Circular Mode */
  HAL_DAC_Start_DMA(&hdac1, DAC_CHANNEL_1, (uint32_t*)sine_lut, SINE_SAMPLES, DAC_ALIGN_12B_R);

  while (1)
  {
    /* CPU free while DMA streams waveform at hardware pace */
  }
}`,
    quiz: [
      {
        question: "What is the maximum digital code value for a 12-bit DAC channel?",
        options: ["255", "1023", "4095", "65535"],
        correct: 2,
        explanation: "12-bit binary maximum value is 2^12 - 1 = 4095."
      },
      {
        question: "What role does Timer 6 (TIM6) play in automated DAC waveform synthesis?",
        options: [
          "It provides power to the analog DAC output driver.",
          "It generates exact hardware TRGO trigger pulses to pace DMA transfers sample-by-sample.",
          "It measures the output frequency using input capture.",
          "It amplifies the DAC voltage to 5V."
        ],
        correct: 1,
        explanation: "TIM6 TRGO signals the DAC and DMA to update the output register at exact periodic sampling intervals."
      },
      {
        question: "For a 64-sample Sine LUT streamed at 10,000 samples/sec, what is the output Sine wave frequency?",
        options: ["156.25 Hz", "640 Hz", "10 kHz", "1 MHz"],
        correct: 0,
        explanation: "Output Frequency = Sample Rate / Samples per Cycle = 10,000 Hz / 64 = 156.25 Hz."
      }
    ]
  }
];
