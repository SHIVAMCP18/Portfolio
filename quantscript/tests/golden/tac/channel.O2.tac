== initial TAC (85 instructions) ==
func on_open:
  0   TICK
func on_close:
  0   t1 = LOADFIELD high              ; price
  1   SPUSH $high, t1
  2   t2 = LOADFIELD low               ; price
  3   SPUSH $low, t2
  4   t3 = LOADFIELD close             ; price
  5   SPUSH $close, t3
  6   EMA_UPD &ema_close_50, $close, 50, warm=0
  7   t5 = BARS_GT 19                  ; bool
  8   JZ t5, L1
  9   t6 = ROLLMAX $high, 20           ; price
 10   t4 = COPY t6                     ; price
 11   JMP L2
 12 L1:
 13   t4 = CONST 0.0                   ; price
 14 L2:
 15   SPUSH $up, t4
 16   t8 = BARS_GT 19                  ; bool
 17   JZ t8, L3
 18   t9 = ROLLMIN $low, 20            ; price
 19   t7 = COPY t9                     ; price
 20   JMP L4
 21 L3:
 22   t7 = CONST 0.0                   ; price
 23 L4:
 24   SPUSH $dn, t7
 25   t10 = EMA &ema_close_50          ; price
 26   SPUSH $trend, t10
 27   t11 = BARS_GT 20                 ; bool
 28   JZ t11, L5
 29   t12 = SLOAD @armed               ; bool
 30   JZ t12, L6
 31   t14 = HIST $close, 0             ; price
 32   t15 = HIST $up, 1                ; price
 33   t16 = GT t14, t15                ; bool
 34   t13 = COPY t16                   ; bool
 35   JMP L7
 36 L6:
 37   t13 = CONST 0.0                  ; bool
 38 L7:
 39   JZ t13, L8
 40   t18 = HIST $close, 0             ; price
 41   t19 = HIST $trend, 0             ; price
 42   t20 = GT t18, t19                ; bool
 43   t17 = COPY t20                   ; bool
 44   JMP L9
 45 L8:
 46   t17 = CONST 0.0                  ; bool
 47 L9:
 48   JZ t17, L10
 49   t22 = SLOAD @pos                 ; volume
 50   t23 = CONST 0.0                  ; volume
 51   t24 = EQ t22, t23                ; bool
 52   t21 = COPY t24                   ; bool
 53   JMP L11
 54 L10:
 55   t21 = CONST 0.0                  ; bool
 56 L11:
 57   JZ t21, L12
 58   t25 = CONST 30.0                 ; volume
 59   BUY t25
 60   t26 = CONST 30.0                 ; volume
 61   SSTORE @pos, t26
 62   t27 = CONST 0.0                  ; bool
 63   SSTORE @armed, t27
 64 L12:
 65   t28 = HIST $close, 0             ; price
 66   t29 = HIST $dn, 1                ; price
 67   t30 = GT t28, t29                ; bool
 68   t31 = NOT t30                    ; bool
 69   JNZ t31, L13
 70   t33 = HIST $close, 0             ; price
 71   t34 = HIST $trend, 0             ; price
 72   t35 = SUB t33, t34               ; price
 73   t36 = ABS t35                    ; price
 74   t37 = CONST 15.0                 ; price
 75   t38 = GT t36, t37                ; bool
 76   t32 = COPY t38                   ; bool
 77   JMP L14
 78 L13:
 79   t32 = CONST 1.0                  ; bool
 80 L14:
 81   JZ t32, L15
 82   t39 = SLOAD @pos                 ; volume
 83   t40 = CONST 0.0                  ; volume
 84   t41 = GT t39, t40                ; bool
 85   JZ t41, L16
 86   FLATTEN
 87   t42 = CONST 0.0                  ; volume
 88   SSTORE @pos, t42
 89 L16:
 90   t43 = CONST 1.0                  ; bool
 91   SSTORE @armed, t43
 92 L15:
 93   t44 = ROLLMAX $close, 5          ; price
 94   t45 = ROLLMIN $close, 10         ; price
 95   t46 = LT t44, t45                ; bool
 96   JZ t46, L17
 97   t47 = CONST 0.0                  ; bool
 98   SSTORE @armed, t47
 99 L17:
100 L5:
== after fold: 85 -> 85 instructions, 0 rewritten ==
func on_open:
  0   TICK
func on_close:
  0   t1 = LOADFIELD high              ; price
  1   SPUSH $high, t1
  2   t2 = LOADFIELD low               ; price
  3   SPUSH $low, t2
  4   t3 = LOADFIELD close             ; price
  5   SPUSH $close, t3
  6   EMA_UPD &ema_close_50, $close, 50, warm=0
  7   t5 = BARS_GT 19                  ; bool
  8   JZ t5, L1
  9   t6 = ROLLMAX $high, 20           ; price
 10   t4 = COPY t6                     ; price
 11   JMP L2
 12 L1:
 13   t4 = CONST 0.0                   ; price
 14 L2:
 15   SPUSH $up, t4
 16   t8 = BARS_GT 19                  ; bool
 17   JZ t8, L3
 18   t9 = ROLLMIN $low, 20            ; price
 19   t7 = COPY t9                     ; price
 20   JMP L4
 21 L3:
 22   t7 = CONST 0.0                   ; price
 23 L4:
 24   SPUSH $dn, t7
 25   t10 = EMA &ema_close_50          ; price
 26   SPUSH $trend, t10
 27   t11 = BARS_GT 20                 ; bool
 28   JZ t11, L5
 29   t12 = SLOAD @armed               ; bool
 30   JZ t12, L6
 31   t14 = HIST $close, 0             ; price
 32   t15 = HIST $up, 1                ; price
 33   t16 = GT t14, t15                ; bool
 34   t13 = COPY t16                   ; bool
 35   JMP L7
 36 L6:
 37   t13 = CONST 0.0                  ; bool
 38 L7:
 39   JZ t13, L8
 40   t18 = HIST $close, 0             ; price
 41   t19 = HIST $trend, 0             ; price
 42   t20 = GT t18, t19                ; bool
 43   t17 = COPY t20                   ; bool
 44   JMP L9
 45 L8:
 46   t17 = CONST 0.0                  ; bool
 47 L9:
 48   JZ t17, L10
 49   t22 = SLOAD @pos                 ; volume
 50   t23 = CONST 0.0                  ; volume
 51   t24 = EQ t22, t23                ; bool
 52   t21 = COPY t24                   ; bool
 53   JMP L11
 54 L10:
 55   t21 = CONST 0.0                  ; bool
 56 L11:
 57   JZ t21, L12
 58   t25 = CONST 30.0                 ; volume
 59   BUY t25
 60   t26 = CONST 30.0                 ; volume
 61   SSTORE @pos, t26
 62   t27 = CONST 0.0                  ; bool
 63   SSTORE @armed, t27
 64 L12:
 65   t28 = HIST $close, 0             ; price
 66   t29 = HIST $dn, 1                ; price
 67   t30 = GT t28, t29                ; bool
 68   t31 = NOT t30                    ; bool
 69   JNZ t31, L13
 70   t33 = HIST $close, 0             ; price
 71   t34 = HIST $trend, 0             ; price
 72   t35 = SUB t33, t34               ; price
 73   t36 = ABS t35                    ; price
 74   t37 = CONST 15.0                 ; price
 75   t38 = GT t36, t37                ; bool
 76   t32 = COPY t38                   ; bool
 77   JMP L14
 78 L13:
 79   t32 = CONST 1.0                  ; bool
 80 L14:
 81   JZ t32, L15
 82   t39 = SLOAD @pos                 ; volume
 83   t40 = CONST 0.0                  ; volume
 84   t41 = GT t39, t40                ; bool
 85   JZ t41, L16
 86   FLATTEN
 87   t42 = CONST 0.0                  ; volume
 88   SSTORE @pos, t42
 89 L16:
 90   t43 = CONST 1.0                  ; bool
 91   SSTORE @armed, t43
 92 L15:
 93   t44 = ROLLMAX $close, 5          ; price
 94   t45 = ROLLMIN $close, 10         ; price
 95   t46 = LT t44, t45                ; bool
 96   JZ t46, L17
 97   t47 = CONST 0.0                  ; bool
 98   SSTORE @armed, t47
 99 L17:
100 L5:
== after algebraic: 85 -> 85 instructions, 0 rewritten ==
func on_open:
  0   TICK
func on_close:
  0   t1 = LOADFIELD high              ; price
  1   SPUSH $high, t1
  2   t2 = LOADFIELD low               ; price
  3   SPUSH $low, t2
  4   t3 = LOADFIELD close             ; price
  5   SPUSH $close, t3
  6   EMA_UPD &ema_close_50, $close, 50, warm=0
  7   t5 = BARS_GT 19                  ; bool
  8   JZ t5, L1
  9   t6 = ROLLMAX $high, 20           ; price
 10   t4 = COPY t6                     ; price
 11   JMP L2
 12 L1:
 13   t4 = CONST 0.0                   ; price
 14 L2:
 15   SPUSH $up, t4
 16   t8 = BARS_GT 19                  ; bool
 17   JZ t8, L3
 18   t9 = ROLLMIN $low, 20            ; price
 19   t7 = COPY t9                     ; price
 20   JMP L4
 21 L3:
 22   t7 = CONST 0.0                   ; price
 23 L4:
 24   SPUSH $dn, t7
 25   t10 = EMA &ema_close_50          ; price
 26   SPUSH $trend, t10
 27   t11 = BARS_GT 20                 ; bool
 28   JZ t11, L5
 29   t12 = SLOAD @armed               ; bool
 30   JZ t12, L6
 31   t14 = HIST $close, 0             ; price
 32   t15 = HIST $up, 1                ; price
 33   t16 = GT t14, t15                ; bool
 34   t13 = COPY t16                   ; bool
 35   JMP L7
 36 L6:
 37   t13 = CONST 0.0                  ; bool
 38 L7:
 39   JZ t13, L8
 40   t18 = HIST $close, 0             ; price
 41   t19 = HIST $trend, 0             ; price
 42   t20 = GT t18, t19                ; bool
 43   t17 = COPY t20                   ; bool
 44   JMP L9
 45 L8:
 46   t17 = CONST 0.0                  ; bool
 47 L9:
 48   JZ t17, L10
 49   t22 = SLOAD @pos                 ; volume
 50   t23 = CONST 0.0                  ; volume
 51   t24 = EQ t22, t23                ; bool
 52   t21 = COPY t24                   ; bool
 53   JMP L11
 54 L10:
 55   t21 = CONST 0.0                  ; bool
 56 L11:
 57   JZ t21, L12
 58   t25 = CONST 30.0                 ; volume
 59   BUY t25
 60   t26 = CONST 30.0                 ; volume
 61   SSTORE @pos, t26
 62   t27 = CONST 0.0                  ; bool
 63   SSTORE @armed, t27
 64 L12:
 65   t28 = HIST $close, 0             ; price
 66   t29 = HIST $dn, 1                ; price
 67   t30 = GT t28, t29                ; bool
 68   t31 = NOT t30                    ; bool
 69   JNZ t31, L13
 70   t33 = HIST $close, 0             ; price
 71   t34 = HIST $trend, 0             ; price
 72   t35 = SUB t33, t34               ; price
 73   t36 = ABS t35                    ; price
 74   t37 = CONST 15.0                 ; price
 75   t38 = GT t36, t37                ; bool
 76   t32 = COPY t38                   ; bool
 77   JMP L14
 78 L13:
 79   t32 = CONST 1.0                  ; bool
 80 L14:
 81   JZ t32, L15
 82   t39 = SLOAD @pos                 ; volume
 83   t40 = CONST 0.0                  ; volume
 84   t41 = GT t39, t40                ; bool
 85   JZ t41, L16
 86   FLATTEN
 87   t42 = CONST 0.0                  ; volume
 88   SSTORE @pos, t42
 89 L16:
 90   t43 = CONST 1.0                  ; bool
 91   SSTORE @armed, t43
 92 L15:
 93   t44 = ROLLMAX $close, 5          ; price
 94   t45 = ROLLMIN $close, 10         ; price
 95   t46 = LT t44, t45                ; bool
 96   JZ t46, L17
 97   t47 = CONST 0.0                  ; bool
 98   SSTORE @armed, t47
 99 L17:
100 L5:
== after propagate: 85 -> 85 instructions, 9 rewritten, data-flow sweeps <= 2 ==
func on_open:
  0   TICK
func on_close:
  0   t1 = LOADFIELD high              ; price
  1   SPUSH $high, t1
  2   t2 = LOADFIELD low               ; price
  3   SPUSH $low, t2
  4   t3 = LOADFIELD close             ; price
  5   SPUSH $close, t3
  6   EMA_UPD &ema_close_50, $close, 50, warm=0
  7   t5 = BARS_GT 19                  ; bool
  8   JZ t5, L1
  9   t6 = ROLLMAX $high, 20           ; price
 10   t4 = COPY t6                     ; price
 11   JMP L2
 12 L1:
 13   t4 = CONST 0.0                   ; price
 14 L2:
 15   SPUSH $up, t4
 16   t8 = BARS_GT 19                  ; bool
 17   JZ t8, L3
 18   t9 = ROLLMIN $low, 20            ; price
 19   t7 = COPY t9                     ; price
 20   JMP L4
 21 L3:
 22   t7 = CONST 0.0                   ; price
 23 L4:
 24   SPUSH $dn, t7
 25   t10 = EMA &ema_close_50          ; price
 26   SPUSH $trend, t10
 27   t11 = BARS_GT 20                 ; bool
 28   JZ t11, L5
 29   t12 = SLOAD @armed               ; bool
 30   JZ t12, L6
 31   t14 = HIST $close, 0             ; price
 32   t15 = HIST $up, 1                ; price
 33   t16 = GT t14, t15                ; bool
 34   t13 = COPY t16                   ; bool
 35   JMP L7
 36 L6:
 37   t13 = CONST 0.0                  ; bool
 38 L7:
 39   JZ t13, L8
 40   t18 = HIST $close, 0             ; price
 41   t19 = HIST $trend, 0             ; price
 42   t20 = GT t18, t19                ; bool
 43   t17 = COPY t20                   ; bool
 44   JMP L9
 45 L8:
 46   t17 = CONST 0.0                  ; bool
 47 L9:
 48   JZ t17, L10
 49   t22 = SLOAD @pos                 ; volume
 50   t23 = CONST 0.0                  ; volume
 51   t24 = EQ t22, 0.0                ; bool
 52   t21 = COPY t24                   ; bool
 53   JMP L11
 54 L10:
 55   t21 = CONST 0.0                  ; bool
 56 L11:
 57   JZ t21, L12
 58   t25 = CONST 30.0                 ; volume
 59   BUY 30.0
 60   t26 = CONST 30.0                 ; volume
 61   SSTORE @pos, 30.0
 62   t27 = CONST 0.0                  ; bool
 63   SSTORE @armed, 0.0
 64 L12:
 65   t28 = HIST $close, 0             ; price
 66   t29 = HIST $dn, 1                ; price
 67   t30 = GT t28, t29                ; bool
 68   t31 = NOT t30                    ; bool
 69   JNZ t31, L13
 70   t33 = HIST $close, 0             ; price
 71   t34 = HIST $trend, 0             ; price
 72   t35 = SUB t33, t34               ; price
 73   t36 = ABS t35                    ; price
 74   t37 = CONST 15.0                 ; price
 75   t38 = GT t36, 15.0               ; bool
 76   t32 = COPY t38                   ; bool
 77   JMP L14
 78 L13:
 79   t32 = CONST 1.0                  ; bool
 80 L14:
 81   JZ t32, L15
 82   t39 = SLOAD @pos                 ; volume
 83   t40 = CONST 0.0                  ; volume
 84   t41 = GT t39, 0.0                ; bool
 85   JZ t41, L16
 86   FLATTEN
 87   t42 = CONST 0.0                  ; volume
 88   SSTORE @pos, 0.0
 89 L16:
 90   t43 = CONST 1.0                  ; bool
 91   SSTORE @armed, 1.0
 92 L15:
 93   t44 = ROLLMAX $close, 5          ; price
 94   t45 = ROLLMIN $close, 10         ; price
 95   t46 = LT t44, t45                ; bool
 96   JZ t46, L17
 97   t47 = CONST 0.0                  ; bool
 98   SSTORE @armed, 0.0
 99 L17:
100 L5:
== after lvn-cse: 85 -> 85 instructions, 1 rewritten ==
func on_open:
  0   TICK
func on_close:
  0   t1 = LOADFIELD high              ; price
  1   SPUSH $high, t1
  2   t2 = LOADFIELD low               ; price
  3   SPUSH $low, t2
  4   t3 = LOADFIELD close             ; price
  5   SPUSH $close, t3
  6   EMA_UPD &ema_close_50, $close, 50, warm=0
  7   t5 = BARS_GT 19                  ; bool
  8   JZ t5, L1
  9   t6 = ROLLMAX $high, 20           ; price
 10   t4 = COPY t6                     ; price
 11   JMP L2
 12 L1:
 13   t4 = CONST 0.0                   ; price
 14 L2:
 15   SPUSH $up, t4
 16   t8 = BARS_GT 19                  ; bool
 17   JZ t8, L3
 18   t9 = ROLLMIN $low, 20            ; price
 19   t7 = COPY t9                     ; price
 20   JMP L4
 21 L3:
 22   t7 = CONST 0.0                   ; price
 23 L4:
 24   SPUSH $dn, t7
 25   t10 = EMA &ema_close_50          ; price
 26   SPUSH $trend, t10
 27   t11 = BARS_GT 20                 ; bool
 28   JZ t11, L5
 29   t12 = SLOAD @armed               ; bool
 30   JZ t12, L6
 31   t14 = HIST $close, 0             ; price
 32   t15 = HIST $up, 1                ; price
 33   t16 = GT t14, t15                ; bool
 34   t13 = COPY t16                   ; bool
 35   JMP L7
 36 L6:
 37   t13 = CONST 0.0                  ; bool
 38 L7:
 39   JZ t13, L8
 40   t18 = HIST $close, 0             ; price
 41   t19 = HIST $trend, 0             ; price
 42   t20 = GT t18, t19                ; bool
 43   t17 = COPY t20                   ; bool
 44   JMP L9
 45 L8:
 46   t17 = CONST 0.0                  ; bool
 47 L9:
 48   JZ t17, L10
 49   t22 = SLOAD @pos                 ; volume
 50   t23 = CONST 0.0                  ; volume
 51   t24 = EQ t22, 0.0                ; bool
 52   t21 = COPY t24                   ; bool
 53   JMP L11
 54 L10:
 55   t21 = CONST 0.0                  ; bool
 56 L11:
 57   JZ t21, L12
 58   t25 = CONST 30.0                 ; volume
 59   BUY 30.0
 60   t26 = COPY t25                   ; volume
 61   SSTORE @pos, 30.0
 62   t27 = CONST 0.0                  ; bool
 63   SSTORE @armed, 0.0
 64 L12:
 65   t28 = HIST $close, 0             ; price
 66   t29 = HIST $dn, 1                ; price
 67   t30 = GT t28, t29                ; bool
 68   t31 = NOT t30                    ; bool
 69   JNZ t31, L13
 70   t33 = HIST $close, 0             ; price
 71   t34 = HIST $trend, 0             ; price
 72   t35 = SUB t33, t34               ; price
 73   t36 = ABS t35                    ; price
 74   t37 = CONST 15.0                 ; price
 75   t38 = GT t36, 15.0               ; bool
 76   t32 = COPY t38                   ; bool
 77   JMP L14
 78 L13:
 79   t32 = CONST 1.0                  ; bool
 80 L14:
 81   JZ t32, L15
 82   t39 = SLOAD @pos                 ; volume
 83   t40 = CONST 0.0                  ; volume
 84   t41 = GT t39, 0.0                ; bool
 85   JZ t41, L16
 86   FLATTEN
 87   t42 = CONST 0.0                  ; volume
 88   SSTORE @pos, 0.0
 89 L16:
 90   t43 = CONST 1.0                  ; bool
 91   SSTORE @armed, 1.0
 92 L15:
 93   t44 = ROLLMAX $close, 5          ; price
 94   t45 = ROLLMIN $close, 10         ; price
 95   t46 = LT t44, t45                ; bool
 96   JZ t46, L17
 97   t47 = CONST 0.0                  ; bool
 98   SSTORE @armed, 0.0
 99 L17:
100 L5:
== after global-cse: 85 -> 85 instructions, 8 rewritten, data-flow sweeps <= 2 ==
func on_open:
  0   TICK
func on_close:
  0   t1 = LOADFIELD high              ; price
  1   SPUSH $high, t1
  2   t2 = LOADFIELD low               ; price
  3   SPUSH $low, t2
  4   t3 = LOADFIELD close             ; price
  5   SPUSH $close, t3
  6   EMA_UPD &ema_close_50, $close, 50, warm=0
  7   t5 = BARS_GT 19                  ; bool
  8   JZ t5, L1
  9   t6 = ROLLMAX $high, 20           ; price
 10   t4 = COPY t6                     ; price
 11   JMP L2
 12 L1:
 13   t4 = CONST 0.0                   ; price
 14 L2:
 15   SPUSH $up, t4
 16   t8 = COPY t5                     ; bool
 17   JZ t8, L3
 18   t9 = ROLLMIN $low, 20            ; price
 19   t7 = COPY t9                     ; price
 20   JMP L4
 21 L3:
 22   t7 = CONST 0.0                   ; price
 23 L4:
 24   SPUSH $dn, t7
 25   t10 = EMA &ema_close_50          ; price
 26   SPUSH $trend, t10
 27   t11 = BARS_GT 20                 ; bool
 28   JZ t11, L5
 29   t12 = SLOAD @armed               ; bool
 30   JZ t12, L6
 31   t14 = COPY t3                    ; price
 32   t15 = HIST $up, 1                ; price
 33   t16 = GT t14, t15                ; bool
 34   t13 = COPY t16                   ; bool
 35   JMP L7
 36 L6:
 37   t13 = CONST 0.0                  ; bool
 38 L7:
 39   JZ t13, L8
 40   t18 = COPY t3                    ; price
 41   t19 = COPY t10                   ; price
 42   t20 = GT t18, t19                ; bool
 43   t17 = COPY t20                   ; bool
 44   JMP L9
 45 L8:
 46   t17 = CONST 0.0                  ; bool
 47 L9:
 48   JZ t17, L10
 49   t22 = SLOAD @pos                 ; volume
 50   t23 = CONST 0.0                  ; volume
 51   t24 = EQ t22, 0.0                ; bool
 52   t21 = COPY t24                   ; bool
 53   JMP L11
 54 L10:
 55   t21 = CONST 0.0                  ; bool
 56 L11:
 57   JZ t21, L12
 58   t25 = CONST 30.0                 ; volume
 59   BUY 30.0
 60   t26 = COPY t25                   ; volume
 61   SSTORE @pos, 30.0
 62   t27 = CONST 0.0                  ; bool
 63   SSTORE @armed, 0.0
 64 L12:
 65   t28 = COPY t3                    ; price
 66   t29 = HIST $dn, 1                ; price
 67   t30 = GT t28, t29                ; bool
 68   t31 = NOT t30                    ; bool
 69   JNZ t31, L13
 70   t33 = COPY t3                    ; price
 71   t34 = COPY t10                   ; price
 72   t35 = SUB t33, t34               ; price
 73   t36 = ABS t35                    ; price
 74   t37 = CONST 15.0                 ; price
 75   t38 = GT t36, 15.0               ; bool
 76   t32 = COPY t38                   ; bool
 77   JMP L14
 78 L13:
 79   t32 = CONST 1.0                  ; bool
 80 L14:
 81   JZ t32, L15
 82   t39 = SLOAD @pos                 ; volume
 83   t40 = CONST 0.0                  ; volume
 84   t41 = GT t39, 0.0                ; bool
 85   JZ t41, L16
 86   FLATTEN
 87   t42 = COPY t40                   ; volume
 88   SSTORE @pos, 0.0
 89 L16:
 90   t43 = CONST 1.0                  ; bool
 91   SSTORE @armed, 1.0
 92 L15:
 93   t44 = ROLLMAX $close, 5          ; price
 94   t45 = ROLLMIN $close, 10         ; price
 95   t46 = LT t44, t45                ; bool
 96   JZ t46, L17
 97   t47 = CONST 0.0                  ; bool
 98   SSTORE @armed, 0.0
 99 L17:
100 L5:
== after dce: 85 -> 76 instructions, 9 rewritten, data-flow sweeps <= 2 ==
func on_open:
  0   TICK
func on_close:
  0   t1 = LOADFIELD high              ; price
  1   SPUSH $high, t1
  2   t2 = LOADFIELD low               ; price
  3   SPUSH $low, t2
  4   t3 = LOADFIELD close             ; price
  5   SPUSH $close, t3
  6   EMA_UPD &ema_close_50, $close, 50, warm=0
  7   t5 = BARS_GT 19                  ; bool
  8   JZ t5, L1
  9   t6 = ROLLMAX $high, 20           ; price
 10   t4 = COPY t6                     ; price
 11   JMP L2
 12 L1:
 13   t4 = CONST 0.0                   ; price
 14 L2:
 15   SPUSH $up, t4
 16   t8 = COPY t5                     ; bool
 17   JZ t8, L3
 18   t9 = ROLLMIN $low, 20            ; price
 19   t7 = COPY t9                     ; price
 20   JMP L4
 21 L3:
 22   t7 = CONST 0.0                   ; price
 23 L4:
 24   SPUSH $dn, t7
 25   t10 = EMA &ema_close_50          ; price
 26   SPUSH $trend, t10
 27   t11 = BARS_GT 20                 ; bool
 28   JZ t11, L5
 29   t12 = SLOAD @armed               ; bool
 30   JZ t12, L6
 31   t14 = COPY t3                    ; price
 32   t15 = HIST $up, 1                ; price
 33   t16 = GT t14, t15                ; bool
 34   t13 = COPY t16                   ; bool
 35   JMP L7
 36 L6:
 37   t13 = CONST 0.0                  ; bool
 38 L7:
 39   JZ t13, L8
 40   t18 = COPY t3                    ; price
 41   t19 = COPY t10                   ; price
 42   t20 = GT t18, t19                ; bool
 43   t17 = COPY t20                   ; bool
 44   JMP L9
 45 L8:
 46   t17 = CONST 0.0                  ; bool
 47 L9:
 48   JZ t17, L10
 49   t22 = SLOAD @pos                 ; volume
 50   t24 = EQ t22, 0.0                ; bool
 51   t21 = COPY t24                   ; bool
 52   JMP L11
 53 L10:
 54   t21 = CONST 0.0                  ; bool
 55 L11:
 56   JZ t21, L12
 57   BUY 30.0
 58   SSTORE @pos, 30.0
 59   SSTORE @armed, 0.0
 60 L12:
 61   t28 = COPY t3                    ; price
 62   t29 = HIST $dn, 1                ; price
 63   t30 = GT t28, t29                ; bool
 64   t31 = NOT t30                    ; bool
 65   JNZ t31, L13
 66   t33 = COPY t3                    ; price
 67   t34 = COPY t10                   ; price
 68   t35 = SUB t33, t34               ; price
 69   t36 = ABS t35                    ; price
 70   t38 = GT t36, 15.0               ; bool
 71   t32 = COPY t38                   ; bool
 72   JMP L14
 73 L13:
 74   t32 = CONST 1.0                  ; bool
 75 L14:
 76   JZ t32, L15
 77   t39 = SLOAD @pos                 ; volume
 78   t41 = GT t39, 0.0                ; bool
 79   JZ t41, L16
 80   FLATTEN
 81   SSTORE @pos, 0.0
 82 L16:
 83   SSTORE @armed, 1.0
 84 L15:
 85   t44 = ROLLMAX $close, 5          ; price
 86   t45 = ROLLMIN $close, 10         ; price
 87   t46 = LT t44, t45                ; bool
 88   JZ t46, L17
 89   SSTORE @armed, 0.0
 90 L17:
 91 L5:
== after window-sr: 76 -> 80 instructions, 8 rewritten ==
func on_open:
  0   TICK
func on_close:
  0   t1 = LOADFIELD high              ; price
  1   SPUSH $high, t1
  2   WMAX_UPD &dqmax_high_20, $high, 20
  3   t2 = LOADFIELD low               ; price
  4   SPUSH $low, t2
  5   WMIN_UPD &dqmin_low_20, $low, 20
  6   t3 = LOADFIELD close             ; price
  7   SPUSH $close, t3
  8   WMAX_UPD &dqmax_close_5, $close, 5
  9   WMIN_UPD &dqmin_close_10, $close, 10
 10   EMA_UPD &ema_close_50, $close, 50, warm=0
 11   t5 = BARS_GT 19                  ; bool
 12   JZ t5, L1
 13   t6 = WMAX_GET &dqmax_high_20, $high ; price
 14   t4 = COPY t6                     ; price
 15   JMP L2
 16 L1:
 17   t4 = CONST 0.0                   ; price
 18 L2:
 19   SPUSH $up, t4
 20   t8 = COPY t5                     ; bool
 21   JZ t8, L3
 22   t9 = WMIN_GET &dqmin_low_20, $low ; price
 23   t7 = COPY t9                     ; price
 24   JMP L4
 25 L3:
 26   t7 = CONST 0.0                   ; price
 27 L4:
 28   SPUSH $dn, t7
 29   t10 = EMA &ema_close_50          ; price
 30   SPUSH $trend, t10
 31   t11 = BARS_GT 20                 ; bool
 32   JZ t11, L5
 33   t12 = SLOAD @armed               ; bool
 34   JZ t12, L6
 35   t14 = COPY t3                    ; price
 36   t15 = HIST $up, 1                ; price
 37   t16 = GT t14, t15                ; bool
 38   t13 = COPY t16                   ; bool
 39   JMP L7
 40 L6:
 41   t13 = CONST 0.0                  ; bool
 42 L7:
 43   JZ t13, L8
 44   t18 = COPY t3                    ; price
 45   t19 = COPY t10                   ; price
 46   t20 = GT t18, t19                ; bool
 47   t17 = COPY t20                   ; bool
 48   JMP L9
 49 L8:
 50   t17 = CONST 0.0                  ; bool
 51 L9:
 52   JZ t17, L10
 53   t22 = SLOAD @pos                 ; volume
 54   t24 = EQ t22, 0.0                ; bool
 55   t21 = COPY t24                   ; bool
 56   JMP L11
 57 L10:
 58   t21 = CONST 0.0                  ; bool
 59 L11:
 60   JZ t21, L12
 61   BUY 30.0
 62   SSTORE @pos, 30.0
 63   SSTORE @armed, 0.0
 64 L12:
 65   t28 = COPY t3                    ; price
 66   t29 = HIST $dn, 1                ; price
 67   t30 = GT t28, t29                ; bool
 68   t31 = NOT t30                    ; bool
 69   JNZ t31, L13
 70   t33 = COPY t3                    ; price
 71   t34 = COPY t10                   ; price
 72   t35 = SUB t33, t34               ; price
 73   t36 = ABS t35                    ; price
 74   t38 = GT t36, 15.0               ; bool
 75   t32 = COPY t38                   ; bool
 76   JMP L14
 77 L13:
 78   t32 = CONST 1.0                  ; bool
 79 L14:
 80   JZ t32, L15
 81   t39 = SLOAD @pos                 ; volume
 82   t41 = GT t39, 0.0                ; bool
 83   JZ t41, L16
 84   FLATTEN
 85   SSTORE @pos, 0.0
 86 L16:
 87   SSTORE @armed, 1.0
 88 L15:
 89   t44 = WMAX_GET &dqmax_close_5, $close ; price
 90   t45 = WMIN_GET &dqmin_close_10, $close ; price
 91   t46 = LT t44, t45                ; bool
 92   JZ t46, L17
 93   SSTORE @armed, 0.0
 94 L17:
 95 L5:
== after peephole: 80 -> 80 instructions, 1 rewritten ==
func on_open:
  0   TICK
func on_close:
  0   t1 = LOADFIELD high              ; price
  1   SPUSH $high, t1
  2   WMAX_UPD &dqmax_high_20, $high, 20
  3   t2 = LOADFIELD low               ; price
  4   SPUSH $low, t2
  5   WMIN_UPD &dqmin_low_20, $low, 20
  6   t3 = LOADFIELD close             ; price
  7   SPUSH $close, t3
  8   WMAX_UPD &dqmax_close_5, $close, 5
  9   WMIN_UPD &dqmin_close_10, $close, 10
 10   EMA_UPD &ema_close_50, $close, 50, warm=0
 11   t5 = BARS_GT 19                  ; bool
 12   JZ t5, L1
 13   t6 = WMAX_GET &dqmax_high_20, $high ; price
 14   t4 = COPY t6                     ; price
 15   JMP L2
 16 L1:
 17   t4 = CONST 0.0                   ; price
 18 L2:
 19   SPUSH $up, t4
 20   t8 = COPY t5                     ; bool
 21   JZ t8, L3
 22   t9 = WMIN_GET &dqmin_low_20, $low ; price
 23   t7 = COPY t9                     ; price
 24   JMP L4
 25 L3:
 26   t7 = CONST 0.0                   ; price
 27 L4:
 28   SPUSH $dn, t7
 29   t10 = EMA &ema_close_50          ; price
 30   SPUSH $trend, t10
 31   t11 = BARS_GT 20                 ; bool
 32   JZ t11, L5
 33   t12 = SLOAD @armed               ; bool
 34   JZ t12, L6
 35   t14 = COPY t3                    ; price
 36   t15 = HIST $up, 1                ; price
 37   t16 = GT t14, t15                ; bool
 38   t13 = COPY t16                   ; bool
 39   JMP L7
 40 L6:
 41   t13 = CONST 0.0                  ; bool
 42 L7:
 43   JZ t13, L8
 44   t18 = COPY t3                    ; price
 45   t19 = COPY t10                   ; price
 46   t20 = GT t18, t19                ; bool
 47   t17 = COPY t20                   ; bool
 48   JMP L9
 49 L8:
 50   t17 = CONST 0.0                  ; bool
 51 L9:
 52   JZ t17, L10
 53   t22 = SLOAD @pos                 ; volume
 54   t24 = EQ t22, 0.0                ; bool
 55   t21 = COPY t24                   ; bool
 56   JMP L11
 57 L10:
 58   t21 = CONST 0.0                  ; bool
 59 L11:
 60   JZ t21, L12
 61   BUY 30.0
 62   SSTORE @pos, 30.0
 63   SSTORE @armed, 0.0
 64 L12:
 65   t28 = COPY t3                    ; price
 66   t29 = HIST $dn, 1                ; price
 67   t30 = GT t28, t29                ; bool
 68   t31 = LE t28, t29                ; bool
 69   JNZ t31, L13
 70   t33 = COPY t3                    ; price
 71   t34 = COPY t10                   ; price
 72   t35 = SUB t33, t34               ; price
 73   t36 = ABS t35                    ; price
 74   t38 = GT t36, 15.0               ; bool
 75   t32 = COPY t38                   ; bool
 76   JMP L14
 77 L13:
 78   t32 = CONST 1.0                  ; bool
 79 L14:
 80   JZ t32, L15
 81   t39 = SLOAD @pos                 ; volume
 82   t41 = GT t39, 0.0                ; bool
 83   JZ t41, L16
 84   FLATTEN
 85   SSTORE @pos, 0.0
 86 L16:
 87   SSTORE @armed, 1.0
 88 L15:
 89   t44 = WMAX_GET &dqmax_close_5, $close ; price
 90   t45 = WMIN_GET &dqmin_close_10, $close ; price
 91   t46 = LT t44, t45                ; bool
 92   JZ t46, L17
 93   SSTORE @armed, 0.0
 94 L17:
 95 L5:
== after fold#2: 80 -> 80 instructions, 0 rewritten ==
func on_open:
  0   TICK
func on_close:
  0   t1 = LOADFIELD high              ; price
  1   SPUSH $high, t1
  2   WMAX_UPD &dqmax_high_20, $high, 20
  3   t2 = LOADFIELD low               ; price
  4   SPUSH $low, t2
  5   WMIN_UPD &dqmin_low_20, $low, 20
  6   t3 = LOADFIELD close             ; price
  7   SPUSH $close, t3
  8   WMAX_UPD &dqmax_close_5, $close, 5
  9   WMIN_UPD &dqmin_close_10, $close, 10
 10   EMA_UPD &ema_close_50, $close, 50, warm=0
 11   t5 = BARS_GT 19                  ; bool
 12   JZ t5, L1
 13   t6 = WMAX_GET &dqmax_high_20, $high ; price
 14   t4 = COPY t6                     ; price
 15   JMP L2
 16 L1:
 17   t4 = CONST 0.0                   ; price
 18 L2:
 19   SPUSH $up, t4
 20   t8 = COPY t5                     ; bool
 21   JZ t8, L3
 22   t9 = WMIN_GET &dqmin_low_20, $low ; price
 23   t7 = COPY t9                     ; price
 24   JMP L4
 25 L3:
 26   t7 = CONST 0.0                   ; price
 27 L4:
 28   SPUSH $dn, t7
 29   t10 = EMA &ema_close_50          ; price
 30   SPUSH $trend, t10
 31   t11 = BARS_GT 20                 ; bool
 32   JZ t11, L5
 33   t12 = SLOAD @armed               ; bool
 34   JZ t12, L6
 35   t14 = COPY t3                    ; price
 36   t15 = HIST $up, 1                ; price
 37   t16 = GT t14, t15                ; bool
 38   t13 = COPY t16                   ; bool
 39   JMP L7
 40 L6:
 41   t13 = CONST 0.0                  ; bool
 42 L7:
 43   JZ t13, L8
 44   t18 = COPY t3                    ; price
 45   t19 = COPY t10                   ; price
 46   t20 = GT t18, t19                ; bool
 47   t17 = COPY t20                   ; bool
 48   JMP L9
 49 L8:
 50   t17 = CONST 0.0                  ; bool
 51 L9:
 52   JZ t17, L10
 53   t22 = SLOAD @pos                 ; volume
 54   t24 = EQ t22, 0.0                ; bool
 55   t21 = COPY t24                   ; bool
 56   JMP L11
 57 L10:
 58   t21 = CONST 0.0                  ; bool
 59 L11:
 60   JZ t21, L12
 61   BUY 30.0
 62   SSTORE @pos, 30.0
 63   SSTORE @armed, 0.0
 64 L12:
 65   t28 = COPY t3                    ; price
 66   t29 = HIST $dn, 1                ; price
 67   t30 = GT t28, t29                ; bool
 68   t31 = LE t28, t29                ; bool
 69   JNZ t31, L13
 70   t33 = COPY t3                    ; price
 71   t34 = COPY t10                   ; price
 72   t35 = SUB t33, t34               ; price
 73   t36 = ABS t35                    ; price
 74   t38 = GT t36, 15.0               ; bool
 75   t32 = COPY t38                   ; bool
 76   JMP L14
 77 L13:
 78   t32 = CONST 1.0                  ; bool
 79 L14:
 80   JZ t32, L15
 81   t39 = SLOAD @pos                 ; volume
 82   t41 = GT t39, 0.0                ; bool
 83   JZ t41, L16
 84   FLATTEN
 85   SSTORE @pos, 0.0
 86 L16:
 87   SSTORE @armed, 1.0
 88 L15:
 89   t44 = WMAX_GET &dqmax_close_5, $close ; price
 90   t45 = WMIN_GET &dqmin_close_10, $close ; price
 91   t46 = LT t44, t45                ; bool
 92   JZ t46, L17
 93   SSTORE @armed, 0.0
 94 L17:
 95 L5:
== after propagate#2: 80 -> 80 instructions, 8 rewritten, data-flow sweeps <= 2 ==
func on_open:
  0   TICK
func on_close:
  0   t1 = LOADFIELD high              ; price
  1   SPUSH $high, t1
  2   WMAX_UPD &dqmax_high_20, $high, 20
  3   t2 = LOADFIELD low               ; price
  4   SPUSH $low, t2
  5   WMIN_UPD &dqmin_low_20, $low, 20
  6   t3 = LOADFIELD close             ; price
  7   SPUSH $close, t3
  8   WMAX_UPD &dqmax_close_5, $close, 5
  9   WMIN_UPD &dqmin_close_10, $close, 10
 10   EMA_UPD &ema_close_50, $close, 50, warm=0
 11   t5 = BARS_GT 19                  ; bool
 12   JZ t5, L1
 13   t6 = WMAX_GET &dqmax_high_20, $high ; price
 14   t4 = COPY t6                     ; price
 15   JMP L2
 16 L1:
 17   t4 = CONST 0.0                   ; price
 18 L2:
 19   SPUSH $up, t4
 20   t8 = COPY t5                     ; bool
 21   JZ t5, L3
 22   t9 = WMIN_GET &dqmin_low_20, $low ; price
 23   t7 = COPY t9                     ; price
 24   JMP L4
 25 L3:
 26   t7 = CONST 0.0                   ; price
 27 L4:
 28   SPUSH $dn, t7
 29   t10 = EMA &ema_close_50          ; price
 30   SPUSH $trend, t10
 31   t11 = BARS_GT 20                 ; bool
 32   JZ t11, L5
 33   t12 = SLOAD @armed               ; bool
 34   JZ t12, L6
 35   t14 = COPY t3                    ; price
 36   t15 = HIST $up, 1                ; price
 37   t16 = GT t3, t15                 ; bool
 38   t13 = COPY t16                   ; bool
 39   JMP L7
 40 L6:
 41   t13 = CONST 0.0                  ; bool
 42 L7:
 43   JZ t13, L8
 44   t18 = COPY t3                    ; price
 45   t19 = COPY t10                   ; price
 46   t20 = GT t3, t10                 ; bool
 47   t17 = COPY t20                   ; bool
 48   JMP L9
 49 L8:
 50   t17 = CONST 0.0                  ; bool
 51 L9:
 52   JZ t17, L10
 53   t22 = SLOAD @pos                 ; volume
 54   t24 = EQ t22, 0.0                ; bool
 55   t21 = COPY t24                   ; bool
 56   JMP L11
 57 L10:
 58   t21 = CONST 0.0                  ; bool
 59 L11:
 60   JZ t21, L12
 61   BUY 30.0
 62   SSTORE @pos, 30.0
 63   SSTORE @armed, 0.0
 64 L12:
 65   t28 = COPY t3                    ; price
 66   t29 = HIST $dn, 1                ; price
 67   t30 = GT t3, t29                 ; bool
 68   t31 = LE t3, t29                 ; bool
 69   JNZ t31, L13
 70   t33 = COPY t3                    ; price
 71   t34 = COPY t10                   ; price
 72   t35 = SUB t3, t10                ; price
 73   t36 = ABS t35                    ; price
 74   t38 = GT t36, 15.0               ; bool
 75   t32 = COPY t38                   ; bool
 76   JMP L14
 77 L13:
 78   t32 = CONST 1.0                  ; bool
 79 L14:
 80   JZ t32, L15
 81   t39 = SLOAD @pos                 ; volume
 82   t41 = GT t39, 0.0                ; bool
 83   JZ t41, L16
 84   FLATTEN
 85   SSTORE @pos, 0.0
 86 L16:
 87   SSTORE @armed, 1.0
 88 L15:
 89   t44 = WMAX_GET &dqmax_close_5, $close ; price
 90   t45 = WMIN_GET &dqmin_close_10, $close ; price
 91   t46 = LT t44, t45                ; bool
 92   JZ t46, L17
 93   SSTORE @armed, 0.0
 94 L17:
 95 L5:
== after lvn-cse#2: 80 -> 80 instructions, 0 rewritten ==
func on_open:
  0   TICK
func on_close:
  0   t1 = LOADFIELD high              ; price
  1   SPUSH $high, t1
  2   WMAX_UPD &dqmax_high_20, $high, 20
  3   t2 = LOADFIELD low               ; price
  4   SPUSH $low, t2
  5   WMIN_UPD &dqmin_low_20, $low, 20
  6   t3 = LOADFIELD close             ; price
  7   SPUSH $close, t3
  8   WMAX_UPD &dqmax_close_5, $close, 5
  9   WMIN_UPD &dqmin_close_10, $close, 10
 10   EMA_UPD &ema_close_50, $close, 50, warm=0
 11   t5 = BARS_GT 19                  ; bool
 12   JZ t5, L1
 13   t6 = WMAX_GET &dqmax_high_20, $high ; price
 14   t4 = COPY t6                     ; price
 15   JMP L2
 16 L1:
 17   t4 = CONST 0.0                   ; price
 18 L2:
 19   SPUSH $up, t4
 20   t8 = COPY t5                     ; bool
 21   JZ t5, L3
 22   t9 = WMIN_GET &dqmin_low_20, $low ; price
 23   t7 = COPY t9                     ; price
 24   JMP L4
 25 L3:
 26   t7 = CONST 0.0                   ; price
 27 L4:
 28   SPUSH $dn, t7
 29   t10 = EMA &ema_close_50          ; price
 30   SPUSH $trend, t10
 31   t11 = BARS_GT 20                 ; bool
 32   JZ t11, L5
 33   t12 = SLOAD @armed               ; bool
 34   JZ t12, L6
 35   t14 = COPY t3                    ; price
 36   t15 = HIST $up, 1                ; price
 37   t16 = GT t3, t15                 ; bool
 38   t13 = COPY t16                   ; bool
 39   JMP L7
 40 L6:
 41   t13 = CONST 0.0                  ; bool
 42 L7:
 43   JZ t13, L8
 44   t18 = COPY t3                    ; price
 45   t19 = COPY t10                   ; price
 46   t20 = GT t3, t10                 ; bool
 47   t17 = COPY t20                   ; bool
 48   JMP L9
 49 L8:
 50   t17 = CONST 0.0                  ; bool
 51 L9:
 52   JZ t17, L10
 53   t22 = SLOAD @pos                 ; volume
 54   t24 = EQ t22, 0.0                ; bool
 55   t21 = COPY t24                   ; bool
 56   JMP L11
 57 L10:
 58   t21 = CONST 0.0                  ; bool
 59 L11:
 60   JZ t21, L12
 61   BUY 30.0
 62   SSTORE @pos, 30.0
 63   SSTORE @armed, 0.0
 64 L12:
 65   t28 = COPY t3                    ; price
 66   t29 = HIST $dn, 1                ; price
 67   t30 = GT t3, t29                 ; bool
 68   t31 = LE t3, t29                 ; bool
 69   JNZ t31, L13
 70   t33 = COPY t3                    ; price
 71   t34 = COPY t10                   ; price
 72   t35 = SUB t3, t10                ; price
 73   t36 = ABS t35                    ; price
 74   t38 = GT t36, 15.0               ; bool
 75   t32 = COPY t38                   ; bool
 76   JMP L14
 77 L13:
 78   t32 = CONST 1.0                  ; bool
 79 L14:
 80   JZ t32, L15
 81   t39 = SLOAD @pos                 ; volume
 82   t41 = GT t39, 0.0                ; bool
 83   JZ t41, L16
 84   FLATTEN
 85   SSTORE @pos, 0.0
 86 L16:
 87   SSTORE @armed, 1.0
 88 L15:
 89   t44 = WMAX_GET &dqmax_close_5, $close ; price
 90   t45 = WMIN_GET &dqmin_close_10, $close ; price
 91   t46 = LT t44, t45                ; bool
 92   JZ t46, L17
 93   SSTORE @armed, 0.0
 94 L17:
 95 L5:
== after global-cse#2: 80 -> 80 instructions, 0 rewritten, data-flow sweeps <= 2 ==
func on_open:
  0   TICK
func on_close:
  0   t1 = LOADFIELD high              ; price
  1   SPUSH $high, t1
  2   WMAX_UPD &dqmax_high_20, $high, 20
  3   t2 = LOADFIELD low               ; price
  4   SPUSH $low, t2
  5   WMIN_UPD &dqmin_low_20, $low, 20
  6   t3 = LOADFIELD close             ; price
  7   SPUSH $close, t3
  8   WMAX_UPD &dqmax_close_5, $close, 5
  9   WMIN_UPD &dqmin_close_10, $close, 10
 10   EMA_UPD &ema_close_50, $close, 50, warm=0
 11   t5 = BARS_GT 19                  ; bool
 12   JZ t5, L1
 13   t6 = WMAX_GET &dqmax_high_20, $high ; price
 14   t4 = COPY t6                     ; price
 15   JMP L2
 16 L1:
 17   t4 = CONST 0.0                   ; price
 18 L2:
 19   SPUSH $up, t4
 20   t8 = COPY t5                     ; bool
 21   JZ t5, L3
 22   t9 = WMIN_GET &dqmin_low_20, $low ; price
 23   t7 = COPY t9                     ; price
 24   JMP L4
 25 L3:
 26   t7 = CONST 0.0                   ; price
 27 L4:
 28   SPUSH $dn, t7
 29   t10 = EMA &ema_close_50          ; price
 30   SPUSH $trend, t10
 31   t11 = BARS_GT 20                 ; bool
 32   JZ t11, L5
 33   t12 = SLOAD @armed               ; bool
 34   JZ t12, L6
 35   t14 = COPY t3                    ; price
 36   t15 = HIST $up, 1                ; price
 37   t16 = GT t3, t15                 ; bool
 38   t13 = COPY t16                   ; bool
 39   JMP L7
 40 L6:
 41   t13 = CONST 0.0                  ; bool
 42 L7:
 43   JZ t13, L8
 44   t18 = COPY t3                    ; price
 45   t19 = COPY t10                   ; price
 46   t20 = GT t3, t10                 ; bool
 47   t17 = COPY t20                   ; bool
 48   JMP L9
 49 L8:
 50   t17 = CONST 0.0                  ; bool
 51 L9:
 52   JZ t17, L10
 53   t22 = SLOAD @pos                 ; volume
 54   t24 = EQ t22, 0.0                ; bool
 55   t21 = COPY t24                   ; bool
 56   JMP L11
 57 L10:
 58   t21 = CONST 0.0                  ; bool
 59 L11:
 60   JZ t21, L12
 61   BUY 30.0
 62   SSTORE @pos, 30.0
 63   SSTORE @armed, 0.0
 64 L12:
 65   t28 = COPY t3                    ; price
 66   t29 = HIST $dn, 1                ; price
 67   t30 = GT t3, t29                 ; bool
 68   t31 = LE t3, t29                 ; bool
 69   JNZ t31, L13
 70   t33 = COPY t3                    ; price
 71   t34 = COPY t10                   ; price
 72   t35 = SUB t3, t10                ; price
 73   t36 = ABS t35                    ; price
 74   t38 = GT t36, 15.0               ; bool
 75   t32 = COPY t38                   ; bool
 76   JMP L14
 77 L13:
 78   t32 = CONST 1.0                  ; bool
 79 L14:
 80   JZ t32, L15
 81   t39 = SLOAD @pos                 ; volume
 82   t41 = GT t39, 0.0                ; bool
 83   JZ t41, L16
 84   FLATTEN
 85   SSTORE @pos, 0.0
 86 L16:
 87   SSTORE @armed, 1.0
 88 L15:
 89   t44 = WMAX_GET &dqmax_close_5, $close ; price
 90   t45 = WMIN_GET &dqmin_close_10, $close ; price
 91   t46 = LT t44, t45                ; bool
 92   JZ t46, L17
 93   SSTORE @armed, 0.0
 94 L17:
 95 L5:
== after dce#2: 80 -> 72 instructions, 8 rewritten, data-flow sweeps <= 2 ==
func on_open:
  0   TICK
func on_close:
  0   t1 = LOADFIELD high              ; price
  1   SPUSH $high, t1
  2   WMAX_UPD &dqmax_high_20, $high, 20
  3   t2 = LOADFIELD low               ; price
  4   SPUSH $low, t2
  5   WMIN_UPD &dqmin_low_20, $low, 20
  6   t3 = LOADFIELD close             ; price
  7   SPUSH $close, t3
  8   WMAX_UPD &dqmax_close_5, $close, 5
  9   WMIN_UPD &dqmin_close_10, $close, 10
 10   EMA_UPD &ema_close_50, $close, 50, warm=0
 11   t5 = BARS_GT 19                  ; bool
 12   JZ t5, L1
 13   t6 = WMAX_GET &dqmax_high_20, $high ; price
 14   t4 = COPY t6                     ; price
 15   JMP L2
 16 L1:
 17   t4 = CONST 0.0                   ; price
 18 L2:
 19   SPUSH $up, t4
 20   JZ t5, L3
 21   t9 = WMIN_GET &dqmin_low_20, $low ; price
 22   t7 = COPY t9                     ; price
 23   JMP L4
 24 L3:
 25   t7 = CONST 0.0                   ; price
 26 L4:
 27   SPUSH $dn, t7
 28   t10 = EMA &ema_close_50          ; price
 29   SPUSH $trend, t10
 30   t11 = BARS_GT 20                 ; bool
 31   JZ t11, L5
 32   t12 = SLOAD @armed               ; bool
 33   JZ t12, L6
 34   t15 = HIST $up, 1                ; price
 35   t16 = GT t3, t15                 ; bool
 36   t13 = COPY t16                   ; bool
 37   JMP L7
 38 L6:
 39   t13 = CONST 0.0                  ; bool
 40 L7:
 41   JZ t13, L8
 42   t20 = GT t3, t10                 ; bool
 43   t17 = COPY t20                   ; bool
 44   JMP L9
 45 L8:
 46   t17 = CONST 0.0                  ; bool
 47 L9:
 48   JZ t17, L10
 49   t22 = SLOAD @pos                 ; volume
 50   t24 = EQ t22, 0.0                ; bool
 51   t21 = COPY t24                   ; bool
 52   JMP L11
 53 L10:
 54   t21 = CONST 0.0                  ; bool
 55 L11:
 56   JZ t21, L12
 57   BUY 30.0
 58   SSTORE @pos, 30.0
 59   SSTORE @armed, 0.0
 60 L12:
 61   t29 = HIST $dn, 1                ; price
 62   t31 = LE t3, t29                 ; bool
 63   JNZ t31, L13
 64   t35 = SUB t3, t10                ; price
 65   t36 = ABS t35                    ; price
 66   t38 = GT t36, 15.0               ; bool
 67   t32 = COPY t38                   ; bool
 68   JMP L14
 69 L13:
 70   t32 = CONST 1.0                  ; bool
 71 L14:
 72   JZ t32, L15
 73   t39 = SLOAD @pos                 ; volume
 74   t41 = GT t39, 0.0                ; bool
 75   JZ t41, L16
 76   FLATTEN
 77   SSTORE @pos, 0.0
 78 L16:
 79   SSTORE @armed, 1.0
 80 L15:
 81   t44 = WMAX_GET &dqmax_close_5, $close ; price
 82   t45 = WMIN_GET &dqmin_close_10, $close ; price
 83   t46 = LT t44, t45                ; bool
 84   JZ t46, L17
 85   SSTORE @armed, 0.0
 86 L17:
 87 L5:
== final TAC (72 instructions) ==
func on_open:
  0   TICK
func on_close:
  0   t1 = LOADFIELD high              ; price
  1   SPUSH $high, t1
  2   WMAX_UPD &dqmax_high_20, $high, 20
  3   t2 = LOADFIELD low               ; price
  4   SPUSH $low, t2
  5   WMIN_UPD &dqmin_low_20, $low, 20
  6   t3 = LOADFIELD close             ; price
  7   SPUSH $close, t3
  8   WMAX_UPD &dqmax_close_5, $close, 5
  9   WMIN_UPD &dqmin_close_10, $close, 10
 10   EMA_UPD &ema_close_50, $close, 50, warm=0
 11   t5 = BARS_GT 19                  ; bool
 12   JZ t5, L1
 13   t6 = WMAX_GET &dqmax_high_20, $high ; price
 14   t4 = COPY t6                     ; price
 15   JMP L2
 16 L1:
 17   t4 = CONST 0.0                   ; price
 18 L2:
 19   SPUSH $up, t4
 20   JZ t5, L3
 21   t9 = WMIN_GET &dqmin_low_20, $low ; price
 22   t7 = COPY t9                     ; price
 23   JMP L4
 24 L3:
 25   t7 = CONST 0.0                   ; price
 26 L4:
 27   SPUSH $dn, t7
 28   t10 = EMA &ema_close_50          ; price
 29   SPUSH $trend, t10
 30   t11 = BARS_GT 20                 ; bool
 31   JZ t11, L5
 32   t12 = SLOAD @armed               ; bool
 33   JZ t12, L6
 34   t15 = HIST $up, 1                ; price
 35   t16 = GT t3, t15                 ; bool
 36   t13 = COPY t16                   ; bool
 37   JMP L7
 38 L6:
 39   t13 = CONST 0.0                  ; bool
 40 L7:
 41   JZ t13, L8
 42   t20 = GT t3, t10                 ; bool
 43   t17 = COPY t20                   ; bool
 44   JMP L9
 45 L8:
 46   t17 = CONST 0.0                  ; bool
 47 L9:
 48   JZ t17, L10
 49   t22 = SLOAD @pos                 ; volume
 50   t24 = EQ t22, 0.0                ; bool
 51   t21 = COPY t24                   ; bool
 52   JMP L11
 53 L10:
 54   t21 = CONST 0.0                  ; bool
 55 L11:
 56   JZ t21, L12
 57   BUY 30.0
 58   SSTORE @pos, 30.0
 59   SSTORE @armed, 0.0
 60 L12:
 61   t29 = HIST $dn, 1                ; price
 62   t31 = LE t3, t29                 ; bool
 63   JNZ t31, L13
 64   t35 = SUB t3, t10                ; price
 65   t36 = ABS t35                    ; price
 66   t38 = GT t36, 15.0               ; bool
 67   t32 = COPY t38                   ; bool
 68   JMP L14
 69 L13:
 70   t32 = CONST 1.0                  ; bool
 71 L14:
 72   JZ t32, L15
 73   t39 = SLOAD @pos                 ; volume
 74   t41 = GT t39, 0.0                ; bool
 75   JZ t41, L16
 76   FLATTEN
 77   SSTORE @pos, 0.0
 78 L16:
 79   SSTORE @armed, 1.0
 80 L15:
 81   t44 = WMAX_GET &dqmax_close_5, $close ; price
 82   t45 = WMIN_GET &dqmin_close_10, $close ; price
 83   t46 = LT t44, t45                ; bool
 84   JZ t46, L17
 85   SSTORE @armed, 0.0
 86 L17:
 87 L5:
