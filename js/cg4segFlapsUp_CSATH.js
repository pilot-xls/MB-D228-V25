// cg4segFlapsUp_CSATH.js
// ----------------------
// 1) TABELAS DE DADOS
// ----------------------

const PA_OAT_TABLE = [
  {
    pressure_altitude: 12000,
    values: [
      {
        oat: -40,
        y_ref: 814
      },
      {
        oat: -30,
        y_ref: 864
      },
      {
        oat: -20,
        y_ref: 914
      },
      {
        oat: -10,
        y_ref: 967
      },
      {
        oat: 0,
        y_ref: 1023
      },
      {
        oat: 10,
        y_ref: 1077
      },
      {
        oat: 20,
        y_ref: 1140
      },
      {
        oat: 30,
        y_ref: 1197
      }
    ]
  },
  {
    pressure_altitude: 10000,
    values: [
      {
        oat: -40,
        y_ref: 715
      },
      {
        oat: -30,
        y_ref: 768
      },
      {
        oat: -20,
        y_ref: 825
      },
      {
        oat: -10,
        y_ref: 878
      },
      {
        oat: 0,
        y_ref: 935
      },
      {
        oat: 10,
        y_ref: 999
      },
      {
        oat: 20,
        y_ref: 1059
      },
      {
        oat: 30,
        y_ref: 1123
      }
    ]
  },
  {
    pressure_altitude: 8000,
    values: [
      {
        oat: -40,
        y_ref: 627
      },
      {
        oat: -30,
        y_ref: 655
      },
      {
        oat: -20,
        y_ref: 715
      },
      {
        oat: -10,
        y_ref: 775
      },
      {
        oat: 0,
        y_ref: 836
      },
      {
        oat: 10,
        y_ref: 907
      },
      {
        oat: 20,
        y_ref: 970
      },
      {
        oat: 30,
        y_ref: 1041
      }
    ]
  },
  {
    pressure_altitude: 6000,
    values: [
      {
        oat: -30,
        y_ref: 609
      },
      {
        oat: -20,
        y_ref: 634
      },
      {
        oat: -10,
        y_ref: 680
      },
      {
        oat: 0,
        y_ref: 743
      },
      {
        oat: 10,
        y_ref: 811
      },
      {
        oat: 20,
        y_ref: 885
      },
      {
        oat: 30,
        y_ref: 960
      },
      {
        oat: 40,
        y_ref: 1038
      }
    ]
  },
  {
    pressure_altitude: 4000,
    values: [
      {
        oat: -30,
        y_ref: 577
      },
      {
        oat: -20,
        y_ref: 598
      },
      {
        oat: -10,
        y_ref: 616
      },
      {
        oat: 0,
        y_ref: 644
      },
      {
        oat: 10,
        y_ref: 719
      },
      {
        oat: 20,
        y_ref: 797
      },
      {
        oat: 30,
        y_ref: 878
      },
      {
        oat: 40,
        y_ref: 963
      }
    ]
  },
  {
    pressure_altitude: 2000,
    values: [
      {
        oat: -20,
        y_ref: 556
      },
      {
        oat: -10,
        y_ref: 573
      },
      {
        oat: 0,
        y_ref: 595
      },
      {
        oat: 10,
        y_ref: 612
      },
      {
        oat: 20,
        y_ref: 694
      },
      {
        oat: 30,
        y_ref: 782
      },
      {
        oat: 40,
        y_ref: 882
      },
      {
        oat: 50,
        y_ref: 977
      }
    ]
  },
  {
    pressure_altitude: 0,
    values: [
      {
        oat: -20,
        y_ref: 520
      },
      {
        oat: -10,
        y_ref: 534
      },
      {
        oat: 0,
        y_ref: 556
      },
      {
        oat: 10,
        y_ref: 573
      },
      {
        oat: 20,
        y_ref: 591
      },
      {
        oat: 30,
        y_ref: 680
      },
      {
        oat: 40,
        y_ref: 786
      },
      {
        oat: 50,
        y_ref: 892
      }
    ]
  }
];

// Secções de referência (REF LINE)
const REF_SECTIONS = [
  {
    section: 1,
    y_ref_bottom: 1126,
    y_ref_top: 1034
  },
  {
    section: 2,
    y_ref_bottom: 1034,
    y_ref_top: 942
  },
  {
    section: 3,
    y_ref_bottom: 942,
    y_ref_top: 846
  },
  {
    section: 4,
    y_ref_bottom: 846,
    y_ref_top: 758
  },
  {
    section: 5,
    y_ref_bottom: 758,
    y_ref_top: 669
  },
  {
    section: 6,
    y_ref_bottom: 669,
    y_ref_top: 566
  },
  {
    section: 7,
    y_ref_bottom: 566,
    y_ref_top: 478
  }
];

const WEIGHT_TABLE = [
  {
    weight: 4500,
    sections: [
      {
        section: 1,
        y_ref_bottom: 869,
        y_ref_top: 763
      },
      {
        section: 2,
        y_ref_bottom: 763,
        y_ref_top: 646
      },
      {
        section: 3,
        y_ref_bottom: 646,
        y_ref_top: 529
      },
      {
        section: 4,
        y_ref_bottom: 529,
        y_ref_top: 408
      },
      {
        section: 5,
        y_ref_bottom: 408,
        y_ref_top: 284
      },
      {
        section: 6,
        y_ref_bottom: 284,
        y_ref_top: 160
      }
    ]
  },
  {
    weight: 4600,
    sections: [
      {
        section: 1,
        y_ref_bottom: 894,
        y_ref_top: 780
      },
      {
        section: 2,
        y_ref_bottom: 780,
        y_ref_top: 670
      },
      {
        section: 3,
        y_ref_bottom: 670,
        y_ref_top: 554
      },
      {
        section: 4,
        y_ref_bottom: 554,
        y_ref_top: 437
      },
      {
        section: 5,
        y_ref_bottom: 437,
        y_ref_top: 320
      },
      {
        section: 6,
        y_ref_bottom: 320,
        y_ref_top: 189
      }
    ]
  },
  {
    weight: 4700,
    sections: [
      {
        section: 1,
        y_ref_bottom: 911,
        y_ref_top: 805
      },
      {
        section: 2,
        y_ref_bottom: 805,
        y_ref_top: 692
      },
      {
        section: 3,
        y_ref_bottom: 692,
        y_ref_top: 582
      },
      {
        section: 4,
        y_ref_bottom: 582,
        y_ref_top: 461
      },
      {
        section: 5,
        y_ref_bottom: 461,
        y_ref_top: 344
      },
      {
        section: 6,
        y_ref_bottom: 344,
        y_ref_top: 224
      }
    ]
  },
  {
    weight: 4800,
    sections: [
      {
        section: 1,
        y_ref_bottom: 933,
        y_ref_top: 823
      },
      {
        section: 2,
        y_ref_bottom: 823,
        y_ref_top: 713
      },
      {
        section: 3,
        y_ref_bottom: 713,
        y_ref_top: 607
      },
      {
        section: 4,
        y_ref_bottom: 607,
        y_ref_top: 486
      },
      {
        section: 5,
        y_ref_bottom: 486,
        y_ref_top: 376
      },
      {
        section: 6,
        y_ref_bottom: 376,
        y_ref_top: 256
      },
      {
        section: 7,
        y_ref_bottom: 256,
        y_ref_top: 139
      }
    ]
  },
  {
    weight: 4900,
    sections: [
      {
        section: 1,
        y_ref_bottom: 950,
        y_ref_top: 844
      },
      {
        section: 2,
        y_ref_bottom: 844,
        y_ref_top: 734
      },
      {
        section: 3,
        y_ref_bottom: 734,
        y_ref_top: 632
      },
      {
        section: 4,
        y_ref_bottom: 632,
        y_ref_top: 511
      },
      {
        section: 5,
        y_ref_bottom: 511,
        y_ref_top: 405
      },
      {
        section: 6,
        y_ref_bottom: 405,
        y_ref_top: 284
      },
      {
        section: 7,
        y_ref_bottom: 284,
        y_ref_top: 167
      }
    ]
  },
  {
    weight: 5000,
    sections: [
      {
        section: 1,
        y_ref_bottom: 968,
        y_ref_top: 865
      },
      {
        section: 2,
        y_ref_bottom: 865,
        y_ref_top: 756
      },
      {
        section: 3,
        y_ref_bottom: 756,
        y_ref_top: 653
      },
      {
        section: 4,
        y_ref_bottom: 653,
        y_ref_top: 536
      },
      {
        section: 5,
        y_ref_bottom: 536,
        y_ref_top: 433
      },
      {
        section: 6,
        y_ref_bottom: 433,
        y_ref_top: 313
      },
      {
        section: 7,
        y_ref_bottom: 313,
        y_ref_top: 203
      }
    ]
  },
  {
    weight: 5100,
    sections: [
      {
        section: 1,
        y_ref_bottom: 986,
        y_ref_top: 883
      },
      {
        section: 2,
        y_ref_bottom: 883,
        y_ref_top: 777
      },
      {
        section: 3,
        y_ref_bottom: 777,
        y_ref_top: 674
      },
      {
        section: 4,
        y_ref_bottom: 674,
        y_ref_top: 557
      },
      {
        section: 5,
        y_ref_bottom: 557,
        y_ref_top: 461
      },
      {
        section: 6,
        y_ref_bottom: 461,
        y_ref_top: 341
      },
      {
        section: 7,
        y_ref_bottom: 341,
        y_ref_top: 228
      }
    ]
  },
  {
    weight: 5200,
    sections: [
      {
        section: 1,
        y_ref_bottom: 1004,
        y_ref_top: 901
      },
      {
        section: 2,
        y_ref_bottom: 901,
        y_ref_top: 795
      },
      {
        section: 3,
        y_ref_bottom: 795,
        y_ref_top: 695
      },
      {
        section: 4,
        y_ref_bottom: 695,
        y_ref_top: 582
      },
      {
        section: 5,
        y_ref_bottom: 582,
        y_ref_top: 483
      },
      {
        section: 6,
        y_ref_bottom: 483,
        y_ref_top: 369
      },
      {
        section: 7,
        y_ref_bottom: 369,
        y_ref_top: 259
      }
    ]
  },
  {
    weight: 5300,
    sections: [
      {
        section: 1,
        y_ref_bottom: 1018,
        y_ref_top: 919
      },
      {
        section: 2,
        y_ref_bottom: 919,
        y_ref_top: 816
      },
      {
        section: 3,
        y_ref_bottom: 816,
        y_ref_top: 713
      },
      {
        section: 4,
        y_ref_bottom: 713,
        y_ref_top: 607
      },
      {
        section: 5,
        y_ref_bottom: 607,
        y_ref_top: 511
      },
      {
        section: 6,
        y_ref_bottom: 511,
        y_ref_top: 398
      },
      {
        section: 7,
        y_ref_bottom: 398,
        y_ref_top: 291
      }
    ]
  },
  {
    weight: 5400,
    sections: [
      {
        section: 1,
        y_ref_bottom: 1032,
        y_ref_top: 933
      },
      {
        section: 2,
        y_ref_bottom: 933,
        y_ref_top: 834
      },
      {
        section: 3,
        y_ref_bottom: 834,
        y_ref_top: 734
      },
      {
        section: 4,
        y_ref_bottom: 734,
        y_ref_top: 628
      },
      {
        section: 5,
        y_ref_bottom: 628,
        y_ref_top: 536
      },
      {
        section: 6,
        y_ref_bottom: 536,
        y_ref_top: 422
      },
      {
        section: 7,
        y_ref_bottom: 422,
        y_ref_top: 320
      }
    ]
  },
  {
    weight: 5500,
    sections: [
      {
        section: 1,
        y_ref_bottom: 1046,
        y_ref_top: 947
      },
      {
        section: 2,
        y_ref_bottom: 947,
        y_ref_top: 848
      },
      {
        section: 3,
        y_ref_bottom: 848,
        y_ref_top: 756
      },
      {
        section: 4,
        y_ref_bottom: 756,
        y_ref_top: 649
      },
      {
        section: 5,
        y_ref_bottom: 649,
        y_ref_top: 557
      },
      {
        section: 6,
        y_ref_bottom: 557,
        y_ref_top: 451
      },
      {
        section: 7,
        y_ref_bottom: 451,
        y_ref_top: 348
      }
    ]
  },
  {
    weight: 5600,
    sections: [
      {
        section: 1,
        y_ref_bottom: 1064,
        y_ref_top: 965
      },
      {
        section: 2,
        y_ref_bottom: 965,
        y_ref_top: 869
      },
      {
        section: 3,
        y_ref_bottom: 869,
        y_ref_top: 773
      },
      {
        section: 4,
        y_ref_bottom: 773,
        y_ref_top: 674
      },
      {
        section: 5,
        y_ref_bottom: 674,
        y_ref_top: 582
      },
      {
        section: 6,
        y_ref_bottom: 582,
        y_ref_top: 472
      },
      {
        section: 7,
        y_ref_bottom: 472,
        y_ref_top: 376
      }
    ]
  },
  {
    weight: 5700,
    sections: [
      {
        section: 1,
        y_ref_bottom: 1078,
        y_ref_top: 982
      },
      {
        section: 2,
        y_ref_bottom: 982,
        y_ref_top: 883
      },
      {
        section: 3,
        y_ref_bottom: 883,
        y_ref_top: 787
      },
      {
        section: 4,
        y_ref_bottom: 787,
        y_ref_top: 695
      },
      {
        section: 5,
        y_ref_bottom: 695,
        y_ref_top: 607
      },
      {
        section: 6,
        y_ref_bottom: 607,
        y_ref_top: 497
      },
      {
        section: 7,
        y_ref_bottom: 497,
        y_ref_top: 401
      }
    ]
  },
  {
    weight: 5800,
    sections: [
      {
        section: 1,
        y_ref_bottom: 1092,
        y_ref_top: 1000
      },
      {
        section: 2,
        y_ref_bottom: 1000,
        y_ref_top: 904
      },
      {
        section: 3,
        y_ref_bottom: 904,
        y_ref_top: 809
      },
      {
        section: 4,
        y_ref_bottom: 809,
        y_ref_top: 717
      },
      {
        section: 5,
        y_ref_bottom: 717,
        y_ref_top: 624
      },
      {
        section: 6,
        y_ref_bottom: 624,
        y_ref_top: 522
      },
      {
        section: 7,
        y_ref_bottom: 522,
        y_ref_top: 430
      }
    ]
  },
  {
    weight: 5900,
    sections: [
      {
        section: 1,
        y_ref_bottom: 1110,
        y_ref_top: 1014
      },
      {
        section: 2,
        y_ref_bottom: 1014,
        y_ref_top: 919
      },
      {
        section: 3,
        y_ref_bottom: 919,
        y_ref_top: 830
      },
      {
        section: 4,
        y_ref_bottom: 830,
        y_ref_top: 738
      },
      {
        section: 5,
        y_ref_bottom: 738,
        y_ref_top: 649
      },
      {
        section: 6,
        y_ref_bottom: 649,
        y_ref_top: 543
      },
      {
        section: 7,
        y_ref_bottom: 543,
        y_ref_top: 451
      }
    ]
  },
  {
    weight: 6000,
    sections: [
      {
        section: 1,
        y_ref_bottom: 1124,
        y_ref_top: 1032
      },
      {
        section: 2,
        y_ref_bottom: 1032,
        y_ref_top: 940
      },
      {
        section: 3,
        y_ref_bottom: 940,
        y_ref_top: 848
      },
      {
        section: 4,
        y_ref_bottom: 848,
        y_ref_top: 756
      },
      {
        section: 5,
        y_ref_bottom: 756,
        y_ref_top: 670
      },
      {
        section: 6,
        y_ref_bottom: 670,
        y_ref_top: 564
      },
      {
        section: 7,
        y_ref_bottom: 564,
        y_ref_top: 476
      }
    ]
  },
  {
    weight: 6100,
    sections: [
      {
        section: 1,
        y_ref_bottom: 1138,
        y_ref_top: 1046
      },
      {
        section: 2,
        y_ref_bottom: 1046,
        y_ref_top: 954
      },
      {
        section: 3,
        y_ref_bottom: 954,
        y_ref_top: 865
      },
      {
        section: 4,
        y_ref_bottom: 865,
        y_ref_top: 773
      },
      {
        section: 5,
        y_ref_bottom: 773,
        y_ref_top: 692
      },
      {
        section: 6,
        y_ref_bottom: 692,
        y_ref_top: 585
      },
      {
        section: 7,
        y_ref_bottom: 585,
        y_ref_top: 500
      }
    ]
  },
  {
    weight: 6200,
    sections: [
      {
        section: 1,
        y_ref_bottom: 1152,
        y_ref_top: 1067
      },
      {
        section: 2,
        y_ref_bottom: 1067,
        y_ref_top: 968
      },
      {
        section: 3,
        y_ref_bottom: 968,
        y_ref_top: 883
      },
      {
        section: 4,
        y_ref_bottom: 883,
        y_ref_top: 795
      },
      {
        section: 5,
        y_ref_bottom: 795,
        y_ref_top: 709
      },
      {
        section: 6,
        y_ref_bottom: 709,
        y_ref_top: 610
      },
      {
        section: 7,
        y_ref_bottom: 610,
        y_ref_top: 525
      }
    ]
  },
  {
    weight: 6300,
    sections: [
      {
        section: 1,
        y_ref_bottom: 1163,
        y_ref_top: 1078
      },
      {
        section: 2,
        y_ref_bottom: 1078,
        y_ref_top: 986
      },
      {
        section: 3,
        y_ref_bottom: 986,
        y_ref_top: 904
      },
      {
        section: 4,
        y_ref_bottom: 904,
        y_ref_top: 809
      },
      {
        section: 5,
        y_ref_bottom: 809,
        y_ref_top: 731
      },
      {
        section: 6,
        y_ref_bottom: 731,
        y_ref_top: 632
      },
      {
        section: 7,
        y_ref_bottom: 632,
        y_ref_top: 546
      }
    ]
  },
  {
    weight: 6400,
    sections: [
      {
        section: 1,
        y_ref_bottom: 1177,
        y_ref_top: 1096
      },
      {
        section: 2,
        y_ref_bottom: 1096,
        y_ref_top: 1000
      },
      {
        section: 3,
        y_ref_bottom: 1000,
        y_ref_top: 919
      },
      {
        section: 4,
        y_ref_bottom: 919,
        y_ref_top: 826
      },
      {
        section: 5,
        y_ref_bottom: 826,
        y_ref_top: 745
      },
      {
        section: 6,
        y_ref_bottom: 745,
        y_ref_top: 653
      },
      {
        section: 7,
        y_ref_bottom: 653,
        y_ref_top: 571
      }
    ]
  },
  {
    weight: 6500,
    sections: [
      {
        section: 1,
        y_ref_bottom: 1191,
        y_ref_top: 1110
      },
      {
        section: 2,
        y_ref_bottom: 1110,
        y_ref_top: 1018
      },
      {
        section: 3,
        y_ref_bottom: 1018,
        y_ref_top: 933
      },
      {
        section: 4,
        y_ref_bottom: 933,
        y_ref_top: 844
      },
      {
        section: 5,
        y_ref_bottom: 844,
        y_ref_top: 766
      },
      {
        section: 6,
        y_ref_bottom: 766,
        y_ref_top: 674
      },
      {
        section: 7,
        y_ref_bottom: 674,
        y_ref_top: 596
      }
    ]
  }
];

// INLET ON/OFF
const INLET_TABLE = [
  {
    mode: "off",
    sections: [
      {
        section: 1,
        y_ref_bottom: 1219,
        y_ref_top: 1123
      },
      {
        section: 2,
        y_ref_bottom: 1123,
        y_ref_top: 1031
      },
      {
        section: 3,
        y_ref_bottom: 1031,
        y_ref_top: 936
      },
      {
        section: 4,
        y_ref_bottom: 936,
        y_ref_top: 847
      },
      {
        section: 5,
        y_ref_bottom: 847,
        y_ref_top: 751
      },
      {
        section: 6,
        y_ref_bottom: 751,
        y_ref_top: 659
      },
      {
        section: 7,
        y_ref_bottom: 659,
        y_ref_top: 567
      },
      {
        section: 8,
        y_ref_bottom: 567,
        y_ref_top: 475
      },
      {
        section: 9,
        y_ref_bottom: 475,
        y_ref_top: 383
      },
      {
        section: 10,
        y_ref_bottom: 383,
        y_ref_top: 291
      },
      {
        section: 11,
        y_ref_bottom: 291,
        y_ref_top: 198
      },
      {
        section: 12,
        y_ref_bottom: 198,
        y_ref_top: 110
      }
    ]
  },
  {
    mode: "on",
    sections: [
      {
        section: 1,
        y_ref_bottom: 1219,
        y_ref_top: 1155
      },
      {
        section: 2,
        y_ref_bottom: 1155,
        y_ref_top: 1067
      },
      {
        section: 3,
        y_ref_bottom: 1067,
        y_ref_top: 985
      },
      {
        section: 4,
        y_ref_bottom: 985,
        y_ref_top: 893
      },
      {
        section: 5,
        y_ref_bottom: 893,
        y_ref_top: 797
      },
      {
        section: 6,
        y_ref_bottom: 797,
        y_ref_top: 712
      },
      {
        section: 7,
        y_ref_bottom: 712,
        y_ref_top: 624
      },
      {
        section: 8,
        y_ref_bottom: 624,
        y_ref_top: 524
      },
      {
        section: 9,
        y_ref_bottom: 524,
        y_ref_top: 429
      },
      {
        section: 10,
        y_ref_bottom: 429,
        y_ref_top: 337
      },
      {
        section: 11,
        y_ref_bottom: 337,
        y_ref_top: 241
      },
      {
        section: 12,
        y_ref_bottom: 241,
        y_ref_top: 149
      }
    ]
  }
];

// RESULT TABLE — y_ref → CG (%)
const RESULT_TABLE = [
  {
    result: -3,
    section: 1,
    y_ref_bottom: 1219,
    y_ref_top: 1127
  },
  {
    result: -2,
    section: 2,
    y_ref_bottom: 1127,
    y_ref_top: 1035
  },
  {
    result: -1,
    section: 3,
    y_ref_bottom: 1035,
    y_ref_top: 939
  },
  {
    result: 0,
    section: 4,
    y_ref_bottom: 939,
    y_ref_top: 847
  },
  {
    result: 1,
    section: 5,
    y_ref_bottom: 847,
    y_ref_top: 755
  },
  {
    result: 2,
    section: 6,
    y_ref_bottom: 755,
    y_ref_top: 663
  },
  {
    result: 3,
    section: 7,
    y_ref_bottom: 663,
    y_ref_top: 571
  },
  {
    result: 4,
    section: 8,
    y_ref_bottom: 571,
    y_ref_top: 478
  },
  {
    result: 5,
    section: 9,
    y_ref_bottom: 478,
    y_ref_top: 386
  },
  {
    result: 6,
    section: 10,
    y_ref_bottom: 386,
    y_ref_top: 294
  },
  {
    result: 7,
    section: 11,
    y_ref_bottom: 294,
    y_ref_top: 202
  },
  {
    result: 8,
    section: 12,
    y_ref_bottom: 202,
    y_ref_top: 110
  }
];


// ----------------------
// 2) FUNÇÕES DE SUPORTE
// ----------------------
let DEBUG_REPORT = [];

function reportFail(msg) {
  DEBUG_REPORT.push(msg);
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function lerp(x, x1, y1, x2, y2) {
  if (x2 === x1) return y1;
  return y1 + ((x - x1) / (x2 - x1)) * (y2 - y1);
}

function findBounding(array, key, value) {
  const sorted = [...array].sort((a, b) => a[key] - b[key]);

  if (value < sorted[0][key]) {
    reportFail(`${key}=${value} está abaixo do mínimo (${sorted[0][key]})`);
    return [null, null];
  }

  if (value > sorted[sorted.length - 1][key]) {
    reportFail(`${key}=${value} está acima do máximo (${sorted[sorted.length - 1][key]})`);
    return [null, null];
  }

  for (let i = 0; i < sorted.length - 1; i++) {
    const a = sorted[i];
    const b = sorted[i + 1];
    if (value >= a[key] && value <= b[key]) return [a, b];
  }

  reportFail(`Não foi possível encontrar bounding válido para ${key}=${value}`);
  return [null, null];
}

function findSectionByY(y, sections) {
  for (const s of sections) {
    if (y <= s.y_ref_bottom && y >= s.y_ref_top) return s;
  }

  // clamp ao mais próximo
  let closest = sections[0];
  let best = Infinity;

  for (const s of sections) {
    const mid = (s.y_ref_bottom + s.y_ref_top) / 2;
    const d = Math.abs(y - mid);
    if (d < best) {
      best = d;
      closest = s;
    }
  }

  return closest;
}

function relativePositionInSection(y, section) {
  const span = section.y_ref_bottom - section.y_ref_top;
  if (span === 0) return 0;
  return (section.y_ref_bottom - y) / span; // 0 = bottom, 1 = top
}

function yFromSectionAndRelPos(section, rel) {
  return section.y_ref_bottom - rel * (section.y_ref_bottom - section.y_ref_top);
}

// ----------------------
// 3) STEP 1 — y_ref via PA/OAT
// ----------------------

function getYRefFromPAOAT(pressureAltitude, oat) {
  const [paLow, paHigh] = findBounding(PA_OAT_TABLE, "pressure_altitude", pressureAltitude);

  if (!paLow || !paHigh) {
    reportFail(`Altitude ${pressureAltitude} fora dos limites da tabela.`);
    return null;
  }

  function interpOAT(paRow) {
    const vals = [...paRow.values].sort((a, b) => a.oat - b.oat);
    const [oLow, oHigh] = findBounding(vals, "oat", oat);

    if (!oLow || !oHigh) {
      reportFail(`Temperatura ${oat} fora dos limites da tabela.`);
      return null;
    }

    if (oLow.oat === oHigh.oat) return oLow.y_ref;
    return lerp(oat, oLow.oat, oLow.y_ref, oHigh.oat, oHigh.y_ref);
  }

  const yLow = interpOAT(paLow);
  const yHigh = interpOAT(paHigh);

  if (yLow == null || yHigh == null) return null;

  if (paLow.pressure_altitude === paHigh.pressure_altitude) return yLow;

  return lerp(
    pressureAltitude,
    paLow.pressure_altitude,
    yLow,
    paHigh.pressure_altitude,
    yHigh
  );
}

// ----------------------
// 4) STEP 2/3 — mapear via sections de referência e TOW
// ----------------------

function mapYThroughWeight(yRef, tow) {
  const refSection = findSectionByY(yRef, REF_SECTIONS);
  const rel = relativePositionInSection(yRef, refSection);

  const [wLow, wHigh] = findBounding(WEIGHT_TABLE, "weight", tow);
  if (!wLow || !wHigh) {
    reportFail(`Peso ${tow} fora dos limites da tabela (min=${WEIGHT_TABLE[0].weight}, max=${WEIGHT_TABLE[WEIGHT_TABLE.length - 1].weight}).`);
    return null;
  }

  function yAtWeight(wRow) {
    const sec = wRow.sections.find(s => s.section === refSection.section);
    if (!sec) {
      reportFail(`Peso ${wRow.weight} não contém a section ${refSection.section}.`);
      return null;
    }
    return yFromSectionAndRelPos(sec, rel);
  }

  const yLow = yAtWeight(wLow);
  const yHigh = yAtWeight(wHigh);

  if (yLow == null && yHigh == null) return null;
  if (yLow == null) return yHigh;
  if (yHigh == null) return yLow;

  if (wLow.weight === wHigh.weight) return yLow;

  return lerp(tow, wLow.weight, yLow, wHigh.weight, yHigh);
}

// ----------------------
// 5) STEP 4 — inlet ON/OFF
// ----------------------

function mapYThroughInlet(yWeight, inletMode) {
  const offRow = INLET_TABLE.find(r => r.mode === "off");
  const onRow = INLET_TABLE.find(r => r.mode === "on");

  if (inletMode === "off") {
    // OFF não altera nada
    return yWeight;
  }

  if (inletMode !== "on") {
    reportFail(`Modo inlet inválido: ${inletMode}`);
    return null;
  }

  // --- inlet ON ---
  // 1) encontrar section correspondente no modo OFF
  const offSec = findSectionByY(yWeight, offRow.sections);

  // 2) posição relativa dentro da section OFF
  const rel = relativePositionInSection(yWeight, offSec);

  // 3) aplicar a mesma section no modo ON
  const onSec = onRow.sections.find(s => s.section === offSec.section);

  if (!onSec) {
    reportFail(`Section ${offSec.section} não existe no modo ON.`);
    return null;
  }

  // 4) calcular novo Y no modo ON
  return yFromSectionAndRelPos(onSec, rel);
}

// ----------------------
// 6) STEP 5 — resultado final
// ----------------------

function getClimbGradientFromY(y) {
  if (y == null || isNaN(y)) {
  reportFail("Valor Y inválido após processamento.");
  return null;
}
  
  const sorted = [...RESULT_TABLE].sort((a, b) => b.y_ref_bottom - a.y_ref_bottom);

  // Fora dos limites → clamp
  if (y >= sorted[0].y_ref_bottom) return sorted[0].result;
  if (y <= sorted[sorted.length - 1].y_ref_top)
    return sorted[sorted.length - 1].result;

  for (let i = 0; i < sorted.length; i++) {
    const r = sorted[i];

    // Se o y está dentro da section → interpolação contínua
    if (y <= r.y_ref_bottom && y >= r.y_ref_top) {
      const nextResult = (i < sorted.length - 1) ? sorted[i + 1].result : r.result;
      return lerp(
        y,
        r.y_ref_bottom, r.result,
        r.y_ref_top, nextResult
      );
    }

    // Se está entre duas sections → interpolação entre sections
    if (i < sorted.length - 1) {
      const rNext = sorted[i + 1];
      if (y < r.y_ref_top && y > rNext.y_ref_bottom) {
        return lerp(
          y,
          r.y_ref_top, r.result,
          rNext.y_ref_bottom, rNext.result
        );
      }
    }
  }

  return sorted[sorted.length - 1].result;
}

// ---------------------------------------------------------
// 4) FUNÇÃO PRINCIPAL — CLIMB GRADIENTE 3º SEGMENTO
// ---------------------------------------------------------

export function CLIMB_GRADIENTE_4SEG_FlapsUp({ pressureAltitude, oat, tow, inlet, gradientRequired }) {
  DEBUG_REPORT = []; // limpar relatório
	// STEP 1 — y_ref via PA/OAT
  const yRef = getYRefFromPAOAT(pressureAltitude, oat);
  if (yRef == null) return { gradient: 0, status: "FAILED", report: DEBUG_REPORT };
  
	// STEP 2/3 — ajustar via sections de referência + peso
  const yAfterWeight = mapYThroughWeight(yRef, tow);
  if (yAfterWeight == null) return { gradient: 0, status: "FAILED", report: DEBUG_REPORT };
  
  // STEP 4 — inlet ON/OFF
  const yAfterInlet = mapYThroughInlet(yAfterWeight, inlet);
  if (yAfterInlet == null) return { gradient: 0, status: "FAILED", report: DEBUG_REPORT };
  
	// STEP 5 — resultado final
  const gradient = getClimbGradientFromY(yAfterInlet);
  if (gradient == null) return { gradient: 0, status: "FAILED", report: DEBUG_REPORT };
  

  const rounded = Math.round(gradient * 10) / 10;
  
  if (rounded < gradientRequired) {
    reportFail(`Gradient ${rounded}% está abaixo do mínimo (${gradientRequired}%).`);
    return { gradient: rounded, status: "FAILED", report: DEBUG_REPORT };
  }

  return {
    gradient: rounded,
    status: "PASSED",
    report: DEBUG_REPORT
  };
}
// Export default
export default CLIMB_GRADIENTE_4SEG_FlapsUp;