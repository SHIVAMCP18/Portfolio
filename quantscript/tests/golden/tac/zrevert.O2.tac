== initial TAC (68 instructions) ==
func on_open:
  0   TICK
func on_close:
  0   t1 = LOADFIELD close             ; price
  1   SPUSH $close, t1
  2   t3 = BARS_GT 19                  ; bool
  3   JZ t3, L1
  4   t4 = ROLLMEAN $close, 20         ; price
  5   t2 = COPY t4                     ; price
  6   JMP L2
  7 L1:
  8   t2 = CONST 0.0                   ; price
  9 L2:
 10   SPUSH $m, t2
 11   t6 = BARS_GT 19                  ; bool
 12   JZ t6, L3
 13   t7 = ROLLSTD $close, 20          ; price
 14   t5 = COPY t7                     ; price
 15   JMP L4
 16 L3:
 17   t5 = CONST 0.0                   ; price
 18 L4:
 19   SPUSH $sd, t5
 20   t8 = BARS_GT 19                  ; bool
 21   JZ t8, L5
 22   t9 = HIST $close, 0              ; price
 23   t10 = HIST $m, 0                 ; price
 24   t11 = SUB t9, t10                ; price
 25   t12 = HIST $sd, 0                ; price
 26   t13 = DIV t11, t12               ; scalar
 27   t14 = PARAM %entry               ; scalar
 28   t15 = NEG t14                    ; scalar
 29   t16 = LT t13, t15                ; bool
 30   JZ t16, L6
 31   t18 = SLOAD @pos                 ; volume
 32   t19 = CONST 0.0                  ; volume
 33   t20 = EQ t18, t19                ; bool
 34   t17 = COPY t20                   ; bool
 35   JMP L7
 36 L6:
 37   t17 = CONST 0.0                  ; bool
 38 L7:
 39   JZ t17, L8
 40   t21 = CONST 50.0                 ; volume
 41   BUY t21
 42   t22 = CONST 50.0                 ; volume
 43   SSTORE @pos, t22
 44 L8:
 45   t23 = PARAM %entry               ; scalar
 46   t24 = GT t13, t23                ; bool
 47   JZ t24, L9
 48   t26 = SLOAD @pos                 ; volume
 49   t27 = CONST 0.0                  ; volume
 50   t28 = EQ t26, t27                ; bool
 51   t25 = COPY t28                   ; bool
 52   JMP L10
 53 L9:
 54   t25 = CONST 0.0                  ; bool
 55 L10:
 56   JZ t25, L11
 57   t29 = CONST 50.0                 ; volume
 58   SELL t29
 59   t30 = CONST 50.0                 ; volume
 60   t31 = NEG t30                    ; volume
 61   SSTORE @pos, t31
 62 L11:
 63   t32 = ABS t13                    ; scalar
 64   t33 = CONST 0.2                  ; scalar
 65   t34 = LT t32, t33                ; bool
 66   JZ t34, L12
 67   t36 = SLOAD @pos                 ; volume
 68   t37 = CONST 0.0                  ; volume
 69   t38 = NE t36, t37                ; bool
 70   t35 = COPY t38                   ; bool
 71   JMP L13
 72 L12:
 73   t35 = CONST 0.0                  ; bool
 74 L13:
 75   JZ t35, L14
 76   FLATTEN
 77   t39 = CONST 0.0                  ; volume
 78   SSTORE @pos, t39
 79 L14:
 80 L5:
== after fold: 68 -> 68 instructions, 1 rewritten ==
func on_open:
  0   TICK
func on_close:
  0   t1 = LOADFIELD close             ; price
  1   SPUSH $close, t1
  2   t3 = BARS_GT 19                  ; bool
  3   JZ t3, L1
  4   t4 = ROLLMEAN $close, 20         ; price
  5   t2 = COPY t4                     ; price
  6   JMP L2
  7 L1:
  8   t2 = CONST 0.0                   ; price
  9 L2:
 10   SPUSH $m, t2
 11   t6 = BARS_GT 19                  ; bool
 12   JZ t6, L3
 13   t7 = ROLLSTD $close, 20          ; price
 14   t5 = COPY t7                     ; price
 15   JMP L4
 16 L3:
 17   t5 = CONST 0.0                   ; price
 18 L4:
 19   SPUSH $sd, t5
 20   t8 = BARS_GT 19                  ; bool
 21   JZ t8, L5
 22   t9 = HIST $close, 0              ; price
 23   t10 = HIST $m, 0                 ; price
 24   t11 = SUB t9, t10                ; price
 25   t12 = HIST $sd, 0                ; price
 26   t13 = DIV t11, t12               ; scalar
 27   t14 = PARAM %entry               ; scalar
 28   t15 = NEG t14                    ; scalar
 29   t16 = LT t13, t15                ; bool
 30   JZ t16, L6
 31   t18 = SLOAD @pos                 ; volume
 32   t19 = CONST 0.0                  ; volume
 33   t20 = EQ t18, t19                ; bool
 34   t17 = COPY t20                   ; bool
 35   JMP L7
 36 L6:
 37   t17 = CONST 0.0                  ; bool
 38 L7:
 39   JZ t17, L8
 40   t21 = CONST 50.0                 ; volume
 41   BUY t21
 42   t22 = CONST 50.0                 ; volume
 43   SSTORE @pos, t22
 44 L8:
 45   t23 = PARAM %entry               ; scalar
 46   t24 = GT t13, t23                ; bool
 47   JZ t24, L9
 48   t26 = SLOAD @pos                 ; volume
 49   t27 = CONST 0.0                  ; volume
 50   t28 = EQ t26, t27                ; bool
 51   t25 = COPY t28                   ; bool
 52   JMP L10
 53 L9:
 54   t25 = CONST 0.0                  ; bool
 55 L10:
 56   JZ t25, L11
 57   t29 = CONST 50.0                 ; volume
 58   SELL t29
 59   t30 = CONST 50.0                 ; volume
 60   t31 = CONST -50.0                ; volume
 61   SSTORE @pos, t31
 62 L11:
 63   t32 = ABS t13                    ; scalar
 64   t33 = CONST 0.2                  ; scalar
 65   t34 = LT t32, t33                ; bool
 66   JZ t34, L12
 67   t36 = SLOAD @pos                 ; volume
 68   t37 = CONST 0.0                  ; volume
 69   t38 = NE t36, t37                ; bool
 70   t35 = COPY t38                   ; bool
 71   JMP L13
 72 L12:
 73   t35 = CONST 0.0                  ; bool
 74 L13:
 75   JZ t35, L14
 76   FLATTEN
 77   t39 = CONST 0.0                  ; volume
 78   SSTORE @pos, t39
 79 L14:
 80 L5:
== after algebraic: 68 -> 68 instructions, 0 rewritten ==
func on_open:
  0   TICK
func on_close:
  0   t1 = LOADFIELD close             ; price
  1   SPUSH $close, t1
  2   t3 = BARS_GT 19                  ; bool
  3   JZ t3, L1
  4   t4 = ROLLMEAN $close, 20         ; price
  5   t2 = COPY t4                     ; price
  6   JMP L2
  7 L1:
  8   t2 = CONST 0.0                   ; price
  9 L2:
 10   SPUSH $m, t2
 11   t6 = BARS_GT 19                  ; bool
 12   JZ t6, L3
 13   t7 = ROLLSTD $close, 20          ; price
 14   t5 = COPY t7                     ; price
 15   JMP L4
 16 L3:
 17   t5 = CONST 0.0                   ; price
 18 L4:
 19   SPUSH $sd, t5
 20   t8 = BARS_GT 19                  ; bool
 21   JZ t8, L5
 22   t9 = HIST $close, 0              ; price
 23   t10 = HIST $m, 0                 ; price
 24   t11 = SUB t9, t10                ; price
 25   t12 = HIST $sd, 0                ; price
 26   t13 = DIV t11, t12               ; scalar
 27   t14 = PARAM %entry               ; scalar
 28   t15 = NEG t14                    ; scalar
 29   t16 = LT t13, t15                ; bool
 30   JZ t16, L6
 31   t18 = SLOAD @pos                 ; volume
 32   t19 = CONST 0.0                  ; volume
 33   t20 = EQ t18, t19                ; bool
 34   t17 = COPY t20                   ; bool
 35   JMP L7
 36 L6:
 37   t17 = CONST 0.0                  ; bool
 38 L7:
 39   JZ t17, L8
 40   t21 = CONST 50.0                 ; volume
 41   BUY t21
 42   t22 = CONST 50.0                 ; volume
 43   SSTORE @pos, t22
 44 L8:
 45   t23 = PARAM %entry               ; scalar
 46   t24 = GT t13, t23                ; bool
 47   JZ t24, L9
 48   t26 = SLOAD @pos                 ; volume
 49   t27 = CONST 0.0                  ; volume
 50   t28 = EQ t26, t27                ; bool
 51   t25 = COPY t28                   ; bool
 52   JMP L10
 53 L9:
 54   t25 = CONST 0.0                  ; bool
 55 L10:
 56   JZ t25, L11
 57   t29 = CONST 50.0                 ; volume
 58   SELL t29
 59   t30 = CONST 50.0                 ; volume
 60   t31 = CONST -50.0                ; volume
 61   SSTORE @pos, t31
 62 L11:
 63   t32 = ABS t13                    ; scalar
 64   t33 = CONST 0.2                  ; scalar
 65   t34 = LT t32, t33                ; bool
 66   JZ t34, L12
 67   t36 = SLOAD @pos                 ; volume
 68   t37 = CONST 0.0                  ; volume
 69   t38 = NE t36, t37                ; bool
 70   t35 = COPY t38                   ; bool
 71   JMP L13
 72 L12:
 73   t35 = CONST 0.0                  ; bool
 74 L13:
 75   JZ t35, L14
 76   FLATTEN
 77   t39 = CONST 0.0                  ; volume
 78   SSTORE @pos, t39
 79 L14:
 80 L5:
== after propagate: 68 -> 68 instructions, 9 rewritten, data-flow sweeps <= 2 ==
func on_open:
  0   TICK
func on_close:
  0   t1 = LOADFIELD close             ; price
  1   SPUSH $close, t1
  2   t3 = BARS_GT 19                  ; bool
  3   JZ t3, L1
  4   t4 = ROLLMEAN $close, 20         ; price
  5   t2 = COPY t4                     ; price
  6   JMP L2
  7 L1:
  8   t2 = CONST 0.0                   ; price
  9 L2:
 10   SPUSH $m, t2
 11   t6 = BARS_GT 19                  ; bool
 12   JZ t6, L3
 13   t7 = ROLLSTD $close, 20          ; price
 14   t5 = COPY t7                     ; price
 15   JMP L4
 16 L3:
 17   t5 = CONST 0.0                   ; price
 18 L4:
 19   SPUSH $sd, t5
 20   t8 = BARS_GT 19                  ; bool
 21   JZ t8, L5
 22   t9 = HIST $close, 0              ; price
 23   t10 = HIST $m, 0                 ; price
 24   t11 = SUB t9, t10                ; price
 25   t12 = HIST $sd, 0                ; price
 26   t13 = DIV t11, t12               ; scalar
 27   t14 = PARAM %entry               ; scalar
 28   t15 = NEG t14                    ; scalar
 29   t16 = LT t13, t15                ; bool
 30   JZ t16, L6
 31   t18 = SLOAD @pos                 ; volume
 32   t19 = CONST 0.0                  ; volume
 33   t20 = EQ t18, 0.0                ; bool
 34   t17 = COPY t20                   ; bool
 35   JMP L7
 36 L6:
 37   t17 = CONST 0.0                  ; bool
 38 L7:
 39   JZ t17, L8
 40   t21 = CONST 50.0                 ; volume
 41   BUY 50.0
 42   t22 = CONST 50.0                 ; volume
 43   SSTORE @pos, 50.0
 44 L8:
 45   t23 = PARAM %entry               ; scalar
 46   t24 = GT t13, t23                ; bool
 47   JZ t24, L9
 48   t26 = SLOAD @pos                 ; volume
 49   t27 = CONST 0.0                  ; volume
 50   t28 = EQ t26, 0.0                ; bool
 51   t25 = COPY t28                   ; bool
 52   JMP L10
 53 L9:
 54   t25 = CONST 0.0                  ; bool
 55 L10:
 56   JZ t25, L11
 57   t29 = CONST 50.0                 ; volume
 58   SELL 50.0
 59   t30 = CONST 50.0                 ; volume
 60   t31 = CONST -50.0                ; volume
 61   SSTORE @pos, -50.0
 62 L11:
 63   t32 = ABS t13                    ; scalar
 64   t33 = CONST 0.2                  ; scalar
 65   t34 = LT t32, 0.2                ; bool
 66   JZ t34, L12
 67   t36 = SLOAD @pos                 ; volume
 68   t37 = CONST 0.0                  ; volume
 69   t38 = NE t36, 0.0                ; bool
 70   t35 = COPY t38                   ; bool
 71   JMP L13
 72 L12:
 73   t35 = CONST 0.0                  ; bool
 74 L13:
 75   JZ t35, L14
 76   FLATTEN
 77   t39 = CONST 0.0                  ; volume
 78   SSTORE @pos, 0.0
 79 L14:
 80 L5:
== after lvn-cse: 68 -> 68 instructions, 2 rewritten ==
func on_open:
  0   TICK
func on_close:
  0   t1 = LOADFIELD close             ; price
  1   SPUSH $close, t1
  2   t3 = BARS_GT 19                  ; bool
  3   JZ t3, L1
  4   t4 = ROLLMEAN $close, 20         ; price
  5   t2 = COPY t4                     ; price
  6   JMP L2
  7 L1:
  8   t2 = CONST 0.0                   ; price
  9 L2:
 10   SPUSH $m, t2
 11   t6 = BARS_GT 19                  ; bool
 12   JZ t6, L3
 13   t7 = ROLLSTD $close, 20          ; price
 14   t5 = COPY t7                     ; price
 15   JMP L4
 16 L3:
 17   t5 = CONST 0.0                   ; price
 18 L4:
 19   SPUSH $sd, t5
 20   t8 = BARS_GT 19                  ; bool
 21   JZ t8, L5
 22   t9 = HIST $close, 0              ; price
 23   t10 = HIST $m, 0                 ; price
 24   t11 = SUB t9, t10                ; price
 25   t12 = HIST $sd, 0                ; price
 26   t13 = DIV t11, t12               ; scalar
 27   t14 = PARAM %entry               ; scalar
 28   t15 = NEG t14                    ; scalar
 29   t16 = LT t13, t15                ; bool
 30   JZ t16, L6
 31   t18 = SLOAD @pos                 ; volume
 32   t19 = CONST 0.0                  ; volume
 33   t20 = EQ t18, 0.0                ; bool
 34   t17 = COPY t20                   ; bool
 35   JMP L7
 36 L6:
 37   t17 = CONST 0.0                  ; bool
 38 L7:
 39   JZ t17, L8
 40   t21 = CONST 50.0                 ; volume
 41   BUY 50.0
 42   t22 = COPY t21                   ; volume
 43   SSTORE @pos, 50.0
 44 L8:
 45   t23 = PARAM %entry               ; scalar
 46   t24 = GT t13, t23                ; bool
 47   JZ t24, L9
 48   t26 = SLOAD @pos                 ; volume
 49   t27 = CONST 0.0                  ; volume
 50   t28 = EQ t26, 0.0                ; bool
 51   t25 = COPY t28                   ; bool
 52   JMP L10
 53 L9:
 54   t25 = CONST 0.0                  ; bool
 55 L10:
 56   JZ t25, L11
 57   t29 = CONST 50.0                 ; volume
 58   SELL 50.0
 59   t30 = COPY t29                   ; volume
 60   t31 = CONST -50.0                ; volume
 61   SSTORE @pos, -50.0
 62 L11:
 63   t32 = ABS t13                    ; scalar
 64   t33 = CONST 0.2                  ; scalar
 65   t34 = LT t32, 0.2                ; bool
 66   JZ t34, L12
 67   t36 = SLOAD @pos                 ; volume
 68   t37 = CONST 0.0                  ; volume
 69   t38 = NE t36, 0.0                ; bool
 70   t35 = COPY t38                   ; bool
 71   JMP L13
 72 L12:
 73   t35 = CONST 0.0                  ; bool
 74 L13:
 75   JZ t35, L14
 76   FLATTEN
 77   t39 = CONST 0.0                  ; volume
 78   SSTORE @pos, 0.0
 79 L14:
 80 L5:
== after global-cse: 68 -> 68 instructions, 6 rewritten, data-flow sweeps <= 2 ==
func on_open:
  0   TICK
func on_close:
  0   t1 = LOADFIELD close             ; price
  1   SPUSH $close, t1
  2   t3 = BARS_GT 19                  ; bool
  3   JZ t3, L1
  4   t4 = ROLLMEAN $close, 20         ; price
  5   t2 = COPY t4                     ; price
  6   JMP L2
  7 L1:
  8   t2 = CONST 0.0                   ; price
  9 L2:
 10   SPUSH $m, t2
 11   t6 = COPY t3                     ; bool
 12   JZ t6, L3
 13   t7 = ROLLSTD $close, 20          ; price
 14   t5 = COPY t7                     ; price
 15   JMP L4
 16 L3:
 17   t5 = CONST 0.0                   ; price
 18 L4:
 19   SPUSH $sd, t5
 20   t8 = COPY t3                     ; bool
 21   JZ t8, L5
 22   t9 = COPY t1                     ; price
 23   t10 = COPY t2                    ; price
 24   t11 = SUB t9, t10                ; price
 25   t12 = COPY t5                    ; price
 26   t13 = DIV t11, t12               ; scalar
 27   t14 = PARAM %entry               ; scalar
 28   t15 = NEG t14                    ; scalar
 29   t16 = LT t13, t15                ; bool
 30   JZ t16, L6
 31   t18 = SLOAD @pos                 ; volume
 32   t19 = CONST 0.0                  ; volume
 33   t20 = EQ t18, 0.0                ; bool
 34   t17 = COPY t20                   ; bool
 35   JMP L7
 36 L6:
 37   t17 = CONST 0.0                  ; bool
 38 L7:
 39   JZ t17, L8
 40   t21 = CONST 50.0                 ; volume
 41   BUY 50.0
 42   t22 = COPY t21                   ; volume
 43   SSTORE @pos, 50.0
 44 L8:
 45   t23 = COPY t14                   ; scalar
 46   t24 = GT t13, t23                ; bool
 47   JZ t24, L9
 48   t26 = SLOAD @pos                 ; volume
 49   t27 = CONST 0.0                  ; volume
 50   t28 = EQ t26, 0.0                ; bool
 51   t25 = COPY t28                   ; bool
 52   JMP L10
 53 L9:
 54   t25 = CONST 0.0                  ; bool
 55 L10:
 56   JZ t25, L11
 57   t29 = CONST 50.0                 ; volume
 58   SELL 50.0
 59   t30 = COPY t29                   ; volume
 60   t31 = CONST -50.0                ; volume
 61   SSTORE @pos, -50.0
 62 L11:
 63   t32 = ABS t13                    ; scalar
 64   t33 = CONST 0.2                  ; scalar
 65   t34 = LT t32, 0.2                ; bool
 66   JZ t34, L12
 67   t36 = SLOAD @pos                 ; volume
 68   t37 = CONST 0.0                  ; volume
 69   t38 = NE t36, 0.0                ; bool
 70   t35 = COPY t38                   ; bool
 71   JMP L13
 72 L12:
 73   t35 = CONST 0.0                  ; bool
 74 L13:
 75   JZ t35, L14
 76   FLATTEN
 77   t39 = CONST 0.0                  ; volume
 78   SSTORE @pos, 0.0
 79 L14:
 80 L5:
== after dce: 68 -> 58 instructions, 10 rewritten, data-flow sweeps <= 2 ==
func on_open:
  0   TICK
func on_close:
  0   t1 = LOADFIELD close             ; price
  1   SPUSH $close, t1
  2   t3 = BARS_GT 19                  ; bool
  3   JZ t3, L1
  4   t4 = ROLLMEAN $close, 20         ; price
  5   t2 = COPY t4                     ; price
  6   JMP L2
  7 L1:
  8   t2 = CONST 0.0                   ; price
  9 L2:
 10   SPUSH $m, t2
 11   t6 = COPY t3                     ; bool
 12   JZ t6, L3
 13   t7 = ROLLSTD $close, 20          ; price
 14   t5 = COPY t7                     ; price
 15   JMP L4
 16 L3:
 17   t5 = CONST 0.0                   ; price
 18 L4:
 19   SPUSH $sd, t5
 20   t8 = COPY t3                     ; bool
 21   JZ t8, L5
 22   t9 = COPY t1                     ; price
 23   t10 = COPY t2                    ; price
 24   t11 = SUB t9, t10                ; price
 25   t12 = COPY t5                    ; price
 26   t13 = DIV t11, t12               ; scalar
 27   t14 = PARAM %entry               ; scalar
 28   t15 = NEG t14                    ; scalar
 29   t16 = LT t13, t15                ; bool
 30   JZ t16, L6
 31   t18 = SLOAD @pos                 ; volume
 32   t20 = EQ t18, 0.0                ; bool
 33   t17 = COPY t20                   ; bool
 34   JMP L7
 35 L6:
 36   t17 = CONST 0.0                  ; bool
 37 L7:
 38   JZ t17, L8
 39   BUY 50.0
 40   SSTORE @pos, 50.0
 41 L8:
 42   t23 = COPY t14                   ; scalar
 43   t24 = GT t13, t23                ; bool
 44   JZ t24, L9
 45   t26 = SLOAD @pos                 ; volume
 46   t28 = EQ t26, 0.0                ; bool
 47   t25 = COPY t28                   ; bool
 48   JMP L10
 49 L9:
 50   t25 = CONST 0.0                  ; bool
 51 L10:
 52   JZ t25, L11
 53   SELL 50.0
 54   SSTORE @pos, -50.0
 55 L11:
 56   t32 = ABS t13                    ; scalar
 57   t34 = LT t32, 0.2                ; bool
 58   JZ t34, L12
 59   t36 = SLOAD @pos                 ; volume
 60   t38 = NE t36, 0.0                ; bool
 61   t35 = COPY t38                   ; bool
 62   JMP L13
 63 L12:
 64   t35 = CONST 0.0                  ; bool
 65 L13:
 66   JZ t35, L14
 67   FLATTEN
 68   SSTORE @pos, 0.0
 69 L14:
 70 L5:
== after window-sr: 58 -> 61 instructions, 4 rewritten ==
func on_open:
  0   TICK
func on_close:
  0   t1 = LOADFIELD close             ; price
  1   SPUSH $close, t1
  2   RSUM_UPD &sum_close_20, $close, 20
  3   RSQ_UPD &sumsq_close_20, $close, 20
  4   t3 = BARS_GT 19                  ; bool
  5   JZ t3, L1
  6   t40 = ALOAD &sum_close_20        ; price
  7   t4 = DIV t40, 20.0               ; price
  8   t2 = COPY t4                     ; price
  9   JMP L2
 10 L1:
 11   t2 = CONST 0.0                   ; price
 12 L2:
 13   SPUSH $m, t2
 14   t6 = COPY t3                     ; bool
 15   JZ t6, L3
 16   t7 = RSTD &sum_close_20, &sumsq_close_20, 20 ; price
 17   t5 = COPY t7                     ; price
 18   JMP L4
 19 L3:
 20   t5 = CONST 0.0                   ; price
 21 L4:
 22   SPUSH $sd, t5
 23   t8 = COPY t3                     ; bool
 24   JZ t8, L5
 25   t9 = COPY t1                     ; price
 26   t10 = COPY t2                    ; price
 27   t11 = SUB t9, t10                ; price
 28   t12 = COPY t5                    ; price
 29   t13 = DIV t11, t12               ; scalar
 30   t14 = PARAM %entry               ; scalar
 31   t15 = NEG t14                    ; scalar
 32   t16 = LT t13, t15                ; bool
 33   JZ t16, L6
 34   t18 = SLOAD @pos                 ; volume
 35   t20 = EQ t18, 0.0                ; bool
 36   t17 = COPY t20                   ; bool
 37   JMP L7
 38 L6:
 39   t17 = CONST 0.0                  ; bool
 40 L7:
 41   JZ t17, L8
 42   BUY 50.0
 43   SSTORE @pos, 50.0
 44 L8:
 45   t23 = COPY t14                   ; scalar
 46   t24 = GT t13, t23                ; bool
 47   JZ t24, L9
 48   t26 = SLOAD @pos                 ; volume
 49   t28 = EQ t26, 0.0                ; bool
 50   t25 = COPY t28                   ; bool
 51   JMP L10
 52 L9:
 53   t25 = CONST 0.0                  ; bool
 54 L10:
 55   JZ t25, L11
 56   SELL 50.0
 57   SSTORE @pos, -50.0
 58 L11:
 59   t32 = ABS t13                    ; scalar
 60   t34 = LT t32, 0.2                ; bool
 61   JZ t34, L12
 62   t36 = SLOAD @pos                 ; volume
 63   t38 = NE t36, 0.0                ; bool
 64   t35 = COPY t38                   ; bool
 65   JMP L13
 66 L12:
 67   t35 = CONST 0.0                  ; bool
 68 L13:
 69   JZ t35, L14
 70   FLATTEN
 71   SSTORE @pos, 0.0
 72 L14:
 73 L5:
== after peephole: 61 -> 61 instructions, 0 rewritten ==
func on_open:
  0   TICK
func on_close:
  0   t1 = LOADFIELD close             ; price
  1   SPUSH $close, t1
  2   RSUM_UPD &sum_close_20, $close, 20
  3   RSQ_UPD &sumsq_close_20, $close, 20
  4   t3 = BARS_GT 19                  ; bool
  5   JZ t3, L1
  6   t40 = ALOAD &sum_close_20        ; price
  7   t4 = DIV t40, 20.0               ; price
  8   t2 = COPY t4                     ; price
  9   JMP L2
 10 L1:
 11   t2 = CONST 0.0                   ; price
 12 L2:
 13   SPUSH $m, t2
 14   t6 = COPY t3                     ; bool
 15   JZ t6, L3
 16   t7 = RSTD &sum_close_20, &sumsq_close_20, 20 ; price
 17   t5 = COPY t7                     ; price
 18   JMP L4
 19 L3:
 20   t5 = CONST 0.0                   ; price
 21 L4:
 22   SPUSH $sd, t5
 23   t8 = COPY t3                     ; bool
 24   JZ t8, L5
 25   t9 = COPY t1                     ; price
 26   t10 = COPY t2                    ; price
 27   t11 = SUB t9, t10                ; price
 28   t12 = COPY t5                    ; price
 29   t13 = DIV t11, t12               ; scalar
 30   t14 = PARAM %entry               ; scalar
 31   t15 = NEG t14                    ; scalar
 32   t16 = LT t13, t15                ; bool
 33   JZ t16, L6
 34   t18 = SLOAD @pos                 ; volume
 35   t20 = EQ t18, 0.0                ; bool
 36   t17 = COPY t20                   ; bool
 37   JMP L7
 38 L6:
 39   t17 = CONST 0.0                  ; bool
 40 L7:
 41   JZ t17, L8
 42   BUY 50.0
 43   SSTORE @pos, 50.0
 44 L8:
 45   t23 = COPY t14                   ; scalar
 46   t24 = GT t13, t23                ; bool
 47   JZ t24, L9
 48   t26 = SLOAD @pos                 ; volume
 49   t28 = EQ t26, 0.0                ; bool
 50   t25 = COPY t28                   ; bool
 51   JMP L10
 52 L9:
 53   t25 = CONST 0.0                  ; bool
 54 L10:
 55   JZ t25, L11
 56   SELL 50.0
 57   SSTORE @pos, -50.0
 58 L11:
 59   t32 = ABS t13                    ; scalar
 60   t34 = LT t32, 0.2                ; bool
 61   JZ t34, L12
 62   t36 = SLOAD @pos                 ; volume
 63   t38 = NE t36, 0.0                ; bool
 64   t35 = COPY t38                   ; bool
 65   JMP L13
 66 L12:
 67   t35 = CONST 0.0                  ; bool
 68 L13:
 69   JZ t35, L14
 70   FLATTEN
 71   SSTORE @pos, 0.0
 72 L14:
 73 L5:
== after fold#2: 61 -> 61 instructions, 0 rewritten ==
func on_open:
  0   TICK
func on_close:
  0   t1 = LOADFIELD close             ; price
  1   SPUSH $close, t1
  2   RSUM_UPD &sum_close_20, $close, 20
  3   RSQ_UPD &sumsq_close_20, $close, 20
  4   t3 = BARS_GT 19                  ; bool
  5   JZ t3, L1
  6   t40 = ALOAD &sum_close_20        ; price
  7   t4 = DIV t40, 20.0               ; price
  8   t2 = COPY t4                     ; price
  9   JMP L2
 10 L1:
 11   t2 = CONST 0.0                   ; price
 12 L2:
 13   SPUSH $m, t2
 14   t6 = COPY t3                     ; bool
 15   JZ t6, L3
 16   t7 = RSTD &sum_close_20, &sumsq_close_20, 20 ; price
 17   t5 = COPY t7                     ; price
 18   JMP L4
 19 L3:
 20   t5 = CONST 0.0                   ; price
 21 L4:
 22   SPUSH $sd, t5
 23   t8 = COPY t3                     ; bool
 24   JZ t8, L5
 25   t9 = COPY t1                     ; price
 26   t10 = COPY t2                    ; price
 27   t11 = SUB t9, t10                ; price
 28   t12 = COPY t5                    ; price
 29   t13 = DIV t11, t12               ; scalar
 30   t14 = PARAM %entry               ; scalar
 31   t15 = NEG t14                    ; scalar
 32   t16 = LT t13, t15                ; bool
 33   JZ t16, L6
 34   t18 = SLOAD @pos                 ; volume
 35   t20 = EQ t18, 0.0                ; bool
 36   t17 = COPY t20                   ; bool
 37   JMP L7
 38 L6:
 39   t17 = CONST 0.0                  ; bool
 40 L7:
 41   JZ t17, L8
 42   BUY 50.0
 43   SSTORE @pos, 50.0
 44 L8:
 45   t23 = COPY t14                   ; scalar
 46   t24 = GT t13, t23                ; bool
 47   JZ t24, L9
 48   t26 = SLOAD @pos                 ; volume
 49   t28 = EQ t26, 0.0                ; bool
 50   t25 = COPY t28                   ; bool
 51   JMP L10
 52 L9:
 53   t25 = CONST 0.0                  ; bool
 54 L10:
 55   JZ t25, L11
 56   SELL 50.0
 57   SSTORE @pos, -50.0
 58 L11:
 59   t32 = ABS t13                    ; scalar
 60   t34 = LT t32, 0.2                ; bool
 61   JZ t34, L12
 62   t36 = SLOAD @pos                 ; volume
 63   t38 = NE t36, 0.0                ; bool
 64   t35 = COPY t38                   ; bool
 65   JMP L13
 66 L12:
 67   t35 = CONST 0.0                  ; bool
 68 L13:
 69   JZ t35, L14
 70   FLATTEN
 71   SSTORE @pos, 0.0
 72 L14:
 73 L5:
== after propagate#2: 61 -> 61 instructions, 6 rewritten, data-flow sweeps <= 2 ==
func on_open:
  0   TICK
func on_close:
  0   t1 = LOADFIELD close             ; price
  1   SPUSH $close, t1
  2   RSUM_UPD &sum_close_20, $close, 20
  3   RSQ_UPD &sumsq_close_20, $close, 20
  4   t3 = BARS_GT 19                  ; bool
  5   JZ t3, L1
  6   t40 = ALOAD &sum_close_20        ; price
  7   t4 = DIV t40, 20.0               ; price
  8   t2 = COPY t4                     ; price
  9   JMP L2
 10 L1:
 11   t2 = CONST 0.0                   ; price
 12 L2:
 13   SPUSH $m, t2
 14   t6 = COPY t3                     ; bool
 15   JZ t3, L3
 16   t7 = RSTD &sum_close_20, &sumsq_close_20, 20 ; price
 17   t5 = COPY t7                     ; price
 18   JMP L4
 19 L3:
 20   t5 = CONST 0.0                   ; price
 21 L4:
 22   SPUSH $sd, t5
 23   t8 = COPY t3                     ; bool
 24   JZ t3, L5
 25   t9 = COPY t1                     ; price
 26   t10 = COPY t2                    ; price
 27   t11 = SUB t1, t2                 ; price
 28   t12 = COPY t5                    ; price
 29   t13 = DIV t11, t5                ; scalar
 30   t14 = PARAM %entry               ; scalar
 31   t15 = NEG t14                    ; scalar
 32   t16 = LT t13, t15                ; bool
 33   JZ t16, L6
 34   t18 = SLOAD @pos                 ; volume
 35   t20 = EQ t18, 0.0                ; bool
 36   t17 = COPY t20                   ; bool
 37   JMP L7
 38 L6:
 39   t17 = CONST 0.0                  ; bool
 40 L7:
 41   JZ t17, L8
 42   BUY 50.0
 43   SSTORE @pos, 50.0
 44 L8:
 45   t23 = COPY t14                   ; scalar
 46   t24 = GT t13, t14                ; bool
 47   JZ t24, L9
 48   t26 = SLOAD @pos                 ; volume
 49   t28 = EQ t26, 0.0                ; bool
 50   t25 = COPY t28                   ; bool
 51   JMP L10
 52 L9:
 53   t25 = CONST 0.0                  ; bool
 54 L10:
 55   JZ t25, L11
 56   SELL 50.0
 57   SSTORE @pos, -50.0
 58 L11:
 59   t32 = ABS t13                    ; scalar
 60   t34 = LT t32, 0.2                ; bool
 61   JZ t34, L12
 62   t36 = SLOAD @pos                 ; volume
 63   t38 = NE t36, 0.0                ; bool
 64   t35 = COPY t38                   ; bool
 65   JMP L13
 66 L12:
 67   t35 = CONST 0.0                  ; bool
 68 L13:
 69   JZ t35, L14
 70   FLATTEN
 71   SSTORE @pos, 0.0
 72 L14:
 73 L5:
== after lvn-cse#2: 61 -> 61 instructions, 0 rewritten ==
func on_open:
  0   TICK
func on_close:
  0   t1 = LOADFIELD close             ; price
  1   SPUSH $close, t1
  2   RSUM_UPD &sum_close_20, $close, 20
  3   RSQ_UPD &sumsq_close_20, $close, 20
  4   t3 = BARS_GT 19                  ; bool
  5   JZ t3, L1
  6   t40 = ALOAD &sum_close_20        ; price
  7   t4 = DIV t40, 20.0               ; price
  8   t2 = COPY t4                     ; price
  9   JMP L2
 10 L1:
 11   t2 = CONST 0.0                   ; price
 12 L2:
 13   SPUSH $m, t2
 14   t6 = COPY t3                     ; bool
 15   JZ t3, L3
 16   t7 = RSTD &sum_close_20, &sumsq_close_20, 20 ; price
 17   t5 = COPY t7                     ; price
 18   JMP L4
 19 L3:
 20   t5 = CONST 0.0                   ; price
 21 L4:
 22   SPUSH $sd, t5
 23   t8 = COPY t3                     ; bool
 24   JZ t3, L5
 25   t9 = COPY t1                     ; price
 26   t10 = COPY t2                    ; price
 27   t11 = SUB t1, t2                 ; price
 28   t12 = COPY t5                    ; price
 29   t13 = DIV t11, t5                ; scalar
 30   t14 = PARAM %entry               ; scalar
 31   t15 = NEG t14                    ; scalar
 32   t16 = LT t13, t15                ; bool
 33   JZ t16, L6
 34   t18 = SLOAD @pos                 ; volume
 35   t20 = EQ t18, 0.0                ; bool
 36   t17 = COPY t20                   ; bool
 37   JMP L7
 38 L6:
 39   t17 = CONST 0.0                  ; bool
 40 L7:
 41   JZ t17, L8
 42   BUY 50.0
 43   SSTORE @pos, 50.0
 44 L8:
 45   t23 = COPY t14                   ; scalar
 46   t24 = GT t13, t14                ; bool
 47   JZ t24, L9
 48   t26 = SLOAD @pos                 ; volume
 49   t28 = EQ t26, 0.0                ; bool
 50   t25 = COPY t28                   ; bool
 51   JMP L10
 52 L9:
 53   t25 = CONST 0.0                  ; bool
 54 L10:
 55   JZ t25, L11
 56   SELL 50.0
 57   SSTORE @pos, -50.0
 58 L11:
 59   t32 = ABS t13                    ; scalar
 60   t34 = LT t32, 0.2                ; bool
 61   JZ t34, L12
 62   t36 = SLOAD @pos                 ; volume
 63   t38 = NE t36, 0.0                ; bool
 64   t35 = COPY t38                   ; bool
 65   JMP L13
 66 L12:
 67   t35 = CONST 0.0                  ; bool
 68 L13:
 69   JZ t35, L14
 70   FLATTEN
 71   SSTORE @pos, 0.0
 72 L14:
 73 L5:
== after global-cse#2: 61 -> 61 instructions, 0 rewritten, data-flow sweeps <= 2 ==
func on_open:
  0   TICK
func on_close:
  0   t1 = LOADFIELD close             ; price
  1   SPUSH $close, t1
  2   RSUM_UPD &sum_close_20, $close, 20
  3   RSQ_UPD &sumsq_close_20, $close, 20
  4   t3 = BARS_GT 19                  ; bool
  5   JZ t3, L1
  6   t40 = ALOAD &sum_close_20        ; price
  7   t4 = DIV t40, 20.0               ; price
  8   t2 = COPY t4                     ; price
  9   JMP L2
 10 L1:
 11   t2 = CONST 0.0                   ; price
 12 L2:
 13   SPUSH $m, t2
 14   t6 = COPY t3                     ; bool
 15   JZ t3, L3
 16   t7 = RSTD &sum_close_20, &sumsq_close_20, 20 ; price
 17   t5 = COPY t7                     ; price
 18   JMP L4
 19 L3:
 20   t5 = CONST 0.0                   ; price
 21 L4:
 22   SPUSH $sd, t5
 23   t8 = COPY t3                     ; bool
 24   JZ t3, L5
 25   t9 = COPY t1                     ; price
 26   t10 = COPY t2                    ; price
 27   t11 = SUB t1, t2                 ; price
 28   t12 = COPY t5                    ; price
 29   t13 = DIV t11, t5                ; scalar
 30   t14 = PARAM %entry               ; scalar
 31   t15 = NEG t14                    ; scalar
 32   t16 = LT t13, t15                ; bool
 33   JZ t16, L6
 34   t18 = SLOAD @pos                 ; volume
 35   t20 = EQ t18, 0.0                ; bool
 36   t17 = COPY t20                   ; bool
 37   JMP L7
 38 L6:
 39   t17 = CONST 0.0                  ; bool
 40 L7:
 41   JZ t17, L8
 42   BUY 50.0
 43   SSTORE @pos, 50.0
 44 L8:
 45   t23 = COPY t14                   ; scalar
 46   t24 = GT t13, t14                ; bool
 47   JZ t24, L9
 48   t26 = SLOAD @pos                 ; volume
 49   t28 = EQ t26, 0.0                ; bool
 50   t25 = COPY t28                   ; bool
 51   JMP L10
 52 L9:
 53   t25 = CONST 0.0                  ; bool
 54 L10:
 55   JZ t25, L11
 56   SELL 50.0
 57   SSTORE @pos, -50.0
 58 L11:
 59   t32 = ABS t13                    ; scalar
 60   t34 = LT t32, 0.2                ; bool
 61   JZ t34, L12
 62   t36 = SLOAD @pos                 ; volume
 63   t38 = NE t36, 0.0                ; bool
 64   t35 = COPY t38                   ; bool
 65   JMP L13
 66 L12:
 67   t35 = CONST 0.0                  ; bool
 68 L13:
 69   JZ t35, L14
 70   FLATTEN
 71   SSTORE @pos, 0.0
 72 L14:
 73 L5:
== after dce#2: 61 -> 55 instructions, 6 rewritten, data-flow sweeps <= 2 ==
func on_open:
  0   TICK
func on_close:
  0   t1 = LOADFIELD close             ; price
  1   SPUSH $close, t1
  2   RSUM_UPD &sum_close_20, $close, 20
  3   RSQ_UPD &sumsq_close_20, $close, 20
  4   t3 = BARS_GT 19                  ; bool
  5   JZ t3, L1
  6   t40 = ALOAD &sum_close_20        ; price
  7   t4 = DIV t40, 20.0               ; price
  8   t2 = COPY t4                     ; price
  9   JMP L2
 10 L1:
 11   t2 = CONST 0.0                   ; price
 12 L2:
 13   SPUSH $m, t2
 14   JZ t3, L3
 15   t7 = RSTD &sum_close_20, &sumsq_close_20, 20 ; price
 16   t5 = COPY t7                     ; price
 17   JMP L4
 18 L3:
 19   t5 = CONST 0.0                   ; price
 20 L4:
 21   SPUSH $sd, t5
 22   JZ t3, L5
 23   t11 = SUB t1, t2                 ; price
 24   t13 = DIV t11, t5                ; scalar
 25   t14 = PARAM %entry               ; scalar
 26   t15 = NEG t14                    ; scalar
 27   t16 = LT t13, t15                ; bool
 28   JZ t16, L6
 29   t18 = SLOAD @pos                 ; volume
 30   t20 = EQ t18, 0.0                ; bool
 31   t17 = COPY t20                   ; bool
 32   JMP L7
 33 L6:
 34   t17 = CONST 0.0                  ; bool
 35 L7:
 36   JZ t17, L8
 37   BUY 50.0
 38   SSTORE @pos, 50.0
 39 L8:
 40   t24 = GT t13, t14                ; bool
 41   JZ t24, L9
 42   t26 = SLOAD @pos                 ; volume
 43   t28 = EQ t26, 0.0                ; bool
 44   t25 = COPY t28                   ; bool
 45   JMP L10
 46 L9:
 47   t25 = CONST 0.0                  ; bool
 48 L10:
 49   JZ t25, L11
 50   SELL 50.0
 51   SSTORE @pos, -50.0
 52 L11:
 53   t32 = ABS t13                    ; scalar
 54   t34 = LT t32, 0.2                ; bool
 55   JZ t34, L12
 56   t36 = SLOAD @pos                 ; volume
 57   t38 = NE t36, 0.0                ; bool
 58   t35 = COPY t38                   ; bool
 59   JMP L13
 60 L12:
 61   t35 = CONST 0.0                  ; bool
 62 L13:
 63   JZ t35, L14
 64   FLATTEN
 65   SSTORE @pos, 0.0
 66 L14:
 67 L5:
== final TAC (55 instructions) ==
func on_open:
  0   TICK
func on_close:
  0   t1 = LOADFIELD close             ; price
  1   SPUSH $close, t1
  2   RSUM_UPD &sum_close_20, $close, 20
  3   RSQ_UPD &sumsq_close_20, $close, 20
  4   t3 = BARS_GT 19                  ; bool
  5   JZ t3, L1
  6   t40 = ALOAD &sum_close_20        ; price
  7   t4 = DIV t40, 20.0               ; price
  8   t2 = COPY t4                     ; price
  9   JMP L2
 10 L1:
 11   t2 = CONST 0.0                   ; price
 12 L2:
 13   SPUSH $m, t2
 14   JZ t3, L3
 15   t7 = RSTD &sum_close_20, &sumsq_close_20, 20 ; price
 16   t5 = COPY t7                     ; price
 17   JMP L4
 18 L3:
 19   t5 = CONST 0.0                   ; price
 20 L4:
 21   SPUSH $sd, t5
 22   JZ t3, L5
 23   t11 = SUB t1, t2                 ; price
 24   t13 = DIV t11, t5                ; scalar
 25   t14 = PARAM %entry               ; scalar
 26   t15 = NEG t14                    ; scalar
 27   t16 = LT t13, t15                ; bool
 28   JZ t16, L6
 29   t18 = SLOAD @pos                 ; volume
 30   t20 = EQ t18, 0.0                ; bool
 31   t17 = COPY t20                   ; bool
 32   JMP L7
 33 L6:
 34   t17 = CONST 0.0                  ; bool
 35 L7:
 36   JZ t17, L8
 37   BUY 50.0
 38   SSTORE @pos, 50.0
 39 L8:
 40   t24 = GT t13, t14                ; bool
 41   JZ t24, L9
 42   t26 = SLOAD @pos                 ; volume
 43   t28 = EQ t26, 0.0                ; bool
 44   t25 = COPY t28                   ; bool
 45   JMP L10
 46 L9:
 47   t25 = CONST 0.0                  ; bool
 48 L10:
 49   JZ t25, L11
 50   SELL 50.0
 51   SSTORE @pos, -50.0
 52 L11:
 53   t32 = ABS t13                    ; scalar
 54   t34 = LT t32, 0.2                ; bool
 55   JZ t34, L12
 56   t36 = SLOAD @pos                 ; volume
 57   t38 = NE t36, 0.0                ; bool
 58   t35 = COPY t38                   ; bool
 59   JMP L13
 60 L12:
 61   t35 = CONST 0.0                  ; bool
 62 L13:
 63   JZ t35, L14
 64   FLATTEN
 65   SSTORE @pos, 0.0
 66 L14:
 67 L5:
