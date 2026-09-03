
import ASDR_FlapsUp from "./asdrFlapsUP_CSATH.js";

function MTOW(input) { // Função pública (mesmo estilo do teu ASDR)
  return TO_ENGINE_MTOW.compute(input); // Executar motor com debug
}

export default MTOW; // Export default
export { MTOW };     // Export nomeado

// ============================
// DATASETS 
// ============================


const pressureAltTemperatureData = [
  { "Pressure_Altitude": 12000, "Temperature": -40, "Y_REF1": 331 },
  { "Pressure_Altitude": 12000, "Temperature": -30, "Y_REF1": 305 },
  { "Pressure_Altitude": 12000, "Temperature": -20, "Y_REF1": 281 },
  { "Pressure_Altitude": 12000, "Temperature": -10, "Y_REF1": 253 },
  { "Pressure_Altitude": 12000, "Temperature": 0,   "Y_REF1": 221 },

  { "Pressure_Altitude": 10000, "Temperature": -40, "Y_REF1": 363 },
  { "Pressure_Altitude": 10000, "Temperature": -30, "Y_REF1": 344 },
  { "Pressure_Altitude": 10000, "Temperature": -20, "Y_REF1": 324 },
  { "Pressure_Altitude": 10000, "Temperature": -10, "Y_REF1": 300 },
  { "Pressure_Altitude": 10000, "Temperature": 0,   "Y_REF1": 274 },
  { "Pressure_Altitude": 10000, "Temperature": 10,  "Y_REF1": 246 },

  { "Pressure_Altitude": 8000, "Temperature": -40, "Y_REF1": 393 },
  { "Pressure_Altitude": 8000, "Temperature": -30, "Y_REF1": 376 },
  { "Pressure_Altitude": 8000, "Temperature": -20, "Y_REF1": 359 },
  { "Pressure_Altitude": 8000, "Temperature": -10, "Y_REF1": 341 },
  { "Pressure_Altitude": 8000, "Temperature": 0,   "Y_REF1": 322 },
  { "Pressure_Altitude": 8000, "Temperature": 10,  "Y_REF1": 298 },
  { "Pressure_Altitude": 8000, "Temperature": 20,  "Y_REF1": 268 },

  { "Pressure_Altitude": 6000, "Temperature": -30, "Y_REF1": 402 },
  { "Pressure_Altitude": 6000, "Temperature": -20, "Y_REF1": 389 },
  { "Pressure_Altitude": 6000, "Temperature": -10, "Y_REF1": 374 },
  { "Pressure_Altitude": 6000, "Temperature": 0,   "Y_REF1": 359 },
  { "Pressure_Altitude": 6000, "Temperature": 10,  "Y_REF1": 341 },
  { "Pressure_Altitude": 6000, "Temperature": 20,  "Y_REF1": 318 },
  { "Pressure_Altitude": 6000, "Temperature": 30,  "Y_REF1": 290 },

  { "Pressure_Altitude": 4000, "Temperature": -30, "Y_REF1": 421 },
  { "Pressure_Altitude": 4000, "Temperature": -20, "Y_REF1": 410 },
  { "Pressure_Altitude": 4000, "Temperature": -10, "Y_REF1": 398 },
  { "Pressure_Altitude": 4000, "Temperature": 0,   "Y_REF1": 387 },
  { "Pressure_Altitude": 4000, "Temperature": 10,  "Y_REF1": 374 },
  { "Pressure_Altitude": 4000, "Temperature": 20,  "Y_REF1": 356 },
  { "Pressure_Altitude": 4000, "Temperature": 30,  "Y_REF1": 333 },
  { "Pressure_Altitude": 4000, "Temperature": 40,  "Y_REF1": 303 },

  { "Pressure_Altitude": 2000, "Temperature": -20, "Y_REF1": 430 },
  { "Pressure_Altitude": 2000, "Temperature": -10, "Y_REF1": 419 },
  { "Pressure_Altitude": 2000, "Temperature": 0,   "Y_REF1": 408 },
  { "Pressure_Altitude": 2000, "Temperature": 10,  "Y_REF1": 398 },
  { "Pressure_Altitude": 2000, "Temperature": 20,  "Y_REF1": 389 },
  { "Pressure_Altitude": 2000, "Temperature": 30,  "Y_REF1": 370 },
  { "Pressure_Altitude": 2000, "Temperature": 40,  "Y_REF1": 344 },
  { "Pressure_Altitude": 2000, "Temperature": 50,  "Y_REF1": 311 },

  { "Pressure_Altitude": 0, "Temperature": -20, "Y_REF1": 445 },
  { "Pressure_Altitude": 0, "Temperature": -10, "Y_REF1": 437 },
  { "Pressure_Altitude": 0, "Temperature": 0,   "Y_REF1": 430 },
  { "Pressure_Altitude": 0, "Temperature": 10,  "Y_REF1": 419 },
  { "Pressure_Altitude": 0, "Temperature": 20,  "Y_REF1": 411 },
  { "Pressure_Altitude": 0, "Temperature": 30,  "Y_REF1": 398 },
  { "Pressure_Altitude": 0, "Temperature": 40,  "Y_REF1": 378 },
  { "Pressure_Altitude": 0, "Temperature": 50,  "Y_REF1": 354 }
];

const reflineWeightData = [
  { "sectionNum": 1, "Y_Refline_Section_Down": 456, "Y_Refline_Section_Up": 423 },
  { "sectionNum": 2, "Y_Refline_Section_Down": 423, "Y_Refline_Section_Up": 387 },
  { "sectionNum": 3, "Y_Refline_Section_Down": 387, "Y_Refline_Section_Up": 346 },
  { "sectionNum": 4, "Y_Refline_Section_Down": 346, "Y_Refline_Section_Up": 309 },
  { "sectionNum": 5, "Y_Refline_Section_Down": 309, "Y_Refline_Section_Up": 274 },
  { "sectionNum": 6, "Y_Refline_Section_Down": 274, "Y_Refline_Section_Up": 234 }
];

const weightSectionData = [
  { "Weight": 4500, "Section": 1, "Y_Ref_Down": 506, "Y_Ref_Up": 480 },
  { "Weight": 4500, "Section": 2, "Y_Ref_Down": 480, "Y_Ref_Up": 455 },
  { "Weight": 4500, "Section": 3, "Y_Ref_Down": 455, "Y_Ref_Up": 431 },
  { "Weight": 4500, "Section": 4, "Y_Ref_Down": 431, "Y_Ref_Up": 408 },
  { "Weight": 4500, "Section": 5, "Y_Ref_Down": 408, "Y_Ref_Up": 384 },
  { "Weight": 4500, "Section": 6, "Y_Ref_Down": 384, "Y_Ref_Up": 364 },

  { "Weight": 4600, "Section": 1, "Y_Ref_Down": 505, "Y_Ref_Up": 478 },
  { "Weight": 4600, "Section": 2, "Y_Ref_Down": 478, "Y_Ref_Up": 453 },
  { "Weight": 4600, "Section": 3, "Y_Ref_Down": 453, "Y_Ref_Up": 430 },
  { "Weight": 4600, "Section": 4, "Y_Ref_Down": 430, "Y_Ref_Up": 404 },
  { "Weight": 4600, "Section": 5, "Y_Ref_Down": 404, "Y_Ref_Up": 382 },
  { "Weight": 4600, "Section": 6, "Y_Ref_Down": 382, "Y_Ref_Up": 362 },

  { "Weight": 4700, "Section": 1, "Y_Ref_Down": 503, "Y_Ref_Up": 477 },
  { "Weight": 4700, "Section": 2, "Y_Ref_Down": 477, "Y_Ref_Up": 452 },
  { "Weight": 4700, "Section": 3, "Y_Ref_Down": 452, "Y_Ref_Up": 427 },
  { "Weight": 4700, "Section": 4, "Y_Ref_Down": 427, "Y_Ref_Up": 401 },
  { "Weight": 4700, "Section": 5, "Y_Ref_Down": 401, "Y_Ref_Up": 377 },
  { "Weight": 4700, "Section": 6, "Y_Ref_Down": 377, "Y_Ref_Up": 357 },

  { "Weight": 4800, "Section": 1, "Y_Ref_Down": 502, "Y_Ref_Up": 477 },
  { "Weight": 4800, "Section": 2, "Y_Ref_Down": 477, "Y_Ref_Up": 450 },
  { "Weight": 4800, "Section": 3, "Y_Ref_Down": 450, "Y_Ref_Up": 423 },
  { "Weight": 4800, "Section": 4, "Y_Ref_Down": 423, "Y_Ref_Up": 396 },
  { "Weight": 4800, "Section": 5, "Y_Ref_Down": 396, "Y_Ref_Up": 374 },
  { "Weight": 4800, "Section": 6, "Y_Ref_Down": 374, "Y_Ref_Up": 352 },

  { "Weight": 4900, "Section": 1, "Y_Ref_Down": 502, "Y_Ref_Up": 474 },
  { "Weight": 4900, "Section": 2, "Y_Ref_Down": 474, "Y_Ref_Up": 448 },
  { "Weight": 4900, "Section": 3, "Y_Ref_Down": 448, "Y_Ref_Up": 421 },
  { "Weight": 4900, "Section": 4, "Y_Ref_Down": 421, "Y_Ref_Up": 395 },
  { "Weight": 4900, "Section": 5, "Y_Ref_Down": 395, "Y_Ref_Up": 370 },
  { "Weight": 4900, "Section": 6, "Y_Ref_Down": 370, "Y_Ref_Up": 349 },

  { "Weight": 5000, "Section": 1, "Y_Ref_Down": 499, "Y_Ref_Up": 471 },
  { "Weight": 5000, "Section": 2, "Y_Ref_Down": 471, "Y_Ref_Up": 445 },
  { "Weight": 5000, "Section": 3, "Y_Ref_Down": 445, "Y_Ref_Up": 418 },
  { "Weight": 5000, "Section": 4, "Y_Ref_Down": 418, "Y_Ref_Up": 389 },
  { "Weight": 5000, "Section": 5, "Y_Ref_Down": 389, "Y_Ref_Up": 365 },
  { "Weight": 5000, "Section": 6, "Y_Ref_Down": 365, "Y_Ref_Up": 343 },

  { "Weight": 5100, "Section": 1, "Y_Ref_Down": 494, "Y_Ref_Up": 468 },
  { "Weight": 5100, "Section": 2, "Y_Ref_Down": 468, "Y_Ref_Up": 440 },
  { "Weight": 5100, "Section": 3, "Y_Ref_Down": 440, "Y_Ref_Up": 411 },
  { "Weight": 5100, "Section": 4, "Y_Ref_Down": 411, "Y_Ref_Up": 383 },
  { "Weight": 5100, "Section": 5, "Y_Ref_Down": 383, "Y_Ref_Up": 357 },
  { "Weight": 5100, "Section": 6, "Y_Ref_Down": 357, "Y_Ref_Up": 333 },

  { "Weight": 5200, "Section": 1, "Y_Ref_Down": 490, "Y_Ref_Up": 462 },
  { "Weight": 5200, "Section": 2, "Y_Ref_Down": 462, "Y_Ref_Up": 434 },
  { "Weight": 5200, "Section": 3, "Y_Ref_Down": 434, "Y_Ref_Up": 405 },
  { "Weight": 5200, "Section": 4, "Y_Ref_Down": 405, "Y_Ref_Up": 376 },
  { "Weight": 5200, "Section": 5, "Y_Ref_Down": 376, "Y_Ref_Up": 348 },
  { "Weight": 5200, "Section": 6, "Y_Ref_Down": 348, "Y_Ref_Up": 324 },

  { "Weight": 5300, "Section": 1, "Y_Ref_Down": 486, "Y_Ref_Up": 456 },
  { "Weight": 5300, "Section": 2, "Y_Ref_Down": 456, "Y_Ref_Up": 428 },
  { "Weight": 5300, "Section": 3, "Y_Ref_Down": 428, "Y_Ref_Up": 398 },
  { "Weight": 5300, "Section": 4, "Y_Ref_Down": 398, "Y_Ref_Up": 368 },
  { "Weight": 5300, "Section": 5, "Y_Ref_Down": 368, "Y_Ref_Up": 340 },
  { "Weight": 5300, "Section": 6, "Y_Ref_Down": 340, "Y_Ref_Up": 314 },

  { "Weight": 5400, "Section": 1, "Y_Ref_Down": 483, "Y_Ref_Up": 452 },
  { "Weight": 5400, "Section": 2, "Y_Ref_Down": 452, "Y_Ref_Up": 423 },
  { "Weight": 5400, "Section": 3, "Y_Ref_Down": 423, "Y_Ref_Up": 392 },
  { "Weight": 5400, "Section": 4, "Y_Ref_Down": 392, "Y_Ref_Up": 361 },
  { "Weight": 5400, "Section": 5, "Y_Ref_Down": 361, "Y_Ref_Up": 329 },
  { "Weight": 5400, "Section": 6, "Y_Ref_Down": 329, "Y_Ref_Up": 302 },

  { "Weight": 5500, "Section": 1, "Y_Ref_Down": 477, "Y_Ref_Up": 446 },
  { "Weight": 5500, "Section": 2, "Y_Ref_Down": 446, "Y_Ref_Up": 417 },
  { "Weight": 5500, "Section": 3, "Y_Ref_Down": 417, "Y_Ref_Up": 384 },
  { "Weight": 5500, "Section": 4, "Y_Ref_Down": 384, "Y_Ref_Up": 352 },
  { "Weight": 5500, "Section": 5, "Y_Ref_Down": 352, "Y_Ref_Up": 321 },
  { "Weight": 5500, "Section": 6, "Y_Ref_Down": 321, "Y_Ref_Up": 292 },

  { "Weight": 5600, "Section": 1, "Y_Ref_Down": 472, "Y_Ref_Up": 442 },
  { "Weight": 5600, "Section": 2, "Y_Ref_Down": 442, "Y_Ref_Up": 411 },
  { "Weight": 5600, "Section": 3, "Y_Ref_Down": 411, "Y_Ref_Up": 377 },
  { "Weight": 5600, "Section": 4, "Y_Ref_Down": 377, "Y_Ref_Up": 345 },
  { "Weight": 5600, "Section": 5, "Y_Ref_Down": 345, "Y_Ref_Up": 313 },
  { "Weight": 5600, "Section": 6, "Y_Ref_Down": 313, "Y_Ref_Up": 282 },

  { "Weight": 5700, "Section": 1, "Y_Ref_Down": 468, "Y_Ref_Up": 437 },
  { "Weight": 5700, "Section": 2, "Y_Ref_Down": 437, "Y_Ref_Up": 405 },
  { "Weight": 5700, "Section": 3, "Y_Ref_Down": 405, "Y_Ref_Up": 371 },
  { "Weight": 5700, "Section": 4, "Y_Ref_Down": 371, "Y_Ref_Up": 335 },
  { "Weight": 5700, "Section": 5, "Y_Ref_Down": 335, "Y_Ref_Up": 304 },
  { "Weight": 5700, "Section": 6, "Y_Ref_Down": 304, "Y_Ref_Up": 271 },

  { "Weight": 5800, "Section": 1, "Y_Ref_Down": 464, "Y_Ref_Up": 431 },
  { "Weight": 5800, "Section": 2, "Y_Ref_Down": 431, "Y_Ref_Up": 399 },
  { "Weight": 5800, "Section": 3, "Y_Ref_Down": 399, "Y_Ref_Up": 364 },
  { "Weight": 5800, "Section": 4, "Y_Ref_Down": 364, "Y_Ref_Up": 327 },
  { "Weight": 5800, "Section": 5, "Y_Ref_Down": 327, "Y_Ref_Up": 292 },
  { "Weight": 5800, "Section": 6, "Y_Ref_Down": 292, "Y_Ref_Up": 260 },

  { "Weight": 5900, "Section": 1, "Y_Ref_Down": 461, "Y_Ref_Up": 427 },
  { "Weight": 5900, "Section": 2, "Y_Ref_Down": 427, "Y_Ref_Up": 393 },
  { "Weight": 5900, "Section": 3, "Y_Ref_Down": 393, "Y_Ref_Up": 355 },
  { "Weight": 5900, "Section": 4, "Y_Ref_Down": 355, "Y_Ref_Up": 318 },
  { "Weight": 5900, "Section": 5, "Y_Ref_Down": 318, "Y_Ref_Up": 285 },
  { "Weight": 5900, "Section": 6, "Y_Ref_Down": 285, "Y_Ref_Up": 247 },

  { "Weight": 6000, "Section": 1, "Y_Ref_Down": 456, "Y_Ref_Up": 421 },
  { "Weight": 6000, "Section": 2, "Y_Ref_Down": 421, "Y_Ref_Up": 386 },
  { "Weight": 6000, "Section": 3, "Y_Ref_Down": 386, "Y_Ref_Up": 348 },
  { "Weight": 6000, "Section": 4, "Y_Ref_Down": 348, "Y_Ref_Up": 308 },
  { "Weight": 6000, "Section": 5, "Y_Ref_Down": 308, "Y_Ref_Up": 271 },
  { "Weight": 6000, "Section": 6, "Y_Ref_Down": 271, "Y_Ref_Up": 235 },

  { "Weight": 6100, "Section": 1, "Y_Ref_Down": 450, "Y_Ref_Up": 415 },
  { "Weight": 6100, "Section": 2, "Y_Ref_Down": 415, "Y_Ref_Up": 379 },
  { "Weight": 6100, "Section": 3, "Y_Ref_Down": 379, "Y_Ref_Up": 339 },
  { "Weight": 6100, "Section": 4, "Y_Ref_Down": 339, "Y_Ref_Up": 299 },
  { "Weight": 6100, "Section": 5, "Y_Ref_Down": 299, "Y_Ref_Up": 263 },
  { "Weight": 6100, "Section": 6, "Y_Ref_Down": 263, "Y_Ref_Up": 222 },

  { "Weight": 6200, "Section": 1, "Y_Ref_Down": 446, "Y_Ref_Up": 409 },
  { "Weight": 6200, "Section": 2, "Y_Ref_Down": 409, "Y_Ref_Up": 370 },
  { "Weight": 6200, "Section": 3, "Y_Ref_Down": 370, "Y_Ref_Up": 332 },
  { "Weight": 6200, "Section": 4, "Y_Ref_Down": 332, "Y_Ref_Up": 289 },
  { "Weight": 6200, "Section": 5, "Y_Ref_Down": 289, "Y_Ref_Up": 252 },
  { "Weight": 6200, "Section": 6, "Y_Ref_Down": 252, "Y_Ref_Up": 211 },

  { "Weight": 6300, "Section": 1, "Y_Ref_Down": 442, "Y_Ref_Up": 402 },
  { "Weight": 6300, "Section": 2, "Y_Ref_Down": 402, "Y_Ref_Up": 362 },
  { "Weight": 6300, "Section": 3, "Y_Ref_Down": 362, "Y_Ref_Up": 323 },
  { "Weight": 6300, "Section": 4, "Y_Ref_Down": 323, "Y_Ref_Up": 280 },
  { "Weight": 6300, "Section": 5, "Y_Ref_Down": 280, "Y_Ref_Up": 241 },
  { "Weight": 6300, "Section": 6, "Y_Ref_Down": 241, "Y_Ref_Up": 200 },

  { "Weight": 6400, "Section": 1, "Y_Ref_Down": 437, "Y_Ref_Up": 398 },
  { "Weight": 6400, "Section": 2, "Y_Ref_Down": 398, "Y_Ref_Up": 355 },
  { "Weight": 6400, "Section": 3, "Y_Ref_Down": 355, "Y_Ref_Up": 313 },
  { "Weight": 6400, "Section": 4, "Y_Ref_Down": 313, "Y_Ref_Up": 270 },
  { "Weight": 6400, "Section": 5, "Y_Ref_Down": 270, "Y_Ref_Up": 229 },
  { "Weight": 6400, "Section": 6, "Y_Ref_Down": 229, "Y_Ref_Up": 183 },

  { "Weight": 6500, "Section": 1, "Y_Ref_Down": 431, "Y_Ref_Up": 390 },
  { "Weight": 6500, "Section": 2, "Y_Ref_Down": 390, "Y_Ref_Up": 346 },
  { "Weight": 6500, "Section": 3, "Y_Ref_Down": 346, "Y_Ref_Up": 302 },
  { "Weight": 6500, "Section": 4, "Y_Ref_Down": 302, "Y_Ref_Up": 257 },
  { "Weight": 6500, "Section": 5, "Y_Ref_Down": 257, "Y_Ref_Up": 217 },
  { "Weight": 6500, "Section": 6, "Y_Ref_Down": 217, "Y_Ref_Up": 172 }
];


const windData = [
  { "Wind": 0, "Y_Ref_Down": 533, "Y_Ref_Up": 496 },
  { "Wind": 0, "Y_Ref_Down": 496, "Y_Ref_Up": 458 },
  { "Wind": 0, "Y_Ref_Down": 458, "Y_Ref_Up": 421 },
  { "Wind": 0, "Y_Ref_Down": 421, "Y_Ref_Up": 384 },
  { "Wind": 0, "Y_Ref_Down": 384, "Y_Ref_Up": 346 },
  { "Wind": 0, "Y_Ref_Down": 346, "Y_Ref_Up": 310 },
  { "Wind": 0, "Y_Ref_Down": 310, "Y_Ref_Up": 273 },
  { "Wind": 0, "Y_Ref_Down": 273, "Y_Ref_Up": 233 },
  { "Wind": 0, "Y_Ref_Down": 233, "Y_Ref_Up": 48 },

  { "Wind": 10, "Y_Ref_Down": 539, "Y_Ref_Up": 508 },
  { "Wind": 10, "Y_Ref_Down": 508, "Y_Ref_Up": 471 },
  { "Wind": 10, "Y_Ref_Down": 471, "Y_Ref_Up": 437 },
  { "Wind": 10, "Y_Ref_Down": 437, "Y_Ref_Up": 401 },
  { "Wind": 10, "Y_Ref_Down": 401, "Y_Ref_Up": 365 },
  { "Wind": 10, "Y_Ref_Down": 365, "Y_Ref_Up": 332 },
  { "Wind": 10, "Y_Ref_Down": 332, "Y_Ref_Up": 296 },
  { "Wind": 10, "Y_Ref_Down": 296, "Y_Ref_Up": 261 },
  { "Wind": 10, "Y_Ref_Down": 261, "Y_Ref_Up": 48 },

  { "Wind": 20, "Y_Ref_Down": 550, "Y_Ref_Up": 519 },
  { "Wind": 20, "Y_Ref_Down": 519, "Y_Ref_Up": 487 },
  { "Wind": 20, "Y_Ref_Down": 487, "Y_Ref_Up": 455 },
  { "Wind": 20, "Y_Ref_Down": 455, "Y_Ref_Up": 423 },
  { "Wind": 20, "Y_Ref_Down": 423, "Y_Ref_Up": 387 },
  { "Wind": 20, "Y_Ref_Down": 387, "Y_Ref_Up": 354 },
  { "Wind": 20, "Y_Ref_Down": 354, "Y_Ref_Up": 321 },
  { "Wind": 20, "Y_Ref_Down": 321, "Y_Ref_Up": 288 },
  { "Wind": 20, "Y_Ref_Down": 288, "Y_Ref_Up": 48 },

  { "Wind": 30, "Y_Ref_Down": 559, "Y_Ref_Up": 530 },
  { "Wind": 30, "Y_Ref_Down": 530, "Y_Ref_Up": 502 },
  { "Wind": 30, "Y_Ref_Down": 502, "Y_Ref_Up": 471 },
  { "Wind": 30, "Y_Ref_Down": 471, "Y_Ref_Up": 439 },
  { "Wind": 30, "Y_Ref_Down": 439, "Y_Ref_Up": 406 },
  { "Wind": 30, "Y_Ref_Down": 406, "Y_Ref_Up": 374 },
  { "Wind": 30, "Y_Ref_Down": 374, "Y_Ref_Up": 345 },
  { "Wind": 30, "Y_Ref_Down": 345, "Y_Ref_Up": 314 },
  { "Wind": 30, "Y_Ref_Down": 314, "Y_Ref_Up": 48 },

  { "Wind": 40, "Y_Ref_Down": 568, "Y_Ref_Up": 543 },
  { "Wind": 40, "Y_Ref_Down": 543, "Y_Ref_Up": 515 },
  { "Wind": 40, "Y_Ref_Down": 515, "Y_Ref_Up": 489 },
  { "Wind": 40, "Y_Ref_Down": 489, "Y_Ref_Up": 459 },
  { "Wind": 40, "Y_Ref_Down": 459, "Y_Ref_Up": 430 },
  { "Wind": 40, "Y_Ref_Down": 430, "Y_Ref_Up": 401 },
  { "Wind": 40, "Y_Ref_Down": 401, "Y_Ref_Up": 370 },
  { "Wind": 40, "Y_Ref_Down": 370, "Y_Ref_Up": 343 },
  { "Wind": 40, "Y_Ref_Down": 343, "Y_Ref_Up": 48 },

  { "Wind": 50, "Y_Ref_Down": 577, "Y_Ref_Up": 555 },
  { "Wind": 50, "Y_Ref_Down": 555, "Y_Ref_Up": 531 },
  { "Wind": 50, "Y_Ref_Down": 531, "Y_Ref_Up": 505 },
  { "Wind": 50, "Y_Ref_Down": 505, "Y_Ref_Up": 477 },
  { "Wind": 50, "Y_Ref_Down": 477, "Y_Ref_Up": 450 },
  { "Wind": 50, "Y_Ref_Down": 450, "Y_Ref_Up": 421 },
  { "Wind": 50, "Y_Ref_Down": 421, "Y_Ref_Up": 395 },
  { "Wind": 50, "Y_Ref_Down": 395, "Y_Ref_Up": 368 },
  { "Wind": 50, "Y_Ref_Down": 368, "Y_Ref_Up": 48 },

  { "Wind": -10, "Y_Ref_Down": 490, "Y_Ref_Up": 445 },
  { "Wind": -10, "Y_Ref_Down": 445, "Y_Ref_Up": 398 },
  { "Wind": -10, "Y_Ref_Down": 398, "Y_Ref_Up": 354 },
  { "Wind": -10, "Y_Ref_Down": 354, "Y_Ref_Up": 308 },
  { "Wind": -10, "Y_Ref_Down": 308, "Y_Ref_Up": 267 },
  { "Wind": -10, "Y_Ref_Down": 267, "Y_Ref_Up": 225 },
  { "Wind": -10, "Y_Ref_Down": 225, "Y_Ref_Up": 180 },
  { "Wind": -10, "Y_Ref_Down": 180, "Y_Ref_Up": 135 },
  { "Wind": -10, "Y_Ref_Down": 135, "Y_Ref_Up": 48 },

  { "Wind": -20, "Y_Ref_Down": 445, "Y_Ref_Up": 395 },
  { "Wind": -20, "Y_Ref_Down": 395, "Y_Ref_Up": 342 },
  { "Wind": -20, "Y_Ref_Down": 342, "Y_Ref_Up": 291 },
  { "Wind": -20, "Y_Ref_Down": 291, "Y_Ref_Up": 242 },
  { "Wind": -20, "Y_Ref_Down": 242, "Y_Ref_Up": 192 },
  { "Wind": -20, "Y_Ref_Down": 192, "Y_Ref_Up": 145 },
  { "Wind": -20, "Y_Ref_Down": 145, "Y_Ref_Up": 90 },
  { "Wind": -20, "Y_Ref_Down": 90,  "Y_Ref_Up": 48 }
];

const runwayConditionData = {
  "DRY": [
    { "Condition": "DRY", "Section": 1,  "Y_Ref_Down": 607, "Y_Ref_Up": 577 },
    { "Condition": "DRY", "Section": 2,  "Y_Ref_Down": 577, "Y_Ref_Up": 539 },
    { "Condition": "DRY", "Section": 3,  "Y_Ref_Down": 539, "Y_Ref_Up": 502 },
    { "Condition": "DRY", "Section": 4,  "Y_Ref_Down": 502, "Y_Ref_Up": 458 },
    { "Condition": "DRY", "Section": 5,  "Y_Ref_Down": 458, "Y_Ref_Up": 420 },
    { "Condition": "DRY", "Section": 6,  "Y_Ref_Down": 420, "Y_Ref_Up": 383 },
    { "Condition": "DRY", "Section": 7,  "Y_Ref_Down": 383, "Y_Ref_Up": 345 },
    { "Condition": "DRY", "Section": 8,  "Y_Ref_Down": 345, "Y_Ref_Up": 308 },
    { "Condition": "DRY", "Section": 9,  "Y_Ref_Down": 308, "Y_Ref_Up": 271 },
    { "Condition": "DRY", "Section": 10, "Y_Ref_Down": 271, "Y_Ref_Up": 236 },
    { "Condition": "DRY", "Section": 11, "Y_Ref_Down": 236, "Y_Ref_Up": 48 }
  ],

  "WET": [
    { "Condition": "WET", "Section": 1,  "Y_Ref_Down": 607, "Y_Ref_Up": 556 },
    { "Condition": "WET", "Section": 2,  "Y_Ref_Down": 556, "Y_Ref_Up": 514 },
    { "Condition": "WET", "Section": 3,  "Y_Ref_Down": 514, "Y_Ref_Up": 472 },
    { "Condition": "WET", "Section": 4,  "Y_Ref_Down": 472, "Y_Ref_Up": 424 },
    { "Condition": "WET", "Section": 5,  "Y_Ref_Down": 424, "Y_Ref_Up": 379 },
    { "Condition": "WET", "Section": 6,  "Y_Ref_Down": 379, "Y_Ref_Up": 333 },
    { "Condition": "WET", "Section": 7,  "Y_Ref_Down": 333, "Y_Ref_Up": 289 },
    { "Condition": "WET", "Section": 8,  "Y_Ref_Down": 289, "Y_Ref_Up": 248 },
    { "Condition": "WET", "Section": 9,  "Y_Ref_Down": 248, "Y_Ref_Up": 210 },
    { "Condition": "WET", "Section": 10, "Y_Ref_Down": 210, "Y_Ref_Up": 166 },
    { "Condition": "WET", "Section": 11, "Y_Ref_Down": 166, "Y_Ref_Up": 48 }
  ]
};

const resultData = [
  { "ASD_m": 0, "Y_Ref": 607 },
  { "ASD_m": 100, "Y_Ref": 584 },
  { "ASD_m": 200, "Y_Ref": 559 },
  { "ASD_m": 300, "Y_Ref": 536 },
  { "ASD_m": 400, "Y_Ref": 508 },
  { "ASD_m": 500, "Y_Ref": 484 },
  { "ASD_m": 600, "Y_Ref": 461 },
  { "ASD_m": 700, "Y_Ref": 436 },
  { "ASD_m": 800, "Y_Ref": 409 },
  { "ASD_m": 900, "Y_Ref": 386 },
  { "ASD_m": 1000, "Y_Ref": 361 },
  { "ASD_m": 1100, "Y_Ref": 335 },
  { "ASD_m": 1200, "Y_Ref": 311 },
  { "ASD_m": 1300, "Y_Ref": 288 },
  { "ASD_m": 1400, "Y_Ref": 261 },
  { "ASD_m": 1500, "Y_Ref": 236 },
  { "ASD_m": 1600, "Y_Ref": 211 },
  { "ASD_m": 1700, "Y_Ref": 188 },
  { "ASD_m": 1800, "Y_Ref": 163 },
  { "ASD_m": 1900, "Y_Ref": 139 },
  { "ASD_m": 2000, "Y_Ref": 114 },
  { "ASD_m": 2100, "Y_Ref": 90 }
];

// ============================
// ENGINE (MTOW) 
// ============================
const TO_ENGINE_MTOW = {
  // ---------- helpers ----------
  _lerp(a, b, t) { // Interpolação linear
    return a + (b - a) * t; // Fórmula lerp
  }, // Separador de métodos

  _clamp01(t) { // Clamp para [0..1]
    return t < 0 ? 0 : (t > 1 ? 1 : t); // Garantir limites
  }, // Separador de métodos

  _uniqueSorted(arr) { // Unique + sort numérico
    return Array.from(new Set(arr)).sort((a, b) => a - b); // Set + sort
  }, // Separador de métodos

  _bracket(sortedVals, x) { // Encontrar bracket [lo,hi] para x (com clamp e SNAP exacto)
    const n = sortedVals.length; // Tamanho
    if (n === 0) throw new Error("Bracket: empty array"); // Segurança

    // 1) SNAP: se x for exactamente um valor do eixo, devolve lo=hi=x
    for (let i = 0; i < n; i++) { // Percorrer valores
      if (sortedVals[i] === x) { // Match exacto
        return { lo: x, hi: x, t: 0, exact: true }; // Bracket exacto
      } // Fechar if
    } // Fechar for

    // 2) Clamp nos extremos
    if (x <= sortedVals[0]) return { lo: sortedVals[0], hi: sortedVals[0], t: 0, clamped: "low" }; // Clamp baixo
    if (x >= sortedVals[n - 1]) return { lo: sortedVals[n - 1], hi: sortedVals[n - 1], t: 0, clamped: "high" }; // Clamp alto

    // 3) Intervalo normal (estrito, porque os iguais já foram tratados acima)
    for (let i = 0; i < n - 1; i++) { // Percorrer intervalos
      const lo = sortedVals[i]; // Limite inferior
      const hi = sortedVals[i + 1]; // Limite superior
      if (x > lo && x < hi) { // Estritamente dentro
        const t = (hi === lo) ? 0 : (x - lo) / (hi - lo); // Normalizar
        return { lo, hi, t }; // Return
      } // Fechar if
    } // Fechar for

    // Fallback (não devia acontecer)
    return { lo: sortedVals[n - 1], hi: sortedVals[n - 1], t: 0 }; // Fallback
  }, // Separador de métodos

  _findByKeys(data, matchObj) { // Procurar linha por chaves exactas
    return data.find(row => Object.keys(matchObj).every(k => row[k] === matchObj[k])) || null; // First match
  }, // Separador de métodos

  _interp1D(x, x0, x1, y0, y1) { // Interpolação 1D robusta
    if (x1 === x0) return y0; // Evitar divisão por zero
    const t = (x - x0) / (x1 - x0); // Calcular t
    return this._lerp(y0, y1, t); // Lerpar
  }, // Separador de métodos

  _ensureDownUp(down, up, ctx) { // Validar down > up
    if (!(down > up)) throw new Error(`${ctx}: secção inválida (esperado down > up). down=${down}, up=${up}`); // Erro
  }, // Separador de métodos

  _inSectionTopStitch(y, down, up) { // Regra top-stitch
    return (y < down && y >= up); // Dentro da secção
  }, // Separador de métodos

  _resolveNearestSectionByY(y, sections, downKey, upKey, idKey, ctx) { // Resolver secção+desvio por y
    if (!Array.isArray(sections) || sections.length === 0) throw new Error(`${ctx}: empty sections`); // Segurança

    for (const s of sections) { // Tentar encontrar secção directa
      const down = s[downKey], up = s[upKey]; // Limites
      this._ensureDownUp(down, up, ctx); // Validar

      if (this._inSectionTopStitch(y, down, up)) { // Dentro
        const deviation = (down === up) ? 0 : (y - down) / (up - down); // Desvio
        return { // Return
          mode: "SECTION",
          sectionId: s[idKey],
          deviation: this._clamp01(deviation),
          yUsed: y,
          debug: { down, up, rawDeviation: deviation }
        }; // Fechar return
      } // Fechar if
    } // Fechar for

    let best = null; // Melhor nearest
    for (const s of sections) { // Procurar nearest por clamp
      const down = s[downKey], up = s[upKey]; // Limites
      this._ensureDownUp(down, up, ctx); // Validar

      let yClamp; // Y clampado
      if (y >= down) yClamp = down; // Clamp down
      else if (y <= up) yClamp = up; // Clamp up
      else yClamp = y; // Igual

      const dist = Math.abs(y - yClamp); // Distância

      if (!best || dist < best.dist) best = { s, down, up, yClamp, dist }; // Melhor
      else if (dist === best.dist && down > best.down) best = { s, down, up, yClamp, dist }; // Desempate
    } // Fechar for

    const deviation = (best.down === best.up) ? 0 : (best.yClamp - best.down) / (best.up - best.down); // Desvio

    return { // Return nearest
      mode: "GAP_NEAREST",
      sectionId: best.s[idKey],
      deviation: this._clamp01(deviation),
      yUsed: best.yClamp,
      debug: {
        chosenDown: best.down,
        chosenUp: best.up,
        yOriginal: y,
        yClamped: best.yClamp,
        dist: best.dist,
        rawDeviation: deviation
      }
    }; // Fechar return
  }, // Separador de métodos

  _resolveNearestIndexByY(y, sections, downKey, upKey, ctx) { // Resolver índice+desvio por y (para vento)
    if (!Array.isArray(sections) || sections.length === 0) throw new Error(`${ctx}: empty sections`); // Segurança

    for (let i = 0; i < sections.length; i++) { // Verificar secções
      const s = sections[i]; // Secção
      const down = s[downKey], up = s[upKey]; // Limites
      this._ensureDownUp(down, up, ctx); // Validar

      if (this._inSectionTopStitch(y, down, up)) { // Dentro
        const deviation = (down === up) ? 0 : (y - down) / (up - down); // Desvio
        return { mode: "SECTION", index: i, deviation: this._clamp01(deviation), yUsed: y, debug: { down, up, rawDeviation: deviation } }; // Return
      } // Fechar if
    } // Fechar for

    let best = null; // Melhor nearest
    for (let i = 0; i < sections.length; i++) { // Nearest
      const s = sections[i]; // Secção
      const down = s[downKey], up = s[upKey]; // Limites
      this._ensureDownUp(down, up, ctx); // Validar

      let yClamp; // Clamp
      if (y >= down) yClamp = down; // Down
      else if (y <= up) yClamp = up; // Up
      else yClamp = y; // Igual

      const dist = Math.abs(y - yClamp); // Distância

      if (!best || dist < best.dist) best = { i, down, up, yClamp, dist }; // Melhor
      else if (dist === best.dist && down > best.down) best = { i, down, up, yClamp, dist }; // Desempate
    } // Fechar for

    const deviation = (best.down === best.up) ? 0 : (best.yClamp - best.down) / (best.up - best.down); // Desvio

    return { // Return
      mode: "GAP_NEAREST",
      index: best.i,
      deviation: this._clamp01(deviation),
      yUsed: best.yClamp,
      debug: { chosenDown: best.down, chosenUp: best.up, yOriginal: y, yClamped: best.yClamp, dist: best.dist, rawDeviation: deviation }
    }; // Fechar return
  }, // Separador de métodos

  _rangeOf(data, key) { // Range min/max de uma coluna
    const vals = data.map(r => r[key]).filter(v => typeof v === "number" && Number.isFinite(v)); // Filtrar numéricos
    return { min: Math.min(...vals), max: Math.max(...vals) }; // Devolver min/max
  }, // Separador de métodos

  _fail(statusObj, where, errorMessage, partialDebug = {}) { // Resposta de falha padrão
    return {
      input: statusObj.input, // Input normalizado
      status: "failed", // Estado
      result: 0, // Resultado a 0
      debug: { // Debug com detalhe
        failedAtStep: where,
        error: errorMessage,
        ...partialDebug
      }
    }; // Fechar return
  }, // Separador de métodos

  _enforceAsdrLimitByDecrement(weight, { PA, OAT, wind, runway_conditions, ASDA }) { // Garante que ASDR calculada não excede a ASDA disponível
    let safeWeight = Math.ceil(weight); // Trabalhar com peso inteiro
    let iter = 0; // Proteção contra loops infinitos
    const MAX_ITER = 3000; // Limite de iterações suficiente para todo o envelope

    while (safeWeight > 0 && iter < MAX_ITER) { // Desce peso até cumprir ASDR<=ASDA
      const asdr = ASDR_FlapsUp({ PA, OAT, Weight: safeWeight, Wind: wind, runway: runway_conditions }); // Recalcular ASDR para o peso candidato
      if (asdr?.status === "passed" && Number.isFinite(asdr?.result) && Math.round(asdr.result) <= ASDA) { // Encontrou peso válido
        return { safeWeight, debug: { mode: "ASDR_CHECK_DECREMENT", iterations: iter, asdrAtSafeWeight: asdr.result } }; // Return
      }
      safeWeight -= 1; // Reduz 1 kg para tornar o resultado conservador
      iter += 1; // Incrementar contador
    }

    return { // Fallback conservador em caso de erro no cálculo forward
      safeWeight: 0, // Se não validar, falha de forma segura
      debug: { mode: "ASDR_CHECK_FALLBACK", iterations: iter, reason: "não foi possível validar ASDR dentro do limite de iterações" } // Debug
    };
  }, // Separador de métodos

  // ----------------------------------------------------
  // step1: ASDA -> y (resultData)
  // ----------------------------------------------------
  getYFromASDA(ASDA) { // Converter ASDA para Y por interpolação em resultData
    const asdas = this._uniqueSorted(resultData.map(r => r.ASD_m)); // Eixo ASDA
    const aB = this._bracket(asdas, ASDA); // Bracket ASDA (com snap exacto)

    const rowLo = resultData.find(r => r.ASD_m === aB.lo) || null; // Linha lo
    const rowHi = resultData.find(r => r.ASD_m === aB.hi) || null; // Linha hi
    if (!rowLo || !rowHi) throw new Error(`Step1: faltam linhas ASD_m=[${aB.lo},${aB.hi}]`); // Validar

    const y = this._interp1D(ASDA, aB.lo, aB.hi, rowLo.Y_Ref, rowHi.Y_Ref); // Interpolar Y
    return { y, debug: { asdaBracket: aB, rowLo, rowHi } }; // Return
  }, // Separador de métodos

  // ----------------------------------------------------
  // step2: y (condição de pista) -> y equivalente na base DRY
  // - DRY: identidade
  // - WET: mapeia por section+deviation na tabela WET e aplica na tabela DRY
  // ----------------------------------------------------
  getYBeforeRunway(runway_conditions, y_afterRunway) { // Remover efeito da condição pista
    if (runway_conditions === "DRY") { // Base DRY não altera
      return { // Return identidade
        y_beforeRunway: y_afterRunway, // Igual ao input
        debug: { runway_conditions, mode: "IDENTITY_DRY", yUsed: y_afterRunway } // Debug
      }; // Fechar return
    } // Fechar if

    const baseTable = runwayConditionData["DRY"]; // Base fixa DRY
    if (!baseTable) throw new Error("Step2: tabela base DRY não existe"); // Validar

    const targetTable = runwayConditionData[runway_conditions]; // Tabela alvo (WET)
    if (!targetTable) throw new Error(`Step2: runway_conditions inválida: ${runway_conditions}`); // Validar

    const baseRows = [...baseTable].sort((a, b) => a.Section - b.Section); // Ordenar base por secção
    const targetRows = [...targetTable].sort((a, b) => a.Section - b.Section); // Ordenar alvo por secção

    const pos = this._resolveNearestSectionByY( // Resolver posição na tabela alvo (WET)
      y_afterRunway, // y actual
      targetRows, // linhas WET ordenadas
      "Y_Ref_Down", // Down
      "Y_Ref_Up", // Up
      "Section", // Id secção
      "Step2(target)" // Contexto
    ); // Fechar chamada

    const sectionNum = pos.sectionId; // Secção encontrada
    const deviation = pos.deviation; // Desvio na secção

    const baseRow = baseRows.find(r => r.Section === sectionNum) || null; // Secção correspondente na DRY
    if (!baseRow) throw new Error(`Step2: secção ${sectionNum} não encontrada na base DRY`); // Validar

    const y_beforeRunway = this._lerp(baseRow.Y_Ref_Down, baseRow.Y_Ref_Up, deviation); // Aplicar desvio em DRY
    return { // Return
      y_beforeRunway, // y equivalente em DRY
      debug: { runway_conditions, sectionNum, deviation, mode: pos.mode, yUsed: pos.yUsed } // Debug
    }; // Fechar return
  }, // Separador de métodos

  // ----------------------------------------------------
  // step3: y (com vento) -> y equivalente a Wind=0
  // - wind=0: identidade
  // - Ordena por Y_Ref_Down desc para alinhar índices entre ventos
  // ----------------------------------------------------
  getYBeforeWind(wind, y_afterWind) { // Remover efeito do vento para equivalente Wind=0
    if (wind === 0) { // Caso especial: identidade
      return { // Return identidade
        y_beforeWind: y_afterWind, // Igual ao input
        debug: { wind, mode: "IDENTITY_WIND_0", yUsed: y_afterWind } // Debug
      }; // Fechar return
    } // Fechar if

    const winds = this._uniqueSorted(windData.map(r => r.Wind)); // Eixo vento
    const wB = this._bracket(winds, wind); // Bracket vento (com snap exacto)

    const rowsAtWind = (wVal) => windData // Helper: obter linhas de um vento
      .filter(r => r.Wind === wVal) // Filtrar
      .slice() // Copiar
      .sort((a, b) => b.Y_Ref_Down - a.Y_Ref_Down); // Ordenar por down desc (alinha “secções”)

    const wind0Rows = rowsAtWind(0); // Wind=0 ordenado
    if (wind0Rows.length === 0) throw new Error("Step3: sem linhas Wind=0"); // Validar

    const rowsLo = rowsAtWind(wB.lo); // Linhas lo ordenadas
    const rowsHi = rowsAtWind(wB.hi); // Linhas hi ordenadas
    if (rowsLo.length === 0 || rowsHi.length === 0) throw new Error(`Step3: faltam linhas Wind ${wB.lo}/${wB.hi}`); // Validar

    const pos = this._resolveNearestIndexByY( // Resolver índice+desvio em rowsLo
      y_afterWind, // y actual
      rowsLo, // Tabela lo
      "Y_Ref_Down", // Down
      "Y_Ref_Up", // Up
      "Step3(rowsLo)" // Contexto
    ); // Fechar chamada

    const sectionIndex = pos.index; // Índice na tabela ordenada
    const deviation = pos.deviation; // Desvio normalizado
    if (sectionIndex >= wind0Rows.length) throw new Error("Step3: sectionIndex fora de range (wind0Rows)"); // Validar
    if (sectionIndex >= rowsHi.length) throw new Error("Step3: sectionIndex fora de range (rowsHi)"); // Validar

    // (Opcional) reconstrução y no vento exacto (útil em debug quando há bracket não-exacto)
    const y_lo = this._lerp(rowsLo[sectionIndex].Y_Ref_Down, rowsLo[sectionIndex].Y_Ref_Up, deviation); // y em lo
    const y_hi = this._lerp(rowsHi[sectionIndex].Y_Ref_Down, rowsHi[sectionIndex].Y_Ref_Up, deviation); // y em hi
    const y_on_wind = this._lerp(y_lo, y_hi, wB.t); // y interpolado no vento pedido

    const y_beforeWind = this._lerp( // Aplicar o mesmo desvio em Wind=0
      wind0Rows[sectionIndex].Y_Ref_Down, // Down em Wind=0
      wind0Rows[sectionIndex].Y_Ref_Up, // Up em Wind=0
      deviation // Mesmo desvio
    ); // Fechar lerp

    return { // Return
      y_beforeWind, // y equivalente em Wind=0
      debug: { wind, windBracket: wB, sectionIndex, deviation, mode: pos.mode, yUsed: pos.yUsed, y_lo, y_hi, y_on_wind } // Debug
    }; // Fechar return
  }, // Separador de métodos

  // ----------------------------------------------------
  // step4: PA/OAT -> y_ref1 (bilinear)
  // ----------------------------------------------------
  getYRef1({ PA, OAT }) { // Bilinear em pressureAltTemperatureData
    const PAs = this._uniqueSorted(pressureAltTemperatureData.map(r => r.Pressure_Altitude)); // Eixo PA
    const temps = this._uniqueSorted(pressureAltTemperatureData.map(r => r.Temperature)); // Eixo temp

    const paB = this._bracket(PAs, PA); // Bracket PA (com snap exacto)
    const tB = this._bracket(temps, OAT); // Bracket temp (com snap exacto)

    const p_lo_t_lo = this._findByKeys(pressureAltTemperatureData, { Pressure_Altitude: paB.lo, Temperature: tB.lo }); // Canto
    const p_lo_t_hi = this._findByKeys(pressureAltTemperatureData, { Pressure_Altitude: paB.lo, Temperature: tB.hi }); // Canto
    const p_hi_t_lo = this._findByKeys(pressureAltTemperatureData, { Pressure_Altitude: paB.hi, Temperature: tB.lo }); // Canto
    const p_hi_t_hi = this._findByKeys(pressureAltTemperatureData, { Pressure_Altitude: paB.hi, Temperature: tB.hi }); // Canto

    if (!p_lo_t_lo || !p_lo_t_hi || !p_hi_t_lo || !p_hi_t_hi) { // Validar grelha
      throw new Error(`Step4: grelha furada para PA=[${paB.lo},${paB.hi}] Temp=[${tB.lo},${tB.hi}]`); // Erro
    } // Fechar if

    const y_lo = this._interp1D(OAT, tB.lo, tB.hi, p_lo_t_lo.Y_REF1, p_lo_t_hi.Y_REF1); // Interpolar temp em PA=lo
    const y_hi = this._interp1D(OAT, tB.lo, tB.hi, p_hi_t_lo.Y_REF1, p_hi_t_hi.Y_REF1); // Interpolar temp em PA=hi
    const y_ref1 = this._interp1D(PA, paB.lo, paB.hi, y_lo, y_hi); // Interpolar PA

    return { y_ref1, debug: { paBracket: paB, tempBracket: tB, yAtPaLo: y_lo, yAtPaHi: y_hi } }; // Return
  }, // Separador de métodos

  // ----------------------------------------------------
  // step5: y_ref1 -> section + deviation (refline)
  // ----------------------------------------------------
  getReflineSection(y_ref1) { // Resolver secção+desvio na reflineWeightData
    const r = this._resolveNearestSectionByY( // Resolver
      y_ref1, // y_ref1
      reflineWeightData, // tabela refline
      "Y_Refline_Section_Down", // down
      "Y_Refline_Section_Up", // up
      "sectionNum", // id secção
      "Step5" // contexto
    ); // Fechar chamada

    return { sectionNum: r.sectionId, deviation: r.deviation, debug: { mode: r.mode, yUsed: r.yUsed, ...r.debug } }; // Return
  }, // Separador de métodos

  // ----------------------------------------------------
  // step6 (CORRIGIDO): usar section + deviation do step5
  // - Para cada Weight na secção: y_at_weight = lerp(down, up, deviation)
  // - Inverte por interpolação para encontrar Weight onde y_at_weight == y_target
  // - Regras de envelope:
  //   * y_target > yMax  -> failed (result 0)
  //   * y_target < yMin  -> passed com maxWeight (ex.: 6500)
  // ----------------------------------------------------
  getExitWeightInSection(sectionNum, deviation, y_target) { // Calcular o peso que “bate” no y_target usando o mesmo deviation
    const rows = weightSectionData // Dataset de pesos
      .filter(r => r.Section === sectionNum) // Só a secção do Step5
      .sort((a, b) => a.Weight - b.Weight); // Ordenar por peso crescente

    if (rows.length < 2) throw new Error(`Step6: dados insuficientes para Section=${sectionNum}`); // Validar

    const points = rows.map(r => { // Transformar em pontos (W, y_at_weight)
      this._ensureDownUp(r.Y_Ref_Down, r.Y_Ref_Up, "Step6"); // Validar geometria
      const y_at_weight = this._lerp(r.Y_Ref_Down, r.Y_Ref_Up, deviation); // Aplicar o mesmo deviation
      return { Weight: r.Weight, y_at_weight, raw: r }; // Guardar ponto
    }); // Fechar map

    const ys = points.map(p => p.y_at_weight); // Lista de y
    const yMin = Math.min(...ys); // Envelope inferior
    const yMax = Math.max(...ys); // Envelope superior

    // Se a linha está ACIMA da tabela (não há solução) -> failed
    if (y_target > yMax) { // Acima do envelope
      return { // Return falha
        status: "failed", // Estado
        result: 0, // Resultado
        debug: { reason: "y_target acima do envelope", sectionNum, deviation, y_target, yMin, yMax } // Debug
      }; // Fechar return
    } // Fechar if

    // Se a linha está ABAIXO da tabela -> peso máximo (passed)
    if (y_target < yMin) { // Abaixo do envelope
      const maxWeight = points[points.length - 1].Weight; // Último peso (máximo)
      return { // Return clamp
        weight: maxWeight, // Clamp ao máximo
        debug: { mode: "CLAMP_MAX_WEIGHT", sectionNum, deviation, y_target, yMin, yMax } // Debug
      }; // Fechar return
    } // Fechar if

    // Procurar bracket (p0,p1) onde y_target fica entre dois pontos consecutivos
    const between = (y, y0, y1) => { // Verifica se y está entre y0 e y1
      const lo = Math.min(y0, y1); // Inferior
      const hi = Math.max(y0, y1); // Superior
      return (y >= lo && y <= hi); // Dentro
    }; // Fechar helper

    let p0 = null; // Ponto 0
    let p1 = null; // Ponto 1

    for (let i = 0; i < points.length - 1; i++) { // Percorrer pares consecutivos
      const a = points[i]; // Actual
      const b = points[i + 1]; // Próximo
      if (between(y_target, a.y_at_weight, b.y_at_weight)) { // Se y_target está entre estes dois
        p0 = a; // Guardar
        p1 = b; // Guardar
        break; // Par encontrado
      } // Fechar if
    } // Fechar for

    if (!p0 || !p1) { // Segurança (não devia acontecer porque já validámos envelope)
      return { status: "failed", result: 0, debug: { reason: "não foi possível bracketizar y_target", sectionNum, deviation, y_target, yMin, yMax } }; // Falha
    } // Fechar if

    const weight = this._interp1D( // Interpolar Weight em função do y_at_weight (inversão 1D)
      y_target, // y alvo
      p0.y_at_weight, // y0
      p1.y_at_weight, // y1
      p0.Weight, // W0
      p1.Weight // W1
    ); // Fechar interp1D

    return { // Return sucesso
      weight, // Peso calculado
      debug: { mode: "INTERP_BY_SECTION_DEVIATION", sectionNum, deviation, y_target, bracket: { p0, p1 }, yMin, yMax } // Debug
    }; // Fechar return
  }, // Separador de métodos

  // ----------------------------------------------------
  // main
  // ----------------------------------------------------
  compute(inputs) { // Função principal
    const PA = inputs?.PA; // Pressure Altitude
    const OAT = inputs?.OAT; // Temperatura
    const wind = (inputs?.wind ?? inputs?.Wind); // Vento
    const ASDA = (inputs?.ASDA ?? inputs?.asda); // ASDA
    const runwayRaw = (inputs?.runway_conditions ?? inputs?.runway); // Condição pista

    // Compatibilidade opcional 0/1 -> DRY/WET
    const runway_conditions = (runwayRaw === 0) ? "DRY" : (runwayRaw === 1) ? "WET" : runwayRaw; // Normalizar

    const base = { // Base para output/debug
      input: { PA, OAT, Wind: wind, runway_conditions, ASDA } // Input normalizado
    }; // Fechar base

    // Validação de tipos numéricos
    if (![PA, OAT, wind, ASDA].every(v => typeof v === "number" && Number.isFinite(v))) { // Validar numéricos
      return this._fail(base, "validation", "Inputs inválidos: esperado números finitos {PA,OAT,Wind/wind,ASDA} e runway_conditions."); // Falha
    } // Fechar if

    // Validação runway_conditions
    if (runway_conditions !== "DRY" && runway_conditions !== "WET") { // Validar condição
      return this._fail(base, "validation", `runway_conditions inválida: esperado "DRY" ou "WET", recebido=${String(runway_conditions)}`); // Falha
    } // Fechar if

    // Validação de ranges (falha, não clamp)
    const paR = this._rangeOf(pressureAltTemperatureData, "Pressure_Altitude"); // Range PA
    const tR = this._rangeOf(pressureAltTemperatureData, "Temperature"); // Range OAT
    const wiR = this._rangeOf(windData, "Wind"); // Range Wind
    const asdaR = this._rangeOf(resultData, "ASD_m"); // Range ASDA

    const outOfRange = (name, v, r) => `${name} fora do range [${r.min}, ${r.max}] (data). Valor=${v}`; // Mensagem
    if (PA < paR.min || PA > paR.max) return this._fail(base, "range", outOfRange("PA", PA, paR)); // Range PA
    if (OAT < tR.min || OAT > tR.max) return this._fail(base, "range", outOfRange("OAT", OAT, tR)); // Range OAT
    if (wind < wiR.min || wind > wiR.max) return this._fail(base, "range", outOfRange("Wind", wind, wiR)); // Range Wind
    if (ASDA < asdaR.min) return this._fail(base, "range", outOfRange("ASDA", ASDA, asdaR)); // Range ASDA (low => fail)
    const ASDA_used = (ASDA > asdaR.max) ? asdaR.max : ASDA; // ASDA (high => clamp)

    const debug = {}; // Debug acumulado
    if (ASDA_used !== ASDA) { // Registrar clamp de ASDA no debug
      debug.asdaClamp = { requested: ASDA, used: ASDA_used, range: { min: asdaR.min, max: asdaR.max } }; // Info clamp
    } // Fechar if

    try { // Step1
      debug.step1 = this.getYFromASDA(ASDA_used); // ASDA -> y (com clamp)
    } catch (e) {
      return this._fail(base, "step1", e?.message ?? String(e), { ...debug }); // Falha
    } // Fechar try/catch

    try { // Step2
      debug.step2 = this.getYBeforeRunway(runway_conditions, debug.step1.y); // Condição -> DRY
    } catch (e) {
      return this._fail(base, "step2", e?.message ?? String(e), { ...debug }); // Falha
    } // Fechar try/catch

    try { // Step3
      debug.step3 = this.getYBeforeWind(wind, debug.step2.y_beforeRunway); // Vento -> Wind=0
    } catch (e) {
      return this._fail(base, "step3", e?.message ?? String(e), { ...debug }); // Falha
    } // Fechar try/catch

    try { // Step4
      debug.step4 = this.getYRef1({ PA, OAT }); // PA/OAT -> y_ref1
    } catch (e) {
      return this._fail(base, "step4", e?.message ?? String(e), { ...debug }); // Falha
    } // Fechar try/catch

    try { // Step5
      debug.step5 = this.getReflineSection(debug.step4.y_ref1); // y_ref1 -> section+deviation
    } catch (e) {
      return this._fail(base, "step5", e?.message ?? String(e), { ...debug }); // Falha
    } // Fechar try/catch

    try { // Step6
      const s6 = this.getExitWeightInSection( // Chamar Step6 corrigido
        debug.step5.sectionNum, // Secção do refline
        debug.step5.deviation, // Deviation do refline
        debug.step3.y_beforeWind // y alvo do Step3
      ); // Fechar chamada

      debug.step6 = s6; // Guardar debug Step6

      if (s6.status === "failed") { // Se Step6 falhou (acima do envelope)
        return this._fail(base, "step6", "y_target acima do envelope (section+deviation)", { ...debug }); // Falha padrão
      } // Fechar if

      const conservative = this._enforceAsdrLimitByDecrement(s6.weight, { PA, OAT, wind, runway_conditions, ASDA: ASDA_used }); // Garantir consistência com ASDR calculada
      debug.step6Conservative = conservative.debug; // Registar ajuste no debug

      return { // Sucesso
        input: base.input, // Input normalizado
        status: "passed", // OK
        result: conservative.safeWeight, // MTOW conservador
        debug // Debug completo
      }; // Fechar return
    } catch (e) {
      return this._fail(base, "step6", e?.message ?? String(e), { ...debug }); // Falha
    } // Fechar try/catch
  } // Último método não precisa de vírgula
};
