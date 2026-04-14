
// Uso:
//   import MTOW from "./mtow_slope.js";
//   const mtow = MTOW({ PA: 4000, OAT: 20, Wind: 10, slope: 0, TORA: 800});
//   console.log(mtow.status, mtow.result);
//   console.log(mtow.debug);
import TODR_Flaps1 from "./todrFlaps1_CSATH.js";

function MTOW(input) { // Função pública (mesmo estilo)
  return ENGINE.compute(input); // Executar motor com debug
}

export default MTOW; // Export default
export { MTOW };     // Export nomeado

// ============================
// DATASETS 
// ============================

const pressureAltTemperatureData = [
  { "Pressure_Altitude": 12000, "Temperature": -40, "Y_REF1": 382 },
  { "Pressure_Altitude": 12000, "Temperature": -30, "Y_REF1": 325 },
  { "Pressure_Altitude": 12000, "Temperature": -20, "Y_REF1": 238 },

  { "Pressure_Altitude": 10000, "Temperature": -40, "Y_REF1": 469 },
  { "Pressure_Altitude": 10000, "Temperature": -30, "Y_REF1": 434 },
  { "Pressure_Altitude": 10000, "Temperature": -20, "Y_REF1": 388 },
  { "Pressure_Altitude": 10000, "Temperature": -10, "Y_REF1": 314 },
  { "Pressure_Altitude": 10000, "Temperature": 0, "Y_REF1": 227 },

  { "Pressure_Altitude": 8000, "Temperature": -40, "Y_REF1": 513 },
  { "Pressure_Altitude": 8000, "Temperature": -30, "Y_REF1": 498 },
  { "Pressure_Altitude": 8000, "Temperature": -20, "Y_REF1": 467 },
  { "Pressure_Altitude": 8000, "Temperature": -10, "Y_REF1": 430 },
  { "Pressure_Altitude": 8000, "Temperature": 0, "Y_REF1": 384 },
  { "Pressure_Altitude": 8000, "Temperature": 10, "Y_REF1": 308 },

  { "Pressure_Altitude": 6000, "Temperature": -30, "Y_REF1": 530 },
  { "Pressure_Altitude": 6000, "Temperature": -20, "Y_REF1": 517 },
  { "Pressure_Altitude": 6000, "Temperature": -10, "Y_REF1": 500 },
  { "Pressure_Altitude": 6000, "Temperature": 0, "Y_REF1": 474 },
  { "Pressure_Altitude": 6000, "Temperature": 10, "Y_REF1": 426 },
  { "Pressure_Altitude": 6000, "Temperature": 20, "Y_REF1": 356 },
  { "Pressure_Altitude": 6000, "Temperature": 30, "Y_REF1": 246 },

  { "Pressure_Altitude": 4000, "Temperature": -30, "Y_REF1": 550 },
  { "Pressure_Altitude": 4000, "Temperature": -20, "Y_REF1": 539 },
  { "Pressure_Altitude": 4000, "Temperature": -10, "Y_REF1": 530 },
  { "Pressure_Altitude": 4000, "Temperature": 0, "Y_REF1": 517 },
  { "Pressure_Altitude": 4000, "Temperature": 10, "Y_REF1": 496 },
  { "Pressure_Altitude": 4000, "Temperature": 20, "Y_REF1": 445 },
  { "Pressure_Altitude": 4000, "Temperature": 30, "Y_REF1": 369 },
  { "Pressure_Altitude": 4000, "Temperature": 40, "Y_REF1": 263 },

  { "Pressure_Altitude": 2000, "Temperature": -20, "Y_REF1": 560 },
  { "Pressure_Altitude": 2000, "Temperature": -10, "Y_REF1": 551 },
  { "Pressure_Altitude": 2000, "Temperature": 0, "Y_REF1": 538 },
  { "Pressure_Altitude": 2000, "Temperature": 10, "Y_REF1": 530 },
  { "Pressure_Altitude": 2000, "Temperature": 20, "Y_REF1": 508 },
  { "Pressure_Altitude": 2000, "Temperature": 30, "Y_REF1": 460 },
  { "Pressure_Altitude": 2000, "Temperature": 40, "Y_REF1": 368 },
  { "Pressure_Altitude": 2000, "Temperature": 50, "Y_REF1": 259 },

  { "Pressure_Altitude": 0, "Temperature": -20, "Y_REF1": 574 },
  { "Pressure_Altitude": 0, "Temperature": -10, "Y_REF1": 565 },
  { "Pressure_Altitude": 0, "Temperature": 0, "Y_REF1": 559 },
  { "Pressure_Altitude": 0, "Temperature": 10, "Y_REF1": 550 },
  { "Pressure_Altitude": 0, "Temperature": 20, "Y_REF1": 539 },
  { "Pressure_Altitude": 0, "Temperature": 30, "Y_REF1": 522 },
  { "Pressure_Altitude": 0, "Temperature": 40, "Y_REF1": 465 },
  { "Pressure_Altitude": 0, "Temperature": 50, "Y_REF1": 373 }
];

const reflineWeightData = [
  { "sectionNum": 1, "Y_Refline_Section_Down": 565, "Y_Refline_Section_Up": 522 },
  { "sectionNum": 2, "Y_Refline_Section_Down": 522, "Y_Refline_Section_Up": 480 },
  { "sectionNum": 3, "Y_Refline_Section_Down": 480, "Y_Refline_Section_Up": 437 },
  { "sectionNum": 4, "Y_Refline_Section_Down": 437, "Y_Refline_Section_Up": 395 },
  { "sectionNum": 5, "Y_Refline_Section_Down": 395, "Y_Refline_Section_Up": 351 },
  { "sectionNum": 6, "Y_Refline_Section_Down": 351, "Y_Refline_Section_Up": 310 },
  { "sectionNum": 7, "Y_Refline_Section_Down": 310, "Y_Refline_Section_Up": 268 }
];

const weightSectionData = [
  { "Weight": 4500, "Section": 1, "Y_Ref_Down": 631, "Y_Ref_Up": 613 },
  { "Weight": 4500, "Section": 2, "Y_Ref_Down": 613, "Y_Ref_Up": 597 },
  { "Weight": 4500, "Section": 3, "Y_Ref_Down": 597, "Y_Ref_Up": 576 },
  { "Weight": 4500, "Section": 4, "Y_Ref_Down": 576, "Y_Ref_Up": 561 },
  { "Weight": 4500, "Section": 5, "Y_Ref_Down": 561, "Y_Ref_Up": 542 },
  { "Weight": 4500, "Section": 6, "Y_Ref_Down": 542, "Y_Ref_Up": 528 },
  { "Weight": 4500, "Section": 7, "Y_Ref_Down": 528, "Y_Ref_Up": 513 },

  { "Weight": 4600, "Section": 1, "Y_Ref_Down": 630, "Y_Ref_Up": 609 },
  { "Weight": 4600, "Section": 2, "Y_Ref_Down": 609, "Y_Ref_Up": 594 },
  { "Weight": 4600, "Section": 3, "Y_Ref_Down": 594, "Y_Ref_Up": 571 },
  { "Weight": 4600, "Section": 4, "Y_Ref_Down": 571, "Y_Ref_Up": 556 },
  { "Weight": 4600, "Section": 5, "Y_Ref_Down": 556, "Y_Ref_Up": 535 },
  { "Weight": 4600, "Section": 6, "Y_Ref_Down": 535, "Y_Ref_Up": 520 },
  { "Weight": 4600, "Section": 7, "Y_Ref_Down": 520, "Y_Ref_Up": 506 },

  { "Weight": 4700, "Section": 1, "Y_Ref_Down": 626, "Y_Ref_Up": 606 },
  { "Weight": 4700, "Section": 2, "Y_Ref_Down": 606, "Y_Ref_Up": 590 },
  { "Weight": 4700, "Section": 3, "Y_Ref_Down": 590, "Y_Ref_Up": 566 },
  { "Weight": 4700, "Section": 4, "Y_Ref_Down": 566, "Y_Ref_Up": 549 },
  { "Weight": 4700, "Section": 5, "Y_Ref_Down": 549, "Y_Ref_Up": 530 },
  { "Weight": 4700, "Section": 6, "Y_Ref_Down": 530, "Y_Ref_Up": 514 },
  { "Weight": 4700, "Section": 7, "Y_Ref_Down": 514, "Y_Ref_Up": 499 },

  { "Weight": 4800, "Section": 1, "Y_Ref_Down": 623, "Y_Ref_Up": 602 },
  { "Weight": 4800, "Section": 2, "Y_Ref_Down": 602, "Y_Ref_Up": 583 },
  { "Weight": 4800, "Section": 3, "Y_Ref_Down": 583, "Y_Ref_Up": 561 },
  { "Weight": 4800, "Section": 4, "Y_Ref_Down": 561, "Y_Ref_Up": 545 },
  { "Weight": 4800, "Section": 5, "Y_Ref_Down": 545, "Y_Ref_Up": 523 },
  { "Weight": 4800, "Section": 6, "Y_Ref_Down": 523, "Y_Ref_Up": 506 },
  { "Weight": 4800, "Section": 7, "Y_Ref_Down": 506, "Y_Ref_Up": 489 },

  { "Weight": 4900, "Section": 1, "Y_Ref_Down": 621, "Y_Ref_Up": 599 },
  { "Weight": 4900, "Section": 2, "Y_Ref_Down": 599, "Y_Ref_Up": 580 },
  { "Weight": 4900, "Section": 3, "Y_Ref_Down": 580, "Y_Ref_Up": 556 },
  { "Weight": 4900, "Section": 4, "Y_Ref_Down": 556, "Y_Ref_Up": 539 },
  { "Weight": 4900, "Section": 5, "Y_Ref_Down": 539, "Y_Ref_Up": 516 },
  { "Weight": 4900, "Section": 6, "Y_Ref_Down": 516, "Y_Ref_Up": 499 },
  { "Weight": 4900, "Section": 7, "Y_Ref_Down": 499, "Y_Ref_Up": 482 },

  { "Weight": 5000, "Section": 1, "Y_Ref_Down": 618, "Y_Ref_Up": 594 },
  { "Weight": 5000, "Section": 2, "Y_Ref_Down": 594, "Y_Ref_Up": 573 },
  { "Weight": 5000, "Section": 3, "Y_Ref_Down": 573, "Y_Ref_Up": 549 },
  { "Weight": 5000, "Section": 4, "Y_Ref_Down": 549, "Y_Ref_Up": 532 },
  { "Weight": 5000, "Section": 5, "Y_Ref_Down": 532, "Y_Ref_Up": 511 },
  { "Weight": 5000, "Section": 6, "Y_Ref_Down": 511, "Y_Ref_Up": 492 },
  { "Weight": 5000, "Section": 7, "Y_Ref_Down": 492, "Y_Ref_Up": 473 },

  { "Weight": 5100, "Section": 1, "Y_Ref_Down": 614, "Y_Ref_Up": 590 },
  { "Weight": 5100, "Section": 2, "Y_Ref_Down": 590, "Y_Ref_Up": 566 },
  { "Weight": 5100, "Section": 3, "Y_Ref_Down": 566, "Y_Ref_Up": 542 },
  { "Weight": 5100, "Section": 4, "Y_Ref_Down": 542, "Y_Ref_Up": 523 },
  { "Weight": 5100, "Section": 5, "Y_Ref_Down": 523, "Y_Ref_Up": 504 },
  { "Weight": 5100, "Section": 6, "Y_Ref_Down": 504, "Y_Ref_Up": 483 },
  { "Weight": 5100, "Section": 7, "Y_Ref_Down": 483, "Y_Ref_Up": 465 },

  { "Weight": 5200, "Section": 1, "Y_Ref_Down": 611, "Y_Ref_Up": 583 },
  { "Weight": 5200, "Section": 2, "Y_Ref_Down": 583, "Y_Ref_Up": 559 },
  { "Weight": 5200, "Section": 3, "Y_Ref_Down": 559, "Y_Ref_Up": 535 },
  { "Weight": 5200, "Section": 4, "Y_Ref_Down": 535, "Y_Ref_Up": 514 },
  { "Weight": 5200, "Section": 5, "Y_Ref_Down": 514, "Y_Ref_Up": 496 },
  { "Weight": 5200, "Section": 6, "Y_Ref_Down": 496, "Y_Ref_Up": 473 },
  { "Weight": 5200, "Section": 7, "Y_Ref_Down": 473, "Y_Ref_Up": 454 },

  { "Weight": 5300, "Section": 1, "Y_Ref_Down": 606, "Y_Ref_Up": 578 },
  { "Weight": 5300, "Section": 2, "Y_Ref_Down": 578, "Y_Ref_Up": 551 },
  { "Weight": 5300, "Section": 3, "Y_Ref_Down": 551, "Y_Ref_Up": 526 },
  { "Weight": 5300, "Section": 4, "Y_Ref_Down": 526, "Y_Ref_Up": 504 },
  { "Weight": 5300, "Section": 5, "Y_Ref_Down": 504, "Y_Ref_Up": 485 },
  { "Weight": 5300, "Section": 6, "Y_Ref_Down": 485, "Y_Ref_Up": 461 },
  { "Weight": 5300, "Section": 7, "Y_Ref_Down": 461, "Y_Ref_Up": 442 },

  { "Weight": 5400, "Section": 1, "Y_Ref_Down": 602, "Y_Ref_Up": 571 },
  { "Weight": 5400, "Section": 2, "Y_Ref_Down": 571, "Y_Ref_Up": 544 },
  { "Weight": 5400, "Section": 3, "Y_Ref_Down": 544, "Y_Ref_Up": 518 },
  { "Weight": 5400, "Section": 4, "Y_Ref_Down": 518, "Y_Ref_Up": 492 },
  { "Weight": 5400, "Section": 5, "Y_Ref_Down": 492, "Y_Ref_Up": 470 },
  { "Weight": 5400, "Section": 6, "Y_Ref_Down": 470, "Y_Ref_Up": 444 },
  { "Weight": 5400, "Section": 7, "Y_Ref_Down": 444, "Y_Ref_Up": 420 },

  { "Weight": 5500, "Section": 1, "Y_Ref_Down": 599, "Y_Ref_Up": 566 },
  { "Weight": 5500, "Section": 2, "Y_Ref_Down": 566, "Y_Ref_Up": 537 },
  { "Weight": 5500, "Section": 3, "Y_Ref_Down": 537, "Y_Ref_Up": 506 },
  { "Weight": 5500, "Section": 4, "Y_Ref_Down": 506, "Y_Ref_Up": 478 },
  { "Weight": 5500, "Section": 5, "Y_Ref_Down": 478, "Y_Ref_Up": 454 },
  { "Weight": 5500, "Section": 6, "Y_Ref_Down": 454, "Y_Ref_Up": 425 },
  { "Weight": 5500, "Section": 7, "Y_Ref_Down": 425, "Y_Ref_Up": 396 },

  { "Weight": 5600, "Section": 1, "Y_Ref_Down": 595, "Y_Ref_Up": 559 },
  { "Weight": 5600, "Section": 2, "Y_Ref_Down": 559, "Y_Ref_Up": 528 },
  { "Weight": 5600, "Section": 3, "Y_Ref_Down": 528, "Y_Ref_Up": 497 },
  { "Weight": 5600, "Section": 4, "Y_Ref_Down": 497, "Y_Ref_Up": 466 },
  { "Weight": 5600, "Section": 5, "Y_Ref_Down": 466, "Y_Ref_Up": 435 },
  { "Weight": 5600, "Section": 6, "Y_Ref_Down": 435, "Y_Ref_Up": 404 },
  { "Weight": 5600, "Section": 7, "Y_Ref_Down": 404, "Y_Ref_Up": 370 },

  { "Weight": 5700, "Section": 1, "Y_Ref_Down": 587, "Y_Ref_Up": 551 },
  { "Weight": 5700, "Section": 2, "Y_Ref_Down": 551, "Y_Ref_Up": 521 },
  { "Weight": 5700, "Section": 3, "Y_Ref_Down": 521, "Y_Ref_Up": 483 },
  { "Weight": 5700, "Section": 4, "Y_Ref_Down": 483, "Y_Ref_Up": 449 },
  { "Weight": 5700, "Section": 5, "Y_Ref_Down": 449, "Y_Ref_Up": 415 },
  { "Weight": 5700, "Section": 6, "Y_Ref_Down": 415, "Y_Ref_Up": 384 },
  { "Weight": 5700, "Section": 7, "Y_Ref_Down": 384, "Y_Ref_Up": 348 },

  { "Weight": 5800, "Section": 1, "Y_Ref_Down": 580, "Y_Ref_Up": 542 },
  { "Weight": 5800, "Section": 2, "Y_Ref_Down": 542, "Y_Ref_Up": 508 },
  { "Weight": 5800, "Section": 3, "Y_Ref_Down": 508, "Y_Ref_Up": 470 },
  { "Weight": 5800, "Section": 4, "Y_Ref_Down": 470, "Y_Ref_Up": 432 },
  { "Weight": 5800, "Section": 5, "Y_Ref_Down": 432, "Y_Ref_Up": 399 },
  { "Weight": 5800, "Section": 6, "Y_Ref_Down": 399, "Y_Ref_Up": 360 },
  { "Weight": 5800, "Section": 7, "Y_Ref_Down": 360, "Y_Ref_Up": 320 },

  { "Weight": 5900, "Section": 1, "Y_Ref_Down": 573, "Y_Ref_Up": 532 },
  { "Weight": 5900, "Section": 2, "Y_Ref_Down": 532, "Y_Ref_Up": 496 },
  { "Weight": 5900, "Section": 3, "Y_Ref_Down": 496, "Y_Ref_Up": 454 },
  { "Weight": 5900, "Section": 4, "Y_Ref_Down": 454, "Y_Ref_Up": 413 },
  { "Weight": 5900, "Section": 5, "Y_Ref_Down": 413, "Y_Ref_Up": 375 },
  { "Weight": 5900, "Section": 6, "Y_Ref_Down": 375, "Y_Ref_Up": 334 },
  { "Weight": 5900, "Section": 7, "Y_Ref_Down": 334, "Y_Ref_Up": 294 },

  { "Weight": 6000, "Section": 1, "Y_Ref_Down": 566, "Y_Ref_Up": 523 },
  { "Weight": 6000, "Section": 2, "Y_Ref_Down": 523, "Y_Ref_Up": 482 },
  { "Weight": 6000, "Section": 3, "Y_Ref_Down": 482, "Y_Ref_Up": 439 },
  { "Weight": 6000, "Section": 4, "Y_Ref_Down": 439, "Y_Ref_Up": 396 },
  { "Weight": 6000, "Section": 5, "Y_Ref_Down": 396, "Y_Ref_Up": 354 },
  { "Weight": 6000, "Section": 6, "Y_Ref_Down": 354, "Y_Ref_Up": 310 },
  { "Weight": 6000, "Section": 7, "Y_Ref_Down": 310, "Y_Ref_Up": 268 },

  { "Weight": 6100, "Section": 1, "Y_Ref_Down": 559, "Y_Ref_Up": 514 },
  { "Weight": 6100, "Section": 2, "Y_Ref_Down": 514, "Y_Ref_Up": 470 },
  { "Weight": 6100, "Section": 3, "Y_Ref_Down": 470, "Y_Ref_Up": 423 },
  { "Weight": 6100, "Section": 4, "Y_Ref_Down": 423, "Y_Ref_Up": 377 },
  { "Weight": 6100, "Section": 5, "Y_Ref_Down": 377, "Y_Ref_Up": 332 },
  { "Weight": 6100, "Section": 6, "Y_Ref_Down": 332, "Y_Ref_Up": 287 },

  { "Weight": 6200, "Section": 1, "Y_Ref_Down": 551, "Y_Ref_Up": 504 },
  { "Weight": 6200, "Section": 2, "Y_Ref_Down": 504, "Y_Ref_Up": 458 },
  { "Weight": 6200, "Section": 3, "Y_Ref_Down": 458, "Y_Ref_Up": 406 },
  { "Weight": 6200, "Section": 4, "Y_Ref_Down": 406, "Y_Ref_Up": 360 },
  { "Weight": 6200, "Section": 5, "Y_Ref_Down": 360, "Y_Ref_Up": 311 },

  { "Weight": 6300, "Section": 1, "Y_Ref_Down": 544, "Y_Ref_Up": 494 },
  { "Weight": 6300, "Section": 2, "Y_Ref_Down": 494, "Y_Ref_Up": 446 },
  { "Weight": 6300, "Section": 3, "Y_Ref_Down": 446, "Y_Ref_Up": 391 },
  { "Weight": 6300, "Section": 4, "Y_Ref_Down": 391, "Y_Ref_Up": 334 },
  { "Weight": 6300, "Section": 5, "Y_Ref_Down": 334, "Y_Ref_Up": 286 },

  { "Weight": 6400, "Section": 1, "Y_Ref_Down": 537, "Y_Ref_Up": 483 },
  { "Weight": 6400, "Section": 2, "Y_Ref_Down": 483, "Y_Ref_Up": 434 },
  { "Weight": 6400, "Section": 3, "Y_Ref_Down": 434, "Y_Ref_Up": 372 },
  { "Weight": 6400, "Section": 4, "Y_Ref_Down": 372, "Y_Ref_Up": 311 },

  { "Weight": 6500, "Section": 1, "Y_Ref_Down": 528, "Y_Ref_Up": 473 },
  { "Weight": 6500, "Section": 2, "Y_Ref_Down": 473, "Y_Ref_Up": 422 },
  { "Weight": 6500, "Section": 3, "Y_Ref_Down": 422, "Y_Ref_Up": 353 }
];

const windData = [
  { "Wind": 0, "Y_Ref_Down": 652, "Y_Ref_Up": 611 },
  { "Wind": 0, "Y_Ref_Down": 611, "Y_Ref_Up": 566 },
  { "Wind": 0, "Y_Ref_Down": 566, "Y_Ref_Up": 523 },
  { "Wind": 0, "Y_Ref_Down": 523, "Y_Ref_Up": 480 },
  { "Wind": 0, "Y_Ref_Down": 480, "Y_Ref_Up": 439 },
  { "Wind": 0, "Y_Ref_Down": 439, "Y_Ref_Up": 396 },
  { "Wind": 0, "Y_Ref_Down": 396, "Y_Ref_Up": 353 },
  { "Wind": 0, "Y_Ref_Down": 353, "Y_Ref_Up": 310 },
  { "Wind": 0, "Y_Ref_Down": 310, "Y_Ref_Up": 267 },
  { "Wind": 0, "Y_Ref_Down": 267, "Y_Ref_Up": 53 },

  { "Wind": 10, "Y_Ref_Down": 652, "Y_Ref_Up": 621 },
  { "Wind": 10, "Y_Ref_Down": 621, "Y_Ref_Up": 580 },
  { "Wind": 10, "Y_Ref_Down": 580, "Y_Ref_Up": 540 },
  { "Wind": 10, "Y_Ref_Down": 540, "Y_Ref_Up": 499 },
  { "Wind": 10, "Y_Ref_Down": 499, "Y_Ref_Up": 459 },
  { "Wind": 10, "Y_Ref_Down": 459, "Y_Ref_Up": 422 },
  { "Wind": 10, "Y_Ref_Down": 422, "Y_Ref_Up": 380 },
  { "Wind": 10, "Y_Ref_Down": 380, "Y_Ref_Up": 341 },
  { "Wind": 10, "Y_Ref_Down": 341, "Y_Ref_Up": 301 },
  { "Wind": 10, "Y_Ref_Down": 301, "Y_Ref_Up": 53 },

  { "Wind": 20, "Y_Ref_Down": 652, "Y_Ref_Up": 631 },
  { "Wind": 20, "Y_Ref_Down": 631, "Y_Ref_Up": 595 },
  { "Wind": 20, "Y_Ref_Down": 595, "Y_Ref_Up": 557 },
  { "Wind": 20, "Y_Ref_Down": 557, "Y_Ref_Up": 521 },
  { "Wind": 20, "Y_Ref_Down": 521, "Y_Ref_Up": 482 },
  { "Wind": 20, "Y_Ref_Down": 482, "Y_Ref_Up": 447 },
  { "Wind": 20, "Y_Ref_Down": 447, "Y_Ref_Up": 409 },
  { "Wind": 20, "Y_Ref_Down": 409, "Y_Ref_Up": 373 },
  { "Wind": 20, "Y_Ref_Down": 373, "Y_Ref_Up": 334 },
  { "Wind": 20, "Y_Ref_Down": 334, "Y_Ref_Up": 53 },

  { "Wind": 30, "Y_Ref_Down": 652, "Y_Ref_Up": 643 },
  { "Wind": 30, "Y_Ref_Down": 643, "Y_Ref_Up": 613 },
  { "Wind": 30, "Y_Ref_Down": 613, "Y_Ref_Up": 575 },
  { "Wind": 30, "Y_Ref_Down": 575, "Y_Ref_Up": 540 },
  { "Wind": 30, "Y_Ref_Down": 540, "Y_Ref_Up": 504 },
  { "Wind": 30, "Y_Ref_Down": 504, "Y_Ref_Up": 471 },
  { "Wind": 30, "Y_Ref_Down": 471, "Y_Ref_Up": 439 },
  { "Wind": 30, "Y_Ref_Down": 439, "Y_Ref_Up": 403 },
  { "Wind": 30, "Y_Ref_Down": 403, "Y_Ref_Up": 365 },
  { "Wind": 30, "Y_Ref_Down": 365, "Y_Ref_Up": 55 },

  { "Wind": 40, "Y_Ref_Down": 652, "Y_Ref_Up": 625 },
  { "Wind": 40, "Y_Ref_Down": 625, "Y_Ref_Up": 592 },
  { "Wind": 40, "Y_Ref_Down": 592, "Y_Ref_Up": 559 },
  { "Wind": 40, "Y_Ref_Down": 559, "Y_Ref_Up": 526 },
  { "Wind": 40, "Y_Ref_Down": 526, "Y_Ref_Up": 497 },
  { "Wind": 40, "Y_Ref_Down": 497, "Y_Ref_Up": 465 },
  { "Wind": 40, "Y_Ref_Down": 465, "Y_Ref_Up": 434 },
  { "Wind": 40, "Y_Ref_Down": 434, "Y_Ref_Up": 397 },
  { "Wind": 40, "Y_Ref_Down": 397, "Y_Ref_Up": 55 },

  { "Wind": 50, "Y_Ref_Down": 652, "Y_Ref_Up": 640 },
  { "Wind": 50, "Y_Ref_Down": 640, "Y_Ref_Up": 609 },
  { "Wind": 50, "Y_Ref_Down": 609, "Y_Ref_Up": 578 },
  { "Wind": 50, "Y_Ref_Down": 578, "Y_Ref_Up": 549 },
  { "Wind": 50, "Y_Ref_Down": 549, "Y_Ref_Up": 523 },
  { "Wind": 50, "Y_Ref_Down": 523, "Y_Ref_Up": 494 },
  { "Wind": 50, "Y_Ref_Down": 494, "Y_Ref_Up": 463 },
  { "Wind": 50, "Y_Ref_Down": 463, "Y_Ref_Up": 430 },
  { "Wind": 50, "Y_Ref_Down": 430, "Y_Ref_Up": 55 },

  { "Wind": -10, "Y_Ref_Down": 652, "Y_Ref_Up": 564 },
  { "Wind": -10, "Y_Ref_Down": 564, "Y_Ref_Up": 511 },
  { "Wind": -10, "Y_Ref_Down": 511, "Y_Ref_Up": 459 },
  { "Wind": -10, "Y_Ref_Down": 459, "Y_Ref_Up": 409 },
  { "Wind": -10, "Y_Ref_Down": 409, "Y_Ref_Up": 358 },
  { "Wind": -10, "Y_Ref_Down": 358, "Y_Ref_Up": 308 },
  { "Wind": -10, "Y_Ref_Down": 308, "Y_Ref_Up": 255 },
  { "Wind": -10, "Y_Ref_Down": 255, "Y_Ref_Up": 210 },
  { "Wind": -10, "Y_Ref_Down": 210, "Y_Ref_Up": 158 },
  { "Wind": -10, "Y_Ref_Down": 158, "Y_Ref_Up": 55 },

  { "Wind": -20, "Y_Ref_Down": 652, "Y_Ref_Up": 516 },
  { "Wind": -20, "Y_Ref_Down": 516, "Y_Ref_Up": 456 },
  { "Wind": -20, "Y_Ref_Down": 456, "Y_Ref_Up": 396 },
  { "Wind": -20, "Y_Ref_Down": 396, "Y_Ref_Up": 327 },
  { "Wind": -20, "Y_Ref_Down": 327, "Y_Ref_Up": 275 },
  { "Wind": -20, "Y_Ref_Down": 275, "Y_Ref_Up": 213 },
  { "Wind": -20, "Y_Ref_Down": 213, "Y_Ref_Up": 158 },
  { "Wind": -20, "Y_Ref_Down": 158, "Y_Ref_Up": 105 },
  { "Wind": -20, "Y_Ref_Down": 105, "Y_Ref_Up": 55 }
];

const runwaySlopeData = [
  { "Slope": 0, "Section": 1, "Y_Ref_Down": 652, "Y_Ref_Up": 568 },
  { "Slope": 0, "Section": 2, "Y_Ref_Down": 568, "Y_Ref_Up": 525 },
  { "Slope": 0, "Section": 3, "Y_Ref_Down": 525, "Y_Ref_Up": 482 },
  { "Slope": 0, "Section": 4, "Y_Ref_Down": 482, "Y_Ref_Up": 439 },
  { "Slope": 0, "Section": 5, "Y_Ref_Down": 439, "Y_Ref_Up": 396 },
  { "Slope": 0, "Section": 6, "Y_Ref_Down": 396, "Y_Ref_Up": 353 },
  { "Slope": 0, "Section": 7, "Y_Ref_Down": 353, "Y_Ref_Up": 310 },
  { "Slope": 0, "Section": 8, "Y_Ref_Down": 310, "Y_Ref_Up": 267 },
  { "Slope": 0, "Section": 9, "Y_Ref_Down": 267, "Y_Ref_Up": 53 },

  { "Slope": -1, "Section": 1, "Y_Ref_Down": 652, "Y_Ref_Up": 570 },
  { "Slope": -1, "Section": 2, "Y_Ref_Down": 570, "Y_Ref_Up": 525 },
  { "Slope": -1, "Section": 3, "Y_Ref_Down": 525, "Y_Ref_Up": 487 },
  { "Slope": -1, "Section": 4, "Y_Ref_Down": 487, "Y_Ref_Up": 444 },
  { "Slope": -1, "Section": 5, "Y_Ref_Down": 444, "Y_Ref_Up": 401 },
  { "Slope": -1, "Section": 6, "Y_Ref_Down": 401, "Y_Ref_Up": 360 },
  { "Slope": -1, "Section": 7, "Y_Ref_Down": 360, "Y_Ref_Up": 318 },
  { "Slope": -1, "Section": 8, "Y_Ref_Down": 318, "Y_Ref_Up": 275 },
  { "Slope": -1, "Section": 9, "Y_Ref_Down": 275, "Y_Ref_Up": 55 },

  { "Slope": -2, "Section": 1, "Y_Ref_Down": 652, "Y_Ref_Up": 573 },
  { "Slope": -2, "Section": 2, "Y_Ref_Down": 573, "Y_Ref_Up": 530 },
  { "Slope": -2, "Section": 3, "Y_Ref_Down": 530, "Y_Ref_Up": 490 },
  { "Slope": -2, "Section": 4, "Y_Ref_Down": 490, "Y_Ref_Up": 449 },
  { "Slope": -2, "Section": 5, "Y_Ref_Down": 449, "Y_Ref_Up": 406 },
  { "Slope": -2, "Section": 6, "Y_Ref_Down": 406, "Y_Ref_Up": 365 },
  { "Slope": -2, "Section": 7, "Y_Ref_Down": 365, "Y_Ref_Up": 327 },
  { "Slope": -2, "Section": 8, "Y_Ref_Down": 327, "Y_Ref_Up": 286 },
  { "Slope": -2, "Section": 9, "Y_Ref_Down": 286, "Y_Ref_Up": 55 },

  { "Slope": 1, "Section": 1, "Y_Ref_Down": 652, "Y_Ref_Up": 561 },
  { "Slope": 1, "Section": 2, "Y_Ref_Down": 561, "Y_Ref_Up": 518 },
  { "Slope": 1, "Section": 3, "Y_Ref_Down": 518, "Y_Ref_Up": 473 },
  { "Slope": 1, "Section": 4, "Y_Ref_Down": 473, "Y_Ref_Up": 428 },
  { "Slope": 1, "Section": 5, "Y_Ref_Down": 428, "Y_Ref_Up": 384 },
  { "Slope": 1, "Section": 6, "Y_Ref_Down": 384, "Y_Ref_Up": 336 },
  { "Slope": 1, "Section": 7, "Y_Ref_Down": 336, "Y_Ref_Up": 291 },
  { "Slope": 1, "Section": 8, "Y_Ref_Down": 291, "Y_Ref_Up": 243 },
  { "Slope": 1, "Section": 9, "Y_Ref_Down": 243, "Y_Ref_Up": 53 },

  { "Slope": 2, "Section": 1, "Y_Ref_Down": 650, "Y_Ref_Up": 557 },
  { "Slope": 2, "Section": 2, "Y_Ref_Down": 557, "Y_Ref_Up": 511 },
  { "Slope": 2, "Section": 3, "Y_Ref_Down": 511, "Y_Ref_Up": 465 },
  { "Slope": 2, "Section": 4, "Y_Ref_Down": 465, "Y_Ref_Up": 418 },
  { "Slope": 2, "Section": 5, "Y_Ref_Down": 418, "Y_Ref_Up": 372 },
  { "Slope": 2, "Section": 6, "Y_Ref_Down": 372, "Y_Ref_Up": 318 },
  { "Slope": 2, "Section": 7, "Y_Ref_Down": 318, "Y_Ref_Up": 268 },
  { "Slope": 2, "Section": 8, "Y_Ref_Down": 268, "Y_Ref_Up": 217 },
  { "Slope": 2, "Section": 9, "Y_Ref_Down": 217, "Y_Ref_Up": 53 }
];
// OS RESULT ESTÁ COMO "TORA_m" MAS NA REALIDADE É "TODA_m" É SÓ PARA NÃO FAZER GRANDES ALTERAÇÕES AO CODIGO
const resultData = [
  { "TORA_m": 400, "Y_Ref": 625 },
  { "TORA_m": 500, "Y_Ref": 597 },
  { "TORA_m": 600, "Y_Ref": 569 },
  { "TORA_m": 700, "Y_Ref": 541 },
  { "TORA_m": 800, "Y_Ref": 512 },
  { "TORA_m": 900, "Y_Ref": 484 },
  { "TORA_m": 1000, "Y_Ref": 457 },
  { "TORA_m": 1100, "Y_Ref": 428 },
  { "TORA_m": 1200, "Y_Ref": 400 },
  { "TORA_m": 1300, "Y_Ref": 373 },
  { "TORA_m": 1400, "Y_Ref": 347 },
  { "TORA_m": 1500, "Y_Ref": 317 },
  { "TORA_m": 1600, "Y_Ref": 290 },
  { "TORA_m": 1700, "Y_Ref": 259 },
  { "TORA_m": 1800, "Y_Ref": 233 },
  { "TORA_m": 1900, "Y_Ref": 204 },
  { "TORA_m": 2000, "Y_Ref": 176 },
  { "TORA_m": 2100, "Y_Ref": 149 },
  { "TORA_m": 2200, "Y_Ref": 120 },
  { "TORA_m": 2300, "Y_Ref": 92 }
];

// ============================
// ENGINE 
// ============================
const ENGINE = {
  // ---------- helpers ----------
  _lerp(a, b, t) { // Interpolação linear
    return a + (b - a) * t; // Fórmula lerp
  },

  _clamp01(t) { // Clamp para [0..1]
    return t < 0 ? 0 : (t > 1 ? 1 : t); // Garantir limites
  },

  _uniqueSorted(arr) { // Unique + sort numérico
    return Array.from(new Set(arr)).sort((a, b) => a - b); // Set + sort
  },

  _bracket(sortedVals, x) { // Encontrar bracket [lo,hi] para x (com clamp e snap exacto)
  const n = sortedVals.length; // Tamanho
  if (n === 0) throw new Error("Bracket: empty array"); // Segurança

  // 1) SNAP: se x for exactamente um valor do eixo, devolve lo=hi=x
  // Isto evita que, por exemplo, x=10 devolva [0,10] em vez de [10,10]
  for (let i = 0; i < n; i++) { // Percorrer valores
    if (sortedVals[i] === x) { // Match exacto
      return { lo: x, hi: x, t: 0, exact: true }; // Bracket exacto
    } // Fechar if
  } // Fechar for

  // 2) Clamp nos extremos
  if (x <= sortedVals[0]) return { lo: sortedVals[0], hi: sortedVals[0], t: 0, clamped: "low" }; // Clamp baixo
  if (x >= sortedVals[n - 1]) return { lo: sortedVals[n - 1], hi: sortedVals[n - 1], t: 0, clamped: "high" }; // Clamp alto

  // 3) Intervalo normal
  for (let i = 0; i < n - 1; i++) { // Percorrer intervalos
    const lo = sortedVals[i]; // Limite inferior
    const hi = sortedVals[i + 1]; // Limite superior
    if (x > lo && x < hi) { // Estritamente dentro (já tratámos iguais acima)
      const t = (hi === lo) ? 0 : (x - lo) / (hi - lo); // Normalizar
      return { lo, hi, t }; // Return
    } // Fechar if
  } // Fechar for

  // Fallback (não devia acontecer)
  return { lo: sortedVals[n - 1], hi: sortedVals[n - 1], t: 0 }; // Fallback
},

  _findByKeys(data, matchObj) { // Procurar linha por chaves exactas
    return data.find(row => Object.keys(matchObj).every(k => row[k] === matchObj[k])) || null; // First match
  },

  _interp1D(x, x0, x1, y0, y1) { // Interpolação 1D robusta
    if (x1 === x0) return y0; // Evitar divisão por zero
    const t = (x - x0) / (x1 - x0); // Calcular t
    return this._lerp(y0, y1, t); // Lerpar
  },

  _ensureDownUp(down, up, ctx) { // Validar down > up
    if (!(down > up)) throw new Error(`${ctx}: secção inválida (esperado down > up). down=${down}, up=${up}`); // Erro
  },

  _inSectionTopStitch(y, down, up) { // Regra top-stitch (top incluído? aqui: down EXCLUSIVO, up INCLUSIVO)
    return (y < down && y >= up); // Dentro da secção
  },

  _resolveNearestSectionByY(y, sections, downKey, upKey, idKey, ctx) { // Resolver secção+desvio por y
    if (!Array.isArray(sections) || sections.length === 0) throw new Error(`${ctx}: empty sections`); // Segurança

    for (const s of sections) { // Tentar encontrar secção directa
      const down = s[downKey], up = s[upKey]; // Limites
      this._ensureDownUp(down, up, ctx); // Validar

      if (this._inSectionTopStitch(y, down, up)) { // Dentro
        const deviation = (down === up) ? 0 : (y - down) / (up - down); // Desvio normalizado
        return { // Return posição
          mode: "SECTION", // Encontrou secção
          sectionId: s[idKey], // Id
          deviation: this._clamp01(deviation), // Clamp
          yUsed: y, // y usado
          debug: { down, up, rawDeviation: deviation } // Debug
        };
      }
    }

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
    }

    const deviation = (best.down === best.up) ? 0 : (best.yClamp - best.down) / (best.up - best.down); // Desvio

    return { // Return nearest
      mode: "GAP_NEAREST", // Caiu em gap
      sectionId: best.s[idKey], // Secção escolhida
      deviation: this._clamp01(deviation), // Clamp
      yUsed: best.yClamp, // y usado
      debug: { chosenDown: best.down, chosenUp: best.up, yOriginal: y, yClamped: best.yClamp, dist: best.dist, rawDeviation: deviation } // Debug
    };
  },

  _resolveNearestIndexByY(y, sections, downKey, upKey, ctx) { // Resolver índice+desvio por y (para wind)
    if (!Array.isArray(sections) || sections.length === 0) throw new Error(`${ctx}: empty sections`); // Segurança

    for (let i = 0; i < sections.length; i++) { // Percorrer secções
      const s = sections[i]; // Secção
      const down = s[downKey], up = s[upKey]; // Limites
      this._ensureDownUp(down, up, ctx); // Validar

      if (this._inSectionTopStitch(y, down, up)) { // Dentro
        const deviation = (down === up) ? 0 : (y - down) / (up - down); // Desvio
        return { mode: "SECTION", index: i, deviation: this._clamp01(deviation), yUsed: y, debug: { down, up, rawDeviation: deviation } }; // Return
      }
    }

    let best = null; // Melhor nearest
    for (let i = 0; i < sections.length; i++) { // Procurar nearest
      const s = sections[i]; // Secção
      const down = s[downKey], up = s[upKey]; // Limites
      this._ensureDownUp(down, up, ctx); // Validar

      let yClamp; // Clamp
      if (y >= down) yClamp = down; // Clamp down
      else if (y <= up) yClamp = up; // Clamp up
      else yClamp = y; // Igual

      const dist = Math.abs(y - yClamp); // Distância
      if (!best || dist < best.dist) best = { i, down, up, yClamp, dist }; // Melhor
      else if (dist === best.dist && down > best.down) best = { i, down, up, yClamp, dist }; // Desempate
    }

    const deviation = (best.down === best.up) ? 0 : (best.yClamp - best.down) / (best.up - best.down); // Desvio

    return { // Return
      mode: "GAP_NEAREST", // Gap
      index: best.i, // Índice escolhido
      deviation: this._clamp01(deviation), // Clamp
      yUsed: best.yClamp, // y usado
      debug: { chosenDown: best.down, chosenUp: best.up, yOriginal: y, yClamped: best.yClamp, dist: best.dist, rawDeviation: deviation } // Debug
    };
  },

  _rangeOf(data, key) { // Range min/max de uma coluna
    const vals = data.map(r => r[key]).filter(v => typeof v === "number" && Number.isFinite(v)); // Filtrar numéricos
    return { min: Math.min(...vals), max: Math.max(...vals) }; // Devolver min/max
  },

  _fail(statusObj, where, errorMessage, partialDebug = {}) { // Resposta de falha padrão
    return { // Estrutura padrão de falha
      input: statusObj.input, // Input normalizado
      status: "failed", // Estado
      result: 0, // Resultado 0
      debug: { failedAtStep: where, error: errorMessage, ...partialDebug } // Debug
    };
  },

  _enforceTodLimitByDecrement(weight, { PA, OAT, wind, slope, TORA }) { // Garante que TOD calculada não excede a TODA disponível
    let safeWeight = Math.ceil(weight); // Trabalhar com peso inteiro
    let iter = 0; // Proteção contra loops infinitos
    const MAX_ITER = 3000; // Limite de iterações suficiente para todo o envelope

    while (safeWeight > 0 && iter < MAX_ITER) { // Desce peso até cumprir TOD<=TODA
      const todr = TODR_Flaps1({ PA, OAT, Weight: safeWeight, Wind: wind, slope }); // Recalcular TOD para o peso candidato
      if (todr?.status === "passed" && Number.isFinite(todr?.result) && Math.round(todr.result) <= TORA) { // Encontrou peso válido
        return { safeWeight, debug: { mode: "TOD_CHECK_DECREMENT", iterations: iter, todAtSafeWeight: todr.result } }; // Return
      }
      safeWeight -= 1; // Reduz 1 kg para tornar o resultado conservador
      iter += 1; // Incrementar contador
    }

    return { // Fallback conservador em caso de erro no cálculo forward
      safeWeight: 0, // Se não validar, falha de forma segura
      debug: { mode: "TOD_CHECK_FALLBACK", iterations: iter, reason: "não foi possível validar TODR dentro do limite de iterações" } // Debug
    };
  },

  _detectToraKey() { // Detectar o nome da coluna de TORA no resultData
    const sample = Array.isArray(resultData) ? resultData[0] : null; // Obter primeira linha
    if (!sample || typeof sample !== "object") throw new Error("Step1: resultData vazio ou inválido"); // Validar
    if ("TORA_m" in sample) return "TORA_m"; // Preferência
    if ("TORA" in sample) return "TORA"; // Alternativa
    throw new Error('Step1: resultData precisa de "TORA_m" ou "TORA" + "Y_Ref"'); // Erro
  },

  // ----------------------------------------------------
  // step1: TORA -> y (resultData)
  // ----------------------------------------------------
  getYFromTORA(TORA) { // Converter TORA para Y por interpolação em resultData
    const toraKey = this._detectToraKey(); // Descobrir coluna de TORA
    const toras = this._uniqueSorted(resultData.map(r => r[toraKey])); // Eixo TORA
    const tB = this._bracket(toras, TORA); // Bracket TORA

    const rowLo = resultData.find(r => r[toraKey] === tB.lo) || null; // Linha lo
    const rowHi = resultData.find(r => r[toraKey] === tB.hi) || null; // Linha hi
    if (!rowLo || !rowHi) throw new Error(`Step1: faltam linhas ${toraKey}=[${tB.lo},${tB.hi}]`); // Validar

    const y = this._interp1D(TORA, tB.lo, tB.hi, rowLo.Y_Ref, rowHi.Y_Ref); // Interpolar Y
    return { y, debug: { toraKey, toraBracket: tB, rowLo, rowHi } }; // Return
  },

  // ----------------------------------------------------
  // step2: y (com slope) -> y equivalente à base Slope=0
  // - slope=0: identidade (evita drift por fronteiras)
  // - slope intermédio: interpola slope lo/hi e mapeia para base (slope=0)
  // ----------------------------------------------------
  getYBeforeSlope(slope, y_afterSlope) { // Remover efeito do slope para equivalente Slope=0
    if (slope === 0) { // Caso especial: slope 0 deve ser identidade
      return { y_beforeSlope: y_afterSlope, debug: { slope, mode: "IDENTITY_SLOPE_0", yUsed: y_afterSlope } }; // Return directo
    }

    const slopes = this._uniqueSorted(runwaySlopeData.map(r => r.Slope)); // Eixo slope
    const sB = this._bracket(slopes, slope); // Bracket slope input

    const rowsAtSlope = (sVal) => runwaySlopeData // Helper
      .filter(r => r.Slope === sVal) // Filtrar slope
      .sort((a, b) => a.Section - b.Section); // Ordenar por secção

    const baseRows = rowsAtSlope(0); // Base Slope=0
    if (baseRows.length === 0) throw new Error("Step2: sem linhas Slope=0 (base)"); // Validar

    const rowsLo = rowsAtSlope(sB.lo); // Tabela slope lo
    const rowsHi = rowsAtSlope(sB.hi); // Tabela slope hi
    if (rowsLo.length === 0 || rowsHi.length === 0) throw new Error(`Step2: faltam linhas Slope ${sB.lo}/${sB.hi}`); // Validar

    const pos = this._resolveNearestSectionByY( // Resolver secção+desvio no slope lo
      y_afterSlope, // y actual
      rowsLo, // Tabela slope lo
      "Y_Ref_Down", // Chave down
      "Y_Ref_Up", // Chave up
      "Section", // Id secção
      "Step2(rowsLo)" // Contexto
    );

    const sectionNum = pos.sectionId; // Secção encontrada
    const deviation = pos.deviation; // Desvio encontrado (do slope lo)

    const loRow = rowsLo.find(r => r.Section === sectionNum) || null; // Linha slope lo da secção
    const hiRow = rowsHi.find(r => r.Section === sectionNum) || null; // Linha slope hi da secção
    const baseRow = baseRows.find(r => r.Section === sectionNum) || null; // Linha base da secção
    if (!loRow || !hiRow || !baseRow) throw new Error(`Step2: secção ${sectionNum} não encontrada em slope lo/hi/base`); // Validar

    const y_on_lo = this._lerp(loRow.Y_Ref_Down, loRow.Y_Ref_Up, deviation); // Reconstituir y na tabela lo
    const y_on_hi = this._lerp(hiRow.Y_Ref_Down, hiRow.Y_Ref_Up, deviation); // y correspondente na tabela hi
    const y_on_slope = this._lerp(y_on_lo, y_on_hi, sB.t); // Interpolar y para slope real

    // Agora mapear esse y_on_slope para a base (Slope=0) mantendo a mesma secção+desvio.
    // Usamos o mesmo deviation na base, porque o método gráfico mantém a posição relativa na secção.
    const y_beforeSlope = this._lerp(baseRow.Y_Ref_Down, baseRow.Y_Ref_Up, deviation); // y equivalente em Slope=0

    return { // Return
      y_beforeSlope, // Resultado para slope=0
      debug: { slope, slopeBracket: sB, mode: pos.mode, sectionNum, deviation, yUsed: pos.yUsed, y_on_lo, y_on_hi, y_on_slope } // Debug
    };
  },

  // ----------------------------------------------------
  // step3: 
  // ----------------------------------------------------
getYBeforeWind(wind, y_afterWind) { // Remover efeito do vento para equivalente Wind=0
  if (wind === 0) { // Caso especial: wind 0 deve ser identidade
    return { // Devolver já o valor de entrada
      y_beforeWind: y_afterWind, // Não altera o y
      debug: { wind, mode: "IDENTITY_WIND_0", yUsed: y_afterWind } // Debug explícito
    }; // Fechar return
  } // Fechar if

  const winds = this._uniqueSorted(windData.map(r => r.Wind)); // Eixo vento existente no dataset
  const wB = this._bracket(winds, wind); // Encontrar bracket do vento pedido (lo/hi/t)

  const rowsAtWind = (wVal) => windData // Helper para obter as linhas de um vento
    .filter(r => r.Wind === wVal) // Filtrar pelo vento
    .slice() // Copiar array para não mutar o original
    .sort((a, b) => b.Y_Ref_Down - a.Y_Ref_Down); // Ordenar por Y_Ref_Down desc para alinhar secções entre ventos

  const wind0Rows = rowsAtWind(0); // Referência Wind=0 (ordenada)
  if (wind0Rows.length === 0) throw new Error("Step3: sem linhas Wind=0"); // Validar existência

  const rowsLo = rowsAtWind(wB.lo); // Tabela do vento lo (ordenada)
  const rowsHi = rowsAtWind(wB.hi); // Tabela do vento hi (ordenada)
  if (rowsLo.length === 0 || rowsHi.length === 0) throw new Error(`Step3: faltam linhas Wind ${wB.lo}/${wB.hi}`); // Validar

  const pos = this._resolveNearestIndexByY( // Resolver índice+desvio na tabela rowsLo
    y_afterWind, // y actual (com vento)
    rowsLo, // Tabela do vento lo (ordenada)
    "Y_Ref_Down", // Chave down
    "Y_Ref_Up", // Chave up
    "Step3(rowsLo)" // Contexto de erro/debug
  ); // Executar resolução

  const sectionIndex = pos.index; // Índice da secção na tabela ordenada
  const deviation = pos.deviation; // Desvio normalizado dentro da secção

  if (sectionIndex >= wind0Rows.length) throw new Error("Step3: sectionIndex fora de range (wind0Rows)"); // Validar índice
  if (sectionIndex >= rowsHi.length) throw new Error("Step3: sectionIndex fora de range (rowsHi)"); // Validar índice

  // (Opcional) reconstruir o y no vento lo/hi para debug (não é usado no cálculo final do Wind=0)
  const y_on_lo = this._lerp( // Reconstruir y na tabela lo
    rowsLo[sectionIndex].Y_Ref_Down, // Limite down lo
    rowsLo[sectionIndex].Y_Ref_Up, // Limite up lo
    deviation // Desvio
  ); // Fechar lerp

  const y_on_hi = this._lerp( // Reconstruir y na tabela hi
    rowsHi[sectionIndex].Y_Ref_Down, // Limite down hi
    rowsHi[sectionIndex].Y_Ref_Up, // Limite up hi
    deviation // Desvio
  ); // Fechar lerp

  const y_on_wind = this._lerp( // Interpolar y entre lo/hi para o vento real (debug)
    y_on_lo, // y no lo
    y_on_hi, // y no hi
    wB.t // t do bracket do vento
  ); // Fechar lerp

  // Converter para Wind=0 usando o MESMO sectionIndex + deviation (agora alinhado pela ordenação)
  const y_beforeWind = this._lerp( // Aplicar o mesmo desvio em Wind=0
    wind0Rows[sectionIndex].Y_Ref_Down, // Down em Wind=0
    wind0Rows[sectionIndex].Y_Ref_Up, // Up em Wind=0
    deviation // Mesmo desvio
  ); // Fechar lerp

  return { // Devolver resultado + debug
    y_beforeWind, // Y equivalente em Wind=0
    debug: { // Debug detalhado
      wind, // Vento pedido
      windBracket: wB, // Bracket lo/hi/t
      sectionIndex, // Índice usado
      deviation, // Desvio usado
      mode: pos.mode, // SECTION/GAP_NEAREST
      yUsed: pos.yUsed, // y usado (pode ser clampado)
      y_on_lo, // Debug: y reconstruído no lo
      y_on_hi, // Debug: y reconstruído no hi
      y_on_wind // Debug: y interpolado no vento real
    } // Fechar debug
  }; // Fechar return
}, // <-- IMPORTANTE: vírgula para separar do próximo método no objecto ENGINE

  // ----------------------------------------------------
  // step4: PA/OAT -> y_ref1 (bilinear)
  // ----------------------------------------------------
  getYRef1({ PA, OAT }) { // Bilinear em pressureAltTemperatureData
    const PAs = this._uniqueSorted(pressureAltTemperatureData.map(r => r.Pressure_Altitude)); // Eixo PA
    const temps = this._uniqueSorted(pressureAltTemperatureData.map(r => r.Temperature)); // Eixo temp

    const paB = this._bracket(PAs, PA); // Bracket PA
    const tB = this._bracket(temps, OAT); // Bracket temp

    const p_lo_t_lo = this._findByKeys(pressureAltTemperatureData, { Pressure_Altitude: paB.lo, Temperature: tB.lo }); // Canto (pa lo, t lo)
    const p_lo_t_hi = this._findByKeys(pressureAltTemperatureData, { Pressure_Altitude: paB.lo, Temperature: tB.hi }); // Canto (pa lo, t hi)
    const p_hi_t_lo = this._findByKeys(pressureAltTemperatureData, { Pressure_Altitude: paB.hi, Temperature: tB.lo }); // Canto (pa hi, t lo)
    const p_hi_t_hi = this._findByKeys(pressureAltTemperatureData, { Pressure_Altitude: paB.hi, Temperature: tB.hi }); // Canto (pa hi, t hi)

    if (!p_lo_t_lo || !p_lo_t_hi || !p_hi_t_lo || !p_hi_t_hi) { // Validar grelha
      throw new Error(`Step4: grelha furada para PA=[${paB.lo},${paB.hi}] Temp=[${tB.lo},${tB.hi}]`); // Erro
    }

    const y_lo = this._interp1D(OAT, tB.lo, tB.hi, p_lo_t_lo.Y_REF1, p_lo_t_hi.Y_REF1); // Interpolar em temp para PA lo
    const y_hi = this._interp1D(OAT, tB.lo, tB.hi, p_hi_t_lo.Y_REF1, p_hi_t_hi.Y_REF1); // Interpolar em temp para PA hi
    const y_ref1 = this._interp1D(PA, paB.lo, paB.hi, y_lo, y_hi); // Interpolar em PA

    return { y_ref1, debug: { paBracket: paB, tempBracket: tB, yAtPaLo: y_lo, yAtPaHi: y_hi } }; // Return
  },

  // ----------------------------------------------------
  // step5: y_ref1 -> section + deviation (refline)
  // ----------------------------------------------------
  getReflineSection(y_ref1) { // Resolver secção+desvio na reflineWeightData
    const r = this._resolveNearestSectionByY( // Resolver
      y_ref1, // y_ref1
      reflineWeightData, // Tabela refline
      "Y_Refline_Section_Down", // Down
      "Y_Refline_Section_Up", // Up
      "sectionNum", // Id secção
      "Step5" // Contexto
    );

    return { sectionNum: r.sectionId, deviation: r.deviation, debug: { mode: r.mode, yUsed: r.yUsed, ...r.debug } }; // Return
  },

  // ----------------------------------------------------
  // step6: usar section + deviation do step5 para resolver Weight que bate no y_target (step3)
  // ----------------------------------------------------
  getExitWeightInSection(sectionNum, deviation, y_target) { // Calcular o peso pelo cruzamento usando o mesmo deviation
    const rows = weightSectionData // Dataset dos pesos
      .filter(r => r.Section === sectionNum) // Só a secção
      .sort((a, b) => a.Weight - b.Weight); // Ordenar por peso

    if (rows.length < 2) throw new Error(`Step6: dados insuficientes para Section=${sectionNum}`); // Validar

    const points = rows.map(r => { // Criar pontos Weight->y_at_weight
      this._ensureDownUp(r.Y_Ref_Down, r.Y_Ref_Up, "Step6"); // Validar
      const y_at_weight = this._lerp(r.Y_Ref_Down, r.Y_Ref_Up, deviation); // Aplicar deviation
      return { Weight: r.Weight, y_at_weight, raw: r }; // Return ponto
    }); // Fechar map

    const yMin = Math.min(...points.map(p => p.y_at_weight)); // menor y da tabela
	const yMax = Math.max(...points.map(p => p.y_at_weight)); // maior y da tabela

	// linha acima da tabela → falha
	if (y_target > yMax) {
	  return {
		status: "failed",
		result: 0,
		debug: { reason: "y_target acima do envelope", sectionNum, deviation, y_target, yMax }
	  };
	}

	// linha abaixo da tabela → peso máximo
	if (y_target < yMin) {
	  const maxWeight = points[points.length - 1].Weight;
	  return {
		weight: maxWeight,
		debug: { mode: "CLAMP_MAX_WEIGHT", sectionNum, deviation, y_target, yMin }
	  };
	}

    const between = (y, y0, y1) => { // Verificar se y está entre y0 e y1 (independente do sentido)
      const lo = Math.min(y0, y1); // Limite inferior
      const hi = Math.max(y0, y1); // Limite superior
      return (y >= lo && y <= hi); // Dentro
    };

    let p0 = null; // Ponto 0
    let p1 = null; // Ponto 1

    for (let i = 0; i < points.length - 1; i++) { // Percorrer pares
      const a = points[i]; // Actual
      const b = points[i + 1]; // Seguinte
      if (between(y_target, a.y_at_weight, b.y_at_weight)) { // Encontrou bracket
        p0 = a; // Guardar
        p1 = b; // Guardar
        break; // Sair
      }
    }

    if (!p0 || !p1) { // Segurança
      return { status: "failed", result: 0, debug: { reason: "não foi possível bracketizar y_target", sectionNum, deviation, y_target } }; // Falha
    }

    const weight = this._interp1D(y_target, p0.y_at_weight, p1.y_at_weight, p0.Weight, p1.Weight); // Inverter por interp1D
    return { weight, debug: { mode: "INTERP_BY_SECTION_DEVIATION", sectionNum, deviation, y_target, bracket: { p0, p1 } } }; // Return
  },

  // ----------------------------------------------------
  // main
  // ----------------------------------------------------
  compute(inputs) { // Motor principal
    const PA = inputs?.PA; // Pressure Altitude
    const OAT = inputs?.OAT; // Outside Air Temp
    const wind = (inputs?.wind ?? inputs?.Wind); // Wind (aceita wind/Wind)
    const slope = (inputs?.slope ?? inputs?.Slope); // Slope (aceita slope/Slope)
    const TORA = (inputs?.TORA ?? inputs?.tora); // TORA (aceita TORA/tora)

    const base = { input: { PA, OAT, Wind: wind, slope, TORA } }; // Base do output


    if (![PA, OAT, wind, slope, TORA].every(v => typeof v === "number" && Number.isFinite(v))) { // Validar tipos
      return this._fail(base, "validation", "Inputs inválidos: esperado números finitos {PA,OAT,Wind/wind,slope,Slope,TORA}."); // Falha
    }

    const paR = this._rangeOf(pressureAltTemperatureData, "Pressure_Altitude"); // Range PA
    const tR = this._rangeOf(pressureAltTemperatureData, "Temperature"); // Range temp
    const wiR = this._rangeOf(windData, "Wind"); // Range wind
    const slopeR = this._rangeOf(runwaySlopeData, "Slope"); // Range slope

    let toraKey; // Nome da coluna de TORA
    try { toraKey = this._detectToraKey(); } catch (e) { return this._fail(base, "validation", e?.message ?? String(e)); } // Detectar
    const toraR = this._rangeOf(resultData, toraKey); // Range TORA

    const outOfRange = (name, v, r) => `${name} fora do range [${r.min}, ${r.max}] (data). Valor=${v}`; // Mensagem

    if (PA < paR.min || PA > paR.max) return this._fail(base, "range", outOfRange("PA", PA, paR)); // Range PA
    if (OAT < tR.min || OAT > tR.max) return this._fail(base, "range", outOfRange("OAT", OAT, tR)); // Range OAT
    if (wind < wiR.min || wind > wiR.max) return this._fail(base, "range", outOfRange("Wind", wind, wiR)); // Range wind
    if (slope < slopeR.min || slope > slopeR.max) return this._fail(base, "range", outOfRange("slope", slope, slopeR)); // Range slope
    if (TORA < toraR.min) return this._fail(base, "range", outOfRange("TORA", TORA, toraR)); // Range TORA (low => fail)
    const TORA_used = (TORA > toraR.max) ? toraR.max : TORA; // TORA (high => clamp)

    const debug = {}; // Debug acumulado
    if (TORA_used !== TORA) { // Registrar clamp de TORA no debug
      debug.toraClamp = { requested: TORA, used: TORA_used, range: { min: toraR.min, max: toraR.max } }; // Info clamp
    } // Fechar if

    try { debug.step1 = this.getYFromTORA(TORA_used); } catch (e) { return this._fail(base, "step1", e?.message ?? String(e), { ...debug }); } // Step1
    try { debug.step2 = this.getYBeforeSlope(slope, debug.step1.y); } catch (e) { return this._fail(base, "step2", e?.message ?? String(e), { ...debug }); } // Step2
    try { debug.step3 = this.getYBeforeWind(wind, debug.step2.y_beforeSlope); } catch (e) { return this._fail(base, "step3", e?.message ?? String(e), { ...debug }); } // Step3
    try { debug.step4 = this.getYRef1({ PA, OAT }); } catch (e) { return this._fail(base, "step4", e?.message ?? String(e), { ...debug }); } // Step4
    try { debug.step5 = this.getReflineSection(debug.step4.y_ref1); } catch (e) { return this._fail(base, "step5", e?.message ?? String(e), { ...debug }); } // Step5

    try { // Step6
      const s6 = this.getExitWeightInSection(debug.step5.sectionNum, debug.step5.deviation, debug.step3.y_beforeWind); // Calcular peso
      debug.step6 = s6; // Guardar debug

      if (s6.status === "failed") return this._fail(base, "step6", "y_target fora do envelope (section+deviation)", { ...debug }); // Falhar se não dá

      const conservative = this._enforceTodLimitByDecrement(s6.weight, { PA, OAT, wind, slope, TORA: TORA_used }); // Garantir consistência com TOD calculada
      debug.step6Conservative = conservative.debug; // Registar ajuste no debug
      return { input: base.input, status: "passed", result: conservative.safeWeight, debug }; // Return final
    } catch (e) {
      return this._fail(base, "step6", e?.message ?? String(e), { ...debug }); // Falha step6
    }
  }
};
