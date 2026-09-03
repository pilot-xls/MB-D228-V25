// torr.js
// Modalidade que queres manter:
//   import TORR from "./torr.js";
//   const torr = TORR({ PA: 4000, OAT: 22, Weight: 6300, Wind: 15, slope: 0 });
//   console.log(torr.result, torr.debug);
//
// Regras implementadas:
// - "Costura" (y == up/down): fica na secção de cima (Y maior) -> condição: (y < down && y >= up)
// - "Gap": se y cair num buraco entre secções, escolhe a secção mais perto e faz clamp ao limite mais próximo
// - Interpolações: bilinear (PA/OAT) e linear (Weight e Wind e slope quando necessário)

function TORR(input) {
  return TORR_ENGINE.compute(input);
}

export default TORR;
export { TORR };

// ============================
// DATASETS (copiar/colar)
// ============================

const pressureAltTemperatureData = [
  { Pressure_Altitude: 12000, Temperature: -40, Y_REF1: 372 },
  { Pressure_Altitude: 12000, Temperature: -30, Y_REF1: 322 },
  { Pressure_Altitude: 12000, Temperature: -20, Y_REF1: 266 },
  { Pressure_Altitude: 10000, Temperature: -40, Y_REF1: 445 },
  { Pressure_Altitude: 10000, Temperature: -30, Y_REF1: 416 },
  { Pressure_Altitude: 10000, Temperature: -20, Y_REF1: 377 },
  { Pressure_Altitude: 10000, Temperature: -10, Y_REF1: 330 },
  { Pressure_Altitude: 10000, Temperature: 0, Y_REF1: 269 },
  { Pressure_Altitude: 8000, Temperature: -40, Y_REF1: 491 },
  { Pressure_Altitude: 8000, Temperature: -30, Y_REF1: 473 },
  { Pressure_Altitude: 8000, Temperature: -20, Y_REF1: 452 },
  { Pressure_Altitude: 8000, Temperature: -10, Y_REF1: 419 },
  { Pressure_Altitude: 8000, Temperature: 0, Y_REF1: 374 },
  { Pressure_Altitude: 8000, Temperature: 10, Y_REF1: 320 },
  { Pressure_Altitude: 6000, Temperature: -30, Y_REF1: 510 },
  { Pressure_Altitude: 6000, Temperature: -20, Y_REF1: 496 },
  { Pressure_Altitude: 6000, Temperature: -10, Y_REF1: 477 },
  { Pressure_Altitude: 6000, Temperature: 0, Y_REF1: 454 },
  { Pressure_Altitude: 6000, Temperature: 10, Y_REF1: 416 },
  { Pressure_Altitude: 6000, Temperature: 20, Y_REF1: 365 },
  { Pressure_Altitude: 6000, Temperature: 30, Y_REF1: 302 },
  { Pressure_Altitude: 4000, Temperature: -30, Y_REF1: 531 },
  { Pressure_Altitude: 4000, Temperature: -20, Y_REF1: 520 },
  { Pressure_Altitude: 4000, Temperature: -10, Y_REF1: 508 },
  { Pressure_Altitude: 4000, Temperature: 0, Y_REF1: 491 },
  { Pressure_Altitude: 4000, Temperature: 10, Y_REF1: 473 },
  { Pressure_Altitude: 4000, Temperature: 20, Y_REF1: 435 },
  { Pressure_Altitude: 4000, Temperature: 30, Y_REF1: 377 },
  { Pressure_Altitude: 4000, Temperature: 40, Y_REF1: 299 },
  { Pressure_Altitude: 2000, Temperature: -20, Y_REF1: 541 },
  { Pressure_Altitude: 2000, Temperature: -10, Y_REF1: 531 },
  { Pressure_Altitude: 2000, Temperature: 0, Y_REF1: 520 },
  { Pressure_Altitude: 2000, Temperature: 10, Y_REF1: 505 },
  { Pressure_Altitude: 2000, Temperature: 20, Y_REF1: 489 },
  { Pressure_Altitude: 2000, Temperature: 30, Y_REF1: 452 },
  { Pressure_Altitude: 2000, Temperature: 40, Y_REF1: 388 },
  { Pressure_Altitude: 0, Temperature: -20, Y_REF1: 557 },
  { Pressure_Altitude: 0, Temperature: -10, Y_REF1: 548 },
  { Pressure_Altitude: 0, Temperature: 0, Y_REF1: 538 },
  { Pressure_Altitude: 0, Temperature: 10, Y_REF1: 529 },
  { Pressure_Altitude: 0, Temperature: 20, Y_REF1: 517 },
  { Pressure_Altitude: 0, Temperature: 30, Y_REF1: 496 },
  { Pressure_Altitude: 0, Temperature: 40, Y_REF1: 452 },
  { Pressure_Altitude: 0, Temperature: 50, Y_REF1: 391 }
];

const reflineWeightData = [
  { sectionNum: 1, Y_Refline_Section_Down: 573, Y_Refline_Section_Up: 527 },
  { sectionNum: 2, Y_Refline_Section_Down: 527, Y_Refline_Section_Up: 480 },
  { sectionNum: 3, Y_Refline_Section_Down: 480, Y_Refline_Section_Up: 435 },
  { sectionNum: 4, Y_Refline_Section_Down: 435, Y_Refline_Section_Up: 388 },
  { sectionNum: 5, Y_Refline_Section_Down: 388, Y_Refline_Section_Up: 344 },
  { sectionNum: 6, Y_Refline_Section_Down: 344, Y_Refline_Section_Up: 297 }
];

const weightSectionData = [
  { Weight: 4500, Section: 1, Y_Ref_Down: 624, Y_Ref_Up: 600 },
  { Weight: 4500, Section: 2, Y_Ref_Down: 600, Y_Ref_Up: 574 },
  { Weight: 4500, Section: 3, Y_Ref_Down: 574, Y_Ref_Up: 553 },
  { Weight: 4500, Section: 4, Y_Ref_Down: 553, Y_Ref_Up: 526 },
  { Weight: 4500, Section: 5, Y_Ref_Down: 526, Y_Ref_Up: 513 },
  { Weight: 4500, Section: 6, Y_Ref_Down: 513, Y_Ref_Up: 493 },

  { Weight: 4600, Section: 1, Y_Ref_Down: 622, Y_Ref_Up: 596 },
  { Weight: 4600, Section: 2, Y_Ref_Down: 596, Y_Ref_Up: 570 },
  { Weight: 4600, Section: 3, Y_Ref_Down: 570, Y_Ref_Up: 548 },
  { Weight: 4600, Section: 4, Y_Ref_Down: 548, Y_Ref_Up: 520 },
  { Weight: 4600, Section: 5, Y_Ref_Down: 520, Y_Ref_Up: 507 },
  { Weight: 4600, Section: 6, Y_Ref_Down: 507, Y_Ref_Up: 485 },

  { Weight: 4700, Section: 1, Y_Ref_Down: 620, Y_Ref_Up: 594 },
  { Weight: 4700, Section: 2, Y_Ref_Down: 594, Y_Ref_Up: 566 },
  { Weight: 4700, Section: 3, Y_Ref_Down: 566, Y_Ref_Up: 544 },
  { Weight: 4700, Section: 4, Y_Ref_Down: 544, Y_Ref_Up: 515 },
  { Weight: 4700, Section: 5, Y_Ref_Down: 515, Y_Ref_Up: 500 },
  { Weight: 4700, Section: 6, Y_Ref_Down: 500, Y_Ref_Up: 476 },

  { Weight: 4800, Section: 1, Y_Ref_Down: 616, Y_Ref_Up: 590 },
  { Weight: 4800, Section: 2, Y_Ref_Down: 590, Y_Ref_Up: 563 },
  { Weight: 4800, Section: 3, Y_Ref_Down: 563, Y_Ref_Up: 539 },
  { Weight: 4800, Section: 4, Y_Ref_Down: 539, Y_Ref_Up: 509 },
  { Weight: 4800, Section: 5, Y_Ref_Down: 509, Y_Ref_Up: 494 },
  { Weight: 4800, Section: 6, Y_Ref_Down: 494, Y_Ref_Up: 469 },

  { Weight: 4900, Section: 1, Y_Ref_Down: 614, Y_Ref_Up: 585 },
  { Weight: 4900, Section: 2, Y_Ref_Down: 585, Y_Ref_Up: 555 },
  { Weight: 4900, Section: 3, Y_Ref_Down: 555, Y_Ref_Up: 531 },
  { Weight: 4900, Section: 4, Y_Ref_Down: 531, Y_Ref_Up: 502 },
  { Weight: 4900, Section: 5, Y_Ref_Down: 502, Y_Ref_Up: 483 },
  { Weight: 4900, Section: 6, Y_Ref_Down: 483, Y_Ref_Up: 459 },

  { Weight: 5000, Section: 1, Y_Ref_Down: 612, Y_Ref_Up: 581 },
  { Weight: 5000, Section: 2, Y_Ref_Down: 581, Y_Ref_Up: 552 },
  { Weight: 5000, Section: 3, Y_Ref_Down: 552, Y_Ref_Up: 526 },
  { Weight: 5000, Section: 4, Y_Ref_Down: 526, Y_Ref_Up: 493 },
  { Weight: 5000, Section: 5, Y_Ref_Down: 493, Y_Ref_Up: 476 },
  { Weight: 5000, Section: 6, Y_Ref_Down: 476, Y_Ref_Up: 448 },

  { Weight: 5100, Section: 1, Y_Ref_Down: 607, Y_Ref_Up: 579 },
  { Weight: 5100, Section: 2, Y_Ref_Down: 579, Y_Ref_Up: 548 },
  { Weight: 5100, Section: 3, Y_Ref_Down: 548, Y_Ref_Up: 518 },
  { Weight: 5100, Section: 4, Y_Ref_Down: 518, Y_Ref_Up: 487 },
  { Weight: 5100, Section: 5, Y_Ref_Down: 487, Y_Ref_Up: 467 },
  { Weight: 5100, Section: 6, Y_Ref_Down: 467, Y_Ref_Up: 439 },

  { Weight: 5200, Section: 1, Y_Ref_Down: 605, Y_Ref_Up: 572 },
  { Weight: 5200, Section: 2, Y_Ref_Down: 572, Y_Ref_Up: 541 },
  { Weight: 5200, Section: 3, Y_Ref_Down: 541, Y_Ref_Up: 511 },
  { Weight: 5200, Section: 4, Y_Ref_Down: 511, Y_Ref_Up: 480 },
  { Weight: 5200, Section: 5, Y_Ref_Down: 480, Y_Ref_Up: 454 },
  { Weight: 5200, Section: 6, Y_Ref_Down: 454, Y_Ref_Up: 426 },

  { Weight: 5300, Section: 1, Y_Ref_Down: 603, Y_Ref_Up: 568 },
  { Weight: 5300, Section: 2, Y_Ref_Down: 568, Y_Ref_Up: 535 },
  { Weight: 5300, Section: 3, Y_Ref_Down: 535, Y_Ref_Up: 502 },
  { Weight: 5300, Section: 4, Y_Ref_Down: 502, Y_Ref_Up: 469 },
  { Weight: 5300, Section: 5, Y_Ref_Down: 469, Y_Ref_Up: 443 },
  { Weight: 5300, Section: 6, Y_Ref_Down: 443, Y_Ref_Up: 411 },

  { Weight: 5400, Section: 1, Y_Ref_Down: 598, Y_Ref_Up: 563 },
  { Weight: 5400, Section: 2, Y_Ref_Down: 563, Y_Ref_Up: 528 },
  { Weight: 5400, Section: 3, Y_Ref_Down: 528, Y_Ref_Up: 493 },
  { Weight: 5400, Section: 4, Y_Ref_Down: 493, Y_Ref_Up: 459 },
  { Weight: 5400, Section: 5, Y_Ref_Down: 459, Y_Ref_Up: 430 },
  { Weight: 5400, Section: 6, Y_Ref_Down: 430, Y_Ref_Up: 398 },

  { Weight: 5500, Section: 1, Y_Ref_Down: 596, Y_Ref_Up: 559 },
  { Weight: 5500, Section: 2, Y_Ref_Down: 559, Y_Ref_Up: 520 },
  { Weight: 5500, Section: 3, Y_Ref_Down: 520, Y_Ref_Up: 485 },
  { Weight: 5500, Section: 4, Y_Ref_Down: 485, Y_Ref_Up: 450 },
  { Weight: 5500, Section: 5, Y_Ref_Down: 450, Y_Ref_Up: 419 },
  { Weight: 5500, Section: 6, Y_Ref_Down: 419, Y_Ref_Up: 384 },

  { Weight: 5600, Section: 1, Y_Ref_Down: 592, Y_Ref_Up: 553 },
  { Weight: 5600, Section: 2, Y_Ref_Down: 553, Y_Ref_Up: 513 },
  { Weight: 5600, Section: 3, Y_Ref_Down: 513, Y_Ref_Up: 476 },
  { Weight: 5600, Section: 4, Y_Ref_Down: 476, Y_Ref_Up: 437 },
  { Weight: 5600, Section: 5, Y_Ref_Down: 437, Y_Ref_Up: 404 },
  { Weight: 5600, Section: 6, Y_Ref_Down: 404, Y_Ref_Up: 367 },

  { Weight: 5700, Section: 1, Y_Ref_Down: 588, Y_Ref_Up: 546 },
  { Weight: 5700, Section: 2, Y_Ref_Down: 546, Y_Ref_Up: 505 },
  { Weight: 5700, Section: 3, Y_Ref_Down: 505, Y_Ref_Up: 467 },
  { Weight: 5700, Section: 4, Y_Ref_Down: 467, Y_Ref_Up: 428 },
  { Weight: 5700, Section: 5, Y_Ref_Down: 428, Y_Ref_Up: 389 },
  { Weight: 5700, Section: 6, Y_Ref_Down: 389, Y_Ref_Up: 352 },

  { Weight: 5800, Section: 1, Y_Ref_Down: 585, Y_Ref_Up: 541 },
  { Weight: 5800, Section: 2, Y_Ref_Down: 541, Y_Ref_Up: 496 },
  { Weight: 5800, Section: 3, Y_Ref_Down: 496, Y_Ref_Up: 456 },
  { Weight: 5800, Section: 4, Y_Ref_Down: 456, Y_Ref_Up: 415 },
  { Weight: 5800, Section: 5, Y_Ref_Down: 415, Y_Ref_Up: 374 },
  { Weight: 5800, Section: 6, Y_Ref_Down: 374, Y_Ref_Up: 334 },

  { Weight: 5900, Section: 1, Y_Ref_Down: 579, Y_Ref_Up: 533 },
  { Weight: 5900, Section: 2, Y_Ref_Down: 533, Y_Ref_Up: 487 },
  { Weight: 5900, Section: 3, Y_Ref_Down: 487, Y_Ref_Up: 443 },
  { Weight: 5900, Section: 4, Y_Ref_Down: 443, Y_Ref_Up: 402 },
  { Weight: 5900, Section: 5, Y_Ref_Down: 402, Y_Ref_Up: 358 },
  { Weight: 5900, Section: 6, Y_Ref_Down: 358, Y_Ref_Up: 317 },

  { Weight: 6000, Section: 1, Y_Ref_Down: 574, Y_Ref_Up: 528 },
  { Weight: 6000, Section: 2, Y_Ref_Down: 528, Y_Ref_Up: 481 },
  { Weight: 6000, Section: 3, Y_Ref_Down: 481, Y_Ref_Up: 434 },
  { Weight: 6000, Section: 4, Y_Ref_Down: 434, Y_Ref_Up: 389 },
  { Weight: 6000, Section: 5, Y_Ref_Down: 389, Y_Ref_Up: 341 },
  { Weight: 6000, Section: 6, Y_Ref_Down: 341, Y_Ref_Up: 295 },

  { Weight: 6100, Section: 1, Y_Ref_Down: 568, Y_Ref_Up: 522 },
  { Weight: 6100, Section: 2, Y_Ref_Down: 522, Y_Ref_Up: 470 },
  { Weight: 6100, Section: 3, Y_Ref_Down: 470, Y_Ref_Up: 421 },
  { Weight: 6100, Section: 4, Y_Ref_Down: 421, Y_Ref_Up: 374 },
  { Weight: 6100, Section: 5, Y_Ref_Down: 374, Y_Ref_Up: 323 },
  { Weight: 6100, Section: 6, Y_Ref_Down: 323, Y_Ref_Up: 277 },

  { Weight: 6200, Section: 1, Y_Ref_Down: 561, Y_Ref_Up: 511 },
  { Weight: 6200, Section: 2, Y_Ref_Down: 511, Y_Ref_Up: 459 },
  { Weight: 6200, Section: 3, Y_Ref_Down: 459, Y_Ref_Up: 408 },
  { Weight: 6200, Section: 4, Y_Ref_Down: 408, Y_Ref_Up: 358 },
  { Weight: 6200, Section: 5, Y_Ref_Down: 358, Y_Ref_Up: 304 },

  { Weight: 6300, Section: 1, Y_Ref_Down: 557, Y_Ref_Up: 505 },
  { Weight: 6300, Section: 2, Y_Ref_Down: 505, Y_Ref_Up: 452 },
  { Weight: 6300, Section: 3, Y_Ref_Down: 452, Y_Ref_Up: 395 },
  { Weight: 6300, Section: 4, Y_Ref_Down: 395, Y_Ref_Up: 341 },
  { Weight: 6300, Section: 5, Y_Ref_Down: 341, Y_Ref_Up: 286 },

  { Weight: 6400, Section: 1, Y_Ref_Down: 550, Y_Ref_Up: 496 },
  { Weight: 6400, Section: 2, Y_Ref_Down: 496, Y_Ref_Up: 441 },
  { Weight: 6400, Section: 3, Y_Ref_Down: 441, Y_Ref_Up: 382 },
  { Weight: 6400, Section: 4, Y_Ref_Down: 382, Y_Ref_Up: 325 },
  { Weight: 6400, Section: 5, Y_Ref_Down: 325, Y_Ref_Up: 264 },

  { Weight: 6500, Section: 1, Y_Ref_Down: 542, Y_Ref_Up: 487 },
  { Weight: 6500, Section: 2, Y_Ref_Down: 487, Y_Ref_Up: 430 },
  { Weight: 6500, Section: 3, Y_Ref_Down: 430, Y_Ref_Up: 367 },
  { Weight: 6500, Section: 4, Y_Ref_Down: 367, Y_Ref_Up: 304 }
];

const windData = [
  { Wind: 0, Y_Ref_Down: 665, Y_Ref_Up: 620 },
  { Wind: 0, Y_Ref_Down: 620, Y_Ref_Up: 573 },
  { Wind: 0, Y_Ref_Down: 573, Y_Ref_Up: 527 },
  { Wind: 0, Y_Ref_Down: 527, Y_Ref_Up: 480 },
  { Wind: 0, Y_Ref_Down: 480, Y_Ref_Up: 435 },
  { Wind: 0, Y_Ref_Down: 435, Y_Ref_Up: 388 },
  { Wind: 0, Y_Ref_Down: 388, Y_Ref_Up: 342 },
  { Wind: 0, Y_Ref_Down: 342, Y_Ref_Up: 297 },

  { Wind: 10, Y_Ref_Down: 671, Y_Ref_Up: 629 },
  { Wind: 10, Y_Ref_Down: 629, Y_Ref_Up: 584 },
  { Wind: 10, Y_Ref_Down: 584, Y_Ref_Up: 542 },
  { Wind: 10, Y_Ref_Down: 542, Y_Ref_Up: 498 },
  { Wind: 10, Y_Ref_Down: 498, Y_Ref_Up: 455 },
  { Wind: 10, Y_Ref_Down: 455, Y_Ref_Up: 411 },
  { Wind: 10, Y_Ref_Down: 411, Y_Ref_Up: 366 },
  { Wind: 10, Y_Ref_Down: 366, Y_Ref_Up: 322 },

  { Wind: 20, Y_Ref_Down: 673, Y_Ref_Up: 633 },
  { Wind: 20, Y_Ref_Down: 633, Y_Ref_Up: 598 },
  { Wind: 20, Y_Ref_Down: 598, Y_Ref_Up: 556 },
  { Wind: 20, Y_Ref_Down: 556, Y_Ref_Up: 519 },
  { Wind: 20, Y_Ref_Down: 519, Y_Ref_Up: 476 },
  { Wind: 20, Y_Ref_Down: 476, Y_Ref_Up: 434 },
  { Wind: 20, Y_Ref_Down: 434, Y_Ref_Up: 397 },
  { Wind: 20, Y_Ref_Down: 397, Y_Ref_Up: 352 },

  { Wind: 30, Y_Ref_Down: 677, Y_Ref_Up: 644 },
  { Wind: 30, Y_Ref_Down: 644, Y_Ref_Up: 610 },
  { Wind: 30, Y_Ref_Down: 610, Y_Ref_Up: 572 },
  { Wind: 30, Y_Ref_Down: 572, Y_Ref_Up: 539 },
  { Wind: 30, Y_Ref_Down: 539, Y_Ref_Up: 500 },
  { Wind: 30, Y_Ref_Down: 500, Y_Ref_Up: 462 },
  { Wind: 30, Y_Ref_Down: 462, Y_Ref_Up: 425 },
  { Wind: 30, Y_Ref_Down: 425, Y_Ref_Up: 385 },

  { Wind: 40, Y_Ref_Down: 682, Y_Ref_Up: 652 },
  { Wind: 40, Y_Ref_Down: 652, Y_Ref_Up: 622 },
  { Wind: 40, Y_Ref_Down: 622, Y_Ref_Up: 589 },
  { Wind: 40, Y_Ref_Down: 589, Y_Ref_Up: 558 },
  { Wind: 40, Y_Ref_Down: 558, Y_Ref_Up: 523 },
  { Wind: 40, Y_Ref_Down: 523, Y_Ref_Up: 486 },
  { Wind: 40, Y_Ref_Down: 486, Y_Ref_Up: 451 },
  { Wind: 40, Y_Ref_Down: 451, Y_Ref_Up: 414 },

  { Wind: 50, Y_Ref_Down: 685, Y_Ref_Up: 659 },
  { Wind: 50, Y_Ref_Down: 659, Y_Ref_Up: 634 },
  { Wind: 50, Y_Ref_Down: 634, Y_Ref_Up: 603 },
  { Wind: 50, Y_Ref_Down: 603, Y_Ref_Up: 577 },
  { Wind: 50, Y_Ref_Down: 577, Y_Ref_Up: 542 },
  { Wind: 50, Y_Ref_Down: 542, Y_Ref_Up: 507 },
  { Wind: 50, Y_Ref_Down: 507, Y_Ref_Up: 477 },
  { Wind: 50, Y_Ref_Down: 477, Y_Ref_Up: 447 },

  { Wind: -10, Y_Ref_Down: 629, Y_Ref_Up: 570 },
  { Wind: -10, Y_Ref_Down: 570, Y_Ref_Up: 526 },
  { Wind: -10, Y_Ref_Down: 526, Y_Ref_Up: 472 },
  { Wind: -10, Y_Ref_Down: 472, Y_Ref_Up: 414 },
  { Wind: -10, Y_Ref_Down: 414, Y_Ref_Up: 362 },
  { Wind: -10, Y_Ref_Down: 362, Y_Ref_Up: 302 },
  { Wind: -10, Y_Ref_Down: 302, Y_Ref_Up: 246 },
  { Wind: -10, Y_Ref_Down: 246, Y_Ref_Up: 185 },

  { Wind: -20, Y_Ref_Down: 583, Y_Ref_Up: 523 },
  { Wind: -20, Y_Ref_Down: 523, Y_Ref_Up: 474 },
  { Wind: -20, Y_Ref_Down: 474, Y_Ref_Up: 418 },
  { Wind: -20, Y_Ref_Down: 418, Y_Ref_Up: 345 },
  { Wind: -20, Y_Ref_Down: 345, Y_Ref_Up: 275 },
  { Wind: -20, Y_Ref_Down: 275, Y_Ref_Up: 212 },
  { Wind: -20, Y_Ref_Down: 212, Y_Ref_Up: 147 },
  { Wind: -20, Y_Ref_Down: 147, Y_Ref_Up: 74 }
];

const slopeData = [
  { Slope: 0, Section: 1, Y_Ref_Down: 665, Y_Ref_Up: 619 },
  { Slope: 0, Section: 2, Y_Ref_Down: 619, Y_Ref_Up: 574 },
  { Slope: 0, Section: 3, Y_Ref_Down: 574, Y_Ref_Up: 530 },
  { Slope: 0, Section: 4, Y_Ref_Down: 530, Y_Ref_Up: 481 },
  { Slope: 0, Section: 5, Y_Ref_Down: 481, Y_Ref_Up: 429 },
  { Slope: 0, Section: 6, Y_Ref_Down: 429, Y_Ref_Up: 387 },
  { Slope: 0, Section: 7, Y_Ref_Down: 387, Y_Ref_Up: 341 },
  { Slope: 0, Section: 8, Y_Ref_Down: 341, Y_Ref_Up: 294 },
  { Slope: 0, Section: 9, Y_Ref_Down: 294, Y_Ref_Up: 63 },

  { Slope: -1, Section: 1, Y_Ref_Down: 670, Y_Ref_Up: 626 },
  { Slope: -1, Section: 2, Y_Ref_Down: 626, Y_Ref_Up: 579 },
  { Slope: -1, Section: 3, Y_Ref_Down: 579, Y_Ref_Up: 534 },
  { Slope: -1, Section: 4, Y_Ref_Down: 534, Y_Ref_Up: 488 },
  { Slope: -1, Section: 5, Y_Ref_Down: 488, Y_Ref_Up: 439 },
  { Slope: -1, Section: 6, Y_Ref_Down: 439, Y_Ref_Up: 397 },
  { Slope: -1, Section: 7, Y_Ref_Down: 397, Y_Ref_Up: 355 },
  { Slope: -1, Section: 8, Y_Ref_Down: 355, Y_Ref_Up: 310 },
  { Slope: -1, Section: 9, Y_Ref_Down: 310, Y_Ref_Up: 63 },

  { Slope: -2, Section: 1, Y_Ref_Down: 675, Y_Ref_Up: 630 },
  { Slope: -2, Section: 2, Y_Ref_Down: 630, Y_Ref_Up: 583 },
  { Slope: -2, Section: 3, Y_Ref_Down: 583, Y_Ref_Up: 537 },
  { Slope: -2, Section: 4, Y_Ref_Down: 537, Y_Ref_Up: 492 },
  { Slope: -2, Section: 5, Y_Ref_Down: 492, Y_Ref_Up: 453 },
  { Slope: -2, Section: 6, Y_Ref_Down: 453, Y_Ref_Up: 408 },
  { Slope: -2, Section: 7, Y_Ref_Down: 408, Y_Ref_Up: 369 },
  { Slope: -2, Section: 8, Y_Ref_Down: 369, Y_Ref_Up: 324 },
  { Slope: -2, Section: 9, Y_Ref_Down: 324, Y_Ref_Up: 63 },

  { Slope: 1, Section: 1, Y_Ref_Down: 666, Y_Ref_Up: 621 },
  { Slope: 1, Section: 2, Y_Ref_Down: 621, Y_Ref_Up: 572 },
  { Slope: 1, Section: 3, Y_Ref_Down: 572, Y_Ref_Up: 523 },
  { Slope: 1, Section: 4, Y_Ref_Down: 523, Y_Ref_Up: 469 },
  { Slope: 1, Section: 5, Y_Ref_Down: 469, Y_Ref_Up: 420 },
  { Slope: 1, Section: 6, Y_Ref_Down: 420, Y_Ref_Up: 371 },
  { Slope: 1, Section: 7, Y_Ref_Down: 371, Y_Ref_Up: 313 },
  { Slope: 1, Section: 8, Y_Ref_Down: 313, Y_Ref_Up: 255 },
  { Slope: 1, Section: 9, Y_Ref_Down: 255, Y_Ref_Up: 63 },

  { Slope: 2, Section: 1, Y_Ref_Down: 666, Y_Ref_Up: 619 },
  { Slope: 2, Section: 2, Y_Ref_Down: 619, Y_Ref_Up: 574 },
  { Slope: 2, Section: 3, Y_Ref_Down: 574, Y_Ref_Up: 516 },
  { Slope: 2, Section: 4, Y_Ref_Down: 516, Y_Ref_Up: 462 },
  { Slope: 2, Section: 5, Y_Ref_Down: 462, Y_Ref_Up: 409 },
  { Slope: 2, Section: 6, Y_Ref_Down: 409, Y_Ref_Up: 353 },
  { Slope: 2, Section: 7, Y_Ref_Down: 353, Y_Ref_Up: 287 },
  { Slope: 2, Section: 8, Y_Ref_Down: 287, Y_Ref_Up: 217 },
  { Slope: 2, Section: 9, Y_Ref_Down: 217, Y_Ref_Up: 63 }
];

const resultData = [
  { TOR_m: 0, Y_Ref: 715 },
  { TOR_m: 100, Y_Ref: 684 },
  { TOR_m: 200, Y_Ref: 654 },
  { TOR_m: 300, Y_Ref: 624 },
  { TOR_m: 400, Y_Ref: 592 },
  { TOR_m: 500, Y_Ref: 561 },
  { TOR_m: 600, Y_Ref: 531 },
  { TOR_m: 700, Y_Ref: 501 },
  { TOR_m: 800, Y_Ref: 470 },
  { TOR_m: 900, Y_Ref: 440 },
  { TOR_m: 1000, Y_Ref: 407 },
  { TOR_m: 1100, Y_Ref: 379 },
  { TOR_m: 1200, Y_Ref: 347 },
  { TOR_m: 1300, Y_Ref: 316 },
  { TOR_m: 1400, Y_Ref: 286 },
  { TOR_m: 1500, Y_Ref: 255 },
  { TOR_m: 1600, Y_Ref: 225 },
  { TOR_m: 1700, Y_Ref: 194 },
  { TOR_m: 1800, Y_Ref: 164 },
  { TOR_m: 1900, Y_Ref: 133 },
  { TOR_m: 2000, Y_Ref: 101 },
  { TOR_m: 2100, Y_Ref: 73 }
];

// ============================
// ENGINE (corrigido)
// ============================

const TORR_ENGINE = {
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

  // ---------- step6: invert resultData (Y -> TOR_m) ----------
  getResultFromY(y_refSlope) {
    const sorted = [...resultData].sort((a, b) => b.Y_Ref - a.Y_Ref); // Y desc

    if (y_refSlope >= sorted[0].Y_Ref) return { result: sorted[0].TOR_m, debug: { clamped: "high" } };
    if (y_refSlope <= sorted[sorted.length - 1].Y_Ref) return { result: sorted[sorted.length - 1].TOR_m, debug: { clamped: "low" } };

    for (let i = 0; i < sorted.length - 1; i++) {
      const a = sorted[i], b = sorted[i + 1];
      if (y_refSlope <= a.Y_Ref && y_refSlope >= b.Y_Ref) {
        const t = (a.Y_Ref === b.Y_Ref) ? 0 : (y_refSlope - a.Y_Ref) / (b.Y_Ref - a.Y_Ref);
        return { result: this._lerp(a.TOR_m, b.TOR_m, t), debug: { bracket: { a, b }, t } };
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

