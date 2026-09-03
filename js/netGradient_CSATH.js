// netGradient_CSATH.js
// Calculadora "Net Gradient" (CSATH) — versão sem fetch(), com dados embebidos.
// Gera um objeto único (netGradient_CSATH) pronto a ser importado e chamado por outros módulos.

const DATA = {
  "tempPressAlt": {
    "meta": {
      "naturalWidth": 1456,
      "naturalHeight": 809
    },
    "rows": [
      {
        "pressureAltitudeFt": 0,
        "temperatureC": -25,
        "yNorm": 0.3698381169721095,
        "xNorm": 0.10085164409665892
      },
      {
        "pressureAltitudeFt": 0,
        "temperatureC": -20,
        "yNorm": 0.3800219384952694,
        "xNorm": 0.12068202387260406
      },
      {
        "pressureAltitudeFt": 0,
        "temperatureC": -10,
        "yNorm": 0.39784360370170185,
        "xNorm": 0.15609341632964896
      },
      {
        "pressureAltitudeFt": 0,
        "temperatureC": 0,
        "yNorm": 0.4105733715006123,
        "xNorm": 0.19292126448497562
      },
      {
        "pressureAltitudeFt": 0,
        "temperatureC": 10,
        "yNorm": 0.4233031490115648,
        "xNorm": 0.22833265694202048
      },
      {
        "pressureAltitudeFt": 0,
        "temperatureC": 20,
        "yNorm": 0.4360329070984331,
        "xNorm": 0.2651605050973472
      },
      {
        "pressureAltitudeFt": 0,
        "temperatureC": 30,
        "yNorm": 0.4844060247342927,
        "xNorm": 0.30198835325267387
      },
      {
        "pressureAltitudeFt": 0,
        "temperatureC": 40,
        "yNorm": 0.5709684457668834,
        "xNorm": 0.3388162014080005
      },
      {
        "pressureAltitudeFt": 0,
        "temperatureC": 50,
        "yNorm": 0.6549849132396921,
        "xNorm": 0.3756440495633272
      },
      {
        "pressureAltitudeFt": 2000,
        "temperatureC": -28,
        "yNorm": 0.39020574302235567,
        "xNorm": 0.08810354281212276
      },
      {
        "pressureAltitudeFt": 2000,
        "temperatureC": -10,
        "yNorm": 0.4233031490115648,
        "xNorm": 0.15609341632964896
      },
      {
        "pressureAltitudeFt": 2000,
        "temperatureC": 0,
        "yNorm": 0.4360329095264436,
        "xNorm": 0.19292126448497562
      },
      {
        "pressureAltitudeFt": 2000,
        "temperatureC": 10,
        "yNorm": 0.448762677325354,
        "xNorm": 0.22833265694202048
      },
      {
        "pressureAltitudeFt": 2000,
        "temperatureC": 20,
        "yNorm": 0.4844060344463348,
        "xNorm": 0.2651605050973472
      },
      {
        "pressureAltitudeFt": 2000,
        "temperatureC": 30,
        "yNorm": 0.5658765483593613,
        "xNorm": 0.30198835325267387
      },
      {
        "pressureAltitudeFt": 2000,
        "temperatureC": 40,
        "yNorm": 0.6422551551528238,
        "xNorm": 0.3388162014080005
      },
      {
        "pressureAltitudeFt": 2000,
        "temperatureC": 50,
        "yNorm": 0.7186337619462863,
        "xNorm": 0.3756440495633272
      },
      {
        "pressureAltitudeFt": 4000,
        "temperatureC": -33,
        "yNorm": 0.41057338121265435,
        "xNorm": 0.07110607443274122
      },
      {
        "pressureAltitudeFt": 4000,
        "temperatureC": -30,
        "yNorm": 0.41566527862017644,
        "xNorm": 0.08385417571727738
      },
      {
        "pressureAltitudeFt": 4000,
        "temperatureC": -20,
        "yNorm": 0.43094100969091104,
        "xNorm": 0.11926556817432227
      },
      {
        "pressureAltitudeFt": 4000,
        "temperatureC": -10,
        "yNorm": 0.4462167310496035,
        "xNorm": 0.15609341632964896
      },
      {
        "pressureAltitudeFt": 4000,
        "temperatureC": 0,
        "yNorm": 0.461492452408296,
        "xNorm": 0.19292126448497562
      },
      {
        "pressureAltitudeFt": 4000,
        "temperatureC": 10,
        "yNorm": 0.4971358022452451,
        "xNorm": 0.22833265694202048
      },
      {
        "pressureAltitudeFt": 4000,
        "temperatureC": 20,
        "yNorm": 0.5684225019191435,
        "xNorm": 0.2651605050973472
      },
      {
        "pressureAltitudeFt": 4000,
        "temperatureC": 30,
        "yNorm": 0.6371632383212175,
        "xNorm": 0.30198835325267387
      },
      {
        "pressureAltitudeFt": 4000,
        "temperatureC": 40,
        "yNorm": 0.7059039868633443,
        "xNorm": 0.3388162014080005
      },
      {
        "pressureAltitudeFt": 4000,
        "temperatureC": 47,
        "yNorm": 0.7517311582234534,
        "xNorm": 0.362895948278791
      },
      {
        "pressureAltitudeFt": 6000,
        "temperatureC": -37,
        "yNorm": 0.4334869632506931,
        "xNorm": 0.05694151744992327
      },
      {
        "pressureAltitudeFt": 6000,
        "temperatureC": -30,
        "yNorm": 0.4462167310496035,
        "xNorm": 0.08385417571727738
      },
      {
        "pressureAltitudeFt": 6000,
        "temperatureC": -20,
        "yNorm": 0.461492452408296,
        "xNorm": 0.12068202387260406
      },
      {
        "pressureAltitudeFt": 6000,
        "temperatureC": -10,
        "yNorm": 0.4793141273267706,
        "xNorm": 0.15609341632964896
      },
      {
        "pressureAltitudeFt": 6000,
        "temperatureC": 0,
        "yNorm": 0.525141291402848,
        "xNorm": 0.19292126448497562
      },
      {
        "pressureAltitudeFt": 6000,
        "temperatureC": 10,
        "yNorm": 0.5836982232778359,
        "xNorm": 0.22833265694202048
      },
      {
        "pressureAltitudeFt": 6000,
        "temperatureC": 20,
        "yNorm": 0.6422551551528238,
        "xNorm": 0.2651605050973472
      },
      {
        "pressureAltitudeFt": 6000,
        "temperatureC": 30,
        "yNorm": 0.6982661334680296,
        "xNorm": 0.30198835325267387
      },
      {
        "pressureAltitudeFt": 6000,
        "temperatureC": 40,
        "yNorm": 0.7542771117832354,
        "xNorm": 0.3388162014080005
      },
      {
        "pressureAltitudeFt": 6000,
        "temperatureC": 44,
        "yNorm": 0.774644740261492,
        "xNorm": 0.3515643026925367
      },
      {
        "pressureAltitudeFt": 8000,
        "temperatureC": -41,
        "yNorm": 0.4538545917289497,
        "xNorm": 0.04277696046710531
      },
      {
        "pressureAltitudeFt": 8000,
        "temperatureC": -40,
        "yNorm": 0.45640054528873186,
        "xNorm": 0.0470263275619507
      },
      {
        "pressureAltitudeFt": 8000,
        "temperatureC": -30,
        "yNorm": 0.47167626664742435,
        "xNorm": 0.08385417571727738
      },
      {
        "pressureAltitudeFt": 8000,
        "temperatureC": -20,
        "yNorm": 0.4996817558050273,
        "xNorm": 0.12068202387260406
      },
      {
        "pressureAltitudeFt": 8000,
        "temperatureC": -10,
        "yNorm": 0.553146780560451,
        "xNorm": 0.15609341632964896
      },
      {
        "pressureAltitudeFt": 8000,
        "temperatureC": 0,
        "yNorm": 0.6040658517560925,
        "xNorm": 0.19292126448497562
      },
      {
        "pressureAltitudeFt": 8000,
        "temperatureC": 10,
        "yNorm": 0.6549849156677026,
        "xNorm": 0.22833265694202048
      },
      {
        "pressureAltitudeFt": 8000,
        "temperatureC": 20,
        "yNorm": 0.708449947707158,
        "xNorm": 0.266576960795629
      },
      {
        "pressureAltitudeFt": 8000,
        "temperatureC": 30,
        "yNorm": 0.7568230653430175,
        "xNorm": 0.30198835325267387
      },
      {
        "pressureAltitudeFt": 8000,
        "temperatureC": 40,
        "yNorm": 0.8077421365386592,
        "xNorm": 0.3373997457097187
      },
      {
        "pressureAltitudeFt": 10000,
        "temperatureC": -46,
        "yNorm": 0.47422222020720645,
        "xNorm": 0.027195947786005568
      },
      {
        "pressureAltitudeFt": 10000,
        "temperatureC": -40,
        "yNorm": 0.4945898486854631,
        "xNorm": 0.0470263275619507
      },
      {
        "pressureAltitudeFt": 10000,
        "temperatureC": -30,
        "yNorm": 0.5378710592017585,
        "xNorm": 0.08385417571727738
      },
      {
        "pressureAltitudeFt": 10000,
        "temperatureC": -20,
        "yNorm": 0.5862441768376181,
        "xNorm": 0.12068202387260406
      },
      {
        "pressureAltitudeFt": 10000,
        "temperatureC": -10,
        "yNorm": 0.6295253873539134,
        "xNorm": 0.15609341632964896
      },
      {
        "pressureAltitudeFt": 10000,
        "temperatureC": 0,
        "yNorm": 0.6753525514299908,
        "xNorm": 0.19292126448497562
      },
      {
        "pressureAltitudeFt": 10000,
        "temperatureC": 10,
        "yNorm": 0.7211797155060683,
        "xNorm": 0.22833265694202048
      },
      {
        "pressureAltitudeFt": 10000,
        "temperatureC": 20,
        "yNorm": 0.7670068795821458,
        "xNorm": 0.2651605050973472
      },
      {
        "pressureAltitudeFt": 10000,
        "temperatureC": 30,
        "yNorm": 0.8128340436582232,
        "xNorm": 0.30198835325267387
      }
    ]
  },
  "refLine": {
    "meta": {
      "naturalWidth": 1456,
      "naturalHeight": 809
    },
    "rows": [
      {
        "referenceLine": 1,
        "downReferenceY": 0.8266542652988768,
        "upReferenceY": 0.762704433295424
      },
      {
        "referenceLine": 2,
        "downReferenceY": 0.7629532577771351,
        "upReferenceY": 0.6965151012221724
      },
      {
        "referenceLine": 3,
        "downReferenceY": 0.6965151012221724,
        "upReferenceY": 0.6320675936771645
      },
      {
        "referenceLine": 4,
        "downReferenceY": 0.6320675936771645,
        "upReferenceY": 0.565878261603913
      },
      {
        "referenceLine": 5,
        "downReferenceY": 0.565878261603913,
        "upReferenceY": 0.5031725785871485
      },
      {
        "referenceLine": 6,
        "downReferenceY": 0.501430754058905,
        "upReferenceY": 0.4352414219856536
      },
      {
        "referenceLine": 7,
        "downReferenceY": 0.4387250710421405,
        "upReferenceY": 0.36855441437084696
      }
    ]
  },
  "refWeight": {
    "meta": {
      "naturalWidth": 1456,
      "naturalHeight": 809
    },
    "rows": [
      {
        "weight": 4200,
        "reference": 1,
        "down_reference": 0.478886,
        "up_reference": 0.396688
      },
      {
        "weight": 4200,
        "reference": 2,
        "down_reference": 0.396688,
        "up_reference": 0.318499
      },
      {
        "weight": 4200,
        "reference": 3,
        "down_reference": 0.318499,
        "up_reference": 0.234295
      },
      {
        "weight": 4200,
        "reference": 4,
        "down_reference": 0.234295,
        "up_reference": 0.148086
      },
      {
        "weight": 4200,
        "reference": 5,
        "down_reference": 0.148086,
        "up_reference": 0.059873
      },
      {
        "weight": 4200,
        "reference": 6,
        "down_reference": 0.059873,
        "up_reference": 0.039825
      },
      {
        "weight": 4300,
        "reference": 1,
        "down_reference": 0.50094,
        "up_reference": 0.424756
      },
      {
        "weight": 4300,
        "reference": 2,
        "down_reference": 0.424756,
        "up_reference": 0.342557
      },
      {
        "weight": 4300,
        "reference": 3,
        "down_reference": 0.342557,
        "up_reference": 0.262363
      },
      {
        "weight": 4300,
        "reference": 4,
        "down_reference": 0.262363,
        "up_reference": 0.174149
      },
      {
        "weight": 4300,
        "reference": 5,
        "down_reference": 0.174149,
        "up_reference": 0.091951
      },
      {
        "weight": 4300,
        "reference": 6,
        "down_reference": 0.091951,
        "up_reference": 0.041829
      },
      {
        "weight": 4400,
        "reference": 1,
        "down_reference": 0.523996,
        "up_reference": 0.445806
      },
      {
        "weight": 4400,
        "reference": 2,
        "down_reference": 0.445806,
        "up_reference": 0.367617
      },
      {
        "weight": 4400,
        "reference": 3,
        "down_reference": 0.367617,
        "up_reference": 0.285419
      },
      {
        "weight": 4400,
        "reference": 4,
        "down_reference": 0.285419,
        "up_reference": 0.20322
      },
      {
        "weight": 4400,
        "reference": 5,
        "down_reference": 0.20322,
        "up_reference": 0.121021
      },
      {
        "weight": 4400,
        "reference": 6,
        "down_reference": 0.121021,
        "up_reference": 0.044837
      },
      {
        "weight": 4500,
        "reference": 1,
        "down_reference": 0.545046,
        "up_reference": 0.466857
      },
      {
        "weight": 4500,
        "reference": 2,
        "down_reference": 0.466857,
        "up_reference": 0.390673
      },
      {
        "weight": 4500,
        "reference": 3,
        "down_reference": 0.390673,
        "up_reference": 0.310479
      },
      {
        "weight": 4500,
        "reference": 4,
        "down_reference": 0.310479,
        "up_reference": 0.22828
      },
      {
        "weight": 4500,
        "reference": 5,
        "down_reference": 0.22828,
        "up_reference": 0.146082
      },
      {
        "weight": 4500,
        "reference": 6,
        "down_reference": 0.146082,
        "up_reference": 0.051854
      },
      {
        "weight": 4600,
        "reference": 1,
        "down_reference": 0.571109,
        "up_reference": 0.49292
      },
      {
        "weight": 4600,
        "reference": 2,
        "down_reference": 0.49292,
        "up_reference": 0.416736
      },
      {
        "weight": 4600,
        "reference": 3,
        "down_reference": 0.416736,
        "up_reference": 0.336542
      },
      {
        "weight": 4600,
        "reference": 4,
        "down_reference": 0.336542,
        "up_reference": 0.260358
      },
      {
        "weight": 4600,
        "reference": 5,
        "down_reference": 0.260358,
        "up_reference": 0.176154
      },
      {
        "weight": 4600,
        "reference": 6,
        "down_reference": 0.176154,
        "up_reference": 0.079922
      },
      {
        "weight": 4600,
        "reference": 7,
        "down_reference": 0.079922,
        "up_reference": 0.043834
      },
      {
        "weight": 4700,
        "reference": 1,
        "down_reference": 0.591158,
        "up_reference": 0.514974
      },
      {
        "weight": 4700,
        "reference": 2,
        "down_reference": 0.514974,
        "up_reference": 0.436785
      },
      {
        "weight": 4700,
        "reference": 3,
        "down_reference": 0.436785,
        "up_reference": 0.358596
      },
      {
        "weight": 4700,
        "reference": 4,
        "down_reference": 0.358596,
        "up_reference": 0.284416
      },
      {
        "weight": 4700,
        "reference": 5,
        "down_reference": 0.284416,
        "up_reference": 0.204222
      },
      {
        "weight": 4700,
        "reference": 6,
        "down_reference": 0.204222,
        "up_reference": 0.111999
      },
      {
        "weight": 4700,
        "reference": 7,
        "down_reference": 0.111999,
        "up_reference": 0.041829
      },
      {
        "weight": 4800,
        "reference": 1,
        "down_reference": 0.613211,
        "up_reference": 0.537027
      },
      {
        "weight": 4800,
        "reference": 2,
        "down_reference": 0.537027,
        "up_reference": 0.464852
      },
      {
        "weight": 4800,
        "reference": 3,
        "down_reference": 0.464852,
        "up_reference": 0.384659
      },
      {
        "weight": 4800,
        "reference": 4,
        "down_reference": 0.384659,
        "up_reference": 0.310479
      },
      {
        "weight": 4800,
        "reference": 5,
        "down_reference": 0.310479,
        "up_reference": 0.23229
      },
      {
        "weight": 4800,
        "reference": 6,
        "down_reference": 0.23229,
        "up_reference": 0.142072
      },
      {
        "weight": 4800,
        "reference": 7,
        "down_reference": 0.142072,
        "up_reference": 0.051854
      },
      {
        "weight": 4900,
        "reference": 1,
        "down_reference": 0.63326,
        "up_reference": 0.557076
      },
      {
        "weight": 4900,
        "reference": 2,
        "down_reference": 0.557076,
        "up_reference": 0.486906
      },
      {
        "weight": 4900,
        "reference": 3,
        "down_reference": 0.486906,
        "up_reference": 0.410722
      },
      {
        "weight": 4900,
        "reference": 4,
        "down_reference": 0.410722,
        "up_reference": 0.334537
      },
      {
        "weight": 4900,
        "reference": 5,
        "down_reference": 0.334537,
        "up_reference": 0.260358
      },
      {
        "weight": 4900,
        "reference": 6,
        "down_reference": 0.260358,
        "up_reference": 0.17014
      },
      {
        "weight": 4900,
        "reference": 7,
        "down_reference": 0.17014,
        "up_reference": 0.081926
      },
      {
        "weight": 5000,
        "reference": 1,
        "down_reference": 0.653308,
        "up_reference": 0.581134
      },
      {
        "weight": 5000,
        "reference": 2,
        "down_reference": 0.581134,
        "up_reference": 0.510964
      },
      {
        "weight": 5000,
        "reference": 3,
        "down_reference": 0.510964,
        "up_reference": 0.43478
      },
      {
        "weight": 5000,
        "reference": 4,
        "down_reference": 0.43478,
        "up_reference": 0.358596
      },
      {
        "weight": 5000,
        "reference": 5,
        "down_reference": 0.358596,
        "up_reference": 0.284416
      },
      {
        "weight": 5000,
        "reference": 6,
        "down_reference": 0.284416,
        "up_reference": 0.198208
      },
      {
        "weight": 5000,
        "reference": 7,
        "down_reference": 0.198208,
        "up_reference": 0.116009
      },
      {
        "weight": 5100,
        "reference": 1,
        "down_reference": 0.673357,
        "up_reference": 0.603187
      },
      {
        "weight": 5100,
        "reference": 2,
        "down_reference": 0.603187,
        "up_reference": 0.529008
      },
      {
        "weight": 5100,
        "reference": 3,
        "down_reference": 0.529008,
        "up_reference": 0.454828
      },
      {
        "weight": 5100,
        "reference": 4,
        "down_reference": 0.454828,
        "up_reference": 0.380649
      },
      {
        "weight": 5100,
        "reference": 5,
        "down_reference": 0.380649,
        "up_reference": 0.308474
      },
      {
        "weight": 5100,
        "reference": 6,
        "down_reference": 0.308474,
        "up_reference": 0.224271
      },
      {
        "weight": 5100,
        "reference": 7,
        "down_reference": 0.224271,
        "up_reference": 0.144077
      },
      {
        "weight": 5200,
        "reference": 1,
        "down_reference": 0.693405,
        "up_reference": 0.623236
      },
      {
        "weight": 5200,
        "reference": 2,
        "down_reference": 0.623236,
        "up_reference": 0.551061
      },
      {
        "weight": 5200,
        "reference": 3,
        "down_reference": 0.551061,
        "up_reference": 0.478886
      },
      {
        "weight": 5200,
        "reference": 4,
        "down_reference": 0.478886,
        "up_reference": 0.402702
      },
      {
        "weight": 5200,
        "reference": 5,
        "down_reference": 0.402702,
        "up_reference": 0.330528
      },
      {
        "weight": 5200,
        "reference": 6,
        "down_reference": 0.330528,
        "up_reference": 0.250334
      },
      {
        "weight": 5200,
        "reference": 7,
        "down_reference": 0.250334,
        "up_reference": 0.174149
      },
      {
        "weight": 5300,
        "reference": 1,
        "down_reference": 0.709444,
        "up_reference": 0.643284
      },
      {
        "weight": 5300,
        "reference": 2,
        "down_reference": 0.643284,
        "up_reference": 0.569105
      },
      {
        "weight": 5300,
        "reference": 3,
        "down_reference": 0.569105,
        "up_reference": 0.498935
      },
      {
        "weight": 5300,
        "reference": 4,
        "down_reference": 0.498935,
        "up_reference": 0.424756
      },
      {
        "weight": 5300,
        "reference": 5,
        "down_reference": 0.424756,
        "up_reference": 0.352581
      },
      {
        "weight": 5300,
        "reference": 6,
        "down_reference": 0.352581,
        "up_reference": 0.278402
      },
      {
        "weight": 5300,
        "reference": 7,
        "down_reference": 0.278402,
        "up_reference": 0.202217
      },
      {
        "weight": 5400,
        "reference": 1,
        "down_reference": 0.729493,
        "up_reference": 0.663333
      },
      {
        "weight": 5400,
        "reference": 2,
        "down_reference": 0.663333,
        "up_reference": 0.591158
      },
      {
        "weight": 5400,
        "reference": 3,
        "down_reference": 0.591158,
        "up_reference": 0.518983
      },
      {
        "weight": 5400,
        "reference": 4,
        "down_reference": 0.518983,
        "up_reference": 0.448814
      },
      {
        "weight": 5400,
        "reference": 5,
        "down_reference": 0.448814,
        "up_reference": 0.374634
      },
      {
        "weight": 5400,
        "reference": 6,
        "down_reference": 0.374634,
        "up_reference": 0.30246
      },
      {
        "weight": 5400,
        "reference": 7,
        "down_reference": 0.30246,
        "up_reference": 0.230285
      },
      {
        "weight": 5500,
        "reference": 1,
        "down_reference": 0.745531,
        "up_reference": 0.681376
      },
      {
        "weight": 5500,
        "reference": 2,
        "down_reference": 0.681376,
        "up_reference": 0.611206
      },
      {
        "weight": 5500,
        "reference": 3,
        "down_reference": 0.611206,
        "up_reference": 0.541037
      },
      {
        "weight": 5500,
        "reference": 4,
        "down_reference": 0.541037,
        "up_reference": 0.470867
      },
      {
        "weight": 5500,
        "reference": 5,
        "down_reference": 0.470867,
        "up_reference": 0.396688
      },
      {
        "weight": 5500,
        "reference": 6,
        "down_reference": 0.396688,
        "up_reference": 0.324513
      },
      {
        "weight": 5500,
        "reference": 7,
        "down_reference": 0.324513,
        "up_reference": 0.258353
      },
      {
        "weight": 5600,
        "reference": 1,
        "down_reference": 0.760963,
        "up_reference": 0.701741
      },
      {
        "weight": 5600,
        "reference": 2,
        "down_reference": 0.701741,
        "up_reference": 0.628584
      },
      {
        "weight": 5600,
        "reference": 3,
        "down_reference": 0.628584,
        "up_reference": 0.560653
      },
      {
        "weight": 5600,
        "reference": 4,
        "down_reference": 0.560653,
        "up_reference": 0.489238
      },
      {
        "weight": 5600,
        "reference": 5,
        "down_reference": 0.489238,
        "up_reference": 0.420809
      },
      {
        "weight": 5600,
        "reference": 6,
        "down_reference": 0.420809,
        "up_reference": 0.347653
      },
      {
        "weight": 5600,
        "reference": 7,
        "down_reference": 0.347653,
        "up_reference": 0.281463
      },
      {
        "weight": 5700,
        "reference": 1,
        "down_reference": 0.779874,
        "up_reference": 0.717168
      },
      {
        "weight": 5700,
        "reference": 2,
        "down_reference": 0.717168,
        "up_reference": 0.647495
      },
      {
        "weight": 5700,
        "reference": 3,
        "down_reference": 0.647495,
        "up_reference": 0.581306
      },
      {
        "weight": 5700,
        "reference": 4,
        "down_reference": 0.581306,
        "up_reference": 0.509891
      },
      {
        "weight": 5700,
        "reference": 5,
        "down_reference": 0.509891,
        "up_reference": 0.44196
      },
      {
        "weight": 5700,
        "reference": 6,
        "down_reference": 0.44196,
        "up_reference": 0.375771
      },
      {
        "weight": 5700,
        "reference": 7,
        "down_reference": 0.375771,
        "up_reference": 0.304356
      },
      {
        "weight": 5800,
        "reference": 1,
        "down_reference": 0.799532,
        "up_reference": 0.733093
      },
      {
        "weight": 5800,
        "reference": 2,
        "down_reference": 0.733093,
        "up_reference": 0.66342
      },
      {
        "weight": 5800,
        "reference": 3,
        "down_reference": 0.66342,
        "up_reference": 0.600715
      },
      {
        "weight": 5800,
        "reference": 4,
        "down_reference": 0.600715,
        "up_reference": 0.531042
      },
      {
        "weight": 5800,
        "reference": 5,
        "down_reference": 0.531042,
        "up_reference": 0.464852
      },
      {
        "weight": 5800,
        "reference": 6,
        "down_reference": 0.464852,
        "up_reference": 0.396921
      },
      {
        "weight": 5800,
        "reference": 7,
        "down_reference": 0.396921,
        "up_reference": 0.327248
      },
      {
        "weight": 5900,
        "reference": 1,
        "down_reference": 0.813217,
        "up_reference": 0.74877
      },
      {
        "weight": 5900,
        "reference": 2,
        "down_reference": 0.74877,
        "up_reference": 0.682581
      },
      {
        "weight": 5900,
        "reference": 3,
        "down_reference": 0.682581,
        "up_reference": 0.616391
      },
      {
        "weight": 5900,
        "reference": 4,
        "down_reference": 0.616391,
        "up_reference": 0.550202
      },
      {
        "weight": 5900,
        "reference": 5,
        "down_reference": 0.550202,
        "up_reference": 0.484013
      },
      {
        "weight": 5900,
        "reference": 6,
        "down_reference": 0.484013,
        "up_reference": 0.419565
      },
      {
        "weight": 5900,
        "reference": 7,
        "down_reference": 0.419565,
        "up_reference": 0.34815
      },
      {
        "weight": 6000,
        "reference": 1,
        "down_reference": 0.828894,
        "up_reference": 0.762704
      },
      {
        "weight": 6000,
        "reference": 2,
        "down_reference": 0.762704,
        "up_reference": 0.696515
      },
      {
        "weight": 6000,
        "reference": 3,
        "down_reference": 0.696515,
        "up_reference": 0.630326
      },
      {
        "weight": 6000,
        "reference": 4,
        "down_reference": 0.630326,
        "up_reference": 0.565878
      },
      {
        "weight": 6000,
        "reference": 5,
        "down_reference": 0.565878,
        "up_reference": 0.501431
      },
      {
        "weight": 6000,
        "reference": 6,
        "down_reference": 0.501431,
        "up_reference": 0.4335
      },
      {
        "weight": 6000,
        "reference": 7,
        "down_reference": 0.4335,
        "up_reference": 0.36731
      },
      {
        "weight": 6100,
        "reference": 1,
        "down_reference": 0.828894,
        "up_reference": 0.774897
      },
      {
        "weight": 6100,
        "reference": 2,
        "down_reference": 0.774897,
        "up_reference": 0.71045
      },
      {
        "weight": 6100,
        "reference": 3,
        "down_reference": 0.71045,
        "up_reference": 0.647744
      },
      {
        "weight": 6100,
        "reference": 4,
        "down_reference": 0.647744,
        "up_reference": 0.583297
      },
      {
        "weight": 6100,
        "reference": 5,
        "down_reference": 0.583297,
        "up_reference": 0.520591
      },
      {
        "weight": 6100,
        "reference": 6,
        "down_reference": 0.520591,
        "up_reference": 0.456143
      },
      {
        "weight": 6100,
        "reference": 7,
        "down_reference": 0.456143,
        "up_reference": 0.389954
      },
      {
        "weight": 6200,
        "reference": 1,
        "down_reference": 0.827152,
        "up_reference": 0.790574
      },
      {
        "weight": 6200,
        "reference": 2,
        "down_reference": 0.790574,
        "up_reference": 0.726126
      },
      {
        "weight": 6200,
        "reference": 3,
        "down_reference": 0.726126,
        "up_reference": 0.66342
      },
      {
        "weight": 6200,
        "reference": 4,
        "down_reference": 0.66342,
        "up_reference": 0.598973
      },
      {
        "weight": 6200,
        "reference": 5,
        "down_reference": 0.598973,
        "up_reference": 0.536267
      },
      {
        "weight": 6200,
        "reference": 6,
        "down_reference": 0.536267,
        "up_reference": 0.475303
      },
      {
        "weight": 6200,
        "reference": 7,
        "down_reference": 0.475303,
        "up_reference": 0.409114
      },
      {
        "weight": 6300,
        "reference": 1,
        "down_reference": 0.827152,
        "up_reference": 0.804508
      },
      {
        "weight": 6300,
        "reference": 2,
        "down_reference": 0.804508,
        "up_reference": 0.738319
      },
      {
        "weight": 6300,
        "reference": 3,
        "down_reference": 0.738319,
        "up_reference": 0.675613
      },
      {
        "weight": 6300,
        "reference": 4,
        "down_reference": 0.675613,
        "up_reference": 0.614649
      },
      {
        "weight": 6300,
        "reference": 5,
        "down_reference": 0.614649,
        "up_reference": 0.555427
      },
      {
        "weight": 6300,
        "reference": 6,
        "down_reference": 0.555427,
        "up_reference": 0.489238
      },
      {
        "weight": 6300,
        "reference": 7,
        "down_reference": 0.489238,
        "up_reference": 0.426532
      },
      {
        "weight": 6400,
        "reference": 1,
        "down_reference": 0.830636,
        "up_reference": 0.818443
      },
      {
        "weight": 6400,
        "reference": 2,
        "down_reference": 0.818443,
        "up_reference": 0.752253
      },
      {
        "weight": 6400,
        "reference": 3,
        "down_reference": 0.752253,
        "up_reference": 0.687806
      },
      {
        "weight": 6400,
        "reference": 4,
        "down_reference": 0.687806,
        "up_reference": 0.630326
      },
      {
        "weight": 6400,
        "reference": 5,
        "down_reference": 0.630326,
        "up_reference": 0.571104
      },
      {
        "weight": 6400,
        "reference": 6,
        "down_reference": 0.571104,
        "up_reference": 0.508398
      },
      {
        "weight": 6400,
        "reference": 7,
        "down_reference": 0.508398,
        "up_reference": 0.447434
      }
    ]
  },
  "inletRef": {
    "meta": {
      "naturalWidth": 1456,
      "naturalHeight": 809
    },
    "rows": [
      {
        "climbGradient": 10,
        "y": 0.04233556035343142
      },
      {
        "climbGradient": 9,
        "y": 0.10678306789843943
      },
      {
        "climbGradient": 8,
        "y": 0.1729723999716909
      },
      {
        "climbGradient": 7,
        "y": 0.2374199075166989
      },
      {
        "climbGradient": 6,
        "y": 0.30360923958995034
      },
      {
        "climbGradient": 5,
        "y": 0.36805674713495834
      },
      {
        "climbGradient": 4,
        "y": 0.4342460792082098
      },
      {
        "climbGradient": 3,
        "y": 0.5004354112814613
      },
      {
        "climbGradient": 2,
        "y": 0.5648829188264693
      },
      {
        "climbGradient": 1,
        "y": 0.6293304263714773
      },
      {
        "climbGradient": 0,
        "y": 0.6955197584447288
      },
      {
        "climbGradient": -1,
        "y": 0.7599672659897366
      },
      {
        "climbGradient": -2,
        "y": 0.8261565980629882
      }
    ]
  }
};

function roundTo02(value) {
  return Math.round(value / 0.2) * 0.2;
}

function inletPenaltyFromCgOff(cgOff) {
  if (cgOff >= 8 && cgOff < 10) return 0.2;
  if (cgOff >= 4 && cgOff < 8) return 0.4;
  if (cgOff >= -2 && cgOff < 4) return 0.6;
  return 0;
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function uniqueSorted(nums) {
  return [...new Set(nums)].sort((a, b) => a - b);
}

function findBracket(arr, x, outOfRange = "clamp") {
  if (!arr.length) throw new Error("Array vazio em findBracket()");
  const min = arr[0];
  const max = arr[arr.length - 1];

  if (x < min) {
    if (outOfRange === "error") throw new Error(`Valor ${x} abaixo do mínimo ${min}`);
    return { i0: 0, i1: 0, t: 0 };
  }
  if (x > max) {
    if (outOfRange === "error") throw new Error(`Valor ${x} acima do máximo ${max}`);
    const last = arr.length - 1;
    return { i0: last, i1: last, t: 0 };
  }

  for (let i = 0; i < arr.length - 1; i++) {
    const a = arr[i];
    const b = arr[i + 1];
    if (x >= a && x <= b) {
      const t = (b === a) ? 0 : (x - a) / (b - a);
      return { i0: i, i1: i + 1, t };
    }
  }

  const last = arr.length - 1;
  return { i0: last, i1: last, t: 0 };
}

function clampBetween(x, a, b) {
  const lo = Math.min(a, b);
  const hi = Math.max(a, b);
  return Math.max(lo, Math.min(hi, x));
}

// -------- Step 1
function yFromTempPressAlt(tempPressAlt, tempC, pressureAltitudeFt, outOfRange) {
  const rows = tempPressAlt.rows || [];
  if (!rows.length) throw new Error("tempPressAlt embebido sem rows");

  const pas = uniqueSorted(rows.map(r => Number(r.pressureAltitudeFt)));
  const paB = findBracket(pas, pressureAltitudeFt, outOfRange);

  const paLow = pas[paB.i0];
  const paHigh = pas[paB.i1];

  function interpTemp(paValue) {
    const block = rows
      .filter(r => Number(r.pressureAltitudeFt) === paValue)
      .slice()
      .sort((a, b) => Number(a.temperatureC) - Number(b.temperatureC));

    if (!block.length) throw new Error(`Sem dados para PA=${paValue} em tempPressAlt embebido`);

    const temps = block.map(r => Number(r.temperatureC));
    const tb = findBracket(temps, tempC, outOfRange);

    const y0 = Number(block[tb.i0].yNorm);
    const y1 = Number(block[tb.i1].yNorm);
    return lerp(y0, y1, tb.t);
  }

  const yLow = interpTemp(paLow);
  const yHigh = interpTemp(paHigh);

  return lerp(yLow, yHigh, paB.t);
}

// -------- Step 2
function refLineFromY(refLine, y, outOfRange) {
  const rows = (refLine.rows || []).slice();
  if (!rows.length) throw new Error("refLine embebido sem rows");

  const line = rows.find(r => {
    const down = Number(r.downReferenceY);
    const up = Number(r.upReferenceY);
    return (y <= down && y >= up) || (y >= down && y <= up);
  });

  if (!line) {
    if (outOfRange === "error") throw new Error(`Y=${y} fora de qualquer referenceLine em refLine embebido`);
    // clamp: escolhe linha mais próxima
    let best = null;
    let bestDist = Infinity;
    for (const r of rows) {
      const down = Number(r.downReferenceY);
      const up = Number(r.upReferenceY);
      const lo = Math.min(down, up);
      const hi = Math.max(down, up);
      const dist = (y < lo) ? (lo - y) : (y > hi) ? (y - hi) : 0;
      if (dist < bestDist) { bestDist = dist; best = r; }
    }
    const down = Number(best.downReferenceY);
    const up = Number(best.upReferenceY);
    const denom = (down - up) || 1;
    const yClamped = clampBetween(y, up, down);
    const percent = (down - yClamped) / denom;
    return { referenceLine: Number(best.referenceLine), percent };
  }

  const down = Number(line.downReferenceY);
  const up = Number(line.upReferenceY);
  const denom = (down - up) || 1;
  const percent = (down - y) / denom;

  return { referenceLine: Number(line.referenceLine), percent };
}

// -------- Step 3
function yFromWeight(refWeight, weightKg, referenceLine, percent, outOfRange) {
  const rowsAll = (refWeight.rows || []);
  if (!rowsAll.length) throw new Error("refWeight embebido sem rows");

  const rows = rowsAll
    .filter(r => Number(r.reference) === Number(referenceLine))
    .slice()
    .sort((a, b) => Number(a.weight) - Number(b.weight));

  if (!rows.length) throw new Error(`Sem dados em refWeight para referenceLine=${referenceLine}`);

  const weights = rows.map(r => Number(r.weight));
  const wb = findBracket(weights, weightKg, outOfRange);

  const r0 = rows[wb.i0];
  const r1 = rows[wb.i1];

  const down = lerp(Number(r0.down_reference), Number(r1.down_reference), wb.t);
  const up = lerp(Number(r0.up_reference), Number(r1.up_reference), wb.t);

  return lerp(down, up, percent);
}

// -------- Step 4
function climbGradientFromY(inletRef, y, outOfRange) {
  const rows = (inletRef.rows || []).slice();
  if (!rows.length) throw new Error("inletRef embebido sem rows");

  rows.sort((a, b) => Number(a.y) - Number(b.y));
  const ys = rows.map(r => Number(r.y));

  const b = findBracket(ys, y, outOfRange);
  const g0 = Number(rows[b.i0].climbGradient);
  const g1 = Number(rows[b.i1].climbGradient);

  return lerp(g0, g1, b.t);
}

function computeClimbGradient(inputs, data = DATA) {
  const {
    tempC,
    pressureAltitudeFt,
    weightKg,
    inletOn = false,
    outOfRange = "error" // "clamp" | "error"
  } = inputs || {};

  // STEP 1
  const y1 = yFromTempPressAlt(
    data.tempPressAlt,
    Number(tempC),
    Number(pressureAltitudeFt),
    outOfRange
  );

  // STEP 2
  const step2 = refLineFromY(
    data.refLine,
    y1,
    outOfRange
  );

  // STEP 3
  const y2 = yFromWeight(
    data.refWeight,
    Number(weightKg),
    step2.referenceLine,
    step2.percent,
    outOfRange
  );

  // STEP 4
  const climbGradientOff = climbGradientFromY(
    data.inletRef,
    y2,
    outOfRange
  );

  // Penalização por Inlet ON (aplicada ao resultado OFF)
  const penalty = inletOn ? inletPenaltyFromCgOff(climbGradientOff) : 0;
  const climbGradientOn = climbGradientOff - penalty;

  // Arredondamento a 0.2 (aplica ao resultado final que vais usar)
  const climbGradientFinalRaw = inletOn ? climbGradientOn : climbGradientOff;
  const climbGradientFinalRounded = roundTo02(climbGradientFinalRaw);

  return {
    step1: { y1 },
    step2: { referenceLine: step2.referenceLine, percent: step2.percent },
    step3: { y2 },
    step4: {
      climbGradientOffRaw: climbGradientOff,
      inletPenalty: penalty,
      climbGradientOnRaw: climbGradientOn,
      climbGradientFinalRaw,
      climbGradientFinalRounded
    },
    inletOn: Boolean(inletOn),
  };
}

export const netGradient_CSATH = {
  id: "netGradient_CSATH",
  version: "1.0.0",
  // dados embebidos (sem fetch)
  data: DATA,
  compute: computeClimbGradient,
};

export default netGradient_CSATH;
