// cgRequired2Seg_CSATH.js


const Obstacle_Distance = [
  { "distance": 0, "section": 1, "x_ref_left": 112, "x_ref_right": 293 },
  { "distance": 500, "section": 2, "x_ref_left": 293, "x_ref_right": 470 },
  { "distance": 1000, "section": 3, "x_ref_left": 470, "x_ref_right": 648 },
  { "distance": 1500, "section": 4, "x_ref_left": 648, "x_ref_right": 823 },
  { "distance": 2000, "section": 5, "x_ref_left": 823, "x_ref_right": 1000 },
  { "distance": 2500, "section": 6, "x_ref_left": 1000, "x_ref_right": 1177 },
  { "distance": 3000, "section": 7, "x_ref_left": 1177, "x_ref_right": 1354 },
  { "distance": 3500, "section": 8, "x_ref_left": 1354, "x_ref_right": 1533 },
  { "distance": 4000, "section": 9, "x_ref_left": 1533, "x_ref_right": 1708 },
  { "distance": 4500, "section": 10, "x_ref_left": 1708, "x_ref_right": 1884 }
];


const Wind = [
  { "wind": 0, "section": 1, "x_ref_left": 115, "x_ref_right": 293 },
  { "wind": 0, "section": 2, "x_ref_left": 293, "x_ref_right": 472 },
  { "wind": 0, "section": 3, "x_ref_left": 472, "x_ref_right": 645 },
  { "wind": 0, "section": 4, "x_ref_left": 645, "x_ref_right": 827 },
  { "wind": 0, "section": 5, "x_ref_left": 827, "x_ref_right": 1004 },
  { "wind": 0, "section": 6, "x_ref_left": 1004, "x_ref_right": 1179 },
  { "wind": 0, "section": 7, "x_ref_left": 1179, "x_ref_right": 1356 },
  { "wind": 0, "section": 8, "x_ref_left": 1356, "x_ref_right": 1531 },
  { "wind": 0, "section": 9, "x_ref_left": 1531, "x_ref_right": 1706 },
  { "wind": 0, "section": 10, "x_ref_left": 1706, "x_ref_right": 1884 },

  { "wind": 10, "section": 1, "x_ref_left": 113, "x_ref_right": 301 },
  { "wind": 10, "section": 2, "x_ref_left": 301, "x_ref_right": 485 },
  { "wind": 10, "section": 3, "x_ref_left": 485, "x_ref_right": 675 },
  { "wind": 10, "section": 4, "x_ref_left": 675, "x_ref_right": 856 },
  { "wind": 10, "section": 5, "x_ref_left": 856, "x_ref_right": 1044 },
  { "wind": 10, "section": 6, "x_ref_left": 1044, "x_ref_right": 1230 },
  { "wind": 10, "section": 7, "x_ref_left": 1230, "x_ref_right": 1416 },
  { "wind": 10, "section": 8, "x_ref_left": 1416, "x_ref_right": 1600 },
  { "wind": 10, "section": 9, "x_ref_left": 1600, "x_ref_right": 1781 },

  { "wind": 20, "section": 1, "x_ref_left": 115, "x_ref_right": 312 },
  { "wind": 20, "section": 2, "x_ref_left": 312, "x_ref_right": 504 },
  { "wind": 20, "section": 3, "x_ref_left": 504, "x_ref_right": 701 },
  { "wind": 20, "section": 4, "x_ref_left": 701, "x_ref_right": 893 },
  { "wind": 20, "section": 5, "x_ref_left": 893, "x_ref_right": 1089 },
  { "wind": 20, "section": 6, "x_ref_left": 1089, "x_ref_right": 1286 },
  { "wind": 20, "section": 7, "x_ref_left": 1286, "x_ref_right": 1478 },
  { "wind": 20, "section": 8, "x_ref_left": 1478, "x_ref_right": 1672 },
  { "wind": 20, "section": 9, "x_ref_left": 1672, "x_ref_right": 1858 },

  { "wind": 30, "section": 1, "x_ref_left": 117, "x_ref_right": 318 },
  { "wind": 30, "section": 2, "x_ref_left": 318, "x_ref_right": 521 },
  { "wind": 30, "section": 3, "x_ref_left": 521, "x_ref_right": 726 },
  { "wind": 30, "section": 4, "x_ref_left": 726, "x_ref_right": 929 },
  { "wind": 30, "section": 5, "x_ref_left": 929, "x_ref_right": 1132 },
  { "wind": 30, "section": 6, "x_ref_left": 1132, "x_ref_right": 1335 },
  { "wind": 30, "section": 7, "x_ref_left": 1335, "x_ref_right": 1538 },
  { "wind": 30, "section": 8, "x_ref_left": 1538, "x_ref_right": 1741 },

  { "wind": 40, "section": 1, "x_ref_left": 113, "x_ref_right": 327 },
  { "wind": 40, "section": 2, "x_ref_left": 327, "x_ref_right": 538 },
  { "wind": 40, "section": 3, "x_ref_left": 538, "x_ref_right": 754 },
  { "wind": 40, "section": 4, "x_ref_left": 754, "x_ref_right": 965 },
  { "wind": 40, "section": 5, "x_ref_left": 965, "x_ref_right": 1179 },
  { "wind": 40, "section": 6, "x_ref_left": 1179, "x_ref_right": 1388 },
  { "wind": 40, "section": 7, "x_ref_left": 1388, "x_ref_right": 1597 },
  { "wind": 40, "section": 8, "x_ref_left": 1597, "x_ref_right": 1813 },

  { "wind": 50, "section": 1, "x_ref_left": 115, "x_ref_right": 337 },
  { "wind": 50, "section": 2, "x_ref_left": 337, "x_ref_right": 560 },
  { "wind": 50, "section": 3, "x_ref_left": 560, "x_ref_right": 782 },
  { "wind": 50, "section": 4, "x_ref_left": 782, "x_ref_right": 1002 },
  { "wind": 50, "section": 5, "x_ref_left": 1002, "x_ref_right": 1222 },
  { "wind": 50, "section": 6, "x_ref_left": 1222, "x_ref_right": 1446 },
  { "wind": 50, "section": 7, "x_ref_left": 1446, "x_ref_right": 1662 },
  { "wind": 50, "section": 8, "x_ref_left": 1662, "x_ref_right": 1886 },

  { "wind": -10, "section": 1, "x_ref_left": 115, "x_ref_right": 269 },
  { "wind": -10, "section": 2, "x_ref_left": 269, "x_ref_right": 427 },
  { "wind": -10, "section": 3, "x_ref_left": 427, "x_ref_right": 560 },
  { "wind": -10, "section": 4, "x_ref_left": 560, "x_ref_right": 709 },
  { "wind": -10, "section": 5, "x_ref_left": 709, "x_ref_right": 859 },
  { "wind": -10, "section": 6, "x_ref_left": 859, "x_ref_right": 1000 },
  { "wind": -10, "section": 7, "x_ref_left": 1000, "x_ref_right": 1136 },
  { "wind": -10, "section": 8, "x_ref_left": 1136, "x_ref_right": 1305 },
  { "wind": -10, "section": 9, "x_ref_left": 1305, "x_ref_right": 1452 },
  { "wind": -10, "section": 10, "x_ref_left": 1452, "x_ref_right": 1602 },

  { "wind": -20, "section": 1, "x_ref_left": 115, "x_ref_right": 241 },
  { "wind": -20, "section": 2, "x_ref_left": 241, "x_ref_right": 380 },
  { "wind": -20, "section": 3, "x_ref_left": 380, "x_ref_right": 476 },
  { "wind": -20, "section": 4, "x_ref_left": 476, "x_ref_right": 592 },
  { "wind": -20, "section": 5, "x_ref_left": 592, "x_ref_right": 720 },
  { "wind": -20, "section": 6, "x_ref_left": 720, "x_ref_right": 831 },
  { "wind": -20, "section": 7, "x_ref_left": 831, "x_ref_right": 929 },
  { "wind": -20, "section": 8, "x_ref_left": 929, "x_ref_right": 1074 },
  { "wind": -20, "section": 9, "x_ref_left": 1074, "x_ref_right": 1192 },
  { "wind": -20, "section": 10, "x_ref_left": 1192, "x_ref_right": 1339 }
];

const Obstacle_height = [
  { "obstacle_height_ft": 50, "section": 1, "x_ref_left": 227, "x_ref_right": 237, "result_CG_required": 7 },
  { "obstacle_height_ft": 50, "section": 2, "x_ref_left": 237, "x_ref_right": 254, "result_CG_required": 6 },
  { "obstacle_height_ft": 50, "section": 3, "x_ref_left": 254, "x_ref_right": 274, "result_CG_required": 5 },
  { "obstacle_height_ft": 50, "section": 4, "x_ref_left": 274, "x_ref_right": 291, "result_CG_required": 4 },
  { "obstacle_height_ft": 50, "section": 5, "x_ref_left": 291, "x_ref_right": 308, "result_CG_required": 3.5 },
  { "obstacle_height_ft": 50, "section": 6, "x_ref_left": 308, "x_ref_right": 331, "result_CG_required": 3 },
  { "obstacle_height_ft": 50, "section": 7, "x_ref_left": 331, "x_ref_right": 374, "result_CG_required": 2.5 },
  { "obstacle_height_ft": 50, "section": 8, "x_ref_left": 374, "x_ref_right": 468, "result_CG_required": 2 },
  { "obstacle_height_ft": 50, "section": 9, "x_ref_left": 468, "x_ref_right": 652, "result_CG_required": 1.5 },
  { "obstacle_height_ft": 50, "section": 10, "x_ref_left": 652, "x_ref_right": 652, "result_CG_required": 1},

  { "obstacle_height_ft": 60, "section": 1, "x_ref_left": 244, "x_ref_right": 261, "result_CG_required": 7 },
  { "obstacle_height_ft": 60, "section": 2, "x_ref_left": 261, "x_ref_right": 274, "result_CG_required": 6 },
  { "obstacle_height_ft": 60, "section": 3, "x_ref_left": 274, "x_ref_right": 304, "result_CG_required": 5 },
  { "obstacle_height_ft": 60, "section": 4, "x_ref_left": 304, "x_ref_right": 321, "result_CG_required": 4 },
  { "obstacle_height_ft": 60, "section": 5, "x_ref_left": 321, "x_ref_right": 344, "result_CG_required": 3.5 },
  { "obstacle_height_ft": 60, "section": 6, "x_ref_left": 344, "x_ref_right": 374, "result_CG_required": 3 },
  { "obstacle_height_ft": 60, "section": 7, "x_ref_left": 374, "x_ref_right": 435, "result_CG_required": 2.5 },
  { "obstacle_height_ft": 60, "section": 8, "x_ref_left": 435, "x_ref_right": 542, "result_CG_required": 2 },
  { "obstacle_height_ft": 60, "section": 9, "x_ref_left": 542, "x_ref_right": 762, "result_CG_required": 1.5 },
  { "obstacle_height_ft": 60, "section": 10, "x_ref_left": 762, "x_ref_right": 762, "result_CG_required": 1},

  { "obstacle_height_ft": 70, "section": 1, "x_ref_left": 261, "x_ref_right": 278, "result_CG_required": 7 },
  { "obstacle_height_ft": 70, "section": 2, "x_ref_left": 278, "x_ref_right": 294, "result_CG_required": 6 },
  { "obstacle_height_ft": 70, "section": 3, "x_ref_left": 294, "x_ref_right": 311, "result_CG_required": 5 },
  { "obstacle_height_ft": 70, "section": 4, "x_ref_left": 311, "x_ref_right": 331, "result_CG_required": 4.5 },
  { "obstacle_height_ft": 70, "section": 5, "x_ref_left": 331, "x_ref_right": 351, "result_CG_required": 4 },
  { "obstacle_height_ft": 70, "section": 6, "x_ref_left": 351, "x_ref_right": 378, "result_CG_required": 3.5 },
  { "obstacle_height_ft": 70, "section": 7, "x_ref_left": 378, "x_ref_right": 415, "result_CG_required": 3 },
  { "obstacle_height_ft": 70, "section": 8, "x_ref_left": 415, "x_ref_right": 485, "result_CG_required": 2.5 },
  { "obstacle_height_ft": 70, "section": 9, "x_ref_left": 485, "x_ref_right": 612, "result_CG_required": 2 },
  { "obstacle_height_ft": 70, "section": 10, "x_ref_left": 612, "x_ref_right": 876, "result_CG_required": 1.5 },
  { "obstacle_height_ft": 70, "section": 11, "x_ref_left": 876, "x_ref_right": 876, "result_CG_required": 1},

  { "obstacle_height_ft": 80, "section": 1, "x_ref_left": 278, "x_ref_right": 298, "result_CG_required": 7 },
  { "obstacle_height_ft": 80, "section": 2, "x_ref_left": 298, "x_ref_right": 318, "result_CG_required": 6 },
  { "obstacle_height_ft": 80, "section": 3, "x_ref_left": 318, "x_ref_right": 334, "result_CG_required": 5 },
  { "obstacle_height_ft": 80, "section": 4, "x_ref_left": 334, "x_ref_right": 358, "result_CG_required": 4.5 },
  { "obstacle_height_ft": 80, "section": 5, "x_ref_left": 358, "x_ref_right": 381, "result_CG_required": 4 },
  { "obstacle_height_ft": 80, "section": 6, "x_ref_left": 381, "x_ref_right": 415, "result_CG_required": 3.5 },
  { "obstacle_height_ft": 80, "section": 7, "x_ref_left": 415, "x_ref_right": 458, "result_CG_required": 3 },
  { "obstacle_height_ft": 80, "section": 8, "x_ref_left": 458, "x_ref_right": 538, "result_CG_required": 2.5 },
  { "obstacle_height_ft": 80, "section": 9, "x_ref_left": 538, "x_ref_right": 689, "result_CG_required": 2 },
  { "obstacle_height_ft": 80, "section": 10, "x_ref_left": 689, "x_ref_right": 973, "result_CG_required": 1.5 },
  { "obstacle_height_ft": 80, "section": 11, "x_ref_left": 973, "x_ref_right": 973, "result_CG_required": 1},


  { "obstacle_height_ft": 90, "section": 1, "x_ref_left": 294, "x_ref_right": 314, "result_CG_required": 7 },
  { "obstacle_height_ft": 90, "section": 2, "x_ref_left": 314, "x_ref_right": 341, "result_CG_required": 6 },
  { "obstacle_height_ft": 90, "section": 3, "x_ref_left": 341, "x_ref_right": 361, "result_CG_required": 5 },
  { "obstacle_height_ft": 90, "section": 4, "x_ref_left": 361, "x_ref_right": 385, "result_CG_required": 4.5 },
  { "obstacle_height_ft": 90, "section": 5, "x_ref_left": 385, "x_ref_right": 415, "result_CG_required": 4 },
  { "obstacle_height_ft": 90, "section": 6, "x_ref_left": 415, "x_ref_right": 451, "result_CG_required": 3.5 },
  { "obstacle_height_ft": 90, "section": 7, "x_ref_left": 451, "x_ref_right": 502, "result_CG_required": 3 },
  { "obstacle_height_ft": 90, "section": 8, "x_ref_left": 502, "x_ref_right": 595, "result_CG_required": 2.5 },
  { "obstacle_height_ft": 90, "section": 9, "x_ref_left": 595, "x_ref_right": 762, "result_CG_required": 2 },
  { "obstacle_height_ft": 90, "section": 10, "x_ref_left": 762, "x_ref_right": 1083, "result_CG_required": 1.5 },
  { "obstacle_height_ft": 90, "section": 11, "x_ref_left": 1083, "x_ref_right": 1083, "result_CG_required": 1},


  { "obstacle_height_ft": 100, "section": 1, "x_ref_left": 308, "x_ref_right": 334, "result_CG_required": 7 },
  { "obstacle_height_ft": 100, "section": 2, "x_ref_left": 334, "x_ref_right": 361, "result_CG_required": 6 },
  { "obstacle_height_ft": 100, "section": 3, "x_ref_left": 361, "x_ref_right": 381, "result_CG_required": 5 },
  { "obstacle_height_ft": 100, "section": 4, "x_ref_left": 381, "x_ref_right": 411, "result_CG_required": 4.5 },
  { "obstacle_height_ft": 100, "section": 5, "x_ref_left": 411, "x_ref_right": 445, "result_CG_required": 4 },
  { "obstacle_height_ft": 100, "section": 6, "x_ref_left": 445, "x_ref_right": 485, "result_CG_required": 3.5 },
  { "obstacle_height_ft": 100, "section": 7, "x_ref_left": 485, "x_ref_right": 542, "result_CG_required": 3 },
  { "obstacle_height_ft": 100, "section": 8, "x_ref_left": 542, "x_ref_right": 649, "result_CG_required": 2.5 },
  { "obstacle_height_ft": 100, "section": 9, "x_ref_left": 649, "x_ref_right": 836, "result_CG_required": 2 },
  { "obstacle_height_ft": 100, "section": 10, "x_ref_left": 836, "x_ref_right": 1194, "result_CG_required": 1.5 },
  { "obstacle_height_ft": 100, "section": 11, "x_ref_left": 1194, "x_ref_right": 1194, "result_CG_required": 1},


  { "obstacle_height_ft": 110, "section": 1, "x_ref_left": 324, "x_ref_right": 351, "result_CG_required": 7 },
  { "obstacle_height_ft": 110, "section": 2, "x_ref_left": 351, "x_ref_right": 381, "result_CG_required": 6 },
  { "obstacle_height_ft": 110, "section": 3, "x_ref_left": 381, "x_ref_right": 408, "result_CG_required": 5 },
  { "obstacle_height_ft": 110, "section": 4, "x_ref_left": 408, "x_ref_right": 438, "result_CG_required": 4.5 },
  { "obstacle_height_ft": 110, "section": 5, "x_ref_left": 438, "x_ref_right": 475, "result_CG_required": 4 },
  { "obstacle_height_ft": 110, "section": 6, "x_ref_left": 475, "x_ref_right": 522, "result_CG_required": 3.5 },
  { "obstacle_height_ft": 110, "section": 7, "x_ref_left": 522, "x_ref_right": 585, "result_CG_required": 3 },
  { "obstacle_height_ft": 110, "section": 8, "x_ref_left": 585, "x_ref_right": 699, "result_CG_required": 2.5 },
  { "obstacle_height_ft": 110, "section": 9, "x_ref_left": 699, "x_ref_right": 903, "result_CG_required": 2 },
  { "obstacle_height_ft": 110, "section": 10, "x_ref_left": 903, "x_ref_right": 1297, "result_CG_required": 1.5 },
  { "obstacle_height_ft": 110, "section": 11, "x_ref_left": 1297, "x_ref_right": 1297, "result_CG_required": 1},


  { "obstacle_height_ft": 120, "section": 1, "x_ref_left": 344, "x_ref_right": 371, "result_CG_required": 7 },
  { "obstacle_height_ft": 120, "section": 2, "x_ref_left": 371, "x_ref_right": 405, "result_CG_required": 6 },
  { "obstacle_height_ft": 120, "section": 3, "x_ref_left": 405, "x_ref_right": 431, "result_CG_required": 5 },
  { "obstacle_height_ft": 120, "section": 4, "x_ref_left": 431, "x_ref_right": 465, "result_CG_required": 4.5 },
  { "obstacle_height_ft": 120, "section": 5, "x_ref_left": 465, "x_ref_right": 505, "result_CG_required": 4 },
  { "obstacle_height_ft": 120, "section": 6, "x_ref_left": 505, "x_ref_right": 558, "result_CG_required": 3.5 },
  { "obstacle_height_ft": 120, "section": 7, "x_ref_left": 558, "x_ref_right": 629, "result_CG_required": 3 },
  { "obstacle_height_ft": 120, "section": 8, "x_ref_left": 629, "x_ref_right": 752, "result_CG_required": 2.5 },
  { "obstacle_height_ft": 120, "section": 9, "x_ref_left": 752, "x_ref_right": 976, "result_CG_required": 2 },
  { "obstacle_height_ft": 120, "section": 10, "x_ref_left": 976, "x_ref_right": 1404, "result_CG_required": 1.5 },
  { "obstacle_height_ft": 120, "section": 11, "x_ref_left": 1404, "x_ref_right": 1404, "result_CG_required": 1},


  { "obstacle_height_ft": 130, "section": 1, "x_ref_left": 361, "x_ref_right": 391, "result_CG_required": 7 },
  { "obstacle_height_ft": 130, "section": 2, "x_ref_left": 391, "x_ref_right": 425, "result_CG_required": 6 },
  { "obstacle_height_ft": 130, "section": 3, "x_ref_left": 425, "x_ref_right": 455, "result_CG_required": 5 },
  { "obstacle_height_ft": 130, "section": 4, "x_ref_left": 455, "x_ref_right": 492, "result_CG_required": 4.5 },
  { "obstacle_height_ft": 130, "section": 5, "x_ref_left": 492, "x_ref_right": 538, "result_CG_required": 4 },
  { "obstacle_height_ft": 130, "section": 6, "x_ref_left": 538, "x_ref_right": 592, "result_CG_required": 3.5 },
  { "obstacle_height_ft": 130, "section": 7, "x_ref_left": 592, "x_ref_right": 675, "result_CG_required": 3 },
  { "obstacle_height_ft": 130, "section": 8, "x_ref_left": 675, "x_ref_right": 809, "result_CG_required": 2.5 },
  { "obstacle_height_ft": 130, "section": 9, "x_ref_left": 809, "x_ref_right": 1053, "result_CG_required": 2 },
  { "obstacle_height_ft": 130, "section": 10, "x_ref_left": 1053, "x_ref_right": 1521, "result_CG_required": 1.5 },
  { "obstacle_height_ft": 130, "section": 11, "x_ref_left": 1521, "x_ref_right": 1521, "result_CG_required": 1},  

  { "obstacle_height_ft": 140, "section": 1, "x_ref_left": 378, "x_ref_right": 408, "result_CG_required": 7 },
  { "obstacle_height_ft": 140, "section": 2, "x_ref_left": 408, "x_ref_right": 445, "result_CG_required": 6 },
  { "obstacle_height_ft": 140, "section": 3, "x_ref_left": 445, "x_ref_right": 478, "result_CG_required": 5 },
  { "obstacle_height_ft": 140, "section": 4, "x_ref_left": 478, "x_ref_right": 522, "result_CG_required": 4.5 },
  { "obstacle_height_ft": 140, "section": 5, "x_ref_left": 522, "x_ref_right": 565, "result_CG_required": 4 },
  { "obstacle_height_ft": 140, "section": 6, "x_ref_left": 565, "x_ref_right": 629, "result_CG_required": 3.5 },
  { "obstacle_height_ft": 140, "section": 7, "x_ref_left": 629, "x_ref_right": 719, "result_CG_required": 3 },
  { "obstacle_height_ft": 140, "section": 8, "x_ref_left": 719, "x_ref_right": 863, "result_CG_required": 2.5 },
  { "obstacle_height_ft": 140, "section": 9, "x_ref_left": 863, "x_ref_right": 1123, "result_CG_required": 2 },
  { "obstacle_height_ft": 140, "section": 10, "x_ref_left": 1123, "x_ref_right": 1625, "result_CG_required": 1.5 },
  { "obstacle_height_ft": 140, "section": 11, "x_ref_left": 1625, "x_ref_right": 1625, "result_CG_required": 1},  

  { "obstacle_height_ft": 150, "section": 1, "x_ref_left": 391, "x_ref_right": 428, "result_CG_required": 7 },
  { "obstacle_height_ft": 150, "section": 2, "x_ref_left": 428, "x_ref_right": 468, "result_CG_required": 6 },
  { "obstacle_height_ft": 150, "section": 3, "x_ref_left": 468, "x_ref_right": 502, "result_CG_required": 5 },
  { "obstacle_height_ft": 150, "section": 4, "x_ref_left": 502, "x_ref_right": 548, "result_CG_required": 4.5 },
  { "obstacle_height_ft": 150, "section": 5, "x_ref_left": 548, "x_ref_right": 599, "result_CG_required": 4 },
  { "obstacle_height_ft": 150, "section": 6, "x_ref_left": 599, "x_ref_right": 665, "result_CG_required": 3.5 },
  { "obstacle_height_ft": 150, "section": 7, "x_ref_left": 665, "x_ref_right": 759, "result_CG_required": 3 },
  { "obstacle_height_ft": 150, "section": 8, "x_ref_left": 759, "x_ref_right": 916, "result_CG_required": 2.5 },
  { "obstacle_height_ft": 150, "section": 9, "x_ref_left": 916, "x_ref_right": 1194, "result_CG_required": 2 },
  { "obstacle_height_ft": 150, "section": 10, "x_ref_left": 1194, "x_ref_right": 1729, "result_CG_required": 1.5 },
  { "obstacle_height_ft": 150, "section": 11, "x_ref_left": 1729, "x_ref_right": 1729, "result_CG_required": 1},

  { "obstacle_height_ft": 160, "section": 1, "x_ref_left": 411, "x_ref_right": 445, "result_CG_required": 7 },
  { "obstacle_height_ft": 160, "section": 2, "x_ref_left": 445, "x_ref_right": 488, "result_CG_required": 6 },
  { "obstacle_height_ft": 160, "section": 3, "x_ref_left": 488, "x_ref_right": 528, "result_CG_required": 5 },
  { "obstacle_height_ft": 160, "section": 4, "x_ref_left": 528, "x_ref_right": 575, "result_CG_required": 4.5 },
  { "obstacle_height_ft": 160, "section": 5, "x_ref_left": 575, "x_ref_right": 629, "result_CG_required": 4 },
  { "obstacle_height_ft": 160, "section": 6, "x_ref_left": 629, "x_ref_right": 699, "result_CG_required": 3.5 },
  { "obstacle_height_ft": 160, "section": 7, "x_ref_left": 699, "x_ref_right": 802, "result_CG_required": 3 },
  { "obstacle_height_ft": 160, "section": 8, "x_ref_left": 802, "x_ref_right": 970, "result_CG_required": 2.5 },
  { "obstacle_height_ft": 160, "section": 9, "x_ref_left": 970, "x_ref_right": 1264, "result_CG_required": 2 },
  { "obstacle_height_ft": 160, "section": 10, "x_ref_left": 1264, "x_ref_right": 1832, "result_CG_required": 1.5 },
  { "obstacle_height_ft": 160, "section": 11, "x_ref_left": 1832, "x_ref_right": 1832, "result_CG_required": 1},

  { "obstacle_height_ft": 170, "section": 1, "x_ref_left": 425, "x_ref_right": 465, "result_CG_required": 7 },
  { "obstacle_height_ft": 170, "section": 2, "x_ref_left": 465, "x_ref_right": 508, "result_CG_required": 6 },
  { "obstacle_height_ft": 170, "section": 3, "x_ref_left": 508, "x_ref_right": 548, "result_CG_required": 5 },
  { "obstacle_height_ft": 170, "section": 4, "x_ref_left": 548, "x_ref_right": 602, "result_CG_required": 4.5 },
  { "obstacle_height_ft": 170, "section": 5, "x_ref_left": 602, "x_ref_right": 662, "result_CG_required": 4 },
  { "obstacle_height_ft": 170, "section": 6, "x_ref_left": 662, "x_ref_right": 739, "result_CG_required": 3.5 },
  { "obstacle_height_ft": 170, "section": 7, "x_ref_left": 739, "x_ref_right": 849, "result_CG_required": 3 },
  { "obstacle_height_ft": 170, "section": 8, "x_ref_left": 849, "x_ref_right": 1023, "result_CG_required": 2.5 },
  { "obstacle_height_ft": 170, "section": 9, "x_ref_left": 1023, "x_ref_right": 1337, "result_CG_required": 2 },
  { "obstacle_height_ft": 170, "section": 10, "x_ref_left": 1337, "x_ref_right": 1337, "result_CG_required": 1.5},

  { "obstacle_height_ft": 180, "section": 1, "x_ref_left": 441, "x_ref_right": 481, "result_CG_required": 7 },
  { "obstacle_height_ft": 180, "section": 2, "x_ref_left": 481, "x_ref_right": 532, "result_CG_required": 6 },
  { "obstacle_height_ft": 180, "section": 3, "x_ref_left": 532, "x_ref_right": 572, "result_CG_required": 5 },
  { "obstacle_height_ft": 180, "section": 4, "x_ref_left": 572, "x_ref_right": 629, "result_CG_required": 4.5 },
  { "obstacle_height_ft": 180, "section": 5, "x_ref_left": 629, "x_ref_right": 689, "result_CG_required": 4 },
  { "obstacle_height_ft": 180, "section": 6, "x_ref_left": 689, "x_ref_right": 772, "result_CG_required": 3.5 },
  { "obstacle_height_ft": 180, "section": 7, "x_ref_left": 772, "x_ref_right": 889, "result_CG_required": 3 },
  { "obstacle_height_ft": 180, "section": 8, "x_ref_left": 889, "x_ref_right": 1073, "result_CG_required": 2.5 },
  { "obstacle_height_ft": 180, "section": 9, "x_ref_left": 1073, "x_ref_right": 1411, "result_CG_required": 2 },
  { "obstacle_height_ft": 180, "section": 10, "x_ref_left": 1411, "x_ref_right": 1411, "result_CG_required": 1.5},

  { "obstacle_height_ft": 190, "section": 1, "x_ref_left": 458, "x_ref_right": 502, "result_CG_required": 7 },
  { "obstacle_height_ft": 190, "section": 2, "x_ref_left": 502, "x_ref_right": 555, "result_CG_required": 6 },
  { "obstacle_height_ft": 190, "section": 3, "x_ref_left": 555, "x_ref_right": 599, "result_CG_required": 5 },
  { "obstacle_height_ft": 190, "section": 4, "x_ref_left": 599, "x_ref_right": 659, "result_CG_required": 4.5 },
  { "obstacle_height_ft": 190, "section": 5, "x_ref_left": 659, "x_ref_right": 722, "result_CG_required": 4 },
  { "obstacle_height_ft": 190, "section": 6, "x_ref_left": 722, "x_ref_right": 809, "result_CG_required": 3.5 },
  { "obstacle_height_ft": 190, "section": 7, "x_ref_left": 809, "x_ref_right": 933, "result_CG_required": 3 },
  { "obstacle_height_ft": 190, "section": 8, "x_ref_left": 933, "x_ref_right": 1130, "result_CG_required": 2.5 },
  { "obstacle_height_ft": 190, "section": 9, "x_ref_left": 1130, "x_ref_right": 1478, "result_CG_required": 2 },
  { "obstacle_height_ft": 190, "section": 10, "x_ref_left": 1478, "x_ref_right": 1478, "result_CG_required": 1.5},
  
  { "obstacle_height_ft": 200, "section": 1, "x_ref_left": 475, "x_ref_right": 522, "result_CG_required": 7 },
  { "obstacle_height_ft": 200, "section": 2, "x_ref_left": 522, "x_ref_right": 575, "result_CG_required": 6 },
  { "obstacle_height_ft": 200, "section": 3, "x_ref_left": 575, "x_ref_right": 625, "result_CG_required": 5 },
  { "obstacle_height_ft": 200, "section": 4, "x_ref_left": 625, "x_ref_right": 685, "result_CG_required": 4.5 },
  { "obstacle_height_ft": 200, "section": 5, "x_ref_left": 685, "x_ref_right": 752, "result_CG_required": 4 },
  { "obstacle_height_ft": 200, "section": 6, "x_ref_left": 752, "x_ref_right": 846, "result_CG_required": 3.5 },
  { "obstacle_height_ft": 200, "section": 7, "x_ref_left": 846, "x_ref_right": 976, "result_CG_required": 3 },
  { "obstacle_height_ft": 200, "section": 8, "x_ref_left": 976, "x_ref_right": 1184, "result_CG_required": 2.5 },
  { "obstacle_height_ft": 200, "section": 9, "x_ref_left": 1184, "x_ref_right": 1558, "result_CG_required": 2 },
  { "obstacle_height_ft": 200, "section": 10, "x_ref_left": 1558, "x_ref_right": 1558, "result_CG_required": 1.5},

  { "obstacle_height_ft": 210, "section": 1, "x_ref_left": 492, "x_ref_right": 538, "result_CG_required": 7 },
  { "obstacle_height_ft": 210, "section": 2, "x_ref_left": 538, "x_ref_right": 595, "result_CG_required": 6 },
  { "obstacle_height_ft": 210, "section": 3, "x_ref_left": 595, "x_ref_right": 649, "result_CG_required": 5 },
  { "obstacle_height_ft": 210, "section": 4, "x_ref_left": 649, "x_ref_right": 712, "result_CG_required": 4.5 },
  { "obstacle_height_ft": 210, "section": 5, "x_ref_left": 712, "x_ref_right": 782, "result_CG_required": 4 },
  { "obstacle_height_ft": 210, "section": 6, "x_ref_left": 782, "x_ref_right": 879, "result_CG_required": 3.5 },
  { "obstacle_height_ft": 210, "section": 7, "x_ref_left": 879, "x_ref_right": 1020, "result_CG_required": 3 },
  { "obstacle_height_ft": 210, "section": 8, "x_ref_left": 1020, "x_ref_right": 1237, "result_CG_required": 2.5 },
  { "obstacle_height_ft": 210, "section": 9, "x_ref_left": 1237, "x_ref_right": 1628, "result_CG_required": 2 },
  { "obstacle_height_ft": 210, "section": 10, "x_ref_left": 1628, "x_ref_right": 1628, "result_CG_required": 1.5},

  { "obstacle_height_ft": 220, "section": 1, "x_ref_left": 512, "x_ref_right": 555, "result_CG_required": 7 },
  { "obstacle_height_ft": 220, "section": 2, "x_ref_left": 555, "x_ref_right": 615, "result_CG_required": 6 },
  { "obstacle_height_ft": 220, "section": 3, "x_ref_left": 615, "x_ref_right": 669, "result_CG_required": 5 },
  { "obstacle_height_ft": 220, "section": 4, "x_ref_left": 669, "x_ref_right": 736, "result_CG_required": 4.5 },
  { "obstacle_height_ft": 220, "section": 5, "x_ref_left": 736, "x_ref_right": 813, "result_CG_required": 4 },
  { "obstacle_height_ft": 220, "section": 6, "x_ref_left": 813, "x_ref_right": 916, "result_CG_required": 3.5 },
  { "obstacle_height_ft": 220, "section": 7, "x_ref_left": 916, "x_ref_right": 1063, "result_CG_required": 3 },
  { "obstacle_height_ft": 220, "section": 8, "x_ref_left": 1063, "x_ref_right": 1291, "result_CG_required": 2.5 },
  { "obstacle_height_ft": 220, "section": 9, "x_ref_left": 1291, "x_ref_right": 1702, "result_CG_required": 2 },
  { "obstacle_height_ft": 220, "section": 10, "x_ref_left": 1702, "x_ref_right": 1702, "result_CG_required": 1.5},

  { "obstacle_height_ft": 230, "section": 1, "x_ref_left": 525, "x_ref_right": 578, "result_CG_required": 7 },
  { "obstacle_height_ft": 230, "section": 2, "x_ref_left": 578, "x_ref_right": 642, "result_CG_required": 6 },
  { "obstacle_height_ft": 230, "section": 3, "x_ref_left": 642, "x_ref_right": 695, "result_CG_required": 5 },
  { "obstacle_height_ft": 230, "section": 4, "x_ref_left": 695, "x_ref_right": 766, "result_CG_required": 4.5 },
  { "obstacle_height_ft": 230, "section": 5, "x_ref_left": 766, "x_ref_right": 846, "result_CG_required": 4 },
  { "obstacle_height_ft": 230, "section": 6, "x_ref_left": 846, "x_ref_right": 953, "result_CG_required": 3.5 },
  { "obstacle_height_ft": 230, "section": 7, "x_ref_left": 953, "x_ref_right": 1110, "result_CG_required": 3 },
  { "obstacle_height_ft": 230, "section": 8, "x_ref_left": 1110, "x_ref_right": 1351, "result_CG_required": 2.5 },
  { "obstacle_height_ft": 230, "section": 9, "x_ref_left": 1351, "x_ref_right": 1772, "result_CG_required": 2 },
  { "obstacle_height_ft": 230, "section": 10, "x_ref_left": 1772, "x_ref_right": 1772, "result_CG_required": 1.5},

  { "obstacle_height_ft": 240, "section": 1, "x_ref_left": 542, "x_ref_right": 595, "result_CG_required": 7 },
  { "obstacle_height_ft": 240, "section": 2, "x_ref_left": 595, "x_ref_right": 662, "result_CG_required": 6 },
  { "obstacle_height_ft": 240, "section": 3, "x_ref_left": 662, "x_ref_right": 719, "result_CG_required": 5 },
  { "obstacle_height_ft": 240, "section": 4, "x_ref_left": 719, "x_ref_right": 792, "result_CG_required": 4.5 },
  { "obstacle_height_ft": 240, "section": 5, "x_ref_left": 792, "x_ref_right": 876, "result_CG_required": 4 },
  { "obstacle_height_ft": 240, "section": 6, "x_ref_left": 876, "x_ref_right": 986, "result_CG_required": 3.5 },
  { "obstacle_height_ft": 240, "section": 7, "x_ref_left": 986, "x_ref_right": 1154, "result_CG_required": 3 },
  { "obstacle_height_ft": 240, "section": 8, "x_ref_left": 1154, "x_ref_right": 1401, "result_CG_required": 2.5 },
  { "obstacle_height_ft": 240, "section": 9, "x_ref_left": 1401, "x_ref_right": 1849, "result_CG_required": 2 },
  { "obstacle_height_ft": 240, "section": 10, "x_ref_left": 1849, "x_ref_right": 1849, "result_CG_required": 1.5},

  { "obstacle_height_ft": 250, "section": 1, "x_ref_left": 558, "x_ref_right": 615, "result_CG_required": 7 },
  { "obstacle_height_ft": 250, "section": 2, "x_ref_left": 615, "x_ref_right": 685, "result_CG_required": 6 },
  { "obstacle_height_ft": 250, "section": 3, "x_ref_left": 685, "x_ref_right": 746, "result_CG_required": 5 },
  { "obstacle_height_ft": 250, "section": 4, "x_ref_left": 746, "x_ref_right": 823, "result_CG_required": 4.5 },
  { "obstacle_height_ft": 250, "section": 5, "x_ref_left": 823, "x_ref_right": 909, "result_CG_required": 4 },
  { "obstacle_height_ft": 250, "section": 6, "x_ref_left": 909, "x_ref_right": 1023, "result_CG_required": 3.5 },
  { "obstacle_height_ft": 250, "section": 7, "x_ref_left": 1023, "x_ref_right": 1197, "result_CG_required": 3 },
  { "obstacle_height_ft": 250, "section": 8, "x_ref_left": 1197, "x_ref_right": 1455, "result_CG_required": 2.5 },
  { "obstacle_height_ft": 250, "section": 9, "x_ref_left": 1455, "x_ref_right": 1455, "result_CG_required": 2},

  { "obstacle_height_ft": 260, "section": 1, "x_ref_left": 575, "x_ref_right": 632, "result_CG_required": 7 },
  { "obstacle_height_ft": 260, "section": 2, "x_ref_left": 632, "x_ref_right": 706, "result_CG_required": 6 },
  { "obstacle_height_ft": 260, "section": 3, "x_ref_left": 706, "x_ref_right": 766, "result_CG_required": 5 },
  { "obstacle_height_ft": 260, "section": 4, "x_ref_left": 766, "x_ref_right": 846, "result_CG_required": 4.5 },
  { "obstacle_height_ft": 260, "section": 5, "x_ref_left": 846, "x_ref_right": 940, "result_CG_required": 4 },
  { "obstacle_height_ft": 260, "section": 6, "x_ref_left": 940, "x_ref_right": 1060, "result_CG_required": 3.5 },
  { "obstacle_height_ft": 260, "section": 7, "x_ref_left": 1060, "x_ref_right": 1237, "result_CG_required": 3 },
  { "obstacle_height_ft": 260, "section": 8, "x_ref_left": 1237, "x_ref_right": 1505, "result_CG_required": 2.5 },
  { "obstacle_height_ft": 260, "section": 9, "x_ref_left": 1505, "x_ref_right": 1505, "result_CG_required": 2},

  { "obstacle_height_ft": 270, "section": 1, "x_ref_left": 592, "x_ref_right": 652, "result_CG_required": 7 },
  { "obstacle_height_ft": 270, "section": 2, "x_ref_left": 652, "x_ref_right": 726, "result_CG_required": 6 },
  { "obstacle_height_ft": 270, "section": 3, "x_ref_left": 726, "x_ref_right": 792, "result_CG_required": 5 },
  { "obstacle_height_ft": 270, "section": 4, "x_ref_left": 792, "x_ref_right": 873, "result_CG_required": 4.5 },
  { "obstacle_height_ft": 270, "section": 5, "x_ref_left": 873, "x_ref_right": 970, "result_CG_required": 4 },
  { "obstacle_height_ft": 270, "section": 6, "x_ref_left": 970, "x_ref_right": 1097, "result_CG_required": 3.5 },
  { "obstacle_height_ft": 270, "section": 7, "x_ref_left": 1097, "x_ref_right": 1281, "result_CG_required": 3 },
  { "obstacle_height_ft": 270, "section": 8, "x_ref_left": 1281, "x_ref_right": 1558, "result_CG_required": 2.5 },
  { "obstacle_height_ft": 270, "section": 9, "x_ref_left": 1558, "x_ref_right": 1558, "result_CG_required": 2},
  
  { "obstacle_height_ft": 280, "section": 1, "x_ref_left": 609, "x_ref_right": 672, "result_CG_required": 7 },
  { "obstacle_height_ft": 280, "section": 2, "x_ref_left": 672, "x_ref_right": 749, "result_CG_required": 6 },
  { "obstacle_height_ft": 280, "section": 3, "x_ref_left": 749, "x_ref_right": 816, "result_CG_required": 5 },
  { "obstacle_height_ft": 280, "section": 4, "x_ref_left": 816, "x_ref_right": 903, "result_CG_required": 4.5 },
  { "obstacle_height_ft": 280, "section": 5, "x_ref_left": 903, "x_ref_right": 1000, "result_CG_required": 4 },
  { "obstacle_height_ft": 280, "section": 6, "x_ref_left": 1000, "x_ref_right": 1134, "result_CG_required": 3.5 },
  { "obstacle_height_ft": 280, "section": 7, "x_ref_left": 1134, "x_ref_right": 1324, "result_CG_required": 3 },
  { "obstacle_height_ft": 280, "section": 8, "x_ref_left": 1324, "x_ref_right": 1615, "result_CG_required": 2.5 },
  { "obstacle_height_ft": 280, "section": 9, "x_ref_left": 1615, "x_ref_right": 1615, "result_CG_required": 2},

  { "obstacle_height_ft": 290, "section": 1, "x_ref_left": 625, "x_ref_right": 689, "result_CG_required": 7 },
  { "obstacle_height_ft": 290, "section": 2, "x_ref_left": 689, "x_ref_right": 769, "result_CG_required": 6 },
  { "obstacle_height_ft": 290, "section": 3, "x_ref_left": 769, "x_ref_right": 839, "result_CG_required": 5 },
  { "obstacle_height_ft": 290, "section": 4, "x_ref_left": 839, "x_ref_right": 930, "result_CG_required": 4.5 },
  { "obstacle_height_ft": 290, "section": 5, "x_ref_left": 930, "x_ref_right": 1033, "result_CG_required": 4 },
  { "obstacle_height_ft": 290, "section": 6, "x_ref_left": 1033, "x_ref_right": 1167, "result_CG_required": 3.5 },
  { "obstacle_height_ft": 290, "section": 7, "x_ref_left": 1167, "x_ref_right": 1368, "result_CG_required": 3 },
  { "obstacle_height_ft": 290, "section": 8, "x_ref_left": 1368, "x_ref_right": 1669, "result_CG_required": 2.5 },
  { "obstacle_height_ft": 290, "section": 9, "x_ref_left": 1669, "x_ref_right": 1669, "result_CG_required": 2},

  { "obstacle_height_ft": 300, "section": 1, "x_ref_left": 642, "x_ref_right": 709, "result_CG_required": 7 },
  { "obstacle_height_ft": 300, "section": 2, "x_ref_left": 709, "x_ref_right": 792, "result_CG_required": 6 },
  { "obstacle_height_ft": 300, "section": 3, "x_ref_left": 792, "x_ref_right": 863, "result_CG_required": 5 },
  { "obstacle_height_ft": 300, "section": 4, "x_ref_left": 863, "x_ref_right": 960, "result_CG_required": 4.5 },
  { "obstacle_height_ft": 300, "section": 5, "x_ref_left": 960, "x_ref_right": 1063, "result_CG_required": 4 },
  { "obstacle_height_ft": 300, "section": 6, "x_ref_left": 1063, "x_ref_right": 1204, "result_CG_required": 3.5 },
  { "obstacle_height_ft": 300, "section": 7, "x_ref_left": 1204, "x_ref_right": 1408, "result_CG_required": 3 },
  { "obstacle_height_ft": 300, "section": 8, "x_ref_left": 1408, "x_ref_right": 1722, "result_CG_required": 2.5 },
  { "obstacle_height_ft": 300, "section": 9, "x_ref_left": 1722, "x_ref_right": 1722, "result_CG_required": 2},

  { "obstacle_height_ft": 310, "section": 1, "x_ref_left": 659, "x_ref_right": 729, "result_CG_required": 7 },
  { "obstacle_height_ft": 310, "section": 2, "x_ref_left": 729, "x_ref_right": 813, "result_CG_required": 6 },
  { "obstacle_height_ft": 310, "section": 3, "x_ref_left": 813, "x_ref_right": 889, "result_CG_required": 5 },
  { "obstacle_height_ft": 310, "section": 4, "x_ref_left": 889, "x_ref_right": 983, "result_CG_required": 4.5 },
  { "obstacle_height_ft": 310, "section": 5, "x_ref_left": 983, "x_ref_right": 1093, "result_CG_required": 4 },
  { "obstacle_height_ft": 310, "section": 6, "x_ref_left": 1093, "x_ref_right": 1241, "result_CG_required": 3.5 },
  { "obstacle_height_ft": 310, "section": 7, "x_ref_left": 1241, "x_ref_right": 1455, "result_CG_required": 3 },
  { "obstacle_height_ft": 310, "section": 8, "x_ref_left": 1455, "x_ref_right": 1776, "result_CG_required": 2.5 },
  { "obstacle_height_ft": 310, "section": 9, "x_ref_left": 1776, "x_ref_right": 1776, "result_CG_required": 2},

  { "obstacle_height_ft": 320, "section": 1, "x_ref_left": 675, "x_ref_right": 746, "result_CG_required": 7 },
  { "obstacle_height_ft": 320, "section": 2, "x_ref_left": 746, "x_ref_right": 833, "result_CG_required": 6 },
  { "obstacle_height_ft": 320, "section": 3, "x_ref_left": 833, "x_ref_right": 913, "result_CG_required": 5 },
  { "obstacle_height_ft": 320, "section": 4, "x_ref_left": 913, "x_ref_right": 1010, "result_CG_required": 4.5 },
  { "obstacle_height_ft": 320, "section": 5, "x_ref_left": 1010, "x_ref_right": 1123, "result_CG_required": 4 },
  { "obstacle_height_ft": 320, "section": 6, "x_ref_left": 1123, "x_ref_right": 1274, "result_CG_required": 3.5 },
  { "obstacle_height_ft": 320, "section": 7, "x_ref_left": 1274, "x_ref_right": 1498, "result_CG_required": 3 },
  { "obstacle_height_ft": 320, "section": 8, "x_ref_left": 1498, "x_ref_right": 1829, "result_CG_required": 2.5 },
  { "obstacle_height_ft": 320, "section": 9, "x_ref_left": 1829, "x_ref_right": 1829, "result_CG_required": 2},

  { "obstacle_height_ft": 330, "section": 1, "x_ref_left": 692, "x_ref_right": 766, "result_CG_required": 7 },
  { "obstacle_height_ft": 330, "section": 2, "x_ref_left": 766, "x_ref_right": 859, "result_CG_required": 6 },
  { "obstacle_height_ft": 330, "section": 3, "x_ref_left": 859, "x_ref_right": 936, "result_CG_required": 5 },
  { "obstacle_height_ft": 330, "section": 4, "x_ref_left": 936, "x_ref_right": 1037, "result_CG_required": 4.5 },
  { "obstacle_height_ft": 330, "section": 5, "x_ref_left": 1037, "x_ref_right": 1157, "result_CG_required": 4 },
  { "obstacle_height_ft": 330, "section": 6, "x_ref_left": 1157, "x_ref_right": 1314, "result_CG_required": 3.5 },
  { "obstacle_height_ft": 330, "section": 7, "x_ref_left": 1314, "x_ref_right": 1545, "result_CG_required": 3 },
  { "obstacle_height_ft": 330, "section": 8, "x_ref_left": 1545, "x_ref_right": 1880, "result_CG_required": 2.5 },  
  { "obstacle_height_ft": 330, "section": 9, "x_ref_left": 1880, "x_ref_right": 1880, "result_CG_required": 2 },

  { "obstacle_height_ft": 340, "section": 1, "x_ref_left": 709, "x_ref_right": 786, "result_CG_required": 7 },
  { "obstacle_height_ft": 340, "section": 2, "x_ref_left": 786, "x_ref_right": 876, "result_CG_required": 6 },
  { "obstacle_height_ft": 340, "section": 3, "x_ref_left": 876, "x_ref_right": 960, "result_CG_required": 5 },
  { "obstacle_height_ft": 340, "section": 4, "x_ref_left": 960, "x_ref_right": 1067, "result_CG_required": 4.5 },
  { "obstacle_height_ft": 340, "section": 5, "x_ref_left": 1067, "x_ref_right": 1187, "result_CG_required": 4 },
  { "obstacle_height_ft": 340, "section": 6, "x_ref_left": 1187, "x_ref_right": 1348, "result_CG_required": 3.5 },
  { "obstacle_height_ft": 340, "section": 7, "x_ref_left": 1348, "x_ref_right": 1585, "result_CG_required": 3 },
  { "obstacle_height_ft": 340, "section": 8, "x_ref_left": 1585, "x_ref_right": 1585, "result_CG_required": 2.5},

  { "obstacle_height_ft": 350, "section": 1, "x_ref_left": 722, "x_ref_right": 802, "result_CG_required": 7 },
  { "obstacle_height_ft": 350, "section": 2, "x_ref_left": 802, "x_ref_right": 896, "result_CG_required": 6 },
  { "obstacle_height_ft": 350, "section": 3, "x_ref_left": 896, "x_ref_right": 983, "result_CG_required": 5 },
  { "obstacle_height_ft": 350, "section": 4, "x_ref_left": 983, "x_ref_right": 1090, "result_CG_required": 4.5 },
  { "obstacle_height_ft": 350, "section": 5, "x_ref_left": 1090, "x_ref_right": 1217, "result_CG_required": 4 },
  { "obstacle_height_ft": 350, "section": 6, "x_ref_left": 1217, "x_ref_right": 1384, "result_CG_required": 3.5 },
  { "obstacle_height_ft": 350, "section": 7, "x_ref_left": 1384, "x_ref_right": 1628, "result_CG_required": 3 },
  { "obstacle_height_ft": 350, "section": 8, "x_ref_left": 1628, "x_ref_right": 1628, "result_CG_required": 2.5},

  { "obstacle_height_ft": 360, "section": 1, "x_ref_left": 742, "x_ref_right": 823, "result_CG_required": 7 },
  { "obstacle_height_ft": 360, "section": 2, "x_ref_left": 823, "x_ref_right": 920, "result_CG_required": 6 },
  { "obstacle_height_ft": 360, "section": 3, "x_ref_left": 920, "x_ref_right": 1010, "result_CG_required": 5 },
  { "obstacle_height_ft": 360, "section": 4, "x_ref_left": 1010, "x_ref_right": 1120, "result_CG_required": 4.5 },
  { "obstacle_height_ft": 360, "section": 5, "x_ref_left": 1120, "x_ref_right": 1247, "result_CG_required": 4 },
  { "obstacle_height_ft": 360, "section": 6, "x_ref_left": 1247, "x_ref_right": 1418, "result_CG_required": 3.5 },
  { "obstacle_height_ft": 360, "section": 7, "x_ref_left": 1418, "x_ref_right": 1669, "result_CG_required": 3 },
  { "obstacle_height_ft": 360, "section": 8, "x_ref_left": 1669, "x_ref_right": 1669, "result_CG_required": 2.5},

  { "obstacle_height_ft": 370, "section": 1, "x_ref_left": 759, "x_ref_right": 843, "result_CG_required": 7 },
  { "obstacle_height_ft": 370, "section": 2, "x_ref_left": 843, "x_ref_right": 943, "result_CG_required": 6 },
  { "obstacle_height_ft": 370, "section": 3, "x_ref_left": 943, "x_ref_right": 1033, "result_CG_required": 5 },
  { "obstacle_height_ft": 370, "section": 4, "x_ref_left": 1033, "x_ref_right": 1147, "result_CG_required": 4.5 },
  { "obstacle_height_ft": 370, "section": 5, "x_ref_left": 1147, "x_ref_right": 1281, "result_CG_required": 4 },
  { "obstacle_height_ft": 370, "section": 6, "x_ref_left": 1281, "x_ref_right": 1455, "result_CG_required": 3.5 },
  { "obstacle_height_ft": 370, "section": 7, "x_ref_left": 1455, "x_ref_right": 1719, "result_CG_required": 3 },
  { "obstacle_height_ft": 370, "section": 8, "x_ref_left": 1719, "x_ref_right": 1719, "result_CG_required": 2.5},

  { "obstacle_height_ft": 380, "section": 1, "x_ref_left": 776, "x_ref_right": 859, "result_CG_required": 7 },
  { "obstacle_height_ft": 380, "section": 2, "x_ref_left": 859, "x_ref_right": 963, "result_CG_required": 6 },
  { "obstacle_height_ft": 380, "section": 3, "x_ref_left": 963, "x_ref_right": 1060, "result_CG_required": 5 },
  { "obstacle_height_ft": 380, "section": 4, "x_ref_left": 1060, "x_ref_right": 1174, "result_CG_required": 4.5 },
  { "obstacle_height_ft": 380, "section": 5, "x_ref_left": 1174, "x_ref_right": 1311, "result_CG_required": 4 },
  { "obstacle_height_ft": 380, "section": 6, "x_ref_left": 1311, "x_ref_right": 1495, "result_CG_required": 3.5 },
  { "obstacle_height_ft": 380, "section": 7, "x_ref_left": 1495, "x_ref_right": 1759, "result_CG_required": 3 },
  { "obstacle_height_ft": 380, "section": 8, "x_ref_left": 1759, "x_ref_right": 1759, "result_CG_required": 2.5},

  { "obstacle_height_ft": 390, "section": 1, "x_ref_left": 792, "x_ref_right": 879, "result_CG_required": 7 },
  { "obstacle_height_ft": 390, "section": 2, "x_ref_left": 879, "x_ref_right": 986, "result_CG_required": 6 },
  { "obstacle_height_ft": 390, "section": 3, "x_ref_left": 986, "x_ref_right": 1083, "result_CG_required": 5 },
  { "obstacle_height_ft": 390, "section": 4, "x_ref_left": 1083, "x_ref_right": 1204, "result_CG_required": 4.5 },
  { "obstacle_height_ft": 390, "section": 5, "x_ref_left": 1204, "x_ref_right": 1344, "result_CG_required": 4 },
  { "obstacle_height_ft": 390, "section": 6, "x_ref_left": 1344, "x_ref_right": 1531, "result_CG_required": 3.5 },
  { "obstacle_height_ft": 390, "section": 7, "x_ref_left": 1531, "x_ref_right": 1806, "result_CG_required": 3 },
  { "obstacle_height_ft": 390, "section": 8, "x_ref_left": 1806, "x_ref_right": 1806, "result_CG_required": 2.5},

  { "obstacle_height_ft": 400, "section": 1, "x_ref_left": 809, "x_ref_right": 896, "result_CG_required": 7 },
  { "obstacle_height_ft": 400, "section": 2, "x_ref_left": 896, "x_ref_right": 1003, "result_CG_required": 6 },
  { "obstacle_height_ft": 400, "section": 3, "x_ref_left": 1003, "x_ref_right": 1103, "result_CG_required": 5 },
  { "obstacle_height_ft": 400, "section": 4, "x_ref_left": 1103, "x_ref_right": 1230, "result_CG_required": 4.5 },
  { "obstacle_height_ft": 400, "section": 5, "x_ref_left": 1230, "x_ref_right": 1374, "result_CG_required": 4 },
  { "obstacle_height_ft": 400, "section": 6, "x_ref_left": 1374, "x_ref_right": 1565, "result_CG_required": 3.5 },
  { "obstacle_height_ft": 400, "section": 7, "x_ref_left": 1565, "x_ref_right": 1842, "result_CG_required": 3 },
  { "obstacle_height_ft": 400, "section": 8, "x_ref_left": 1842, "x_ref_right": 1842, "result_CG_required": 2.5}
  ];
  
 
// ================== HELPERS ==================


function lerp(a, b, t) {
  return a + (b - a) * t;
}

function clamp01(t) {
  return Math.max(0, Math.min(1, t));
}

function findBoundingItemsByKey(array, key, value) {
  // assume array ordenado por key crescente
  let lower = null;
  let upper = null;

  for (let i = 0; i < array.length; i++) {
    const item = array[i];
    if (item[key] === value) {
      return { lower: item, upper: item, exact: true };
    }
    if (item[key] < value) {
      if (!lower || item[key] > lower[key]) lower = item;
    }
    if (item[key] > value) {
      if (!upper || item[key] < upper[key]) upper = item;
    }
  }

  return { lower, upper, exact: false };
}

function findSectionByX(rows, x) {
  return rows.find(r => x >= r.x_ref_left && x <= r.x_ref_right) || null;
}

// ================== STEP 1 ==================
// distance -> x (usando Obstacle_Distance)
function computeXFromDistance(distance, debug) {
  
  const minD = Obstacle_Distance[0].distance;
  const maxD = 5000;

  if (distance < minD || distance > maxD) {
    debug.step1 = {
      status: "failed",
      reason: `distance (${distance}) fora do range [${minD}, ${maxD}]`,
      tableRange: { min: minD, max: maxD }
    };
    return null;
  }
  
  const { lower, upper, exact } = findBoundingItemsByKey(
    Obstacle_Distance,
    "distance",
    distance
  );

  if (!lower && !upper) {
    debug.step1 = {
      status: "failed",
      reason: "distance fora do range da tabela Obstacle_Distance",
      tableRange: {
        min: Obstacle_Distance[0].distance,
        max: Obstacle_Distance[Obstacle_Distance.length - 1].distance
      }
    };
    return null;
  }

  if (exact && lower) {
    const x = lower.x_ref_left; // ou qualquer convenção; aqui uso right
    debug.step1 = {
      status: "passed",
      mode: "exact",
      distance,
      section: lower.section,
      x
    };
    return x;
  }

  // interpolação linear entre lower e upper em termos de distance -> x
  const a = lower || upper;
  const b = upper || lower;

  const t = clamp01((distance - a.distance) / (b.distance - a.distance));
  const x = lerp(a.x_ref_left, b.x_ref_left, t);


  debug.step1 = {
    status: "passed",
    mode: "interpolated",
    distance,
    lower: { distance: a.distance, x_ref_right: a.x_ref_right, section: a.section },
    upper: { distance: b.distance, x_ref_right: b.x_ref_right, section: b.section },
    t,
    x
  };

  return x;
}

// ================== STEP 2 ==================
// x (step1) + wind -> novo x (usando Wind)
function computeXWithWind(xFromStep1, windInput, debug) {
  const debugStep2 = { inputWind: windInput };
  // 1) usar wind = 0 para descobrir section e percentagem dentro da section
  const wind0Rows = Wind.filter(w => w.wind === 0);
  const sectionRow0 = findSectionByX(wind0Rows, xFromStep1);

  if (!sectionRow0) {
    debugStep2.status = "failed";
    debugStep2.reason =
      "x de step1 não se encontra em nenhuma section da tabela Wind com wind=0";
    debug.step2 = debugStep2;
    return null;
  }

  const section = sectionRow0.section;
  const tSection = clamp01(
    (xFromStep1 - sectionRow0.x_ref_left) /
      (sectionRow0.x_ref_right - sectionRow0.x_ref_left)
  );

  debugStep2.section = section;
  debugStep2.tSection = tSection;
  debugStep2.wind0Section = {
    x_ref_left: sectionRow0.x_ref_left,
    x_ref_right: sectionRow0.x_ref_right
  };

  // 2) encontrar linhas de Wind para o windInput (mesma section)
  const windRowsSameSection = Wind.filter(w => w.section === section);
  if (windRowsSameSection.length === 0) {
    debugStep2.status = "failed";
    debugStep2.reason = "não existem dados de Wind para esta section";
    debug.step2 = debugStep2;
    return null;
  }

  const { lower, upper, exact } = findBoundingItemsByKey(
    windRowsSameSection,
    "wind",
    windInput
  );

  if (!lower && !upper) {
    debugStep2.status = "failed";
    debugStep2.reason = "wind fora do range da tabela Wind";
    debugStep2.tableRange = {
      min: Math.min(...windRowsSameSection.map(r => r.wind)),
      max: Math.max(...windRowsSameSection.map(r => r.wind))
    };
    debug.step2 = debugStep2;
    return null;
  }

  let xNew;
  if (exact && lower) {
    // usar diretamente a section para esse wind
    xNew = lerp(lower.x_ref_left, lower.x_ref_right, tSection);
    debugStep2.mode = "exactWind";
    debugStep2.windRow = lower;
  } else {
    // interpolar entre dois níveis de wind (bilinear em wind)
    const a = lower || upper;
    const b = upper || lower;
    const tw = clamp01((windInput - a.wind) / (b.wind - a.wind));

    const xA = lerp(a.x_ref_left, a.x_ref_right, tSection);
    const xB = lerp(b.x_ref_left, b.x_ref_right, tSection);
    xNew = lerp(xA, xB, tw);

    debugStep2.mode = "interpolatedWind";
    debugStep2.lower = {
      wind: a.wind,
      x_ref_left: a.x_ref_left,
      x_ref_right: a.x_ref_right
    };
    debugStep2.upper = {
      wind: b.wind,
      x_ref_left: b.x_ref_left,
      x_ref_right: b.x_ref_right
    };
    debugStep2.tw = tw;
    debugStep2.xA = xA;
    debugStep2.xB = xB;
  }

  debugStep2.status = "passed";
  debugStep2.xFromStep1 = xFromStep1;
  debugStep2.xNew = xNew;
  debug.step2 = debugStep2;

  return { x: xNew, section };
}

// ================== STEP 3 ==================
// x (step2) + obstacle_height_ft -> CG_required
function computeCGFromHeight(x, obstacle_height_ft, debug) {
  const debugStep3 = { inputObstacleHeightFt: obstacle_height_ft, x };

  // 1) Filtrar todas as linhas com a altura exata
    
  const rowsSameHeight = Obstacle_height.filter(
  r => r.obstacle_height_ft === obstacle_height_ft
);

if (rowsSameHeight.length === 0) {
  debugStep3.status = "clamped";
  debugStep3.reason = "Obstacle height fora do gráfico — assumido CG > 7%";
  debugStep3.CG = 7;
  debug.step3 = debugStep3;
  return 7;
}

	      // Range global do gráfico (para esta altura)
  const minX = Math.min(...rowsSameHeight.map(r => r.x_ref_left));
  const maxX = Math.max(...rowsSameHeight.map(r => r.x_ref_right));

  // Se estiver à esquerda: mantém erro (como tinhas definido antes)
  if (x < minX) {
    debugStep3.status = "failed";
    debugStep3.reason = `Climb Gradient required higher than 7%`;
    debugStep3.range = { minX, maxX };
    debug.step3 = debugStep3;
    return null;
  }

  // Se estiver à direita: NÃO falha. "Clampa" para o último CG disponível.
  if (x > maxX) {
    // Última linha válida = a que tem o maior x_ref_right
    const lastRow = rowsSameHeight.reduce((best, r) =>
      r.x_ref_right > best.x_ref_right ? r : best
    );

    debugStep3.status = "passed";
    debugStep3.mode = "clampedRight";
    debugStep3.message = `CG lower than ${lastRow.result_CG_required} (using nearest gradient)`;
    debugStep3.range = { minX, maxX };
    debugStep3.rowUsed = lastRow;
    debugStep3.CG_raw = lastRow.result_CG_required;
    debugStep3.CG = Math.round(lastRow.result_CG_required * 10) / 10;
    debug.step3 = debugStep3;

    return debugStep3.CG;
  }
	  
  // 2) Encontrar em que section o X cai
 let row = rowsSameHeight.find(r => x >= r.x_ref_left && x <= r.x_ref_right);

	if (!row) {
	  debugStep3.status = "failed";
	  debugStep3.reason = "X fora do range válido para esta obstacle_height_ft";
	  debugStep3.x = x;
	  debugStep3.validRange = {
		min: rowsSameHeight[0].x_ref_left,
		max: rowsSameHeight[rowsSameHeight.length - 1].x_ref_right
	  };
	  debug.step3 = debugStep3;
	  return null;
	}

  const section = row.section;

    // 3) Obter CG_left = CG(section N), CG_right = CG(section N+1)
  const rowLeft = row; // section N
  const rowRight = rowsSameHeight.find(r => r.section === section + 1);

  // Se não existe section seguinte, então estamos na última section.
  // Se o X está dentro da última section, devolve o CG dessa section.
  // Só dá erro se estiver fora do gráfico (e isso deve ser validado antes).
  if (!rowRight) {
    debugStep3.status = "passed";
    debugStep3.section = section;
    debugStep3.mode = "lastSectionNoInterpolation";
    debugStep3.row = rowLeft;
    debugStep3.CG_raw = rowLeft.result_CG_required;
    debugStep3.CG = Math.round(rowLeft.result_CG_required * 10) / 10;
    debug.step3 = debugStep3;
    return debugStep3.CG;
  }

  const CG_left = rowLeft.result_CG_required;
  const CG_right = rowRight.result_CG_required;

  // 4) Percentagem dentro da section
  const t = (x - rowLeft.x_ref_left) / (rowLeft.x_ref_right - rowLeft.x_ref_left);

  // 5) Interpolação CG
  const CGraw = CG_left - t * (CG_left - CG_right);
	const CG = Math.round(CGraw * 10) / 10;

	debugStep3.status = "passed";
	debugStep3.section = section;
	debugStep3.rowLeft = rowLeft;
	debugStep3.rowRight = rowRight;
	debugStep3.t = t;
	debugStep3.CG_raw = CGraw;
	debugStep3.CG = CG;
	
  debug.step3 = debugStep3;

  return CG;
}

// ================== MAIN API ==================

/**
 * inputs:
 *  - obstacleDistance: distância ao obstáculo
 *  - wind: vento (- tail, + head)
 *  - obstacle_height_ft: altura do obstáculo em ft
 *
 * output:
 *  {
 *    status: "passed" | "failed",
 *    result_CG_required: number | null,
 *    debug: { step1, step2, step3 }
 *  }
 */
export default function Gradient_Required({
  obstacleDistance,
  wind,
  obstacle_height_ft
}) {
  const debug = {};

  // STEP 1
  const x1 = computeXFromDistance(obstacleDistance, debug);
  if (x1 == null) {
    return {
      status: "failed",
      result_CG_required: null,
      debug
    };
  }

  // STEP 2
  const step2Res = computeXWithWind(x1, wind, debug);
  if (!step2Res) {
    return {
      status: "failed",
      result_CG_required: null,
      debug
    };
  }

  const { x: x2, section } = step2Res;

  // STEP 3
	const cg = computeCGFromHeight(x2, obstacle_height_ft, debug);
	if (cg == null) {
	  return {
		status: "failed",
		result_CG_required: null,
		debug
	  };
	}
	// verificar se foi um clamp para CG=7
	if (debug.step3?.status === "clamped" && debug.step3?.CG === 7) {
	  return {
		status: "failed",
		result_CG_required: 7,
		debug
	  };
	}

  return {
    status: "passed",
    result_CG_required: cg,
    debug
  };
}