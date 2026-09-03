// toDr.js
// Modalidade que queres manter:
//   import TODR from "./TODR.js";
//   const TODR = TODR({ PA: 4000, OAT: 22, Weight: 6300, Wind: 15, slope: 0 });
//   console.log(TODR.result, TODR.debug);
//
// Regras implementadas:
// - "Costura" (y == up/down): fica na secção de cima (Y maior) -> condição: (y < down && y >= up)
// - "Gap": se y cair num buraco entre secções, escolhe a secção mais perto e faz clamp ao limite mais próximo
// - Interpolações: bilinear (PA/OAT) e linear (Weight e Wind e slope quando necessário)

function TODR(input) {
  return TO_ENGINE.compute(input);
}

export default TODR;
export { TODR };

// ============================
// DATASETS (copiar/colar)
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

const slopeData = [
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

const resultData = [
  { "TOD_m": 400, "Y_Ref": 625 },
  { "TOD_m": 500, "Y_Ref": 597 },
  { "TOD_m": 600, "Y_Ref": 569 },
  { "TOD_m": 700, "Y_Ref": 541 },
  { "TOD_m": 800, "Y_Ref": 512 },
  { "TOD_m": 900, "Y_Ref": 484 },
  { "TOD_m": 1000, "Y_Ref": 457 },
  { "TOD_m": 1100, "Y_Ref": 428 },
  { "TOD_m": 1200, "Y_Ref": 400 },
  { "TOD_m": 1300, "Y_Ref": 373 },
  { "TOD_m": 1400, "Y_Ref": 347 },
  { "TOD_m": 1500, "Y_Ref": 317 },
  { "TOD_m": 1600, "Y_Ref": 290 },
  { "TOD_m": 1700, "Y_Ref": 259 },
  { "TOD_m": 1800, "Y_Ref": 233 },
  { "TOD_m": 1900, "Y_Ref": 204 },
  { "TOD_m": 2000, "Y_Ref": 176 },
  { "TOD_m": 2100, "Y_Ref": 149 },
  { "TOD_m": 2200, "Y_Ref": 120 },
  { "TOD_m": 2300, "Y_Ref": 92 }
];

// ============================
// ENGINE (corrigido)
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

  // ---------- step5: y_refSlope (base Slope=0, aplica desvio e interp slope) ----------
  getYRefSlope({ slope }, y_refWind) {
    const slopes = this._uniqueSorted(slopeData.map(r => r.Slope));
    const sB = this._bracket(slopes, slope);

    const slope0Rows = slopeData.filter(r => r.Slope === 0).sort((a, b) => a.Section - b.Section);
    if (slope0Rows.length === 0) throw new Error("Step5: sem linhas Slope=0");

    const base = this._resolveNearestSectionByY(
      y_refWind,
      slope0Rows,
      "Y_Ref_Down",
      "Y_Ref_Up",
      "Section",
      "Step5"
    );

    const sectionNum = base.sectionId;
    const deviation = base.deviation;

    const rowAt = (sVal) => this._findByKeys(slopeData, { Slope: sVal, Section: sectionNum });
    const rowLo = rowAt(sB.lo);
    const rowHi = rowAt(sB.hi);

    if (!rowLo || !rowHi) throw new Error(`Step5: faltam linhas Slope ${sB.lo}/${sB.hi} Section=${sectionNum}`);

    const yLo = this._lerp(rowLo.Y_Ref_Down, rowLo.Y_Ref_Up, deviation);
    const yHi = this._lerp(rowHi.Y_Ref_Down, rowHi.Y_Ref_Up, deviation);
    const y_refSlope = this._interp1D(slope, sB.lo, sB.hi, yLo, yHi);

    return { y_refSlope, debug: { slopeBracket: sB, baseResolve: base, sectionNum, deviation, yAtSlopeLo: yLo, yAtSlopeHi: yHi } };
  },

  // ---------- step6: invert resultData (Y -> TOD_m) ----------
  getResultFromY(y_refSlope) {
    const sorted = [...resultData].sort((a, b) => b.Y_Ref - a.Y_Ref); // Y desc

    if (y_refSlope >= sorted[0].Y_Ref) return { result: sorted[0].TOD_m, debug: { clamped: "high" } };
    if (y_refSlope <= sorted[sorted.length - 1].Y_Ref) return { result: sorted[sorted.length - 1].TOD_m, debug: { clamped: "low" } };

    for (let i = 0; i < sorted.length - 1; i++) {
      const a = sorted[i], b = sorted[i + 1];
      if (y_refSlope <= a.Y_Ref && y_refSlope >= b.Y_Ref) {
        const t = (a.Y_Ref === b.Y_Ref) ? 0 : (y_refSlope - a.Y_Ref) / (b.Y_Ref - a.Y_Ref);
        return { result: this._lerp(a.TOD_m, b.TOD_m, t), debug: { bracket: { a, b }, t } };
      }
    }

    throw new Error(`Step6: não consegui fazer bracket para y_refSlope=${y_refSlope}`);
  },

  // ---------- main ----------
  compute(inputs) {
	  // Normalização de nomes
	  const PA = inputs?.PA;
	  const OAT = inputs?.OAT;
	  const Weight = inputs?.Weight;
	  const wind = (inputs?.wind ?? inputs?.Wind);
	  const slope = inputs?.slope;

	  const base = {
		input: { PA, OAT, Weight, Wind: wind, slope }
	  };

	  // 0) validação de tipo (número finito)
	  if (![PA, OAT, Weight, wind, slope].every(v => typeof v === "number" && Number.isFinite(v))) {
		return this._fail(base, "validation", "Inputs inválidos: esperado números finitos {PA,OAT,Weight,Wind/wind,slope}.");
	  }

	  // 0b) validação de ranges (não faz clamp: falha)
	  //     Nota: ranges vêm das datas (min/max existentes)
	  const paR = this._rangeOf(pressureAltTemperatureData, "Pressure_Altitude");
	  const tR  = this._rangeOf(pressureAltTemperatureData, "Temperature");
	  const wR  = this._rangeOf(weightSectionData, "Weight");
	  const wiR = this._rangeOf(windData, "Wind");
	  const sR  = this._rangeOf(slopeData, "Slope");

	  function outOfRange(name, v, r) {
		return `${name} fora do range [${r.min}, ${r.max}] (data). Valor=${v}`;
	  }

	  if (PA < paR.min || PA > paR.max) return this._fail(base, "step 1", outOfRange("PA", PA, paR));
	  if (OAT < tR.min || OAT > tR.max) return this._fail(base, "step 2", outOfRange("OAT", OAT, tR));
	  if (Weight < wR.min || Weight > wR.max) return this._fail(base, "step 3", outOfRange("Weight", Weight, wR));
	  if (wind < wiR.min || wind > wiR.max) return this._fail(base, "step 4", outOfRange("Wind", wind, wiR));
	  if (slope < sR.min || slope > sR.max) return this._fail(base, "step 5", outOfRange("slope", slope, sR));

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
		const s5 = this.getYRefSlope({ slope }, debug.step4.y_refWind);
		debug.step5 = s5;
	  } catch (e) {
		return this._fail(base, "step5", e?.message ?? String(e), { ...debug });
	  }

	  try {
		const s6 = this.getResultFromY(debug.step5.y_refSlope);
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

