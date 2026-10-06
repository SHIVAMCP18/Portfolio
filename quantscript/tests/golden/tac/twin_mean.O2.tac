== initial TAC (62 instructions) ==
func on_open:
  0   TICK
  1   t1 = LOADFIELD open              ; price
  2   SPUSH $open, t1
  3   t2 = BARS_GT 19                  ; bool
  4   JZ t2, L1
  5   t3 = HIST $open, 0               ; price
  6   t4 = ROLLMEAN $open, 20          ; price
  7   t5 = CONST 1.0                   ; price
  8   t6 = SUB t4, t5                  ; price
  9   t7 = LT t3, t6                   ; bool
 10   JZ t7, L2
 11   t9 = SLOAD @pos                  ; volume
 12   t10 = CONST 0.0                  ; volume
 13   t11 = EQ t9, t10                 ; bool
 14   t8 = COPY t11                    ; bool
 15   JMP L3
 16 L2:
 17   t8 = CONST 0.0                   ; bool
 18 L3:
 19   JZ t8, L4
 20   t12 = CONST 10.0                 ; volume
 21   BUY t12
 22   t13 = CONST 10.0                 ; volume
 23   SSTORE @pos, t13
 24 L4:
 25 L1:
func on_close:
  0   t14 = LOADFIELD close            ; price
  1   SPUSH $close, t14
  2   t15 = LOADFIELD volume           ; volume
  3   SPUSH $volume, t15
  4   t16 = BARS_GT 19                 ; bool
  5   JZ t16, L5
  6   t17 = HIST $close, 0             ; price
  7   t18 = ROLLMEAN $close, 20        ; price
  8   t19 = SUB t17, t18               ; price
  9   t20 = ROLLMEAN $close, 20        ; price
 10   t21 = ROLLMEAN $open, 20         ; price
 11   t22 = SUB t20, t21               ; price
 12   t23 = ROLLSUM $volume, 20        ; volume
 13   t24 = CONST 20.0                 ; scalar
 14   t25 = DIV t23, t24               ; volume
 15   t26 = CONST 0.0                  ; price
 16   t27 = GT t19, t26                ; bool
 17   JZ t27, L6
 18   t29 = CONST 0.0                  ; price
 19   t30 = GT t22, t29                ; bool
 20   t28 = COPY t30                   ; bool
 21   JMP L7
 22 L6:
 23   t28 = CONST 0.0                  ; bool
 24 L7:
 25   JZ t28, L8
 26   t32 = HIST $volume, 0            ; volume
 27   t33 = GT t32, t25                ; bool
 28   t31 = COPY t33                   ; bool
 29   JMP L9
 30 L8:
 31   t31 = CONST 0.0                  ; bool
 32 L9:
 33   JZ t31, L10
 34   t35 = SLOAD @pos                 ; volume
 35   t36 = CONST 0.0                  ; volume
 36   t37 = GT t35, t36                ; bool
 37   t34 = COPY t37                   ; bool
 38   JMP L11
 39 L10:
 40   t34 = CONST 0.0                  ; bool
 41 L11:
 42   JZ t34, L12
 43   FLATTEN
 44   t38 = CONST 0.0                  ; volume
 45   SSTORE @pos, t38
 46 L12:
 47 L5:
== after fold: 62 -> 62 instructions, 0 rewritten ==
func on_open:
  0   TICK
  1   t1 = LOADFIELD open              ; price
  2   SPUSH $open, t1
  3   t2 = BARS_GT 19                  ; bool
  4   JZ t2, L1
  5   t3 = HIST $open, 0               ; price
  6   t4 = ROLLMEAN $open, 20          ; price
  7   t5 = CONST 1.0                   ; price
  8   t6 = SUB t4, t5                  ; price
  9   t7 = LT t3, t6                   ; bool
 10   JZ t7, L2
 11   t9 = SLOAD @pos                  ; volume
 12   t10 = CONST 0.0                  ; volume
 13   t11 = EQ t9, t10                 ; bool
 14   t8 = COPY t11                    ; bool
 15   JMP L3
 16 L2:
 17   t8 = CONST 0.0                   ; bool
 18 L3:
 19   JZ t8, L4
 20   t12 = CONST 10.0                 ; volume
 21   BUY t12
 22   t13 = CONST 10.0                 ; volume
 23   SSTORE @pos, t13
 24 L4:
 25 L1:
func on_close:
  0   t14 = LOADFIELD close            ; price
  1   SPUSH $close, t14
  2   t15 = LOADFIELD volume           ; volume
  3   SPUSH $volume, t15
  4   t16 = BARS_GT 19                 ; bool
  5   JZ t16, L5
  6   t17 = HIST $close, 0             ; price
  7   t18 = ROLLMEAN $close, 20        ; price
  8   t19 = SUB t17, t18               ; price
  9   t20 = ROLLMEAN $close, 20        ; price
 10   t21 = ROLLMEAN $open, 20         ; price
 11   t22 = SUB t20, t21               ; price
 12   t23 = ROLLSUM $volume, 20        ; volume
 13   t24 = CONST 20.0                 ; scalar
 14   t25 = DIV t23, t24               ; volume
 15   t26 = CONST 0.0                  ; price
 16   t27 = GT t19, t26                ; bool
 17   JZ t27, L6
 18   t29 = CONST 0.0                  ; price
 19   t30 = GT t22, t29                ; bool
 20   t28 = COPY t30                   ; bool
 21   JMP L7
 22 L6:
 23   t28 = CONST 0.0                  ; bool
 24 L7:
 25   JZ t28, L8
 26   t32 = HIST $volume, 0            ; volume
 27   t33 = GT t32, t25                ; bool
 28   t31 = COPY t33                   ; bool
 29   JMP L9
 30 L8:
 31   t31 = CONST 0.0                  ; bool
 32 L9:
 33   JZ t31, L10
 34   t35 = SLOAD @pos                 ; volume
 35   t36 = CONST 0.0                  ; volume
 36   t37 = GT t35, t36                ; bool
 37   t34 = COPY t37                   ; bool
 38   JMP L11
 39 L10:
 40   t34 = CONST 0.0                  ; bool
 41 L11:
 42   JZ t34, L12
 43   FLATTEN
 44   t38 = CONST 0.0                  ; volume
 45   SSTORE @pos, t38
 46 L12:
 47 L5:
== after algebraic: 62 -> 62 instructions, 0 rewritten ==
func on_open:
  0   TICK
  1   t1 = LOADFIELD open              ; price
  2   SPUSH $open, t1
  3   t2 = BARS_GT 19                  ; bool
  4   JZ t2, L1
  5   t3 = HIST $open, 0               ; price
  6   t4 = ROLLMEAN $open, 20          ; price
  7   t5 = CONST 1.0                   ; price
  8   t6 = SUB t4, t5                  ; price
  9   t7 = LT t3, t6                   ; bool
 10   JZ t7, L2
 11   t9 = SLOAD @pos                  ; volume
 12   t10 = CONST 0.0                  ; volume
 13   t11 = EQ t9, t10                 ; bool
 14   t8 = COPY t11                    ; bool
 15   JMP L3
 16 L2:
 17   t8 = CONST 0.0                   ; bool
 18 L3:
 19   JZ t8, L4
 20   t12 = CONST 10.0                 ; volume
 21   BUY t12
 22   t13 = CONST 10.0                 ; volume
 23   SSTORE @pos, t13
 24 L4:
 25 L1:
func on_close:
  0   t14 = LOADFIELD close            ; price
  1   SPUSH $close, t14
  2   t15 = LOADFIELD volume           ; volume
  3   SPUSH $volume, t15
  4   t16 = BARS_GT 19                 ; bool
  5   JZ t16, L5
  6   t17 = HIST $close, 0             ; price
  7   t18 = ROLLMEAN $close, 20        ; price
  8   t19 = SUB t17, t18               ; price
  9   t20 = ROLLMEAN $close, 20        ; price
 10   t21 = ROLLMEAN $open, 20         ; price
 11   t22 = SUB t20, t21               ; price
 12   t23 = ROLLSUM $volume, 20        ; volume
 13   t24 = CONST 20.0                 ; scalar
 14   t25 = DIV t23, t24               ; volume
 15   t26 = CONST 0.0                  ; price
 16   t27 = GT t19, t26                ; bool
 17   JZ t27, L6
 18   t29 = CONST 0.0                  ; price
 19   t30 = GT t22, t29                ; bool
 20   t28 = COPY t30                   ; bool
 21   JMP L7
 22 L6:
 23   t28 = CONST 0.0                  ; bool
 24 L7:
 25   JZ t28, L8
 26   t32 = HIST $volume, 0            ; volume
 27   t33 = GT t32, t25                ; bool
 28   t31 = COPY t33                   ; bool
 29   JMP L9
 30 L8:
 31   t31 = CONST 0.0                  ; bool
 32 L9:
 33   JZ t31, L10
 34   t35 = SLOAD @pos                 ; volume
 35   t36 = CONST 0.0                  ; volume
 36   t37 = GT t35, t36                ; bool
 37   t34 = COPY t37                   ; bool
 38   JMP L11
 39 L10:
 40   t34 = CONST 0.0                  ; bool
 41 L11:
 42   JZ t34, L12
 43   FLATTEN
 44   t38 = CONST 0.0                  ; volume
 45   SSTORE @pos, t38
 46 L12:
 47 L5:
== after propagate: 62 -> 62 instructions, 9 rewritten, data-flow sweeps <= 2 ==
func on_open:
  0   TICK
  1   t1 = LOADFIELD open              ; price
  2   SPUSH $open, t1
  3   t2 = BARS_GT 19                  ; bool
  4   JZ t2, L1
  5   t3 = HIST $open, 0               ; price
  6   t4 = ROLLMEAN $open, 20          ; price
  7   t5 = CONST 1.0                   ; price
  8   t6 = SUB t4, 1.0                 ; price
  9   t7 = LT t3, t6                   ; bool
 10   JZ t7, L2
 11   t9 = SLOAD @pos                  ; volume
 12   t10 = CONST 0.0                  ; volume
 13   t11 = EQ t9, 0.0                 ; bool
 14   t8 = COPY t11                    ; bool
 15   JMP L3
 16 L2:
 17   t8 = CONST 0.0                   ; bool
 18 L3:
 19   JZ t8, L4
 20   t12 = CONST 10.0                 ; volume
 21   BUY 10.0
 22   t13 = CONST 10.0                 ; volume
 23   SSTORE @pos, 10.0
 24 L4:
 25 L1:
func on_close:
  0   t14 = LOADFIELD close            ; price
  1   SPUSH $close, t14
  2   t15 = LOADFIELD volume           ; volume
  3   SPUSH $volume, t15
  4   t16 = BARS_GT 19                 ; bool
  5   JZ t16, L5
  6   t17 = HIST $close, 0             ; price
  7   t18 = ROLLMEAN $close, 20        ; price
  8   t19 = SUB t17, t18               ; price
  9   t20 = ROLLMEAN $close, 20        ; price
 10   t21 = ROLLMEAN $open, 20         ; price
 11   t22 = SUB t20, t21               ; price
 12   t23 = ROLLSUM $volume, 20        ; volume
 13   t24 = CONST 20.0                 ; scalar
 14   t25 = DIV t23, 20.0              ; volume
 15   t26 = CONST 0.0                  ; price
 16   t27 = GT t19, 0.0                ; bool
 17   JZ t27, L6
 18   t29 = CONST 0.0                  ; price
 19   t30 = GT t22, 0.0                ; bool
 20   t28 = COPY t30                   ; bool
 21   JMP L7
 22 L6:
 23   t28 = CONST 0.0                  ; bool
 24 L7:
 25   JZ t28, L8
 26   t32 = HIST $volume, 0            ; volume
 27   t33 = GT t32, t25                ; bool
 28   t31 = COPY t33                   ; bool
 29   JMP L9
 30 L8:
 31   t31 = CONST 0.0                  ; bool
 32 L9:
 33   JZ t31, L10
 34   t35 = SLOAD @pos                 ; volume
 35   t36 = CONST 0.0                  ; volume
 36   t37 = GT t35, 0.0                ; bool
 37   t34 = COPY t37                   ; bool
 38   JMP L11
 39 L10:
 40   t34 = CONST 0.0                  ; bool
 41 L11:
 42   JZ t34, L12
 43   FLATTEN
 44   t38 = CONST 0.0                  ; volume
 45   SSTORE @pos, 0.0
 46 L12:
 47 L5:
== after lvn-cse: 62 -> 62 instructions, 2 rewritten ==
func on_open:
  0   TICK
  1   t1 = LOADFIELD open              ; price
  2   SPUSH $open, t1
  3   t2 = BARS_GT 19                  ; bool
  4   JZ t2, L1
  5   t3 = HIST $open, 0               ; price
  6   t4 = ROLLMEAN $open, 20          ; price
  7   t5 = CONST 1.0                   ; price
  8   t6 = SUB t4, 1.0                 ; price
  9   t7 = LT t3, t6                   ; bool
 10   JZ t7, L2
 11   t9 = SLOAD @pos                  ; volume
 12   t10 = CONST 0.0                  ; volume
 13   t11 = EQ t9, 0.0                 ; bool
 14   t8 = COPY t11                    ; bool
 15   JMP L3
 16 L2:
 17   t8 = CONST 0.0                   ; bool
 18 L3:
 19   JZ t8, L4
 20   t12 = CONST 10.0                 ; volume
 21   BUY 10.0
 22   t13 = COPY t12                   ; volume
 23   SSTORE @pos, 10.0
 24 L4:
 25 L1:
func on_close:
  0   t14 = LOADFIELD close            ; price
  1   SPUSH $close, t14
  2   t15 = LOADFIELD volume           ; volume
  3   SPUSH $volume, t15
  4   t16 = BARS_GT 19                 ; bool
  5   JZ t16, L5
  6   t17 = HIST $close, 0             ; price
  7   t18 = ROLLMEAN $close, 20        ; price
  8   t19 = SUB t17, t18               ; price
  9   t20 = COPY t18                   ; price
 10   t21 = ROLLMEAN $open, 20         ; price
 11   t22 = SUB t20, t21               ; price
 12   t23 = ROLLSUM $volume, 20        ; volume
 13   t24 = CONST 20.0                 ; scalar
 14   t25 = DIV t23, 20.0              ; volume
 15   t26 = CONST 0.0                  ; price
 16   t27 = GT t19, 0.0                ; bool
 17   JZ t27, L6
 18   t29 = CONST 0.0                  ; price
 19   t30 = GT t22, 0.0                ; bool
 20   t28 = COPY t30                   ; bool
 21   JMP L7
 22 L6:
 23   t28 = CONST 0.0                  ; bool
 24 L7:
 25   JZ t28, L8
 26   t32 = HIST $volume, 0            ; volume
 27   t33 = GT t32, t25                ; bool
 28   t31 = COPY t33                   ; bool
 29   JMP L9
 30 L8:
 31   t31 = CONST 0.0                  ; bool
 32 L9:
 33   JZ t31, L10
 34   t35 = SLOAD @pos                 ; volume
 35   t36 = CONST 0.0                  ; volume
 36   t37 = GT t35, 0.0                ; bool
 37   t34 = COPY t37                   ; bool
 38   JMP L11
 39 L10:
 40   t34 = CONST 0.0                  ; bool
 41 L11:
 42   JZ t34, L12
 43   FLATTEN
 44   t38 = CONST 0.0                  ; volume
 45   SSTORE @pos, 0.0
 46 L12:
 47 L5:
== after global-cse: 62 -> 62 instructions, 9 rewritten, data-flow sweeps <= 2 ==
func on_open:
  0   TICK
  1   t1 = LOADFIELD open              ; price
  2   SPUSH $open, t1
  3   t2 = BARS_GT 19                  ; bool
  4   JZ t2, L1
  5   t3 = COPY t1                     ; price
  6   t4 = ROLLMEAN $open, 20          ; price
  7   t5 = CONST 1.0                   ; price
  8   t6 = SUB t4, 1.0                 ; price
  9   t7 = LT t3, t6                   ; bool
 10   JZ t7, L2
 11   t9 = SLOAD @pos                  ; volume
 12   t10 = CONST 0.0                  ; volume
 13   t11 = EQ t9, 0.0                 ; bool
 14   t8 = COPY t11                    ; bool
 15   JMP L3
 16 L2:
 17   t8 = CONST 0.0                   ; bool
 18 L3:
 19   JZ t8, L4
 20   t12 = CONST 10.0                 ; volume
 21   BUY 10.0
 22   t13 = COPY t12                   ; volume
 23   SSTORE @pos, 10.0
 24 L4:
 25 L1:
func on_close:
  0   t14 = LOADFIELD close            ; price
  1   SPUSH $close, t14
  2   t15 = LOADFIELD volume           ; volume
  3   SPUSH $volume, t15
  4   t16 = BARS_GT 19                 ; bool
  5   JZ t16, L5
  6   t17 = COPY t14                   ; price
  7   t18 = ROLLMEAN $close, 20        ; price
  8   t19 = SUB t17, t18               ; price
  9   t20 = COPY t18                   ; price
 10   t21 = ROLLMEAN $open, 20         ; price
 11   t22 = SUB t20, t21               ; price
 12   t23 = ROLLSUM $volume, 20        ; volume
 13   t24 = CONST 20.0                 ; scalar
 14   t25 = DIV t23, 20.0              ; volume
 15   t26 = CONST 0.0                  ; price
 16   t27 = GT t19, 0.0                ; bool
 17   JZ t27, L6
 18   t29 = COPY t26                   ; price
 19   t30 = GT t22, 0.0                ; bool
 20   t28 = COPY t30                   ; bool
 21   JMP L7
 22 L6:
 23   t28 = COPY t26                   ; bool
 24 L7:
 25   JZ t28, L8
 26   t32 = COPY t15                   ; volume
 27   t33 = GT t32, t25                ; bool
 28   t31 = COPY t33                   ; bool
 29   JMP L9
 30 L8:
 31   t31 = COPY t26                   ; bool
 32 L9:
 33   JZ t31, L10
 34   t35 = SLOAD @pos                 ; volume
 35   t36 = COPY t26                   ; volume
 36   t37 = GT t35, 0.0                ; bool
 37   t34 = COPY t37                   ; bool
 38   JMP L11
 39 L10:
 40   t34 = COPY t26                   ; bool
 41 L11:
 42   JZ t34, L12
 43   FLATTEN
 44   t38 = COPY t26                   ; volume
 45   SSTORE @pos, 0.0
 46 L12:
 47 L5:
== after dce: 62 -> 54 instructions, 8 rewritten, data-flow sweeps <= 2 ==
func on_open:
  0   TICK
  1   t1 = LOADFIELD open              ; price
  2   SPUSH $open, t1
  3   t2 = BARS_GT 19                  ; bool
  4   JZ t2, L1
  5   t3 = COPY t1                     ; price
  6   t4 = ROLLMEAN $open, 20          ; price
  7   t6 = SUB t4, 1.0                 ; price
  8   t7 = LT t3, t6                   ; bool
  9   JZ t7, L2
 10   t9 = SLOAD @pos                  ; volume
 11   t11 = EQ t9, 0.0                 ; bool
 12   t8 = COPY t11                    ; bool
 13   JMP L3
 14 L2:
 15   t8 = CONST 0.0                   ; bool
 16 L3:
 17   JZ t8, L4
 18   BUY 10.0
 19   SSTORE @pos, 10.0
 20 L4:
 21 L1:
func on_close:
  0   t14 = LOADFIELD close            ; price
  1   SPUSH $close, t14
  2   t15 = LOADFIELD volume           ; volume
  3   SPUSH $volume, t15
  4   t16 = BARS_GT 19                 ; bool
  5   JZ t16, L5
  6   t17 = COPY t14                   ; price
  7   t18 = ROLLMEAN $close, 20        ; price
  8   t19 = SUB t17, t18               ; price
  9   t20 = COPY t18                   ; price
 10   t21 = ROLLMEAN $open, 20         ; price
 11   t22 = SUB t20, t21               ; price
 12   t23 = ROLLSUM $volume, 20        ; volume
 13   t25 = DIV t23, 20.0              ; volume
 14   t26 = CONST 0.0                  ; price
 15   t27 = GT t19, 0.0                ; bool
 16   JZ t27, L6
 17   t30 = GT t22, 0.0                ; bool
 18   t28 = COPY t30                   ; bool
 19   JMP L7
 20 L6:
 21   t28 = COPY t26                   ; bool
 22 L7:
 23   JZ t28, L8
 24   t32 = COPY t15                   ; volume
 25   t33 = GT t32, t25                ; bool
 26   t31 = COPY t33                   ; bool
 27   JMP L9
 28 L8:
 29   t31 = COPY t26                   ; bool
 30 L9:
 31   JZ t31, L10
 32   t35 = SLOAD @pos                 ; volume
 33   t37 = GT t35, 0.0                ; bool
 34   t34 = COPY t37                   ; bool
 35   JMP L11
 36 L10:
 37   t34 = COPY t26                   ; bool
 38 L11:
 39   JZ t34, L12
 40   FLATTEN
 41   SSTORE @pos, 0.0
 42 L12:
 43 L5:
== after window-sr: 54 -> 60 instructions, 7 rewritten ==
func on_open:
  0   TICK
  1   t1 = LOADFIELD open              ; price
  2   SPUSH $open, t1
  3   RSUM_UPD &sum_open_20, $open, 20
  4   t2 = BARS_GT 19                  ; bool
  5   JZ t2, L1
  6   t3 = COPY t1                     ; price
  7   t39 = ALOAD &sum_open_20         ; price
  8   t4 = DIV t39, 20.0               ; price
  9   t6 = SUB t4, 1.0                 ; price
 10   t7 = LT t3, t6                   ; bool
 11   JZ t7, L2
 12   t9 = SLOAD @pos                  ; volume
 13   t11 = EQ t9, 0.0                 ; bool
 14   t8 = COPY t11                    ; bool
 15   JMP L3
 16 L2:
 17   t8 = CONST 0.0                   ; bool
 18 L3:
 19   JZ t8, L4
 20   BUY 10.0
 21   SSTORE @pos, 10.0
 22 L4:
 23 L1:
func on_close:
  0   t14 = LOADFIELD close            ; price
  1   SPUSH $close, t14
  2   RSUM_UPD &sum_close_20, $close, 20
  3   t15 = LOADFIELD volume           ; volume
  4   SPUSH $volume, t15
  5   RSUM_UPD &sum_volume_20, $volume, 20
  6   t16 = BARS_GT 19                 ; bool
  7   JZ t16, L5
  8   t17 = COPY t14                   ; price
  9   t40 = ALOAD &sum_close_20        ; price
 10   t18 = DIV t40, 20.0              ; price
 11   t19 = SUB t17, t18               ; price
 12   t20 = COPY t18                   ; price
 13   t41 = ALOAD &sum_open_20         ; price
 14   t21 = DIV t41, 20.0              ; price
 15   t22 = SUB t20, t21               ; price
 16   t23 = ALOAD &sum_volume_20       ; volume
 17   t25 = DIV t23, 20.0              ; volume
 18   t26 = CONST 0.0                  ; price
 19   t27 = GT t19, 0.0                ; bool
 20   JZ t27, L6
 21   t30 = GT t22, 0.0                ; bool
 22   t28 = COPY t30                   ; bool
 23   JMP L7
 24 L6:
 25   t28 = COPY t26                   ; bool
 26 L7:
 27   JZ t28, L8
 28   t32 = COPY t15                   ; volume
 29   t33 = GT t32, t25                ; bool
 30   t31 = COPY t33                   ; bool
 31   JMP L9
 32 L8:
 33   t31 = COPY t26                   ; bool
 34 L9:
 35   JZ t31, L10
 36   t35 = SLOAD @pos                 ; volume
 37   t37 = GT t35, 0.0                ; bool
 38   t34 = COPY t37                   ; bool
 39   JMP L11
 40 L10:
 41   t34 = COPY t26                   ; bool
 42 L11:
 43   JZ t34, L12
 44   FLATTEN
 45   SSTORE @pos, 0.0
 46 L12:
 47 L5:
== after peephole: 60 -> 60 instructions, 0 rewritten ==
func on_open:
  0   TICK
  1   t1 = LOADFIELD open              ; price
  2   SPUSH $open, t1
  3   RSUM_UPD &sum_open_20, $open, 20
  4   t2 = BARS_GT 19                  ; bool
  5   JZ t2, L1
  6   t3 = COPY t1                     ; price
  7   t39 = ALOAD &sum_open_20         ; price
  8   t4 = DIV t39, 20.0               ; price
  9   t6 = SUB t4, 1.0                 ; price
 10   t7 = LT t3, t6                   ; bool
 11   JZ t7, L2
 12   t9 = SLOAD @pos                  ; volume
 13   t11 = EQ t9, 0.0                 ; bool
 14   t8 = COPY t11                    ; bool
 15   JMP L3
 16 L2:
 17   t8 = CONST 0.0                   ; bool
 18 L3:
 19   JZ t8, L4
 20   BUY 10.0
 21   SSTORE @pos, 10.0
 22 L4:
 23 L1:
func on_close:
  0   t14 = LOADFIELD close            ; price
  1   SPUSH $close, t14
  2   RSUM_UPD &sum_close_20, $close, 20
  3   t15 = LOADFIELD volume           ; volume
  4   SPUSH $volume, t15
  5   RSUM_UPD &sum_volume_20, $volume, 20
  6   t16 = BARS_GT 19                 ; bool
  7   JZ t16, L5
  8   t17 = COPY t14                   ; price
  9   t40 = ALOAD &sum_close_20        ; price
 10   t18 = DIV t40, 20.0              ; price
 11   t19 = SUB t17, t18               ; price
 12   t20 = COPY t18                   ; price
 13   t41 = ALOAD &sum_open_20         ; price
 14   t21 = DIV t41, 20.0              ; price
 15   t22 = SUB t20, t21               ; price
 16   t23 = ALOAD &sum_volume_20       ; volume
 17   t25 = DIV t23, 20.0              ; volume
 18   t26 = CONST 0.0                  ; price
 19   t27 = GT t19, 0.0                ; bool
 20   JZ t27, L6
 21   t30 = GT t22, 0.0                ; bool
 22   t28 = COPY t30                   ; bool
 23   JMP L7
 24 L6:
 25   t28 = COPY t26                   ; bool
 26 L7:
 27   JZ t28, L8
 28   t32 = COPY t15                   ; volume
 29   t33 = GT t32, t25                ; bool
 30   t31 = COPY t33                   ; bool
 31   JMP L9
 32 L8:
 33   t31 = COPY t26                   ; bool
 34 L9:
 35   JZ t31, L10
 36   t35 = SLOAD @pos                 ; volume
 37   t37 = GT t35, 0.0                ; bool
 38   t34 = COPY t37                   ; bool
 39   JMP L11
 40 L10:
 41   t34 = COPY t26                   ; bool
 42 L11:
 43   JZ t34, L12
 44   FLATTEN
 45   SSTORE @pos, 0.0
 46 L12:
 47 L5:
== after fold#2: 60 -> 60 instructions, 3 rewritten ==
func on_open:
  0   TICK
  1   t1 = LOADFIELD open              ; price
  2   SPUSH $open, t1
  3   RSUM_UPD &sum_open_20, $open, 20
  4   t2 = BARS_GT 19                  ; bool
  5   JZ t2, L1
  6   t3 = COPY t1                     ; price
  7   t39 = ALOAD &sum_open_20         ; price
  8   t4 = DIV t39, 20.0               ; price
  9   t6 = SUB t4, 1.0                 ; price
 10   t7 = LT t3, t6                   ; bool
 11   JZ t7, L2
 12   t9 = SLOAD @pos                  ; volume
 13   t11 = EQ t9, 0.0                 ; bool
 14   t8 = COPY t11                    ; bool
 15   JMP L3
 16 L2:
 17   t8 = CONST 0.0                   ; bool
 18 L3:
 19   JZ t8, L4
 20   BUY 10.0
 21   SSTORE @pos, 10.0
 22 L4:
 23 L1:
func on_close:
  0   t14 = LOADFIELD close            ; price
  1   SPUSH $close, t14
  2   RSUM_UPD &sum_close_20, $close, 20
  3   t15 = LOADFIELD volume           ; volume
  4   SPUSH $volume, t15
  5   RSUM_UPD &sum_volume_20, $volume, 20
  6   t16 = BARS_GT 19                 ; bool
  7   JZ t16, L5
  8   t17 = COPY t14                   ; price
  9   t40 = ALOAD &sum_close_20        ; price
 10   t18 = DIV t40, 20.0              ; price
 11   t19 = SUB t17, t18               ; price
 12   t20 = COPY t18                   ; price
 13   t41 = ALOAD &sum_open_20         ; price
 14   t21 = DIV t41, 20.0              ; price
 15   t22 = SUB t20, t21               ; price
 16   t23 = ALOAD &sum_volume_20       ; volume
 17   t25 = DIV t23, 20.0              ; volume
 18   t26 = CONST 0.0                  ; price
 19   t27 = GT t19, 0.0                ; bool
 20   JZ t27, L6
 21   t30 = GT t22, 0.0                ; bool
 22   t28 = COPY t30                   ; bool
 23   JMP L7
 24 L6:
 25   t28 = CONST 0.0                  ; bool
 26 L7:
 27   JZ t28, L8
 28   t32 = COPY t15                   ; volume
 29   t33 = GT t32, t25                ; bool
 30   t31 = COPY t33                   ; bool
 31   JMP L9
 32 L8:
 33   t31 = CONST 0.0                  ; bool
 34 L9:
 35   JZ t31, L10
 36   t35 = SLOAD @pos                 ; volume
 37   t37 = GT t35, 0.0                ; bool
 38   t34 = COPY t37                   ; bool
 39   JMP L11
 40 L10:
 41   t34 = CONST 0.0                  ; bool
 42 L11:
 43   JZ t34, L12
 44   FLATTEN
 45   SSTORE @pos, 0.0
 46 L12:
 47 L5:
== after propagate#2: 60 -> 60 instructions, 4 rewritten, data-flow sweeps <= 2 ==
func on_open:
  0   TICK
  1   t1 = LOADFIELD open              ; price
  2   SPUSH $open, t1
  3   RSUM_UPD &sum_open_20, $open, 20
  4   t2 = BARS_GT 19                  ; bool
  5   JZ t2, L1
  6   t3 = COPY t1                     ; price
  7   t39 = ALOAD &sum_open_20         ; price
  8   t4 = DIV t39, 20.0               ; price
  9   t6 = SUB t4, 1.0                 ; price
 10   t7 = LT t1, t6                   ; bool
 11   JZ t7, L2
 12   t9 = SLOAD @pos                  ; volume
 13   t11 = EQ t9, 0.0                 ; bool
 14   t8 = COPY t11                    ; bool
 15   JMP L3
 16 L2:
 17   t8 = CONST 0.0                   ; bool
 18 L3:
 19   JZ t8, L4
 20   BUY 10.0
 21   SSTORE @pos, 10.0
 22 L4:
 23 L1:
func on_close:
  0   t14 = LOADFIELD close            ; price
  1   SPUSH $close, t14
  2   RSUM_UPD &sum_close_20, $close, 20
  3   t15 = LOADFIELD volume           ; volume
  4   SPUSH $volume, t15
  5   RSUM_UPD &sum_volume_20, $volume, 20
  6   t16 = BARS_GT 19                 ; bool
  7   JZ t16, L5
  8   t17 = COPY t14                   ; price
  9   t40 = ALOAD &sum_close_20        ; price
 10   t18 = DIV t40, 20.0              ; price
 11   t19 = SUB t14, t18               ; price
 12   t20 = COPY t18                   ; price
 13   t41 = ALOAD &sum_open_20         ; price
 14   t21 = DIV t41, 20.0              ; price
 15   t22 = SUB t18, t21               ; price
 16   t23 = ALOAD &sum_volume_20       ; volume
 17   t25 = DIV t23, 20.0              ; volume
 18   t26 = CONST 0.0                  ; price
 19   t27 = GT t19, 0.0                ; bool
 20   JZ t27, L6
 21   t30 = GT t22, 0.0                ; bool
 22   t28 = COPY t30                   ; bool
 23   JMP L7
 24 L6:
 25   t28 = CONST 0.0                  ; bool
 26 L7:
 27   JZ t28, L8
 28   t32 = COPY t15                   ; volume
 29   t33 = GT t15, t25                ; bool
 30   t31 = COPY t33                   ; bool
 31   JMP L9
 32 L8:
 33   t31 = CONST 0.0                  ; bool
 34 L9:
 35   JZ t31, L10
 36   t35 = SLOAD @pos                 ; volume
 37   t37 = GT t35, 0.0                ; bool
 38   t34 = COPY t37                   ; bool
 39   JMP L11
 40 L10:
 41   t34 = CONST 0.0                  ; bool
 42 L11:
 43   JZ t34, L12
 44   FLATTEN
 45   SSTORE @pos, 0.0
 46 L12:
 47 L5:
== after lvn-cse#2: 60 -> 60 instructions, 0 rewritten ==
func on_open:
  0   TICK
  1   t1 = LOADFIELD open              ; price
  2   SPUSH $open, t1
  3   RSUM_UPD &sum_open_20, $open, 20
  4   t2 = BARS_GT 19                  ; bool
  5   JZ t2, L1
  6   t3 = COPY t1                     ; price
  7   t39 = ALOAD &sum_open_20         ; price
  8   t4 = DIV t39, 20.0               ; price
  9   t6 = SUB t4, 1.0                 ; price
 10   t7 = LT t1, t6                   ; bool
 11   JZ t7, L2
 12   t9 = SLOAD @pos                  ; volume
 13   t11 = EQ t9, 0.0                 ; bool
 14   t8 = COPY t11                    ; bool
 15   JMP L3
 16 L2:
 17   t8 = CONST 0.0                   ; bool
 18 L3:
 19   JZ t8, L4
 20   BUY 10.0
 21   SSTORE @pos, 10.0
 22 L4:
 23 L1:
func on_close:
  0   t14 = LOADFIELD close            ; price
  1   SPUSH $close, t14
  2   RSUM_UPD &sum_close_20, $close, 20
  3   t15 = LOADFIELD volume           ; volume
  4   SPUSH $volume, t15
  5   RSUM_UPD &sum_volume_20, $volume, 20
  6   t16 = BARS_GT 19                 ; bool
  7   JZ t16, L5
  8   t17 = COPY t14                   ; price
  9   t40 = ALOAD &sum_close_20        ; price
 10   t18 = DIV t40, 20.0              ; price
 11   t19 = SUB t14, t18               ; price
 12   t20 = COPY t18                   ; price
 13   t41 = ALOAD &sum_open_20         ; price
 14   t21 = DIV t41, 20.0              ; price
 15   t22 = SUB t18, t21               ; price
 16   t23 = ALOAD &sum_volume_20       ; volume
 17   t25 = DIV t23, 20.0              ; volume
 18   t26 = CONST 0.0                  ; price
 19   t27 = GT t19, 0.0                ; bool
 20   JZ t27, L6
 21   t30 = GT t22, 0.0                ; bool
 22   t28 = COPY t30                   ; bool
 23   JMP L7
 24 L6:
 25   t28 = CONST 0.0                  ; bool
 26 L7:
 27   JZ t28, L8
 28   t32 = COPY t15                   ; volume
 29   t33 = GT t15, t25                ; bool
 30   t31 = COPY t33                   ; bool
 31   JMP L9
 32 L8:
 33   t31 = CONST 0.0                  ; bool
 34 L9:
 35   JZ t31, L10
 36   t35 = SLOAD @pos                 ; volume
 37   t37 = GT t35, 0.0                ; bool
 38   t34 = COPY t37                   ; bool
 39   JMP L11
 40 L10:
 41   t34 = CONST 0.0                  ; bool
 42 L11:
 43   JZ t34, L12
 44   FLATTEN
 45   SSTORE @pos, 0.0
 46 L12:
 47 L5:
== after global-cse#2: 60 -> 60 instructions, 3 rewritten, data-flow sweeps <= 2 ==
func on_open:
  0   TICK
  1   t1 = LOADFIELD open              ; price
  2   SPUSH $open, t1
  3   RSUM_UPD &sum_open_20, $open, 20
  4   t2 = BARS_GT 19                  ; bool
  5   JZ t2, L1
  6   t3 = COPY t1                     ; price
  7   t39 = ALOAD &sum_open_20         ; price
  8   t4 = DIV t39, 20.0               ; price
  9   t6 = SUB t4, 1.0                 ; price
 10   t7 = LT t1, t6                   ; bool
 11   JZ t7, L2
 12   t9 = SLOAD @pos                  ; volume
 13   t11 = EQ t9, 0.0                 ; bool
 14   t8 = COPY t11                    ; bool
 15   JMP L3
 16 L2:
 17   t8 = CONST 0.0                   ; bool
 18 L3:
 19   JZ t8, L4
 20   BUY 10.0
 21   SSTORE @pos, 10.0
 22 L4:
 23 L1:
func on_close:
  0   t14 = LOADFIELD close            ; price
  1   SPUSH $close, t14
  2   RSUM_UPD &sum_close_20, $close, 20
  3   t15 = LOADFIELD volume           ; volume
  4   SPUSH $volume, t15
  5   RSUM_UPD &sum_volume_20, $volume, 20
  6   t16 = BARS_GT 19                 ; bool
  7   JZ t16, L5
  8   t17 = COPY t14                   ; price
  9   t40 = ALOAD &sum_close_20        ; price
 10   t18 = DIV t40, 20.0              ; price
 11   t19 = SUB t14, t18               ; price
 12   t20 = COPY t18                   ; price
 13   t41 = ALOAD &sum_open_20         ; price
 14   t21 = DIV t41, 20.0              ; price
 15   t22 = SUB t18, t21               ; price
 16   t23 = ALOAD &sum_volume_20       ; volume
 17   t25 = DIV t23, 20.0              ; volume
 18   t26 = CONST 0.0                  ; price
 19   t27 = GT t19, 0.0                ; bool
 20   JZ t27, L6
 21   t30 = GT t22, 0.0                ; bool
 22   t28 = COPY t30                   ; bool
 23   JMP L7
 24 L6:
 25   t28 = COPY t26                   ; bool
 26 L7:
 27   JZ t28, L8
 28   t32 = COPY t15                   ; volume
 29   t33 = GT t15, t25                ; bool
 30   t31 = COPY t33                   ; bool
 31   JMP L9
 32 L8:
 33   t31 = COPY t26                   ; bool
 34 L9:
 35   JZ t31, L10
 36   t35 = SLOAD @pos                 ; volume
 37   t37 = GT t35, 0.0                ; bool
 38   t34 = COPY t37                   ; bool
 39   JMP L11
 40 L10:
 41   t34 = COPY t26                   ; bool
 42 L11:
 43   JZ t34, L12
 44   FLATTEN
 45   SSTORE @pos, 0.0
 46 L12:
 47 L5:
== after dce#2: 60 -> 56 instructions, 4 rewritten, data-flow sweeps <= 2 ==
func on_open:
  0   TICK
  1   t1 = LOADFIELD open              ; price
  2   SPUSH $open, t1
  3   RSUM_UPD &sum_open_20, $open, 20
  4   t2 = BARS_GT 19                  ; bool
  5   JZ t2, L1
  6   t39 = ALOAD &sum_open_20         ; price
  7   t4 = DIV t39, 20.0               ; price
  8   t6 = SUB t4, 1.0                 ; price
  9   t7 = LT t1, t6                   ; bool
 10   JZ t7, L2
 11   t9 = SLOAD @pos                  ; volume
 12   t11 = EQ t9, 0.0                 ; bool
 13   t8 = COPY t11                    ; bool
 14   JMP L3
 15 L2:
 16   t8 = CONST 0.0                   ; bool
 17 L3:
 18   JZ t8, L4
 19   BUY 10.0
 20   SSTORE @pos, 10.0
 21 L4:
 22 L1:
func on_close:
  0   t14 = LOADFIELD close            ; price
  1   SPUSH $close, t14
  2   RSUM_UPD &sum_close_20, $close, 20
  3   t15 = LOADFIELD volume           ; volume
  4   SPUSH $volume, t15
  5   RSUM_UPD &sum_volume_20, $volume, 20
  6   t16 = BARS_GT 19                 ; bool
  7   JZ t16, L5
  8   t40 = ALOAD &sum_close_20        ; price
  9   t18 = DIV t40, 20.0              ; price
 10   t19 = SUB t14, t18               ; price
 11   t41 = ALOAD &sum_open_20         ; price
 12   t21 = DIV t41, 20.0              ; price
 13   t22 = SUB t18, t21               ; price
 14   t23 = ALOAD &sum_volume_20       ; volume
 15   t25 = DIV t23, 20.0              ; volume
 16   t26 = CONST 0.0                  ; price
 17   t27 = GT t19, 0.0                ; bool
 18   JZ t27, L6
 19   t30 = GT t22, 0.0                ; bool
 20   t28 = COPY t30                   ; bool
 21   JMP L7
 22 L6:
 23   t28 = COPY t26                   ; bool
 24 L7:
 25   JZ t28, L8
 26   t33 = GT t15, t25                ; bool
 27   t31 = COPY t33                   ; bool
 28   JMP L9
 29 L8:
 30   t31 = COPY t26                   ; bool
 31 L9:
 32   JZ t31, L10
 33   t35 = SLOAD @pos                 ; volume
 34   t37 = GT t35, 0.0                ; bool
 35   t34 = COPY t37                   ; bool
 36   JMP L11
 37 L10:
 38   t34 = COPY t26                   ; bool
 39 L11:
 40   JZ t34, L12
 41   FLATTEN
 42   SSTORE @pos, 0.0
 43 L12:
 44 L5:
== final TAC (56 instructions) ==
func on_open:
  0   TICK
  1   t1 = LOADFIELD open              ; price
  2   SPUSH $open, t1
  3   RSUM_UPD &sum_open_20, $open, 20
  4   t2 = BARS_GT 19                  ; bool
  5   JZ t2, L1
  6   t39 = ALOAD &sum_open_20         ; price
  7   t4 = DIV t39, 20.0               ; price
  8   t6 = SUB t4, 1.0                 ; price
  9   t7 = LT t1, t6                   ; bool
 10   JZ t7, L2
 11   t9 = SLOAD @pos                  ; volume
 12   t11 = EQ t9, 0.0                 ; bool
 13   t8 = COPY t11                    ; bool
 14   JMP L3
 15 L2:
 16   t8 = CONST 0.0                   ; bool
 17 L3:
 18   JZ t8, L4
 19   BUY 10.0
 20   SSTORE @pos, 10.0
 21 L4:
 22 L1:
func on_close:
  0   t14 = LOADFIELD close            ; price
  1   SPUSH $close, t14
  2   RSUM_UPD &sum_close_20, $close, 20
  3   t15 = LOADFIELD volume           ; volume
  4   SPUSH $volume, t15
  5   RSUM_UPD &sum_volume_20, $volume, 20
  6   t16 = BARS_GT 19                 ; bool
  7   JZ t16, L5
  8   t40 = ALOAD &sum_close_20        ; price
  9   t18 = DIV t40, 20.0              ; price
 10   t19 = SUB t14, t18               ; price
 11   t41 = ALOAD &sum_open_20         ; price
 12   t21 = DIV t41, 20.0              ; price
 13   t22 = SUB t18, t21               ; price
 14   t23 = ALOAD &sum_volume_20       ; volume
 15   t25 = DIV t23, 20.0              ; volume
 16   t26 = CONST 0.0                  ; price
 17   t27 = GT t19, 0.0                ; bool
 18   JZ t27, L6
 19   t30 = GT t22, 0.0                ; bool
 20   t28 = COPY t30                   ; bool
 21   JMP L7
 22 L6:
 23   t28 = COPY t26                   ; bool
 24 L7:
 25   JZ t28, L8
 26   t33 = GT t15, t25                ; bool
 27   t31 = COPY t33                   ; bool
 28   JMP L9
 29 L8:
 30   t31 = COPY t26                   ; bool
 31 L9:
 32   JZ t31, L10
 33   t35 = SLOAD @pos                 ; volume
 34   t37 = GT t35, 0.0                ; bool
 35   t34 = COPY t37                   ; bool
 36   JMP L11
 37 L10:
 38   t34 = COPY t26                   ; bool
 39 L11:
 40   JZ t34, L12
 41   FLATTEN
 42   SSTORE @pos, 0.0
 43 L12:
 44 L5:
