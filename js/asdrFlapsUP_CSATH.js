// asdr.js
// Modalidade que queres manter:
//   import ASDR from "./asdr.js";
//   const asdr = ASDR({ PA: 4000, OAT: 22, Weight: 6300, Wind: 15, runway: 0 });
//   console.log(asdr.result, asdr.debug);
//
// Regras implementadas:
// - "Costura" (y == up/down): fica na secção de cima (Y maior) -> condição: (y < down && y >= up)
// - "Gap": se y cair num buraco entre secções, escolhe a secção mais perto e faz clamp ao limite mais próximo
// - Interpolações: bilinear (PA/OAT) e linear (Weight e Wind e runway quando necessário)

function ASDR(input) {
  return TO_ENGINE.compute(input);
}

export default ASDR;
export { ASDR };

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
// ENGINE
// ============================

const TO_ENGINE = {
  // ---------- helpers ----------
  _lerp(a, b, t) {
    return a + (b - a) * t;
  },
  _clamp01(t) {
    return t < 0 ? 0 : (t > 1 ? 1 : t);
  },
  _uniqueSorted(arr) {
    return Array.from(new Set(arr)).sort((a, b) => a - b);
  },
  _bracket(sortedVals, x) {
    const n = sortedVals.length;
    if (n === 0) throw new Error("Bracket: empty array");
    if (x <= sortedVals[0]) return { lo: sortedVals[0], hi: sortedVals[0], t: 0, clamped: "low" };
    if (x >= sortedVals[n - 1]) return { lo: sortedVals[n - 1], hi: sortedVals[n - 1], t: 0, clamped: "high" };

    for (let i = 0; i < n - 1; i++) {
      const lo = sortedVals[i];
      const hi = sortedVals[i + 1];
      if (x >= lo && x <= hi) {
        const t = (hi === lo) ? 0 : (x - lo) / (hi - lo);
        return { lo, hi, t };
      }
    }
    return { lo: sortedVals[n - 1], hi: sortedVals[n - 1], t: 0 };
  },
  _findByKeys(data, matchObj) {
    return data.find(row => Object.keys(matchObj).every(k => row[k] === matchObj[k])) || null;
  },
  _interp1D(x, x0, x1, y0, y1) {
    if (x1 === x0) return y0;
    const t = (x - x0) / (x1 - x0);
    return this._lerp(y0, y1, t);
  },

  // costura -> secção de cima: down > y >= up
  _inSectionTopStitch(y, down, up) {
    return (y < down && y >= up);
  },
  _ensureDownUp(down, up, ctx) {
    if (!(down > up)) throw new Error(`${ctx}: secção inválida (esperado down > up). down=${down}, up=${up}`);
  },

  // resolve: normal; senão gap/outside -> nearest + clamp
  _resolveNearestSectionByY(y, sections, downKey, upKey, idKey, ctx) {
    if (!Array.isArray(sections) || sections.length === 0) throw new Error(`${ctx}: empty sections`);

    for (const s of sections) {
      const down = s[downKey], up = s[upKey];
      this._ensureDownUp(down, up, ctx);

      if (this._inSectionTopStitch(y, down, up)) {
        const deviation = (down === up) ? 0 : (y - down) / (up - down);
        return { mode: "SECTION", sectionId: s[idKey], deviation: this._clamp01(deviation), yUsed: y, debug: { down, up, rawDeviation: deviation } };
      }
    }

    let best = null;
    for (const s of sections) {
      const down = s[downKey], up = s[upKey];
      this._ensureDownUp(down, up, ctx);

      let yClamp;
      if (y >= down) yClamp = down;
      else if (y <= up) yClamp = up;
      else yClamp = y;

      const dist = Math.abs(y - yClamp);

      if (!best || dist < best.dist) best = { s, down, up, yClamp, dist };
      else if (dist === best.dist && down > best.down) best = { s, down, up, yClamp, dist }; // desempate: secção de cima
    }

    const deviation = (best.down === best.up) ? 0 : (best.yClamp - best.down) / (best.up - best.down);

    return {
      mode: "GAP_NEAREST",
      sectionId: best.s[idKey],
      deviation: this._clamp01(deviation),
      yUsed: best.yClamp,
      debug: { chosenDown: best.down, chosenUp: best.up, yOriginal: y, yClamped: best.yClamp, dist: best.dist, rawDeviation: deviation }
    };
  },

  _resolveNearestIndexByY(y, sections, downKey, upKey, ctx) {
    if (!Array.isArray(sections) || sections.length === 0) throw new Error(`${ctx}: empty sections`);

    for (let i = 0; i < sections.length; i++) {
      const s = sections[i];
      const down = s[downKey], up = s[upKey];
      this._ensureDownUp(down, up, ctx);

      if (this._inSectionTopStitch(y, down, up)) {
        const deviation = (down === up) ? 0 : (y - down) / (up - down);
        return { mode: "SECTION", index: i, deviation: this._clamp01(deviation), yUsed: y, debug: { down, up, rawDeviation: deviation } };
      }
    }

    let best = null;
    for (let i = 0; i < sections.length; i++) {
      const s = sections[i];
      const down = s[downKey], up = s[upKey];
      this._ensureDownUp(down, up, ctx);

      let yClamp;
      if (y >= down) yClamp = down;
      else if (y <= up) yClamp = up;
      else yClamp = y;

      const dist = Math.abs(y - yClamp);

      if (!best || dist < best.dist) best = { i, down, up, yClamp, dist };
      else if (dist === best.dist && down > best.down) best = { i, down, up, yClamp, dist };
    }

    const deviation = (best.down === best.up) ? 0 : (best.yClamp - best.down) / (best.up - best.down);

    return {
      mode: "GAP_NEAREST",
      index: best.i,
      deviation: this._clamp01(deviation),
      yUsed: best.yClamp,
      debug: { chosenDown: best.down, chosenUp: best.up, yOriginal: y, yClamped: best.yClamp, dist: best.dist, rawDeviation: deviation }
    };
  },

	_rangeOf(data, key) {
	  const vals = data.map(r => r[key]).filter(v => typeof v === "number" && Number.isFinite(v));
	  return { min: Math.min(...vals), max: Math.max(...vals) };
	},

	_fail(statusObj, where, errorMessage, partialDebug = {}) {
	  return {
		input: statusObj.input,
		status: "failed",
		result: 0,
		debug: {
		  failedAtStep: where,
		  error: errorMessage,
		  ...partialDebug
		}
	  };
	},

  // ---------- step1: bilinear (PA, OAT) ----------
  getYRef1({ PA, OAT }) {
    const PAs = this._uniqueSorted(pressureAltTemperatureData.map(r => r.Pressure_Altitude));
    const temps = this._uniqueSorted(pressureAltTemperatureData.map(r => r.Temperature));

    const paB = this._bracket(PAs, PA);
    const tB = this._bracket(temps, OAT);

    const p_lo_t_lo = this._findByKeys(pressureAltTemperatureData, { Pressure_Altitude: paB.lo, Temperature: tB.lo });
    const p_lo_t_hi = this._findByKeys(pressureAltTemperatureData, { Pressure_Altitude: paB.lo, Temperature: tB.hi });
    const p_hi_t_lo = this._findByKeys(pressureAltTemperatureData, { Pressure_Altitude: paB.hi, Temperature: tB.lo });
    const p_hi_t_hi = this._findByKeys(pressureAltTemperatureData, { Pressure_Altitude: paB.hi, Temperature: tB.hi });

    if (!p_lo_t_lo || !p_lo_t_hi || !p_hi_t_lo || !p_hi_t_hi) {
      throw new Error(`Step1: grelha furada para PA=[${paB.lo},${paB.hi}] Temp=[${tB.lo},${tB.hi}]`);
    }

    const y_lo = this._interp1D(OAT, tB.lo, tB.hi, p_lo_t_lo.Y_REF1, p_lo_t_hi.Y_REF1);
    const y_hi = this._interp1D(OAT, tB.lo, tB.hi, p_hi_t_lo.Y_REF1, p_hi_t_hi.Y_REF1);
    const y_ref1 = this._interp1D(PA, paB.lo, paB.hi, y_lo, y_hi);

    return { y_ref1, debug: { paBracket: paB, tempBracket: tB, yAtPaLo: y_lo, yAtPaHi: y_hi } };
  },

  // ---------- step2: section + deviation% ----------
  getReflineSection(y_ref1) {
    const r = this._resolveNearestSectionByY(
      y_ref1,
      reflineWeightData,
      "Y_Refline_Section_Down",
      "Y_Refline_Section_Up",
      "sectionNum",
      "Step2"
    );

    return { sectionNum: r.sectionId, deviation: r.deviation, debug: { mode: r.mode, yUsed: r.yUsed, ...r.debug } };
  },

  // ---------- step3: y_refWeight (interp Weight) ----------
  getYRefWeight({ Weight }, sectionNum, deviation) {
    const weights = this._uniqueSorted(weightSectionData.map(r => r.Weight));
    const wB = this._bracket(weights, Weight);

    const rowLo = this._findByKeys(weightSectionData, { Weight: wB.lo, Section: sectionNum });
    const rowHi = this._findByKeys(weightSectionData, { Weight: wB.hi, Section: sectionNum });

    if (!rowLo || !rowHi) {
      throw new Error(`Step3: faltam linhas Weight=[${wB.lo},${wB.hi}] Section=${sectionNum}`);
    }

    const yLo = this._lerp(rowLo.Y_Ref_Down, rowLo.Y_Ref_Up, deviation);
    const yHi = this._lerp(rowHi.Y_Ref_Down, rowHi.Y_Ref_Up, deviation);
    const y_refWeight = this._interp1D(Weight, wB.lo, wB.hi, yLo, yHi);

    return { y_refWeight, debug: { weightBracket: wB, yAtWLo: yLo, yAtWHi: yHi } };
  },

  // ---------- step4: y_refWind (base Wind=0, aplica desvio e interp vento) ----------
  getYRefWind({ wind }, y_refWeight) {
    const winds = this._uniqueSorted(windData.map(r => r.Wind));
    const wB = this._bracket(winds, wind);

    const wind0Rows = windData.filter(r => r.Wind === 0);
    if (wind0Rows.length === 0) throw new Error("Step4: sem linhas Wind=0");

    const base = this._resolveNearestIndexByY(y_refWeight, wind0Rows, "Y_Ref_Down", "Y_Ref_Up", "Step4");
    const sectionIndex = base.index;
    const deviation = base.deviation;

    const rowsAtWind = (wVal) => windData.filter(r => r.Wind === wVal);
    const rowsLo = rowsAtWind(wB.lo);
    const rowsHi = rowsAtWind(wB.hi);

    if (rowsLo.length === 0 || rowsHi.length === 0) throw new Error(`Step4: faltam linhas Wind ${wB.lo}/${wB.hi}`);
    if (sectionIndex >= rowsLo.length || sectionIndex >= rowsHi.length) throw new Error(`Step4: sectionIndex fora de range`);

    const yLo = this._lerp(rowsLo[sectionIndex].Y_Ref_Down, rowsLo[sectionIndex].Y_Ref_Up, deviation);
    const yHi = this._lerp(rowsHi[sectionIndex].Y_Ref_Down, rowsHi[sectionIndex].Y_Ref_Up, deviation);
    const y_refWind = this._interp1D(wind, wB.lo, wB.hi, yLo, yHi);

    return { y_refWind, debug: { windBracket: wB, baseResolve: base, sectionIndex, deviation, yAtWindLo: yLo, yAtWindHi: yHi } };
  },

  // ---------- step5: y_refRunwayCondition (DRY/WET) ----------
getYRefRunwayCondition({ runway }, y_refWind) {

  // 1) Escolher uma tabela BASE para calcular secção+desvio (usa DRY como referência estável)
  const baseTable = runwayConditionData["DRY"]; // Base fixa para localizar a posição na escala
  if (!baseTable) { // Validar que existe a tabela base
    throw new Error("Step5: tabela base DRY não existe"); // Lançar erro se faltar
  }

  // 2) Escolher a tabela ALVO (a condição pedida: DRY ou WET)
  const targetTable = runwayConditionData[runway]; // Buscar tabela conforme o input
  if (!targetTable) { // Validar condição recebida
    throw new Error(`Step5: runway condition inválida: ${runway}`); // Erro se não for DRY/WET
  }

  // 3) Criar cópias ordenadas (IMPORTANTE: sort() altera o array original)
  const baseRows = [...baseTable].sort((a, b) => a.Section - b.Section); // Ordenar sem mutar o original
  const targetRows = [...targetTable].sort((a, b) => a.Section - b.Section); // Ordenar sem mutar o original

  // 4) Resolver secção+desvio NA TABELA BASE, usando o y_refWind como “posição” a mapear
  const base = this._resolveNearestSectionByY(
    y_refWind,        // Valor Y atual (antes de aplicar condição)
    baseRows,         // Tabela base (DRY)
    "Y_Ref_Down",     // Nome da coluna Down
    "Y_Ref_Up",       // Nome da coluna Up
    "Section",        // Campo que identifica a secção
    "Step5(base)"     // Contexto para debug/erros
  );

  // 5) Extrair secção e desvio obtidos na base
  const sectionNum = base.sectionId; // Secção correspondente na base
  const deviation = base.deviation;  // Percentagem dentro da secção (0..1)

  // 6) Encontrar a secção equivalente na tabela ALVO
  const targetRow = targetRows.find(r => r.Section === sectionNum); // Procurar mesma secção
  if (!targetRow) { // Validar que a secção existe na tabela alvo
    throw new Error(`Step5: secção ${sectionNum} não encontrada para runway=${runway}`); // Erro se faltar
  }

  // 7) Aplicar o MESMO desvio na secção da tabela alvo (aqui sim há conversão DRY->WET)
  const y_refRunway = this._lerp(
    targetRow.Y_Ref_Down, // Limite Down da secção na tabela alvo
    targetRow.Y_Ref_Up,   // Limite Up da secção na tabela alvo
    deviation             // Mesmo desvio calculado na base
  );

  // 8) Devolver resultado e debug útil
  return {
    y_refRunway, // Novo Y depois de aplicar condição de pista
    debug: { runway, sectionNum, deviation, baseMode: base.mode, baseYUsed: base.yUsed } // Info para diagnosticar
  };
},

  // ---------- step6: invert resultData (Y -> ASD_m) ----------
  getResultFromY(y_refRunway) {
    const sorted = [...resultData].sort((a, b) => b.Y_Ref - a.Y_Ref); // Y desc

    if (y_refRunway >= sorted[0].Y_Ref) return { result: sorted[0].ASD_m, debug: { clamped: "high" } };
    if (y_refRunway <= sorted[sorted.length - 1].Y_Ref) return { result: sorted[sorted.length - 1].ASD_m, debug: { clamped: "low" } };

    for (let i = 0; i < sorted.length - 1; i++) {
      const a = sorted[i], b = sorted[i + 1];
      if (y_refRunway <= a.Y_Ref && y_refRunway >= b.Y_Ref) {
        const t = (a.Y_Ref === b.Y_Ref) ? 0 : (y_refRunway - a.Y_Ref) / (b.Y_Ref - a.Y_Ref);
        return { result: this._lerp(a.ASD_m, b.ASD_m, t), debug: { bracket: { a, b }, t } };
      }
    }

    throw new Error(`Step6: não consegui fazer bracket para y_refRunway=${y_refRunway}`);
  },

  // ---------- main ----------
  compute(inputs) {
	  // Normalização de nomes
	  const PA = inputs?.PA;
	  const OAT = inputs?.OAT;
	  const Weight = inputs?.Weight;
	  const wind = (inputs?.wind ?? inputs?.Wind);
	  const runway = inputs?.runway;

	  const base = {
		input: { PA, OAT, Weight, Wind: wind, runway }
	  };

	  // 0) validação de tipo (número finito)
	  if (![PA, OAT, Weight, wind].every(v => typeof v === "number" && Number.isFinite(v))) {
		return this._fail(base, "validation", "Inputs inválidos: esperado números finitos {PA,OAT,Weight,Wind/wind,runway}.");
	  }
	  if (runway !== "DRY" && runway !== "WET") {
		  return this._fail(base, "validation", `runway inválido: esperado "DRY" ou "WET", recebido=${String(runway)}`);
		}

	  // 0) validação de tipo (número finito)
		if (![PA, OAT, Weight, wind].every(v => typeof v === "number" && Number.isFinite(v))) {
		  // Falha se algum dos valores numéricos não for número finito
		  return this._fail(base, "validation", "Inputs inválidos: esperado números finitos {PA,OAT,Weight,Wind/wind,runway}.");
		}

		// validação de runway (string)
		if (runway !== "DRY" && runway !== "WET") {
		  // Falha se runway não for exatamente "DRY" ou "WET"
		  return this._fail(base, "validation", `runway inválido: esperado "DRY" ou "WET", recebido=${String(runway)}`);
		}

		// 0b) validação de ranges (não faz clamp: falha)
		const paR = this._rangeOf(pressureAltTemperatureData, "Pressure_Altitude"); // Range suportado de PA
		const tR  = this._rangeOf(pressureAltTemperatureData, "Temperature");       // Range suportado de OAT
		const wR  = this._rangeOf(weightSectionData, "Weight");                     // Range suportado de Weight
		const wiR = this._rangeOf(windData, "Wind");                                // Range suportado de Wind

		function outOfRange(name, v, r) {
		  // Mensagem consistente para erro de range
		  return `${name} fora do range [${r.min}, ${r.max}] (data). Valor=${v}`;
		}

		// Falhas de range para os valores numéricos
		if (PA < paR.min || PA > paR.max) return this._fail(base, "step 1", outOfRange("PA", PA, paR));
		if (OAT < tR.min || OAT > tR.max) return this._fail(base, "step 2", outOfRange("OAT", OAT, tR));
		if (Weight < wR.min || Weight > wR.max) return this._fail(base, "step 3", outOfRange("Weight", Weight, wR));
		if (wind < wiR.min || wind > wiR.max) return this._fail(base, "step 4", outOfRange("Wind", wind, wiR));

	  // 1..6) execução com captura de erro por step
	  const debug = {};

	  try {
		const s1 = this.getYRef1({ PA, OAT });
		debug.step1 = s1;
	  } catch (e) {
		return this._fail(base, "step1", e?.message ?? String(e), { ...debug });
	  }

	  try {
		const s2 = this.getReflineSection(debug.step1.y_ref1);
		debug.step2 = s2;
	  } catch (e) {
		return this._fail(base, "step2", e?.message ?? String(e), { ...debug });
	  }

	  try {
		const s3 = this.getYRefWeight({ Weight }, debug.step2.sectionNum, debug.step2.deviation);
		debug.step3 = s3;
	  } catch (e) {
		return this._fail(base, "step3", e?.message ?? String(e), { ...debug });
	  }

	  try {
		const s4 = this.getYRefWind({ wind }, debug.step3.y_refWeight);
		debug.step4 = s4;
	  } catch (e) {
		return this._fail(base, "step4", e?.message ?? String(e), { ...debug });
	  }

	  try {
		const s5 = this.getYRefRunwayCondition({ runway }, debug.step4.y_refWind);
		debug.step5 = s5;
	  } catch (e) {
		return this._fail(base, "step5", e?.message ?? String(e), { ...debug });
	  }

	  try {
		const s6 = this.getResultFromY(debug.step5.y_refRunway);

		debug.step6 = s6;

		return {
		  input: base.input,
		  status: "passed",
		  result: s6.result,
		  debug
		};
	  } catch (e) {
		return this._fail(base, "step6", e?.message ?? String(e), { ...debug });
	  }
	},
};

