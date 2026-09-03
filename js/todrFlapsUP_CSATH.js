// TODR.js
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
  { "Pressure_Altitude": 12000, "Temperature": -40, "Y_REF1": 376 },
  { "Pressure_Altitude": 12000, "Temperature": -30, "Y_REF1": 315 },

  { "Pressure_Altitude": 10000, "Temperature": -40, "Y_REF1": 501 },
  { "Pressure_Altitude": 10000, "Temperature": -30, "Y_REF1": 422 },
  { "Pressure_Altitude": 10000, "Temperature": -20, "Y_REF1": 376 },
  { "Pressure_Altitude": 10000, "Temperature": -10, "Y_REF1": 317 },

  { "Pressure_Altitude": 8000, "Temperature": -40, "Y_REF1": 501 },
  { "Pressure_Altitude": 8000, "Temperature": -30, "Y_REF1": 481 },
  { "Pressure_Altitude": 8000, "Temperature": -20, "Y_REF1": 457 },
  { "Pressure_Altitude": 8000, "Temperature": -10, "Y_REF1": 425 },
  { "Pressure_Altitude": 8000, "Temperature": 0, "Y_REF1": 370 },
  { "Pressure_Altitude": 8000, "Temperature": 10, "Y_REF1": 308 },

  { "Pressure_Altitude": 6000, "Temperature": -30, "Y_REF1": 521 },
  { "Pressure_Altitude": 6000, "Temperature": -20, "Y_REF1": 506 },
  { "Pressure_Altitude": 6000, "Temperature": -10, "Y_REF1": 490 },
  { "Pressure_Altitude": 6000, "Temperature": 0, "Y_REF1": 464 },
  { "Pressure_Altitude": 6000, "Temperature": 10, "Y_REF1": 409 },
  { "Pressure_Altitude": 6000, "Temperature": 20, "Y_REF1": 343 },

  { "Pressure_Altitude": 4000, "Temperature": -30, "Y_REF1": 543 },
  { "Pressure_Altitude": 4000, "Temperature": -20, "Y_REF1": 530 },
  { "Pressure_Altitude": 4000, "Temperature": -10, "Y_REF1": 514 },
  { "Pressure_Altitude": 4000, "Temperature": 0, "Y_REF1": 501 },
  { "Pressure_Altitude": 4000, "Temperature": 10, "Y_REF1": 484 },
  { "Pressure_Altitude": 4000, "Temperature": 20, "Y_REF1": 438 },
  { "Pressure_Altitude": 4000, "Temperature": 30, "Y_REF1": 368 },

  { "Pressure_Altitude": 2000, "Temperature": -20, "Y_REF1": 554 },
  { "Pressure_Altitude": 2000, "Temperature": -10, "Y_REF1": 543 },
  { "Pressure_Altitude": 2000, "Temperature": 0, "Y_REF1": 532 },
  { "Pressure_Altitude": 2000, "Temperature": 10, "Y_REF1": 521 },
  { "Pressure_Altitude": 2000, "Temperature": 20, "Y_REF1": 501 },
  { "Pressure_Altitude": 2000, "Temperature": 30, "Y_REF1": 453 },
  { "Pressure_Altitude": 2000, "Temperature": 40, "Y_REF1": 376 },

  { "Pressure_Altitude": 0, "Temperature": -20, "Y_REF1": 573 },
  { "Pressure_Altitude": 0, "Temperature": -10, "Y_REF1": 563 },
  { "Pressure_Altitude": 0, "Temperature": 0, "Y_REF1": 552 },
  { "Pressure_Altitude": 0, "Temperature": 10, "Y_REF1": 543 },
  { "Pressure_Altitude": 0, "Temperature": 20, "Y_REF1": 532 },
  { "Pressure_Altitude": 0, "Temperature": 30, "Y_REF1": 508 },
  { "Pressure_Altitude": 0, "Temperature": 40, "Y_REF1": 449 },
  { "Pressure_Altitude": 0, "Temperature": 50, "Y_REF1": 370 }
];

const reflineWeightData = [
  { "sectionNum": 1, "Y_Refline_Section_Down": 576, "Y_Refline_Section_Up": 532 },
  { "sectionNum": 2, "Y_Refline_Section_Down": 532, "Y_Refline_Section_Up": 488 },
  { "sectionNum": 3, "Y_Refline_Section_Down": 488, "Y_Refline_Section_Up": 446 },
  { "sectionNum": 4, "Y_Refline_Section_Down": 446, "Y_Refline_Section_Up": 403 },
  { "sectionNum": 5, "Y_Refline_Section_Down": 403, "Y_Refline_Section_Up": 361 },
  { "sectionNum": 6, "Y_Refline_Section_Down": 361, "Y_Refline_Section_Up": 319 }
];

const weightSectionData = [
  { "Weight": 4500, "Section": 1, "Y_Ref_Down": 645, "Y_Ref_Up": 623 },
  { "Weight": 4500, "Section": 2, "Y_Ref_Down": 623, "Y_Ref_Up": 600 },
  { "Weight": 4500, "Section": 3, "Y_Ref_Down": 600, "Y_Ref_Up": 580 },
  { "Weight": 4500, "Section": 4, "Y_Ref_Down": 580, "Y_Ref_Up": 557 },
  { "Weight": 4500, "Section": 5, "Y_Ref_Down": 557, "Y_Ref_Up": 540 },
  { "Weight": 4500, "Section": 6, "Y_Ref_Down": 540, "Y_Ref_Up": 523 },

  { "Weight": 4600, "Section": 1, "Y_Ref_Down": 642, "Y_Ref_Up": 618 },
  { "Weight": 4600, "Section": 2, "Y_Ref_Down": 618, "Y_Ref_Up": 597 },
  { "Weight": 4600, "Section": 3, "Y_Ref_Down": 597, "Y_Ref_Up": 574 },
  { "Weight": 4600, "Section": 4, "Y_Ref_Down": 574, "Y_Ref_Up": 552 },
  { "Weight": 4600, "Section": 5, "Y_Ref_Down": 552, "Y_Ref_Up": 535 },
  { "Weight": 4600, "Section": 6, "Y_Ref_Down": 535, "Y_Ref_Up": 516 },

  { "Weight": 4700, "Section": 1, "Y_Ref_Down": 638, "Y_Ref_Up": 614 },
  { "Weight": 4700, "Section": 2, "Y_Ref_Down": 614, "Y_Ref_Up": 593 },
  { "Weight": 4700, "Section": 3, "Y_Ref_Down": 593, "Y_Ref_Up": 569 },
  { "Weight": 4700, "Section": 4, "Y_Ref_Down": 569, "Y_Ref_Up": 547 },
  { "Weight": 4700, "Section": 5, "Y_Ref_Down": 547, "Y_Ref_Up": 528 },
  { "Weight": 4700, "Section": 6, "Y_Ref_Down": 528, "Y_Ref_Up": 509 },

  { "Weight": 4800, "Section": 1, "Y_Ref_Down": 635, "Y_Ref_Up": 611 },
  { "Weight": 4800, "Section": 2, "Y_Ref_Down": 611, "Y_Ref_Up": 588 },
  { "Weight": 4800, "Section": 3, "Y_Ref_Down": 588, "Y_Ref_Up": 564 },
  { "Weight": 4800, "Section": 4, "Y_Ref_Down": 564, "Y_Ref_Up": 540 },
  { "Weight": 4800, "Section": 5, "Y_Ref_Down": 540, "Y_Ref_Up": 524 },
  { "Weight": 4800, "Section": 6, "Y_Ref_Down": 524, "Y_Ref_Up": 500 },

  { "Weight": 4900, "Section": 1, "Y_Ref_Down": 631, "Y_Ref_Up": 604 },
  { "Weight": 4900, "Section": 2, "Y_Ref_Down": 604, "Y_Ref_Up": 583 },
  { "Weight": 4900, "Section": 3, "Y_Ref_Down": 583, "Y_Ref_Up": 559 },
  { "Weight": 4900, "Section": 4, "Y_Ref_Down": 559, "Y_Ref_Up": 531 },
  { "Weight": 4900, "Section": 5, "Y_Ref_Down": 531, "Y_Ref_Up": 518 },
  { "Weight": 4900, "Section": 6, "Y_Ref_Down": 518, "Y_Ref_Up": 492 },

  { "Weight": 5000, "Section": 1, "Y_Ref_Down": 627, "Y_Ref_Up": 599 },
  { "Weight": 5000, "Section": 2, "Y_Ref_Down": 599, "Y_Ref_Up": 574 },
  { "Weight": 5000, "Section": 3, "Y_Ref_Down": 574, "Y_Ref_Up": 551 },
  { "Weight": 5000, "Section": 4, "Y_Ref_Down": 551, "Y_Ref_Up": 522 },
  { "Weight": 5000, "Section": 5, "Y_Ref_Down": 522, "Y_Ref_Up": 506 },
  { "Weight": 5000, "Section": 6, "Y_Ref_Down": 506, "Y_Ref_Up": 479 },

  { "Weight": 5100, "Section": 1, "Y_Ref_Down": 622, "Y_Ref_Up": 594 },
  { "Weight": 5100, "Section": 2, "Y_Ref_Down": 594, "Y_Ref_Up": 567 },
  { "Weight": 5100, "Section": 3, "Y_Ref_Down": 567, "Y_Ref_Up": 544 },
  { "Weight": 5100, "Section": 4, "Y_Ref_Down": 544, "Y_Ref_Up": 513 },
  { "Weight": 5100, "Section": 5, "Y_Ref_Down": 513, "Y_Ref_Up": 496 },
  { "Weight": 5100, "Section": 6, "Y_Ref_Down": 496, "Y_Ref_Up": 470 },

  { "Weight": 5200, "Section": 1, "Y_Ref_Down": 618, "Y_Ref_Up": 587 },
  { "Weight": 5200, "Section": 2, "Y_Ref_Down": 587, "Y_Ref_Up": 558 },
  { "Weight": 5200, "Section": 3, "Y_Ref_Down": 558, "Y_Ref_Up": 536 },
  { "Weight": 5200, "Section": 4, "Y_Ref_Down": 536, "Y_Ref_Up": 505 },
  { "Weight": 5200, "Section": 5, "Y_Ref_Down": 505, "Y_Ref_Up": 484 },
  { "Weight": 5200, "Section": 6, "Y_Ref_Down": 484, "Y_Ref_Up": 458 },

  { "Weight": 5300, "Section": 1, "Y_Ref_Down": 612, "Y_Ref_Up": 580 },
  { "Weight": 5300, "Section": 2, "Y_Ref_Down": 580, "Y_Ref_Up": 551 },
  { "Weight": 5300, "Section": 3, "Y_Ref_Down": 551, "Y_Ref_Up": 522 },
  { "Weight": 5300, "Section": 4, "Y_Ref_Down": 522, "Y_Ref_Up": 491 },
  { "Weight": 5300, "Section": 5, "Y_Ref_Down": 491, "Y_Ref_Up": 470 },
  { "Weight": 5300, "Section": 6, "Y_Ref_Down": 470, "Y_Ref_Up": 442 },

  { "Weight": 5400, "Section": 1, "Y_Ref_Down": 608, "Y_Ref_Up": 574 },
  { "Weight": 5400, "Section": 2, "Y_Ref_Down": 574, "Y_Ref_Up": 543 },
  { "Weight": 5400, "Section": 3, "Y_Ref_Down": 543, "Y_Ref_Up": 513 },
  { "Weight": 5400, "Section": 4, "Y_Ref_Down": 513, "Y_Ref_Up": 482 },
  { "Weight": 5400, "Section": 5, "Y_Ref_Down": 482, "Y_Ref_Up": 456 },
  { "Weight": 5400, "Section": 6, "Y_Ref_Down": 456, "Y_Ref_Up": 430 },

  { "Weight": 5500, "Section": 1, "Y_Ref_Down": 603, "Y_Ref_Up": 567 },
  { "Weight": 5500, "Section": 2, "Y_Ref_Down": 567, "Y_Ref_Up": 534 },
  { "Weight": 5500, "Section": 3, "Y_Ref_Down": 534, "Y_Ref_Up": 503 },
  { "Weight": 5500, "Section": 4, "Y_Ref_Down": 503, "Y_Ref_Up": 468 },
  { "Weight": 5500, "Section": 5, "Y_Ref_Down": 468, "Y_Ref_Up": 444 },
  { "Weight": 5500, "Section": 6, "Y_Ref_Down": 444, "Y_Ref_Up": 415 },

  { "Weight": 5600, "Section": 1, "Y_Ref_Down": 596, "Y_Ref_Up": 560 },
  { "Weight": 5600, "Section": 2, "Y_Ref_Down": 560, "Y_Ref_Up": 524 },
  { "Weight": 5600, "Section": 3, "Y_Ref_Down": 524, "Y_Ref_Up": 494 },
  { "Weight": 5600, "Section": 4, "Y_Ref_Down": 494, "Y_Ref_Up": 456 },
  { "Weight": 5600, "Section": 5, "Y_Ref_Down": 456, "Y_Ref_Up": 429 },
  { "Weight": 5600, "Section": 6, "Y_Ref_Down": 429, "Y_Ref_Up": 399 },

  { "Weight": 5700, "Section": 1, "Y_Ref_Down": 591, "Y_Ref_Up": 553 },
  { "Weight": 5700, "Section": 2, "Y_Ref_Down": 553, "Y_Ref_Up": 515 },
  { "Weight": 5700, "Section": 3, "Y_Ref_Down": 515, "Y_Ref_Up": 482 },
  { "Weight": 5700, "Section": 4, "Y_Ref_Down": 482, "Y_Ref_Up": 446 },
  { "Weight": 5700, "Section": 5, "Y_Ref_Down": 446, "Y_Ref_Up": 413 },
  { "Weight": 5700, "Section": 6, "Y_Ref_Down": 413, "Y_Ref_Up": 382 },

  { "Weight": 5800, "Section": 1, "Y_Ref_Down": 586, "Y_Ref_Up": 546 },
  { "Weight": 5800, "Section": 2, "Y_Ref_Down": 546, "Y_Ref_Up": 506 },
  { "Weight": 5800, "Section": 3, "Y_Ref_Down": 506, "Y_Ref_Up": 470 },
  { "Weight": 5800, "Section": 4, "Y_Ref_Down": 470, "Y_Ref_Up": 430 },
  { "Weight": 5800, "Section": 5, "Y_Ref_Down": 430, "Y_Ref_Up": 396 },
  { "Weight": 5800, "Section": 6, "Y_Ref_Down": 396, "Y_Ref_Up": 360 },

  { "Weight": 5900, "Section": 1, "Y_Ref_Down": 580, "Y_Ref_Up": 537 },
  { "Weight": 5900, "Section": 2, "Y_Ref_Down": 537, "Y_Ref_Up": 497 },
  { "Weight": 5900, "Section": 3, "Y_Ref_Down": 497, "Y_Ref_Up": 461 },
  { "Weight": 5900, "Section": 4, "Y_Ref_Down": 461, "Y_Ref_Up": 416 },
  { "Weight": 5900, "Section": 5, "Y_Ref_Down": 416, "Y_Ref_Up": 378 },
  { "Weight": 5900, "Section": 6, "Y_Ref_Down": 378, "Y_Ref_Up": 340 },

  { "Weight": 6000, "Section": 1, "Y_Ref_Down": 573, "Y_Ref_Up": 530 },
  { "Weight": 6000, "Section": 2, "Y_Ref_Down": 530, "Y_Ref_Up": 488 },
  { "Weight": 6000, "Section": 3, "Y_Ref_Down": 488, "Y_Ref_Up": 445 },
  { "Weight": 6000, "Section": 4, "Y_Ref_Down": 445, "Y_Ref_Up": 402 },
  { "Weight": 6000, "Section": 5, "Y_Ref_Down": 402, "Y_Ref_Up": 359 },
  { "Weight": 6000, "Section": 6, "Y_Ref_Down": 359, "Y_Ref_Up": 317 },

  { "Weight": 6100, "Section": 1, "Y_Ref_Down": 568, "Y_Ref_Up": 521 },
  { "Weight": 6100, "Section": 2, "Y_Ref_Down": 521, "Y_Ref_Up": 476 },
  { "Weight": 6100, "Section": 3, "Y_Ref_Down": 476, "Y_Ref_Up": 433 },
  { "Weight": 6100, "Section": 4, "Y_Ref_Down": 433, "Y_Ref_Up": 385 },
  { "Weight": 6100, "Section": 5, "Y_Ref_Down": 385, "Y_Ref_Up": 342 },
  { "Weight": 6100, "Section": 6, "Y_Ref_Down": 342, "Y_Ref_Up": 293 },

  { "Weight": 6200, "Section": 1, "Y_Ref_Down": 562, "Y_Ref_Up": 512 },
  { "Weight": 6200, "Section": 2, "Y_Ref_Down": 512, "Y_Ref_Up": 466 },
  { "Weight": 6200, "Section": 3, "Y_Ref_Down": 466, "Y_Ref_Up": 419 },
  { "Weight": 6200, "Section": 4, "Y_Ref_Down": 419, "Y_Ref_Up": 367 },
  { "Weight": 6200, "Section": 5, "Y_Ref_Down": 367, "Y_Ref_Up": 323 },

  { "Weight": 6300, "Section": 1, "Y_Ref_Down": 555, "Y_Ref_Up": 504 },
  { "Weight": 6300, "Section": 2, "Y_Ref_Down": 504, "Y_Ref_Up": 452 },
  { "Weight": 6300, "Section": 3, "Y_Ref_Down": 452, "Y_Ref_Up": 404 },
  { "Weight": 6300, "Section": 4, "Y_Ref_Down": 404, "Y_Ref_Up": 348 },
  { "Weight": 6300, "Section": 5, "Y_Ref_Down": 348, "Y_Ref_Up": 297 },

	{ "Weight": 6400, "Section": 1, "Y_Ref_Down": 549, "Y_Ref_Up": 495 },
  { "Weight": 6400, "Section": 2, "Y_Ref_Down": 495, "Y_Ref_Up": 440 },
  { "Weight": 6400, "Section": 3, "Y_Ref_Down": 440, "Y_Ref_Up": 388 },
  { "Weight": 6400, "Section": 4, "Y_Ref_Down": 388, "Y_Ref_Up": 329 },
  { "Weight": 6400, "Section": 5, "Y_Ref_Down": 329, "Y_Ref_Up": 276 },

  { "Weight": 6500, "Section": 1, "Y_Ref_Down": 542, "Y_Ref_Up": 483 },
  { "Weight": 6500, "Section": 2, "Y_Ref_Down": 483, "Y_Ref_Up": 426 },
  { "Weight": 6500, "Section": 3, "Y_Ref_Down": 426, "Y_Ref_Up": 371 },
  { "Weight": 6500, "Section": 4, "Y_Ref_Down": 371, "Y_Ref_Up": 304 }
];

const windData = [
  { "Wind": 0, "Y_Ref_Down": 661, "Y_Ref_Up": 618 },
  { "Wind": 0, "Y_Ref_Down": 618, "Y_Ref_Up": 574 },
  { "Wind": 0, "Y_Ref_Down": 574, "Y_Ref_Up": 531 },
  { "Wind": 0, "Y_Ref_Down": 531, "Y_Ref_Up": 488 },
  { "Wind": 0, "Y_Ref_Down": 488, "Y_Ref_Up": 445 },
  { "Wind": 0, "Y_Ref_Down": 445, "Y_Ref_Up": 402 },
  { "Wind": 0, "Y_Ref_Down": 402, "Y_Ref_Up": 359 },
  { "Wind": 0, "Y_Ref_Down": 359, "Y_Ref_Up": 316 },
  { "Wind": 0, "Y_Ref_Down": 316, "Y_Ref_Up": 59 },

  { "Wind": 10, "Y_Ref_Down": 660, "Y_Ref_Up": 627 },
  { "Wind": 10, "Y_Ref_Down": 627, "Y_Ref_Up": 589 },
  { "Wind": 10, "Y_Ref_Down": 589, "Y_Ref_Up": 549 },
  { "Wind": 10, "Y_Ref_Down": 549, "Y_Ref_Up": 508 },
  { "Wind": 10, "Y_Ref_Down": 508, "Y_Ref_Up": 467 },
  { "Wind": 10, "Y_Ref_Down": 467, "Y_Ref_Up": 429 },
  { "Wind": 10, "Y_Ref_Down": 429, "Y_Ref_Up": 386 },
  { "Wind": 10, "Y_Ref_Down": 386, "Y_Ref_Up": 346 },
  { "Wind": 10, "Y_Ref_Down": 346, "Y_Ref_Up": 60 },

  { "Wind": 20, "Y_Ref_Down": 662, "Y_Ref_Up": 637 },
  { "Wind": 20, "Y_Ref_Down": 637, "Y_Ref_Up": 601 },
  { "Wind": 20, "Y_Ref_Down": 601, "Y_Ref_Up": 565 },
  { "Wind": 20, "Y_Ref_Down": 565, "Y_Ref_Up": 527 },
  { "Wind": 20, "Y_Ref_Down": 527, "Y_Ref_Up": 491 },
  { "Wind": 20, "Y_Ref_Down": 491, "Y_Ref_Up": 453 },
  { "Wind": 20, "Y_Ref_Down": 453, "Y_Ref_Up": 415 },
  { "Wind": 20, "Y_Ref_Down": 415, "Y_Ref_Up": 377 },
  { "Wind": 20, "Y_Ref_Down": 377, "Y_Ref_Up": 60 },

  { "Wind": 30, "Y_Ref_Down": 660, "Y_Ref_Up": 648 },
  { "Wind": 30, "Y_Ref_Down": 648, "Y_Ref_Up": 617 },
  { "Wind": 30, "Y_Ref_Down": 617, "Y_Ref_Up": 586 },
  { "Wind": 30, "Y_Ref_Down": 586, "Y_Ref_Up": 548 },
  { "Wind": 30, "Y_Ref_Down": 548, "Y_Ref_Up": 513 },
  { "Wind": 30, "Y_Ref_Down": 513, "Y_Ref_Up": 479 },
  { "Wind": 30, "Y_Ref_Down": 479, "Y_Ref_Up": 444 },
  { "Wind": 30, "Y_Ref_Down": 444, "Y_Ref_Up": 408 },
  { "Wind": 30, "Y_Ref_Down": 408, "Y_Ref_Up": 60 },

  { "Wind": 40, "Y_Ref_Down": 660, "Y_Ref_Up": 631 },
  { "Wind": 40, "Y_Ref_Down": 631, "Y_Ref_Up": 599 },
  { "Wind": 40, "Y_Ref_Down": 599, "Y_Ref_Up": 567 },
  { "Wind": 40, "Y_Ref_Down": 567, "Y_Ref_Up": 534 },
  { "Wind": 40, "Y_Ref_Down": 534, "Y_Ref_Up": 501 },
  { "Wind": 40, "Y_Ref_Down": 501, "Y_Ref_Up": 470 },
  { "Wind": 40, "Y_Ref_Down": 470, "Y_Ref_Up": 437 },
  { "Wind": 40, "Y_Ref_Down": 437, "Y_Ref_Up": 60 },

  { "Wind": 50, "Y_Ref_Down": 662, "Y_Ref_Up": 644 },
  { "Wind": 50, "Y_Ref_Down": 644, "Y_Ref_Up": 617 },
  { "Wind": 50, "Y_Ref_Down": 617, "Y_Ref_Up": 586 },
  { "Wind": 50, "Y_Ref_Down": 586, "Y_Ref_Up": 558 },
  { "Wind": 50, "Y_Ref_Down": 558, "Y_Ref_Up": 527 },
  { "Wind": 50, "Y_Ref_Down": 527, "Y_Ref_Up": 499 },
  { "Wind": 50, "Y_Ref_Down": 499, "Y_Ref_Up": 468 },
  { "Wind": 50, "Y_Ref_Down": 468, "Y_Ref_Up": 60 },

  { "Wind": -10, "Y_Ref_Down": 662, "Y_Ref_Up": 567 },
  { "Wind": -10, "Y_Ref_Down": 567, "Y_Ref_Up": 520 },
  { "Wind": -10, "Y_Ref_Down": 520, "Y_Ref_Up": 475 },
  { "Wind": -10, "Y_Ref_Down": 475, "Y_Ref_Up": 420 },
  { "Wind": -10, "Y_Ref_Down": 420, "Y_Ref_Up": 372 },
  { "Wind": -10, "Y_Ref_Down": 372, "Y_Ref_Up": 317 },
  { "Wind": -10, "Y_Ref_Down": 317, "Y_Ref_Up": 270 },
  { "Wind": -10, "Y_Ref_Down": 270, "Y_Ref_Up": 211 },
  { "Wind": -10, "Y_Ref_Down": 211, "Y_Ref_Up": 60 },

  { "Wind": -20, "Y_Ref_Down": 660, "Y_Ref_Up": 518 },
  { "Wind": -20, "Y_Ref_Down": 518, "Y_Ref_Up": 465 },
  { "Wind": -20, "Y_Ref_Down": 465, "Y_Ref_Up": 415 },
  { "Wind": -20, "Y_Ref_Down": 415, "Y_Ref_Up": 351 },
  { "Wind": -20, "Y_Ref_Down": 351, "Y_Ref_Up": 294 },
  { "Wind": -20, "Y_Ref_Down": 294, "Y_Ref_Up": 230 },
  { "Wind": -20, "Y_Ref_Down": 230, "Y_Ref_Up": 173 },
  { "Wind": -20, "Y_Ref_Down": 173, "Y_Ref_Up": 106 },
  { "Wind": -20, "Y_Ref_Down": 106, "Y_Ref_Up": 60 }
];

const slopeData = [
  { "Slope": 0, "Section": 1, "Y_Ref_Down": 660, "Y_Ref_Up": 617 },
  { "Slope": 0, "Section": 2, "Y_Ref_Down": 617, "Y_Ref_Up": 574 },
  { "Slope": 0, "Section": 3, "Y_Ref_Down": 574, "Y_Ref_Up": 530 },
  { "Slope": 0, "Section": 4, "Y_Ref_Down": 530, "Y_Ref_Up": 487 },
  { "Slope": 0, "Section": 5, "Y_Ref_Down": 487, "Y_Ref_Up": 446 },
  { "Slope": 0, "Section": 6, "Y_Ref_Down": 446, "Y_Ref_Up": 403 },
  { "Slope": 0, "Section": 7, "Y_Ref_Down": 403, "Y_Ref_Up": 360 },
  { "Slope": 0, "Section": 8, "Y_Ref_Down": 360, "Y_Ref_Up": 315 },
  { "Slope": 0, "Section": 9, "Y_Ref_Down": 315, "Y_Ref_Up": 273 },
  { "Slope": 0, "Section": 10, "Y_Ref_Down": 273, "Y_Ref_Up": 58 },

  { "Slope": -1, "Section": 1, "Y_Ref_Down": 660, "Y_Ref_Up": 624 },
  { "Slope": -1, "Section": 2, "Y_Ref_Down": 624, "Y_Ref_Up": 577 },
  { "Slope": -1, "Section": 3, "Y_Ref_Down": 577, "Y_Ref_Up": 536 },
  { "Slope": -1, "Section": 4, "Y_Ref_Down": 536, "Y_Ref_Up": 491 },
  { "Slope": -1, "Section": 5, "Y_Ref_Down": 491, "Y_Ref_Up": 451 },
  { "Slope": -1, "Section": 6, "Y_Ref_Down": 451, "Y_Ref_Up": 411 },
  { "Slope": -1, "Section": 7, "Y_Ref_Down": 411, "Y_Ref_Up": 370 },
  { "Slope": -1, "Section": 8, "Y_Ref_Down": 370, "Y_Ref_Up": 329 },
  { "Slope": -1, "Section": 9, "Y_Ref_Down": 329, "Y_Ref_Up": 286 },
  { "Slope": -1, "Section": 10, "Y_Ref_Down": 286, "Y_Ref_Up": 60 },

  { "Slope": -2, "Section": 1, "Y_Ref_Down": 660, "Y_Ref_Up": 627 },
  { "Slope": -2, "Section": 2, "Y_Ref_Down": 627, "Y_Ref_Up": 582 },
  { "Slope": -2, "Section": 3, "Y_Ref_Down": 582, "Y_Ref_Up": 539 },
  { "Slope": -2, "Section": 4, "Y_Ref_Down": 539, "Y_Ref_Up": 496 },
  { "Slope": -2, "Section": 5, "Y_Ref_Down": 496, "Y_Ref_Up": 458 },
  { "Slope": -2, "Section": 6, "Y_Ref_Down": 458, "Y_Ref_Up": 418 },
  { "Slope": -2, "Section": 7, "Y_Ref_Down": 418, "Y_Ref_Up": 382 },
  { "Slope": -2, "Section": 8, "Y_Ref_Down": 382, "Y_Ref_Up": 341 },
  { "Slope": -2, "Section": 9, "Y_Ref_Down": 341, "Y_Ref_Up": 298 },
  { "Slope": -2, "Section": 10, "Y_Ref_Down": 298, "Y_Ref_Up": 58 },

  { "Slope": 1, "Section": 1, "Y_Ref_Down": 660, "Y_Ref_Up": 612 },
  { "Slope": 1, "Section": 2, "Y_Ref_Down": 612, "Y_Ref_Up": 570 },
  { "Slope": 1, "Section": 3, "Y_Ref_Down": 570, "Y_Ref_Up": 525 },
  { "Slope": 1, "Section": 4, "Y_Ref_Down": 525, "Y_Ref_Up": 480 },
  { "Slope": 1, "Section": 5, "Y_Ref_Down": 480, "Y_Ref_Up": 436 },
  { "Slope": 1, "Section": 6, "Y_Ref_Down": 436, "Y_Ref_Up": 389 },
  { "Slope": 1, "Section": 7, "Y_Ref_Down": 389, "Y_Ref_Up": 342 },
  { "Slope": 1, "Section": 8, "Y_Ref_Down": 342, "Y_Ref_Up": 291 },
  { "Slope": 1, "Section": 9, "Y_Ref_Down": 291, "Y_Ref_Up": 244 },
  { "Slope": 1, "Section": 10, "Y_Ref_Down": 244, "Y_Ref_Up": 60 },

  { "Slope": 2, "Section": 1, "Y_Ref_Down": 660, "Y_Ref_Up": 605 },
  { "Slope": 2, "Section": 2, "Y_Ref_Down": 605, "Y_Ref_Up": 563 },
  { "Slope": 2, "Section": 3, "Y_Ref_Down": 563, "Y_Ref_Up": 520 },
  { "Slope": 2, "Section": 4, "Y_Ref_Down": 520, "Y_Ref_Up": 474 },
  { "Slope": 2, "Section": 5, "Y_Ref_Down": 474, "Y_Ref_Up": 425 },
  { "Slope": 2, "Section": 6, "Y_Ref_Down": 425, "Y_Ref_Up": 375 },
  { "Slope": 2, "Section": 7, "Y_Ref_Down": 375, "Y_Ref_Up": 327 },
  { "Slope": 2, "Section": 8, "Y_Ref_Down": 327, "Y_Ref_Up": 267 },
  { "Slope": 2, "Section": 9, "Y_Ref_Down": 267, "Y_Ref_Up": 215 },
  { "Slope": 2, "Section": 10, "Y_Ref_Down": 215, "Y_Ref_Up": 58 }
];

const resultData = [
  { "TOD_m": 400, "Y_Ref": 660 },
  { "TOD_m": 500, "Y_Ref": 632 },
  { "TOD_m": 600, "Y_Ref": 603 },
  { "TOD_m": 700, "Y_Ref": 577 },
  { "TOD_m": 800, "Y_Ref": 549 },
  { "TOD_m": 900, "Y_Ref": 518 },
  { "TOD_m": 1000, "Y_Ref": 493 },
  { "TOD_m": 1100, "Y_Ref": 463 },
  { "TOD_m": 1200, "Y_Ref": 434 },
  { "TOD_m": 1300, "Y_Ref": 406 },
  { "TOD_m": 1400, "Y_Ref": 379 },
  { "TOD_m": 1500, "Y_Ref": 351 },
  { "TOD_m": 1600, "Y_Ref": 323 },
  { "TOD_m": 1700, "Y_Ref": 296 },
  { "TOD_m": 1800, "Y_Ref": 267 },
  { "TOD_m": 1900, "Y_Ref": 239 },
  { "TOD_m": 2000, "Y_Ref": 210 },
  { "TOD_m": 2100, "Y_Ref": 182 },
  { "TOD_m": 2200, "Y_Ref": 156 },
  { "TOD_m": 2300, "Y_Ref": 125 },
  { "TOD_m": 2400, "Y_Ref": 96 }
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

