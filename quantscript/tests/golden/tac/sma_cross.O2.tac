== initial TAC (56 instructions) ==
func on_open:
  0   TICK
func on_close:
  0   t1 = LOADFIELD close             ; price
  1   SPUSH $close, t1
  2   t3 = BARS_GT 9                   ; bool
  3   JZ t3, L1
  4   t4 = ROLLMEAN $close, 10         ; price
  5   t2 = COPY t4                     ; price
  6   JMP L2
  7 L1:
  8   t2 = CONST 0.0                   ; price
  9 L2:
 10   SPUSH $fast, t2
 11   t6 = BARS_GT 29                  ; bool
 12   JZ t6, L3
 13   t7 = ROLLMEAN $close, 30         ; price
 14   t5 = COPY t7                     ; price
 15   JMP L4
 16 L3:
 17   t5 = CONST 0.0                   ; price
 18 L4:
 19   SPUSH $slow, t5
 20   t8 = BARS_GT 30                  ; bool
 21   JZ t8, L5
 22   t9 = HIST $fast, 0               ; price
 23   t10 = HIST $slow, 0              ; price
 24   t11 = HIST $fast, 1              ; price
 25   t12 = HIST $slow, 1              ; price
 26   t13 = GT t9, t10                 ; bool
 27   t14 = LE t11, t12                ; bool
 28   t15 = AND t13, t14               ; bool
 29   JZ t15, L6
 30   t17 = SLOAD @position            ; volume
 31   t18 = CONST 0.0                  ; volume
 32   t19 = EQ t17, t18                ; bool
 33   t16 = COPY t19                   ; bool
 34   JMP L7
 35 L6:
 36   t16 = CONST 0.0                  ; bool
 37 L7:
 38   JZ t16, L8
 39   t20 = CONST 100.0                ; volume
 40   BUY t20
 41   t21 = CONST 100.0                ; volume
 42   SSTORE @position, t21
 43 L8:
 44   t22 = HIST $fast, 0              ; price
 45   t23 = HIST $slow, 0              ; price
 46   t24 = HIST $fast, 1              ; price
 47   t25 = HIST $slow, 1              ; price
 48   t26 = LT t22, t23                ; bool
 49   t27 = GE t24, t25                ; bool
 50   t28 = AND t26, t27               ; bool
 51   JZ t28, L9
 52   t30 = SLOAD @position            ; volume
 53   t31 = CONST 0.0                  ; volume
 54   t32 = GT t30, t31                ; bool
 55   t29 = COPY t32                   ; bool
 56   JMP L10
 57 L9:
 58   t29 = CONST 0.0                  ; bool
 59 L10:
 60   JZ t29, L11
 61   FLATTEN
 62   t33 = CONST 0.0                  ; volume
 63   SSTORE @position, t33
 64 L11:
 65 L5:
== after fold: 56 -> 56 instructions, 0 rewritten ==
func on_open:
  0   TICK
func on_close:
  0   t1 = LOADFIELD close             ; price
  1   SPUSH $close, t1
  2   t3 = BARS_GT 9                   ; bool
  3   JZ t3, L1
  4   t4 = ROLLMEAN $close, 10         ; price
  5   t2 = COPY t4                     ; price
  6   JMP L2
  7 L1:
  8   t2 = CONST 0.0                   ; price
  9 L2:
 10   SPUSH $fast, t2
 11   t6 = BARS_GT 29                  ; bool
 12   JZ t6, L3
 13   t7 = ROLLMEAN $close, 30         ; price
 14   t5 = COPY t7                     ; price
 15   JMP L4
 16 L3:
 17   t5 = CONST 0.0                   ; price
 18 L4:
 19   SPUSH $slow, t5
 20   t8 = BARS_GT 30                  ; bool
 21   JZ t8, L5
 22   t9 = HIST $fast, 0               ; price
 23   t10 = HIST $slow, 0              ; price
 24   t11 = HIST $fast, 1              ; price
 25   t12 = HIST $slow, 1              ; price
 26   t13 = GT t9, t10                 ; bool
 27   t14 = LE t11, t12                ; bool
 28   t15 = AND t13, t14               ; bool
 29   JZ t15, L6
 30   t17 = SLOAD @position            ; volume
 31   t18 = CONST 0.0                  ; volume
 32   t19 = EQ t17, t18                ; bool
 33   t16 = COPY t19                   ; bool
 34   JMP L7
 35 L6:
 36   t16 = CONST 0.0                  ; bool
 37 L7:
 38   JZ t16, L8
 39   t20 = CONST 100.0                ; volume
 40   BUY t20
 41   t21 = CONST 100.0                ; volume
 42   SSTORE @position, t21
 43 L8:
 44   t22 = HIST $fast, 0              ; price
 45   t23 = HIST $slow, 0              ; price
 46   t24 = HIST $fast, 1              ; price
 47   t25 = HIST $slow, 1              ; price
 48   t26 = LT t22, t23                ; bool
 49   t27 = GE t24, t25                ; bool
 50   t28 = AND t26, t27               ; bool
 51   JZ t28, L9
 52   t30 = SLOAD @position            ; volume
 53   t31 = CONST 0.0                  ; volume
 54   t32 = GT t30, t31                ; bool
 55   t29 = COPY t32                   ; bool
 56   JMP L10
 57 L9:
 58   t29 = CONST 0.0                  ; bool
 59 L10:
 60   JZ t29, L11
 61   FLATTEN
 62   t33 = CONST 0.0                  ; volume
 63   SSTORE @position, t33
 64 L11:
 65 L5:
== after algebraic: 56 -> 56 instructions, 0 rewritten ==
func on_open:
  0   TICK
func on_close:
  0   t1 = LOADFIELD close             ; price
  1   SPUSH $close, t1
  2   t3 = BARS_GT 9                   ; bool
  3   JZ t3, L1
  4   t4 = ROLLMEAN $close, 10         ; price
  5   t2 = COPY t4                     ; price
  6   JMP L2
  7 L1:
  8   t2 = CONST 0.0                   ; price
  9 L2:
 10   SPUSH $fast, t2
 11   t6 = BARS_GT 29                  ; bool
 12   JZ t6, L3
 13   t7 = ROLLMEAN $close, 30         ; price
 14   t5 = COPY t7                     ; price
 15   JMP L4
 16 L3:
 17   t5 = CONST 0.0                   ; price
 18 L4:
 19   SPUSH $slow, t5
 20   t8 = BARS_GT 30                  ; bool
 21   JZ t8, L5
 22   t9 = HIST $fast, 0               ; price
 23   t10 = HIST $slow, 0              ; price
 24   t11 = HIST $fast, 1              ; price
 25   t12 = HIST $slow, 1              ; price
 26   t13 = GT t9, t10                 ; bool
 27   t14 = LE t11, t12                ; bool
 28   t15 = AND t13, t14               ; bool
 29   JZ t15, L6
 30   t17 = SLOAD @position            ; volume
 31   t18 = CONST 0.0                  ; volume
 32   t19 = EQ t17, t18                ; bool
 33   t16 = COPY t19                   ; bool
 34   JMP L7
 35 L6:
 36   t16 = CONST 0.0                  ; bool
 37 L7:
 38   JZ t16, L8
 39   t20 = CONST 100.0                ; volume
 40   BUY t20
 41   t21 = CONST 100.0                ; volume
 42   SSTORE @position, t21
 43 L8:
 44   t22 = HIST $fast, 0              ; price
 45   t23 = HIST $slow, 0              ; price
 46   t24 = HIST $fast, 1              ; price
 47   t25 = HIST $slow, 1              ; price
 48   t26 = LT t22, t23                ; bool
 49   t27 = GE t24, t25                ; bool
 50   t28 = AND t26, t27               ; bool
 51   JZ t28, L9
 52   t30 = SLOAD @position            ; volume
 53   t31 = CONST 0.0                  ; volume
 54   t32 = GT t30, t31                ; bool
 55   t29 = COPY t32                   ; bool
 56   JMP L10
 57 L9:
 58   t29 = CONST 0.0                  ; bool
 59 L10:
 60   JZ t29, L11
 61   FLATTEN
 62   t33 = CONST 0.0                  ; volume
 63   SSTORE @position, t33
 64 L11:
 65 L5:
== after propagate: 56 -> 56 instructions, 5 rewritten, data-flow sweeps <= 2 ==
func on_open:
  0   TICK
func on_close:
  0   t1 = LOADFIELD close             ; price
  1   SPUSH $close, t1
  2   t3 = BARS_GT 9                   ; bool
  3   JZ t3, L1
  4   t4 = ROLLMEAN $close, 10         ; price
  5   t2 = COPY t4                     ; price
  6   JMP L2
  7 L1:
  8   t2 = CONST 0.0                   ; price
  9 L2:
 10   SPUSH $fast, t2
 11   t6 = BARS_GT 29                  ; bool
 12   JZ t6, L3
 13   t7 = ROLLMEAN $close, 30         ; price
 14   t5 = COPY t7                     ; price
 15   JMP L4
 16 L3:
 17   t5 = CONST 0.0                   ; price
 18 L4:
 19   SPUSH $slow, t5
 20   t8 = BARS_GT 30                  ; bool
 21   JZ t8, L5
 22   t9 = HIST $fast, 0               ; price
 23   t10 = HIST $slow, 0              ; price
 24   t11 = HIST $fast, 1              ; price
 25   t12 = HIST $slow, 1              ; price
 26   t13 = GT t9, t10                 ; bool
 27   t14 = LE t11, t12                ; bool
 28   t15 = AND t13, t14               ; bool
 29   JZ t15, L6
 30   t17 = SLOAD @position            ; volume
 31   t18 = CONST 0.0                  ; volume
 32   t19 = EQ t17, 0.0                ; bool
 33   t16 = COPY t19                   ; bool
 34   JMP L7
 35 L6:
 36   t16 = CONST 0.0                  ; bool
 37 L7:
 38   JZ t16, L8
 39   t20 = CONST 100.0                ; volume
 40   BUY 100.0
 41   t21 = CONST 100.0                ; volume
 42   SSTORE @position, 100.0
 43 L8:
 44   t22 = HIST $fast, 0              ; price
 45   t23 = HIST $slow, 0              ; price
 46   t24 = HIST $fast, 1              ; price
 47   t25 = HIST $slow, 1              ; price
 48   t26 = LT t22, t23                ; bool
 49   t27 = GE t24, t25                ; bool
 50   t28 = AND t26, t27               ; bool
 51   JZ t28, L9
 52   t30 = SLOAD @position            ; volume
 53   t31 = CONST 0.0                  ; volume
 54   t32 = GT t30, 0.0                ; bool
 55   t29 = COPY t32                   ; bool
 56   JMP L10
 57 L9:
 58   t29 = CONST 0.0                  ; bool
 59 L10:
 60   JZ t29, L11
 61   FLATTEN
 62   t33 = CONST 0.0                  ; volume
 63   SSTORE @position, 0.0
 64 L11:
 65 L5:
== after lvn-cse: 56 -> 56 instructions, 1 rewritten ==
func on_open:
  0   TICK
func on_close:
  0   t1 = LOADFIELD close             ; price
  1   SPUSH $close, t1
  2   t3 = BARS_GT 9                   ; bool
  3   JZ t3, L1
  4   t4 = ROLLMEAN $close, 10         ; price
  5   t2 = COPY t4                     ; price
  6   JMP L2
  7 L1:
  8   t2 = CONST 0.0                   ; price
  9 L2:
 10   SPUSH $fast, t2
 11   t6 = BARS_GT 29                  ; bool
 12   JZ t6, L3
 13   t7 = ROLLMEAN $close, 30         ; price
 14   t5 = COPY t7                     ; price
 15   JMP L4
 16 L3:
 17   t5 = CONST 0.0                   ; price
 18 L4:
 19   SPUSH $slow, t5
 20   t8 = BARS_GT 30                  ; bool
 21   JZ t8, L5
 22   t9 = HIST $fast, 0               ; price
 23   t10 = HIST $slow, 0              ; price
 24   t11 = HIST $fast, 1              ; price
 25   t12 = HIST $slow, 1              ; price
 26   t13 = GT t9, t10                 ; bool
 27   t14 = LE t11, t12                ; bool
 28   t15 = AND t13, t14               ; bool
 29   JZ t15, L6
 30   t17 = SLOAD @position            ; volume
 31   t18 = CONST 0.0                  ; volume
 32   t19 = EQ t17, 0.0                ; bool
 33   t16 = COPY t19                   ; bool
 34   JMP L7
 35 L6:
 36   t16 = CONST 0.0                  ; bool
 37 L7:
 38   JZ t16, L8
 39   t20 = CONST 100.0                ; volume
 40   BUY 100.0
 41   t21 = COPY t20                   ; volume
 42   SSTORE @position, 100.0
 43 L8:
 44   t22 = HIST $fast, 0              ; price
 45   t23 = HIST $slow, 0              ; price
 46   t24 = HIST $fast, 1              ; price
 47   t25 = HIST $slow, 1              ; price
 48   t26 = LT t22, t23                ; bool
 49   t27 = GE t24, t25                ; bool
 50   t28 = AND t26, t27               ; bool
 51   JZ t28, L9
 52   t30 = SLOAD @position            ; volume
 53   t31 = CONST 0.0                  ; volume
 54   t32 = GT t30, 0.0                ; bool
 55   t29 = COPY t32                   ; bool
 56   JMP L10
 57 L9:
 58   t29 = CONST 0.0                  ; bool
 59 L10:
 60   JZ t29, L11
 61   FLATTEN
 62   t33 = CONST 0.0                  ; volume
 63   SSTORE @position, 0.0
 64 L11:
 65 L5:
== after global-cse: 56 -> 56 instructions, 6 rewritten, data-flow sweeps <= 2 ==
func on_open:
  0   TICK
func on_close:
  0   t1 = LOADFIELD close             ; price
  1   SPUSH $close, t1
  2   t3 = BARS_GT 9                   ; bool
  3   JZ t3, L1
  4   t4 = ROLLMEAN $close, 10         ; price
  5   t2 = COPY t4                     ; price
  6   JMP L2
  7 L1:
  8   t2 = CONST 0.0                   ; price
  9 L2:
 10   SPUSH $fast, t2
 11   t6 = BARS_GT 29                  ; bool
 12   JZ t6, L3
 13   t7 = ROLLMEAN $close, 30         ; price
 14   t5 = COPY t7                     ; price
 15   JMP L4
 16 L3:
 17   t5 = CONST 0.0                   ; price
 18 L4:
 19   SPUSH $slow, t5
 20   t8 = BARS_GT 30                  ; bool
 21   JZ t8, L5
 22   t9 = COPY t2                     ; price
 23   t10 = COPY t5                    ; price
 24   t11 = HIST $fast, 1              ; price
 25   t12 = HIST $slow, 1              ; price
 26   t13 = GT t9, t10                 ; bool
 27   t14 = LE t11, t12                ; bool
 28   t15 = AND t13, t14               ; bool
 29   JZ t15, L6
 30   t17 = SLOAD @position            ; volume
 31   t18 = CONST 0.0                  ; volume
 32   t19 = EQ t17, 0.0                ; bool
 33   t16 = COPY t19                   ; bool
 34   JMP L7
 35 L6:
 36   t16 = CONST 0.0                  ; bool
 37 L7:
 38   JZ t16, L8
 39   t20 = CONST 100.0                ; volume
 40   BUY 100.0
 41   t21 = COPY t20                   ; volume
 42   SSTORE @position, 100.0
 43 L8:
 44   t22 = COPY t2                    ; price
 45   t23 = COPY t5                    ; price
 46   t24 = COPY t11                   ; price
 47   t25 = COPY t12                   ; price
 48   t26 = LT t22, t23                ; bool
 49   t27 = GE t24, t25                ; bool
 50   t28 = AND t26, t27               ; bool
 51   JZ t28, L9
 52   t30 = SLOAD @position            ; volume
 53   t31 = CONST 0.0                  ; volume
 54   t32 = GT t30, 0.0                ; bool
 55   t29 = COPY t32                   ; bool
 56   JMP L10
 57 L9:
 58   t29 = CONST 0.0                  ; bool
 59 L10:
 60   JZ t29, L11
 61   FLATTEN
 62   t33 = CONST 0.0                  ; volume
 63   SSTORE @position, 0.0
 64 L11:
 65 L5:
== after dce: 56 -> 51 instructions, 5 rewritten, data-flow sweeps <= 2 ==
func on_open:
  0   TICK
func on_close:
  0   t1 = LOADFIELD close             ; price
  1   SPUSH $close, t1
  2   t3 = BARS_GT 9                   ; bool
  3   JZ t3, L1
  4   t4 = ROLLMEAN $close, 10         ; price
  5   t2 = COPY t4                     ; price
  6   JMP L2
  7 L1:
  8   t2 = CONST 0.0                   ; price
  9 L2:
 10   SPUSH $fast, t2
 11   t6 = BARS_GT 29                  ; bool
 12   JZ t6, L3
 13   t7 = ROLLMEAN $close, 30         ; price
 14   t5 = COPY t7                     ; price
 15   JMP L4
 16 L3:
 17   t5 = CONST 0.0                   ; price
 18 L4:
 19   SPUSH $slow, t5
 20   t8 = BARS_GT 30                  ; bool
 21   JZ t8, L5
 22   t9 = COPY t2                     ; price
 23   t10 = COPY t5                    ; price
 24   t11 = HIST $fast, 1              ; price
 25   t12 = HIST $slow, 1              ; price
 26   t13 = GT t9, t10                 ; bool
 27   t14 = LE t11, t12                ; bool
 28   t15 = AND t13, t14               ; bool
 29   JZ t15, L6
 30   t17 = SLOAD @position            ; volume
 31   t19 = EQ t17, 0.0                ; bool
 32   t16 = COPY t19                   ; bool
 33   JMP L7
 34 L6:
 35   t16 = CONST 0.0                  ; bool
 36 L7:
 37   JZ t16, L8
 38   BUY 100.0
 39   SSTORE @position, 100.0
 40 L8:
 41   t22 = COPY t2                    ; price
 42   t23 = COPY t5                    ; price
 43   t24 = COPY t11                   ; price
 44   t25 = COPY t12                   ; price
 45   t26 = LT t22, t23                ; bool
 46   t27 = GE t24, t25                ; bool
 47   t28 = AND t26, t27               ; bool
 48   JZ t28, L9
 49   t30 = SLOAD @position            ; volume
 50   t32 = GT t30, 0.0                ; bool
 51   t29 = COPY t32                   ; bool
 52   JMP L10
 53 L9:
 54   t29 = CONST 0.0                  ; bool
 55 L10:
 56   JZ t29, L11
 57   FLATTEN
 58   SSTORE @position, 0.0
 59 L11:
 60 L5:
== after window-sr: 51 -> 55 instructions, 4 rewritten ==
func on_open:
  0   TICK
func on_close:
  0   t1 = LOADFIELD close             ; price
  1   SPUSH $close, t1
  2   RSUM_UPD &sum_close_10, $close, 10
  3   RSUM_UPD &sum_close_30, $close, 30
  4   t3 = BARS_GT 9                   ; bool
  5   JZ t3, L1
  6   t34 = ALOAD &sum_close_10        ; price
  7   t4 = DIV t34, 10.0               ; price
  8   t2 = COPY t4                     ; price
  9   JMP L2
 10 L1:
 11   t2 = CONST 0.0                   ; price
 12 L2:
 13   SPUSH $fast, t2
 14   t6 = BARS_GT 29                  ; bool
 15   JZ t6, L3
 16   t35 = ALOAD &sum_close_30        ; price
 17   t7 = DIV t35, 30.0               ; price
 18   t5 = COPY t7                     ; price
 19   JMP L4
 20 L3:
 21   t5 = CONST 0.0                   ; price
 22 L4:
 23   SPUSH $slow, t5
 24   t8 = BARS_GT 30                  ; bool
 25   JZ t8, L5
 26   t9 = COPY t2                     ; price
 27   t10 = COPY t5                    ; price
 28   t11 = HIST $fast, 1              ; price
 29   t12 = HIST $slow, 1              ; price
 30   t13 = GT t9, t10                 ; bool
 31   t14 = LE t11, t12                ; bool
 32   t15 = AND t13, t14               ; bool
 33   JZ t15, L6
 34   t17 = SLOAD @position            ; volume
 35   t19 = EQ t17, 0.0                ; bool
 36   t16 = COPY t19                   ; bool
 37   JMP L7
 38 L6:
 39   t16 = CONST 0.0                  ; bool
 40 L7:
 41   JZ t16, L8
 42   BUY 100.0
 43   SSTORE @position, 100.0
 44 L8:
 45   t22 = COPY t2                    ; price
 46   t23 = COPY t5                    ; price
 47   t24 = COPY t11                   ; price
 48   t25 = COPY t12                   ; price
 49   t26 = LT t22, t23                ; bool
 50   t27 = GE t24, t25                ; bool
 51   t28 = AND t26, t27               ; bool
 52   JZ t28, L9
 53   t30 = SLOAD @position            ; volume
 54   t32 = GT t30, 0.0                ; bool
 55   t29 = COPY t32                   ; bool
 56   JMP L10
 57 L9:
 58   t29 = CONST 0.0                  ; bool
 59 L10:
 60   JZ t29, L11
 61   FLATTEN
 62   SSTORE @position, 0.0
 63 L11:
 64 L5:
== after peephole: 55 -> 55 instructions, 0 rewritten ==
func on_open:
  0   TICK
func on_close:
  0   t1 = LOADFIELD close             ; price
  1   SPUSH $close, t1
  2   RSUM_UPD &sum_close_10, $close, 10
  3   RSUM_UPD &sum_close_30, $close, 30
  4   t3 = BARS_GT 9                   ; bool
  5   JZ t3, L1
  6   t34 = ALOAD &sum_close_10        ; price
  7   t4 = DIV t34, 10.0               ; price
  8   t2 = COPY t4                     ; price
  9   JMP L2
 10 L1:
 11   t2 = CONST 0.0                   ; price
 12 L2:
 13   SPUSH $fast, t2
 14   t6 = BARS_GT 29                  ; bool
 15   JZ t6, L3
 16   t35 = ALOAD &sum_close_30        ; price
 17   t7 = DIV t35, 30.0               ; price
 18   t5 = COPY t7                     ; price
 19   JMP L4
 20 L3:
 21   t5 = CONST 0.0                   ; price
 22 L4:
 23   SPUSH $slow, t5
 24   t8 = BARS_GT 30                  ; bool
 25   JZ t8, L5
 26   t9 = COPY t2                     ; price
 27   t10 = COPY t5                    ; price
 28   t11 = HIST $fast, 1              ; price
 29   t12 = HIST $slow, 1              ; price
 30   t13 = GT t9, t10                 ; bool
 31   t14 = LE t11, t12                ; bool
 32   t15 = AND t13, t14               ; bool
 33   JZ t15, L6
 34   t17 = SLOAD @position            ; volume
 35   t19 = EQ t17, 0.0                ; bool
 36   t16 = COPY t19                   ; bool
 37   JMP L7
 38 L6:
 39   t16 = CONST 0.0                  ; bool
 40 L7:
 41   JZ t16, L8
 42   BUY 100.0
 43   SSTORE @position, 100.0
 44 L8:
 45   t22 = COPY t2                    ; price
 46   t23 = COPY t5                    ; price
 47   t24 = COPY t11                   ; price
 48   t25 = COPY t12                   ; price
 49   t26 = LT t22, t23                ; bool
 50   t27 = GE t24, t25                ; bool
 51   t28 = AND t26, t27               ; bool
 52   JZ t28, L9
 53   t30 = SLOAD @position            ; volume
 54   t32 = GT t30, 0.0                ; bool
 55   t29 = COPY t32                   ; bool
 56   JMP L10
 57 L9:
 58   t29 = CONST 0.0                  ; bool
 59 L10:
 60   JZ t29, L11
 61   FLATTEN
 62   SSTORE @position, 0.0
 63 L11:
 64 L5:
== after fold#2: 55 -> 55 instructions, 0 rewritten ==
func on_open:
  0   TICK
func on_close:
  0   t1 = LOADFIELD close             ; price
  1   SPUSH $close, t1
  2   RSUM_UPD &sum_close_10, $close, 10
  3   RSUM_UPD &sum_close_30, $close, 30
  4   t3 = BARS_GT 9                   ; bool
  5   JZ t3, L1
  6   t34 = ALOAD &sum_close_10        ; price
  7   t4 = DIV t34, 10.0               ; price
  8   t2 = COPY t4                     ; price
  9   JMP L2
 10 L1:
 11   t2 = CONST 0.0                   ; price
 12 L2:
 13   SPUSH $fast, t2
 14   t6 = BARS_GT 29                  ; bool
 15   JZ t6, L3
 16   t35 = ALOAD &sum_close_30        ; price
 17   t7 = DIV t35, 30.0               ; price
 18   t5 = COPY t7                     ; price
 19   JMP L4
 20 L3:
 21   t5 = CONST 0.0                   ; price
 22 L4:
 23   SPUSH $slow, t5
 24   t8 = BARS_GT 30                  ; bool
 25   JZ t8, L5
 26   t9 = COPY t2                     ; price
 27   t10 = COPY t5                    ; price
 28   t11 = HIST $fast, 1              ; price
 29   t12 = HIST $slow, 1              ; price
 30   t13 = GT t9, t10                 ; bool
 31   t14 = LE t11, t12                ; bool
 32   t15 = AND t13, t14               ; bool
 33   JZ t15, L6
 34   t17 = SLOAD @position            ; volume
 35   t19 = EQ t17, 0.0                ; bool
 36   t16 = COPY t19                   ; bool
 37   JMP L7
 38 L6:
 39   t16 = CONST 0.0                  ; bool
 40 L7:
 41   JZ t16, L8
 42   BUY 100.0
 43   SSTORE @position, 100.0
 44 L8:
 45   t22 = COPY t2                    ; price
 46   t23 = COPY t5                    ; price
 47   t24 = COPY t11                   ; price
 48   t25 = COPY t12                   ; price
 49   t26 = LT t22, t23                ; bool
 50   t27 = GE t24, t25                ; bool
 51   t28 = AND t26, t27               ; bool
 52   JZ t28, L9
 53   t30 = SLOAD @position            ; volume
 54   t32 = GT t30, 0.0                ; bool
 55   t29 = COPY t32                   ; bool
 56   JMP L10
 57 L9:
 58   t29 = CONST 0.0                  ; bool
 59 L10:
 60   JZ t29, L11
 61   FLATTEN
 62   SSTORE @position, 0.0
 63 L11:
 64 L5:
== after propagate#2: 55 -> 55 instructions, 6 rewritten, data-flow sweeps <= 2 ==
func on_open:
  0   TICK
func on_close:
  0   t1 = LOADFIELD close             ; price
  1   SPUSH $close, t1
  2   RSUM_UPD &sum_close_10, $close, 10
  3   RSUM_UPD &sum_close_30, $close, 30
  4   t3 = BARS_GT 9                   ; bool
  5   JZ t3, L1
  6   t34 = ALOAD &sum_close_10        ; price
  7   t4 = DIV t34, 10.0               ; price
  8   t2 = COPY t4                     ; price
  9   JMP L2
 10 L1:
 11   t2 = CONST 0.0                   ; price
 12 L2:
 13   SPUSH $fast, t2
 14   t6 = BARS_GT 29                  ; bool
 15   JZ t6, L3
 16   t35 = ALOAD &sum_close_30        ; price
 17   t7 = DIV t35, 30.0               ; price
 18   t5 = COPY t7                     ; price
 19   JMP L4
 20 L3:
 21   t5 = CONST 0.0                   ; price
 22 L4:
 23   SPUSH $slow, t5
 24   t8 = BARS_GT 30                  ; bool
 25   JZ t8, L5
 26   t9 = COPY t2                     ; price
 27   t10 = COPY t5                    ; price
 28   t11 = HIST $fast, 1              ; price
 29   t12 = HIST $slow, 1              ; price
 30   t13 = GT t2, t5                  ; bool
 31   t14 = LE t11, t12                ; bool
 32   t15 = AND t13, t14               ; bool
 33   JZ t15, L6
 34   t17 = SLOAD @position            ; volume
 35   t19 = EQ t17, 0.0                ; bool
 36   t16 = COPY t19                   ; bool
 37   JMP L7
 38 L6:
 39   t16 = CONST 0.0                  ; bool
 40 L7:
 41   JZ t16, L8
 42   BUY 100.0
 43   SSTORE @position, 100.0
 44 L8:
 45   t22 = COPY t2                    ; price
 46   t23 = COPY t5                    ; price
 47   t24 = COPY t11                   ; price
 48   t25 = COPY t12                   ; price
 49   t26 = LT t2, t5                  ; bool
 50   t27 = GE t11, t12                ; bool
 51   t28 = AND t26, t27               ; bool
 52   JZ t28, L9
 53   t30 = SLOAD @position            ; volume
 54   t32 = GT t30, 0.0                ; bool
 55   t29 = COPY t32                   ; bool
 56   JMP L10
 57 L9:
 58   t29 = CONST 0.0                  ; bool
 59 L10:
 60   JZ t29, L11
 61   FLATTEN
 62   SSTORE @position, 0.0
 63 L11:
 64 L5:
== after lvn-cse#2: 55 -> 55 instructions, 0 rewritten ==
func on_open:
  0   TICK
func on_close:
  0   t1 = LOADFIELD close             ; price
  1   SPUSH $close, t1
  2   RSUM_UPD &sum_close_10, $close, 10
  3   RSUM_UPD &sum_close_30, $close, 30
  4   t3 = BARS_GT 9                   ; bool
  5   JZ t3, L1
  6   t34 = ALOAD &sum_close_10        ; price
  7   t4 = DIV t34, 10.0               ; price
  8   t2 = COPY t4                     ; price
  9   JMP L2
 10 L1:
 11   t2 = CONST 0.0                   ; price
 12 L2:
 13   SPUSH $fast, t2
 14   t6 = BARS_GT 29                  ; bool
 15   JZ t6, L3
 16   t35 = ALOAD &sum_close_30        ; price
 17   t7 = DIV t35, 30.0               ; price
 18   t5 = COPY t7                     ; price
 19   JMP L4
 20 L3:
 21   t5 = CONST 0.0                   ; price
 22 L4:
 23   SPUSH $slow, t5
 24   t8 = BARS_GT 30                  ; bool
 25   JZ t8, L5
 26   t9 = COPY t2                     ; price
 27   t10 = COPY t5                    ; price
 28   t11 = HIST $fast, 1              ; price
 29   t12 = HIST $slow, 1              ; price
 30   t13 = GT t2, t5                  ; bool
 31   t14 = LE t11, t12                ; bool
 32   t15 = AND t13, t14               ; bool
 33   JZ t15, L6
 34   t17 = SLOAD @position            ; volume
 35   t19 = EQ t17, 0.0                ; bool
 36   t16 = COPY t19                   ; bool
 37   JMP L7
 38 L6:
 39   t16 = CONST 0.0                  ; bool
 40 L7:
 41   JZ t16, L8
 42   BUY 100.0
 43   SSTORE @position, 100.0
 44 L8:
 45   t22 = COPY t2                    ; price
 46   t23 = COPY t5                    ; price
 47   t24 = COPY t11                   ; price
 48   t25 = COPY t12                   ; price
 49   t26 = LT t2, t5                  ; bool
 50   t27 = GE t11, t12                ; bool
 51   t28 = AND t26, t27               ; bool
 52   JZ t28, L9
 53   t30 = SLOAD @position            ; volume
 54   t32 = GT t30, 0.0                ; bool
 55   t29 = COPY t32                   ; bool
 56   JMP L10
 57 L9:
 58   t29 = CONST 0.0                  ; bool
 59 L10:
 60   JZ t29, L11
 61   FLATTEN
 62   SSTORE @position, 0.0
 63 L11:
 64 L5:
== after global-cse#2: 55 -> 55 instructions, 0 rewritten, data-flow sweeps <= 2 ==
func on_open:
  0   TICK
func on_close:
  0   t1 = LOADFIELD close             ; price
  1   SPUSH $close, t1
  2   RSUM_UPD &sum_close_10, $close, 10
  3   RSUM_UPD &sum_close_30, $close, 30
  4   t3 = BARS_GT 9                   ; bool
  5   JZ t3, L1
  6   t34 = ALOAD &sum_close_10        ; price
  7   t4 = DIV t34, 10.0               ; price
  8   t2 = COPY t4                     ; price
  9   JMP L2
 10 L1:
 11   t2 = CONST 0.0                   ; price
 12 L2:
 13   SPUSH $fast, t2
 14   t6 = BARS_GT 29                  ; bool
 15   JZ t6, L3
 16   t35 = ALOAD &sum_close_30        ; price
 17   t7 = DIV t35, 30.0               ; price
 18   t5 = COPY t7                     ; price
 19   JMP L4
 20 L3:
 21   t5 = CONST 0.0                   ; price
 22 L4:
 23   SPUSH $slow, t5
 24   t8 = BARS_GT 30                  ; bool
 25   JZ t8, L5
 26   t9 = COPY t2                     ; price
 27   t10 = COPY t5                    ; price
 28   t11 = HIST $fast, 1              ; price
 29   t12 = HIST $slow, 1              ; price
 30   t13 = GT t2, t5                  ; bool
 31   t14 = LE t11, t12                ; bool
 32   t15 = AND t13, t14               ; bool
 33   JZ t15, L6
 34   t17 = SLOAD @position            ; volume
 35   t19 = EQ t17, 0.0                ; bool
 36   t16 = COPY t19                   ; bool
 37   JMP L7
 38 L6:
 39   t16 = CONST 0.0                  ; bool
 40 L7:
 41   JZ t16, L8
 42   BUY 100.0
 43   SSTORE @position, 100.0
 44 L8:
 45   t22 = COPY t2                    ; price
 46   t23 = COPY t5                    ; price
 47   t24 = COPY t11                   ; price
 48   t25 = COPY t12                   ; price
 49   t26 = LT t2, t5                  ; bool
 50   t27 = GE t11, t12                ; bool
 51   t28 = AND t26, t27               ; bool
 52   JZ t28, L9
 53   t30 = SLOAD @position            ; volume
 54   t32 = GT t30, 0.0                ; bool
 55   t29 = COPY t32                   ; bool
 56   JMP L10
 57 L9:
 58   t29 = CONST 0.0                  ; bool
 59 L10:
 60   JZ t29, L11
 61   FLATTEN
 62   SSTORE @position, 0.0
 63 L11:
 64 L5:
== after dce#2: 55 -> 49 instructions, 6 rewritten, data-flow sweeps <= 2 ==
func on_open:
  0   TICK
func on_close:
  0   t1 = LOADFIELD close             ; price
  1   SPUSH $close, t1
  2   RSUM_UPD &sum_close_10, $close, 10
  3   RSUM_UPD &sum_close_30, $close, 30
  4   t3 = BARS_GT 9                   ; bool
  5   JZ t3, L1
  6   t34 = ALOAD &sum_close_10        ; price
  7   t4 = DIV t34, 10.0               ; price
  8   t2 = COPY t4                     ; price
  9   JMP L2
 10 L1:
 11   t2 = CONST 0.0                   ; price
 12 L2:
 13   SPUSH $fast, t2
 14   t6 = BARS_GT 29                  ; bool
 15   JZ t6, L3
 16   t35 = ALOAD &sum_close_30        ; price
 17   t7 = DIV t35, 30.0               ; price
 18   t5 = COPY t7                     ; price
 19   JMP L4
 20 L3:
 21   t5 = CONST 0.0                   ; price
 22 L4:
 23   SPUSH $slow, t5
 24   t8 = BARS_GT 30                  ; bool
 25   JZ t8, L5
 26   t11 = HIST $fast, 1              ; price
 27   t12 = HIST $slow, 1              ; price
 28   t13 = GT t2, t5                  ; bool
 29   t14 = LE t11, t12                ; bool
 30   t15 = AND t13, t14               ; bool
 31   JZ t15, L6
 32   t17 = SLOAD @position            ; volume
 33   t19 = EQ t17, 0.0                ; bool
 34   t16 = COPY t19                   ; bool
 35   JMP L7
 36 L6:
 37   t16 = CONST 0.0                  ; bool
 38 L7:
 39   JZ t16, L8
 40   BUY 100.0
 41   SSTORE @position, 100.0
 42 L8:
 43   t26 = LT t2, t5                  ; bool
 44   t27 = GE t11, t12                ; bool
 45   t28 = AND t26, t27               ; bool
 46   JZ t28, L9
 47   t30 = SLOAD @position            ; volume
 48   t32 = GT t30, 0.0                ; bool
 49   t29 = COPY t32                   ; bool
 50   JMP L10
 51 L9:
 52   t29 = CONST 0.0                  ; bool
 53 L10:
 54   JZ t29, L11
 55   FLATTEN
 56   SSTORE @position, 0.0
 57 L11:
 58 L5:
== final TAC (49 instructions) ==
func on_open:
  0   TICK
func on_close:
  0   t1 = LOADFIELD close             ; price
  1   SPUSH $close, t1
  2   RSUM_UPD &sum_close_10, $close, 10
  3   RSUM_UPD &sum_close_30, $close, 30
  4   t3 = BARS_GT 9                   ; bool
  5   JZ t3, L1
  6   t34 = ALOAD &sum_close_10        ; price
  7   t4 = DIV t34, 10.0               ; price
  8   t2 = COPY t4                     ; price
  9   JMP L2
 10 L1:
 11   t2 = CONST 0.0                   ; price
 12 L2:
 13   SPUSH $fast, t2
 14   t6 = BARS_GT 29                  ; bool
 15   JZ t6, L3
 16   t35 = ALOAD &sum_close_30        ; price
 17   t7 = DIV t35, 30.0               ; price
 18   t5 = COPY t7                     ; price
 19   JMP L4
 20 L3:
 21   t5 = CONST 0.0                   ; price
 22 L4:
 23   SPUSH $slow, t5
 24   t8 = BARS_GT 30                  ; bool
 25   JZ t8, L5
 26   t11 = HIST $fast, 1              ; price
 27   t12 = HIST $slow, 1              ; price
 28   t13 = GT t2, t5                  ; bool
 29   t14 = LE t11, t12                ; bool
 30   t15 = AND t13, t14               ; bool
 31   JZ t15, L6
 32   t17 = SLOAD @position            ; volume
 33   t19 = EQ t17, 0.0                ; bool
 34   t16 = COPY t19                   ; bool
 35   JMP L7
 36 L6:
 37   t16 = CONST 0.0                  ; bool
 38 L7:
 39   JZ t16, L8
 40   BUY 100.0
 41   SSTORE @position, 100.0
 42 L8:
 43   t26 = LT t2, t5                  ; bool
 44   t27 = GE t11, t12                ; bool
 45   t28 = AND t26, t27               ; bool
 46   JZ t28, L9
 47   t30 = SLOAD @position            ; volume
 48   t32 = GT t30, 0.0                ; bool
 49   t29 = COPY t32                   ; bool
 50   JMP L10
 51 L9:
 52   t29 = CONST 0.0                  ; bool
 53 L10:
 54   JZ t29, L11
 55   FLATTEN
 56   SSTORE @position, 0.0
 57 L11:
 58 L5:
