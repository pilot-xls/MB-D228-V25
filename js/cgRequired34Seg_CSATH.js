// cgRequired34Seg_CSATH.js

//
 const Obstacle_Distance = [
   {"Obstacle_Distance": 0, "x_ref_left": 237, "x_ref_right": 309},
  {"Obstacle_Distance": 100, "x_ref_left": 309, "x_ref_right": 378},
  {"Obstacle_Distance": 200, "x_ref_left": 378, "x_ref_right": 450},
  {"Obstacle_Distance": 300, "x_ref_left": 450, "x_ref_right": 522},
  {"Obstacle_Distance": 400, "x_ref_left": 522, "x_ref_right": 591},
  {"Obstacle_Distance": 500, "x_ref_left": 591, "x_ref_right": 663},
  {"Obstacle_Distance": 600, "x_ref_left": 663, "x_ref_right": 736},
  {"Obstacle_Distance": 700, "x_ref_left": 736, "x_ref_right": 805},
  {"Obstacle_Distance": 800, "x_ref_left": 805, "x_ref_right": 874},
  {"Obstacle_Distance": 900, "x_ref_left": 874, "x_ref_right": 946},
  {"Obstacle_Distance": 1000, "x_ref_left": 946, "x_ref_right": 1018},
  {"Obstacle_Distance": 1100, "x_ref_left": 1018, "x_ref_right": 1087},
  {"Obstacle_Distance": 1200, "x_ref_left": 1087, "x_ref_right": 1159},
  {"Obstacle_Distance": 1300, "x_ref_left": 1159, "x_ref_right": 1231},
  {"Obstacle_Distance": 1400, "x_ref_left": 1231, "x_ref_right": 1300},
  {"Obstacle_Distance": 1500, "x_ref_left": 1300, "x_ref_right": 1369},
  {"Obstacle_Distance": 1600, "x_ref_left": 1369, "x_ref_right": 1441},
  {"Obstacle_Distance": 1700, "x_ref_left": 1441, "x_ref_right": 1513},
  {"Obstacle_Distance": 1800, "x_ref_left": 1513, "x_ref_right": 1582},
  {"Obstacle_Distance": 1900, "x_ref_left": 1582, "x_ref_right": 1651},
  {"Obstacle_Distance": 2000, "x_ref_left": 1651, "x_ref_right": 1723},
  {"Obstacle_Distance": 2100, "x_ref_left": 1723, "x_ref_right": 1795},
  {"Obstacle_Distance": 2200, "x_ref_left": 1795, "x_ref_right": 1864},
  {"Obstacle_Distance": 2300, "x_ref_left": 1864, "x_ref_right": 1936},
  {"Obstacle_Distance": 2400, "x_ref_left": 1936, "x_ref_right": 2008}
 ];
//
 const SlopeTable = [
  {"Slope": 0, "x_ref_left": 237, "x_ref_right": 414},
  {"Slope": 0, "x_ref_left": 414, "x_ref_right": 591},
  {"Slope": 0, "x_ref_left": 591, "x_ref_right": 772},
  {"Slope": 0, "x_ref_left": 772, "x_ref_right": 946},
  {"Slope": 0, "x_ref_left": 946, "x_ref_right": 1123},
  {"Slope": 0, "x_ref_left": 1123, "x_ref_right": 1300},
  {"Slope": 0, "x_ref_left": 1300, "x_ref_right": 1477},
  {"Slope": 0, "x_ref_left": 1477, "x_ref_right": 1651},
  {"Slope": 0, "x_ref_left": 1651, "x_ref_right": 1831},
	{"Slope": 0, "x_ref_left": 1831, "x_ref_right": 2008},
  
  {"Slope": 1, "x_ref_left": 234, "x_ref_right": 405},
  {"Slope": 1, "x_ref_left": 405, "x_ref_right": 576},
  {"Slope": 1, "x_ref_left": 576, "x_ref_right": 757},
  {"Slope": 1, "x_ref_left": 757, "x_ref_right": 931},
  {"Slope": 1, "x_ref_left": 931, "x_ref_right": 1105},
  {"Slope": 1, "x_ref_left": 1105, "x_ref_right": 1282},
  {"Slope": 1, "x_ref_left": 1282, "x_ref_right": 1456},
  {"Slope": 1, "x_ref_left": 1456, "x_ref_right": 1630},
  {"Slope": 1, "x_ref_left": 1630, "x_ref_right": 1807},
  {"Slope": 1, "x_ref_left": 1807, "x_ref_right": 1981},

  {"Slope": 2, "x_ref_left": 237, "x_ref_right": 396},
  {"Slope": 2, "x_ref_left": 396, "x_ref_right": 564},
  {"Slope": 2, "x_ref_left": 564, "x_ref_right": 742},
  {"Slope": 2, "x_ref_left": 742, "x_ref_right": 919},
  {"Slope": 2, "x_ref_left": 919, "x_ref_right": 1087},
  {"Slope": 2, "x_ref_left": 1087, "x_ref_right": 1267},
  {"Slope": 2, "x_ref_left": 1267, "x_ref_right": 1435},
  {"Slope": 2, "x_ref_left": 1435, "x_ref_right": 1615},
  {"Slope": 2, "x_ref_left": 1615, "x_ref_right": 1786},
  {"Slope": 2, "x_ref_left": 1786, "x_ref_right": 1957}
];
//
 const WindTable = [
  {"wind": 0, "section": 1, "x_ref_left": 237, "x_ref_right": 416},
  {"wind": 0, "section": 2, "x_ref_left": 416, "x_ref_right": 593},
  {"wind": 0, "section": 3, "x_ref_left": 593, "x_ref_right": 770},
  {"wind": 0, "section": 4, "x_ref_left": 770, "x_ref_right": 944},
  {"wind": 0, "section": 5, "x_ref_left": 944, "x_ref_right": 1124},
  {"wind": 0, "section": 6, "x_ref_left": 1124, "x_ref_right": 1298},
  {"wind": 0, "section": 7, "x_ref_left": 1298, "x_ref_right": 1478},
  {"wind": 0, "section": 8, "x_ref_left": 1478, "x_ref_right": 1652},
  {"wind": 0, "section": 9, "x_ref_left": 1652, "x_ref_right": 1834},
  {"wind": 0, "section": 10, "x_ref_left": 1834, "x_ref_right": 2003},

  {"wind": 10, "section": 1, "x_ref_left": 237, "x_ref_right": 427},
  {"wind": 10, "section": 2, "x_ref_left": 427, "x_ref_right": 612},
  {"wind": 10, "section": 3, "x_ref_left": 612, "x_ref_right": 796},
  {"wind": 10, "section": 4, "x_ref_left": 796, "x_ref_right": 978},
  {"wind": 10, "section": 5, "x_ref_left": 978, "x_ref_right": 1165},
  {"wind": 10, "section": 6, "x_ref_left": 1165, "x_ref_right": 1353},
  {"wind": 10, "section": 7, "x_ref_left": 1353, "x_ref_right": 1540},
  {"wind": 10, "section": 8, "x_ref_left": 1540, "x_ref_right": 1725},
  {"wind": 10, "section": 9, "x_ref_left": 1725, "x_ref_right": 1914},

  {"wind": 20, "section": 1, "x_ref_left": 237, "x_ref_right": 435},
  {"wind": 20, "section": 2, "x_ref_left": 435, "x_ref_right": 630},
  {"wind": 20, "section": 3, "x_ref_left": 630, "x_ref_right": 822},
  {"wind": 20, "section": 4, "x_ref_left": 822, "x_ref_right": 1017},
  {"wind": 20, "section": 5, "x_ref_left": 1017, "x_ref_right": 1210},
  {"wind": 20, "section": 6, "x_ref_left": 1210, "x_ref_right": 1405},
  {"wind": 20, "section": 7, "x_ref_left": 1405, "x_ref_right": 1602},
  {"wind": 20, "section": 8, "x_ref_left": 1602, "x_ref_right": 1795},
  {"wind": 20, "section": 9, "x_ref_left": 1795, "x_ref_right": 2003},

  {"wind": 30, "section": 1, "x_ref_left": 237, "x_ref_right": 442},
  {"wind": 30, "section": 2, "x_ref_left": 442, "x_ref_right": 643},
  {"wind": 30, "section": 3, "x_ref_left": 643, "x_ref_right": 853},
  {"wind": 30, "section": 4, "x_ref_left": 853, "x_ref_right": 1054},
  {"wind": 30, "section": 5, "x_ref_left": 1054, "x_ref_right": 1254},
  {"wind": 30, "section": 6, "x_ref_left": 1254, "x_ref_right": 1462},
  {"wind": 30, "section": 7, "x_ref_left": 1462, "x_ref_right": 1665},
  {"wind": 30, "section": 8, "x_ref_left": 1665, "x_ref_right": 1865},

  {"wind": 40, "section": 1, "x_ref_left": 237, "x_ref_right": 450},
  {"wind": 40, "section": 2, "x_ref_left": 450, "x_ref_right": 661},
  {"wind": 40, "section": 3, "x_ref_left": 661, "x_ref_right": 879},
  {"wind": 40, "section": 4, "x_ref_left": 879, "x_ref_right": 1087},
  {"wind": 40, "section": 5, "x_ref_left": 1087, "x_ref_right": 1301},
  {"wind": 40, "section": 6, "x_ref_left": 1301, "x_ref_right": 1511},
  {"wind": 40, "section": 7, "x_ref_left": 1511, "x_ref_right": 1727},
  {"wind": 40, "section": 8, "x_ref_left": 1727, "x_ref_right": 1938},

  {"wind": 50, "section": 1, "x_ref_left": 237, "x_ref_right": 458},
  {"wind": 50, "section": 2, "x_ref_left": 458, "x_ref_right": 682},
  {"wind": 50, "section": 3, "x_ref_left": 682, "x_ref_right": 908},
  {"wind": 50, "section": 4, "x_ref_left": 908, "x_ref_right": 1121},
  {"wind": 50, "section": 5, "x_ref_left": 1121, "x_ref_right": 1340},
  {"wind": 50, "section": 6, "x_ref_left": 1340, "x_ref_right": 1566},
  {"wind": 50, "section": 7, "x_ref_left": 1566, "x_ref_right": 1795},
  {"wind": 50, "section": 8, "x_ref_left": 1795, "x_ref_right": 2005},

  {"wind": -10, "section": 1, "x_ref_left": 237, "x_ref_right": 383},
  {"wind": -10, "section": 2, "x_ref_left": 383, "x_ref_right": 533},
  {"wind": -10, "section": 3, "x_ref_left": 533, "x_ref_right": 687},
  {"wind": -10, "section": 4, "x_ref_left": 687, "x_ref_right": 830},
  {"wind": -10, "section": 5, "x_ref_left": 830, "x_ref_right": 986},
  {"wind": -10, "section": 6, "x_ref_left": 986, "x_ref_right": 1142},
  {"wind": -10, "section": 7, "x_ref_left": 1142, "x_ref_right": 1272},
  {"wind": -10, "section": 8, "x_ref_left": 1272, "x_ref_right": 1431},
  {"wind": -10, "section": 9, "x_ref_left": 1431, "x_ref_right": 1579},
  {"wind": -10, "section": 10, "x_ref_left": 1579, "x_ref_right": 1738},

  {"wind": -20, "section": 1, "x_ref_left": 232, "x_ref_right": 349},
  {"wind": -20, "section": 2, "x_ref_left": 349, "x_ref_right": 468},
  {"wind": -20, "section": 3, "x_ref_left": 468, "x_ref_right": 606},
  {"wind": -20, "section": 4, "x_ref_left": 606, "x_ref_right": 708},
  {"wind": -20, "section": 5, "x_ref_left": 708, "x_ref_right": 846},
  {"wind": -20, "section": 6, "x_ref_left": 846, "x_ref_right": 970},
  {"wind": -20, "section": 7, "x_ref_left": 970, "x_ref_right": 1080},
  {"wind": -20, "section": 8, "x_ref_left": 1080, "x_ref_right": 1202},
  {"wind": -20, "section": 9, "x_ref_left": 1202, "x_ref_right": 1342},
  {"wind": -20, "section": 10, "x_ref_left": 1342, "x_ref_right": 1483}
];
//
const Obstacle_HeightTable = [
  {"Obstacle_Height": 100, "section": 1, "x_ref_left": 271, "x_ref_right": 281, "Result": 7},
  {"Obstacle_Height": 100, "section": 2, "x_ref_left": 281, "x_ref_right": 292, "Result": 5},
  {"Obstacle_Height": 100, "section": 3, "x_ref_left": 292, "x_ref_right": 310, "Result": 4},
  {"Obstacle_Height": 100, "section": 4, "x_ref_left": 310, "x_ref_right": 323, "Result": 3},
  {"Obstacle_Height": 100, "section": 5, "x_ref_left": 323, "x_ref_right": 346, "Result": 2.5},
  {"Obstacle_Height": 100, "section": 6, "x_ref_left": 346, "x_ref_right": 354, "Result": 2},
  {"Obstacle_Height": 100, "section": 7, "x_ref_left": 354, "x_ref_right": 367, "Result": 1.8},
  {"Obstacle_Height": 100, "section": 8, "x_ref_left": 367, "x_ref_right": 367, "Result": 1.6},

  {"Obstacle_Height": 200, "section": 1, "x_ref_left": 305, "x_ref_right": 318, "Result": 7},
  {"Obstacle_Height": 200, "section": 2, "x_ref_left": 318, "x_ref_right": 328, "Result": 6},
  {"Obstacle_Height": 200, "section": 3, "x_ref_left": 328, "x_ref_right": 351, "Result": 5},
  {"Obstacle_Height": 200, "section": 4, "x_ref_left": 351, "x_ref_right": 383, "Result": 4},
  {"Obstacle_Height": 200, "section": 5, "x_ref_left": 383, "x_ref_right": 409, "Result": 3},
  {"Obstacle_Height": 200, "section": 6, "x_ref_left": 409, "x_ref_right": 453, "Result": 2.5},
  {"Obstacle_Height": 200, "section": 7, "x_ref_left": 453, "x_ref_right": 474, "Result": 2},
  {"Obstacle_Height": 200, "section": 8, "x_ref_left": 474, "x_ref_right": 502, "Result": 1.8},
  {"Obstacle_Height": 200, "section": 9, "x_ref_left": 502, "x_ref_right": 502, "Result": 1.6},

  {"Obstacle_Height": 300, "section": 1, "x_ref_left": 344, "x_ref_right": 359, "Result": 7},
  {"Obstacle_Height": 300, "section": 2, "x_ref_left": 359, "x_ref_right": 375, "Result": 6},
  {"Obstacle_Height": 300, "section": 3, "x_ref_left": 375, "x_ref_right": 406, "Result": 5},
  {"Obstacle_Height": 300, "section": 4, "x_ref_left": 406, "x_ref_right": 458, "Result": 4},
  {"Obstacle_Height": 300, "section": 5, "x_ref_left": 458, "x_ref_right": 497, "Result": 3},
  {"Obstacle_Height": 300, "section": 6, "x_ref_left": 497, "x_ref_right": 560, "Result": 2.5},
  {"Obstacle_Height": 300, "section": 7, "x_ref_left": 560, "x_ref_right": 596, "Result": 2},
  {"Obstacle_Height": 300, "section": 8, "x_ref_left": 596, "x_ref_right": 638, "Result": 1.8},
  {"Obstacle_Height": 300, "section": 9, "x_ref_left": 638, "x_ref_right": 638, "Result": 1.6},

  {"Obstacle_Height": 400, "section": 1, "x_ref_left": 377, "x_ref_right": 401, "Result": 7},
  {"Obstacle_Height": 400, "section": 2, "x_ref_left": 401, "x_ref_right": 419, "Result": 6},
  {"Obstacle_Height": 400, "section": 3, "x_ref_left": 419, "x_ref_right": 466, "Result": 5},
  {"Obstacle_Height": 400, "section": 4, "x_ref_left": 466, "x_ref_right": 531, "Result": 4},
  {"Obstacle_Height": 400, "section": 5, "x_ref_left": 531, "x_ref_right": 588, "Result": 3},
  {"Obstacle_Height": 400, "section": 6, "x_ref_left": 588, "x_ref_right": 666, "Result": 2.5},
  {"Obstacle_Height": 400, "section": 7, "x_ref_left": 666, "x_ref_right": 721, "Result": 2},
  {"Obstacle_Height": 400, "section": 8, "x_ref_left": 721, "x_ref_right": 773, "Result": 1.8},
  {"Obstacle_Height": 400, "section": 9, "x_ref_left": 773, "x_ref_right": 773, "Result": 1.6},

  {"Obstacle_Height": 500, "section": 1, "x_ref_left": 461, "x_ref_right": 489, "Result": 7},
  {"Obstacle_Height": 500, "section": 2, "x_ref_left": 489, "x_ref_right": 520, "Result": 6},
  {"Obstacle_Height": 500, "section": 3, "x_ref_left": 520, "x_ref_right": 554, "Result": 5},
  {"Obstacle_Height": 500, "section": 4, "x_ref_left": 554, "x_ref_right": 588, "Result": 4.5},
  {"Obstacle_Height": 500, "section": 5, "x_ref_left": 588, "x_ref_right": 643, "Result": 4},
  {"Obstacle_Height": 500, "section": 6, "x_ref_left": 643, "x_ref_right": 697, "Result": 3.5},
  {"Obstacle_Height": 500, "section": 7, "x_ref_left": 697, "x_ref_right": 807, "Result": 3},
  {"Obstacle_Height": 500, "section": 8, "x_ref_left": 807, "x_ref_right": 957, "Result": 2.5},
  {"Obstacle_Height": 500, "section": 9, "x_ref_left": 957, "x_ref_right": 1054, "Result": 2},
  {"Obstacle_Height": 500, "section": 10, "x_ref_left": 1054, "x_ref_right": 1158, "Result": 1.8},
  {"Obstacle_Height": 500, "section": 11, "x_ref_left": 1158, "x_ref_right": 1158, "Result": 1.6},

  {"Obstacle_Height": 600, "section": 1, "x_ref_left": 500, "x_ref_right": 533, "Result": 7},
  {"Obstacle_Height": 600, "section": 2, "x_ref_left": 533, "x_ref_right": 573, "Result": 6},
  {"Obstacle_Height": 600, "section": 3, "x_ref_left": 573, "x_ref_right": 612, "Result": 5},
  {"Obstacle_Height": 600, "section": 4, "x_ref_left": 612, "x_ref_right": 648, "Result": 4.5},
  {"Obstacle_Height": 600, "section": 5, "x_ref_left": 648, "x_ref_right": 713, "Result": 4},
  {"Obstacle_Height": 600, "section": 6, "x_ref_left": 713, "x_ref_right": 781, "Result": 3.5},
  {"Obstacle_Height": 600, "section": 7, "x_ref_left": 781, "x_ref_right": 918, "Result": 3},
  {"Obstacle_Height": 600, "section": 8, "x_ref_left": 918, "x_ref_right": 1124, "Result": 2.5},
  {"Obstacle_Height": 600, "section": 9, "x_ref_left": 1124, "x_ref_right": 1246, "Result": 2},
  {"Obstacle_Height": 600, "section": 10, "x_ref_left": 1246, "x_ref_right": 1397, "Result": 1.8},
  {"Obstacle_Height": 600, "section": 11, "x_ref_left": 1397, "x_ref_right": 1397, "Result": 1.6},

  {"Obstacle_Height": 700, "section": 1, "x_ref_left": 539, "x_ref_right": 578, "Result": 7},
  {"Obstacle_Height": 700, "section": 2, "x_ref_left": 578, "x_ref_right": 622, "Result": 6},
  {"Obstacle_Height": 700, "section": 3, "x_ref_left": 622, "x_ref_right": 666, "Result": 5},
  {"Obstacle_Height": 700, "section": 4, "x_ref_left": 666, "x_ref_right": 713, "Result": 4.5},
  {"Obstacle_Height": 700, "section": 5, "x_ref_left": 713, "x_ref_right": 783, "Result": 4},
  {"Obstacle_Height": 700, "section": 6, "x_ref_left": 783, "x_ref_right": 861, "Result": 3.5},
  {"Obstacle_Height": 700, "section": 7, "x_ref_left": 861, "x_ref_right": 1038, "Result": 3},
  {"Obstacle_Height": 700, "section": 8, "x_ref_left": 1038, "x_ref_right": 1293, "Result": 2.5},
  {"Obstacle_Height": 700, "section": 9, "x_ref_left": 1293, "x_ref_right": 1444, "Result": 2},
  {"Obstacle_Height": 700, "section": 10, "x_ref_left": 1444, "x_ref_right": 1641, "Result": 1.8},
  {"Obstacle_Height": 700, "section": 11, "x_ref_left": 1641, "x_ref_right": 1641, "Result": 1.6},

  {"Obstacle_Height": 800, "section": 1, "x_ref_left": 575, "x_ref_right": 622, "Result": 7},
  {"Obstacle_Height": 800, "section": 2, "x_ref_left": 622, "x_ref_right": 671, "Result": 6},
  {"Obstacle_Height": 800, "section": 3, "x_ref_left": 671, "x_ref_right": 721, "Result": 5},
  {"Obstacle_Height": 800, "section": 4, "x_ref_left": 721, "x_ref_right": 778, "Result": 4.5},
  {"Obstacle_Height": 800, "section": 5, "x_ref_left": 778, "x_ref_right": 856, "Result": 4},
  {"Obstacle_Height": 800, "section": 6, "x_ref_left": 856, "x_ref_right": 947, "Result": 3.5},
  {"Obstacle_Height": 800, "section": 7, "x_ref_left": 947, "x_ref_right": 1145, "Result": 3},
  {"Obstacle_Height": 800, "section": 8, "x_ref_left": 1145, "x_ref_right": 1457, "Result": 2.5},
  {"Obstacle_Height": 800, "section": 9, "x_ref_left": 1457, "x_ref_right": 1634, "Result": 2},
  {"Obstacle_Height": 800, "section": 10, "x_ref_left": 1634, "x_ref_right": 1881, "Result": 1.8},
  {"Obstacle_Height": 800, "section": 11, "x_ref_left": 1881, "x_ref_right": 1881, "Result": 1.6},

  {"Obstacle_Height": 900, "section": 1, "x_ref_left": 617, "x_ref_right": 666, "Result": 7},
  {"Obstacle_Height": 900, "section": 2, "x_ref_left": 666, "x_ref_right": 723, "Result": 6},
  {"Obstacle_Height": 900, "section": 3, "x_ref_left": 723, "x_ref_right": 781, "Result": 5},
  {"Obstacle_Height": 900, "section": 4, "x_ref_left": 781, "x_ref_right": 843, "Result": 4.5},
  {"Obstacle_Height": 900, "section": 5, "x_ref_left": 843, "x_ref_right": 924, "Result": 4},
  {"Obstacle_Height": 900, "section": 6, "x_ref_left": 924, "x_ref_right": 1030, "Result": 3.5},
  {"Obstacle_Height": 900, "section": 7, "x_ref_left": 1030, "x_ref_right": 1264, "Result": 3},
  {"Obstacle_Height": 900, "section": 8, "x_ref_left": 1264, "x_ref_right": 1621, "Result": 2.5},
  {"Obstacle_Height": 900, "section": 9, "x_ref_left": 1621, "x_ref_right": 1821, "Result": 2},
  {"Obstacle_Height": 900, "section": 10, "x_ref_left": 1821, "x_ref_right": 1821, "Result": 1.8},

  {"Obstacle_Height": 1000, "section": 1, "x_ref_left": 651, "x_ref_right": 710, "Result": 7},
  {"Obstacle_Height": 1000, "section": 2, "x_ref_left": 710, "x_ref_right": 775, "Result": 6},
  {"Obstacle_Height": 1000, "section": 3, "x_ref_left": 775, "x_ref_right": 838, "Result": 5},
  {"Obstacle_Height": 1000, "section": 4, "x_ref_left": 838, "x_ref_right": 908, "Result": 4.5},
  {"Obstacle_Height": 1000, "section": 5, "x_ref_left": 908, "x_ref_right": 991, "Result": 4},
  {"Obstacle_Height": 1000, "section": 6, "x_ref_left": 991, "x_ref_right": 1113, "Result": 3.5},
  {"Obstacle_Height": 1000, "section": 7, "x_ref_left": 1113, "x_ref_right": 1373, "Result": 3},
  {"Obstacle_Height": 1000, "section": 8, "x_ref_left": 1373, "x_ref_right": 1790, "Result": 2.5},
  {"Obstacle_Height": 1000, "section": 9, "x_ref_left": 1790, "x_ref_right": 1790, "Result": 2},

  {"Obstacle_Height": 1100, "section": 1, "x_ref_left": 690, "x_ref_right": 755, "Result": 7},
  {"Obstacle_Height": 1100, "section": 2, "x_ref_left": 755, "x_ref_right": 825, "Result": 6},
  {"Obstacle_Height": 1100, "section": 3, "x_ref_left": 825, "x_ref_right": 892, "Result": 5},
  {"Obstacle_Height": 1100, "section": 4, "x_ref_left": 892, "x_ref_right": 968, "Result": 4.5},
  {"Obstacle_Height": 1100, "section": 5, "x_ref_left": 968, "x_ref_right": 1067, "Result": 4},
  {"Obstacle_Height": 1100, "section": 6, "x_ref_left": 1067, "x_ref_right": 1197, "Result": 3.5},
  {"Obstacle_Height": 1100, "section": 7, "x_ref_left": 1197, "x_ref_right": 1485, "Result": 3},
  {"Obstacle_Height": 1100, "section": 8, "x_ref_left": 1485, "x_ref_right": 1956, "Result": 2.5},
  {"Obstacle_Height": 1100, "section": 9, "x_ref_left": 1956, "x_ref_right": 1956, "Result": 2},

  {"Obstacle_Height": 1200, "section": 1, "x_ref_left": 729, "x_ref_right": 801, "Result": 7},
  {"Obstacle_Height": 1200, "section": 2, "x_ref_left": 801, "x_ref_right": 877, "Result": 6},
  {"Obstacle_Height": 1200, "section": 3, "x_ref_left": 877, "x_ref_right": 952, "Result": 5},
  {"Obstacle_Height": 1200, "section": 4, "x_ref_left": 952, "x_ref_right": 1033, "Result": 4.5},
  {"Obstacle_Height": 1200, "section": 5, "x_ref_left": 1033, "x_ref_right": 1137, "Result": 4},
  {"Obstacle_Height": 1200, "section": 6, "x_ref_left": 1137, "x_ref_right": 1277, "Result": 3.5},
  {"Obstacle_Height": 1200, "section": 7, "x_ref_left": 1277, "x_ref_right": 1602, "Result": 3},
  {"Obstacle_Height": 1200, "section": 8, "x_ref_left": 1602, "x_ref_right": 1602, "Result": 2.5},

  {"Obstacle_Height": 1300, "section": 1, "x_ref_left": 768, "x_ref_right": 843, "Result": 7},
  {"Obstacle_Height": 1300, "section": 2, "x_ref_left": 843, "x_ref_right": 926, "Result": 6},
  {"Obstacle_Height": 1300, "section": 3, "x_ref_left": 926, "x_ref_right": 1004, "Result": 5},
  {"Obstacle_Height": 1300, "section": 4, "x_ref_left": 1004, "x_ref_right": 1098, "Result": 4.5},
  {"Obstacle_Height": 1300, "section": 5, "x_ref_left": 1098, "x_ref_right": 1210, "Result": 4},
  {"Obstacle_Height": 1300, "section": 6, "x_ref_left": 1210, "x_ref_right": 1360, "Result": 3.5},
  {"Obstacle_Height": 1300, "section": 7, "x_ref_left": 1360, "x_ref_right": 1714, "Result": 3},
  {"Obstacle_Height": 1300, "section": 8, "x_ref_left": 1714, "x_ref_right": 1714, "Result": 2.5},

  {"Obstacle_Height": 1400, "section": 1, "x_ref_left": 807, "x_ref_right": 887, "Result": 7},
  {"Obstacle_Height": 1400, "section": 2, "x_ref_left": 887, "x_ref_right": 976, "Result": 6},
  {"Obstacle_Height": 1400, "section": 3, "x_ref_left": 976, "x_ref_right": 1064, "Result": 5},
  {"Obstacle_Height": 1400, "section": 4, "x_ref_left": 1064, "x_ref_right": 1160, "Result": 4.5},
  {"Obstacle_Height": 1400, "section": 5, "x_ref_left": 1160, "x_ref_right": 1277, "Result": 4},
  {"Obstacle_Height": 1400, "section": 6, "x_ref_left": 1277, "x_ref_right": 1444, "Result": 3.5},
  {"Obstacle_Height": 1400, "section": 7, "x_ref_left": 1444, "x_ref_right": 1826, "Result": 3},
  {"Obstacle_Height": 1400, "section": 8, "x_ref_left": 1826, "x_ref_right": 1826, "Result": 2.5},

  {"Obstacle_Height": 1500, "section": 1, "x_ref_left": 843, "x_ref_right": 931, "Result": 7},
  {"Obstacle_Height": 1500, "section": 2, "x_ref_left": 931, "x_ref_right": 1028, "Result": 6},
  {"Obstacle_Height": 1500, "section": 3, "x_ref_left": 1028, "x_ref_right": 1121, "Result": 5},
  {"Obstacle_Height": 1500, "section": 4, "x_ref_left": 1121, "x_ref_right": 1220, "Result": 4.5},
  {"Obstacle_Height": 1500, "section": 5, "x_ref_left": 1220, "x_ref_right": 1350, "Result": 4},
  {"Obstacle_Height": 1500, "section": 6, "x_ref_left": 1350, "x_ref_right": 1524, "Result": 3.5},
  {"Obstacle_Height": 1500, "section": 7, "x_ref_left": 1524, "x_ref_right": 1943, "Result": 3},
  {"Obstacle_Height": 1500, "section": 8, "x_ref_left": 1943, "x_ref_right": 1943, "Result": 2.5},

  {"Obstacle_Height": 1600, "section": 1, "x_ref_left": 882, "x_ref_right": 978, "Result": 7},
  {"Obstacle_Height": 1600, "section": 2, "x_ref_left": 978, "x_ref_right": 1077, "Result": 6},
  {"Obstacle_Height": 1600, "section": 3, "x_ref_left": 1077, "x_ref_right": 1173, "Result": 5},
  {"Obstacle_Height": 1600, "section": 4, "x_ref_left": 1173, "x_ref_right": 1288, "Result": 4.5},
  {"Obstacle_Height": 1600, "section": 5, "x_ref_left": 1288, "x_ref_right": 1418, "Result": 4},
  {"Obstacle_Height": 1600, "section": 6, "x_ref_left": 1418, "x_ref_right": 1610, "Result": 3.5},
  {"Obstacle_Height": 1600, "section": 7, "x_ref_left": 1610, "x_ref_right": 1610, "Result": 3}
];


// ================== HELPERS ==================

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function clamp01(t) {
  return Math.max(0, Math.min(1, t));
}

function findBoundingByValue(array, getKey, value) {
  let lower = null;
  let upper = null;

  for (let i = 0; i < array.length; i++) {
    const item = array[i];
    const k = getKey(item);

    if (k === value) return { lower: item, upper: item, exact: true };
    if (k < value) {
      if (!lower || k > getKey(lower)) lower = item;
    }
    if (k > value) {
      if (!upper || k < getKey(upper)) upper = item;
    }
  }

  return { lower, upper, exact: false };
}

function findSectionByX(rows, x) {
  return rows.find(r => x >= r.x_ref_left && x <= r.x_ref_right) || null;
}


// ================== STEP 1 ==================
// distance -> x (Obstacle_Distance)
function computeXFromDistance(distance, debug) {
  const minD = Obstacle_Distance[0].Obstacle_Distance;
  const maxD = Obstacle_Distance[Obstacle_Distance.length - 1].Obstacle_Distance;

  if (distance < minD || distance > maxD) {
    debug.step1 = {
      status: "failed",
      reason: `distance (${distance}) fora do range [${minD}, ${maxD}]`
    };
    return null;
  }

  const { lower, upper, exact } = findBoundingByValue(
    Obstacle_Distance,
    r => r.Obstacle_Distance,
    distance
  );

  if (exact && lower) {
    const x = lower.x_ref_left;
    debug.step1 = { status: "passed", mode: "exact", x };
    return x;
  }

  const a = lower || upper;
  const b = upper || lower;

  const t = clamp01((distance - a.Obstacle_Distance) / (b.Obstacle_Distance - a.Obstacle_Distance));
  const x = lerp(a.x_ref_left, b.x_ref_left, t);

  debug.step1 = { status: "passed", mode: "interpolated", x, t };
  return x;
}


// ================== STEP 2 ==================
// x(step1) + slope -> novo x (SlopeTable)
function buildSlopeMap() {
  const map = new Map();
  for (const row of SlopeTable) {
    if (!map.has(row.Slope)) map.set(row.Slope, []);
    map.get(row.Slope).push(row);
  }

  // cria section sem alterar ordem
  for (const arr of map.values()) {
    arr.forEach((r, idx) => r._sectionIndex = idx + 1);
  }

  return map;
}

function computeXWithSlope(xFromStep1, runway_slope, debug) {
  const debugStep2 = { inputSlope: runway_slope };

  const slopeMap = buildSlopeMap();
  const slopeValues = Array.from(slopeMap.keys()).sort((a, b) => a - b);

  const minSlope = slopeValues[0];
  const maxSlope = slopeValues[slopeValues.length - 1];

  if (runway_slope < minSlope || runway_slope > maxSlope) {
    debugStep2.status = "failed";
    debugStep2.reason = "slope fora do range";
    debug.step2 = debugStep2;
    return null;
  }

  const slope0Rows = slopeMap.get(0);
  const sectionRow0 = findSectionByX(slope0Rows, xFromStep1);

  if (!sectionRow0) {
    debugStep2.status = "failed";
    debugStep2.reason = "x não está em slope 0";
    debug.step2 = debugStep2;
    return null;
  }

  const sectionIndex = sectionRow0._sectionIndex;
  const tSection = clamp01(
    (xFromStep1 - sectionRow0.x_ref_left) /
    (sectionRow0.x_ref_right - sectionRow0.x_ref_left)
  );

  const { lower, upper, exact } = findBoundingByValue(
    slopeValues,
    v => v,
    runway_slope
  );

  let xNew;

  if (exact && slopeMap.has(lower)) {
    const row = slopeMap.get(lower).find(r => r._sectionIndex === sectionIndex);
    if (!row) return null;
    xNew = lerp(row.x_ref_left, row.x_ref_right, tSection);
  } else {
    const sLower = lower;
    const sUpper = upper;

    const rowLower = slopeMap.get(sLower).find(r => r._sectionIndex === sectionIndex);
    const rowUpper = slopeMap.get(sUpper).find(r => r._sectionIndex === sectionIndex);

    if (!rowLower || !rowUpper) return null;

    const ts = clamp01((runway_slope - sLower) / (sUpper - sLower));

    const xA = lerp(rowLower.x_ref_left, rowLower.x_ref_right, tSection);
    const xB = lerp(rowUpper.x_ref_left, rowUpper.x_ref_right, tSection);

    xNew = lerp(xA, xB, ts);
  }

  debugStep2.status = "passed";
  debugStep2.xNew = xNew;
  debugStep2.sectionIndex = sectionIndex;
  debug.step2 = debugStep2;

  return { x: xNew, sectionIndex };
}


// ================== STEP 3 ==================
// x(step2) + wind -> novo x (WindTable)
function computeXWithWind(xFromStep2, windInput, debug) {
  const debugStep3 = { inputWind: windInput };

  const windValues = Array.from(new Set(WindTable.map(r => r.wind))).sort((a, b) => a - b);
  const minWind = windValues[0];
  const maxWind = windValues[windValues.length - 1];

  if (windInput < minWind || windInput > maxWind) {
    debugStep3.status = "failed";
    debugStep3.reason = "wind fora do range";
    debug.step3 = debugStep3;
    return null;
  }

  const wind0Rows = WindTable.filter(w => w.wind === 0);
  const sectionRow0 = findSectionByX(wind0Rows, xFromStep2);

  if (!sectionRow0) {
    debugStep3.status = "failed";
    debugStep3.reason = "x não está em wind 0";
    debug.step3 = debugStep3;
    return null;
  }

  const section = sectionRow0.section;
  const tSection = clamp01(
    (xFromStep2 - sectionRow0.x_ref_left) /
    (sectionRow0.x_ref_right - sectionRow0.x_ref_left)
  );

  const windRowsSameSection = WindTable.filter(w => w.section === section);

  const { lower, upper, exact } = findBoundingByValue(
    windRowsSameSection,
    r => r.wind,
    windInput
  );

  let xNew;

  if (exact && lower) {
    xNew = lerp(lower.x_ref_left, lower.x_ref_right, tSection);
  } else {
    const a = lower || upper;
    const b = upper || lower;

    const tw = clamp01((windInput - a.wind) / (b.wind - a.wind));

    const xA = lerp(a.x_ref_left, a.x_ref_right, tSection);
    const xB = lerp(b.x_ref_left, b.x_ref_right, tSection);

    xNew = lerp(xA, xB, tw);
  }

  debugStep3.status = "passed";
  debugStep3.xNew = xNew;
  debug.step3 = debugStep3;

  return xNew;
}


// ================== STEP 4 (com interpolação de altura) ==================
// x(step3) + obstacle_height -> CG_required
function computeCGFromHeight(x, obstacle_height, debug) {
  // Cria objecto de debug para o step4
  const debugStep4 = { inputObstacleHeight: obstacle_height };

  // Constrói lista de alturas disponíveis (sem duplicados)
  const heights = Array.from(new Set(
    Obstacle_HeightTable.map(r => r.Obstacle_Height) // Extrai todas as alturas da tabela
  )).sort((a, b) => a - b); // Ordena alturas do menor para o maior

  // Valida se a altura pedida está dentro do range suportado
  const minH = heights[0]; // Guarda a menor altura disponível
  const maxH = heights[heights.length - 1]; // Guarda a maior altura disponível
  if (obstacle_height < minH || obstacle_height > maxH) { // Se estiver fora do range
    debugStep4.status = "failed"; // Marca falha
    debugStep4.reason = `altura (${obstacle_height}) fora do range [${minH}, ${maxH}]`; // Explica
    debug.step4 = debugStep4; // Escreve no debug global
    return null; // Termina
  }

  // Função interna: calcula CG para UMA altura que exista na tabela (sem interpolar altura)
  function computeCGForExactHeight(exactHeight) {
    // Filtra as linhas da tabela que correspondem à altura exacta
    const rows = Obstacle_HeightTable
      .filter(r => r.Obstacle_Height === exactHeight) // Só linhas dessa altura
      .slice() // Copia para não mexer no original
      .sort((a, b) => a.section - b.section); // Garante ordem por secção

    // Se não existirem linhas para essa altura, não dá para calcular
    if (rows.length === 0) return null; // Falha interna

    // Calcula limites de x cobertos por esta altura
    const minX = Math.min(...rows.map(r => r.x_ref_left)); // Menor x esquerdo
    const maxX = Math.max(...rows.map(r => r.x_ref_right)); // Maior x direito

    // Se x estiver à esquerda do range, aplica a tua regra "CG > 7%"
    if (x < minX) return { status: "failed", reason: "CG > 7%" }; // Falha conforme regra

    // Se x estiver à direita do range, faz clamp no último resultado
	if (x > maxX) {
	  // Escolhe o maior x_ref_right; em empate, fica com o último encontrado (>=)
	  const last = rows.reduce(
		(best, r) => (r.x_ref_right >= best.x_ref_right ? r : best),
		rows[0] // Inicializa com o primeiro elemento
	  );

	  const CG = Math.round(last.Result * 10) / 10; // Arredonda a 1 casa decimal

	  // DEVOLVE SEMPRE OBJECTO (não número)
	  return { status: "passed", mode: "clampedRight", CG };
	}

    // Encontra a linha (secção) onde o x cai
    const row = rows.find(r => x >= r.x_ref_left && x <= r.x_ref_right); // Procura intervalo
    if (!row) return { status: "failed", reason: "x fora de secções" }; // Segurança

    // Tenta obter a próxima secção para interpolar no eixo x (tua lógica original)
    const next = rows.find(r => r.section === row.section + 1); // Próxima secção
    if (!next) { // Se não houver próxima secção
      const CG = Math.round(row.Result * 10) / 10; // Usa o próprio resultado
      return { status: "passed", mode: "noNext", CG }; // Devolve
    }

    // Calcula t dentro da secção no eixo x
    const t = (x - row.x_ref_left) / (row.x_ref_right - row.x_ref_left); // Percentagem dentro do intervalo
    const CGraw = row.Result - t * (row.Result - next.Result); // Interpola entre resultados
    const CG = Math.round(CGraw * 10) / 10; // Arredonda a 1 casa decimal

    // Devolve CG calculado para esta altura exacta
    return { status: "passed", mode: "xInterpolated", CG }; // Resultado final
  }

  // Usa o teu helper para encontrar a altura inferior e superior (bounding)
  const bounds = findBoundingByValue(heights, h => h, obstacle_height); // Procura lower/upper
  const lowerH = bounds.lower; // Altura inferior
  const upperH = bounds.upper; // Altura superior

  // Caso exacto: altura existe e lower==upper
  if (bounds.exact && lowerH != null) { // Se for uma altura exacta
    const res = computeCGForExactHeight(lowerH); // Calcula CG nessa altura
    if (!res || res.status !== "passed") { // Se falhar (ex.: CG > 7%)
      debugStep4.status = "failed"; // Marca falha
      debugStep4.reason = res?.reason || "falha no cálculo para altura exacta"; // Motivo
      debug.step4 = debugStep4; // Escreve debug
      return null; // Termina
    }
    debugStep4.status = "passed"; // Marca sucesso
    debugStep4.mode = "exactHeight"; // Indica modo exacto
    debugStep4.heightUsed = lowerH; // Indica altura usada
    debugStep4.CG = res.CG; // Guarda CG
    debug.step4 = debugStep4; // Escreve debug
    return res.CG; // Devolve CG
  }

  // Caso interpolado: calcula CG nas duas alturas e interpola
  const resL = computeCGForExactHeight(lowerH); // Calcula CG na altura inferior
  const resU = computeCGForExactHeight(upperH); // Calcula CG na altura superior

  // Se qualquer um falhar (ex.: CG > 7%), propaga falha
  if (!resL || resL.status !== "passed" || !resU || resU.status !== "passed") { // Se não der para interpolar
    debugStep4.status = "failed"; // Marca falha
    debugStep4.reason = resL?.reason || resU?.reason || "falha no cálculo para interpolação"; // Motivo
    debug.step4 = debugStep4; // Escreve debug
    return null; // Termina
  }

  // Calcula factor de interpolação em altura
  const th = clamp01((obstacle_height - lowerH) / (upperH - lowerH)); // Percentagem entre lower e upper

  // Interpola o CG entre as duas alturas
  const CGraw = lerp(resL.CG, resU.CG, th); // Interpolação linear em altura
  const CG = Math.round(CGraw * 10) / 10; // Arredonda a 1 casa decimal

  // Escreve debug do modo interpolado
  debugStep4.status = "passed"; // Marca sucesso
  debugStep4.mode = "heightInterpolated"; // Indica interpolação por altura
  debugStep4.lowerHeight = lowerH; // Guarda altura inferior
  debugStep4.upperHeight = upperH; // Guarda altura superior
  debugStep4.tHeight = th; // Guarda factor de interpolação
  debugStep4.CG = CG; // Guarda resultado final
  debug.step4 = debugStep4; // Escreve debug

  // Devolve o CG final interpolado
  return CG;
}


// ================== MAIN API ==================

export default function Gradient_Required34Seg({
  obstacleDistance,
  runway_slope,
  wind,
  obstacle_height
}) {
  const debug = {};

  const x1 = computeXFromDistance(obstacleDistance, debug);
  if (x1 == null) return { status: "failed", result_CG_required: null, debug };

  const step2 = computeXWithSlope(x1, runway_slope, debug);
  if (!step2) return { status: "failed", result_CG_required: null, debug };

  const x2 = step2.x;

  const x3 = computeXWithWind(x2, wind, debug);
  if (x3 == null) return { status: "failed", result_CG_required: null, debug };

  const cg = computeCGFromHeight(x3, obstacle_height, debug);
  if (cg == null) return { status: "failed", result_CG_required: null, debug };

  return {
    status: "passed",
    result_CG_required: cg,
    debug
  };
}